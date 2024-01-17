import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const TimePicker = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [hoursDifference, setHoursDifference] = useState(null);

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
  };

  const calculateHoursDifference = () => {
    if (startTime && endTime) {
      const differenceInMilliseconds = endTime - startTime;
      const hoursDifference = differenceInMilliseconds / (60 * 60 * 1000);
      setHoursDifference(hoursDifference);
    }
  };

  return (
    <View>
      <Text>
        Start Time: {startTime ? startTime.toLocaleTimeString() : "Not set"}
      </Text>
      <Button title="Set Start Time" onPress={showStartTimePicker} />

      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />

      <Text>
        End Time: {endTime ? endTime.toLocaleTimeString() : "Not set"}
      </Text>
      <Button title="Set End Time" onPress={showEndTimePicker} />

      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />

      <Button
        title="Calculate Hours Difference"
        onPress={calculateHoursDifference}
      />

      {hoursDifference !== null && (
        <Text>Hours Difference: {hoursDifference.toFixed(2)} hours</Text>
      )}
    </View>
  );
};

export default TimePicker;
