import React, { useState } from 'react';
import './Cody.css';

// COMPONENTS

import CodyProfileInfo from "./CodyProfileInfo";
import CodyProfileOther from "./CodyProfileOther";

interface CodyProfileProps {

	user: any;
	dispatchUserState: any;
	visible: { display: string; }

}

const CodyProfile: React.FC<CodyProfileProps> = (props) => {

  const [profileState, changeProfileState] = useState({ position: "account" });
  let profile;
  let account = { backgroundColor: "lightgreen"};
  let av = { backgroundColor: "lightgreen"};
  let o = { backgroundColor: "lightgreen"};
  let counter = 0;
  
  if (profileState.position === "account") profile = <CodyProfileInfo dispatchUserState={props.dispatchUserState} user={props.user} />;
  if (profileState.position === "audioVideo") profile = <div>Audio & Video</div>;
  if (profileState.position === "other") profile = <CodyProfileOther user={props.user} />;

  profileState.position === "account"? account = { backgroundColor: "darkgreen" } : counter++;
  profileState.position === "audioVideo"? av = { backgroundColor: "darkgreen" } : counter++;
  profileState.position === "other"? o = { backgroundColor: "darkgreen" } : counter++;

  return (<div style={props.visible} className="Cody-Profile">
	  <nav className="Cody-Profile-Navigation">
		<div style={account} onClick={ () => { changeProfileState({ position: "account" }); } }>Account</div>
		<div style={av} onClick={ () => { changeProfileState({ position: "audioVideo" }); } }>Audio & Video</div>
		<div style={o} onClick={ () => { changeProfileState({ position: "other" }); } }>Other</div>
	  </nav>
	  {profile}
	  </div>);
}

export default CodyProfile;
