interface ch_page {

	current_page: number; 
	from: number; 
	last_page: number; 
	offset: number; 
	per_page: number; 
	to: number; 
	total: number;
	ajax: boolean;
	corrector: number;

}

interface ch_data {

	username: string; 
	id: number;
	chat_id: number;
	first_name: string;
	last_name: string;
	location: string;
	status?: string;
	messages?: any;
	active?: boolean;
	page: ch_page;
	msg?: any;
	created_at?: any;
	created_At?: any;

}

interface chatsTypes {

	page_chats: ch_page;
	chats: Array<ch_data>;
	whereNot: any;

}

interface chatsActionTypes {

	type: string;
	data: Array<ch_data>;
	one_data: ch_data;
	page: ch_page;
	id?: number;
	ajax?: boolean;
	socket?: boolean;
	status?: boolean;
	user?: number;
	contact?: any;
	whereNot?: boolean;

}

const chats: chatsTypes = {

	whereNot: [],
	page_chats: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 10, to: 0, total: 0, ajax: false, corrector: 0 },
	chats: [{ page: 
		{ current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 10, to: 0, total: 0, ajax: false, corrector: 0 }
		, messages: [], created_at: "", chat_id: 0, username: "", id: 0, first_name: "", last_name: "", location: "", status: "0", active: false }],
	

};
 
const chatsReducer = (state: chatsTypes = chats, action: chatsActionTypes) => {
 
    switch (action.type) {
	case 'add_chat_msg':

	return { ...state };
	case 'change_user_status_chat':

		let status: any = "0";

		if (action.status) status = "1";

		const new_user_status_chat = state.chats.map((chat:any) => {

			if (chat.id === action.one_data.id) {

				chat.status = status;

			}

			return chat;


		});

	return { ...state, chats: new_user_status_chat  };
	case 'ajax_chat':

	return { ...state, page_chats: { ...state.page_chats, ajax: action.ajax } };
	case 'reset_chats':

	return { page_chats: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 10, to: 0, total: 0, ajax: false, corrector: 0 },
	chats: [{ page: 
		{ current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 10, to: 0, total: 0, ajax: false, corrector: 0 }
		, messages: [], chat_id: 0, created_at: "", username: "", id: 0, first_name: "", last_name: "", location: "", status: "0", active: false }],
	};
	case 'active_chat':

		let active_chat = state.chats.map((chat: any) => {

			if (action.contact === chat.id) {

				chat.active = true;

			}

			if (action.contact !== chat.id) {

				chat.active = false;

			}

			if (!chat.chat_id) {

				chat.chat_id = action.user + chat.id;

			}

			return chat;

		});

	return { ...state, chats: active_chat };
	case 'add_msg':

	let msg_state: any;

	if (action.socket) {

		let chat_data_socket: any = state.chats.slice();
	
		action.data.forEach((dat) => {
	
			chat_data_socket.unshift(dat);
	
		});
	
		if (state.page_chats.total === 0) {
	
			chat_data_socket = action.data;
	
		}

		let page_chats_socket: any = { 
			
			...state.page_chats, 
			total: state.page_chats.total + 1, 
			corrector: state.page_chats.corrector + 1 
		
		};
			
		msg_state = { ...state, chats: chat_data_socket, page_chats: page_chats_socket };


	} else {

		let chat_data_socket: any = state.chats.slice();
	
		action.data.forEach((dat) => {
	
			chat_data_socket.push(dat);
	
		});
	
		if (state.page_chats.total === 0) {
	
			chat_data_socket = action.data;
	
		}

		let page_chats_socket: any = { 
			
			...action.page,
			current_page: action.page.current_page + 1, 
			ajax: true
		
		};
			
		msg_state = { ...state, chats: chat_data_socket, page_chats: page_chats_socket };

	}

    return msg_state;
    case 'add_chats':

	let chats_state: any;
	
	if (action.socket) {

		let chat_data_socket: any = state.chats.slice();
		let whereNot = state.whereNot.slice();
	
		action.data.forEach((dat) => {
	
			chat_data_socket.unshift(dat);
			whereNot.push(dat.id);
	
		});
	
		if (state.page_chats.total === 0) {
	
			chat_data_socket = action.data;
	
		}

		const sorted_data_socket = chat_data_socket.sort((a: any, b: any) => {

			let b_created_at: any = b.created_at;
			let a_created_at: any = a.created_at;

			if (b.messages[0]) {

				b_created_at = b.messages[0].created_at;


			}

			if (a.messages[0]) {

				a_created_at = a.messages[0].created_at;

			}

			return +new Date(b_created_at) - +new Date(a_created_at);

	  	});

		let page_chats_socket: any = { 
			
			...state.page_chats, 
			total: state.page_chats.total + 1, 
			corrector: state.page_chats.corrector + 1 
		
		};
			
		chats_state = { ...state, whereNot: whereNot, chats: sorted_data_socket, page_chats: page_chats_socket };


	} else {

		let chat_data_socket: any = state.chats.slice();

		if (state.page_chats.total === 0) {
	
			chat_data_socket = [];
	
		}
	
		action.data.forEach((dat) => {

			let msg = [];
			if (dat.msg) {

				msg.push({ msg: dat.msg, created_at: dat.created_at });

			}

			const prepared_chat = {

				page: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 10, to: 0, total: 0, ajax: false, corrector: 0 },
				messages: msg,
				active: dat.active,
				chat_id: dat.chat_id,
				id: dat.id,
				status: dat.status,
				username: dat.username,
				first_name: "",
				last_name: "",
				location: "",
				created_at: dat.created_At,

			};
	
			chat_data_socket.push(prepared_chat);
	
		});

		const sorted_data_socket = chat_data_socket.sort((a: any, b: any) => {

			let b_created_at: any = b.created_at;
			let a_created_at: any = a.created_at;

			if (b.messages[0]) {

				b_created_at = b.messages[0].created_at;


			}

			if (a.messages[0]) {

				a_created_at = a.messages[0].created_at;

			}

			return +new Date(b_created_at) - +new Date(a_created_at);

	  	});

		let page_chats_socket: any = { 
			
			...action.page,
			current_page: action.page.current_page + 1, 
			ajax: true
		
		};
			
		chats_state = { ...state, chats: sorted_data_socket, page_chats: page_chats_socket };

	}

    return chats_state;
    default:
    return { ...state };
  }
 
}

interface con_data2 {

	state: chatsTypes;
	reducer: (state: chatsTypes, action: chatsActionTypes) => any;

}

export default chatsReducer;
