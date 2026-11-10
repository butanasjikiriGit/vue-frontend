<style scoped>
	
	th{
		background-color: black;
		color: white;
		padding: 10px;
	}

</style>

<template>
	
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
								<td><button @click.prevent="deleteUser(user._id)" class="btn btn-danger">Delete</button> <button class="btn btn-primary">Edit</button></td>
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




	async function fetchUser() {
		try {

			let response = await api.get('/users/all-users');
			users.value = response.data.users

		} catch (err) {
			console.error(err)
			notyf.error('Failed to fetch user data');
		}
	}




	async function deleteUser(userId) {
		try {

			let response = await api.delete(`/users/${userId}`);

			if (response.status === 200){

				notyf.success(response.data.message);

			}

			fetchUser();

		} catch (err) {

			console.error(err);

			if (err.response?.status === 400){

				notyf.error(err.response.data.message || 'Deletion Failed');

			} else {

				notyf.error('Internal Server Error');

			}

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