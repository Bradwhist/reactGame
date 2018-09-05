import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import gameStatusReducer from './gameStatusReducer'
import authReducer from './authReducer'
import lobbiesReducer from './lobbiesReducer'
import lobbyReducer from './lobbyReducer'


export default createStore(
  combineReducers({
    gameStatus: gameStatusReducer,
    auth: authReducer,
    lobbies: lobbiesReducer,
    lobby: lobbyReducer,
  }),
  applyMiddleware(
    ReduxThunk
  )
)
