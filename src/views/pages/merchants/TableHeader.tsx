// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Translations from 'src/layouts/components/Translations'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material'

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleClick: () => void
  onExport?: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value, handleClick, onExport } = props
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <CustomTextField
        value={value}
        sx={{ mr: 4 }}
        placeholder={t('Search') ?? ''}
        onChange={e => handleFilter(e.target.value)}
      />

      <Box sx={{ display: 'flex', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          style={{ background: theme.palette.primary.contrastText }}
          variant='outlined'
          startIcon={<Icon icon='tabler:screen-share' />}
          onClick={onExport}
        >
          <Translations text='Export' />
        </Button>
        <Button variant='contained' onClick={handleClick}>
          <Translations text='add_merchant' />
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
