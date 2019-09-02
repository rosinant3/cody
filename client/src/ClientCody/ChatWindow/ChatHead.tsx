import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// CHAT API Login

const ChatHead = styled.div`

    display: flex;
    flex-direction: row;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: bold;

`;

interface ChatHeaderProps {

    user: 	{ username: string;
			        first_name: string;
			        last_name: string;
			        location: string;
              id: number;
              status: string;
              
            };
    


}


const ChatHeader: React.FC<ChatHeaderProps> = (props) => {

    const username = props.user.username;
console.log("Head");
  return (<ChatHead>
     <span style={{cursor: "pointer"}}>{username}</span>
	  </ChatHead>);
}

export default ChatHeader