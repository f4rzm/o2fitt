import types from '../../../constants/actionTypes';
import moment from 'moment'
const INITIAL_STATE = [];

export const syncedDate = (state = INITIAL_STATE, action) => {
  // console.log('user reducer => action =>', action);
  switch (action.type) {
    case types.ADD_DATE:
      return [...state,action.date];

    default:
      return state;
  }
};
