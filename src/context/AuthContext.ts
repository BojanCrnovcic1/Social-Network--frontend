import { createContext, useContext } from 'react'
import { User } from '../types/User';

export interface AuthContextState {
    isLoggedIn: boolean;
    user: User | null;
    setUser: (user: User | null) => void;
    login: (userdata: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextState>({
    isLoggedIn: false,
    user: null,
    setUser: () => {},
    login: () => {},
    logout: () => {},
});

export const useAuth = () => {
    return useContext(AuthContext);
}

export default AuthContext