import { View, Text, Image } from "react-native";
const Forecast = ({ weather }) => {
  console.log("forecast 7 days working", weather?.forecast?.forecastday);
  return (
    <>
      {weather?.forecast?.forecastday.map((dayObj, index) => {
        let dateString = new Date(dayObj.date).toLocaleDateString("en-US", {
          weekday: "long",
        });
        dateString = dateString.split(",")[0];
        return (
          <View
            key={index}
            className=' flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'
            style={{ backgroundColor: "rgba(255, 255, 255, .2)" }}
          >
            <Image
              className=' w-11 h-11'
              source={{
                uri: "https:" + dayObj?.day?.condition?.icon,
              }}
            />
            <Text className=' text-white'>{dateString}</Text>
            <Text className=' text-white text-xl font-semibold'>
              {dayObj?.day?.avgtemp_c}&#176;
            </Text>
          </View>
        );
      })}
    </>
  );
};

export default Forecast;
