import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';

type HomeLayoutProps = {
  children: React.ReactNode
};

export const metadata: Metadata = {
  title: "Yoom",
  description: "Video calling app",
  icons: {
    icon: "/icons/logo.svg"
  }
};

const HomeLayout = ({children}: HomeLayoutProps) => {
  return (
    <main>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <section className='flex mt-[72px] min-h-screen flex-1 flex-col px-6 pb-6 pt-26 max-md:pb-14 sm:px-14'>
          <div className='w-full'>
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

export default HomeLayout;