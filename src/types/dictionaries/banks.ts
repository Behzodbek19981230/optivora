export type BankType = {
  id: number
  mfo: string
  name: string
  inn: string
}
export type BankBranchType = {
  id: number
  code: string
  sign: string
  address: string
  created_date: string
  updated_date: string
  name: string
  region: string
  district: string
  city: string
  stir: string
  site: string
  location: string
  bank?: BankType
}
