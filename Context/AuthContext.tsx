import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiLogin } from "../api";
//import * as jwt_decode from "jwt-decode";


/**
 * This function parses the token, of type string.
 * 
 * @param token (The JWT token string to be decoded)
 * @returns It returns either the payload of the decoded token or null.
 */
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("JWT parsing failed", e);
    return null;
  }
}


/**
 * This interface defines the shape of the authentication context object.  Authentication will require the fields and functions below.
 */
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  role: "Administrator" | "Member" | null;
  setRole: (role: "Administrator" | "Member" | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
}

/**
 * This variable holds the value of the auth data string.
 */
const STORAGE_KEY = "auth_data";

/**
 * This module creates a context of type AuthContextType.  It is a React context container allowing for shared data and functions between the app components.
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

/**
 * This provider encapsulates state management, providing token, role and username state management to the context.
 * @param param0 It contains ReactNode childrent to be rendered inside this component by the UI that the component wraps around.  The object param0 has a property named children.
 * @returns It returns a React element that wraps children with the authentication context.Specifically, it produces JSX with children wrapped by the context provider itself, allowing context info to be transferred to the wrapped code.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"Administrator" | "Member" | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  //const [user, setUser] = useState<User | null>(null);

  /**
   * The useEffect hook for getAuthstate runs after component first mounts.
   * The useEFfect hook for setAuthState runs after username, token or role changes.
   */
  useEffect(() => {
    getAuthState();
  }, []);

  useEffect(() => {
    setAuthState(token, role, username);
  }, [username, token, role]);


  /**
   * This functional component retrieves data from async storage and sets the token as well as the role and username to the local data values.
   */
  const getAuthState = async () => {
    try {
      console.log("Fetching stored authentication data...");
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        const data = JSON.parse(stored);
        console.log("Retrieved Auth Data:", data);

        setToken(data.token || null);
        if (data.role === "Administrator" || data.role === "Member") {
          setRole(data.role);
        } else {
          console.warn("Invalid role found in storage, resetting to null.");
          setRole(null);
        }
        setUsername(data.username || null);
      } else {
        console.warn("No stored auth data found.");
      }
    } catch (err) {
      console.error("Error retrieving auth state:", err);
      setToken(null);
      setRole(null);
      setUsername(null);
    }
  };


  /**This functional component saves the token, role and username to local storage.
   * 
   * @param token 
   * @param role 
   * @param username 
   */
  const setAuthState = async (
    token: string | null,
    role: "Administrator" | "Member" | null,
    username: string | null
  ) => {
    try {
      const data = JSON.stringify({ token, role, username });
      console.log("Saving authentication data:", data);

      await AsyncStorage.setItem(STORAGE_KEY, data);
      console.log("Authentication data saved successfully.");
    } catch (error) {
      console.error("Failed to save auth state:", error);
    }
  };


  /**This function verifies the username and password against the backend response.
   * If successful, it stores the JWT token, decodes it to extract user role and udpates authentication state (token, role, username)
   * @param username 
   * @param password 
   * @returns Boolean indicating true if successful, false if unsuccessful login.
   */
  const login = async (username: string, password: string) => {
    console.log(`Attempting login with username: ${username}`);

    // Hardcoded Test Credentials
    /*     if (username === "testuser" && password === "testpass") {
      setToken("hardcodedToken");
      setRole("user");
      console.log("Test user logged in successfully.");
      return true;
    } */

    try {
      const response = await ApiLogin(username, password);
      console.log("API Login Response:", response);

console.log("Full API Response:", response);
console.log("Raw Token:", response?.token);


      
      console.log(response);
      if (response.success && response.token) {
        {
          const accessToken = response.token;
          setToken(accessToken);

          const decoded = parseJwt(accessToken);


          console.log("Full Decoded JWT Payload:", decoded);
console.log("Available Keys in JWT:", Object.keys(decoded || {}));


          console.log("Decoded JWT:", decoded?.role);


          const roleClaimKey = Object.keys(decoded).find(key => key.includes("role"));
const role = roleClaimKey ? decoded[roleClaimKey] : null;

console.log("Extracted Role:", role);


          //const roleClaim = decoded.role;

          console.log("Extracted role from token:", role);

          if (role === "Administrator" || role === "Member") {
            setRole(role);
          } else {
            setRole(null);
          }

          /*   if (
            decoded &&
            (decoded.role === "Administrator" || decoded.role === "Member")
          ) {
            setRole(decoded.role);
          } else {
            setRole(null);
          }
 */
          /*         if (response.role === "Administrator" || response.role === "Member") {
          setRole(response.role);
        } else {
          setRole(null); */
        }
        setUsername(username);

        //console.log(`Login successful. Assigned role: ${assignedRole}`);

        return true;

        /*       if (response.success && response.token) {
        setToken(response.token);

        try {

          
          const decoded = (jwt_decode as any)<{ role: "Administrator" | "Member" }>(response.token); */

        // const decoded = jwt_decode<{ role: "Administrator" | "Member" }>(response.token);

        // const decoded = (jwt_decode as any)<{ role: "Administrator" | "Member" }>(response.token);

        // const decoded = jwt_decode<{ role: "Administrator" | "Member" }>(
        //   response.token
        // );
        /* 


          if (decoded.role === "Administrator" || decoded.role === "Member") {
            setRole(decoded.role);
          } else {
            setRole(null);
          }
        } catch (err) {
          console.error("Failed to decode token", err);
          setRole(null);
        }

        setUsername(username);

        return true

 */
      } else {
        console.warn("Login failed:", response.message || "Missing token");
        return false;
      }
    } catch (error: any) {
      console.error("Login error:", error?.message || error);
      return false;
    }
  };

  /**
   * This function wipes the authentication state on logout.
   */

  const logout = () => {
    console.log("Logging out user...");
    setUsername(null), setToken(null);
    setRole(null);

    AsyncStorage.removeItem(STORAGE_KEY)
      .then(() => console.log("Auth state cleared successfully."))
      .catch((err) => console.error("Failed to clear auth state:", err));
  };

/**
 * This function loads authentication data stored in the local storage, which preserves authorisation details and removes need for logging in again, unless token has expired.
 
 */


/* useEffect(() => {
  const loadToken = async () => {
    const token = await AsyncStorage.getItem('auth_data');
    if (token) {
      // optionally decode and validate the token (expiry etc.)
     await setAuthState( token, role, username);
    }
  };
  loadToken(); 
}, []);

 */

  /**
   * This gives whatever is wrapped in the auth context provider access to the values passed in here.
   */
  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        login,
        logout,
        role,
        setRole,
        username,
        setUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * This function allows the creation of context from the auth context parent component. 
 * @returns It retruns a context object, or nothing/error message if the component calling it is not wrapped in the provider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
