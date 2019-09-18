import chatsModel from '../../models/chat-sidebar-model';

interface chatsInterface {

	getChats: (data: {  whereNot: number[], user: number; per_page: number; current_page: number; corrector?: number }, socket: any) => void;
	getChat: (data: {chat_id: number, per_page: number, current_page: number; corrector?: number}, socket: any) => void;
	sendMessage: (data:  { username: string; chat_id: number; user: number; contact: number; message: string; images: string[]; files: string[] }, socket: any) => any;

};

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
	single: boolean;
	chat_id?: number;
	

};
 
const chatsSocketHandler: chatsInterface = {

	sendMessage(data, socket) {

		const chat_id = data.chat_id;
		const user = data.user;
		const contact = data.contact;
		const message = data.message.trim();
		const images = data.images;
		const files = data.files;
		const username = data.username;
 
		if (message === "" || message.length === 0 || message.length > 1000) {

			socket.emit('recieve-message', { validationError: true });

		}	else {

			chatsModel.sendMessage(chat_id, user, contact, message, username);

		}

	},

	getChat(data, socket) {

		const reqData = data;
		let pagination: paginationTypes = {
				
			page: {total: 0, per_page: 0, offset: 0, current_page: 0, from: 0, to: 0, last_page: 0, corrector: 0},
			data: {},
			single: true

		}; 
		let per_page = reqData.per_page || 5;
    	let page = reqData.current_page || 1;
		let corrector = reqData.corrector || 0;
		pagination.page.corrector = corrector;
    	if (page < 1) page = 1;
		let offset = (page - 1) * per_page + corrector;
		const getChats = chatsModel.getChat(data.chat_id, {offset: offset, per_page: per_page});
		const countChat = chatsModel.countChats(data.chat_id);

		countChat.then((count2: any) => {
			 
			let count = count2[0][0]["count(*)"];
			
			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;

			getChats.then((rows: any) => {

				pagination.data = rows[0];
				pagination.page.to = offset + rows.length;
				pagination.page.last_page = Math.ceil(count / per_page);
				pagination.chat_id = data.chat_id;
  
				socket.emit('recieve-chat', pagination);
					
			}).catch((e: any) => {console.log(e)});

	}).catch((error: any) => {console.log(error)});


	},

	getChats(data, socket) {
		
		const reqData = data;
		let single: boolean = false;
		if (reqData.current_page > 1) single = true;
		const client_user =  reqData.user;
    		let pagination: paginationTypes = {

				page: {total: 0, per_page: 0, offset: 0, current_page: 0, from: 0, to: 0, last_page: 0, corrector: 0},
				data: {},
				single: single

			};

    		let per_page = reqData.per_page || 5;
    		let page = reqData.current_page || 1;
			let corrector = reqData.corrector || 0;
    		if (page < 1) page = 1;
			let offset = (page - 1) * per_page + corrector;
			let whereNot = reqData.whereNot;

		const getChats = chatsModel.getChats(client_user, {whereNot: whereNot, offset: offset, per_page: per_page});
		const countChats = chatsModel.countChats(client_user);

		countChats.then((count2: any) => {
			 
			let count = count2[0][0]["count(*)"];
			
			pagination.page.total = count;
			pagination.page.per_page = per_page;
			pagination.page.offset = offset;
			pagination.page.current_page = page;
			pagination.page.from = offset;

			getChats.then((rows: any) => {

				pagination.page.to = offset + rows.length;
				pagination.page.last_page = Math.ceil(count / per_page);
				pagination.data = rows[0];

				socket.emit('recieve-chats', pagination);
						
			}).catch((e: any) => {console.log(e)});
	
		}).catch((error: any) => {console.log(error)});

	},


};

export { chatsSocketHandler };
