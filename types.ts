import { DoublyLinkedList } from './helper'; 





/**
 * This list contains the definitions of the route params passed to each page.
 */

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

  /**
   * This defines the shape of the IItem interface.
   */
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

/**
 * This defines the shape of the ItemContextType, which contains constants and functions which were shared throughout the app.
 */

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


/**
 * This defines the shape of the official bulletin interface.
 */
export interface IOfficialBulletin {
  id: string;
  title: string;
  createdById?: string,
  createdByUsername?: string,
  createdAt: string,
  updatedAt?: string
  content: string
}

/**
 * This defines the shape of the data on the registration page.
 */
export interface RegisterData {
 username: String;
  password: String;
  firstName: String;
  lastName: String;
  email: String

}

/**
 * This defines the shape data of the login credentials.
 */
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

  /**
   * This defines the shape of the member bulletin category enum.
   */
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