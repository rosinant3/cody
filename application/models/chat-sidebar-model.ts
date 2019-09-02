const knex = require('knex')(require('../../knexfile'));

interface chatsTypes {

	getChats: (user: number, pag: { offset: number; per_page: number; }) => any;
	countChats: (user: number) => any;
	getChat: (chat_id: number, pag: { offset: number; per_page: number; }) => any;
	countChat: (user: number) => any;

}
  
const chatsModel: chatsTypes = {

	getChat(chat_id, pag) {

		const parameters = { chat_id: chat_id, offset: pag.offset, per_page: pag.per_page };

		return knex.raw(`SELECT * 
						FROM userChatMsg as msg2
						WHERE msg2.chat_id = :chat_id
						ORDER BY msg2.created_at
						LIMIT :per_page 
						OFFSET :offset`,
						parameters);

	},

	countChat(chat_id) {

		const parameters = { chat_id: chat_id };

		return knex.raw(`SELECT count(*) 
						FROM userChatMsg as msg2
						WHERE msg2.chat_id = :chat_id
						ORDER BY msg2.created_at
						LIMIT :per_page 
						OFFSET :offset`,
						parameters);

	},
 
	getChats(user, pag) {
  
		const parameters = { user: user, offset: pag.offset, per_page: pag.per_page };
 
		return knex.raw(`SELECT userChat.created_At, msg1.created_at, msg1.msg, user.id, user.username, userChat.chat_id, userStatus.status
						FROM userChat
						JOIN user
						ON userChat.user = user.id
						JOIN userStatus
						ON userStatus.user = user.id
						LEFT OUTER JOIN userChatMsg as msg1
						ON msg1.created_at = (SELECT msg2.created_at 
											  FROM userChatMsg as msg2
											  WHERE userChat.chat_id = msg2.chat_id
											  ORDER BY msg2.created_at
											  LIMIT 1)
						WHERE userChat.chat_id IN
						(SELECT chat_id 
						FROM userChat
						WHERE user = :user)
						AND userChat.user <> :user
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
