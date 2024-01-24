import Swipeout from "react-native-swipeout";
import { useState, useEffect, useContext } from "react";
import { TimeContext } from "../context/TimeContext";
import { PayRateContext } from "../context/TimeContext";
import { Button } from "native-base";
import { InputNativeBase } from "../components/FormInput";
import {
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Stack,
  Center,
  NativeBaseProvider,
} from "native-base";

import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Constants from "expo-constants";
import * as SQLite from "expo-sqlite";
import TimePicker from "./TabOneScreen";
function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("db.db");
  return db;
}

const db = openDatabase();

function Items({ done: doneHeading, onPressItem }) {
  const [items, setItems] = useState(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from items where done = ?;`,
        [doneHeading ? 1 : 0],
        (_, { rows: { _array } }) => setItems(_array)
      );
    });
  }, []);

  const heading = doneHeading ? "Completed" : "Todo";

  const { hoursDifference, setHoursDifference } = useContext(TimeContext);

  if (items === null || items.length === 0) {
    return (
      <TimeContext.Provider value={{ hoursDifference, setHoursDifference }}>
        <TimePicker setHoursDifference={setHoursDifference} />
      </TimeContext.Provider>
    );
  }
  return (
    <TimeContext.Provider value={{ hoursDifference, setHoursDifference }}>
      {/* <TimePicker setHoursDifference={setHoursDifference} /> */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>{heading}</Text>
        {items.map(({ id, done, value, rate }) => (
          <Swipeout
            right={[
              {
                text: "Delete",
                backgroundColor: "#FF3B30",
                onPress: () => onPressItem(id),
              },
            ]}
            autoClose={true}
            backgroundColor="transparent"
          >
            <TouchableOpacity
              key={id}
              onPress={() => onPressItem}
              style={{
                backgroundColor: done ? "#1c9963" : "#fff",
                borderColor: "#000",
                borderWidth: 1,
                padding: 8,
              }}
            >
              <Text style={{ color: done ? "#fff" : "#000" }}>{value}/H</Text>
              <Text style={{ color: done ? "#fff" : "#000" }}>
                {value * Number(rate)}$
              </Text>
            </TouchableOpacity>
          </Swipeout>
        ))}

        <Text style={styles.sectionHeading}>
          Number of Hours:
          {/* count the total value */}
          {items
            .reduce((sum, item) => sum + parseFloat(item.value), 0)
            .toFixed(1)}
        </Text>
        <Text style={styles.sectionHeading}>Total Entries: {items.length}</Text>
      </View>
    </TimeContext.Provider>
  );
}

export default function App() {
  const [text, setText] = useState(null);
  const [payRate, setPayRate] = useState(null);
  const [payRateError, setPayRateError] = useState(null);
  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const { hoursDifference, setHoursDifference } = useContext(TimeContext);

  useEffect(() => {
    db.transaction((tx) => {
      // tx.executeSql("select * from items", [], (_, { rows }) =>
      //   console.log(JSON.stringify(rows))
      // );

      tx.executeSql(
        "create table if not exists items (id integer primary key not null, done int, value text);"
      );
      tx.executeSql("ALTER TABLE items ADD COLUMN rate TEXT;");
    });
  }, []);

  const add = (hoursDifference, payRate) => {
    // Check if hoursDifference and payRate are not empty
    if (
      hoursDifference === null ||
      hoursDifference === "" ||
      payRate === null ||
      payRate === ""
    ) {
      setPayRateError("Pay rate must be set.");
      return false; // Return false if the operation was not successful
    }

    setPayRateError(null); // Clear the error message if payRate is set

    // Perform the database transaction
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into items (done, value, rate) values (0, ?, ?)",
          [hoursDifference, payRate]
        );
        tx.executeSql("select * from items", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      },
      null,
      forceUpdate
    );

    return true; // Return true if the operation was successful
  };
  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Text style={styles.heading}>Job Payroll</Text>

        {Platform.OS === "web" ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={styles.heading}>
              Expo SQlite is not supported on web!
            </Text>
          </View>
        ) : (
          <>
            <TimeContext.Provider
              value={{ hoursDifference, setHoursDifference }}
            >
              <TimePicker setHoursDifference={setHoursDifference} />

              <View style={styles.flexRow}>
                <View style={{ flexDirection: "column" }}>
                  <TextInput
                    onChangeText={(text) => setText(text)}
                    placeholder={
                      hoursDifference?.toString().length > 0
                        ? hoursDifference.toString()
                        : "Hours"
                    }
                    placeholderTextColor="#ff0000" // Red color for placeholder text
                    style={styles.input}
                    value={hoursDifference} // Use hoursDifference here
                    keyboardType="numeric" // Only accept numeric input
                  />
                  <InputNativeBase
                    onChangeText={(payRate) => setPayRate(payRate)}
                    placeholder="Pay Rate"
                    placeholderTextColor="#ff0000"
                    style={styles.input}
                    value={payRate}
                    keyboardType="numeric" // Only accept numeric input
                  />
                  {/* <InputNativeBase
                    onChangeText={(text) => setText(text)}
                    value={payRate}
                  /> */}
                  {payRateError && (
                    <Text style={styles.errorMessage}>{payRateError}</Text>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <Button
                    onPress={() => {
                      const isSuccessful = add(hoursDifference, payRate); // Pass payRate here
                      if (isSuccessful) {
                        setText(null);
                        setHoursDifference(null);
                        setPayRate(null);
                      }
                    }}
                  >
                    Add
                  </Button>
                </View>
              </View>
            </TimeContext.Provider>

            <ScrollView style={styles.listArea}>
              <Items
                key={`forceupdate-todo-${forceUpdateId}`}
                done={false}
                onPressItem={(id) =>
                  db.transaction(
                    (tx) => {
                      tx.executeSql(`update items set done = 1 where id = ?;`, [
                        id,
                      ]);
                    },
                    null,
                    forceUpdate
                  )
                }
              />
              {/* this is for completed to be rendered  */}
              {/* <Items
              done
              key={`forceupdate-done-${forceUpdateId}`}
              onPressItem={(id) =>
                db.transaction(
                  (tx) => {
                    tx.executeSql(`delete from items where id = ?;`, [id]);
                  },
                  null,
                  forceUpdate
                )
              }
            /> */}
            </ScrollView>
          </>
        )}
      </View>
    </NativeBaseProvider>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
  buttonContainer: {
    // width: "auto", // or a specific width like '50%' or '200'
    alignItems: "center", // to center the button horizontally
    padding: 10, // add some padding to the button
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  flexRow: {
    flexDirection: "column",
  },
  input: {
    borderColor: "#4630eb",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    height: 48,
    margin: 16,
    padding: 8,
  },
  listArea: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    paddingTop: 16,
  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    marginBottom: 8,
  },
  errorMessage: {
    color: "red",
    marginTop: 8,
  },
});
