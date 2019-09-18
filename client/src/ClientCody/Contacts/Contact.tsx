import React, { useState, useEffect } from 'react';
import './Contact.css';
import { connect } from 'react-redux';
import moment from 'moment';

interface ContactProps {

	user: any;
	contact: any;
	dispatch: any;
	chat?: boolean;
	contactsData: any;
	chatData: any;
	socket: any;


}

const mapStateToProps = (state: any) => {

	const { contactsData, chatData, userData } = state;

	return { contactsData: contactsData, chatData: chatData, socket: userData.socket };

};

const Contact2: React.FC<ContactProps> = (props) => {

	const [imageState, setImageState] = useState(true);
	const [imageTransition, setImageTransition] = useState(false);
	const profile_picture = `/public/users/${props.contact.username}/profile.jpg`;
	const username = props.contact.username || "a";
	let letter;
	let contactClass: string = "";
	let pictureClass: string = "";
	imageState === false? letter = username[0].toUpperCase(): letter = "";
	props.contact.status === "0"? contactClass = "Cody-Contact Cody-Contact-Offline" : contactClass = "Cody-Contact Cody-Contact-Online";
	props.contact.status === "0"? pictureClass = "Cody-Search-Users-Panel-Img Cody-Contact-Image-Offline" : pictureClass = "Cody-Search-Users-Panel-Img Cody-Contact-Image-Online";
	let imageTStyle = { opacity: 0, padding: "0.5rem" };
	imageTransition? imageTStyle = { opacity: 1, padding: "0.5rem" } : imageTStyle = { opacity: 0, padding: "0.5rem" };
	let containerClass = "Cody-Image-User-Container";
	let content = <div className="Cody-Search-Users-Username">{username}</div>;
	let date: any;

	
	if (props.chat) {

		let contact_date: any = "";
		const messages = props.contact.messages;
		const arrayKeys = 0;
		const messagesKeys = Object.keys(messages);
		let msg: string = "";


		if (messagesKeys.length > 0) {

			const day = messages[messagesKeys[0]];
			const hourKeys = Object.keys(day);

			if (hourKeys.length > 0) {

				const hour = day[hourKeys[0]];

				msg = hour.messages[0].msg; 
				contact_date = moment(new Date(hour.messages[0].created_at)).format("MMM Do YY");

			}
			

		}

		if (messagesKeys.length === 0) {

			msg = `Write ${username} a message...`;
			contact_date = moment(new Date(props.contact.created_at)).format("MMM Do YY");

		}
		if (msg.length > 31) { msg = `${msg.slice(0, 20)}...` }
		containerClass = "Cody-Image-Chat-Container";
		content = <div className="Cody-Sidebar-Chats">
					<div className="Cody-Search-Chats-Username">{username}</div>
					<div className="Chat-Msg">{msg}</div>
				   </div>;
		date = <div className="Chat-Msg-Date">{contact_date}</div>;
		imageTransition? imageTStyle = { opacity: 1, padding: "1rem" } : imageTStyle = { opacity: 0, padding: "1rem" };

	}

	useEffect(()=>{

		if (props.chat) {

			props.contactsData.contacts_online.map((online: any) => {

				if (online.id === props.contact.id) {
	
					if (online.active && !props.contact.active) {
	
						props.dispatch({ type: 'active_chat', user: props.user,  contact: props.contact });
	
					}
	
				}
	
			})
	
			props.contactsData.contacts_offline.map((offline: any) => {
	
				if (offline.id === props.contact.id) {
	
					if (offline.active && !props.contact.active) {
	
						props.dispatch({ type: 'active_chat', user: props.user,  contact: props.contact });
	
					}
	
				}
	
	
			})

		}

		if (!props.chat) {

			props.chatData.chats.map((chat:any)=>{
	
				if (chat.id === props.contact.id) {
	
					if (chat.active && !props.contact.active) {
	
						props.dispatch({ type: 'active_contact', user: props.user,  contact: props.contact });
	
					}
	
	
				}
	
			})	
	
		}

	}, [props.chat, props.chatData, props.contactsData])

	if (props.contact.active) {

		props.contact.status === "0"? contactClass = "Cody-Contact Cody-Contact-Offline Cody-Contact-Offline-Active" : contactClass = "Cody-Contact Cody-Contact-Online Cody-Contact-Online-Active";

	}

  return (<div onClick={()=>{

		let found: boolean = false;

		props.chatData.chats.map((chat:any) => {

			if (chat.id === props.contact.id) {

				found = true;

			}

		});

		props.dispatch({ type: 'active_contact', user: props.user,  contact: props.contact });

		if (!found) {

			const data = [{

				page: { 
					
					current_page: 1, 
					from: 0, 
					last_page: 0, 
					offset: 0, 
					per_page: 10, 
					to: 0, 
					total: 0, 
					ajax: false, 
					corrector: 0 
				
				}, 
				messages: [], 
				chat_id: props.contact.id + props.user.id, 
				username: props.contact.username, 
				id: props.contact.id, 
				first_name: "", 
				last_name: "", 
				location: "", 
				status: props.contact.status, 
				active: false,
				created_at: props.contact.created_at
			
			}];

			props.dispatch({ whereNot: true, type: 'add_chats', data: data, page: data[0].page, ajax: true, socket: true });
			props.socket.emit('get-chat', 
							{ 
								per_page: data[0].page.per_page, 
								current_page: data[0].page.current_page, 
								chat_id: props.contact.id + props.user.id, 
								corrector: 0 
							
							});
		}

		if (found) {

			props.dispatch({ type: 'active_chat', user: props.user.id,  contact: props.contact.id });

		}

  }} style={imageTStyle} className={contactClass}>
		<img alt="profile_picture" onLoad={() => {

			setImageTransition(true);

		}} style={{ display: "none" }} src={profile_picture} onError={(e: any) => {
 
			setImageState(false);
			setImageTransition(true);

		}}/>
		<div className={containerClass}>
			<div className={pictureClass}  style={{ backgroundImage: `url('${profile_picture}')`, borderColor: "white" }} >
				<span>{letter}</span>
			</div>
		{content}
		{date}
		</div>
	  </div>);
}

const Contact = connect(mapStateToProps)(Contact2);

export default Contact;