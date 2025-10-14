// Next Imports


// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports


// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Vuexy - MUI Next.js Admin Dashboard Template',
  description:
    'Vuexy - MUI Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
}

const RootLayout = ({ children }: ChildrenType ) => {


  return (
      <html id='__next'  >
        <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
      </html>
  )
}

export default RootLayout
