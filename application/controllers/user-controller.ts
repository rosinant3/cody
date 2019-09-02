const store2 = require('../utility/registration');

interface loginInterface {

	username: string | boolean;
	email: string | boolean;
	verified: number | boolean | undefined;
	id?: number | boolean;
	profile_picture: string | boolean;

}

interface joinBody {

	email: string;
	password: string;
	username: string;
	verified?: number;
	id?: number;
	profile_picture: string;

}

interface joinInterface {

	body: joinBody;
	session: any;
	cookies?: any;


}

interface userControllersInt {

	sessionController: (req: joinInterface, res: any, next: any) => void;
	joinController: (req: joinInterface, res: any, next: any) => void;
	loginController: (req: joinInterface, res: any, next: any) => void;

}

const userControllers: userControllersInt = {

  sessionController: function sessionController(req, res, next) {

  let cookiedata = store2.getCookie(req.cookies);

  cookiedata.then((email: any) => {

    if (email) {

      let username = store2.getUsername({email: email});

      username.then((result: loginInterface) => {

        let login: loginInterface = {

          username: result.username, 
          email: email, 
          verified: result.verified,
		      id: result.id,
		      profile_picture: result.profile_picture
                    
        };

        if (result.username === false && result.verified === false) {

          let login: loginInterface = {username: false, email: false, verified: false, profile_picture: false};
          
          res.send({login});

        }

        else {

          res.send({login});

        }


        
      }).catch((e: any)=>{console.log(e)});

 
    }

    else {

      let login: loginInterface = {username: false, email: false, verified: false, profile_picture: false};
      
      res.send({login});

    }

  }).catch((e: any) => {console.log(e)})
  
},

  joinController: function joinController (req, res) {

  let email = req.body.email.trim();
  let password = req.body.password.trim();
  let username = req.body.username.trim();

  let aut = store2.formValidation({

    email: email, 
    password: password, 
    username: username
  
  });

  if (aut === true) {

    let search = store2.searchUser({

      email: email,
      username: username

    });

    search.then((result: {state: boolean; message: string}) => {

    if (result.state === true ) {

      store2.createUser({

        username: username,
        password: password,
        email: email
      
      }).then((id: any) => {
	
	const user = id[0];

	store2.createUserInfo(user).then(()=>{

		store2.createUserStatus(user).then(()=> {
	
      const created = "USER_CREATED";
			const fs = require('fs');
			const dir = './public/users' + `/${username}`;

			if (!fs.existsSync(dir)){
   
				fs.mkdirSync(dir);

			}

        		req.session.email = email;
        		res.send(created);


		})

	})


      });
    }

    else {

      res.send(result);

    }});

  } 

  else {

    res.send(aut);

  }

},

loginController: function loginController (req, res) {

  let email = req.body.email.trim();
  let password = req.body.password.trim();
  let aut = store2.formValidation({

    email: email, 
    password: password, 
    username: "Gil"
  
  });

  if (aut) {

    store2
      .authenticate({

        email: email,
        password: password,
        username: 'Gil'

      })
      .then(({ success }: {success: boolean}) => {
         
        let username = store2.getUsername({email});

        username.then((result: joinBody) => {

            let login: loginInterface = {

                      username: result.username, 
                      email: email, 
                      verified: result.verified,
		                  id: result.id,
                      profile_picture: result.profile_picture
                      
            };

          if (success) {

            req.session.email = email;
            console.log(req.session)
	  	      res.send({login})

	        } else {
            
            res.send("Unauthorized")
          
          };

        }).catch((e: any) => {console.log(e)})
  
        
      })

  }

  else {

    res.send(aut);

  }

}

}
  
module.exports = userControllers;
