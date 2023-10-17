import { fetchUserPosts } from '@/lib/actions/thread.action'
import { redirect } from 'next/navigation'

import React from 'react'
import ThreadCard from '../cards/ThreadCard'

interface Props {
    currentUserId : string,
    accountId : string,
    accountType : string
}

const ThreadsTab = async ({currentUserId, accountId, accountType} : Props) => {

    let result = await fetchUserPosts(accountId)

    if(!result) redirect('/')

    // console.log("rddd---", result);
    

  return (
    <section className='mt-9 flex flex-col gap-10' >
        {
        result.threads.map((thread: any)=>(
               <ThreadCard key={thread._id} 
                id={thread._id} 
                parentId={thread.parentId}
                currentUserId={currentUserId} 
                content={thread.text} 
                community={thread.community} 
                createdAt={thread.createdAt} 
                comments={thread.children}
                author={accountType === 'User' ? {name: result.name, image: result.image , id: result.id} : {name : thread.author.name, image: thread.author.image, id: thread.author.id }} ></ThreadCard>
            ))
        }
    </section>
  )
}

export default ThreadsTab