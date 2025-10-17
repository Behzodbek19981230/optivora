import UserTable from 'src/views/cms/users/UserTable'
import { Container, Box } from '@mui/material'

const UsersPage = () => {
  return (
    <Container maxWidth='lg' sx={{ mt: 6 }}>
      <Box>
        <UserTable />
      </Box>
    </Container>
  )
}

export default UsersPage
