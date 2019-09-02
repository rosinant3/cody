import React, { useState, useEffect } from 'react';
import './Online.css';
import Contact from './Contact';

const OnlineEmit = (body_requests: { user: number; per_page: number; current_page: number }, socket: any) => {

		socket.emit('get-contacts-online', body_requests);

};


const OnlineOn = (dispatch: any, socket: any) => {


	socket.on('recieve-contacts-online', (data: any) =>{

		dispatch({ type: 'add_contact', data: data.data, page: data.page, ajax: true, socket: false, status: true });


	});


};

interface OnlineProps {

	online: { first_name: string; last_name: string; username: string; location: string; id: number }[];
	page: any;
	user: any;
	dispatch: any;


}


const Online: React.FC<OnlineProps> = (props) => {

	const [dropdown, changeDropdown] = useState(false);

	const online_contacts = props.online;
	let drop = "Cody-Requests-Dropdown";
	let click = "Click to close";
	let more = { display: "none" }
	if (online_contacts.length !== props.page.total && props.page.total > 0) more = { display: "block"};
	if (dropdown) { drop = "Cody-Requests-Dropdown Cody-Requests-Dropdown-Closed"; click = "Click to open";};
	
	useEffect(()=>{

		if (props.page.ajax === false && props.user.socket) {

			const body_offline = {

				user: props.user.id,
				per_page: props.page.per_page,
				current_page: props.page.current_page

        		};

			props.dispatch({ type: 'ajax_online', ajax: false });
			OnlineEmit(body_offline, props.user.socket);
			OnlineOn(props.dispatch, props.user.socket);

		}

	}, [props.user.id, props.page.per_page, props.page.current_page, props.user.socket]);

	let online_contacts_component: any = <div></div>;

	if (props.page.ajax === true && props.page.total > 0) {

		online_contacts_component = online_contacts.map((contact)=>{

					return <Contact user={props.user} key={contact.id} contact={contact} />;

				})

	}

  return (<div className="Cody-Contacts-Online">
		<div className="Cody-Requests-Title Cody-Online-Title" ><span title={click} onClick={()=>{ 

					changeDropdown(!dropdown);


				}} style={{ cursor: "pointer" }}>{`Online (${props.page.total})`}</span></div>
		<div className={drop}>
				{online_contacts_component}
				<div style={more} className="Cody-More-Contact-Offline">
					<span onClick={()=>{

				if (props.user.socket) {

					const body_offline = {

						user: props.user.id,
						per_page: props.page.per_page,
						current_page: props.page.current_page,
						corrector: props.page.corrector

					};

					OnlineEmit(body_offline, props.user.socket,);

				}


				}} title="More Offline Contacts" style={{ cursor: "pointer" }}>More...</span>
				</div>
				</div>
	  </div>);
}

export default Online;
