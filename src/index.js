import Button from './components/KunBtn/src/components/KunBtn.vue';

export { Button, Card };
export default {
  install(Vue) {
    Vue.component('KunBtn', Button);
  },
};