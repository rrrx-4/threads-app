import React from 'react'
import { currentUser } from "@clerk/nextjs" 
import { suggestdCommunity, suggestedUser } from '@/lib/actions/user.action'
import UserCard from '../cards/UserCard'

const RightSidebar = async () => {

     const user = await currentUser()

     if(!user) return null

    //  console.log("User--", user?.id);

   const users =  await suggestedUser(user.id);


   const communities = await suggestdCommunity(user.id);

     


    return (
        <section className='custom-scrollbar rightsidebar' >
            <div className='flex flex-1 flex-col justify-start' >
                <h3 className='text-heading4-medium text-light-1' >Suggested Communities</h3>
                <div className='mt-5'>
                {
                    communities.length > 0 && communities.map((community)=>{
                         const {id, username, name, image} = community ;

                        return (
                            <UserCard key={id} id={id} username={username} name={name} imgUrl={image}></UserCard>
                         )
                    })
                }</div>
            </div>
            <div className='flex flex-1 flex-col justify-start' >
                <h3 className='text-heading4-medium text-light-1' >Suggested Users</h3>
                <div className='mt-5'>
                {
                    users.length > 0 && users.map((user)=>{

                        const {id, username, name, image} = user ;

                        return (
                            <UserCard key={id} id={id} username={username} name={name} imgUrl={image}></UserCard>
                         )

                    })
                }</div>
            </div>
        </section>
    )
}

export default RightSidebar