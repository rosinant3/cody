import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// CHAT API Login

const ChatFormContainer= styled.div`

    display: flex;

`;

const ChatFormEmojiButton = styled.div`



`;

const ChatFormMessage = styled.div`



`;

const ChatFormMedia = styled.div`



`;

const ChatFormSend = styled.div`



`;

interface ChatHeaderProps {

    


}


const ChatForm: React.FC<ChatHeaderProps> = (props) => {

  return (<ChatFormContainer>
     <ChatFormEmojiButton>></ChatFormEmojiButton>
     <ChatFormMessage></ChatFormMessage>
     <ChatFormSend></ChatFormSend>
	  </ChatFormContainer>);
}

export default ChatForm;