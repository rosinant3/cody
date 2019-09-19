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
		
		dispatch({ type: 'add_chats', data: new_data, page: data.page, ajax: true, socket: false});

	});

	socket.on('recieve-chat', (data: any) =>{

		const new_data = data.data;

		dispatch({ type: 'add_chat_msg', scroll: 500, page: data.page, chat_id: data.chat_id, origin: false, data: new_data });

		//dispatch({ type: 'active_chat', user: user,  contact: Math.abs(data.chat_id - user) });
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

		if (current_page > 1 && (total >= per_page || data_len < total)) {
			
				   let Rosi: any = new Rosinante({
	
					scrollContainer: scrollContainer.current, 
					scrollItem: scrollItem.current, 
					scrollTarget: scrollItem.current,
					once: true,
					visible: () => { 
	
						const body_chat = {

							user: props.user.id,
							per_page: per_page,
							current_page: current_page,
							whereNot: props.chatData.whereNot
			
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
				current_page: current_page,
				whereNot: props.chatData.whereNot

        		};

			props.dispatch({ type: 'ajax_chat', ajax: true });
			ChatEmit(body_chat, props.user.socket);
			ChatOn(props.dispatch, props.user.socket, props.user.id);

		}

  }, [props.user.id, props.user.socket, props.user.status]);

  if (page.ajax === true && page.total > 0) {

	const dates: any = chats_a.sort((a: any, b: any) =>{

		const days_a = Object.keys(a.messages);
		const days_b = Object.keys(b.messages);
		let date_a: any = a.created_at;
		let date_b: any = b.created_at;

		const sorted_days_a = days_a.sort((c: any, d: any) => {
  
			const hour_keys_a = Object.keys(a.messages[d]);
			const hour_keys_b = Object.keys(a.messages[c]);

		 	return +new Date(a.messages[d][hour_keys_a[0]].date) - +new Date(a.messages[c][hour_keys_b[0]].date);

		});
		   
		const sorted_days_b = days_b.sort((c: any, d: any) => {

			const hour_keys_a = Object.keys(b.messages[d]);
			const hour_keys_b = Object.keys(b.messages[c]);

			return +new Date(b.messages[d][hour_keys_a[0]].date) - +new Date(b.messages[c][hour_keys_b[0]].date);

		});
		   

		if (sorted_days_a[0]) {

			const hour_keys_a = Object.keys(a.messages[sorted_days_a[0]]);

			const sorted_hours_a = hour_keys_a.sort((c: any, d: any) => {

				return +new Date(a.messages[sorted_days_a[0]][d].date) - +new Date(a.messages[sorted_days_a[0]][c].date);
	
			});

			date_a = a.messages[sorted_days_a[0]][sorted_hours_a[0]].date;
			  

		}

		if (sorted_days_b[0]) {

			const hour_keys_b = Object.keys(b.messages[sorted_days_b[0]]);

			const sorted_hours_b = hour_keys_b.sort((c: any, d: any) => {

				return +new Date(b.messages[sorted_days_b[0]][d].date) - +new Date(b.messages[sorted_days_b[0]][c].date);
				
			});
			
			date_b = b.messages[sorted_days_b[0]][sorted_hours_b[0]].date;

		}
 
		return +new Date(date_b) - +new Date(date_a);


	});

	chats = dates.map((contact: any)=>{
 
				return <Contact user={props.user} chat={true} key={contact.id} contact={contact} />;

			})

	}

  return (<div ref={scrollContainer} className="Cody-Chats">
		{chats}
		<div ref={scrollItem} className="Scroll-Item-Container">{spinner}</div>
	  </div>);
}

export default Chats;
