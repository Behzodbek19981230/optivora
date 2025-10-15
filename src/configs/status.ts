import { StatesEnum, StatusesEnum } from './const'

const ReasonStatus = (status: string, state: string) => {
  switch (status) {
    case StatusesEnum.identification: {
      switch (state) {
        case StatesEnum.failed:
          return
          break
        default:
          break
      }
    }

    case 'error':
      break
    case 'warning':
      break
    default:
      break
  }
}
export default ReasonStatus
