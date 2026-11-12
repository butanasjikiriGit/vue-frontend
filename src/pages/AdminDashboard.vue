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
					<table class="table border w-100 text-center">
						<thead>
							<tr>
								<th><i class="bi bi-people-fill"></i> Operators</th>
								<th><i class="bi bi-people-fill"></i> Renters</th>
								<th><i class="bi bi-hourglass-split"></i> Pending</th>
								<th><i class="bi bi-person-x-fill"></i> Rejected</th>
								<th><i class="bi bi-check-circle-fill"></i> Approved</th>
								<th><i class="bi bi-person-x"></i> Black List</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{{operators}}</td>
								<td>{{renters}}</td>
								<td>{{pending}}</td>
								<td>{{rejected}}</td>
								<td>{{approved}}</td>
								<td>{{blackList}}</td>
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
	const operators = ref(0);
	const renters = ref(0);
	const pending = ref(0);
	const rejected = ref(0);
	const approved = ref(0);
	const blackList = ref(0);





	async function fetchUser() {
		try {

			let response = await api.get('/users/all-users');
			users.value = response.data.users;
			operators.value = users.value.filter(user => user.role === 'operator').length;
			renters.value = users.value.filter(user => user.role === 'renter').length;
			pending.value = users.value.filter(user => user.status === 'pending').length;
			rejected.value = users.value.filter(user => user.status === 'rejected').length;
			approved.value = users.value.filter(user => user.status === 'approved').length;
			blackList.value = users.value.filter(user => user.isBlackListed === true).length;

		} catch (err) {

			console.error(err)

			notyf.error('Failed to fetch user data');
			
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