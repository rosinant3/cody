interface codyTypes {

	position: string;
	profile: boolean;

}

interface codyActionTypes {

	type: string;
	position: string;

}

const codyState: codyTypes = {

	position: "Contacts", // Contacts, Chats, Group Chats, Search Users
	profile: false
};
 
const codyReducer = (state : codyTypes = codyState, action: codyActionTypes) => {

    switch (action.type) {
    case 'change_profile':

    return { position: state.position, profile: !state.profile };
    case 'change_position':

    return { position: action.position, profile: state.profile };
    default:
    return { ...state };
  }

}

export default codyReducer;
