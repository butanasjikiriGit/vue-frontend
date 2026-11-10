<style scoped>
	


</style>

<template>
	
	<nav class="navbar navbar-expand-lg bg-body-tertiary">
	  <div class="container">
	    <a class="navbar-brand" href="#">Velo Rent</a>
	    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
	      <span class="navbar-toggler-icon"></span>
	    </button>
	    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
	      <div class="navbar-nav ms-auto" v-if="user.token && !user.isAdmin">
	        <router-link to="/login" class="nav-link" href="#">Car rentals</router-link>
	        <button @click.prevent="handleLogout" class="nav-link" href="#">Logout</button>
	      </div>
	       <div class="navbar-nav ms-auto" v-else-if="user.token && user.isAdmin">
	        <router-link to="/login" class="nav-link" href="#">Manage users</router-link>
	        <button @click.prevent="handleLogout" class="nav-link" href="#">Logout</button>
	      </div>
	      <div class="navbar-nav ms-auto" v-else>
	        <router-link to="/login" class="nav-link" href="#">Login</router-link>
	        <router-link to="/register" class="nav-link" href="#">Register</router-link>
	      </div>
	    </div>
	  </div>
	</nav>

</template>

<script setup>
	
	import { useGlobalStore } from '../stores/global.js';
	import { useRouter } from 'vue-router';
	import { Notyf } from 'notyf'; 


	const { getUserDetails, user } = useGlobalStore();
	const token = localStorage.getItem('token');
	const router = useRouter();
	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})




	async function handleLogout() {
		
		localStorage.removeItem('token');
		getUserDetails(null);
		notyf.success('Logged Out successfully');
		router.push({path:'/login'});

	}

</script>