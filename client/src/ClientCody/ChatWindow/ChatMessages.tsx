import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import moment from 'moment';

// CHAT API Login

const ChatMessages = styled.div`

    display: flex;
    flex-direction: column;
    padding: 1rem;
    overflow: auto; 
    position: relative;

    &::-webkit-scrollbar {

      width: 0.3rem;
      background-color: white;
    
    }
    
    &::-webkit-scrollbar-thumb {
    
       background-color: lightgreen;
    
    }


`;

interface ChatHeaderProps {

    messages: any;
    user: { socket: any, id: number }
    dispatch: any;
    page: any;
    chat_id: number;


}



const ChatMsg: React.FC<ChatHeaderProps> = (props) => {

   const ref: any = useRef(null);

   useEffect(()=>{

      if (props.page.current_page === 1) {

         props.user.socket.emit('get-chat', 
							{ 
								per_page: props.page.per_page, 
								current_page: props.page.current_page, 
								chat_id: props.chat_id, 
								corrector: props.page.corrector
							
                     });
                     
      }


   }, [props.chat_id]);

   const DayWrapper = styled.div`
   
      padding: 0.4rem;
      font-size: 0.7rem;


   `;

   const HourWrapper = styled.div`
   
      padding: 0.5rem;
      font-size: 0.7rem;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      padding-bottom: 0rem;
      padding-top: 0.5rem;  

   `;

   const UserMessage = styled.div`

      display: flex;
      align-self: flex-end;
      padding: 0.4rem;
      background-color: lightgreen;
      font-size: 0.8rem;
      border-radius: 5px;
      max-width: 70%;
      color: black;
      margin-bottom: 0.5rem;
   

   `;

   const ContactMessage = styled.div`
   
      display: flex;
      justify-content: flex-start;
      align-self: flex-start;
      padding: 0.4rem;
      background-color: #CDE6CE;
      font-size: 0.8rem;
      border-radius: 5px;
      max-width: 70%;
      color: black;
      margin-bottom: 0.5rem;

   `;

  const dates: any = props.messages;

  const days_keys = Object.keys(dates);

  const sorted_days = days_keys.sort((a: any, b: any) => {

            const hour_keys_a = Object.keys(dates[a]);
            const hour_keys_b = Object.keys(dates[b]);

         return +new Date(dates[a][hour_keys_a[0]].date) - +new Date(dates[b][hour_keys_b[0]].date);

   });

   useEffect(()=>{

      if (ref.current) {

         ref.current.scrollIntoView({ block: 'end' });

      }

   });

  return (<ChatMessages>
      {sorted_days.map((day:any)=>{

         const hour_keys = Object.keys(dates[day]);

         const sorted_hours = hour_keys.sort((a: any, b: any) => {

               return +new Date(dates[day][a].date) - +new Date(dates[day][b].date);
   
         });

         return <DayWrapper key={day}>
            <div style={{ textAlign: "center" }}>{day}</div>
            {sorted_hours.map((hour:any)=>{

               let user: any = [];
               let contact: any = [];
                     
               dates[day][hour].messages.forEach((msg: any)=>{

                  if (msg.user === props.user.id) {

                     user.unshift(msg);

                  } else {

                     contact.unshift(msg);

                  }

               });

               let contact_component = <div></div>;
               let user_component = <div></div>;

               if (user.length > 0) {

                  user_component = <HourWrapper>
                  <div style={{ textAlign: "end", marginBottom: "0.2rem" }}>{hour}</div>
                  {user.map((msg:any)=>{

                     if (msg.user === props.user.id) {

                        return <UserMessage key={msg.id}>{msg.msg}</UserMessage>;

                     } else {

                        return <ContactMessage key={msg.id}>{msg.msg}</ContactMessage>;

                     }

                     })}
                  </HourWrapper>;

               }

               if (contact.length > 0) {

                  contact_component = <HourWrapper>
                     <div style={{ textAlign: "start", marginBottom: "0.2rem" }}>{hour}</div>
                     {contact.map((msg:any)=>{

                        if (msg.user === props.user.id) {

                           return <UserMessage key={msg.id}>{msg.msg}</UserMessage>;

                        } else {

                           return <ContactMessage key={msg.id}>{msg.msg}</ContactMessage>;

                        }

                     })}
                     </HourWrapper>

               }

               return <React.Fragment key={hour}>
                        {user_component}
                        {contact_component}
                     </React.Fragment>;

            })}
            </DayWrapper>;


      })}
      <div ref={ref}></div>
	  </ChatMessages>);
}

/*

 {props.messages.map((msg: any)=>{

         
        

     })}

*/

export default ChatMsg