import { GAME_START, GAME_PLAY, FETCH_LOBBY, ASSIGN_SLOT } from "../actions/types";

export default function(state = { status: 'pending', player: null }, action) {
  // console.log('authreducer: action', action, 'state', state);
  switch(action.type) {
    case ASSIGN_SLOT:
      return { status: 'inLobby', player: action.payload }
    case GAME_START:
      return 'deploy';
    case GAME_PLAY:
      return 'started'
    default:
      return state;
  }
}
