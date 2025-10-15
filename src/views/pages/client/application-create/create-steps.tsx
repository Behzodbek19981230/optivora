import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import Translations from 'src/layouts/components/Translations'
import { ApplicationUserType, PriorityStepsType } from 'src/context/types'
import { StatesEnumApplication, getColorStatus } from 'src/views/ui/status'
import { StatesEnum, StatusesEnum, Statuspriority } from 'src/configs/const'
const Timeline = styled(MuiTimeline)<TimelineProps>({
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})
export const PrioritySteps = (
  step: string,
  apiData: ApplicationUserType,
  currentStatus?: string
): PriorityStepsType => {
  switch (step) {
    case 'Identification': {
      if (Statuspriority[StatusesEnum.identification] < Statuspriority[apiData?.status as StatusesEnum]) {
        return {
          bgColor: StatusesEnum.identification == currentStatus ? 'info' : 'success',
          color: StatusesEnum.identification == currentStatus ? 'info' : 'success',
          textColor: '',
          textStatus: StatesEnum.confirmed,
          textCreate: apiData.user?.surname + ' ' + apiData.user?.name + ' ' + apiData.user?.fathers_name
        }
      } else {
        if (Statuspriority[StatusesEnum.identification] == Statuspriority[apiData?.status as StatusesEnum]) {
          return {
            bgColor: StatusesEnum.identification == currentStatus ? 'warning' : getColorStatus(apiData?.state),
            color: getColorStatus(apiData?.state),
            textColor: '',
            textStatus: apiData?.state as string,
            textCreate: apiData.user?.surname + ' ' + apiData.user?.name + ' ' + apiData.user?.fathers_name
          }
        } else
          return {
            bgColor: 'lightgrey',
            color: 'secondary',
            textColor: 'text.disabled',
            textStatus: 'New',
            textCreate: 'Not_created'
          }
      }
    }
    case 'Scoring': {
      if (Statuspriority[StatusesEnum.scoring] < Statuspriority[apiData?.status as StatusesEnum]) {
        return {
          bgColor: StatusesEnum.scoring == currentStatus ? 'info' : 'success',
          color: StatusesEnum.scoring == currentStatus ? 'info' : 'success',
          textColor: '',
          textStatus: StatesEnum.confirmed,
          textCreate: 'created_'
        }
      } else {
        if (Statuspriority[StatusesEnum.scoring] == Statuspriority[apiData?.status as StatusesEnum]) {
          return {
            bgColor: getColorStatus(apiData?.state),
            color: getColorStatus(apiData?.state),
            textColor: '',
            textStatus: apiData?.state as string,
            textCreate: 'created_'
          }
        } else
          return {
            bgColor: 'lightgrey',
            color: 'secondary',
            textColor: 'text.disabled',
            textStatus: 'New',
            textCreate: 'Not_created'
          }
      }
    }
    case 'Approving': {
      if (Statuspriority[StatusesEnum.approving] < Statuspriority[apiData?.status as StatusesEnum]) {
        return {
          bgColor: StatusesEnum.approving == currentStatus ? 'info' : 'success',
          color: StatusesEnum.approving == currentStatus ? 'info' : 'success',
          textColor: '',
          textStatus: StatesEnum.confirmed,
          textCreate: 'created_'
        }
      } else {
        if (Statuspriority[StatusesEnum.approving] == Statuspriority[apiData?.status as StatusesEnum]) {
          return {
            bgColor: getColorStatus(apiData?.state),
            color: getColorStatus(apiData?.state),
            textColor: '',
            textStatus: apiData?.state as string,
            textCreate: 'created_'
          }
        } else
          return {
            bgColor: 'lightgrey',
            color: 'secondary',
            textColor: 'text.disabled',
            textStatus: 'New',
            textCreate: 'Not_created'
          }
      }
    }
    case 'Verifying': {
      if (Statuspriority[StatusesEnum.verifying] < Statuspriority[apiData?.status as StatusesEnum]) {
        return {
          bgColor: StatusesEnum.verifying == currentStatus ? 'info' : 'success',
          color: StatusesEnum.verifying == currentStatus ? 'info' : 'success',
          textColor: '',
          textStatus: StatesEnum.confirmed,
          textCreate: 'created_'
        }
      } else {
        if (Statuspriority[StatusesEnum.verifying] == Statuspriority[apiData?.status as StatusesEnum]) {
          return {
            bgColor: getColorStatus(apiData?.state),
            color: getColorStatus(apiData?.state),
            textColor: '',
            textStatus: apiData?.state as string,
            textCreate: 'created_'
          }
        } else
          return {
            bgColor: 'lightgrey',
            color: 'secondary',
            textColor: 'text.disabled',
            textStatus: 'New',
            textCreate: 'Not_created'
          }
      }
    }
    case 'Scheduling': {
      if (Statuspriority[StatusesEnum.scheduling] < Statuspriority[apiData?.status as StatusesEnum]) {
        return {
          bgColor: StatusesEnum.scheduling == currentStatus ? 'info' : 'success',
          color: StatusesEnum.scheduling == currentStatus ? 'info' : 'success',
          textColor: '',
          textStatus: StatesEnum.confirmed,
          textCreate: 'created_'
        }
      } else {
        if (Statuspriority[StatusesEnum.scheduling] == Statuspriority[apiData?.status as StatusesEnum]) {
          return {
            bgColor: getColorStatus(apiData?.state),
            color: getColorStatus(apiData?.state),
            textColor: '',
            textStatus: apiData?.state == StatesEnum.success ? StatesEnum.success : (apiData.state as string),
            textCreate: 'created_'
          }
        } else
          return {
            bgColor: 'lightgrey',
            color: 'secondary',
            textColor: 'text.disabled',
            textStatus: 'New',
            textCreate: 'Not_created'
          }
      }
    }
    default:
      return { bgColor: '', color: 'secondary', textColor: '', textStatus: 'New', textCreate: 'Not_created' }
  }
}
const CreateStepsLeftBar = ({ apiData, currentStatus }: { apiData: ApplicationUserType; currentStatus: string }) => {
  const theme = useTheme()

  return (
    <Timeline>
      {/* Identification */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={PrioritySteps('Identification', apiData, currentStatus).color} />
          <TimelineConnector
            // @ts-ignore
            sx={{ bgcolor: theme.palette[PrioritySteps('Identification', apiData, currentStatus)?.bgColor]?.main }}
          />
        </TimelineSeparator>
        <TimelineContent>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'start'
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
              <Translations text='Identification' />
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
              <Translations text={PrioritySteps('Identification', apiData).textCreate} />
            </Typography>
            <StatesEnumApplication
              state={PrioritySteps('Identification', apiData).textStatus as string}
              textStatus={PrioritySteps('Identification', apiData).textStatus}
            />{' '}
          </Box>
        </TimelineContent>
      </TimelineItem>
      {/* Scoring */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={PrioritySteps('Scoring', apiData, currentStatus).color} />
          <TimelineConnector
            // @ts-ignore
            sx={{ bgcolor: theme.palette[PrioritySteps('Scoring', apiData, currentStatus).bgColor]?.main }}
          />
        </TimelineSeparator>
        <TimelineContent>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'start'
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: PrioritySteps('Scoring', apiData).textColor }}>
              <Translations text='Scoring' />
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
              <Translations text={PrioritySteps('Scoring', apiData).textCreate} />
            </Typography>
            <StatesEnumApplication
              state={PrioritySteps('Scoring', apiData).textStatus as string}
              textStatus={PrioritySteps('Scoring', apiData).textStatus}
            />
            {/* <CustomChip label={<Translations text='Refusal' />} skin='light' color='error' /> */}
          </Box>
        </TimelineContent>
      </TimelineItem>

      {/* Approving */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={PrioritySteps('Approving', apiData, currentStatus).color} />
          <TimelineConnector
            // @ts-ignore
            sx={{ bgcolor: theme.palette[PrioritySteps('Approving', apiData, currentStatus).bgColor]?.main }}
          />
        </TimelineSeparator>
        <TimelineContent>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'start'
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: PrioritySteps('Approving', apiData).textColor }}>
              <Translations text='Decor' />
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
              <Translations text={PrioritySteps('Approving', apiData).textCreate} />
            </Typography>
            <StatesEnumApplication
              state={PrioritySteps('Approving', apiData).textStatus as string}
              textStatus={PrioritySteps('Approving', apiData).textStatus}
            />
            {/* <CustomChip label={<Translations text='Refusal' />} skin='light' color='error' /> */}
          </Box>
        </TimelineContent>
      </TimelineItem>

      {/* Verifying  */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={PrioritySteps('Verifying', apiData, currentStatus).color} />
          <TimelineConnector
            // @ts-ignore
            sx={{ bgcolor: theme.palette[PrioritySteps('Verifying', apiData, currentStatus).bgColor]?.main }}
          />
        </TimelineSeparator>
        <TimelineContent>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'start'
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: PrioritySteps('Verifying', apiData).textColor }}>
              <Translations text='Confirmation' />
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
              <Translations text={PrioritySteps('Verifying', apiData).textCreate} />
            </Typography>
            <StatesEnumApplication
              state={PrioritySteps('Verifying', apiData).textStatus as string}
              textStatus={PrioritySteps('Verifying', apiData).textStatus}
            />
            {/* <CustomChip label={<Translations text='Refusal' />} skin='light' color='error' /> */}
          </Box>
        </TimelineContent>
      </TimelineItem>

      {/* Scheduling  */}
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color={PrioritySteps('Scheduling', apiData, currentStatus).color} />
          <TimelineConnector
            // @ts-ignore
            sx={{ bgcolor: theme.palette[PrioritySteps('Scheduling', apiData, currentStatus).bgColor]?.main }}
          />
        </TimelineSeparator>
        <TimelineContent>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
              gap: 1,
              alignItems: 'start'
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: PrioritySteps('Scheduling', apiData).textColor }}>
              <Translations text='Schedule' />
            </Typography>
            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
              <Translations text={PrioritySteps('Scheduling', apiData).textCreate} />
            </Typography>
            <StatesEnumApplication
              state={PrioritySteps('Scheduling', apiData).textStatus as string}
              textStatus={PrioritySteps('Scheduling', apiData).textStatus}
            />
            {/* <CustomChip label={<Translations text='Refusal' />} skin='light' color='error' /> */}
          </Box>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
export default CreateStepsLeftBar
