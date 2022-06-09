// frontend/src/main.ts

import {createApp} from 'vue';
import App from './App.vue';
import VueToast from 'vue-toast-notification';

const mrTapPlayer = createApp(App)
mrTapPlayer.use(VueToast).provide('toast', mrTapPlayer.config.globalProperties.$toast);
mrTapPlayer.mount('#app');