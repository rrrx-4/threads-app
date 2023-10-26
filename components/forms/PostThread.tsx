'use client'

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

import {Textarea} from '@/components/ui/textarea'
import z from "zod"
import { Button } from '../ui/button';
import { useOrganization } from '@clerk/nextjs';


import {usePathname, useRouter} from 'next/navigation'
import { ThreadValidation } from '@/lib/validations/thread';
import { createThread } from '@/lib/actions/thread.action';
// import { updateUser } from '@/lib/actions/user.action';
// import { UserValidation } from '@/lib/validations/user';


// import router from 'next/router';
// type btnTitleProps= {
//     btnTitle: string
// }

// type userProps = {
//     id : string;
//     objectId : string;
//     username: string,
//     name : string,
//     bio: string,
//     image: string
// }


interface props {
    user : {
    id : string;
    objectId : string;
    username: string,
    name : string,
    bio: string,
    image: string
    },
    btnTitle: string
}




   

const PostThread = ({userId} : {userId : string}) => {

  
    const pathname = usePathname()
    const router = useRouter()

    const {organization} = useOrganization()

    // console.log(btnTitle, );
    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId,
        }
    })

    const onSubmit = async (values : z.infer<typeof ThreadValidation>)=>{

     await createThread({
        text: values.thread,
        author: userId,
        communityId : organization ? organization.id : null,
        path : pathname
      })

     

      router.push("/")

    }


  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
         <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className='flex flex-col gap-3 w-full'>
              <FormLabel className='text-base-semibold text-light-2' >Content</FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1' >
                <Textarea  rows={15}   {...field}  />
              </FormControl>
            <FormMessage/>
            </FormItem>
          )}
        />
          <Button className='bg-primary-500' type="submit">Post thread</Button>
      </form>
    </Form>
  )
}

export default PostThread