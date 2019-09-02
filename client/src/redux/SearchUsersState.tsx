interface s_u_page {

	current_page: number; 
	from: number; 
	last_page: number; 
	offset: number; 
	per_page: number; 
	to: number; 
	total: number;

}

interface s_u_data {

	username: string; 
	id?: number;
	blocks?: number;

}

interface searchUsersDataTypes {

	value: string;
	page: s_u_page;
	data: Array<s_u_data>;
	reset: boolean;
	blocked: Array<s_u_data>;
	blocked_page: s_u_page;
	blocked_ajax: boolean;

}

interface searchUsersActionTypes {

	type: string;
	value: string;
	data: Array<s_u_data>;
	page: s_u_page;
	reset: boolean;
	id: number;
	username: string;
	ajax: boolean;

}

const searchUserData: searchUsersDataTypes = {

	value: "",
	page: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 10, to: 0, total: 0 },
	data: [{ username: "", id: 0 }],
	reset: false,
	blocked: [{ username: "", blocks: 0 }],
	blocked_page: { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 10, to: 0, total: 0 },
	blocked_ajax: false


};

const userSearchDataReducer = (state: searchUsersDataTypes = searchUserData, action: searchUsersActionTypes) => {

    switch (action.type) {
    case 'add_blocked_data':

	let blocked  = state.blocked.slice();
	let n_b_page: any = { ...state.blocked_page };

	if (action.ajax) {

		n_b_page = { ...action.page, current_page: action.page.current_page + 1 }
		blocked = action.data;

	}

	else {action.data.forEach((us) => { 

		let flag = false;

		state.blocked.forEach((es) => {

			if (es.username === us.username) flag = true;

		});

		
		if (!flag) blocked.push(us) 

	    });

	}

	

    return { ...state, blocked_ajax: true, blocked_page: n_b_page, blocked: blocked };
    case 'filter_blocked_data':

	let f_b_data = state.blocked.filter((data) => {

			return data.blocks !== action.id;

		});

    return { ...state, blocked: f_b_data };
    case 'filter':

	let f_data = state.data.filter((data) => {

			return data.id !== action.id;

		});
	let b_data = state.blocked.slice();

        let new_blocked: {username: string; blocks: number;} = { username: action.username, blocks: action.id };
	    b_data.push(new_blocked);
	    

    return { ...state, data: f_data, blocked: b_data };
    case 'change_value':
    return { ...state, value: action.value  };
    case 'add_data':

	let value: string = action.value;
	let page: s_u_page = { current_page: 1, from: 0, last_page: 0, offset: 0, per_page: 10, to: 0, total: 0 };
	let data: Array<s_u_data> = [ { username: "", id: 0 }, ];
	let data_state = state.data.slice();

	if (action.reset) {

		value = action.value;
		data = action.data;
		page = { ...action.page, current_page: action.page.current_page + 1 };

	}

	if (!action.reset) {


		value = state.value;
		action.data.forEach((dat) => {

			data_state.push(dat);

		});
		data = data_state;
		page = { ...state.page, current_page: state.page.current_page + 1 };
		
	}

    return { ...state, value: value, page: page, data: data, reset: true };
    default:
    return { ...state };
  }

}

export default userSearchDataReducer;
