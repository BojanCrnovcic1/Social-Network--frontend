import React, { useEffect, useState } from "react";

interface DarkModeContextValue {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeContext = React.createContext<DarkModeContextValue>({
    isDarkMode: false,
    toggleDarkMode: () => {},
});

const useDarkMode = (): DarkModeContextValue => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const darkModeSetting = localStorage.getItem("isDarkMode");
        if (darkModeSetting) {
            setIsDarkMode(JSON.parse(darkModeSetting));
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("isDarkMode", JSON.stringify(newDarkMode))
        document.body.classList.toggle('dark');
    };

    return {isDarkMode, toggleDarkMode}
}

export { DarkModeContext, useDarkMode}