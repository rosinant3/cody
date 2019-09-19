import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { relative } from 'path';

// CHAT API Login

const ChatFormContainer= styled.div`

    display: grid;
    grid-template-columns: 75px auto 165px;
    border-top-style: solid;
    border-top-color: lightgreen;
    border-width: 3px;

`;

const ChatFormEmojiButtonContainer = styled.div`

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: lightgreen;


`;

const ChatEmojiButton = styled.i`

  transition-property: color;
  transition-duration: 500ms;
  cursor: pointer;

  &:hover {

    color: darkgreen;
  
  }

`;

const ChatFormMessage = styled.div`

  position: absolute;
  right: 0px;
  left: 0px;
  z-index: 10;
  vertical-align: middle;
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.8rem;
  color: black;
  width: 100%;
  word-break: break-all;
  max-height: 70px;
  overflow: auto;
  background-color: rgba(0,255,0, 0.3);
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  border-radius: 5px;
  box-sizing: border-box;
 
  &:focus {

    outline: none;

  }

  &::-webkit-scrollbar {

    width: 0.3rem;
    background-color: white;
  
  }
  
  &::-webkit-scrollbar-thumb {
  
     background-color: lightgreen;
  
  }

`;

const ChatFormMedia = styled.div`



`;

const ChatFormIcons = styled.div`

  display: flex;
  justify-content: flex-start;
  padding: 1rem;
  align-items: center;
  vertical-align: middle;

`;

const ChatFormSend = styled.i`

  font-size: 1.5rem;
  color: lightgreen;
  transition-property: color;
  transition-duration: 500ms;
  cursor: pointer;

  &:hover {

    color: green;

  }

`;

const OnlineEmit = (data: { 
  
                        chat_id: number; 
                        user: number; 
                        message: string; 
                        contact: number;
                        files: string[], 
                        images: string[]; 
                        username: string;
                        
                      
                    }, socket: any) => {

  socket.emit('send-message', data);

};

interface ChatFormProps {
 
    form: {
            
            message: string; 
            images: string[], 
            files: string[]
          
        };
    dispatch: any;
    chat_id: number;
    user: any;
    contact: any;

}

const ChatForm: React.FC<ChatFormProps> = (props) => {

  const socket = props.user.socket;
  const [ placeholder, setPlaceholder ] = useState(true);
  const [ focused, setFocused ] = useState(false);
  const [ ctrl, setCtrl ] = useState(false);
  let ref: any = useRef(null);
  let icons = <ChatFormSend title="Send Images" className="fas fa-images"></ChatFormSend>;

  const sendMessage = () => {

    if (ref.current) {

      const message = ref.current.textContent.trim();
      const images = props.form.images;
      const files = props.form.files;

      if (message !== "" && message.length > 0 && message.length <= 1000) {

        OnlineEmit({ 
        
                  chat_id: props.chat_id, 
                  user: props.user.id, 
                  message: message, 
                  contact: props.contact.id, 
                  images: images, 
                  files: files,
                  username: props.user.username
                
        }, socket);

      }
    
    }

  };

  const setEndOfContenteditable = (contentEditableElement: Node) =>
  {
      
      if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
      {
          let range = document.createRange();//Create a range (a range is a like the selection but invisible)
          range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
          range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
          let selection = window.getSelection();//get the selection object (allows you to change selection)
          if (selection) {
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
          }
      }
  };

  useEffect(()=>{

    setTimeout(()=>{ 
      
      if (ref.current) {

        ref.current.focus();
        setEndOfContenteditable(ref.current);
  
      } 
  
    },1);

    return () => {

      ref.current.blur();

    } 

  }, [ref.current]);
 
  let display = "flex";

  const focus = (e:any) => {

    setFocused(true);

  }
 
  const blur = (e: any) => {

    setFocused(false);

  };

  const keyup = (e:any) => {

    const len = e.target.textContent.length;

    if (ctrl) {

      if (e.key === "Control") {

        setCtrl(false);
  
      }

    }

    if (len === 0 && e.keyCode === 8) {

      if (len === 0) {

        setPlaceholder(true);

      }

      } else if (len === 0) {

        setPlaceholder(true);

      } else {

        if (len === 1000) {

          e.preventDefault();
  
      }  

    }

  }

  const keydown = (e:any) => {

    const len = e.target.textContent.length;
    const code = e.keyCode;

    if (code === 8) {

      if (len === 0) {

        setPlaceholder(true);

      }

      if (len === 1000) {



      }

    } else if (e.key === "Control") {

      setCtrl(true);
      console.log("test");
      
    } else if (code === 65) {
      
      if (len === 1000) {



      }
      
      
    } else {

      if (len === 1000) {

        e.preventDefault();
       
  
      }

      if (len > 0 && len <= 1000) {

        setPlaceholder(false);

      }

      if (code === 13 && focused) {


        sendMessage();

      }

      if (len === 0 && ((code > 46 && code <= 90) || (code > 93 && code <= 111) || (code > 183 && code <= 222))) {


        setPlaceholder(false);

      }

      

    }

  }

  const paste = (e: any) => {

      let data = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
      let stopper;
      let inner = e.target.textContent;
  
      // Filter out everything except simple text and allowable HTML elements
      let regex = /<(?!(\/\s*)?(a|b|i|em|s|strong|u)[>,\s])([^>])*>/g;
      data = data.replace(regex, '').trim();
      stopper = inner + data;

      if (stopper.length > 1000) {

        e.preventDefault();

      } else {

        document.execCommand('insertHTML', false, data);

        if (ref.current) {

          setEndOfContenteditable(ref.current);
          ref.current.scrollTop = ref.current.scrollHeight;
      
        }

        e.preventDefault();

      }
  
    // Insert the filtered content

  };
    
  if (!placeholder) {

    display = "none";
    icons = <ChatFormSend 
    onClick={sendMessage} 
    title="Send" 
    className="fas fa-chevron-circle-right">
    </ChatFormSend>;

  }

  const style = {   
    
    display: display,
    top: "0px",
    bottom: "0px",
    left: "0px",
    right: "0px", 
    verticalAlign: "middle",
    alignItems: "center",
    position: "absolute",
    fontSize: "0.8rem",
    paddingLeft: "0.7rem",
  
  } as React.CSSProperties;

  useEffect(()=>{

    if (ref.current) {

      if (props.form.message.length > 0) {

        ref.current.textContent = props.form.message;
        setEndOfContenteditable(ref.current);
        setPlaceholder(false);

      }

      if (props.form.message.length === 0) {

        ref.current.textContent = props.form.message;
        setEndOfContenteditable(ref.current);
        setPlaceholder(true);

      }

      return () => {

        props.dispatch({ 
        
                    type: "add_form", 
                    chat_id: props.chat_id, 
                    form: { 
                      
                      type: "message", 
                      message: ref.current.textContent, 
                      images: [], 
                      files: [] 
                    } 
                  
                });

      };

    }

  }, [ref.current, props.form.message]);

  return (<ChatFormContainer>
     <ChatFormEmojiButtonContainer>
        <ChatEmojiButton 
          title="Emojis" 
          className="fas fa-smile-beam">
        </ChatEmojiButton>
      </ChatFormEmojiButtonContainer>
     <div 
     
      style={{ 
        
          padding: "1rem", 
          position: "relative", 
          color: "black", 
          display: "flex", 
          alignItems: "center" 
      
      }}>

       <ChatFormMessage 
          ref={ref} 
          onBlur={blur} 
          onFocus={focus} 
          onPaste={paste} 
          onKeyDown={keydown} 
          onKeyUp={keyup} 
          contentEditable={true} 
          suppressContentEditableWarning={true}
      >
        
       </ChatFormMessage>
       <div 
          style={style} 
          contentEditable={false}
        >
        {`Type a message here`}
        </div>
     
     </div>
     <ChatFormIcons>
     {icons}
     </ChatFormIcons>
	  </ChatFormContainer>);
}

export default ChatForm;