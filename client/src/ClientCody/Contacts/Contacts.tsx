import React, { useState } from 'react';
import './Contacts.css';

import Offline from './Offline';
import Online from './Online';

const SocketRequests = (body_requests: any, dispatch: any, socket: any) => {

	socket.emit('get-contact-requests', body_requests);

};

const AcceptSocketRequests = (body_requests: any, socket: any, dispatch: any) => {

	socket.emit('accept-contact-request', body_requests);

};

const RejectSocketRequests = (body_requests: any, socket: any) => {

	socket.emit('reject-contact-request', body_requests);

};

// socket.io

interface RequestProps {

	request: { username: string; id: number, first_name: string; last_name: string; location: string; };
	user: any;
	dispatch: any;


}

const Request: React.FC<RequestProps> = (props) => {

	const [imageState, setImageState] = useState(true);
	const id = props.request.id;
	const username = props.request.username;
	const first_name = props.request.first_name;
	const last_name = props.request.last_name;
	const location = props.request.location;
	const profile_picture = `/public/users/${username}/profile.jpg`;

// REJECT REQUEST

	const rejectAjax = (block: boolean) => {

	   if (props.user.socket) {

		const body = {

				user1: props.user.id,
				user2: id,
				block: block,
				username2: username

		};

		RejectSocketRequests(body, props.user.socket);

	   }

	};

// ACCEPT REQUEST

	const acceptAjax = () => {

	   if (props.user.socket) {

		const body = {

				user1: props.user.id,
				user2: id,
				username1: props.user.username,
				username2: username
				

		};

		AcceptSocketRequests(body, props.user.socket, props.dispatch);

	   }

	};

	let letter: string = "";
	if (imageState === false) letter = username[0].toUpperCase();

	return (<div className="Contact-Request">
			<img alt="profile_picture" style={{ display: "none" }} src={profile_picture} onError={(e: any) => {

			setImageState(false);

			}}/>
			<div className="Cody-Request-Image-Container"><div className="Cody-Request-Panel-Img" title={username} style={{ backgroundImage: `url('${profile_picture}')` }} >
				<span>{letter}</span>
			</div></div>
			<div className="Cody-Request-Text" ><span title={username} >{username}</span></div>
			<div className="Cody-Request-Text" >
				<div className="Request-Hover" style={{ padding: "0.5rem", color: "darkgreen", cursor: "pointer" }}>

				<span className="enabled" title="Accept" onClick={(e: any)=>{
		
					if (e.target.className === "enabled") {

						e.target.className = "disabled";
						acceptAjax();
						
					}

				}} >Accept</span>

				</div>
				<div className="Request-Hover" style={{ padding: "0.5rem", color: "darkred", cursor: "pointer" }}>

				<span className="enabled" title="Reject" onClick={(e: any) => {

					if (e.target.className === "enabled") {

						let block: boolean = false;
						e.target.className = "disabled";
					
						if (window.confirm(`Do you want to block ${username}?`)) {

							block = true;

							rejectAjax(block);


						} else {

							rejectAjax(block);

						}

					}
					
				
				}}>Reject</span>

				</div>
			</div>
		</div>);

}

interface RequestsProps {

	requests: { first_name: string; last_name: string; username: string; location: string; }[];
	page: any;
	user: any;
	dispatch: any;


}

const Requests: React.FC<RequestsProps> = (props) => {

	const [dropdown, changeDropdown] = useState(false);

	let drop = "Cody-Requests-Dropdown";
	let click = "Click to close";
	let more = { display: "block" }
	if (props.requests.length === props.page.total) more = { display: "none"};
	if (dropdown) { drop = "Cody-Requests-Dropdown Cody-Requests-Dropdown-Closed"; click = "Click to open";};

	return (<div className="Cody-Contacts-Requests">
				<div className="Cody-Requests-Title" ><span title={click} onClick={()=>{ 

					changeDropdown(!dropdown);


				}} style={{ cursor: "pointer" }}>{`Requests (${props.page.total})`}</span></div>
				<div className={drop}>
				{props.requests.map((request: any)=>{

					return <Request dispatch={props.dispatch} user={props.user} key={request.username} request={request}/>;

				})}
				<div style={more} className="Cody-More-Contact-Requests">
					<span onClick={()=>{

				if (props.user.socket) {

					const body_requests = {

						user: props.user.id,
						per_page: props.page.per_page,
						current_page: props.page.current_page,
						corrector: props.page.corrector

					};

					SocketRequests(body_requests, props.dispatch, props.user.socket);

				}


				}} title="More requests">More...</span>
				</div>
				</div>
			   </div>);

}

interface ContactsProps {

	user: any;
	contactsData: any;
	dispatch: any;

}

const Contacts: React.FC<ContactsProps> = (props) => {

	// STATE DATA

	const data = props.contactsData;
	const contacts_online = data.contacts_online;
	const page_online = data.page_online;
	const contacts_offline = data.contacts_offline;
	const page_offline = data.page_offline;
	const contacts_requests = data.contacts_requests;
	const page_requests = data.page_requests;

	let requests: any = "";
	let total_requests = page_requests.total;
	if ( total_requests > 0)  {

		requests = <Requests user={props.user} requests={contacts_requests} page={page_requests} dispatch={props.dispatch} />;

	}

	const offline = <Offline user={props.user} offline={contacts_offline} page={page_offline} dispatch={props.dispatch} />;
	const online = <Online user={props.user} online={contacts_online} page={page_online} dispatch={props.dispatch} />;

  return (<div className="Cody-Contacts">
	  	{requests}
		{online}
		{offline}
	  </div>);
}

export default Contacts;
