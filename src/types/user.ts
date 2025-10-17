export interface User{
    id:number;
  username: string;


  last_name: string;
  first_name: string;

  second_name: string;
  is_active: boolean;
  date_of_birthday: string;
  gender: string;
  phone_number: string;
  avatar: string;
  email: string;
  role: string;
  roles:{id:number;name:string;description:string}[];
  password: string;
  country: number;
  region: number;
  district: number;
  address: string;
  passport_series: string;
  passport_number: string;

}
