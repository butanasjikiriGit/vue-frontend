<style scoped>
	
	.col-12{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login-box{
		margin-top: 5%;
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

	select{
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
		pointer-events: none;
	}

	input:focus ~ label, input:not(:placeholder-shown) ~ label{
		top: -10px;
		font-size: 13px;
		font-weight: bold;
		padding: 0px 5px 0px 5px;
		background-color: white;
		color: royalblue;
	}

	select:focus ~ label, select:not(:invalid) ~ label{
		top: -10px;
		font-size: 13px;
		font-weight: bold;
		padding: 0px 5px 0px 5px;
		background-color: white;
		color: royalblue;
	}

	input:focus{
		outline: solid 2px royalblue;
	}

	select:focus{
		outline: solid 2px royalblue;
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
				<form @submit.prevent="handleRegister">
					<div class="login-box">
						<h2>Create Account</h2>
						<p>Create your account to manage reservations</p>
						<div class="text-box">
							<input type="text" id="firstname" v-model="firstName" required placeholder="" autocomplete="off">
							<label for="firstname"><i class="bi bi-person-fill"></i> Firstname</label>
						</div>
						<div class="text-box">
							<input type="text" id="lastname" v-model="lastName" required placeholder="" autocomplete="off">
							<label for="lastname"><i class="bi bi-person-fill"></i> Lastname</label>
						</div>
						<div class="text-box">
							<input type="text" id="email" v-model="email" required placeholder="" autocomplete="off">
							<label for="email"><i class="bi bi-envelope-fill"></i> Email</label>
						</div>
						<div class="text-box">
							<select id="role" v-model="role" required>
								<option value="" disabled selected></option>
								<option value="operator">Operator</option>
								<option value="renter">Renter</option>
							</select>
							<label for="role"><i class="bi bi-shield-fill"></i> Select a role</label>
						</div>
						<div class="text-box">
							<input type="text" id="number" v-model="mobileNum" required placeholder="" autocomplete="off">
							<label for="number"><i class="bi bi-phone-fill"></i> Mobile Number</label>
						</div>
						<div class="text-box">
							<input type="password" id="password" v-model="password" required placeholder="">
							<label for="password"><i class="bi bi-lock-fill"></i> Password</label>
						</div>
						<div class="text-box">
							<input type="password" id="cpassword" v-model="comfirmPassword" required placeholder="">
							<label for="cpassword"><i class="bi bi-lock-fill"></i> Confirm Password</label>
						</div>
						<button class="btn btn-primary" v-if="isEnabled">Register<i class="bi bi-box-arrow-in-right"></i></button>
						<button class="btn btn-danger" disabled v-else>Register<i class="bi bi-exclamation-triangle"></i></button>
						<hr>
						<div class="text-center">
							<p>Already have an account? <router-link to="/login">Log In</router-link></p>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>

</template>

<script setup>
	
	import { ref, watch, onBeforeMount } from 'vue';
	import { useRouter } from 'vue-router';
	import { Notyf } from 'notyf';
	import api from '../api.js';


	const router = useRouter();
	const notyf = new Notyf({
		position: {
			x: 'center',
			y: 'bottom'
		}
	})


	const firstName = ref('');
	const lastName = ref('');
	const email = ref('');
	const mobileNum = ref('');
	const role = ref('');
	const password = ref('');
	const comfirmPassword = ref('');
	const isEnabled = ref(false);

	const nameRegex = /^[A-Za-z\s'-]+$/;
	const numberRegex = /^\d+$/;


	watch([firstName, lastName, email, mobileNum, role, password, comfirmPassword], (currentValue, oldValue) => {
		if (currentValue.every((input) => input !== "") && currentValue[5] === currentValue[6]){
			isEnabled.value = true;
		} else {
			isEnabled.value = false;
		}
	})




	async function handleRegister() {
		try {

			if (!nameRegex.test(firstName.value) || !nameRegex.test(lastName.value)){
				notyf.error('Firstname and Lastname must not contain numbers');
				return;
			} else if (!email.value.includes('@') || !email.value.endsWith('.com')){
				notyf.error('Invalid email format');
				return;
			} else if (!numberRegex.test(mobileNum.value)){
				notyf.error('Mobile number must contain numbers only');
				return;
			} else if (!mobileNum.value.startsWith('09')){
				notyf.error('Invalid mobile number format, number must start with 09');
				return;
			} else if (mobileNum.value.length !== 11){
				notyf.error('Mobile number must be 11 digits only');
				return;
			} else if (password.value.length <= 8){
				notyf.error('Password must be greater than 8 characters');
				return;
			}


			let response = await api.post('/users/register', {
				firstName: firstName.value,
				lastName: lastName.value,
				email: email.value,
				mobileNum: mobileNum.value,
				role: role.value,
				password: password.value
			})

			if (response.status === 201){

				notyf.success(response.data.message || 'Successfully registered');

				router.push({path:'/login'});

				firstName.value = "";
				lastName.value = "";
				email.value = "";
				mobileNum.value = "";
				role.value = "";
				password.value = "";

			}


		} catch (err) {

			console.error(err);

			if (err.response?.status === 409 || err.response?.status === 400){

				notyf.error(err.response.data.message || 'Failed to register new account, please contact administrator');

			} else {

				notyf.error('Network error or server is down')

			}

		}
	}







	onBeforeMount(() => {
		const token = localStorage.getItem('token');
		if (token){
			router.push({path:'/home'});
		}
	})


</script>