interface ReturnType {

	state: boolean;
	message: string;

}

interface ValidationType {

	passwordValidation: (password: string, action: string) => ReturnType;
	emailValidation: (email: string) => ReturnType;
	userValidation: (username: string) => ReturnType;


}

const validation: ValidationType = {

passwordValidation: (password, active) => {

    let rules = {

      oneNumberEx: /\d{1}/, // at least one number
      oneLowerCase: /[a-z]{1}/, // at least one lowercase
      oneUpperCase: /[A-Z]{1}/, // at least one uppercase
      minCharacters: 6,
      maxCharacters: 127

    }

    if (active === "Log in") {

      if (password === "") {

        return {state: false, message: `Password can't be blank.`};
  
      }
  
      if (password.length > rules.maxCharacters) {
  
        return {state: false, message: `Password is too long.` };
     
      }
 
      else {

        return {state: true, message: ""};
  
      }

    } else {

      if (password === "") {

        return {state: false, message: `Password can't be blank.`};
  
      }
  
      if (rules.oneNumberEx.test(password) === false) {
  
        return {state: false, message:`Password must have at least one number.`};
  
      }
  
      if (rules.oneLowerCase.test(password) === false) {
    
        return {state: false, message:`Password must have at least one lowercase character.` };
  
      }
  
      if (rules.oneUpperCase.test(password) === false) {
      
        return {state: false, message:`Password must have at least one uppercase character.` };
  
      }
  
      if (password.length < rules.minCharacters) {
  
        return {state: false, message: `Password is too short.` };
     
      }
  
      if (password.length > rules.maxCharacters) {
  
        return {state: false, message: `Password is too long.` };
     
      }
  
      if (password.length > 120) {
  
        return {state: false, message: `Password is too long.`};
     
      }
       
      else {

        return {state: true, message: ""};
  
      }

    }
   
},

  emailValidation: (email) => {

    let emailRegEx = /^([^\s-])+([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;

    if (email === "") {

      return {state: false, message: `E-mail can't be blank.`};

    }

    if (email.length > 244) {

      return {state: false, message: `E-mail too long.`};
  
    }
    
  
    if (emailRegEx.test(email) === false) {

      return {state: false, message: `Invalid E-mail.`};

    }

  else {

    return {state: true, message: ""};

  }

},

    userValidation: (username) => {

      let userRules = {

        characters: 15,

      }

      if (username === "") {

        return {state: false, message: `Username can't be blank.`};

      }

      if (username.length > userRules.characters) {

        return {state: false, message: `Username character limit is ${userRules.characters}.`};
     
      }

      else {

        return {state: true, message: ""};

      }
}


}


export default validation;
