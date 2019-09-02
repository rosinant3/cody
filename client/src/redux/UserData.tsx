interface userDataTypes {

	username: string;
	email: string;
	verified: number | string;
	id: number;
        profile_picture: string;
	first_name: string;
	last_name: string;
	location: string;
	created_at: string;
	set: boolean;
	socket: any;

}

interface userDataActionTypes {

	type: string;
	data: userDataTypes;
	socket?: any;

}

const userData: userDataTypes = {

	username: "",
	email: "",
	verified: 0,
	id: 0,
	profile_picture: "",
	first_name: "",
	last_name: "",
	location: "",
	created_at: "",
	set: false,
	socket: false


};

const userDataReducer = (state: userDataTypes = userData, action: userDataActionTypes) => {

    switch (action.type) {
    case 'socket':
    return { ...state, socket: action.socket };
    case 'change_picture':
    return { ...state, profile_picture: action.data.profile_picture };
    case 'login':
    return {...state, profile_picture: `http://localhost:5000/public/users/${action.data.username}/profile.jpg`, username: action.data.username, email: action.data.email, verified: action.data.verified, id: action.data.id};
    case 'add_info':
    return {...state, first_name: action.data.first_name, last_name: action.data.last_name, location: action.data.location, created_at: action.data.created_at, set: true};
    default:
    return { ...state };
  }

}

export default userDataReducer;
