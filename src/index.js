import { createApp } from 'vue';
import '../public/css/main.css';

const SvisComponent = require('./Svis.vue').default;

/**
 * Svis sample app
 */
window.addEventListener('load', () => {
  const app = createApp({
    components: { SvisComponent },
    template: document.querySelector('#svis-app').innerHTML,
  });
  app.mount('#svis-app');
});
