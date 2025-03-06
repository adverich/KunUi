import Button from './components/KunBtn/src/components/KunBtn.vue';

export { Button };
export default {
  install(app) {
    app.component('KunBtn', Button);
  },
};