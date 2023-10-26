
import Test from "@/components/cards/Test";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from '@clerk/nextjs'
import { redirect } from "next/navigation";
 
 const Page = async ()=> {
const user = await currentUser()


// if(!user) redirect('/onboarding')

  const result = await fetchPosts(1, 30)
  
  // console.log("resultdfffdsfs ", result);
  
 

  return (
   <>
   <h1 className="head-text text-left" > Home</h1>

    
   <section className="mt-9 flex flex-col gap-10" >
    {
      result.posts.length === 0 ? (
       <p className="no-result" >No threads found</p>
      ) : (
        <>
        {
          result.posts.map((post)=>{

            // console.log("----Post----", post)
            let community = {}
            // let author = {}
            if(post.community){
            const {id , name , image} = post?.community

             community = {
              id, name, image
            }}

            const {name, image, id} = post.author
           const author = {
            name, image, id
           }

           let isComment = false;
           let comments = []
           if(post.children.length > 0)
           {
              isComment = true;
            comments = post.children.map((child : any)=>{
              const author = child.author;

              return author?.image
            })
              
           }

           const arr = []

return  <ThreadCard key={post?._id} content={post.text} id={post._id.toString()} createdAt = {post.createdAt} community={post.community && community}  author={author} isComment={false} comments={comments} currentUserId={user? user.id : ""} likes ={post.likes} ></ThreadCard>

{/* <Test t="ggggg" key={post?._id} content={post.text} id={post._id.toString()} createdAt = {post.createdAt} community={post.community && community}  author={author} isComment={isComment} comments={comments}></Test> */}

            // <ThreadCard key={post?._id} content={post.text} id={post._id.toString()} createdAt = {post.createdAt} community={post.community && community}  author={author} isComment={isComment} comments={comments}  ></ThreadCard>
          }
          )
        }
        </>
      )
    }
   </section>
   </>
  )
}

export default Page