export interface Inquiry {
  id: number;
  full_name: string;
  company: string;
  email: string;
  phone: string;
  inquiry_type: string;
  project_sector: string;
  message: string;
  attachment?: string;
  consent_updates: boolean;
  status: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}
