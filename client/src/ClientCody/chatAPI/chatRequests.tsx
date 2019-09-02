const contact_socket = (dispatch: any, socket: any) => {

	socket.on('recieve-contact-requests', (data: any) => {

			dispatch({ type: 'add_contact_requests', data: data.data, page: data.page, ajax: true });

		});

	socket.on('contact-request', (data: any) => {

		dispatch({ type: 'add_contact_requests', data: [{ username: data.username, id: data.id }], socket: true });
		

	});

	socket.on('contact-rejected', (data: any) => {

		if (data.row === 1) {

				dispatch({ type: 'remove_contact_request', id: data.id });

				if (data.block)  { 

					dispatch({ type: 'add_blocked_data', ajax: false, data: [{ username: data.username, blocks: data.id, first_name: "", last_name: "", location: ""}] }); 

				}

			}
		

	});

	
	socket.on('contact-accepted', (data: any) => {

		let online: string = "0";
		if (data.status) { online = "1" };

		if (data) {
 
			dispatch({ type: 'remove_contact_request', id: data.id });
			dispatch({ 

				type: 'add_contact', 
				status: data.status, 
				data: [{ 
					
					username: data.username, 
					id: data.id, 
					status: online 
				
				}], 
				socket: true

			});
			dispatch({ 

				type: 'add_chats', 
				status: data.status, 
				data: [{ 
					
					messages: [], 
					created_at: data.created_at, 
					chat_id: data.chat_id, 
					username: data.username, 
					id: data.id, 
					status: online,
					fist_name: "",
					last_name: "",
					location: "",
					page: { 
						
						current_page: 1, 
						from: 0, 
						last_page: 0, 
						offset: 0, 
						per_page: 10, 
						to: 0, 
						total: 0, 
						ajax: false, 
						corrector: 0 
						
					}

				}], 
				socket: true 

			});
 
		}

		
	});

};


export { contact_socket };
