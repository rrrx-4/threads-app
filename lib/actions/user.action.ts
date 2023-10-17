"use server"

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"

interface props {
    userId : string,
    username : string,
    name : string,
    bio: string,
    path: string,
    image : string 

}



export async function updateUser({userId, username, name, bio, image, path} : props): Promise<void> {
    connectToDB()

    try {
        
        await User.findOneAndUpdate({
        id: userId}, {
            username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded : true,
        }, {upsert: true} )

        if(path === '/profile/edit') {
            revalidatePath(path)
        }

    } catch (error : any) {
        
        throw new Error(`Failed to create/update user : ${error.message}`)
    }

    
}


export async function fetchUser(userId:string) {
    
    try {
        
        connectToDB()

        return await User.findOne({id: userId})
        // .populate({
        //     path: 'communities',
        //     model: Community
        // })

    } catch (error : any) {
        
        throw new Error(`Failed to fetch user : ${error.message}`)

    }

}

export async function getActivity(userId:string) {
    
    try {
        
        connectToDB()

        const userThreads = await Thread.find({author: userId})

        // Collect all the child thread ids from the children field

        const childThreadIds = userThreads.reduce((acc, userThreads)=>{
            return acc.concat(userThreads.children)
        }, [])

        const replies = await Thread.find({
            _id: {$in:childThreadIds},
            author: {$ne: userId}
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;

    } catch (error: any) {
        
        throw new Error(`Getting error while fetching activity ${error.message}`)

    }

}