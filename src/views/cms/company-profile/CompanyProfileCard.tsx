import { useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import { CompanyProfile } from 'src/types/company-profile'

interface Props {
  profile: CompanyProfile
  onEdit: () => void
  onDelete: () => void
}

const CompanyProfileCard = ({ profile, onEdit, onDelete }: Props) => {
  return (
    <Card >
      <CardHeader
        avatar={<Avatar src={profile.logo} sx={{ width: 56, height: 56 }} />}
        title={<Typography variant='h5'>{profile.name_uz || profile.name}</Typography>}
        subheader={profile.title_uz || profile.title}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant='subtitle2' color='text.secondary'>Email</Typography>
            <Typography>{profile.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='subtitle2' color='text.secondary'>Telefon</Typography>
            <Typography>{profile.phone}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='subtitle2' color='text.secondary'>Manzil</Typography>
            <Typography>{profile.address}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant='subtitle2' color='text.secondary'>Ish vaqti</Typography>
            <Typography>{profile.business_hours}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='subtitle2' color='text.secondary'>Tavsif</Typography>
            <Typography>{profile.description_uz || profile.description}</Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button variant='outlined' color='primary' onClick={onEdit}>Tahrirlash</Button>
        <Button variant='outlined' color='error' onClick={onDelete}>O‘chirish</Button>
      </CardActions>
    </Card>
  )
}

export default CompanyProfileCard
