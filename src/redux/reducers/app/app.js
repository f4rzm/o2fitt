import types from '../../../constants/actionTypes';

const INITIAL_STATE = {
  appIsLoading: true,
  networkConnectivity: true,
  networkConnectionType: null,
  unreadMessages: 0,
  foodDataBaseVersion: 0,
  measureUnit: {
    version: -0.01,
    measureUnits: [],
  },
  showBottomTab: true,
  isForceUpdate: false
};

export const app = (state = INITIAL_STATE, action) => {
  console.log('app reducer => action =>', action);
  switch (action.type) {
    case types.TOKEN_LOADING_FINISHED:
      return {
        ...state,
        appIsLoading: false,
      };
    case types.SET_NETWORK_STATE:
      return {
        ...state,
        networkConnectivity: action.data.networkConnectivity,
        networkConnectionType: action.data.networkConnectionType,
      };
    case types.SET_UNREAD_MESSAGES_NUMBER:
      return {
        ...state,
        unreadMessages: action.data,
      };
    case types.UPDATE_UNIT_MEASUREMENT:
      return {
        ...state,
        measureUnit: action.data,
      };
    case types.UPDATE_SHOW_BOTTOM_TAB:
      return {
        ...state,
        showBottomTab: action.data,
      };

    default:
      return state;
  }
};
