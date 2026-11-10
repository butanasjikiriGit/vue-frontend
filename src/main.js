import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'notyf/notyf.min.css'



import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';



const router = createRouter({
	history: createWebHistory(),
	routes : [
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/home',
			name: 'homePage',
			component: Home
		},
		{
			path: '/register',
			name: 'register',
			component: Register
		}
	]
})



// Routes
import Login from './pages/Login.vue';
import Home from './pages/Home.vue';
import Register from './pages/Register.vue';






const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount('#app')

