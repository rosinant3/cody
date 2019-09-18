import userSidebarModel from '../models/user-sidebar-model';
import users from '../online_users';
import { contactsSocketHandler } from './contacts/contacts-socket-handler';
import { chatsSocketHandler } from './contacts/chats-socket-handler';

const socketHandler = (socket: any) => {

  socket.on('send-message', (data: { username: string; chat_id: number; user: number; contact: number; message: string; images: string[]; files: string[] })=>{

		chatsSocketHandler.sendMessage(data, socket);

  });

  socket.on('get-contact-requests', (data: { user: number; per_page: number; current_page: number; corrector?: number }) => {

	contactsSocketHandler.getContactRequests(data, socket);

  });

  socket.on('get-contacts-offline', (data: { user: number; per_page: number; current_page: number; corrector?: number }) => {

	contactsSocketHandler.getOfflineContacts(data, socket);

  });
 
  socket.on('get-contacts-online', (data: { user: number; per_page: number; current_page: number; corrector?: number }) => {

	contactsSocketHandler.getOnlineContacts(data, socket);

  });

  socket.on('get-chats', (data: { whereNot: number[], user: number; per_page: number; current_page: number; corrector?: number }) => {

	chatsSocketHandler.getChats(data, socket);

  });

  socket.on('get-chat', (data: { chat_id: number; per_page: number; current_page: number; corrector?: number }) => {

	chatsSocketHandler.getChat(data, socket);

  });

  socket.on('reconnect', () => {

            console.log('reconnect fired!');

  });

  socket.on('accept-contact-request', (data: any) => {

	contactsSocketHandler.acceptRequest(data);

  });

  socket.on('reject-contact-request', (data: any) => {

	contactsSocketHandler.rejectRequest(data);

  });

  socket.on('login', function (data: any) {

    if (data.user in users) {

		users[data.user].push(socket);
		socket.emit('login', { login: true });
		
    }

	else {

	const login = contactsSocketHandler.userStatus(data.user, true);

	login.then((row: any) => {
 
			if (row) {

				socket.user = { id: data.user, username: data.username};
				users[data.user] = [socket];
				socket.emit('login', { login: true });
				const online = contactsSocketHandler.getAllContactsOnline(data.user);
				online.then((row2: any) => {

					row2.forEach((db_user: { id: number}) => {
    
						const user_sockets = users[db_user.id];

						if (user_sockets) {

							user_sockets.forEach((user_socket: any) => {
 
								user_socket.emit('user_status', { username: data.username, id: data.user, status: true });
 
							});

						}
	
					});

			   }).catch((e:any) => { console.log(e); });

			}

		}).catch((e:any) => { console.log(e); });

    }

  });

  socket.on('disconnect', function(data: any) {

	if (users[socket.user.id].length === 1) {

	const logout = contactsSocketHandler.userStatus(socket.user.id, false);

	logout.then((row: any) => {

			if (row) {

				const online = contactsSocketHandler.getAllContactsOnline(socket.user.id);
 
				online.then((row2: any) => {

					if (users[socket.user.id]) {

							delete users[socket.user.id];
							row2.forEach((db_user: { id: number}) => {

								const user_sockets = users[db_user.id];

								user_sockets.forEach((user_socket: any) => {

									user_socket.emit('user_status', { username: socket.user.username, id: socket.user.id, status: false });

								});
	
							});

					}

			  }).catch((e:any) => { console.log(e); });

			}

		}).catch((e:any) => { console.log(e); });

    } 

    else {

	users[data.user] = users[socket.user.id].filter((s: any) => {

		return socket.id !== s.id;

	});

    }
 
   }

);

};

export default socketHandler;
