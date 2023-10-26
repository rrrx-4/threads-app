import ThreadCard from '@/components/cards/ThreadCard'
import Comment from '@/components/forms/Comment';
import { fetchThreadById } from '@/lib/actions/thread.action';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const page = async ({params} : {params : {id : string}}) => {

    if(!params.id) return null;

    const user = await currentUser()
    if(!user) return null;

    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect('/onboarding')


    const thread = await fetchThreadById(params.id)


    console.log("-----Thread-----", thread);
    



      let community = {}
            // let author = {}
            if(thread.community){
            const {id , name , image} = thread.community

             community = {
              id, name, image
            }}

            const {name, image, id} = thread.author
           const author = {
            name, image, id
           }

           let isComment = false;
           let comments = []
           if(thread.children.length > 0)
           {
              isComment = true;
            comments = thread.children.map((child : any)=>{
              const author = child.author;

              return author?.image
            })
              
           }


    console.log("community", community);
    

  return (
    <section className='relative'>
        <div>
          <h1>Single Thread</h1>
         <ThreadCard
          key={thread._id} id={thread._id}   content={thread.text} author={author} community={thread.community && community} createdAt = {thread.createdAt} comments={comments} currentUserId={user?.id || ""} likes={thread.likes}
         ></ThreadCard> 
        </div>


        <div className='mt-7' >
            <Comment threadId={params.id} currentUserImg={user.imageUrl} currentUserId={JSON.stringify(userInfo._id)} ></Comment>
        </div>

     <div className='mt-10'>
          {
            thread.children.map((childItem : any)=>{

              
      let community = {}
            // let author = {}
            if(childItem.community){
            const {id , name , image} = childItem?.community

             community = {
              id, name, image
            }}

            const {name, image, id} = childItem.author
           const author = {
            name, image, id
           }

           let isComment = false;
           let comments = []
           if(childItem.children.length > 0)
           {
              isComment = true;
            comments = childItem.children.map((child : any)=>{
              const author = child.author;

              return author?.image
            })
              
           }

              return (
                 <ThreadCard
          key={childItem._id} id={childItem._id}  parentId={childItem.parentId} content={childItem.text} author={author} community={childItem.community} createdAt = {childItem.createdAt} comments={comments} currentUserId={childItem?.id || ""} likes={childItem.likes}
          isComment
         ></ThreadCard>
              )

            })
          }
        </div>

    </section>
  )
}

export default page