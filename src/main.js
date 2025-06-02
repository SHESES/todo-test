import './style.css';
import { createApp } from 'vue';
import App from './App.vue';

import store from './client/client-states.js';
import router from './client/client-routes.js';
import Swal from 'sweetalert2';

const app = createApp(App);

app.config.globalProperties.$swal = Swal;

app.use(store);
app.use(router);

app.mount('#app');
