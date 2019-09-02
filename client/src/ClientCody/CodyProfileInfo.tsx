import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './Cody.css';

interface userTypes {

	username: string;
	email: string;
	verified: number | string;
	id: number;
        profile_picture: string;
	first_name: string;
	last_name: string;
	location: string;
	created_at: string;
	set: boolean;

}

interface CodyProfileInfoProps {

	user: userTypes;
	dispatchUserState: any;

}

const getUserInfo = (user: number, dispatchUserState: any) => {

	const body = { user: user };
	const url = `/user/getInfo`;
	axios.post(url, body).then((res:any) => {

			dispatchUserState({type: 'add_info', data: res.data});

		}).catch((e:any) => {console.log(e)});


}

const sendFile = (e: any, username: string, errorState: any, opaState: any, dispatchUserState: any): void => {

	const url = '/user/changePicture';
	const t = e.currentTarget;
	e.preventDefault();
	const file = t.image.files[0];
	const formData = new FormData();
	formData.append('image', file);
	formData.append('username', username);

	const config = {
        	headers: {
            	  'content-type': 'multipart/form-data'
        	}
    	}

        axios.post(url, formData, config).then((res) => {

		if (res.data === 'File uploaded!') {
		
			t.value = "";
			opaState({ submit: "notVisible", image: true});
			dispatchUserState({ type: "change_picture", data: { profile_picture: `http://localhost:5000/public/users/${username}/profile.jpg?random="${+new Date().getTime()}` } });

		} else  { 

			errorState({ msg: res.data });

		}

	}).catch((e:any) => { console.log(e); });

}

interface EditorProps {

	input: string;
	user: userTypes;
	id: number;
	dispatchUserState: any;

}

interface Body {

	first_name: string;
	last_name: string;
	location: string;
	created_at: string;

}

const UserInfoEditor: React.FC<EditorProps> = (props) => {
	
	const [formStatus, changeFormStatus] = useState(false);
        let opacity = { opacity: 0 };
	let input: string = "";
	let form;
	let value: string = "";
	let status = { display: "none" };

	if (formStatus) status = { display: "block" };

	const created = moment(new Date(props.user["created_at"])).format("MMM Do YY");

	if (props.input === "created_at") {

		if (props.user["created_at"] !== "") opacity = { opacity: 1 }; form = <div style={opacity} className="joined">{`Joined: ${created}`}</div>; value = "";

	}

	else {

		if (props.input === "first_name") {

			input = "First Name"; 
			value = props.user["first_name"];
              

		}

		if (props.input === "last_name") {

			input = "Last Name"; 
			value = props.user["last_name"];

		}

		if (props.input === "location") {

			input = "Location"; 
			value = props.user["location"]; 

		}

		props.user.set === false? opacity = { opacity: 0 } : opacity = { opacity: 1 };

		form =	<form onSubmit={(e: any) => {

			e.preventDefault();
			let t = e.currentTarget[props.input].value;
			let body: Body = { first_name: "", last_name: "", location: "", created_at: props.user.created_at};

			if (props.input === "first_name") {

				body.first_name = t;
				body.last_name = props.user.last_name;
				body.location = props.user.location;

			}

			if (props.input === "last_name") {

				body.first_name = props.user.first_name;
				body.last_name = t;
				body.location = props.user.location;
				

			}

			if (props.input === "location") {

				body.first_name = props.user.first_name;
				body.last_name = props.user.last_name;
				body.location = t;

			}

			axios.post("/user/update", { value: t, column: props.input, user: props.id }).then((res) => {

				props.dispatchUserState({type: 'add_info', data: body});
				changeFormStatus(false);
				value = t;

			}).catch((e:any) => { console.log(e); });

		}} className="Change-Info-Form">
		<input style={opacity} onChange = { (e: any) => { 
		
			let t = e.currentTarget.value;
			let characters;
			props.input === "location"? characters = 255: characters = 35;

			if (value === t) {
		
				changeFormStatus(false);

			} else if (t === "") {

				changeFormStatus(false);

			} else if (t.length > characters) {

				changeFormStatus(false);

			} else { 

				changeFormStatus(true);

			}

		}} className="Change-Info-Form-Input" type="text" name={props.input} placeholder={input} defaultValue={value} />
		<input style={status} disabled={!status} className="Change-Info-Form-Submit" type="submit" value="Change" />
		</form>

	}

	return form;

}

const CodyProfileInfo: React.FC<CodyProfileInfoProps> = (props) => {

  const fileUpload: any = useRef(null);
  const [opaState, changeOpaState] = useState({ submit: "notVisible", image: true });
  const [errorState, changeErrorState] = useState({ msg: ""});
  let letter;
  let color;
  let display;
  opaState.submit === "visible"? color = { opacity: 1 } : color = { color: "" };
  opaState.submit === "visible"? display = { display: "block" } : display = { display: "none" };
  if (opaState.image === false) letter = props.user.username[0].toUpperCase();
  const infoKeys = ['created_at', 'first_name', 'last_name', 'location'];
	
  useEffect(() => {

	if (props.user.created_at === "") {

		getUserInfo(props.user.id, props.dispatchUserState);

	}


  }, [props.dispatchUserState, props.user.created_at, props.user.id ]);

  return (<div>
		<img alt="profile_picture" style={{ display: "none" }} src={props.user.profile_picture} onError={(e: any) => {

			changeOpaState({ image: false, submit: opaState.submit });

		}}/>
		<form onSubmit={(e: any) => { sendFile(e, props.user.username, changeErrorState, changeOpaState, props.dispatchUserState) }} className="Cody-Image-User-Container-Form"><div data-refresh={opaState.submit} className="Cody-User-Panel-Img" title="Change Image" style={{ backgroundImage: `url('${props.user.profile_picture}')` }} onClick={() => {

				fileUpload.current.click();
				
				}}>
				<i className="fas fa-file-upload" style={color} ></i>
				<span>{letter}</span>
				<input type="file" name="image" onChange={(e: any) => {

					e.currentTarget.files.length === 1? changeOpaState({ submit: "visible", image: opaState.image }) : changeOpaState({ submit: "notVisible", image: opaState.image });

				}} ref={fileUpload} accept="image/jpg, image/jpeg"/>
			</div>
			<input style={display} type="submit" value="Change"/>
			</form>
			<div className="Image-Form-Upload-Error">{errorState.msg}</div>
		<div className="Cody-Profile-Info">
			<div>{props.user.email}</div>
			{infoKeys.map((key) => {return <UserInfoEditor user={props.user} id={props.user.id} key={key} input={key}dispatchUserState={props.dispatchUserState}/>})}

		</div>
	  </div>);
}

export default CodyProfileInfo;
