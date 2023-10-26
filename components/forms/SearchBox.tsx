'use client'
import UserCard from "@/components/cards/UserCard"
import { fetchUsers, searchUsers } from "@/lib/actions/user.action"
import { fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {Input} from '@/components/ui/input'
import z from "zod"
import { Button } from '../ui/button';
import { SearchValidation } from "@/lib/validations/thread"
import { useState } from "react"


  function SearchBox( {userId}: {userId : string}) {


    const [users, setUsers] = useState<any[]>()

    const form = useForm({
        resolver: zodResolver(SearchValidation),
        defaultValues: {
            search: '',
            
        }
    })

   



    // setUsers(result);

    const onSubmit = async (values : z.infer<typeof SearchValidation>)=>{

        if(values.search.length >= 1){
 console.log('ggg');
            const users = await searchUsers(userId.toString(), values.search)

            setUsers(users)

        }
          else{
         
          
          setUsers([])}
        
        
      
 

    }

    


  return (
    <>
      <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
         <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className='flex items-center gap-3 w-full'>
              <FormLabel  >
              
              </FormLabel>
              <FormControl className=' bg-transparent' >
                <Input  type='text' placeholder='Search...' className='no-focus text-light-1 outline-none'   {...field}  />
              </FormControl>
           
            </FormItem>
          )}
        />
          <Button className='comment-form_btn' type="submit">Search</Button>
      </form>
    </Form>

    <div className="mt-14 flex flex-col gap-9" >
        {
         users &&  users.length === 0 ? (
            <p className="no-result" >No users</p>
          ) :(
            <>
            {
              users?.map((person : any)=>(
                <UserCard key={person.id} id={person.id} name={person.name} username={person.username} imgUrl={person.image} personType='User' ></UserCard>
              ))
            }
            </>
          )
        }
      </div>
    
    </>
    )

    }

    export default SearchBox