const knex = require('knex')(require('../../knexfile'));
import userEditModel from './user-model';

interface userEditTypes {

	getAllOnlineContacts: (user: number) => any;
	getOnlineContacts: (user: number, pag: { offset: number; per_page: number }) => any;
	getOfflineContacts: (user: number, pag: { offset: number; per_page: number }) => any;
	getRequests: (user: number, pag: { offset: number; per_page: number }) => any;
	countOnlineContacts: (user: number) => any;
	countOfflineContacts: (user: number) => any;
	countRequests: (user: number) => any;
	rejectRequest: (user1: number, user2: number, block: boolean) => any;
	acceptRequest: (user1: number, user2: number) => any;
	userStatus: (user: number, status: boolean) => any;	

	createChat: (user1: number, user2: number) => any;

}

const userSidebarModel: userEditTypes = {

   getAllOnlineContacts(user) {

		return knex('userContactList')
		.where('userContactList.accepted', '=', '1')
		.andWhere('userContactList.user', '=', user)
		.join('user', (builder: any) => {

			builder.on('user.id', '=', 'userContactList.contact');

		}).join('userStatus', (builder: any) => {

			builder.on('userStatus.user', '=', 'userContactList.contact');

		}).andWhere('userStatus.status', '=', '1').select('user.id');

    },

   userStatus(user, status) {

	return knex('userStatus').update({

				status: status,
				updated_at: new Date()

			}).where('user', '=', user).debug();

    },

    createChat(user1, user2) {


		return knex('userChat').insert({

			chat: user1 + user2,
			user: user1


		}).then((row: any) => {

			if (row) {

				return knex('userChat').insert({

					chat: user1 + user2,
					user: user2


				}).debug();	

			}

		});

    },

    acceptRequest(user1, user2) {

	return knex('userContactList')
	.where('userContactList.user', '=', user2)
	.andWhere('userContactList.contact', '=', user1)
	.update({

		accepted: true,
		updated_at: new Date(),

	}).then((row: any)=>{

		if (row) {

			return userEditModel.addUser(user1, user2, true).then((row2: any)=>{

				const insert_chat = [

					{ user: user1, chat_id: user1 + user2 },
					{ user: user2, chat_id: user1 + user2 }

				];

				return knex('userChat').insert(insert_chat).debug();


			}).catch((e:any)=>{ console.log(e); });

		}
 

	}).catch((e:any) => { console.log(e); }); 

    },
 
    getRequests(user, pag) {

	return knex('userContactList')
	.where('userContactList.accepted', '=', '0')
	.andWhere('userContactList.contact', '=', user)
	.join('user', (builder: any) => {

		builder.on('user.id', '=', 'userContactList.user');
 
	})
	.join('userInfo', (builder: any) => {

		builder.on('userInfo.user', '=', 'userContactList.user');


	})
	.select('user.username', 'user.id')
	.offset(pag.offset)
	.limit(pag.per_page)
	.orderBy('userContactList.created_at', 'desc');



    },

    countRequests(user) {

	return knex('userContactList')
	.where('userContactList.accepted', '=', '0')
	.andWhere('userContactList.contact', '=', user)
	.count();


    },

    rejectRequest(user1, user2, block) {

	let query: any;
	if (!block) { 

		query = knex('userContactList')
		.where('userContactList.user', '=', user2)
		.andWhere('userContactList.contact', '=', user1)
		.del();

	} 

	else {

		query =  userEditModel.blockUser(user1, user2).then((res: any) => {

		return knex('userContactList')
		.where('userContactList.user', '=', user2)
		.andWhere('userContactList.contact', '=', user1)
		.del();

		});

	}

	return query;	



    },
	
    getOnlineContacts(user, pag) {

		return knex('userContactList')
		.where('userContactList.accepted', '=', '1')
		.andWhere('userContactList.user', '=', user)
		.join('user', (builder: any) => {

			builder.on('user.id', '=', 'userContactList.contact');

		}).join('userStatus', (builder: any) => {

			builder.on('userStatus.user', '=', 'userContactList.contact');

		})
		.andWhere('userStatus.status', '=', '1')
		.select('user.username', 'user.id', 'userStatus.status', 'userStatus.updated_at', 'userContactList.created_at')
		.offset(pag.offset)
		.limit(pag.per_page)
		.orderBy('userStatus.updated_at', 'desc');


    },

     countOnlineContacts(user) {

		return knex('userContactList')
		.where('userContactList.accepted', '=', '1')
		.andWhere('userContactList.user', '=', user)
		.join('userStatus', (builder: any) => {

			builder.on('userStatus.user', '=', 'userContactList.contact')

		}).andWhere('userStatus.status', '=', '1').count();

    },

    getOfflineContacts(user, pag) {

		return knex('userContactList')
		.where('userContactList.accepted', '=', '1')
		.andWhere('userContactList.user', '=', user)
		.join('user', (builder: any) => {

			builder.on('user.id', '=', 'userContactList.contact');
 
		}).join('userStatus', (builder: any) => {

			builder.on('userStatus.user', '=', 'userContactList.contact')

		}).andWhere('userStatus.status', '=', '0')
		.select('user.username', 'user.id', 'userStatus.status', 'userStatus.updated_at', 'userContactList.created_at')
		.offset(pag.offset)
		.limit(pag.per_page)
		.orderBy('userStatus.updated_at', 'desc');

    },

     countOfflineContacts(user) {

		return knex('userContactList')
		.where('userContactList.accepted', '=', '1')
		.andWhere('userContactList.user', '=', user)
		.join('userStatus', (builder: any) => {

			builder.on('userStatus.user', '=', 'userContactList.contact')

		}).andWhere('userStatus.status', '=', '0').count();


    },

};

export default userSidebarModel;
