
import { redirect } from 'next/navigation'

import React from 'react'
import ThreadCard from '../cards/ThreadCard'
import { fetchCommunityPosts } from '@/lib/actions/community.actions'
import { fetchUserPosts } from '@/lib/actions/user.action'

interface Props {
    currentUserId : string,
    accountId : string,
    accountType : string
}

const ThreadsTab = async ({currentUserId, accountId, accountType} : Props) => {

  let result : any;

  if(accountType === 'Community'){
    result = await fetchCommunityPosts(accountId)

    console.log("com result", result[0].threads);
    

  }else{
    result = await fetchUserPosts(accountId)
  }

    if(!result) redirect('/')


   


    // console.log("rddd---", result);
    

  return (
    <section className='mt-9 flex flex-col gap-10' >
        {
        result?.threads?.map((thread: any)=>{

           let community = {}
            // let author = {}
            if(result.community){
            const {id , name , image} = result?.community

             community = {
              id, name, image
            }}

            

           let isComment = false;
          //  let comments = []
           if(result.children && result.children.length > 0)
           {
              isComment = true;
           var comments = result.children.map((child : any)=>{
              const author = child.author;

              return author?.image
            })
              
           }



         return <ThreadCard key={thread._id} 
                id={thread._id} 
                parentId={thread.parentId}
                currentUserId={currentUserId} 
                content={thread.text} 
                community={thread.community && community} 
                createdAt={thread.createdAt}
                likes={thread.likes} 
                comments={comments || []}
                author={accountType === 'User' ? {name: result.name, image: result.image , id: result.id} : {name : thread.author.name, image: thread.author.image, id: thread.author.id }} ></ThreadCard>
        })
        }
    </section>
  )
}

export default ThreadsTab