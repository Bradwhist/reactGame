import { FETCH_LOBBY } from "../actions/types";

export default function(state = {}, action) {
  // console.log('authreducer: action', action, 'state', state);
  switch(action.type) {
    case FETCH_LOBBY:
      return action.payload;
    default:
      return state;
  }
}
