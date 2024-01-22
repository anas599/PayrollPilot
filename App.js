import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useLoadedAssets } from "./hooks/useLoadedAssets";
import Navigation from "./navigation";
import { useColorScheme } from "react-native";
import { TimeContext } from "./context/TimeContext";
import { useState } from "react";
export default function App() {
  const isLoadingComplete = useLoadedAssets();
  const colorScheme = useColorScheme();
  const [hoursDifference, setHoursDifference] = useState(null);
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <TimeContext.Provider value={{ hoursDifference, setHoursDifference }}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </TimeContext.Provider>
    );
  }
}
