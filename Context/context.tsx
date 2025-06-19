
/**
 * These import statements import components from other files, as well as third party libraries like Async Storage.  Some custom types and helper functions are also imported, along with hooks.
 */

import * as React from "react";
import { ItemContextType, IItem, IOfficialBulletin } from "../types";
import { DoublyLinkedList } from "../helper";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../apiConfig";

/**
 * This function creates a context object of type ItemContextType.  It has a default initial value of null.
 */

export const ItemContext = React.createContext<ItemContextType | null>(null);

/**This object provides state management to all child components wrapped within the provider.
 * 
 * @param param0 The parameter is an object containing children of type ReactNode.
 * @returns It returns a React element with child components wrapped in the provider.
 */

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bulletins, setBulletins] = React.useState<IItem[]>([
   /*  { id: "1", title: "First Item", category: "1", content: "Hey!" },
    { id: "2", title: "Second Item", category: "2", content: "Heya!" },
    { id: "3", title: "Third Item", category: "3", content: "Heyhey!" }, */
  ]);


  const [loadingMember, setLoadingMember] = useState(false);
  const [loadingOfficial, setLoadingOfficial] = useState(false);
  const [fontSize, setFontSize] = useState<number>(20);


/* useEffect (()=>{
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
}, [fontSize]) */


  const [officialBulletins, setOfficialBulletins] = React.useState<
    IOfficialBulletin[]
  >([
    /* { id: "1", title: "First Item", createdAt: "2025-01-01", content: "Hey!" },
    { id: "2", title: "Second Item", createdAt: "2025-01-02", content: "Heya!" },
    { id: "3", title: "Third Item", createdAt: "2025-01-03", content: "Hi!" }, */
  ]);

  const [officialBulletinList, setOfficialBulletinList] = React.useState(
    new DoublyLinkedList()
  );

  /**
   * This function loads and fetches Member bulletins.  It first checks if there are any bulletins in local storage, then fetches bulletins from the backend.
   * It also sets loading state while fetching, which can help with user interface elements that indicate if data is being fetched.
   */


  React.useEffect(() => {
    async function loadAndFetchMemberBulletins() {
      setLoadingMember(true);
      try {
        // Load from AsyncStorage first
        const stored = await AsyncStorage.getItem("bulletins");
        if (stored !== null) {
          setBulletins(JSON.parse(stored));
        }
        // Fetch fresh data from API
        const response = await fetch(
          `${API_URL}/api/bulletins/member`
        );
        const json = await response.json();
        setBulletins(json.data ?? []);
      } catch (error) {
        console.error("Failed to load or fetch member bulletins", error);
      } finally {
        setLoadingMember(false);
      }
    }
    loadAndFetchMemberBulletins();
  }, []);


/*   React.useEffect (() => {
   
      async function fetchMemberBulletins() {
        setLoadingMember (true);
        try {
          const response = await fetch("http://172.19.159.72:5143/api/bulletins/member"
);
          const json = await response.json();
          const fetchedMemberBulletins: IItem[] = json.data ?? [];
          setBulletins(fetchedMemberBulletins);
        } catch (error) {
          console.error("Failed to fetch member bulletins", error);
        } finally {setLoadingMember(false);}

      }

      fetchMemberBulletins();
    }, []); */
  
/**
 * This function is similar to the one above, except that it fetches from a different API (official, not member)
 */

    React.useEffect(() => {
  
      async function fetchOfficialBulletins() {
        setLoadingOfficial(true)
        try {
          const response = await fetch(`${API_URL}/api/bulletins/official`);
          const json = await response.json();
          const fetchedOfficialBulletins: IOfficialBulletin[] = json.data ?? [];
          setOfficialBulletins(fetchedOfficialBulletins); 
        } catch (error) {
          console.error("Failed to fetch official bulletins", error);
        }
        finally{
          setLoadingOfficial(false);
        }
      }

      fetchOfficialBulletins();
    }, []);
  





/**
 * This is an effect that maps the bulletins, creating an array for each iterated item.
 */
  React.useEffect(() => {
const mapped = officialBulletins.map(b=>({
  id: b.id,
  title: b.title,
  datetime: new Date(b.createdAt),
  content: b.content,
}))


/**
 * This is a variable declaration that uses the build from array helper function to create a doubly linked list from the mapped bulletins above.
 */

    const newList = new DoublyLinkedList();
    newList.buildFromArray(mapped);
    setOfficialBulletinList(newList);
  }, [officialBulletins]);





/**This is a function that takes a bulletin as a parameter.  Id checking is performed, which ensures that if a bulletin already exists, it is preserved in the array.
 * 
 * @param newBulletin 
 */


  const saveBulletins = (newBulletin: IItem) => {
    setBulletins((prevBulletins) => {
      const exists = prevBulletins.some((b) => b.id === newBulletin.id);

      if (exists) {
        return prevBulletins.map((b) =>
          b.id === newBulletin.id ? newBulletin : b
        );
      } else {
        return [...prevBulletins, newBulletin];
      }
    });
  };

  /**
   * This is a function that takes a string Id as a parameter.  It filters the list of bulletins to return only items that do not have the matching Id (the ID to be deleted)
   * @param idToDelete 
   */

  const deleteBulletin = (idToDelete: string) => {
    setBulletins((prev) => prev.filter((item) => item.id !== idToDelete));
  };






  /**This function takes an official bulletin as a parameter. It otherwise performs an identcial function to the saveBulletins function above.
   * 
   * @param newBulletin 
   */
  const saveOfficialBulletins = (newBulletin: IOfficialBulletin) => {
    setOfficialBulletins((prevBulletins) => {
      const exists = prevBulletins.some((b) => b.id === newBulletin.id);

      if (exists) {
        return prevBulletins.map((b) =>
          b.id === newBulletin.id ? newBulletin : b
        );
      } else {
        return [...prevBulletins, newBulletin];
      }
    });
  };


  /**This function takes an id string parameter indicating the id of the official bulletin.  It is otherwise identical to the delete function above.
   * 
   * @param idToDelete 
   */
  const deleteOfficialBulletins = (idToDelete: string) => {
    setOfficialBulletins((prev) =>
      prev.filter((item) => item.id !== idToDelete)
    );
  };

  /**This function saves the bulletins to local storage in JSON format. This effect runs on each change to bulletins.
   * 
   */

    React.useEffect(() => {
    async function saveBulletinsToStorage() {
      try {
        await AsyncStorage.setItem("bulletins", JSON.stringify(bulletins));
      } catch (error) {
        console.error("Failed to save bulletins to AsyncStorage", error);
      }
    }
    saveBulletinsToStorage();
  }, [bulletins]);



/**
 * This function fetches from the member bulletins API.  It provides live updates of the bulletins whenever they are changed on the backend or updated elswhere via the frontend.
 */
const refreshBulletins = async () => {
  setLoadingMember(true);
  try {
    const response = await fetch(`${API_URL}/api/bulletins/member`);
    const json = await response.json();
    setBulletins(json.data ?? []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingMember(false);
  }
};



/**This is a return statement wrapping all child components of ItemContextProvider and making available all the listed variables and functions of the provider.
 * 
 */

  return (
    <ItemContext.Provider
      value={{
        bulletins,
        saveBulletins,
        deleteBulletin,
        officialBulletins,
        officialBulletinList,
        saveOfficialBulletins,
        deleteOfficialBulletins,
        loadingMember,
        loadingOfficial,
        fontSize,
        setFontSize,
        refreshBulletins
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export default Provider;
