import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Topbar from '@/components/shared/Topbar'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {

    title: 'Threads',
    description: 'A Next.js 13 Meta Threads Application'

}

const  RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <Topbar></Topbar>  
        <main className='flex flex-row' >
          <LeftSidebar></LeftSidebar>

          <section className='main-container' >
            <div className='w-full max-w-4xl' >
              {children}
            </div>
          </section>
          <RightSidebar></RightSidebar>
        </main>
        <Bottombar></Bottombar>

      
      </body>
    </html>
    </ClerkProvider>
  )
}

export default   RootLayout