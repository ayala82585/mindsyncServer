
export interface User {
  uid: string;
  email: string;
  full_name: string;
  photo_url: string | null;
  created_at: Date;
  updated_at: Date;
  is_verified?: boolean;
  aisessioncredits: number;
  aimode: "free" | "Pro" | "Business" | "Enterprise";
  phone: string;
}


