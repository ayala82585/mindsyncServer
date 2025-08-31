
export interface User {
  uid: string;
  email: string;
  full_name: string;
  photo_url: string | null;
  role: string | null;
  created_at: Date;
  updated_at: Date;
  is_verified?: boolean; // שדה אופציונלי לסימון אימות דוא"ל
  twofa_secret?: string | null; // סוד 2FAtotp_secret
  twofa_enabled?: boolean | null; // סוד 2FAtotp_secret
}


