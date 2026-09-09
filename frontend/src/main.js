import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Router from './router/index';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App).use(Router).mount('#app')