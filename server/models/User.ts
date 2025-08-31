
export interface User {
  uid: string;
  email: string;
  full_name: string;
  photo_url: string | null;
  role: string | null;
  created_at: Date;
  updated_at: Date;
  is_verified?: boolean;
  twofa_secret?: string | null;
  twofa_enabled?: boolean; // שדה אופציונלי לסימון אימות דו-שלבי
}


