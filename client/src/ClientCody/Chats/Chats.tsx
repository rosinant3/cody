import React, { useState, useEffect, useRef } from 'react';
import './Chats.css';
import Contact from '../Contacts/Contact';
import Rosinante from '../Rosinante';

interface ChatsProps {

	user: any;
	dispatch: any;
	chatData: any;

}

const ChatEmit = (body_requests: { user: number; per_page: number; current_page: number }, socket: any) => {

		socket.emit('get-chats', body_requests);

};


const ChatOn = (dispatch: any, socket: any, user: number) => {

 
	socket.on('recieve-chats', (data: any) =>{

		const new_data = data.data.map((wata: any) => {

			wata.active = false;
			return wata;

		})
console.log(new_data);
		dispatch({ type: 'add_chats', data: new_data, page: data.page, ajax: true, socket: false});

	});

	socket.on('recieve-chat', (data: any) =>{

		const new_data = data.data.map((wata: any) => {

			wata.active = true;
			return wata;

		})

		dispatch({ type: 'active_chat', user: user,  contact: Math.abs(data.chat_id - user) });
		//dispatch({ type: 'add_chat_msg', data: new_data, page: data.page, ajax: true, socket: data.single });
		
	});


};

const Chats: React.FC<ChatsProps> = (props) => {

	const [waiting, setWaiting] = useState(false);

  	let scrollContainer = useRef(null);
  	let scrollItem = useRef(null);

	let chats: any;
	const chats_a: any = props.chatData.chats;
	const page = props.chatData.page_chats;
	const total = page.total;
	const data_len = chats_a.length;
	const current_page = page.current_page;
	const per_page = page.per_page;
	const last_page = page.last_page;
	let spinner;
  	waiting? spinner = <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : spinner = <div></div>;
	
	useEffect(() => {

		if (current_page > 1 && (total <= per_page || data_len < total)) {
			
				   let Rosi: any = new Rosinante({
	
					scrollContainer: scrollContainer.current, 
					scrollItem: scrollItem.current, 
					scrollTarget: scrollItem.current,
					once: true,
					visible: () => { 
	
						const body_chat = {

							user: props.user.id,
							per_page: per_page,
							current_page: current_page
			
							};
			
						ChatEmit(body_chat, props.user.socket);
	
	
					}, 
					notVisible: () => {

					}, 
					throttle: 400, 
					responsiveBreakPoint: 800, 
					elementPieceSmall: 50, 
					elementPieceLarge: 50
	
				});
				
				if (current_page <= last_page) { Rosi.callRosinante()}
	
				return () => { Rosi.removeRosinante() }
	
		 		}
	
	  }, [current_page, last_page, per_page, props.user.id, props.dispatch, setWaiting, data_len, total ]);

  useEffect(()=>{

		if (props.user.socket && page.ajax === false ) {

			const body_chat = {

				user: props.user.id,
				per_page: per_page,
				current_page: current_page

        		};

			props.dispatch({ type: 'ajax_chat', ajax: true });
			ChatEmit(body_chat, props.user.socket);
			ChatOn(props.dispatch, props.user.socket, props.user.id);

		}

  }, [props.user.id, props.user.socket]);

  if (page.ajax === true && page.total > 0) {

	chats = chats_a.map((contact: any)=>{
 
				return <Contact user={props.user} chat={true} key={contact.id} contact={contact} />;

			})

	}


  return (<div ref={scrollContainer} className="Cody-Chats">
		{chats}
		<div ref={scrollItem} className="Scroll-Item-Container">{spinner}</div>
	  </div>);
}

export default Chats;
