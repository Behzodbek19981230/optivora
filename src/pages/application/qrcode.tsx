import { Box, Grid, Card, CardContent, Typography, Button, Stack } from '@mui/material'
import QRcode from 'src/@core/components/qr-code/QRcode'
import { useRouter } from 'next/router'
import { TextField } from '@mui/material'
import { ChangeEvent, useState } from 'react'
export default function QRcodePage() {
  const router = useRouter()

  interface props {
    updateValue: (e: string) => void
    type?: string
    fullWidth?: boolean
    placeholder?: string
    defaultValue?: string | number
  }

  const UIInput: React.FC<props> = ({ updateValue, type = 'text', fullWidth = true, placeholder, defaultValue }) => {
    const [value, setValue] = useState<string | number>(defaultValue || '')

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      updateValue(e.target.value)
    }
    return (
      <TextField
        type={type}
        required
        placeholder={placeholder}
        id='outlined-basic'
        variant='outlined'
        onChange={handleInput}
        value={value}
        size='small'
        sx={{
          width: fullWidth ? '100%' : '80px',
          minWidth: '80px'
        }}
        fullWidth={fullWidth}
      />
    )
  }
  const [attributes, setAttributes] = useState<{ id: number; value: string }[]>([{ id: 0, value: '' }])
  const deleteAttribute = (id: number) => {
    const arr = [...attributes]
    arr.splice(id, 1)
    setAttributes(arr)
    console.log(arr, attributes, id)
  }

  return <Card sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}></Card>
}
