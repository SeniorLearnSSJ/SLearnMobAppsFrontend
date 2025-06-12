import React, { ReactNode, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FontContextType {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
}

interface FontSizeProviderProps {
  children: ReactNode;
}

const FontContext = React.createContext<FontContextType | undefined>(undefined);

const FontSizeProvider = ({ children }: FontSizeProviderProps) => {
  const [fontSize, setFontSize] = useState(20);


const fontContextValue: FontContextType = {
  fontSize,
  setFontSize
};




useEffect (()=>{
  const loadFontSize = async () =>{
    try {
      const stored = await AsyncStorage.getItem("fontSize");
      if (stored !== null){
        setFontSize(Number(stored));
      }}
      catch (error){
        console.error(error);
      }
    };
    loadFontSize();
  }, [])


useEffect (() =>{
  const saveFontSize = async () =>{
    try {await AsyncStorage.setItem("fontSize", fontSize.toString());
  } catch (error){
    console.error(error);
  }
};
saveFontSize();
}, [fontSize])
  return (
    <FontContext.Provider value={fontContextValue}>
      {children}
    </FontContext.Provider>
  );
}

export { FontContext, FontSizeProvider };
