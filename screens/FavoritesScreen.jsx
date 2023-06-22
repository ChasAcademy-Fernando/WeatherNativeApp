import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Switch,
  Button,
} from "react-native";
import {
  ArrowDownCircleIcon,
  ArrowLeftCircleIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import Forecast from "../components/Forecast";
import {
  debounce,
  fetchLocation,
  fetchWeatherForeCast,
} from "../api/weatherApi";
import * as Progress from "react-native-progress";
import { getData, storeData } from "../Storage/asyncStorage";
import Favorite from "../components/Favorite";

const FavoritesScreen = ({ navigation, route }) => {
  const [goback, setGoBack] = useState(false);
  const favs = route.params.Cities;
  useEffect(() => {
    if (goback) {
      navigation.navigate("Home");
    }
  }, [goback]);

  return (
    <ScrollView>
      {favs.map((city, index) => {
        return (
          <View key={index}>
            <Favorite city={city} setGoBack={setGoBack} />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default FavoritesScreen;
