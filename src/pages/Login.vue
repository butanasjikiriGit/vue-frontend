<style scoped>
	
	.col-12{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-box{
		margin-top: 10%;
		position: relative;
		width: 400px;
	}

	.text-box{
		width: 100%;
		position: relative;
	}

	h2{
		margin-bottom: 20px;
	}

	p{
		font-size: 14px;
	}

	input{
		width: 100%;
		padding: 8px;
		border-radius: 10px;
		border: solid 1px lightgray;
		margin-bottom: 20px;
		letter-spacing: 3px;
	}

	label{
		position: absolute;
		left: 10px;
		top: 8px;
		transition: .2s ease all;
	}

	input:focus ~ label, input:not(:placeholder-shown) ~ label{
		top: -10px;
		font-size: 13px;
		font-weight: bold;
		padding: 0px 5px 0px 5px;
		background-color: white;
		color: royalblue;
	}

	input:focus{
		outline-color: royalblue;
	}

	button{
		width: 100%;
		font-weight: bold;
		letter-spacing: 5px;
		border-radius: 100px;
	}

	form{
		display: contents;
	}

</style>

<template>
	
	<div class="container-fluid">
		<div class="row">
			<div class="col-12">
				<form @submit.prevent="handleLogin">
					<div class="login-box">
						<h2>Welcome back</h2>
						<p>Access your account to manage reservations</p>
						<div class="text-box">
							<input type="text" id="email" v-model="email" required placeholder="" autocomplete="off">
							<label for="email"><i class="bi bi-envelope"></i> Email</label>
						</div>
						<div class="text-box">
							<input type="password" id="password" v-model="password" required placeholder="">
							<label for="password"><i class="bi bi-key"></i> Password</label>
						</div>
						<button class="btn btn-primary" v-if="isEnabled" :disabled="isLoading">{{isLoading ? 'Logging In....' : 'Login'}}<i class="bi bi-box-arrow-in-right"></i></button>
						<button class="btn btn-danger" disabled v-else>Login<i class="bi bi-exclamation-triangle"></i></button>
						<hr>
						<div class="text-center">
							<p>Don't have an account? <router-link to="/register">Sign Up</router-link></p>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>

</template>

<script setup>
	
	import { ref, watch, onBeforeMount } from 'vue';
	import { Notyf } from 'notyf';
	import { useGlobalStore } from '../stores/global.js';
	import { useRouter } from 'vue-router';
	import api from '../api.js';



	const router = useRouter();
	const { getUserDetails, user } = useGlobalStore();
	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})



	const email = ref('');
	const password = ref('');
	const isEnabled = ref(false);
	const isLoading = ref(false);



	watch([email, password], (currentValue, oldValue) => {
		if (currentValue.every((input) => input !== "")){
			isEnabled.value = true;
		} else {
			isEnabled.value = false;
		}
	})


	async function handleLogin() {
		try {

			if (!email.value.includes('@') || !email.value.endsWith('.com')){
				notyf.error('Invalid email format');
				return;
			}


			isLoading.value = true;


			let response = await api.post('/users/login', {
				email: email.value,
				password: password.value
			})

			if (response.data){
				notyf.success('Logged In successfully');

				localStorage.setItem('token', response.data.access);
				getUserDetails(response.data.access);

				email.value = "";
				password.value = "";

				router.push({path:'/home'});

			}

		} catch (err) {

			console.error(err);
			notyf.error('Invalid email and password');

		} finally {

			isLoading.value = false;

		}
	}

	onBeforeMount(() => {
		const token = localStorage.getItem('token');
		if (token){
			router.push({path:'/home'});
		}
	})

	
</script>