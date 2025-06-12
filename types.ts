import { DoublyLinkedList } from './helper'; 

export type RootStackParamList = {
  Atrium: undefined;
  BulletinChoice: undefined;
  Login: undefined;
  MemberBulletinSummary: undefined;
  Settings: undefined;
  Register: undefined;
  Edit: {item: IItem};
  MemberBulletinDetails: {
    item: IItem ;
  };
  OfficialBulletinsSummary: undefined;
  Add: undefined;
  OfficialBulletinsDetails: {
    item: IOfficialBulletin;
  };
  AddOfficial: undefined;
  EditOfficial:  {
    item: IOfficialBulletin};
    Profile: undefined;
    
  };

export interface IItem {
  id: string;
  title: string;
  createdById?: string;
  createdByUsername?: string;
  createdAt?: string;
  updatedAt?: string;
  category: number;
  content: string;
 
}



export type ItemContextType = {
  bulletins: IItem[];
  saveBulletins: (item: IItem) => void;
  deleteBulletin: (id: string) => void;
  officialBulletinList: DoublyLinkedList;
  
officialBulletins: IOfficialBulletin[];
saveOfficialBulletins: (item: IOfficialBulletin) => void;
deleteOfficialBulletins: (id: string) => void;
loadingMember: boolean;
loadingOfficial: boolean;
fontSize: number;
setFontSize: (size: number) => void;
refreshBulletins: () => Promise <void>;

  
}

export interface IOfficialBulletin {
  id: string;
  title: string;
  createdById?: string,
  createdByUsername?: string,
  createdAt: string,
  updatedAt?: string
  content: string
}

export interface RegisterData {
 username: String;
  password: String;
  firstName: String;
  lastName: String;
  email: String

}

type LoginResult = {
  success: boolean;
  role?: "Administrator" | "Member" | null;
  message?: string;
};

/* interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  login: (username: string, password: string) => Promise<LoginResult>; // Update return type here
  logout: () => void;
  role: "admin" | "user" | null;
  setRole: (role: "admin" | "user" | null) => void;
} */

  export enum MemberBulletinCategory {
  Interest = 0,
  Event = 1,
  Update = 2,
}

/* export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  // Add any other fields you use
} */