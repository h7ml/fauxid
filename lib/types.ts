export type Gender = '男' | '女';

export type Country = 'CN' | 'US' | 'UK' | 'JP' | 'CA' | 'AU';

export interface CountryInfo {
  code: Country;
  name: string;
  idNumberName: string;
}

export type IdentityType = {
  id: string;
  user_id?: string;
  name: string;
  gender: Gender;
  birth_date: string;
  id_number: string;
  address: string;
  phone: string;
  email: string;
  occupation?: string;
  education?: string;
  created_at: string;
  favorite?: boolean;
  country: Country;
  nationality?: string;
  passport_number?: string;
  notes?: string;
  tags?: string[];
};

export type BasicUserProfile = {
  id: string;
  email: string;
  created_at: string;
};

export type GenerateIdentityOptions = {
  gender?: Gender;
  age_min?: number;
  age_max?: number;
  region?: string;
  country?: Country;
}; 
