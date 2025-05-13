import KunBtn from './components/KunBtn/src/components/KunBtn.vue';

export { KunBtn };
export default {
  install(app) {
    app.component('KunBtn', KunBtn);
  },
};