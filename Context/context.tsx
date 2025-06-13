import * as React from "react";
import { ItemContextType, IItem, IOfficialBulletin } from "../types";
import { DoublyLinkedList } from "../helper";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const ItemContext = React.createContext<ItemContextType | null>(null);

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
          "http://192.168.1.244:5143/api/bulletins/member"
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
          const response = await fetch("http://192.168.1.244:5143/api/bulletins/member"
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
  


    React.useEffect(() => {
  
      async function fetchOfficialBulletins() {
        setLoadingOfficial(true)
        try {
          const response = await fetch("http://192.168.1.244:5143/api/bulletins/official");
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
  






  React.useEffect(() => {
const mapped = officialBulletins.map(b=>({
  id: b.id,
  title: b.title,
  datetime: new Date(b.createdAt),
  content: b.content,
}))



    const newList = new DoublyLinkedList();
    newList.buildFromArray(mapped);
    setOfficialBulletinList(newList);
  }, [officialBulletins]);

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

  const deleteBulletin = (idToDelete: string) => {
    setBulletins((prev) => prev.filter((item) => item.id !== idToDelete));
  };

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

  const deleteOfficialBulletins = (idToDelete: string) => {
    setOfficialBulletins((prev) =>
      prev.filter((item) => item.id !== idToDelete)
    );
  };

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




const refreshBulletins = async () => {
  setLoadingMember(true);
  try {
    const response = await fetch("http://192.168.1.244:5143/api/bulletins/member");
    const json = await response.json();
    setBulletins(json.data ?? []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingMember(false);
  }
};





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
