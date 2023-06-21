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
} from "react-native";
import {
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
const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});

  const handleLocation = (loc) => {
    console.log("Location ", loc);
    setLocations([]);
    toggleSearch(false);
    fetchWeatherForeCast({ cityName: loc.name }).then((data) =>
      setWeather(data)
    );
  };

  const handelSearch = (value) => {
    if (value.length > 3) {
      fetchLocation({ cityName: value }).then((data) => {
        console.log(data);
        setLocations(data);
      });
    }
  };
  useEffect(() => {}, []);
  const windowHeight = useWindowDimensions().height;
  const handleSearchDebounce = useCallback(debounce(handelSearch), []);
  const { current, location } = weather;
  return (
    <View
      className='flex-1 relative'
      style={[{ minHeight: Math.round(windowHeight) }]}
    >
      <StatusBar style='light' />
      <Image
        className=' absolute h-full w-full'
        blurRadius={70}
        source={{
          uri: "https://images.unsplash.com/photo-1552688468-d87e6f7a58f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        }}
      />
      <SafeAreaView className='flex flex-1'>
        <View style={{ height: "7%" }} className=' relative z-50 mx-4'>
          <View
            className=' flex-row justify-end items-center rounded-full'
            style={{
              backgroundColor: showSearch
                ? "rgba(255, 255, 255, .3)"
                : "transparent",
            }}
          >
            {showSearch ? (
              <TextInput
                onChangeText={handleSearchDebounce}
                placeholder=' Search'
                placeholderTextColor={"white"}
                className=' h-10 flex-1 text-base text-white pl-6'
              />
            ) : null}

            <TouchableOpacity
              onPress={() => {
                toggleSearch(!showSearch);
              }}
              style={{ backgroundColor: "rgba(255, 255, 255, .3)" }}
              className=' rounded-full p-3 m-1'
            >
              <MagnifyingGlassIcon size={25} color='white' />
            </TouchableOpacity>
          </View>
          {locations.length > 0 && showSearch ? (
            <View className=' absolute w-full bg-gray-300 rounded-3xl top-16'>
              {locations.map((loc, index) => {
                let showBorder = index + 1 != locations.length;
                let borderClass = showBorder
                  ? " border-b-2 border-b-gray-400"
                  : "";
                return (
                  <TouchableOpacity
                    onPress={() => {
                      handleLocation(loc);
                    }}
                    key={index}
                    className={`flex-row items-center border-0 p-3 px-4 my-1 ${borderClass}`}
                  >
                    <MapPinIcon size={20} color={"gray"} />
                    <Text className=' text-lg ml-2 '>
                      {loc.name}, {loc.country}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        <View className=' mx-4 flex justify-around flex-1 mb-2'>
          <Text className=' text-white text-center text-2xl font-bold'>
            {location?.name},
            <Text className=' text-lg font-semibold text-gray-300'>
              {" " + location?.country}
            </Text>
          </Text>
          <View className=' flex-row justify-center'>
            <Image
              source={{
                uri: "https:" + current?.condition?.icon,
              }}
              className='w-52 h-52'
            />
          </View>
          <View className=' space-y-2'>
            <Text className=' text-center font-bold text-white text-6xl ml-5'>
              {current?.temp_c}&#176;
            </Text>
            {/* Fixa celius och farenhait function*/}
            <Text className=' text-center  text-white text-xl tracking-widest'>
              {current?.condition?.text}
            </Text>
          </View>
          <View className=' justify-between flex-row mx-4'>
            <View className=' flex-row space-x-2 items-center'>
              <Image
                className='h-6 w-6'
                source={require("../assets/windy.png")}
              />
              <Text className='text-white font-semibold text-base'>
                {current?.wind_kph} km/h
              </Text>
            </View>
            <View className=' flex-row space-x-2 items-center'>
              <Image
                className='h-6 w-6'
                source={require("../assets/humidity.png")}
              />
              <Text className='text-white font-semibold text-base'>
                {current?.humidity}%
              </Text>
            </View>
            <View className=' flex-row space-x-2 items-center'>
              <Image
                className='h-6 w-6'
                source={require("../assets/sun.png")}
              />
              <Text className='text-white font-semibold text-base'>05.45</Text>
            </View>
          </View>
        </View>
        <View className=' mb-2 space-y-3'>
          <View className=' flex-row items-center mx-5 space-x-2'>
            <CalendarDaysIcon size={22} color={"white"} />
            <Text className=' text-white text-base'>Daily forecast</Text>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
          >
            <Forecast weather={weather} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
