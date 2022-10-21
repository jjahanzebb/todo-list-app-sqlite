import {
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
import _BackgroundTimer from "react-native-background-timer";

const Details = ({ route }) => {
  // background timer testing start >
  const [secondsLeft, setSecondsLeft] = useState(3600);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    if (timerOn) startTimer();
    else _BackgroundTimer.stopBackgroundTimer();

    return () => {
      _BackgroundTimer.stopBackgroundTimer();
    };
  }, [timerOn]);

  useEffect(() => {
    if (secondsLeft === 0) _BackgroundTimer.stopBackgroundTimer();
  }, [secondsLeft]);

  const startTimer = () => {
    _BackgroundTimer.runBackgroundTimer(() => {
      setSecondsLeft((secs) => {
        if (secs > 0) return secs - 1;
        else return 0;
      });
    }, 1000);
  };

  const clockify = () => {
    var hours = Math.floor(secondsLeft / 60 / 60);
    var mins = Math.floor((secondsLeft / 60) % 60);
    var seconds = Math.floor(secondsLeft % 60);

    var displayHours = hours < 10 ? "0" + hours : hours;
    var displayMinutes = mins < 10 ? "0" + mins : mins;
    var displaySeconds = seconds < 10 ? "0" + seconds : seconds;

    return {
      displayHours,
      displayMinutes,
      displaySeconds,
    };
  };

  // background timer testing end <

  const [textHeading, onChangeHeadingText] = useState(
    route.params.item.heading
  );
  const navigation = useNavigation();

  const updateTodo = async () => {
    if (textHeading && textHeading.length > 0) {
      console.log(textHeading, route.params.item.tid);
      try {
        await db.transaction(async (tx) => {
          await tx.executeSql(
            "UPDATE Todos SET heading=? WHERE tid=?",
            [textHeading, route.params.item.tid],
            (res) => {
              navigation.navigate("Home");
            }
          );
        });
      } catch (error) {
        console.log("ERROR! COMPLETED UPDATE => ", error);
      }
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: "#1D3557" }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={"#1D3557"} />

      {/* white container */}
      <View
        style={[tw`flex-1 rounded-tr-full `, { backgroundColor: "#F1FCFE" }]}
      >
        {/* Top Bar */}
        <View style={[tw`justify-between flex-row mt-8 mx-4 rounded-lg`]}>
          <View style={tw`flex-row items-center`}>
            {/* back button */}
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              activeOpacity={0.5}
            >
              <Ionicons
                style={[tw`text-2xl -ml-0.5 mt-0.25 px-2 rounded-full`, {}]}
                name="chevron-back"
                color="#1D3557"
              />
            </TouchableOpacity>

            <Text
              style={[
                tw`text-2xl font-semibold rounded-l-lg  pr-1.2 py-0.5`,
                { color: "#1D3557" },
              ]}
            >
              Details
            </Text>
          </View>

          {/* Logo */}
          <View style={[tw`flex-row`]}>
            <Text
              style={[
                tw`text-2xl font-800 rounded-l-lg pl-2 pr-1.2 py-0.5`,
                { color: "#F1FCFE", backgroundColor: "transparent" },
              ]}
            >
              My
            </Text>

            <Text
              style={[
                tw`text-2xl font-800 rounded-lg px-2 py-0.5`,
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
        <View style={[tw`mx-4 mt-30`, { elevation: 0 }]}>
          {/* buttonUpdate */}

          {/* input */}
          <Text
            style={[
              tw`text-base font-bold py-1`,
              { backgroundColor: "transparent", color: "#1D3557" },
            ]}
          >
            Task Heading
          </Text>
          <TextInput
            style={[
              tw`h-12 rounded-xl px-4 pr-2 text-base overflow-hidden `,
              { backgroundColor: "#1D3557", color: "#F1FCFE", elevation: 5 },
            ]}
            placeholderTextColor="#888899"
            onChangeText={onChangeHeadingText}
            value={textHeading}
            placeholder="Update your Task to do.."
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />

          {/* button */}
          <TouchableOpacity
            style={[
              tw`h-12 rounded-xl px-4.5 mt-4 items-center justify-center flex-row`,
              { backgroundColor: "#6ab934", elevation: 10 },
            ]}
            onPress={() => {
              updateTodo();
            }}
            activeOpacity={0.5}
          >
            <MaterialCommunityIcons
              style={[tw`text-xl`, { elevation: 5 }]}
              name="update"
              color="#F1FCFE"
            />

            {/* buttonText */}
            <Text style={[tw`text-base ml-4`, { color: "#F1FCFE" }]}>
              Update To-do
            </Text>
          </TouchableOpacity>

          {/* button */}
          <Text>
            {clockify().displayHours}:{clockify().displayMinutes}:
            {clockify().displaySeconds}
          </Text>
          <TouchableOpacity
            style={[
              tw`h-12 rounded-xl px-4.5 mt-4 items-center justify-center flex-row`,
              { backgroundColor: "#6ab934", elevation: 10 },
            ]}
            onPress={() => {
              setTimerOn((current) => !current);
            }}
            activeOpacity={0.5}
          >
            <MaterialCommunityIcons
              style={[tw`text-xl`, { elevation: 5 }]}
              name="update"
              color="#F1FCFE"
            />

            {/* buttonText */}
            <Text style={[tw`text-base ml-4`, { color: "#F1FCFE" }]}>
              Start/Stop timer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({});
