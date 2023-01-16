import actions from "../../constants/actionTypes"

export const tokenLoadingFinished = () => {
    return {
        type: actions.TOKEN_LOADING_FINISHED
    }
}

export const setNetworkStatus = (isConnencted, connectionType) => {
    return {
        type: actions.SET_NETWORK_STATE,
        data: {
            networkConnectivity: isConnencted,
            networkConnectionType: connectionType
        }
    }
}

export const setUnreadMessageNumber = (data) => {
    return {
        type: actions.SET_UNREAD_MESSAGES_NUMBER,
        data: data
    }
}
export const updateUnitMeasurement = data => {
    return {
        type: actions.UPDATE_UNIT_MEASUREMENT,
        data,
    };
};
export const updateShowBottomTab = data => {
    return {
        type: actions.UPDATE_SHOW_BOTTOM_TAB,
        data,
    };
};
