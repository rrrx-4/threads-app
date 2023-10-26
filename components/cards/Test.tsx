'use client'

import React from 'react'
import { Button } from '../ui/button'


interface Props {
    id?: string
    parentId?: string | null,
    content?: string,
    currentUserId?: string,

    author?: {
        name: string,
        image: string,
        id: string
    },
    community?: {
        id: string,
        name: string,
        image: string
    } | null,
    createdAt?: string,
    comments?: {
        author:{
            image: string
        }
    }[],
    isComment? :boolean,
    handleLikeClick?: ()=>void,
    t?: string
}

const Test = ({id,parentId, content, currentUserId, author, community,createdAt, comments, isComment ,t  }: Props) => {
  return (
    <div>
        <Button className='head-text' onClick={()=>console.log("fffff")
        }></Button>
    </div>

  )
}

export default Test