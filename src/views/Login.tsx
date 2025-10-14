'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// Component Imports
import Logo from '@components/layout/shared/Logo'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Type Imports
import { useAuth } from '@/contexts/auth/AuthContext'

const Login = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please enter email and password')

      return
    }

    const ok = await login(email, password)

    if (!ok) {
      setError('Login failed')

      return
    }

    router.replace(`/dashboard`)
  }

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' minHeight='100dvh' px={4}>
      <Box mb={6}>
        <Logo />
      </Box>
      <Typography variant='h4' mb={1}>{`Welcome to ${themeConfig.templateName}`}</Typography>
      <Typography mb={4}>Please sign in to continue</Typography>
      <Box
        component='form'
        onSubmit={handleSubmit}
        width='100%'
        maxWidth={400}
        display='flex'
        flexDirection='column'
        gap={3}
      >
        <TextField
          label='Email'
          type='email'
          fullWidth
          value={email}
          onChange={e => { setEmail(e.target.value); error && setError(null) }}
          required
        />
        <TextField
          label='Password'
          type='password'
          fullWidth
          value={password}
          onChange={e => { setPassword(e.target.value); error && setError(null) }}
          required
        />
        {error && <Typography color='error'>{error}</Typography>}
        <Button variant='contained' type='submit' fullWidth>
          Login
        </Button>
      </Box>
    </Box>
  )
}

export default Login
