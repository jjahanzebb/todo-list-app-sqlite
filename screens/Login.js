import {
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import db from "../sqliteConfig";

const Login = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    createTable();
    getData();
  }, []);

  // Creatng table in Database
  const createTable = () => {
    console.log("db ==>", db);
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Users (uid INTEGER PRIMARY KEY AUTOINCREMENT, Username TEXT, Password TEXT);"
      );

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS Todos (tid INTEGER PRIMARY KEY AUTOINCREMENT, color TEXT, heading TEXT, createdAt TEXT, completed NUMERIC, uid INTEGER);"
      );
    });
  };

  // Insert into Table of Database
  const setData = async () => {
    if (username.length == 0 || password.length == 0) {
      Alert.alert("Wrong Credentials!", "Please enter Username and Password");
    } else {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT Username, Password FROM Users",
            [],
            (tx, results) => {
              console.log("setData 1 ==>", results);
              var temp = 0;
              for (let i = 0; i < results.rows.length; ++i) {
                if (
                  username === results.rows.item(i).Username &&
                  password === results.rows.item(i).Password
                )
                  temp++;
              }

              if (temp > 0) {
                navigation.navigate("Home", { username, password });
              } else {
                var temp = 0;
                for (let i = 0; i < results.rows.length; ++i) {
                  if (
                    username === results.rows.item(i).Username &&
                    password != results.rows.item(i).Password
                  )
                    temp++;
                }

                if (temp > 0) {
                  Alert.alert(
                    "Username already exists!",
                    "Please enter correct password"
                  );
                } else {
                  tx.executeSql(
                    "INSERT INTO Users (Username, Password) VALUES (?,?)",
                    [username, password],
                    (tx, res) => {
                      console.log(res);
                    },
                    (tx, err) => {
                      console.log(err);
                    }
                  );

                  navigation.navigate("Home", { username, password });
                }
              }
            }
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Fetch data from Database and login if data is saved already
  const getData = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT Username, Password FROM Users WHERE Username=? AND Password=?",
          [username, password],
          (tx, results) => {
            console.log("getData 1 ==>", results);

            var len = results.rows.length;
            if (len > 0) {
              navigation.navigate("Home", { username, password });
            }
          }
        );
      });
    } catch (error) {
      console.log("FETCH ERROR => ", error);
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: "#1D3557" }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={"#1D3557"} />

      {/* white container */}
      <View style={[tw`flex-1`, { backgroundColor: "#1D3557" }]}>
        {/* Top Bar */}
        <View style={[tw`justify-between flex-row mt-40 mx-4 rounded-lg`]}>
          {/* Logo */}
          <View style={[tw`flex-row justify-center flex-1`]}>
            <Text
              style={[
                tw`text-4xl font-800 rounded-l-lg pl-2 pr-1.2 py-0.5`,
                { color: "#F1FCFE", backgroundColor: "transparent" },
              ]}
            >
              My
            </Text>

            <Text
              style={[
                tw`text-4xl font-800 rounded-lg px-2 py-1`,
                {
                  color: "#F1FCFE",
                  backgroundColor: "#3890C7",
                  elevation: 2,
                },
              ]}
            >
              to-dos
            </Text>
          </View>
        </View>

        {/* formContainer */}
        <View style={[tw`mx-4 mt-18 px-10`, { elevation: 0 }]}>
          {/* input */}
          <Text
            style={[
              tw`text-base font-bold pb-4 self-center`,
              { backgroundColor: "transparent", color: "#F1FCFE" },
            ]}
          >
            Login Credentials
          </Text>
          <TextInput
            style={[
              tw`h-12 rounded-xl px-4 pr-2 text-base overflow-hidden `,
              { backgroundColor: "#F1FCFE", color: "#1D3557", elevation: 5 },
            ]}
            placeholderTextColor="#888899"
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="Enter Username.."
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          {/* input */}
          <TextInput
            style={[
              tw`h-12 rounded-xl px-4 pr-2 mt-2 text-base overflow-hidden `,
              { backgroundColor: "#F1FCFE", color: "#1D3557", elevation: 5 },
            ]}
            placeholderTextColor="#888899"
            onChangeText={(text) => setPassword(text)}
            value={password}
            placeholder="Enter Password.."
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            secureTextEntry={true}
          />

          {/* button */}
          <TouchableOpacity
            style={[
              tw`h-12 rounded-xl pr-4 mt-4 items-center justify-center flex-row`,
              { backgroundColor: "#6ab934", elevation: 10 },
            ]}
            onPress={setData}
            activeOpacity={0.5}
          >
            <MaterialCommunityIcons
              style={[tw`text-xl -mb-0.5`, { elevation: 5 }]}
              name="login-variant"
              color="#F1FCFE"
            />

            {/* buttonText */}
            <Text style={[tw`text-base ml-4`, { color: "#F1FCFE" }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({});
