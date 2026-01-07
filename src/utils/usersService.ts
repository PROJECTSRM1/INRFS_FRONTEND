import axios from "axios";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  role_id: number;
  gender_id?: number | null;
  age?: number | null;
  dob?: string | null;
}

export const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get<User[]>("https://inrfs-be.onrender.com/users/");


  // show only Admin (2) and Super Admin (3)
  return res.data.filter(user => user.role_id === 2 || user.role_id === 3);
};
