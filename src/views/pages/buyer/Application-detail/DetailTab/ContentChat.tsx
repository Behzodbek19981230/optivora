import { Avatar, Badge, Box, Button, Typography, useTheme } from '@mui/material'
import React from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'

export default function ContentChat() {
  const theme = useTheme()
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>
        <Badge
          overlap='circular'
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          badgeContent={
            <Box
              component='span'
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                color: `red`,
                backgroundColor: `red`,
                boxShadow: theme => `0 0 0 2px ${theme.palette.background.default}`
              }}
            />
          }
        >
          <CustomAvatar
            skin='light'
            sx={{ width: 50, height: 50, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
          >
            {getInitials('BR')}
          </CustomAvatar>
        </Badge>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>Фамилия Имя Отчество</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 400, color: theme.palette.grey[400] }}>00-00-0000 00:00</Typography>
        <CustomChip
          rounded
          skin='light'
          size='small'
          label='Уведомлен'
          color='success'
          // sx={{ textTransform: 'capitalize' }}
        />
        <Typography sx={{ fontSize: 15, fontWeight: 400, color: theme.palette.grey[300] }}>
          If it takes long you can mail...
        </Typography>
        <Button variant='outlined' color='error' size='small' sx={{ width: 100 }}>
          Удалить
        </Button>
      </Box>
    </Box>
  )
}
