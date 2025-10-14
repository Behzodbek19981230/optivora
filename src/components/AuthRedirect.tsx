'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Type Imports

// Config Imports

// Util Imports

const AuthRedirect = () => {
  const pathname = usePathname()

  // ℹ️ Bring me `lang`
  const redirectUrl = `/login?redirectTo=${pathname}`
  const login = `/login`

  return redirect(pathname === login ? login : pathname === '/' ? login : redirectUrl)
}

export default AuthRedirect
