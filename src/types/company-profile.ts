export interface CompanyProfile {
  id?: number;
  name: string;
  name_en: string;
  name_uz: string;
  name_ru: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  business_hours: string;
  title: string;
  title_en: string;
  title_uz: string;
  title_ru: string;
  description: string;
  description_en: string;
  description_uz: string;
  description_ru: string;
  file?: File | string;
}
