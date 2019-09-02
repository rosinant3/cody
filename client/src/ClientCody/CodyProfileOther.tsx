import React, { useState, useEffect, useContext } from 'react';
import './Cody.css';
import axios from 'axios';
import { connect } from 'react-redux';

// socket.io

const mapStateToProps = (state: any) => {

		const { userSearchData } = state; 

		return { userSearchData: userSearchData };

};


// COMPONENTS

interface s_u_page {

	current_page: number; 
	from: number; 
	last_page: number; 
	offset: number; 
	per_page: number; 
	to: number; 
	total: number;

}

interface CodyProfileOtherProps {

	user: any;
	userSearchData: any;
	dispatch: any;
	
}

interface BlockedUsersProps {

	user: any;
	userSearchData: any;
	dispatch: any;

}

const ajaxCall = (user: number, per_page: number, current_page: number, s_u_dispatch: any, setWaiting: any, ajax: boolean) => {

				interface Body {

					user: number;
					per_page: number;
					current_page: number;
				
				}

				const url = "/user/getBlockedUsers";
				const body: Body = {

					user: user,
					per_page: per_page,
					current_page: current_page,

				};

				setWaiting(true);

				axios.post(url, body).then((res) => {

					const res_d = res.data;

					setWaiting(false);
					s_u_dispatch({ type: "add_blocked_data", data: res_d.data, page: res_d.page, ajax: ajax});

				})
				.catch((e: any) => { console.log(e) });



			};



const BlockedUsers: React.FC<BlockedUsersProps> = (props) => {

	const [blockedList, updateBL] = useState({ list: [ { id: 0, username: "" } ] });
	const [waiting, setWaiting] = useState(false);
	const searchUsers: any = props.userSearchData;
	const b_list = searchUsers.blocked;
	const b_ajax = searchUsers.blocked_ajax;
	const b_page = searchUsers.blocked_page;
	const disp = props.dispatch;
	let show = {display: "inline-block"};
	if (b_page.current_page > b_page.last_page) show = { display: "none" };

	let more = <span style={show} className="More-Blocked-Users" onClick={()=>{

			ajaxCall(props.user.id, b_page.per_page, b_page.current_page, disp, setWaiting, false);


	}}>More</span>

        useEffect(()=>{

		if (b_ajax === false) ajaxCall(props.user.id, b_page.per_page, b_page.current_page, disp, setWaiting, true);


	}, [props.user.id, b_page.per_page, b_page.current_page, disp, setWaiting, b_ajax]);

	return (<div className="Blocked-Users-Container">
		<div className="Blocked-Users-Title">Blocked Users</div>
		{b_list.map((u: {blocks: number; username: string}) => {

			let sty = { display: "none" };
			if (u.username !== "") sty = { display: "inline-block" };

			return <div className="Blocked-User" key={u.username}>
					<div>{u.username}</div>
					<i style={sty} onClick={() => {

					const url = '/user/removeBlockedUser/';
					const body: {user1: number; user2: number;} = {

						user1: props.user.id,
						user2: u.blocks

					};

					axios.post(url, body)
					.then((res) => {

						if (res.data.row === 1) {

							disp({ type: 'filter_blocked_data', id: u.blocks });

						}

					}).catch((e:any) => { console.log(e); });
					

				}} className="fas fa-ban" title="Unblock User"></i>
			       </div>
	

		})}
		{more}	
		</div>);


}

const CodyProfileOther2: React.FC<CodyProfileOtherProps> = (props) => {
 

  return (<div className="Cody-Profile-Other">
	  <BlockedUsers user={props.user} userSearchData={props.userSearchData} dispatch={props.dispatch}/>
	  </div>);
}

const CodyProfileOther = connect(mapStateToProps)(CodyProfileOther2);

export default CodyProfileOther;
