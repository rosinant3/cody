import React, { useReducer, useEffect, useState } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import Landing from './LandingPage/Landing';
import Cody from './ClientCody/Cody';
import { connect } from 'react-redux';
 
// socket.io

const mapStateToProps = (state: any) => {

		const { userData, cody, chatData } = state; 
		return { userData: userData, codyState: cody, chatData: chatData };

};

interface AppProps {

	userData: any;
	dispatch: any;
	codyState: any;
	chatData: any;

}

const App2: React.FC<AppProps> = (props) => {
  
	const userState = props.userData;
	const userDispatch = props.dispatch;
	const codyState = props.codyState;
	const chatData = props.chatData;

  useEffect(() => {


	



  }, []);

  return (
     <Route  path="/" render={() => {

		if (userState.email === "" && userState.username === "" && userState.id === 0 && userState.verified === 0) {

			return (<Landing userData={userState} userDispatch={userDispatch}/>);

		}

		else {

			return (<Cody chatData={chatData} user={userState} dispatchUserState={userDispatch} codyState={codyState}/>);

		}
	}} />
  );
}

const App = connect(mapStateToProps)(App2);

export default App;
