import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { api } from "../api";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";
import { useAuth } from "../Context/AuthContext";
import { ItemContext } from "../Context/context";
import { FontContext } from "../Context/fontContext";
import { StyleSheet } from "react-native";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

const API_URL = "http://172.19.159.72:5143/api/profile";

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { login } = useAuth();
  const { logout } = useAuth();
  const authContext = useContext(AuthContext);
  const context = useContext(ItemContext);
  if (!context) return null;
  //const { fontSize } = context;
  const fontContext = useContext(FontContext);

  if (!authContext) {
    return <Text>Loading...</Text>;
  }

  const [bulletins, setBulletins] = useState<
    {
      id: string;
      title: string;
      content: string;
      createdById: string;
      createdByUsername: string;
      createdAt: string;
      updatedAt: string;
      category: string;
    }[]
  >([]);

  const [username, setUsername] = useState("");
  //const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [membershipDate, setMembershipDate] = useState("");
  const [loading, setLoading] = useState(true);

  const { token, setToken } = authContext;

  /* const getItems = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched items:', data);
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}; */
  /* 

  useEffect(() => {

    const fetchProfile = async () =>{
        try{
            const response = await fetch (API_URL, {

            }
        })
    
    if (!response.ok){
        throw new Error (`Error: ${response.status}`)
    }
const data = await Response.json();
setUsername (data.username);




    fetch(API_URL)
      .then(res => res.json())
      .then(data => console.log(data))
      .finally(() => setLoading(false));
  }, []);
 */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error(`${response.status}`);

        //const data = await response.json();
        //console.log("Fetched profile data:", responseJson);

        const responseJson = await response.json();
        const userData = responseJson.data;
        setUsername(userData.username);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setRole(userData.role);
        setMembershipDate(userData.membershipDate);
        setBulletins(userData.myBulletins ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    authContext.logout();
    navigation.reset({ index: 0, routes: [{ name: "Atrium" }] });
  };

  const handleSubmit = async () => {
    // Assuming you have form fields like 'username', 'email', etc.
    if (
      !username.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !role.trim() ||
      !membershipDate.trim()
    ) {
      window.alert("all fields necessary");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          firstName,
          lastName,
          email,
          //role,
          // membershipDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Updated item:", data);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Update the state or perform any checks
  // Navigate and pass form data to the next screen

  /*     
      try {
        const success = await login(username, password);
        if (success) {
          //setToken(res.data.token)
          window.alert("LOgged in");
          navigation.navigate("BulletinChoice");
        } else {
          window.alert("Login failed");
        }
      } catch {
        window.alert("Error");
      }
    } else {
      window.alert("Fill out all fields");
    }
  }; */

  /*  const login = async (name: string) => {


  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Item created:', data);
  } catch (error) {
    console.error('Error creating item:', error);
  } */

  return (
    <ScrollView>
      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        Profile Screen
      </Text>

      {/*  <TextInput
        //placeholder="Enter username"
        value={username}
        editable = {false}
       // onChangeText={(newText) => setUsername(newText)}
        style={{ fontSize: fontContext?.fontSize || 16 }}
      /> */}

      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        Username: {username}
      </Text>

      <TextInput
        placeholder="Enter first name"
        value={firstName}
        onChangeText={(newText) => setFirstName(newText)}
        style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
      />

      <TextInput
        placeholder="Enter last name"
        value={lastName}
        onChangeText={(newText) => setLastName(newText)}
        style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
      />

      <TextInput
        placeholder="Enter email"
        value={email}
        onChangeText={(newText) => setEmail(newText)}
        style={[styles.input, { fontSize: fontContext?.fontSize || 16 }]}
      />

      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        Membership date: {membershipDate}
      </Text>

      {/*       <TextInput
       // placeholder="Enter role"
        value={role}
        editable = {false}
        //onChangeText={(newText) => setRole(newText)}
        style={{ fontSize: fontContext?.fontSize || 16 }}
      /> */}

      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        Role: {role}
      </Text>

      <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        Your bulletins
      </Text>

      {bulletins.length === 0 ? (
        <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
          No bulletins yet
        </Text>
      ) : (
        bulletins.map((bulletin) => (
          <View key={bulletin.id}>
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              {bulletin.title}
            </Text>
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              {bulletin.category}
            </Text>
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              {bulletin.content}
            </Text>
            <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
              {new Date(bulletin.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))
      )}

      {/* 
      <TextInput
        //placeholder="Enter membership date"
        value={membershipDate}
        editable = {false}
        onChangeText={(newText) => setMembershipDate(newText)}
        style={{ fontSize: fontContext?.fontSize || 16 }}
      /> */}

      {/*    <Text style={{ fontSize: fontContext?.fontSize || 16 }}>
        Membership date: {membershipDate}
      </Text> */}

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.buttonLeft} onPress={handleSubmit}>
          <Text
            style={{
              color: "white",
              fontSize: fontContext?.fontSize || 16,
              //backgroundColor: "black",
            }}
          >
            Submit
          </Text>
        </TouchableOpacity>

        {/*       <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text
          style={{
            color: "white",
            fontSize: fontContext?.fontSize || 16,
            backgroundColor: "black",
          }}
        >
          Register
        </Text>
      </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.buttonRight}
          onPress={() => navigation.navigate("Settings")}
        >
          <Text
            style={{
              color: "white",
              fontSize: fontContext?.fontSize || 16,
              //backgroundColor: "black",
            }}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={{
              color: "white",
              fontSize: fontContext?.fontSize || 16,
              //backgroundColor: "black",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonRight} onPress={handleLogout}>
          <Text
            style={{
              color: "white",
              fontSize: fontContext?.fontSize || 16,
              //backgroundColor: "black",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/*       <Button title="Submit" onPress={handleSubmit} />

      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />

      <Button
        title="Settings"
        onPress={() => navigation.navigate("Settings")}
      />
 */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
    backgroundColor: "#FFF5E6",
  },

  list: {},

  input: {
    backgroundColor: "blue",
    color: "white",
    borderRadius: 10,
    margin: 20,
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  buttonLeft: {
    flex: 1,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "black",
  },

  buttonRight: {
    flex: 1,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "black",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: "black",
    borderRadius: 15,
  },
  buttonDisabled: {
    backgroundColor: "grey",
  },
  bulletinButton: {
    backgroundColor: "blue",
    borderRadius: 15,
    marginBottom: 10,
  },
  bulletinText: {
    color: "white",
  },
});
