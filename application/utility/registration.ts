const knex2 = require('knex')(require('../../knexfile'));
// establish connection with the knex file
// then use it to creatue user with knex('user')
// write .debug() at the end for debugging purposes
const crypto2 = require('crypto');
// password encryption, it's native to node

interface validationObject {

	valemail: string;
	valpassword: string;
	valusername: string;

}

interface registrationObject {

	email?: string;
	password?: string;
	username?: string;

}

interface hashArg {

	password: string;
	salt?: any;

}
//searchUser: async function searchUser({username, email}) 
interface registrationInterface {

	saltHashPassword: (arg0: hashArg) => any;
	createUser: (arg0: registrationObject) => any;
	createUserInfo: (id: number) => any;
	createUserStatus: (id: number) => any;
	formValidation: (arg0: registrationObject) => any;
	authenticate: (arg0: registrationObject) => any;
	randomString: () => string;
	passwordValidation: (password: string) => any;
	emailValidation: (email: string) => any;
	userValidation: (username: string) => any;
	searchUser: (arg0: registrationObject) => any;
	getUsername: (arg0: registrationObject) => any;
	getCookie: (arg0: any) => Promise<any>;
	
	
	
	


};

const registration: registrationInterface = {
  // EXISTING USERNAME / EMAIL 
    //USER CREATION
  createUserStatus(id) {

	return knex2('userStatus').insert({

		user: id,
		status: false

	}).debug();

  },

  createUserInfo(id) {

	return knex2('userInfo').insert({

		first_name: "",
		last_name: "",
		location: "",
		user: id

	}).debug();

  },

  createUser ({ email, username, password = "" }) {

    let { salt, hash } = registration.saltHashPassword({ password });
   
    return knex2('user').insert({

      salt,
      password: hash,
      username,
      email,
      verified: false,

    }).debug();
  },
  // FORM VALIDATION
  formValidation({email = "", password = "", username = ""}) {

    let valEmail = registration.emailValidation(email);
    let valPassword = registration.passwordValidation(password);
    let valUsername = registration.userValidation(username);

    if (valEmail.state === true && valPassword.state === true && valUsername.state === true) {

      return true;

    }

    else {

      return {valEmail, valPassword, valUsername};

    }

  },
  // PASSWORD AUTHENTICATION
  authenticate ({ email = "", password = ""}) {

    return knex2('user').where({ email })
      .then(([user]: any) => {
        if (!user) return { success: false }

        const { hash } = registration.saltHashPassword({

          password,
          salt: user.salt

        })

        return { success: hash === user.password };

      }).catch((e: any) => {console.log(e)});
  },

  saltHashPassword ({ password, salt = registration.randomString()}) {

  let hash = crypto2
    .createHmac('sha512', salt)
    .update(password)

  return {

    salt,
    hash: hash.digest('hex')

  }

},

  randomString () {

  return crypto2.randomBytes(4).toString('hex');

},

  passwordValidation(password) {

  let rules = {

    oneNumberEx: /\d{1}/, // at least one number
    oneLowerCase: /[a-z]{1}/, // at least one lowercase
    oneUpperCase: /[A-Z]{1}/, // at least one uppercase
    characters: 6,

  }

  if (password === "") {

    return {message: `Password can't be blank.`, state: false};

  }

  if (rules.oneNumberEx.test(password) === false) {
    
    return {message:`Password must have at least one number.`, state: false};

  }

  if (rules.oneLowerCase.test(password) === false) {

    return {password:`Password must have at least one lowercase character.`, state: false};

  }

  if (rules.oneUpperCase.test(password) === false) {

    return {password:`Password must have at least one at least one uppercase character.`, state: false};

  }


  if (password.length < rules.characters) {
    
    return {characters: `Password can't have less than ${rules.characters} characters.`, state: false};

  }

  else {

    return { message: "", state: true };

  }

},

  emailValidation(email) {

  let emailRegEx = /^([^\s-])+([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;

  if (email === "") {
    
    let response = {message: `E-mail can't be blank.`, state: false};
    return response;

  }

  if (email.length > 244) {
    
    return {message: `E-mail too long.`, state: false};

  }
  

  if (emailRegEx.test(email) === false) {

    return {message:`Invalid E-mail.`, state: false};

  }

  else {

    return { message: "", state: true };

  }

},

  userValidation(username) {

  let userRules = {

    characters: 15,

  }

  if (username === "") {

    return {message: `Username can't be blank.`, state: false};
    
  }

  if (username.length > userRules.characters) {

    return {message: `Username character limit is
    ${userRules.characters}.`,  state: "user-false"};

  }

  else {

    return { message: "", state: true };

  }


},

searchUser: async function searchUser({username, email}) {

  let queryUsername = await knex2('user').where({

    username: username,


  }).select('username').then((result: any) => {

        return result;
    
  }).catch((e: any) => {console.log(e)});

    let queryEmail = await knex2('user').where({

    email: email

  }).select('email').then((result: any) => {

    return result;

  }).catch((e: any) => {console.log(e)});;

            let responseU;
            let responseE;

  for (let j = 0; j < queryUsername.length; j++) {
    
    if (queryUsername[j].username === username) {

      responseU = {message: `Username already exists.`, state: false};
      break;

    }

  }

  for (let i = 0; i < queryEmail.length; i++) {
   
    if (queryEmail[i].email === email) {

      responseE = {message: `Email already exists.`, state: false};
      break;
  
    }

  }

  if (responseU && responseE) {

    let responseB = {message: `Email and Username already exist.`, state: false}
    return responseB;

  }

  if (responseU) {

    return responseU;

  }

  if (responseE) {

    return responseE;

  }

  if (responseU === undefined && responseE === undefined) {
    
    return {state: true, message: ""};

  }

},

getUsername: async function getUsername({email}) {

    let getter = await knex2('user').where({

      email: email

    }).select('username', 'verified', 'id').then(([result]: any) => {

      if (result) {
        return { 
          
                  username:result.username, 
                  verified: result.verified,
		  id: result.id,};
                
                }
  }).catch((e: any) => {console.log(e)});
  
  if (getter) {

    return getter;

  }

  else {
    
    return {username: false, verified: false}

  }


},

getCookie: async function getCookie(id) {
  
  if (!("connect.sid" in id)) {

    return false;

  }

  else {

    let improvedID = id['connect.sid'].slice(2,38);

    let getter = await knex2('sessions').where({

      sid: improvedID
  
    }).select('sess').then(([result]: any) => {
  
        if (result) {
  
            return result;
  
        }
  
    }).catch((e: any) => {console.log(e)});;

    if (getter) {
      
      let parsedMail = JSON.parse(getter.sess);
  
      return parsedMail.email;
  
    }

  }

}

};

module.exports = registration;
