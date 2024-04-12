import CallList from '@/components/CallList'
import React from 'react'

const Prvious = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white pt-5'>
      <h1 className='text-3xl font-bold'>
        Previous
      </h1>

      <CallList type="ended"/>
    </section>
  )
}

export default Prvious