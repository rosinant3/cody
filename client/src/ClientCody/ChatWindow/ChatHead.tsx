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
    border-bottom-style: solid;
    border-bottom-color: lightgreen;
    border-width: 3px;


`;

const UsernameContainer = styled.div`

    display: flex;
    justify-content: center;
    align-items: center;

`;

const Username = styled.span`

    cursor: pointer;
    opacity: 1;
    transition-property: opacity;
    transition-duration: 500ms;

    &:hover {

        opacity: 0.5;

    }


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

  return (<ChatHead>
      <UsernameContainer>
      <Username>{username}</Username>
      </UsernameContainer>
	  </ChatHead>);
}

export default ChatHeader