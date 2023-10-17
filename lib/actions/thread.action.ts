'use server'

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { FilterQuery, SortOrder } from "mongoose";


interface Params {

    text:string,
    author: string,
    communityId : string | null,
    path: string

}                                                                                                        

export async function createThread({text, author, communityId, path}:Params) {


    try {
         connectToDB()

    const createdThread = await Thread.create({
        text,author, community:null
    });

    //update user model

    await User.findByIdAndUpdate(author, {
        $push : {threads : createdThread._id}
    })
    

    revalidatePath(path)
    } catch (error : any ) {
        
        throw new Error(`create thread error ${error.message}`)

    }

   
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {

    connectToDB()

    const skipAmount = (pageNumber -1) * pageSize

    const postQuery =  Thread.find({parentId: {$in : [null, undefined]}}).sort({createdAt: 'desc'}).skip(skipAmount).limit(pageSize).populate({path: 'author', model: User}).populate({
        path: 'children',
        populate: {
            path : 'author',
            model: User,
            select: "_id name parentId image"
        }
    })

    const totalPostsCount = await Thread.countDocuments({parentId: {$in : [null, undefined]}})

    const posts = await postQuery.exec()

    const isNext = totalPostsCount > skipAmount + posts.length

    return { posts, isNext}

}

export async function fetchThreadById(id: string){

    connectToDB();

    try {
        
        const thread = await Thread.findById(id).populate({
            path: 'author',
            model: User,
            select: "_id id name image"
        }).populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"
                },
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec()

        return thread

    } catch (error: any) {
        throw new Error(`thread error: ${error.message}`)
    }

}


export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
    connectToDB()


    // console.log("Userid", userId);
    

    try {

        //finde the original thread by its ID
        const originalThread = await Thread.findById(threadId);

        if(!originalThread){
            throw new Error("Thread not found")
        }


        //create a new Thread

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })
        
        
        

        const savedCommentThread = await commentThread.save()
console.log("xxxxxxxxx-----");
        // update parent thread by including the new comment

        originalThread.children.push(savedCommentThread._id);

        //save

        await originalThread.save()

        revalidatePath(path)

    } catch (error: any) {
        
        throw new Error(`Error adding comment to thread: ${error.message}`)
        // console.log("add comment error");
        

    }
}


export async function fetchUserPosts(userId: string) {

    connectToDB()

    try {
        
        const threads = await User.findOne({id : userId}).populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id'
                }
            }
        })

        return threads

    } catch (error) {
        
        throw new Error('Failed to fetch user posts')

    }

}


export async function fetchUsers({
    userId, searchString="", pageNumber= 1, pageSize = 20, sortBy="desc"
} : {userId : string, searchString?: string, pageNumber?: number, pageSize?: number, sortBy?: SortOrder} ) {

    try {
        
        connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i");

        const query : FilterQuery<typeof User> = {
            id : {$ne: userId}
        }

        if(searchString.trim() !== ''){
            query.$or = [
                {username: {$regex: regex}},
                {name: {$regex: regex}}
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize)

        const totalUsersCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totalUsersCount > skipAmount + users.length

        return { users, isNext }


    } catch (error : any) {
        
        throw new Error(`Failed to fetch users: ${error.message}`)

    }

}