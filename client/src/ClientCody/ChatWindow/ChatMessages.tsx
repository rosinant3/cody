import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// CHAT API Login

const ChatMessages = styled.div`

    

`;

interface ChatHeaderProps {

    messages: any;    


}


const ChatMsg: React.FC<ChatHeaderProps> = (props) => {
   console.log("MSG");
  return (<ChatMessages>
     {props.messages.map((msg: any)=>{


        return <span>{msg.msg}</span>;

     })}
	  </ChatMessages>);
}

export default ChatMsg