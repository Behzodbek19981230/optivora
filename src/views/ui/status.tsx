import { PaletteColor } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CustomChip from 'src/@core/components/mui/chip'
import { StatesEnum, StatusesEnum } from 'src/configs/const'
export const getColorStatus = (status: string | undefined): PaletteColor | any => {
  switch (status) {
    case StatusesEnum.open:
      return 'info'
    case StatusesEnum.verifying:
      return 'secondary'
    case StatesEnum.failed:
      return 'error'
    case StatesEnum.waiting:
      return 'warning'
    case StatesEnum.confirmed:
      return 'success'
    case StatesEnum.success:
      return 'success'
    case StatesEnum.rejected:
      return 'error'
    default:
      return 'warning'
  }
}
export const getBgColorStatus = (status: string | undefined): PaletteColor | any => {
  switch (status) {
    case StatusesEnum.open:
      return 'info'
    case StatusesEnum.verifying:
      return 'secondary'
    case StatusesEnum.identification:
      return 'success'
    case 'waiting':
      return 'secondary'
    case StatusesEnum.approving:
      return 'success'
    case StatesEnum.confirmed:
      return 'success'
    case StatesEnum.rejected:
      return 'error'

    default:
      return 'warning'
  }
}
export default function StatusEnumApplication({ status, state = 'warning' }: { status: string; state?: string }) {
  const { t } = useTranslation()
  const getColor = (state: string) => {
    switch (state) {
      case StatesEnum.failed:
        return 'error'
      case StatesEnum.rejected:
        return 'error'
      case StatesEnum.confirmed:
        return 'success'
      case StatesEnum.waiting:
        return 'warning'

      default:
        return 'warning'
    }
  }

  return (
    <div>
      <CustomChip
        // rounded
        skin='light'
        size='small'
        label={t(`${status}_`)}
        color={getColor(state)}
        sx={{ textTransform: 'lowercase' }}
      />
    </div>
  )
}
export function StatesEnumApplication({ state, textStatus }: { state: string; textStatus?: string }) {
  const { t } = useTranslation()
  const getColor = (state: string) => {
    switch (state) {
      case StatesEnum.waiting:
        return 'warning'
      case StatesEnum.confirmed:
        return 'success'
      case StatesEnum.success:
        return 'success'
      case StatesEnum.failed:
        return 'error'

      default:
        return 'error'
    }
  }
  return (
    <div>
      <CustomChip
        // rounded
        skin='light'
        size='small'
        label={t(`${(textStatus ?? state) == StatesEnum.success ? StatesEnum.confirmed : textStatus ?? state}_`)}
        color={textStatus == 'New' ? 'secondary' : getColor(state)}
        // sx={{ textTransform: 'lowercase' }}
      />
    </div>
  )
}
