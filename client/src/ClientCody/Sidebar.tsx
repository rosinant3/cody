import React, { useState, useEffect } from 'react';
import './Cody.css';
import { connect } from 'react-redux';

// CHAT API

import { login_status } from './chatAPI/login-logout';

// Components

import Contacts from './Contacts/Contacts';
import Chats from './Chats/Chats';
import GroupChats from './SidebarComponents/GroupChats';
import SearchUsers from './SidebarComponents/SearchUsers';

const mapStateToProps = (state: any) => {

		const { contactsData, chatData } = state;
	
		return { contactsData: contactsData, chatData: chatData };

};

const SocketRequests2 = (body_requests: any, dispatch: any, socket: any) => {

	socket.emit('get-contact-requests', body_requests);

};

interface CodyProps {

	user: any;
	dispatchCodyState: any;
	codyState: any;
	contactsData: any;
	dispatch: any;
	chatData: any;

}


const CodySidebar2: React.FC<CodyProps> = (props) => {

  const [imageState, setImageState] = useState(true);
  const [sideBar, setSideBar] = useState({ position: "Chats" });
  const [requests, setRequests] = useState({ requests: [] });

  const data = props.contactsData;
  const page_requests = data.page_requests;

  const options: { title: string; className: string; notifications: number }[] = 
		  [{title: "Contacts", className: "fas fa-address-book Cody-User-Options-Icon", notifications: page_requests.total },
		   {title: "Chats", className: "fas fa-user-friends Cody-User-Options-Icon", notifications: 0 },
		   {title: "Group Chats", className: "fas fa-users Cody-User-Options-Icon", notifications: 0 },
		   {title: "Search Users", className: "fas fa-globe Cody-User-Options-Icon", notifications: 0 }];
  let profileClass = "fas fa-cog";
  let color;
  let letter;
  const profile_picture = props.user.profile_picture;
  props.codyState.profile? color = { opacity: 1 } : color = { color: "" };
  let loginClass: string = "";
  props.user.status? loginClass = "Cody-User-Panel-Img Cody-User-Panel-Img-Online" : loginClass = "Cody-User-Panel-Img Cody-User-Panel-Img-Offline";

  useEffect(() => {

	if (page_requests.ajax === false && props.user.socket) {

		const body_requests = {

			user: props.user.id,
			per_page: page_requests.per_page,
			current_page: page_requests.current_page

        	};


		SocketRequests2(body_requests, props.dispatch, props.user.socket);
		login_status(props.dispatch, props.user.socket);

	}

	

  }, [props.user.id, page_requests.per_page, page_requests.ajax, page_requests.current_page, props.user.socket]);

  // SIDEBAR COMPONENTS
  let sidebarContent;
  if (sideBar.position === "Contacts") sidebarContent = <Contacts user={props.user} contactsData={props.contactsData} dispatch={props.dispatch}/>;
  if (sideBar.position === "Chats") sidebarContent = <Chats user={props.user} dispatch={props.dispatch} chatData={props.chatData}/>;
  if (sideBar.position === "Group Chats") sidebarContent = <GroupChats />;
  if (sideBar.position === "Search Users") sidebarContent = <SearchUsers user={props.user}/>;


  if (imageState === false) letter = props.user.username[0].toUpperCase();

  return (<div className="Cody-Sidebar">
		<div className="Cody-Icon">
			{props.user.username}
		</div>
		<img alt="profile_picture" style={{ display: "none" }} src={profile_picture} onError={(e: any) => {

			setImageState(false);

		}}/>
		<div className="Cody-User-Panel">
			<div className="Cody-Image-User-Container"><div onClick={() => {

					props.dispatchCodyState({ type: "change_profile"});	

			}} className={loginClass} title="Profile" style={{ backgroundImage: `url('${profile_picture}')` }} >
				<i className={profileClass} style={color}></i>
				<span>{letter}</span>
			</div></div>
			<div className="Cody-User-Options">
				{options.map((option: { title: string; className: string; notifications: number }) => {

					let className;
					let notifications: any;
					let visible = { display: "none" };
					if (option.notifications > 0) { 

						notifications = option.notifications;
						visible = { display: "block" };

					}

					sideBar.position === option.title ? className = option.className + " Cody-User-Options-Active" : className = option.className;

					return <i key={option.title} className={className} title={option.title} onClick={() => {

					setSideBar({ position: option.title });
					

				}}><div style={visible} className="Cody-User-Options-Number">{notifications}</div></i>})}
			</div>
		</div>

		{sidebarContent}

	  </div>);
}

const CodySidebar = connect(mapStateToProps)(CodySidebar2);

export default CodySidebar;
