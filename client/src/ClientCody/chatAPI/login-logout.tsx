const login_user = (id: number, username: string, socket: any, dispatch: any) => {

	socket.emit('login', { user: id, username: username });

	socket.on('reconnect', ()=>{

		socket.emit('login', { user: id, username: username });
		socket.off('recieve-contacts-offline');
		socket.off('recieve-contacts-online');
		socket.off('recieve-chats');
		socket.off('recieve-chat');
		socket.off('recieve-message');
		dispatch({ type: 'reset_both' });
		dispatch({ type: 'reset_chats' });
 
	});

};
 
const login_status = (changeStatus: any, socket: any) => {

	socket.on('login', (data: { login: boolean }) => {

		if (data.login) { changeStatus({ type: "change_status", status: true }); }
		

	});

	socket.on('disconnect', ()=>{

		changeStatus({ type: "change_status", status: false });

	});

};

const user_status = (dispatch: any, socket: any) => {

	socket.on('user_status', (data: any)=>{

		dispatch({ type: 'change_user_status', one_data: { username: data.username, id: data.id }, status: data.status });
		dispatch({ type: 'change_user_status_chat', one_data: { username: data.username, id: data.id }, status: data.status });
		

	});

};

export { login_user, login_status, user_status };
