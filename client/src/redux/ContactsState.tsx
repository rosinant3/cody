
interface s_u_page {

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

interface s_u_data {

	username: string; 
	id: number;
	first_name: string;
	last_name: string;
	location: string;
	status?: string;

}

interface contactsDataTypes {

	page_online: s_u_page;
	contacts_online: Array<s_u_data>;

	page_offline: s_u_page;
	contacts_offline: Array<s_u_data>;

	page_requests: s_u_page;
	contacts_requests: Array<s_u_data>;

}

interface contactsDataActionTypes {

	type: string;
	data: Array<s_u_data>;
	one_data: s_u_data;
	page: s_u_page;
	id?: number;
	ajax?: boolean;
	socket?: boolean;
	status?: boolean;
	user: any;
	contact: any;

}

const contactsData: contactsDataTypes = {

	page_online: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 20, to: 0, total: 0, ajax: false, corrector: 0 },
	contacts_online: [{ username: "", id: 0, first_name: "", last_name: "", location: "" }],
	page_offline: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 20, to: 0, total: 0, ajax: false, corrector: 0 },
	contacts_offline: [{ username: "", id: 0, first_name: "", last_name: "", location: "" }],
	page_requests: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 20, to: 0, total: 0, ajax: false, corrector: 0 },
	contacts_requests: [{ username: "", id: 0, first_name: "", last_name: "", location: "" }],



};

const contactsDataReducer = (state: contactsDataTypes = contactsData, action: contactsDataActionTypes) => {

    switch (action.type) {
		case 'ajax_online':

		return {...state, page_online: { ...state.page_online, ajax: action.ajax }}
		case 'ajax_offline':

		return {...state, page_offline: { ...state.page_offline, ajax: action.ajax }};
		case 'active_contact':

				let active_offline = state.contacts_offline.slice();
				let active_online = state.contacts_online.slice();

				if (action.contact.status === "0") {

					active_offline = state.contacts_offline.map((chat: any) => {
		
						if (action.contact.id === chat.id) {
			
							chat.active = true;
			
						}
			
						if (action.contact.id !== chat.id) {
			
							chat.active = false;
			
						}
			
						if (!chat.chat_id) {
			
							chat.chat_id = action.user.id + chat.id;
				
			
						}
			
						return chat;
			
					});


				}

				else {

					active_online = state.contacts_online.map((chat: any) => {
		
						if (action.contact.id === chat.id) {
			
							chat.active = true;
			
						}
			
						if (action.contact.id !== chat.id) {
			
							chat.active = false;
			
						}
			
						if (!chat.chat_id) {
			
							chat.chat_id = action.user.id + chat.id;
			
						}
			
						return chat;
			
					});

				}

			return { ...state, contacts_offline: active_offline, contacts_online: active_online };
    case 'change_user_status':

	let contact_state2 = { ...state };

	if (action.status) {

	    if (state.page_offline.ajax && state.page_online.ajax) {

		const online = state.contacts_online.slice();
		const offline = state.contacts_offline.filter((data: any) => {

			return data.id !== action.one_data.id;

		}).sort((a: any, b: any) => {

  				const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  				const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  				if (nameA < nameB) {
    					return -1;
  				}
  				if (nameA > nameB) {
    					return 1;
  				}

  				// names must be equal
  				return 0;
		});

		const offline_p = { ...state.page_offline,  total: state.page_offline.total - 1, corrector: state.page_offline.corrector - 1 };

		online.unshift({ status: "1", username: action.one_data.username, id: action.one_data.id, first_name: "", last_name: "", location: "" });
		online.sort((a: any, b: any) => {

  				const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  				const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  				if (nameA < nameB) {
    					return -1;
  				}
  				if (nameA > nameB) {
    					return 1;
  				}

  				// names must be equal
  				return 0;
		});
		
		const online_p = { ...state.page_online,  total: state.page_online.total + 1, corrector: state.page_online.corrector + 1 };
		
		contact_state2 = { ...state, contacts_offline: offline, contacts_online: online, page_offline: offline_p, page_online: online_p };

	     }
		
	} 

	if (!action.status) {

          if (state.page_offline.ajax && state.page_online.ajax) {

		const offline = state.contacts_offline.slice();
		const online = state.contacts_online.filter((data: any) => {

			return data.id !== action.one_data.id;

		}).sort((a: any, b: any) => {

  				const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  				const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  				if (nameA < nameB) {
    					return -1;
  				}
  				if (nameA > nameB) {
    					return 1;
  				}

  				// names must be equal
  				return 0;
		});

		const online_p = { ...state.page_online,  total: state.page_online.total - 1, corrector: state.page_online.corrector - 1 };

		offline.unshift({ status: "0", username: action.one_data.username, id: action.one_data.id, first_name: "", last_name: "", location: "" });
		offline.sort((a: any, b: any) => {

  				const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  				const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  				if (nameA < nameB) {
    					return -1;
  				}
  				if (nameA > nameB) {
    					return 1;
  				}

  				// names must be equal
  				return 0;
			});

		const offline_p = { ...state.page_offline,  total: state.page_offline.total + 1, corrector: state.page_offline.corrector + 1 };

		contact_state2 = { ...state, contacts_offline: offline, contacts_online: online, page_offline: offline_p, page_online: online_p };

	    }

	}

	return contact_state2;
	case 'reset_both':

	return { ...state, page_online: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 20, to: 0, total: 0, ajax: false, corrector: 0 }, contacts_online: [{ username: "", id: 0, first_name: "", last_name: "", location: "" }], 
	page_offline: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 20, to: 0, total: 0, ajax: false, corrector: 0 }, contacts_offline: [{ username: "", id: 0, first_name: "", last_name: "", location: "" }] };
    case 'reset_online':

    return { ...state, page_online: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 20, to: 0, total: 0, ajax: false, corrector: 0 }, contacts_online: [{ username: "", id: 0, first_name: "", last_name: "", location: "" }] };
    case 'reset_offline':

    return { ...state, page_offline: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 20, to: 0, total: 0, ajax: false, corrector: 0 }, contacts_offline: [{ username: "", id: 0, first_name: "", last_name: "", location: "" }] };
    case 'add_contact':

	let contact_state: any;

	if (action.socket) {
	
		if (action.status) {

			let online_data_socket: any = state.contacts_online.slice();

			action.data.forEach((dat) => {

				online_data_socket.push(dat);

			});

			if (state.page_online.total === 0) {

				online_data_socket = action.data;

			}

			online_data_socket.sort((a: any, b: any) => {

  				const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  				const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  				if (nameA < nameB) {
    					return -1;
  				}
  				if (nameA > nameB) {
    					return 1;
  				}

  				// names must be equal
  				return 0;
			});

			let page_online_socket: any = { ...state.page_online, total: state.page_online.total + 1, corrector: state.page_online.corrector + 1 };
		
			contact_state = { ...state, contacts_online: online_data_socket, page_online: page_online_socket };

		}

		else {

			let offline_data_socket: any = state.contacts_offline.slice();
			
			action.data.forEach((dat) => {

				offline_data_socket.push(dat);

			});

			if (state.page_offline.total === 0) {

				offline_data_socket = action.data;

			}

			offline_data_socket.sort((a: any, b: any) => {

  				const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  				const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  				if (nameA < nameB) {
    					return -1;
  				}
  				if (nameA > nameB) {
    					return 1;
  				}

  				// names must be equal
  				return 0;
			});

			let page_offline_socket: any = { ...state.page_offline, total: state.page_offline.total + 1, corrector: state.page_offline.corrector + 1 };

			contact_state = { ...state, contacts_offline: offline_data_socket, page_offline: page_offline_socket };

		}

	}

	else {

		if (action.status) {

			let online_data_ajax: any = state.contacts_online.slice();
			
			action.data.forEach((dat) => {

				online_data_ajax.push(dat);

			});

			if (state.page_offline.total === 0) {

				online_data_ajax = action.data;

			}

			online_data_ajax.sort((a: any, b: any) => {

  				const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  				const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  				if (nameA < nameB) {
    					return -1;
  				}
  				if (nameA > nameB) {
    					return 1;
  				}

  				// names must be equal
  				return 0;
			});
			
			let page_online_ajax: any = { ...action.page, current_page: action.page.current_page + 1, ajax: true };
 
			contact_state = { ...state, contacts_online: online_data_ajax, page_online: page_online_ajax };

		}

		else {

			let offline_data_ajax: any = state.contacts_offline.slice();
			
			action.data.forEach((dat) => {

				offline_data_ajax.push(dat);

			});

			if (state.page_offline.total === 0) {

				offline_data_ajax = action.data;

			}

			offline_data_ajax.sort((a: any, b: any) => {

  				const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  				const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  				if (nameA < nameB) {
    					return -1;
  				}
  				if (nameA > nameB) {
    					return 1;
  				}

  				// names must be equal
  				return 0;
			});
			
			let page_offline_ajax: any = { ...action.page, current_page: action.page.current_page + 1, ajax: true };

			contact_state = { ...state, contacts_offline: offline_data_ajax, page_offline: page_offline_ajax };

		}

	}

    return contact_state;
    case 'remove_contact_request':
	let f_r_data = state.contacts_requests.filter((data) => {

			return data.id !== action.id;

		});
	const r_total = state.page_requests.total - 1;

    return { ...state, contacts_requests: f_r_data, page_requests: { ...state.page_requests, total: r_total, corrector: state.page_requests.corrector - 1 }};
    case 'add_contact_requests':
	
	let page_requests: s_u_page = { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 20, to: 0, total: 0, ajax: false, corrector: 0 };
	let data_requests: Array<s_u_data> = [ { username: "", id: 0, first_name: "", last_name: "", location: "" }, ];
	let data_state_requests = state.contacts_requests.slice();

	if (action.socket) {

		action.data.forEach((dat) => {

			data_state_requests.unshift(dat);

		});
		data_requests = data_state_requests;
		page_requests = { ...state.page_requests, total: state.page_requests.total + 1, corrector: state.page_requests.corrector + 1 };

	}	

	else {

		if (action.page.current_page === 1) {

			data_requests = action.data.sort((a: any, b: any) => {

  				const nameA = a.username.toUpperCase(); // ignore upper and lowercase
  				const nameB = b.username.toUpperCase(); // ignore upper and lowercase
  				if (nameA < nameB) {
    					return -1;
  				}
  				if (nameA > nameB) {
    					return 1;
  				}

  				// names must be equal
  				return 0;
			});
	
			page_requests = { ...action.page, current_page: action.page.current_page + 1, ajax: true };

		}

		if (action.page.current_page > 1) {

			action.data.forEach((dat) => {

				data_state_requests.push(dat);

			});
			data_requests = data_state_requests;
			page_requests = { ...state.page_requests, current_page: state.page_requests.current_page + 1 };
		
		}

	}


	
    return { ...state, contacts_requests: data_requests, page_requests: page_requests };
    default:
    return { ...state };
  }

}

interface con_data2 {

	state: contactsDataTypes;
	reducer: (state: contactsDataTypes, action: contactsDataActionTypes) => any;

}

export default contactsDataReducer;
