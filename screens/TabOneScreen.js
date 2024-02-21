import React, { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TimeContext } from "../context/TimeContext";
import { Button } from "native-base";
import { NativeBaseProvider } from "native-base";
import Constants from "expo-constants";

const TimePicker = ({ setHoursDifference }) => {
  const [hoursDifference] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const showStartTimePicker = () => setStartTimePickerVisible(true);
  const hideStartTimePicker = () => setStartTimePickerVisible(false);
  const handleStartTimeConfirm = (selectedTime) => {
    setStartTime(selectedTime);
    hideStartTimePicker();
  };

  const showEndTimePicker = () => setEndTimePickerVisible(true);
  const hideEndTimePicker = () => setEndTimePickerVisible(false);
  const handleEndTimeConfirm = (selectedTime) => {
    setEndTime(selectedTime);
    hideEndTimePicker();
    setTimeout(() => {
      calculateHoursDifference();
    }, 2000);
  };

  const calculateHoursDifference = () => {
    if (startTime && endTime) {
      const differenceInMilliseconds = endTime - startTime;
      const hoursDifference = differenceInMilliseconds / (60 * 60 * 1000);
      setHoursDifference(hoursDifference.toFixed(2));
    } else {
      alert("Please set both start and end times");
    }
  };
  return (
    <TimeContext.Provider value={{ hoursDifference }}>
      <NativeBaseProvider>
        <View style={styles.buttonContainer}>
          <Text>
            Start Time: {startTime ? startTime.toLocaleTimeString() : "Not set"}
          </Text>
          <Button onPress={showStartTimePicker}>Set Start Time</Button>
          <DateTimePickerModal
            isVisible={isStartTimePickerVisible}
            mode="time"
            onConfirm={handleStartTimeConfirm}
            onCancel={hideStartTimePicker}
          />
          <Text>
            End Time: {endTime ? endTime.toLocaleTimeString() : "Not set"}
          </Text>
          <Button onPress={showEndTimePicker}>Set End Time</Button>
          <DateTimePickerModal
            isVisible={isEndTimePickerVisible}
            mode="time"
            onConfirm={handleEndTimeConfirm}
            onCancel={hideEndTimePicker}
          />
          {/* <Button
          title="Calculate Hours Difference"
          onPress={calculateHoursDifference}
        /> */}
          {hoursDifference !== null && (
            <Text>Hours Difference: {hoursDifference.toFixed(2)} hours</Text>
          )}
        </View>
      </NativeBaseProvider>
    </TimeContext.Provider>
  );
};
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
});

export default TimePicker;
