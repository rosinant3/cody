const knex = require('knex')(require('../../knexfile'));

interface userEditTypes {

	getInfo: (user: number) => any;
	editInfo: (user: number, value: string, column: string) => any;
	getUsers: (user: number, value: string, pag: { offset: number; per_page: number }) => any;
	countUsers: (user: number, value: string) => any;
	addUser: (user1: number, user2: number, accepted: boolean) => any;
	blockUser: (user1: number, user2: number) => any;
	getBlockedUsers: (user: number, pag: { offset: number; per_page: number }) => any;
	countBlockedUsers: (user: number) => any;
	removeBlockedUser: (user1: number, user2: number) => any;

}

const userEditModel: userEditTypes = {

    addUser(user1, user2, accepted = false) {

		return knex('userContactList').insert({

					user: user1,
					contact: user2,
					accepted: accepted


				}).debug();


    },

    blockUser(user1, user2) {


	return knex('userBlockList').insert({

					user: user1,
					blocks: user2,

				}).debug();


    },

    getInfo(user) {
		  
		return knex('userInfo').select('userInfo.created_at', 'userInfo.first_name', 'userInfo.last_name', 'userInfo.location').where('userInfo.user', '=', user).debug();

    },

    editInfo(user, value, column) {

	 	const column2 = `userInfo.${column}`;

		return knex("userInfo").where("userInfo.user", "=", user).update(column2, value, "userInfo.updated_at", new Date());

    },
  
    getUsers(user, value, pag) {

		const search = `%${value}%`;
		const parameters = { user: user, per_page: pag.per_page, offset: pag.offset, search: search };

		return knex.raw(`SELECT id, username FROM user WHERE id NOT IN (SELECT contact FROM userContactList WHERE user = :user) AND id NOT IN (SELECT user FROM userBlockList WHERE blocks = :user) AND id NOT IN (SELECT user FROM userContactList WHERE contact = :user) AND id NOT IN (SELECT blocks FROM userBlockList WHERE user = :user) AND username LIKE :search AND NOT id = :user LIMIT :per_page OFFSET :offset`, parameters);

    }, 

    countUsers(user, value) {

		const search = `%${value}%`;
		const parameters = { user: user, search: search };

		return knex.raw(`SELECT count(*) FROM user WHERE id NOT IN (SELECT contact FROM userContactList WHERE user = :user) AND id NOT IN (SELECT user FROM userBlockList WHERE blocks = :user) AND id NOT IN (SELECT user FROM userContactList WHERE contact = :user) AND id NOT IN (SELECT blocks FROM userBlockList WHERE user = :user) AND username LIKE :search AND NOT id = :user`, parameters);

    },

    getBlockedUsers(user, pag) {

	return knex('userBlockList as b').select("b.blocks", "u.username").join('user as u', function (builder: any) {

					builder.on('u.id', '=', 'b.blocks');

	}).where('b.user', '=', user).limit(pag.per_page).offset(pag.offset).debug();


    },

    countBlockedUsers(user) {

	return knex('userBlockList').where('userBlockList.user', '=', user).count("*");


    },

    removeBlockedUser(user1, user2) {

	// user1 unblocks user2

	return knex('userBlockList').where('userBlockList.user', '=', user1).andWhere('userBlockList.blocks', '=', user2).del();


 
    }

};

export default userEditModel;
