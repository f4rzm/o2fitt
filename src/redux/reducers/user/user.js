import types from '../../../constants/actionTypes';
import moment from 'moment'
const INITIAL_STATE = {
  language: null,
  lastSeenTime: null,
  isBlocked: false,
  registerDate: null,
  birthDate: null,
  gender: 0,
  imageUri: null,
  firstName: '',
  lastName: '',
  countryId: null,
  country: null,
  isActive: false,
  referreralCode: '',
  referreralInviter: '',
  startOfWeek: 0,
  id: null,
  userName: '',
  normalizedUserName: null,
  email: '',
  normalizedEmail: null,
  emailConfirmed: false,
  passwordHash: null,
  securityStamp: null,
  concurrencyStamp: null,
  phoneNumber: '',
  phoneNumberConfirmed: false,
  twoFactorEnabled: false,
  lockoutEnd: null,
  lockoutEnabled: false,
  accessFailedCount: 0,
  messages: [],
  generalMessages: [],
  marketMessage: null,
  marketMessageId: 0,
  personalFoods: [],
  salePackages: [],
  showShortcut: false,
  payFlag: false,

};

export const user = (state = INITIAL_STATE, action) => {
  // console.log('user reducer => action =>', action);
  switch (action.type) {
    case types.UPDATE_USER_DATA:
      return {
        ...state,
        ...action.data,
      };
    case types.UPDATE_MESSAGES:
      return {
        ...state,
        messages: [...action.data.messages],
        generalMessages: [...action.data.generalMessages],
        marketMessage: action.data.marketMessage,
      };
    case types.SET_MARKET_MESSAGE_ID:
      return {
        ...state,
        marketMessageId: action.data
      };
    case types.SET_PERSONAL_FOOD:
      return {
        ...state,
        personalFoods: [...action.data]
      };

    case types.SET_PACKAGE_SALE:
      return {
        ...state,
        salePackages: action.data
      };
    case types.SHOW_SHORTCUT:
      return {
        ...state,
        showShortcut: action.data,
      };
    case types.UPDATE_PAY_FLAG:
      return {
        ...state,
        payFlag: action.data,
      };
    case types.SET_PACKAGE_SALE:
      return {
        ...state,
        salePackages: action.data
      };
    case types.UPDATE_MESSAGES:
      return {
        ...state,
        messages: [...action.data.messages],
        generalMessages: [...action.data.generalMessages],
        marketMessage: action.data.marketMessage,
      };

    default:
      return state;
  }
};
