import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// COMPONENTS

import ChatHeader from './ChatHead';
import ChatMsg from './ChatMessages';
import ChatForm from './ChatForm';


// COMPONENTS

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
	grid-template-rows: 100px auto 100px;

`;


interface ChatWindowProps {

	user: { id: number, username: string; };
	chatData: any;

}


const ChatWindow: React.FC<ChatWindowProps> = (props) => {
 
  const [active, setActive] = useState(false);
  const activeChat = props.chatData.chats.filter((c: any)=>{

	return c.active === true;

  });

  /*

active: true
chat_id: 15
created_at: null
id: 14
msg: null
status: "0"
username: "user-15"

  */
 console.log(activeChat);
  let content = <WelcomeScreen>{`Welcome, ${props.user.username}!`}</WelcomeScreen>;
  if (activeChat.length === 1) {
	  
	content = activeChat.map((ch: any) => {

		const user: { 
			
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

		return (<ChatGrid key={user.id}>
				<ChatHeader user={user}/>
				<ChatMsg messages={messages} />
				<ChatForm />
				</ChatGrid>);


	})

  }

  return (<ChatWindowCom>
	  {content}
	  </ChatWindowCom>);
}

export default ChatWindow;
