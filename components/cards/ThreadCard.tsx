'use client'

import { LikePost } from '@/lib/actions/thread.action'
import { formatDateString } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { redirect, useRouter } from "next/navigation"

interface Props {
    id: string
    parentId?: string | null,
    content: string,
    currentUserId?: string,

    author: {
        name: string,
        image: string,
        id: string
    },
    community: {
        id: string;
        name: string;
        image: string;
    }  | null,
    createdAt: string,
    comments: {
        author:{
            image: string
        }
    }[] | [],
    likes: [string],
    isComment? :boolean,
    handleLikeClick?: ()=>void
}
const ThreadCard = ({id,parentId, content, currentUserId, author, community,createdAt, comments, isComment, likes   }: Props) => {
  const router = useRouter()
    console.log("currentUserId", currentUserId);
    let isLike = false
    if(likes.length > 0)
    {
        if( currentUserId && likes.includes(currentUserId))
        {
            isLike = true;
        }
    }

  

    const handleClick = async ()=>{


        if(!currentUserId){
            return null;
        }

        await LikePost({userId: currentUserId || "", postId: id});

            router.refresh()

        console.log("ADJFRUC...");
        
    }

    const dateString = formatDateString(createdAt)

  return (
    <article className={`flex w-full flex-col rounded-xl  ${isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p-7'}`} > 
    <div className='flex items-start justify-between' >
        <div className='flex w-full flex-1 flex-row gap-4'>
            <div className='flex flex-col items-center'>
                <Link href={`/profile/${author.id}`} className='relative h-11 w-11' >
                    <Image src={author.image} alt="Profile image" fill className='cursor-pointer rounded-full' />
                </Link>
                <div className='thread-card_bar'></div>
            </div>
            <div className='flex w-full flex-col'>
                <Link  href={`/profile/${author.id}`} className='w-fit' >
                    <h4 className='cursor-pointer text-base-semibold text-light-1'>
                        {author.name}
                    </h4>
                </Link>
                <p className='mt-2 text-small-regular text-light-2' >{content}</p>
                <div className={` ${isComment && 'mb-10'} mt-5 flex flex-col gap-3`} >
                    <div className='flex gap-3.5'>
                        <p className='text-small-regular text-light-2' >{likes.length> 0 && likes.length}</p>
                      <button onClick={handleClick}>
                      {
                        isLike ? <Image src="/assets/heart-filled.svg" alt="heart" width={24} height={24} className='cursor-pointer object-contain'/> :<Image src="/assets/heart-gray.svg" alt="heart" width={24} height={24} className='cursor-pointer object-contain'/>
                      }</button>
                        
                        <Link href={`/thread/${id}`}>
                        <Image src="/assets/reply.svg" alt="reply" width={24} height={24} className='cursor-pointer object-contain'/></Link>
                        <Image src="/assets/repost.svg" alt="repost" width={24} height={24} className='cursor-pointer object-contain'/>
                        <Image src="/assets/share.svg" alt="share" width={24} height={24} className='cursor-pointer object-contain'/>
                    </div>
                    {isComment && comments.length > 0 && (
                        <Link href={`/thread/${id}`}>
                            <p className='mt-1 text-subtle-medium text-gray-1' >{comments.length} replies</p>
                        </Link>
                    ) }
                </div>
            </div>
        </div>

        {/* TODO: DeleteThread */}
        {/* TODO: Show comment logos */}

       

    </div>
        {
            !isComment && community && (
                <Link href={`/communities/${community.id}`} className='mt-5 flex items-center'>
                    <p className='text-subtle-medium text-gray-1'>
                        {dateString} - {community.name} Community
                    </p>
                    <Image 
                        src={community.image}
                        alt={community.name}
                        width={14}
                        height={14}
                        className='ml-1 rounded-full object-cover'
                    />
                </Link>
            )
        }
{
    !isComment && <div>
            <p className='mt-1 text-subtle-medium text-gray-1' >{comments.length > 0 && `${comments.length} replies` }</p>
        </div>

}
    </article>
  )
}

export default ThreadCard