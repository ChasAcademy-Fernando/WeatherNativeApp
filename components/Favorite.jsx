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
  HomeIcon,
  HomeModernIcon,
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

const Favorite = ({ city, setGoBack }) => {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [forecastday, setForecastday] = useState({});
  const [showForecastday, setShowForecastday] = useState(false);
  const [celsius, setCelsius] = useState(true);

  const fetchWeatherStart = async () => {
    fetchWeatherForeCast({ cityName: city ? `${city}` : "Stockholm" }).then(
      (data) => {
        setWeather(data);
        setLoading(false);
      }
    );
  };
  useEffect(() => {
    fetchWeatherStart();
  }, []);
  /*Current date */
  let date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });
  date = date.split(",")[0];
  /*Other non-current dates */
  let dateString = forecastday
    ? new Date(forecastday?.date).toLocaleDateString("en-US", {
        weekday: "long",
      })
    : null;

  dateString ? (dateString = dateString.split(",")[0]) : null;
  const windowHeight = useWindowDimensions().height;

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
      {loading ? (
        <View className='justify-center flex-1 flex-row items-center'>
          <Progress.CircleSnail thickness={10} size={150} color={"#ffffff"} />
        </View>
      ) : !showForecastday ? (
        <SafeAreaView className='flex flex-1 p-2'>
          <View className=' mx-4 flex justify-around flex-1 mb-2'>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setGoBack(true);
                }}
              >
                <HomeIcon size={50} fill={"white"} />
              </TouchableOpacity>
            </View>
            <Text className=' text-white text-center text-2xl font-bold'>
              {location?.name},
              <Text className=' text-lg font-semibold text-gray-300'>
                {" " + location?.country}
              </Text>
            </Text>
            <View className='flex-row items-center justify-end  -mt-5 -mb-14'>
              <Switch
                value={celsius}
                onValueChange={() => {
                  setCelsius(!celsius);
                }}
              />
              <Text className=' text-white text-base'>
                &#176;{celsius ? "C" : "F"}
              </Text>
            </View>
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
                {celsius ? current?.temp_c : current?.temp_f}&#176;
                {celsius ? "C" : "F"}
              </Text>
              <Text className='text-center  text-white text-base tracking-widest'>
                Feels like {celsius ? current.feelslike_c : current.feelslike_f}
                &#176;
                {celsius ? "C" : "F"}
              </Text>
              <Text className=' text-center  text-white text-xl tracking-widest'>
                {date}
              </Text>

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
                  {celsius ? current?.wind_kph : current?.wind_mph}{" "}
                  {celsius ? " km/h" : "mph"}
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
                <Text className='text-white font-semibold text-base'>
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
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
              <Forecast
                weather={weather}
                setForecastday={setForecastday}
                setShowForecastday={setShowForecastday}
              />
            </ScrollView>
          </View>
        </SafeAreaView>
      ) : (
        showForecastday && (
          <SafeAreaView className='flex flex-1 p-2'>
            <View className=' mx-4 flex justify-around flex-1 mb-2'>
              <Text className=' text-white text-center text-2xl font-bold'>
                {location?.name},
                <Text className=' text-lg font-semibold text-gray-300'>
                  {" " + location?.country}
                </Text>
              </Text>
              <View className='flex-row items-center justify-between  -mt-5 -mb-14'>
                <TouchableOpacity
                  className='  flex-row justify-center items-center'
                  onPress={() => {
                    setShowForecastday(false);
                  }}
                >
                  <ArrowLeftCircleIcon size={50} color={"#ffffff"} />
                </TouchableOpacity>
                <View className='flex-row items-center'>
                  <Switch
                    value={celsius}
                    onValueChange={() => {
                      setCelsius(!celsius);
                    }}
                  />
                  <Text className=' text-white text-base'>
                    &#176;{celsius ? "C" : "F"}
                  </Text>
                </View>
              </View>
              <View className=' flex-row justify-center'>
                <Image
                  source={{
                    uri: "https:" + forecastday?.day?.condition?.icon,
                  }}
                  className='w-52 h-52'
                />
              </View>

              <View className=' space-y-2'>
                <Text className=' text-center font-bold text-white text-6xl ml-5'>
                  {celsius
                    ? forecastday?.day?.avgtemp_c
                    : forecastday?.day?.avgtemp_f}
                  &#176;
                  {celsius ? "C" : "F"}
                </Text>

                <Text className=' text-center  text-white text-xl tracking-widest'>
                  {dateString}
                </Text>

                {/* Fixa celius och farenhait function*/}
                <Text className=' text-center  text-white text-xl tracking-widest'>
                  {forecastday?.day?.condition?.text}
                </Text>
              </View>
              <View className=' justify-between flex-row mx-4'>
                <View className=' flex-row space-x-2 items-center'>
                  <Image
                    className='h-6 w-6'
                    source={require("../assets/windy.png")}
                  />
                  <Text className='text-white font-semibold text-base'>
                    {celsius
                      ? forecastday?.day?.maxwind_kph
                      : forecastday?.day?.maxwind_mph}{" "}
                    {celsius ? " km/h" : "mph"}
                  </Text>
                </View>
                <View className=' flex-row space-x-2 items-center'>
                  <Image
                    className='h-6 w-6'
                    source={require("../assets/humidity.png")}
                  />
                  <Text className='text-white font-semibold text-base'>
                    {forecastday?.day?.avghumidity}%
                  </Text>
                </View>
                <View className=' flex-row space-x-2 items-center'>
                  <Image
                    className='h-6 w-6'
                    source={require("../assets/sun.png")}
                  />
                  <Text className='text-white font-semibold text-base'>
                    {forecastday?.astro?.sunrise}
                  </Text>
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
                <Forecast
                  weather={weather}
                  celsius={celsius}
                  setForecastday={setForecastday}
                  setShowForecastday={setShowForecastday}
                />
              </ScrollView>
            </View>
          </SafeAreaView>
        )
      )}
    </View>
  );
};

export default Favorite;
