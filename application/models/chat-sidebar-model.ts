const knex = require('knex')(require('../../knexfile'));
import users from "../online_users";

interface chatsTypes {

	getChats: (user: number, pag: { offset: number; per_page: number; whereNot: number[] }) => any;
	countChats: (user: number) => any;
	getChat: (chat_id: number, pag: { offset: number; per_page: number }) => any;
	countChat: (user: number) => any;
	sendMessage: (chat_id: number, user: number, contact: number, message: string, username: string ) => any;
	getMessages: (chat_id: number, pag: { offset: number; per_page: number; }) => any;
	countMessages: (chat_id:number) => any;

}
  
const chatsModel: chatsTypes = {

	getMessages(chat_id, { offset, per_page}) {

		return knex('userChatMsg');

	},

	countMessages(chat_id) {



	},

	sendMessage(chat_id, user, contact, message, username) {

		return knex('userChatMsg').insert({

			chat_id: chat_id,
			user: user,
			msg: message,
			seen: false,
			deleted_by_sender: false,
			deleted_by_recipient: false

		}).then((row: any)=>{

			if (row[0]) {

				const userSockets = users[user];
				const contactSockets = users[contact];

				if (contactSockets) {

					contactSockets.forEach((socket: any)=>{

						socket.emit('recieve-message', { 

							origin: false,
							chat_id: chat_id,
							username: username,
							message: {
 
								user: user,
								msg: message,
								seen: false,
								created_at: new Date(),
								id: row[0]

							}

			 			});

					});

				}

				if (userSockets) {

					userSockets.forEach((socket: any)=>{

						socket.emit('recieve-message', { 

							origin: true,
							chat_id: chat_id,
							username: username,
							message: {

								user: user,
								msg: message,
								seen: false,
								created_at: new Date(),
								id: row[0],

							}

			 			});

					});
 
				}

			}

		});

	},

	getChat(chat_id, pag) {

		const parameters = { chat_id: chat_id, offset: pag.offset, per_page: pag.per_page };

		return knex.raw(`SELECT * 
						FROM userChatMsg as msg2
						WHERE msg2.chat_id = :chat_id
						ORDER BY msg2.created_at DESC
						LIMIT :per_page 
						OFFSET :offset`,
						parameters);

	},

	countChat(chat_id) {

		const parameters = { chat_id: chat_id };

		return knex.raw(`SELECT count(*) 
						FROM userChatMsg
						WHERE userChatMsg.chat_id = :chat_id`,
						parameters);

	},
 
	getChats(user, pag) {
     
		const parameters = { user: user, offset: pag.offset, per_page: pag.per_page };
		let andNot = "";
		pag.whereNot.forEach((id)=>{

			andNot = andNot + ` AND userChat.user <> ${id}`;

		});
  
		return knex.raw(`SELECT userChat.created_At, msg1.id as msg_id, msg1.seen, msg1.user, msg1.created_at, msg1.msg, user.id, user.username, userChat.chat_id, userStatus.status
						FROM userChat
						JOIN user
						ON userChat.user = user.id
						JOIN userStatus
						ON userStatus.user = user.id
						LEFT OUTER JOIN userChatMsg as msg1
						ON msg1.created_at = (SELECT msg2.created_at 
											  FROM userChatMsg as msg2
											  WHERE userChat.chat_id = msg2.chat_id
											  ORDER BY msg2.created_at DESC
											  LIMIT 1)
						WHERE userChat.chat_id IN
						(SELECT chat_id 
						FROM userChat
						WHERE user = :user)
						AND userChat.user <> :user
						${andNot}
						ORDER BY CASE msg1.created_at WHEN 1 THEN msg1.created_at ELSE userChat.created_at END DESC					
						LIMIT :per_page 
						OFFSET :offset`,
						parameters);
	},

	countChats(user) {

		const parameters = { user: user };

		return knex.raw(`SELECT count(*) 
						FROM userChat
						WHERE userChat.chat_id IN
						(SELECT chat_id 
						FROM userChat
						WHERE user = :user)
						AND userChat.user <> :user
						`,
						parameters);


	}
			

};

export default chatsModel;
