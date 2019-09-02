import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import enter from './reducers';
//import { composeWithDevTools } from 'redux-devtools-extension';

import userSearchDataReducer from './SearchUsersState';
import contactsDataReducer from './ContactsState';
import codyReducer from './CodyState';
import userDataReducer from './UserData';
import chatsReducer from './ChatState';

const applicationState = combineReducers({ 

				userData: userDataReducer, 
				contactsData: contactsDataReducer, 
				cody: codyReducer, 
				userSearchData: userSearchDataReducer,
				chatData: chatsReducer

});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
  applyMiddleware(),
  // other store enhancers if any
);

const store = createStore(applicationState, enhancer);

export default store;
