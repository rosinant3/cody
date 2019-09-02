const knex = require('knex')(require('../../knexfile'));

interface userEditTypes {

	sendRequest: (user: number) => any;


}

const socketUserModel = {

    sendRequest(user) {
		  


    },


};

export default socketUserModel;
