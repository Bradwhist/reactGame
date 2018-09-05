import { FETCH_LOBBIES } from "../actions/types";

export default function(state = [], action) {
  // console.log('authreducer: action', action, 'state', state);
  switch(action.type) {
    case FETCH_LOBBIES:
      return action.payload;
    default:
      return state;
  }
}
