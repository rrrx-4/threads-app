import * as z from 'zod'

export const ThreadValidation = z.object({
    thread: z.string().nonempty().min(3, {message: 'Minimum 3 characters'}),
   accountId: z.string(),
})

export const CommentValidation = z.object({
    thread: z.string().nonempty().min(3, {message: 'Minimum 3 characters'}),
   
})

export const SearchValidation = z.object({
    search: z.string().nonempty().min(0, {message: 'Minimum 3 characters'}),
   
})