import { PeriodType } from './periodType'
export enum CategoryTypes {
  A = 'A',
  B = 'B'
}
export type RatesType = {
  id: number
  name: string
  minValue: number
  maxValue: number
  period: PeriodType | null | string
  periodId: number
  isActive: boolean
  tariffPeriod: PeriodType | null
  categoryType: CategoryTypes
}
