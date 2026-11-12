<style scoped>
	
	th{
		background-color: black;
		color: white;
		padding: 10px;
	}

	button{
		border-radius: 5px;
	}

	.modal-popup{
		padding: 20px;
		width: 400px;
		position: absolute;
		border: solid 1px lightgray;
		border-radius: 10px;
		box-shadow: 2px 2px 5px gray;
		left: 42%;
		background-color: whitesmoke;
		animation: modal .5s;
	}

	@keyframes modal {
		from{
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	div.buttons{
		margin-top: 20px;
		width: 100%;
		position: relative;
		display: flex;
		flex-direction: row;
		gap: 10px;
	}

	.close-btn{
		width: 100%;
		background-color: indianred;
		border: none;
		color: white;
		letter-spacing: 3px;
		padding: 6px;
	}

	.submit-button{
		width: 100%;
		background-color: royalblue;
		border: none;
		color: white;
		letter-spacing: 3px;
		padding: 6px;
	}

	.inner-modal{
		width: 100%;
		position: relative;
	}

	select{
		width: 100%;
		padding: 8px;
		border-radius: 5px;
	}

	select:focus{
		outline: solid 2px royalblue;
	}

	button{
		padding: 6px;
		font-size: 13px;
	}

</style>

<template>

	<h1 class="text-center p-5">Manage Users</h1>


	<div v-if="modalBox" class="modal-popup">
		<form @submit.prevent="handleUpdate">
			<div class="inner-modal">
				<h3>{{firstName}} {{lastName}}</h3>
				<label for="status">Current Status</label>
				<select v-model="status" id="status">
					<option value="approved">Approved</option>
					<option value="pending">Pending</option>
					<option value="rejected">Rejected</option>
				</select>
			</div>
			<div class="buttons">
				<button @click="closeModal" class="close-btn">Close</button>
				<button class="submit-button"><i class="bi bi-pencil"></i> Update</button>
			</div>
		</form>
	</div>

	
	<div class="container">
		<div class="row">
			<div class="col-12 d-flex justify-content-center align-items-center">
				<div class="user-box w-100">
					<h3 v-if="!users" class="text-center text-primary">No available user</h3>
					<table v-else class="table border w-100 text-center">
						<thead>
							<tr>
								<th>Full name</th>
								<th>Email</th>
								<th>Mobile Number</th>
								<th>Role</th>
								<th>Status</th>
								<th>Black List</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="user in users" :key="user._id">
								<td>{{user.firstName}} {{user.lastName}}</td>
								<td>{{user.email}}</td>
								<td>{{user.mobileNum}}</td>
								<td>{{user.role}}</td>
								<td>{{user.status}}</td>
								<td>{{user.isBlackListed ? 'Black listed' : 'Not Black listed'}}</td>
								<td><button @click.prevent="deleteUser(user._id)" class="btn btn-danger"><i class="bi bi-trash-fill"></i> Delete</button> <button @click="openModal(user._id)" class="btn btn-primary"><i class="bi bi-pencil"></i> Update</button></td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

</template>

<script setup>
	
	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import api from '../api.js';
	import { Notyf } from 'notyf';



	const router = useRouter();
	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})

	const users = ref([]);
	const modalBox = ref(false);
	const status = ref('');
	const id = ref('');
	const firstName = ref('');
	const lastName = ref('');




	async function fetchUser() {
		try {

			let response = await api.get('/users/all-users');
			users.value = response.data.users;

		} catch (err) {

			console.error(err)

			notyf.error('Failed to fetch user data');

		}
	}




	async function deleteUser(userId) {
		try {

			const confirmed = confirm('Are you sure you want to delete this user?');

			if (confirmed) {

				let response = await api.delete(`/users/${userId}`);

				if (response.status === 200){

					notyf.success(response.data.message);

				}

				fetchUser();

			}

		} catch (err) {

			console.error(err);

			if (err.response?.status === 400){

				notyf.error(err.response.data.message || 'Deletion Failed');

			} else {

				notyf.error('Internal Server Error');

			}

		}
	}





	async function openModal(userId) {
		try {

			modalBox.value = true;

			let response = await api.get(`/users/${userId}`);

			status.value = response.data.status;
			id.value = response.data._id;
			firstName.value = response.data.firstName;
			lastName.value = response.data.lastName;


		} catch (err) {

			notyf.error('Failed to get user data');

		}
	}





	async function closeModal() {
		modalBox.value = false;
	}





	async function handleUpdate(userId) {
		try {

			const response = await api.patch(`/users/status/${id.value}`, {
				status: status.value
			})

			if (response.status === 200) {

				notyf.success(response.data.message || 'Status updated successfully')

				router.push({path:'/manage-user'});

			}

			modalBox.value = false;

			fetchUser()

		} catch (err) {

			notyf.error('Failed to update user status')

		}
	}





	onMounted(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			router.push({path:'/login'});
		}
	})


	onMounted(fetchUser);

</script>