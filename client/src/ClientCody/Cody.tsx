import React, { useEffect } from 'react';
import './Cody.css';
import io from 'socket.io-client';

// CHAT API Login

import { login_user, login_status, user_status } from './chatAPI/login-logout';
import { contact_socket } from './chatAPI/chatRequests';

// Components

import CodySidebar from './Sidebar';
import CodyProfile from './CodyProfile';
import ChatWindow from './ChatWindow/ChatWindow';


interface CodyProps {

	user: any;
	dispatchUserState: any;
	codyState: any;
	chatData: any;

}


const Cody: React.FC<CodyProps> = (props) => {

  const codyState = props.codyState;
  let profile: { display: string; position: string; };

   useEffect(()=>{

	if (props.user.socket === false) {

		
		const options = {

       			rememberUpgrade:true,
       			transports: ['websocket'],
       			secure:true, 
       			rejectUnauthorized: false,

		};

		const socket = io.connect('http://localhost:8000', options);
 
		//

		socket.on('connect', () => {

  			props.dispatchUserState({ type: 'socket', socket: socket });

		});


	}

  }, [props.user.id]);

  useEffect(()=>{

	if (props.user.socket) {

		login_user(props.user.id, props.user.username, props.user.socket, props.dispatchUserState);
		contact_socket(props.dispatchUserState, props.user.socket);
		user_status(props.dispatchUserState, props.user.socket);

        }

  }, [props.user.id, props.user.socket]);

  if (codyState.profile) {
 
	profile = { display: "block", position: "absolute" }; 
	

  } else { 

	profile = { display: "none", position: "absolute" };

  };

  const profileComponent = <CodyProfile visible={profile} dispatchUserState={props.dispatchUserState} user={props.user}/>;
  
  return (<div className="Cody">
	  <div className="Cody-Chat-Area">
	  {profileComponent}
	      <ChatWindow user={props.user} chatData={props.chatData}/>
	  </div>
	  <CodySidebar user={props.user} dispatchCodyState={props.dispatchUserState} codyState={props.codyState} />
	  </div>);
}

export default Cody;
