/* import axios from "axios";

export const api = axios.create({
  //aseURL: 'http://AcerAspire:3000/api',
  headers: {
    "Content-Type": "application/json",
  },
});

export async function ApiLogin(username: string, password: string): Promise <{success: boolean; message?: string}> {
  try {0
    const response = await api.post(
      "http://192.168.1.244:5143/api/auth/sign-in",
      { username, password }
    );

    if (response.status !== 200) {
      throw new Error(`${response.status}`);
    }

    const data = response.data;

    if (data.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      return data.token;
    } else {
      return {false};
    }
  } catch (error: any) {
    console.error("Failed", error.message);
    return { success: false };
  }
}
 */

/* import axios from "axios";

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});
// login.ts or AuthContext.ts
export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await api.post("http://192.168.1.244:5143/api/auth/sign-in", {
      username,
      password,
    });

    const data = response.data;

    if (response.status === 200 && data?.data?.token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${data.data.token}`;
      return { success: true };
    } else {
      return {
        success: false,
        message: data?.message || "Token missing or unexpected response",
      };
    }
  } catch (error: any) {
    console.error("Login error", error);
    return {
      success: false,
      message:
        error?.response?.data?.message || error.message || "Unknown login error",
    };
  }
}
 */
/* 
import axios from "axios";

// Create Axios instance
export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});


export async function ApiLogin(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; role?: string; message?: string }> {
  try {
    const response = await api.post("http://192.168.1.244:5143/api/auth/sign-in", {
      username,
      password,
    });

    const data = response.data;

    if (response.status === 200 && data?.data?.token && data?.data?.role) {
      api.defaults.headers.common["Authorization"] = `Bearer ${data.data.token}`;
      return {
        success: true,
        token: data.data.token,
        role: data.data.role,
      };
    } else {
      return {
        success: false,
        message: data?.message || "Unexpected response format",
      };
    }
  } catch (error: any) {
    console.error("ApiLogin error:", error?.response?.data || error.message);
    return {
      success: false,
      message:
        error?.response?.data?.message || error.message || "Login request failed",
    };
  }
}
 */


import axios from "axios";

// Create Axios instance

/**
 * Creating an instance of axios
 */
export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Defines ApiLogin function.  Sends login request to backend via sign-in endpoint.
 * @param username 
 * @param password 
 * @returns An object with succcess (Boolean), token (string), role (string), message (string)
 */

export async function ApiLogin(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; role?: string; message?: string }> {
  try {
    const response = await api.post("http://192.168.1.244:5143/api/auth/sign-in", {
      username,
      password,
    });

    const data = response.data;
console.log("Shape of data", data);
    // Check if API returned success true and data with token & role
    if (response.status === 200 && data?.success && data?.data?.accessToken && data?.data?.role) {
      // Set default Authorization header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${data.data.accessToken}`;

      return {
        success: true,
        token: data.data.accessToken,
        role: data.data.role,
        message: data.message,
      };
    } else {
      // API responded but with success false or missing token/role
      return {
        success: false,
        message: data?.message || "Unexpected response format",
      };
    }
  } catch (error: any) {
    // Catch network or other errors
    console.error("ApiLogin error:", error?.response?.data || error.message);
    return {
      success: false,
      message:
        error?.response?.data?.message || error.message || "Login request failed",
    };
  }
}
