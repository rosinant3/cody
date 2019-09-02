import axios from 'axios';
import Validation from './Validation';

/*

state = {
			
	active: active,	
	setUsernameError: setUsernameError,
	setPasswordError: setPasswordError,
	setEmailError: setEmailError,
	userDispatch: userDispatch

};

*/

const formSumbit = (event: any, state: any) => {

				let t = event.currentTarget;
				event === "event"? t = "zero" : event.preventDefault(); 
				let route = "";
				let body;
				let validated : boolean = false;
				let email : string;
				let password : string;
				let username;
				const clearError = (): void => {

					state.setUsernameError({ message: "" });
					state.setPasswordError({ message: "" });
					state.setEmailError({ message:"" });
					validated = true

  				};

				if (state.active.form === "Log in") {

					route = '/user/login';
					state.email? email = state.email : email = t.email.value.trim();
					state.password? password = state.password : password = t.password.value.trim();
					let emailVal = Validation.emailValidation(email);
					let passwordVal = Validation.passwordValidation(password, state.active.form);
					let counter = 0;
					body = {

						email: email,
						password: password

					};	
					
					emailVal.state === false? state.setEmailError({ message: emailVal.message }) : counter++;
					passwordVal.state === false? state.setPasswordError({ message: passwordVal.message }) : counter++;
					counter === 2? clearError() : validated = false;				

				}

  				if (state.active.form === "Join") { 

					route = '/user/join';
					username = t.username.value.trim();
					email = t.email.value.trim();
					password = t.password.value.trim();
					let userVal = Validation.userValidation(username);
					let emailVal = Validation.emailValidation(email);
					let passwordVal = Validation.passwordValidation(password, state.active.form); 
					let counter = 0;
					body = {

						username: username,
						email: email,
						password: password

					};
			
					userVal.state === false? state.setUsernameError({ message: userVal.message }) : counter++;
					emailVal.state === false? state.setEmailError({ message: emailVal.message }) : counter++;
					passwordVal.state === false? state.setPasswordError({ message: passwordVal.message }) : counter++;
					counter === 3? clearError() : validated = false;


				}

				if (validated) {

					axios.post(route, body).then((res) => {

						const data = res.data;
						let counter = 0;

						if (data.valEmail) {

						data.valEmail.state === false? state.setEmailError({ message: data.valEmail.message }) : counter++;

						}

						if (data.valUsername) {

						data.valUsername.state === false? state.setUsernameError({ message: data.valUsername.message }) : counter++;

						}

						if (data.valPassword) {

						data.valPassword.state === false? state.setPasswordError({ message: data.valPassword.message }) : counter++;
		
						}

						if (data.message) {

							data.state === false? state.setUsernameError({ message: data.message }) : counter++;

						}

						if (data === "USER_CREATED") {

							clearError();
							let state2: any = {

								active: { form:"Log in" },
								userDispatch: state.userDispatch,
								email: email,
								password: password,
								setUsernameError: state.setUsernameError,
								setPasswordError: state.setPasswordError,
								setEmailError: state.setEmailError,

							};

							formSumbit("event", state2);


						}

						if (data === "Unauthorized") {

							state.setUsernameError({ message: "Unauthorized Access" });

						}

						if (data.login) {

							state.userDispatch({ type: "login", data: data.login });

						}

					}).catch((e: any) => {console.log(e)});


				}

}


export default formSumbit;
