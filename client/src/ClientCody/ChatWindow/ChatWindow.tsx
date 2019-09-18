import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

// COMPONENTS

import ChatHeader from './ChatHead';
import ChatMsg from './ChatMessages';
import ChatForm from './ChatForm';


// COMPONENTS

// REDUX

const mapStateToProps = (state: any) => {

	return {  };

};

// REDUX

// CHAT API Login

const WelcomeScreen = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	vertical-align: middle;
	height: 100%;
	cursor: default;

`;

const ChatWindowCom = styled.div`

	height: 100%;


`;

const ChatGrid = styled.div`

	display: grid;
	grid-template-rows: 75px auto 100px;
	height: 100%;

`;

const OnlineOn = (dispatch: any, socket: any) => {

	socket.on('recieve-message', (data: any) => {
  
	  dispatch({ type: 'add_chat_msg', chat_id: data.chat_id, origin: data.origin, data: [data.message] });
  
	});
  
};

interface ChatWindowProps {

	user: { id: number, username: string; socket: any; };
	chatData: any;
	dispatch: any;
	

}

const ChatWindow2: React.FC<ChatWindowProps> = (props) => {
 
  const [active, setActive] = useState(false);
  const activeChat = props.chatData.chats.filter((c: any)=>{

	return c.active === true;

  });

  useEffect(()=>{
	
	if (props.user.socket) {

		OnlineOn(props.dispatch, props.user.socket);
	
	}

 }, [props.user.socket, props.dispatch]);

  /*

active: true
chat_id: 15
created_at: null
id: 14
msg: null
status: "0"
username: "user-15"

  */

  let content = <WelcomeScreen>{`Welcome, ${props.user.username}!`}</WelcomeScreen>;
  if (activeChat.length === 1) {
	  
	content = activeChat.map((ch: any) => {

		const contact: { 
			
			username: string;
			first_name: string;
			last_name: string;
			location: string;
			id: number;
			status: string;
		
		
		} = {

			username: ch.username,
			first_name: ch.first_name,
			last_name: ch.last_name,
			location: ch.location,
			id: ch.id,
			status: ch.status

		};

		const messages = ch.messages;
		const form = ch.form;
		const chat_id = ch.chat_id;
		const page = ch.page;

		return (<ChatGrid key={contact.id}>
				<ChatHeader user={contact}/>
				<ChatMsg user={props.user} page={page} chat_id={chat_id} dispatch={props.dispatch} messages={messages} />
				<ChatForm user={props.user} contact={contact} chat_id={chat_id} dispatch={props.dispatch} form={form}/>
				</ChatGrid>);


	})

  }

  return (<ChatWindowCom>
	  {content}
	  </ChatWindowCom>);
}

const ChatWindow = connect(mapStateToProps)(ChatWindow2);

export default ChatWindow;