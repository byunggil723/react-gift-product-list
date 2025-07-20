import { createContext } from 'react';

interface User {
  email: string;
  password: string;
}

interface UserInfoContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserInfoContext = createContext<UserInfoContextType | null>(null);
