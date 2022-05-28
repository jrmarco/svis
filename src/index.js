import { createApp } from 'vue';
import '../public/css/main.css';

const SvisComponent = require('./Svis.vue').default;

/**
 * Svis sample app
 */
window.addEventListener('load', () => {
  const svisContainers = document.querySelectorAll('.svis-app');
  const apps = [];
  for (let i = 0; i < svisContainers.length; i += 1) {
    apps[i] = createApp({
      components: { SvisComponent },
      template: svisContainers[i].innerHTML
    });
    apps[i].mount(svisContainers[i]);
  }
});
