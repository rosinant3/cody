import userSidebarModel from '../../models/user-sidebar-model';
import users from '../../online_users';

interface requestsInterface {

	getContactRequests: (data: { user: number; per_page: number; current_page: number; corrector?: number }, socket: any) => void;
	getOfflineContacts: (data: { user: number; per_page: number; current_page: number; corrector?: number }, socket: any) => void;
	getOnlineContacts: (data: { user: number; per_page: number; current_page: number; corrector?: number }, socket: any) => void;
	userStatus: (user: number, status: boolean) => any;
	getAllContactsOnline: (user:number) => any;
	acceptRequest: (data: { user1: number; user2: number; username1: string; username2: string; }) => void;
	rejectRequest: (data: { user1: number; user2: number, block: boolean; username2: string }) => void;

};

const contactsSocketHandler: requestsInterface = {

	getAllContactsOnline(user) {

		return userSidebarModel. getAllOnlineContacts(user);


	},

	userStatus(user, status) {

		return userSidebarModel.userStatus(user, status);

	},

	getOfflineContacts(data, socket) {

		
		interface pageTypes {

			total: number; 
			per_page: number; 
			offset: number; 
			current_page: number; 
			from: number; 
			to: number; 
			last_page: number;
			corrector: number;


		};

		interface paginationTypes {

			page: pageTypes;
			data: any;
			

		};
		
		const reqData = data;
		const client_user =  reqData.user;
    		let pagination: paginationTypes = {
				page: {total: 0, per_page: 0, offset: 0, current_page: 0, from: 0, to: 0, last_page: 0, corrector: 0},
				data: {}

		};
    		let per_page = reqData.per_page || 5;
    		let page = reqData.current_page || 1;
		let corrector = reqData.corrector || 0;
    		if (page < 1) page = 1;
    		let offset = (page - 1) * per_page + corrector;

		const getContacts = userSidebarModel.getOfflineContacts(client_user, {offset: offset, per_page: per_page});
		const countContacts = userSidebarModel.countOfflineContacts(client_user);

		countContacts.then((count2: any) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;

			getContacts.then((rows: any) => {

				pagination.page.to = offset + rows.length;
				pagination.page.last_page = Math.ceil(count / per_page);
				pagination.data = rows;
	
				socket.emit('recieve-contacts-offline', pagination);
						
			}).catch((e: any) => {console.log(e)});
	
		}).catch((error: any) => {console.log(error)});

	},

        getOnlineContacts(data, socket) {

		
		interface pageTypes {

			total: number; 
			per_page: number; 
			offset: number; 
			current_page: number; 
			from: number; 
			to: number; 
			last_page: number;
			corrector: number;


		};

		interface paginationTypes {

			page: pageTypes;
			data: any;
			

		};
		
		const reqData = data;
		const client_user =  reqData.user;
    		let pagination: paginationTypes = {
				page: {total: 0, per_page: 0, offset: 0, current_page: 0, from: 0, to: 0, last_page: 0, corrector: 0},
				data: {}

		};
    		let per_page = reqData.per_page || 5;
    		let page = reqData.current_page || 1;
		let corrector = reqData.corrector || 0;
    		if (page < 1) page = 1;
    		let offset = (page - 1) * per_page + corrector;

		const getContacts = userSidebarModel.getOnlineContacts(client_user, {offset: offset, per_page: per_page});
		const countContacts = userSidebarModel.countOnlineContacts(client_user);

		countContacts.then((count2: any) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;

			getContacts.then((rows: any) => {

				pagination.page.to = offset + rows.length;
				pagination.page.last_page = Math.ceil(count / per_page);
				pagination.data = rows;
	
				socket.emit('recieve-contacts-online', pagination);
						
			}).catch((e: any) => {console.log(e)});
	
		}).catch((error: any) => {console.log(error)});

	},

	getContactRequests(data, socket) {

		interface pageTypes {

			total: number; 
			per_page: number; 
			offset: number; 
			current_page: number; 
			from: number; 
			to: number; 
			last_page: number;
			corrector: number;


		};

		interface paginationTypes {

			page: pageTypes;
			data: any;
			

		};
		
		const reqData = data;
		const client_user =  reqData.user;
    		let pagination: paginationTypes = {
				page: {total: 0, per_page: 0, offset: 0, current_page: 0, from: 0, to: 0, last_page: 0, corrector: 0},
				data: {}

		};
    		let per_page = reqData.per_page || 5;
    		let page = reqData.current_page || 1;
		let corrector = reqData.corrector || 0;
    		if (page < 1) page = 1;
    		let offset = (page - 1) * per_page + corrector;

		const getRequests = userSidebarModel.getRequests(client_user, {offset: offset, per_page: per_page});
		const countRequests = userSidebarModel.countRequests(client_user);

		countRequests.then((count2: any) => {
			
			let count = count2[0]["count(*)"];

			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;

			getRequests.then((rows: any) => {

				pagination.page.to = offset + rows.length;
				pagination.page.last_page = Math.ceil(count / per_page);
				pagination.data = rows;
	
				socket.emit('recieve-contact-requests', pagination);
						
			}).catch((e: any) => {console.log(e)});
	
		}).catch((error: any) => {console.log(error)});



	},

	rejectRequest(data) {

		const body = data;
		const user1 = body.user1;
		const user2 = body.user2;
		const block = body.block;
		const username2 = body.username2;

		userSidebarModel.rejectRequest(user1, user2, block)
		.then((row: any)=>{

			users[user1].forEach((socket: any)=>{

				socket.emit('contact-rejected', { row: row, id: user2, block: block, username: username2 });

			});

		})
		.catch((e: any) => { console.log(e); });

	},

	acceptRequest(data) {

		const body = data;
		const user1 = body.user1;
		const user2 = body.user2;
		const username = body.username1;
		const username2 = body.username2;

		userSidebarModel.acceptRequest(user1, user2)
		.then((row1: any)=>{
 
			if (row1) {

				let online: boolean = false;

				if (user2 in users) {

					online = true;

					users[user2].forEach((socket: any)=>{

					socket.emit('contact-accepted', { chat_id: user1 + user2, id: user1, username: username, status: online });

					});

				}
								
				users[user1].forEach((socket: any)=>{

				socket.emit('contact-accepted', { created_at: new Date(), chat_id: user1 + user2, id: user2, username: username2, status: online });

				});

			}

	  	}).catch((e: any) => { console.log(e); });

	}



};

export { contactsSocketHandler };
