<style scoped>
	


</style>

<template>

	<div class="container-fluid">
		<div class="row">
			<div class="col-12 d-flex justify-content-center align-items-center p-5">
				<div class="homepage">
					<h1 v-if="user.isAdmin">Admin Dashboard</h1>
					<h1 v-if="!user.isAdmin">User Dashboard</h1>
				</div>
			</div>
		</div>
	</div>
		
	<AdminDashboard v-if="token && user.isAdmin"/>
	<UserDashboard v-if="token && !user.isAdmin"/>

</template>

<script setup>

	import { onMounted, ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { useGlobalStore } from '../stores/global.js';

	
	import AdminDashboard from './AdminDashboard.vue';
	import UserDashboard from './UserDashboard.vue';




	const { getUserDetails, user } = useGlobalStore();
	const router = useRouter();

	const token = ref(localStorage.getItem('token'));




	onMounted(() => {
	    const token = localStorage.getItem('token');
	    
	    if (!token) {
	        router.push({ path: '/login' });
	    }
	});


</script>