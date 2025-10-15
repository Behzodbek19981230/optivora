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
}
