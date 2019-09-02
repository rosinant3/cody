import React, { useState, useEffect } from 'react';
import './Offline.css';
import Contact from './Contact';

const OfflineEmit = (body_requests: { user: number; per_page: number; current_page: number }, socket: any) => {

		socket.emit('get-contacts-offline', body_requests);

};

const OfflineOn = (dispatch: any, socket: any) => {

	socket.on('recieve-contacts-offline', (data: any) =>{
console.log(data);
		dispatch({ type: 'add_contact', data: data.data, page: data.page, ajax: true, socket: false, status: false });

	});


};

interface OfflineProps {

	offline: { first_name: string; last_name: string; username: string; location: string; id: number; }[];
	page: any;
	user: any;
	dispatch: any;


}

const Offline: React.FC<OfflineProps> = (props) => {

	const [dropdown, changeDropdown] = useState(true);

	const offline_contacts = props.offline;
	let drop = "Cody-Requests-Dropdown";
	let click = "Click to close";
	let more = { display: "none" }
	if (offline_contacts.length !== props.page.total && props.page.total > 0) more = { display: "block"};
	if (dropdown) { drop = "Cody-Requests-Dropdown Cody-Requests-Dropdown-Closed"; click = "Click to open";};

	useEffect(()=>{

		if (props.page.ajax === false && props.user.socket) {

			const body_offline = {

				user: props.user.id,
				per_page: props.page.per_page,
				current_page: props.page.current_page

        		};

			props.dispatch({ type: 'ajax_offline', ajax: false });
			OfflineEmit(body_offline, props.user.socket);
			OfflineOn(props.dispatch, props.user.socket);

		}

	}, [props.user.id, props.page.per_page, props.page.current_page, props.user.socket]);

	let offline_contacts_component: any = <div></div>;

	if (props.page.ajax === true && props.page.total > 0 && props.page.total > 0) {

		offline_contacts_component = offline_contacts.map((contact)=>{

					return <Contact user={props.user} key={contact.id} contact={contact} />;

				});

	}

  return (<div className="Cody-Contacts-Offline">
		<div className="Cody-Requests-Title Cody-Offline-Title" ><span title={click} onClick={()=>{ 

					changeDropdown(!dropdown);


				}} style={{ cursor: "pointer" }}>{`Offline (${props.page.total})`}</span></div>
				<div className={drop}>
				{offline_contacts_component}
				<div style={more} className="Cody-More-Contact-Offline">
					<span onClick={()=>{

					if (props.user.socket) {

						const body_offline = {

							user: props.user.id,
							per_page: props.page.per_page,
							current_page: props.page.current_page,
							corrector: props.page.corrector

						};

					OfflineEmit(body_offline, props.user.socket);

					}


				}} title="More Offline Contacts" style={{ cursor: "pointer" }}>More...</span>
				</div>
				</div>
	  </div>);
}

export default Offline;
