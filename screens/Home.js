import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import db from "../sqliteConfig";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [username, setUsername] = useState("-");
  const [addData, setAddData] = useState("");
  const [loading, isLoading] = useState(false);

  const navigation = useNavigation();

  // fetch/read todo from firebase database
  useEffect(() => {
    isLoading(true);
    getData();
    isLoading(false);
  }, []);

  // delete/remove todo from firebase database
  const deleteTodo = async (item) => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql(
          "DELETE FROM Todos WHERE tid=?",
          [item.tid],
          (res) => {
            getData();
          }
        );
      });
    } catch (error) {
      console.log("ERROR! DELETE TODO => ", error);
    }
  };

  // add/save a todo item
  const addTodo = async () => {
    // validate todo (if we have todo / todo is not empty)
    if (addData && addData.length > 0) {
      // get the timestamp of todo creation

      isLoading(true);
      const createdAt = new Date().toDateString();
      const color = generateColor();
      const heading = addData;
      const completed = false;

      await db.transaction(async (tx) => {
        await tx.executeSql(
          "INSERT INTO Todos (color, heading, createdAt, completed) VALUES (?,?,?,?)",
          [color, heading, createdAt, completed],
          (tx, res) => {
            console.log(res);

            setAddData("");
            getData();
            // hide keyboard after adding
            Keyboard.dismiss();
          },
          (tx, err) => {
            console.log(err);
          }
        );
      });
    }
  };

  // updates to-do if it is completed or not in database
  const handleChecked = async (item) => {
    try {
      if (item.completed === 1) item.completed = 0;
      else item.completed = 1;

      await db.transaction(async (tx) => {
        await tx.executeSql(
          "UPDATE Todos SET completed=? WHERE tid=?",
          [item.completed, item.tid],
          (res) => {
            getData();
          }
        );
      });
    } catch (error) {
      console.log("ERROR! COMPLETED UPDATE => ", error);
    }
  };

  // generates random color to store with to-do
  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    return `#${randomColor}`;
  };

  // Fetch data from Database
  const getData = async () => {
    try {
      await db.transaction(async (tx) => {
        await tx.executeSql("SELECT Username FROM Users", [], (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            setUsername(results.rows.item(0).Username);
          }
        });

        await tx.executeSql(
          "SELECT * FROM Todos ORDER BY tid DESC",
          [],
          async (tx, results) => {
            var len = results.rows.length;
            console.log(len);
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));

            await setTodos(temp);
          }
        );
      });

      isLoading(false);
    } catch (error) {
      console.log("FETCH ERROR => ", error);
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: "#1D3557" }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={"#1D3557"} />

      {/* white container */}
      <View
        style={[tw`flex-1 rounded-tl-full`, { backgroundColor: "#F1FCFE" }]}
      >
        {/* Top Bar */}
        <View style={[tw`justify-between flex-row mt-8 mx-4 rounded-lg`]}>
          <View style={tw`flex-row items-center`}>
            {/* back button */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Login");
              }}
              activeOpacity={0.5}
            >
              <SimpleLineIcons
                style={[tw`text-xl -ml-0.5 mt-0.25 px-2 rounded-full`, {}]}
                name="logout"
                color="#F1FCFE"
              />
            </TouchableOpacity>

            <Text
              style={[
                tw`text-2xl font-semibold rounded-l-lg pl-2 pr-1.2 py-0.5`,
                { color: "#F1FCFE" },
              ]}
            >
              Home
            </Text>
          </View>

          {/* Logo */}
          <View style={[tw`flex-row`]}>
            <Text
              style={[
                tw`text-2xl font-800 rounded-l-lg pl-2 pr-1.2 py-0.5`,
                { color: "#3890C7", backgroundColor: "transparent" },
              ]}
            >
              My
            </Text>

            <Text
              style={[
                tw`text-2xl font-800 rounded-lg px-2 py-0.5`,
                { color: "#F1FCFE", backgroundColor: "#3890C7", elevation: 2 },
              ]}
            >
              to-dos
            </Text>
          </View>
        </View>

        <View>
          <Text
            style={[tw`text-base font-semibold pl-6`, { color: "#F1FCFE" }]}
          >
            Welcome,
            {"\n" + username[0].toUpperCase() + username.slice(1)}
          </Text>
        </View>

        {/* formContainer */}
        <View
          style={[tw`flex-row h-12 mx-4 mt-14 rounded-xl`, { elevation: 10 }]}
        >
          {/* input */}
          <TextInput
            style={[
              tw`h-12 rounded-l-xl px-4 pr-2 text-base overflow-hidden flex-1`,
              { backgroundColor: "#1D3557", color: "#F1FCFE", elevation: 5 },
            ]}
            placeholder="Enter a new to-do.."
            placeholderTextColor="#888899"
            onChangeText={(heading) => setAddData(heading)}
            value={addData}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          {/* button */}
          <TouchableOpacity
            style={[
              tw`h-12 rounded-r-xl px-4.5 items-center justify-center`,
              { backgroundColor: "#3890C7", elevation: 10 },
            ]}
            onPress={addTodo}
            activeOpacity={0.5}
          >
            {/* buttonText */}
            {/* <Text style={[tw`text-base`, { color: "#F1FCFE" }]}>Add</Text> */}

            <Entypo
              style={[tw`text-xl`, { elevation: 5 }]}
              name="plus"
              color="#F1FCFE"
            />
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator style={tw`mt-4`} color={"#3890C7"} />}
        <FlatList
          style={tw`pt-4 rounded-xl mx-4`}
          data={todos}
          keyExtractor={(item) => item.tid}
          numColumns={1}
          renderItem={({ item }) => (
            <View style={tw`rounded-xl mt-2 `}>
              {/* container */}
              <TouchableOpacity
                style={[
                  tw`h-12 pr-4  flex-row items-center rounded-xl `,
                  { backgroundColor: "#1D3557", elevation: 5 },
                ]}
                onPress={() => navigation.navigate("Details", { item })}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    tw`w-2.5 h-12 rounded-l-xl`,
                    {
                      backgroundColor: item.color,
                    },
                  ]}
                />

                <TouchableOpacity
                  style={tw`ml-2 rounded-full w-8 h-8 border-2 border-white items-center justify-center  ${
                    item.completed === 1 && "bg-emerald-500"
                  }`}
                  onPress={() => handleChecked(item)}
                >
                  {item.completed === 1 && (
                    <MaterialCommunityIcons
                      style={[tw`text-base`, { elevation: 2 }]}
                      name="check-bold"
                      color="#F1FCFE"
                    />
                  )}
                </TouchableOpacity>

                {/* innerContainer */}
                <View style={tw`items-center flex-row ml-3 flex-1`}>
                  {/* itemHeading */}
                  <Text
                    style={[
                      { color: "#F1FCFE" },
                      tw`text-base font-bold mr-5 ${
                        item.completed === 1 &&
                        "line-through text-slate-400 font-semibold"
                      }`,
                    ]}
                  >
                    {item.heading[0].toUpperCase() + item.heading.slice(1)}
                  </Text>
                </View>

                {/* todoIcon */}
                <TouchableOpacity
                  style={[
                    tw`text-2xl -mr-4 py-2.5 px-4.5 rounded-r-xl`,
                    {
                      backgroundColor: "#E63946",
                    },
                  ]}
                  onPress={() => deleteTodo(item)}
                >
                  <MaterialCommunityIcons
                    style={[tw`text-xl`, { elevation: 5 }]}
                    name="delete-outline"
                    color="#F1FCFE"
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
