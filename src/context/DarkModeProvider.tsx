import { DarkModeContext, useDarkMode } from "./DarkModeContext";



const DarkModeProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    
    
    
      const value = useDarkMode();

      return (
        <DarkModeContext.Provider value={value}>
            { children }
        </DarkModeContext.Provider>
      )
}

export default DarkModeProvider;