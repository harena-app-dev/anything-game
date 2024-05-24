export const metadata = {
  title: 'Home - Open PRO',
  description: 'Page description',
}

import Hero from '@/components/old/hero'
import Features from '@/components/old/features'
import Newsletter from '@/components/old/newsletter'
import Zigzag from '@/components/old/zigzag'
import Testimonials from '@/components/old/testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Zigzag />
      <Testimonials />
      <Newsletter />
    </>
  )
}
