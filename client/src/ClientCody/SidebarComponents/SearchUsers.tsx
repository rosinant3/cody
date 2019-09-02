import React, { useState, useEffect, useRef } from 'react';
import './SearchUsers.css';

import Rosinante from '../Rosinante';
// axios
import axios from 'axios';
import { connect } from 'react-redux';

// socket.io

const mapStateToProps = (state: any) => {

		const { userSearchData } = state; 
		return { userSearchData: userSearchData};

};


interface SearchUsersProps {

	user: any;
	dispatch: any;
	userSearchData: any;

}

interface UsersProps {

	user: any;
	s_user: any;
	value: string;
	reset: boolean;
	s_u_dispatch: any;

}

// user1 blocks or adds user2
const ContactsManager = (reason: string, user1: number, user2: number, s_u_dispatch: any, username: string, username2: string) => {
		
		let url: string = ``;

		if (reason === "Add") url = `/user/add`;
		if (reason === "Block") url = `/user/block`;

		interface Body {

			reason: string;
			user1: number;
			user2: number;
			username: string;

		}

		let body = {

			user1: user1,
			user2: user2,
			username: username2

		};
		console.log(url);
		axios.post(url, body).then((res) => {

			let row = res.data.row[0];

			if (row) {

				s_u_dispatch({ type:"filter", id: user2, username: username, row: row });

			}


		}).catch((e: any) => { console.log(e); });
		
};

const Users: React.FC<UsersProps> = (props) => {

	const [imageState, setImageState] = useState(true);
	const profile_picture = `/public/users/${props.s_user.username}/profile.jpg`;
	const username = props.s_user.username || "";

	let letter;
	imageState === false? letter = username[0].toUpperCase(): letter = "";
	let content = <div className="Cody-Search-Users-Container">
		<img alt="profile_picture" style={{ display: "none" }} src={profile_picture} onError={(e: any) => {

			setImageState(false);

		}}/>
		<div className="Cody-Image-User-Container">
			<div className="Cody-Search-Users-Panel-Img" title={username} style={{ backgroundImage: `url('${profile_picture}')`, borderColor: "white" }} >
				<span>{letter}</span>
			</div>
		</div>
		<div className="Cody-Search-Users-Username" title={username}>{username}</div>
		<div className="Cody-Search-Users" title={`Add ${username}`}>
			<i onClick={(e:any)=> {

				if (e.target.className === "fas fa-user-plus enabled") {

					e.target.className = "fas fa-user-plus";
					ContactsManager("Add", props.user.id, props.s_user.id, props.s_u_dispatch, props.s_user.username, props.user.username);

				}

				}} className="fas fa-user-plus enabled"></i>
			</div>
		<div className="Cody-Search-Users-Block enabled" title={`Block ${username}`}>
			<i onClick={(e:any) =>{

				if (e.target.className === "fas fa-ban enabled") {

					e.target.className = "fas fa-ban";
					ContactsManager("Block", props.user.id, props.s_user.id, props.s_u_dispatch, props.s_user.username, props.user.username);

				}

		}} className="fas fa-ban enabled"></i>
		</div>
		</div>;

	if (props.reset === false) {

		content = <div></div>;

	}


	return (<React.Fragment>{content}</React.Fragment>);

	

};

const ajaxCall = (e: any, user: number, per_page: number, current_page: number, s_u_dispatch: any, reset: boolean, setWaiting: any, setError: any) => {

				interface Body {

					value: string;
					user: number;
					per_page: number;
					current_page: number;
				
				}

				const url = "/user/getUsers";
				let value: string;
				e.currentTarget? e.preventDefault() : value = e;
				e.currentTarget? value = e.currentTarget.username.value.trim() : value = e;
				const body: Body = {

					value: value,
					user: user,
					per_page: per_page,
					current_page: current_page,


				};

				setWaiting(true);

				axios.post(url, body).then((res) => {

					const res_d = res.data;
		
					if (res_d.error) {

						setError(true);
						


					} else {

						setWaiting(false);
						s_u_dispatch({ type: "add_data", value: value, data: res_d.data, page: res_d.page, reset: reset  });

					}

				})
				.catch((e: any) => { console.log(e) });



			};

const SearchUsers2: React.FC<SearchUsersProps> = (props) => {

  const [waiting, setWaiting] = useState(false);

  let scrollContainer = useRef(null);
  let scrollItem = useRef(null);
  const searchUsers = props.userSearchData;
  //searchUsers.s_u_dispatch;
  //searchUsers.s_u_state;
  const per_page = searchUsers.page.per_page;
  const current_page = searchUsers.page.current_page;
  const last_page = searchUsers.page.last_page;
  const total = searchUsers.page.total;
  const data_len = searchUsers.data.length;
	
  let spinner;
  waiting? spinner = <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : spinner = <div></div>;
  const [visible, setVisible] = useState(true);
  let display: { cursor: string };
  let value = searchUsers.value;
  useEffect(()=>{if (value === "" || value.length > 15) setVisible(false);}, [setVisible, value]);
  visible? display = { cursor: "pointer" } : display = { cursor: "default" };  

  useEffect(() => {

	if (current_page > 1 && (total <= per_page || data_len < total)) {

       		let Rosi: any = new Rosinante({

				scrollContainer: scrollContainer.current, 
				scrollItem: scrollItem.current, 
				scrollTarget: scrollItem.current,
				once: true,
				visible: () => { 

					ajaxCall(

						value, 
						props.user.id, 
						per_page, 
						current_page, 
						props.dispatch, 
						false, 
						setWaiting,
						setVisible

					); 


				}, 
				notVisible: () => {}, 
				throttle: 400, 
				responsiveBreakPoint: 800, 
				elementPieceSmall: 50, 
				elementPieceLarge: 50

			});

	if (current_page <= last_page) { Rosi.callRosinante()}

	return () => { Rosi.removeRosinante() }

     }

  }, [current_page, last_page, per_page, props.user.id, props.dispatch, setWaiting, value, data_len, total ]);

  return (<div className="Cody-Search-Users">
		<form onSubmit={(e) => {

				ajaxCall(e, props.user.id, per_page, 1, props.dispatch, true, setWaiting, setVisible);

			}} className="Cody-Search-Users-Form">
			<input defaultValue={value} onChange={(e:any) => {

				let t = e.currentTarget.value.trim();

				if (t === "") {

					setVisible(false);	

				}

				else if (t.length > 15) {

					setVisible(false);

				}

				else if (t === value) {

					setVisible(false);

				}

				else {

					setVisible(true);
					props.dispatch({ type: "change_value", value: t, data: {  } });

				}
		
			}} className="Cody-Search-Users-Form-Input" name="username" type="text" placeholder="Username" />
			<button style={display} disabled={!visible} className="Cody-Search-Users-Form-Submit" type="submit" value="Search"><i className="fas fa-search"></i></button>
		</form>
		
		<div ref={scrollContainer} className="Cody-Search-Users-Results">

		 {searchUsers.data.map((user: { username: string, id: number; location: string, first_name: string, last_name: string })=> {

				return <Users value={searchUsers.value} s_u_dispatch={props.dispatch} reset={searchUsers.reset} key={user.username} user={props.user} s_user={user} />;
				



		})}
		
		<div ref={scrollItem} className="Scroll-Item-Container">{spinner}</div>
		</div>

	  </div>);
}


const SearchUsers = connect(mapStateToProps)(SearchUsers2);

export default SearchUsers;
