export type OurWorkType =
  | 'technical_solution'
  | 'why_choose'
  | 'what_we_do'
  | 'our_suppliers'
  | 'industries_we_serve'

export const OUR_WORK_TYPE_OPTIONS = [
  { value: 'technical_solution', label: 'Technical Solution' },
  { value: 'why_choose', label: 'Why Choose Optivora' },
  { value: 'what_we_do', label: 'What We Do' },
  { value: 'our_suppliers', label: 'Our Suppliers' },
  { value: 'industries_we_serve', label: 'Industries We Serve' }
]

export interface OurWork {
  id?: number;
  title: string;
  description: string;
  icon: string;
  type: OurWorkType;
  order_index: number;
}
