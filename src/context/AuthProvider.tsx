import React, { useState } from "react"
import { User } from "../types/User";
import AuthContext, { AuthContextState } from "./AuthContext";

const AuthProvider: React.FC<({ children: React.ReactNode})> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => {
        setIsLoggedIn(true);
        setUser(userData);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const value: AuthContextState = {
        isLoggedIn,
        user,
        setUser,
        login,
        logout,
    }

    console.log('value u authu:',value)

    return (
        <AuthContext.Provider value={value}>
            {children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;