import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async(key, value)=>{
    try{
        await AsyncStorage.setItem(key,value)
    }
    catch(err){
        console.log('Error storing data ', err)
    }
}

export const getData = async (key) =>{
    try{
        const data = await AsyncStorage.getItem(key);
        return data;
    }
    catch(err){
        console.log('Error getting data ', err)
    }
}