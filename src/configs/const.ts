export enum StatusesEnum {
  open = 'open',
  identification = 'identification',
  scoring = 'scoring',
  approving = 'approving',
  verifying = 'verifying',
  scheduling = 'scheduling'
}
export const Statuspriority = {
  open: 1,
  identification: 2,
  scoring: 3,
  approving: 4,
  verifying: 5,
  scheduling: 6
}
export enum StatesEnum {
  waiting = 'waiting',
  confirmed = 'confirmed',
  rejected = 'rejected',
  failed = 'failed',
  success = 'success'
}
export enum otpBillingTypes {
  uzcard = 'uzcard',
  new_client = 'new_client',
  current_client = 'current_client',
  payment = 'payment',
  davr = 'davr'
}

export enum Roles {
  admin = 'admin',
  manager = 'manager',
  superuser = 'superuser',
}

export enum PartnerCategory{
    power_control = 'power_control',
    rotating = 'rotating',
    specialized = 'specialized',
    safety_monitoring = 'safety_monitoring',
    electrical_power = 'electrical_power'
}
export const PartnerCategoryList = [
  { value: 'power_control', label: 'Power & Control Systems' },
  { value: 'rotating', label: 'Rotating Equipment & Pumps' },
  { value: 'specialized', label: 'Specialized Systems' },
  { value: 'safety_monitoring', label: 'Safety & Monitoring' },
  { value: 'electrical_power', label: 'Electrical & Power Components' }
]
