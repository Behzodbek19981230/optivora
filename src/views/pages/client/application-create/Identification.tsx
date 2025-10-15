import { Grid, styled, Box, Button, Container } from '@mui/material'
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'
import MuiInputLabel, { InputLabelProps } from '@mui/material/InputLabel'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import Translations from 'src/layouts/components/Translations'
const InputLabel = styled(MuiInputLabel)<InputLabelProps>(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))
type CheckResult = () => void

export default function Identification({ checkResult }: { checkResult: CheckResult }) {
  const router = useRouter()
  const handleStep = () => {
    router.push('/application/create-steps/scoring/')
  }
  return (
    <CleaveWrapper>
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <Button variant='contained' onClick={checkResult}>
          <Translations text='Check' />
        </Button>
      </Container>
    </CleaveWrapper>
  )
}
