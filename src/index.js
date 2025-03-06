import Button from './components/KunBtn/src/components/KunBtn.vue';

export { Button };
export default {
  install(Vue) {
    Vue.component('KunBtn', Button);
  },
};