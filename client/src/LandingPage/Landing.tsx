import React, { useState, useEffect } from 'react';
import './Landing.css';
import axios from 'axios';
import formSubmit from './FormSubmit';
import validation from './Validation';

interface LandingProps {

	userData: any;
	userDispatch: any;

};

const Landing: React.FC<LandingProps> = (props) => {
  
  const userDispatch = props.userDispatch;
  const [active, setForm] = useState({ form: "Log in" });
  const [usernameError, setUsernameError] = useState({ message: "" });
  const [passwordError, setPasswordError] = useState({ message: "" });
  const [emailError, setEmailError] = useState({ message: "" });
  const [display, setDisplay] = useState({ opacity: 0 });
  const clearError = (): void => {

	setUsernameError({ message: "" });
	setPasswordError({ message: "" });
	setEmailError({ message:"" });

  };

  let inputUsername = <input type="text" name="username" placeholder="Username" onKeyUp={(e) => {

			let username = e.currentTarget.value.trim();
			let usernameVal = validation.userValidation(username);
			usernameVal.state === false? setUsernameError({ message: usernameVal.message }) : setUsernameError({ message: "" });

		 }}/>;
  let colorLogin;
  let colorJoin;
  if (active.form === "Log in") {colorLogin = "lightgreen"; colorJoin = "black"; inputUsername = <div></div>;}
  else { colorLogin = "black"; colorJoin = "lightgreen"};

  useEffect(() => {
 
	axios.get('/user/session').then((res) => {

		let data = res.data.login;
	
		if (data.email === false) {

			setDisplay({ opacity: 1 });

		} else {

			userDispatch({ type: "login", data: data });

		}

	}).catch((e: any) => { console.log(e)} );


  }, [userDispatch]);

  return (
    <div className="LandingPage" style={{ opacity: display.opacity }}>
    	<div className="CodyCover">
		<div>Cody</div>
    	</div>
	<div className="CodyForms">
		<div className="CodySmall">Cody</div>
		<form className="CodyForm" onSubmit={(event): void => {

				let state = {
			
					active: active,
					setUsernameError: setUsernameError,
					setPasswordError: setPasswordError,
					setEmailError: setEmailError,
					clearError: clearError,
					userDispatch: userDispatch

				};

				formSubmit(event, state);
				


		  }}>
		  <div>
			<div style={{ color: colorLogin }} onClick={() => { setForm({ form: "Log in" }); clearError(); }}>Login</div>
			<div style={{ color: colorJoin }} onClick={() => { setForm({ form: "Join" }); clearError(); } }>Join</div>
		  </div>
		  {inputUsername}
		  <input type="text" name="email" placeholder="E-mail" onKeyUp={(e) => {
	
			let email = e.currentTarget.value.trim();
			let emailVal = validation.emailValidation(email);
			emailVal.state === false? setEmailError({ message: emailVal.message }) : setEmailError({ message: "" });


		   }} />
		  <input type="password" name="password" placeholder="Password" onKeyUp={(e) => {

			let password = e.currentTarget.value.trim();
			let passwordVal = validation.passwordValidation(password, active.form);
			passwordVal.state === false? setPasswordError({ message: passwordVal.message }) : setPasswordError({ message: "" });

		   
		  }}/>
		  <input className="CodyFormSubmit" type="submit" value={active.form} />
		</form>
		<div>
		<div className="ValidationError">{usernameError.message}</div>
		<div className="ValidationError">{passwordError.message}</div>
		<div className="ValidationError">{emailError.message}</div>
		</div>
	</div>
    </div>
  );
}

export default Landing;
