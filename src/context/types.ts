import { UsersType } from 'src/types/apps/userTypes'
import { BranchesType } from 'src/types/dictionaries/branchesType'
import { MerchantType } from 'src/types/dictionaries/merchantType'
import { CategoryTypes } from 'src/types/dictionaries/ratesType'

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  username: string
  password: string
  rememberMe?: boolean
}
export type LoginClientParams = {
  id: number
  otp: string | number
  username: string
}

export type UserDataType = {
  id: number
  role: string
  username: string
  fullName: string
  password: string
  avatar?: string | null
  merchant?: MerchantType | null
  branch?: BranchesType | null
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
}

export type apiStructure = {
  message: string
  result: []
  statusCode: boolean
}
export type ClientUserType = {
  id: number
  image?: string | null
  birth_date: string | null
  created_at: string | null
  fathers_name: string | null
  is_active: boolean
  name: string | null
  p_seria_number: string | null
  passport: string | null
  phone_numbers: string | null
  role: string | null
  surname: string | null
  username: string | null
  work_place_inn: string | null
  password: string | null
  avatar?: string | null
  reminder?: string | null
  limit?: number
  delay?: number
  address?: string
  loan_sum?: number
  application_date?: string
}
export type MerchantUserType = {
  id: number
  birth_date: string | null
  created_at: string | null
  fathers_name: string | null
  is_active: boolean
  name: string | null
  p_seria_number: string | null
  passport: string | null
  phone_numbers: string | null
  role: string | null
  surname: string | null
  username: string | null
  work_place_inn: string | null
  password: string | null
  avatar?: string | null
  merchant: MerchantType
}
export type EmployeeType = {
  id?: number
  created_at?: string | null
  fathers_name?: string | null
  is_active?: boolean
  name?: string | null
  role?: string | null
  surname?: string | null
  username?: string | null
  password?: string | null
  avatar?: string | null
  status?: string
  image?: string
}
export type ApplicationInfo = {
  add_phone?: string
  company_name?: string
  contract?: string
  contract_date?: string
  loan_id?: number
  loan_period?: number
  loan_sum?: number
  loan_amount?: number
  phone?: string
  products?: []
  shop_name?: string | null
  total_count?: number
  total_sum?: number
  created_at?: string
  limit_amount: string
  approved_amount: number
  reason_error?: string
}
export type CardtypeType = 'uzcard' | 'humo'
export type BincodeType = {
  id?: number
  card_type?: CardtypeType
  prefix: string
}
export type BillingReportType = {
  allgood_sum: string
  id: number
  bank: string
  bank_markup: string
  bank_sum: string
  created_at: string
  merchant: string
  name: string
  period: string
  price: string
  status: string
  total: string
  updated_at: string
  inn: string
  address: string
  mfo: string
  bank_account: string
  contract_no: string
  merchant_bank: string
  merchant_bank_address: string
  merchant_bank_inn: string
  backend_application_id: number
  log: string
}
export type ApplicationUserType = {
  id?: number
  b_status?: string
  b_state?: string
  period?: number | null
  image?: string | null
  contract_price?: number | null
  myIdApplicationId?: number | string | null
  group?: number | string | null
  no_contract?: number | string | null
  end_date?: number | string | null
  contract_date?: number | string | null
  company_name?: number | string | null
  status?: string
  inn?: number | string | null
  address?: number | string | null
  mfo?: number | string | null
  bank_account?: number | string | null
  owner?: number | string | null
  owner_phone?: number | string | null
  close_phone?: number | string | null
  add_phone?: number | string | null
  cashback?: number | string | null
  tax_code?: number | string | null
  strategy?: number | string | null
  card?: number | string | null
  card_expiry?: number | string | null
  reason_of_reject?: number | string | null
  MyID?: number | string | null | any
  user?: ClientUserType
  region?: number | string | null
  district?: number | string | null
  merchant?: MerchantType
  branch?: BranchesType
  limit_amount?: number
  state?: string
  otp_type?: string
  is_otp?: boolean
  created_by?: string
  total_sum?: string
  products?: ProductType[]
  categoryType?: CategoryTypes
}
export type StatusColorType = 'inherit' | 'grey' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
export type PriorityStepsType = {
  bgColor: string
  color: StatusColorType
  textColor: string
  textStatus: string
  textCreate: string
}
export type ProductType = {
  id: number
  name: string
  price?: number
  count: number
  amount?: number
}
export type ScheduleItemType = {
  due_date: string
  due_amount: number
  percent: number
  remaining_due_after_payment: number
  due_amount_with_percent: number
}
export type ScheduleType = {
  contract_period: number
  formulated_at: string
  merchant_name: string
  monthly_payment: number
  provider_name: string
  schedule: ScheduleItemType[]
  total_sum: number
  client_full_name: string
  client_passport_credentials: string
  schedule_file: string
  bank_name: string
}
export type PaginationType = { total: number; page: number; perPage: number }
export type ApiListStructure = {
  message: string
  result: []
  pagination: PaginationType
}
