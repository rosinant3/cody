import user from '../models/user-model';
import users from '../online_users';

interface changeInterface {

	files: any;
	body: { username: string };


}

interface changeInfoInterface {

	files: any;
	body: { value: string; user: number; column: string };


}

interface getUsersInterface {

	body: any; // temoprary any
	app: any;

}


interface getInfoTypes {

	body: { user: number }

}

interface gotInfoTypes {

	created_at: string; first_name: string; last_name: string; location: string;

}

interface userEditControllersInt {

	changePicture: (req: changeInterface, res: any, next: any) => void;
	getInfo: (req: getInfoTypes, res: any, next: any) => void;
	changeInfo: (req: changeInfoInterface, res: any, next: any) => void;
	getUsers: (req: getUsersInterface, res: any, next: any) => void;
	addUser: (req: getUsersInterface, res: any, next: any) => void;
	blockUser: (req: getUsersInterface, res: any, next: any) => void;
	getBlockedUsers: (req: any, res: any, next: any) => void;
	removeBlockedUser: (req: any, res: any, next: any) => void;

}

const userEditControllers: userEditControllersInt = {

	addUser(req, res, next) {
	 
		const body = req.body;
		const user1 = req.body.user1;
		const user2 = req.body.user2;
		const username = req.body.username;
		 
		const io = req.app.get('socketio');

		user.addUser(user1, user2, false).then((row: number[]) => {

				res.send({added: true, row: row});

				if (user2 in users) {

					users[user2].forEach((socket: any)=>{

						socket.emit('contact-request', { id: user1, username: username });

					});

				}

		}).catch((e:any) => { console.log(e); });



	},


	blockUser(req, res, next) {

		const body = req.body;
		const user1 = req.body.user1;
		const user2 = req.body.user2;
		
		user.blockUser(user1, user2).then((row: number[]) => {

				res.send({added: true, row: row});

		}).catch((e:any) => { console.log(e); });


	},

	getInfo(req, res, next) {

		user.getInfo(req.body.user).then((info: Array<gotInfoTypes>) => {

			res.send(info[0]);
			

		}).catch((e: any) => { console.log(e); });

	},

	changeInfo(req, res, next) {
		
		const body = req.body;
		const user2 = body.user;
		const column = body.column;
		const value = body.value;

		user.editInfo(user2, value, column).then((row: any)=> {

			res.send({row: row[0]});

		}).catch((e: any) => { console.log(e); });

	},

	changePicture(req, res, next) {

		const username = req.body.username;
		const files = req.files;

		if (Object.keys(req.files).length == 0) {

    			return res.send('No files found.');

  		}

		const type = files.image.mimetype;
		const size = files.image.size;

		if (type !== "image/jpeg" || type !== "image/jpeg") {
	
			return res.send("Wrong type");

		}

		if (size > 5000000) {

			return res.send("File too large");

		}

		const url: string = `./public/users/${req.body.username}/profile.jpg`;
		let image = req.files.image;

		image.mv(url, function(err: any) {

    			if (err)
      			return res.status(500).send(err);

   			res.send('File uploaded!');

  		});

	},

	getUsers(req, res, next) {

		interface pageTypes {

			total: number; 
			per_page: number; 
			offset: number; 
			current_page: number; 
			from: number; 
			to: number; 
			last_page: number;


		};

		interface paginationTypes {

			page: pageTypes;
			data: any;
			

		};
		
		const reqData = req.body;
		const client_user =  reqData.user || "eric";
    		let pagination: paginationTypes = {
				page: {total: 0, per_page: 0, offset: 0, current_page: 0, from: 0, to: 0, last_page: 0},
				data: {}

		};
    		let per_page = reqData.per_page || 5;
    		let page = reqData.current_page || 1;
    		if (page < 1) page = 1;
    		let offset = (page - 1) * per_page;
		const value = reqData.value.trim();

		if (value === "" || value.length > 15) {

			res.send({ error: true });


		} else {

		const getUsers = user.getUsers(client_user, value, {offset: offset, per_page: per_page});
		const countUsers = user.countUsers(client_user, value);

		countUsers.then((count2: any) => {
			
			let count = count2[0][0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;

			getUsers.then((rows: any) => {

				pagination.page.to = offset + rows.length;
				pagination.page.last_page = Math.ceil(count / per_page);
				pagination.data = rows[0];

				return res.send(pagination);
						
			}).catch((e: any) => {console.log(e)});;
	
		}).catch((error: any) => {console.log(error)});


	    }

	},

	removeBlockedUser(req, res, next) {

		const body = req.body;
		const user1 = req.body.user1;
		const user2 = req.body.user2;

		user.removeBlockedUser(user1, user2).then((row: any) => {

			res.send({row: row});

		})
		.catch((e:any) => {console.log(e)});


	},

	getBlockedUsers(req, res, next) {

		interface pageTypes {

			total: number; 
			per_page: number; 
			offset: number; 
			current_page: number; 
			from: number; 
			to: number; 
			last_page: number;


		};

		interface paginationTypes {

			page: pageTypes;
			data: any;
			

		};
		
		const reqData = req.body;
		const client_user =  reqData.user || "eric";
    		let pagination: paginationTypes = {
				page: {total: 0, per_page: 0, offset: 0, current_page: 0, from: 0, to: 0, last_page: 0},
				data: {}

		};
    		let per_page = reqData.per_page || 5;
    		let page = reqData.current_page || 1;
    		if (page < 1) page = 1;
    		let offset = (page - 1) * per_page;

		const getBlockedUsers = user.getBlockedUsers(client_user, {offset: offset, per_page: per_page});
		const countBlockedtUsers = user.countBlockedUsers(client_user);

		countBlockedtUsers.then((count2: any) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;

			getBlockedUsers.then((rows: any) => {

				pagination.page.to = offset + rows.length;
				pagination.page.last_page = Math.ceil(count / per_page);
				pagination.data = rows;
	
				return res.send(pagination);
						
			}).catch((e: any) => {console.log(e)});
	
		}).catch((error: any) => {console.log(error)});


	    }

}
  
module.exports = userEditControllers;
