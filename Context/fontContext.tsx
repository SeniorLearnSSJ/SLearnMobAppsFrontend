import React, { ReactNode, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


/**
 * This interface defines the properties of the font context object.
 */
interface FontContextType {
  fontSize: number;
  setFontSize: (fontSize: number) => void;
}


/**
 * This interface defines the shape of the font provider, which will wrap around child components and provide access to the properties of font context.
 */
interface FontSizeProviderProps {
  children: ReactNode;
}


/**
 * This creates a context object of type Font Context Type and initialises it with a default state of undefined.
 */
const FontContext = React.createContext<FontContextType | undefined>(undefined);

/**
 * This is a provider that takes a parameter of interface type FontSizeProviderProp.  It makes the font size state managemetn available to all child components wrapped by the provider context object.
 * @param param0 Object that contains all child components wrappped by the provider.
 * @returns A react element that wraps its child components with the font size provider.
 */
const FontSizeProvider = ({ children }: FontSizeProviderProps) => {
  const [fontSize, setFontSize] = useState(20);


const fontContextValue: FontContextType = {
  fontSize,
  setFontSize
};


/* 
return (
  <FontContext.Provider value={fontContextValue}>
    {children}
  </FontContext.Provider>
);

 */


/**
 * This effect loads font size stored in local storage.
 */

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


  /**
   * This effect saves font settings to local storage, for retrieval and persistence across app restarts.
   */
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
