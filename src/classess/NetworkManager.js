import NetInfo from "@react-native-community/netinfo";

export class NetworkManager {
    addListener=(callback)=>{
        NetInfo.addEventListener(state => {
            callback(state.isConnected , state.type)
        });
    }

    getNetworkState = (callback)=>{
        NetInfo.fetch().then(state => {
            callback(state.isConnected , state.type)
        });
    }
}