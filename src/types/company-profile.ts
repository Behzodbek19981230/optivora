export interface CompanyProfile {
  id?: number
  name: string
  name_en: string
  name_uz: string
  name_ru: string
  name_lt: string
  logo: string
  email: string
  phone: string
  address: string
  business_hours: string
  title: string
  title_en: string
  title_uz: string
  title_ru: string
  title_lt: string
  description: string
  description_en: string
  description_uz: string
  description_ru: string
  description_lt: string
  file?: File | string
  years_experience: string
  equipment_categories: string
  projects_supported: string
  international_partners: string
}
