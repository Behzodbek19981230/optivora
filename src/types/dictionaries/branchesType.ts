import { Category } from './category'
import { MerchantType } from './merchantType'

type Status = 'active' | 'inactive'
export type BranchesType = {
  merchant: MerchantType
  name: string
  category: string
  address: string
  status: Status
  longitude: string
  latitude: string
  id?: number
  regionId?: string
  districtId?: string
  merchantId?: number
}
export type BranchesListType = {
  id: number
  merchant: number
  name: string
  category: Category
  address: string
  status: Status
  longitude: string
  latitude: string
  regionId: string
  districtId: string
}
