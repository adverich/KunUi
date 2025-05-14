import KunAlert from './components/KunAlert/src/components/KunAlert.vue';
import KunAppbar from './components/KunAppbar/src/components/KunAppbar.vue';
import KunAppbarTitle from './components/KunAppbarTitle/src/components/KunAppbarTitle.vue';
import KunAutocomplete from './components/KunAutocomplete/src/components/KunAutocomplete.vue';
import KunBtn from './components/KunBtn/src/components/KunBtn.vue';
import KunBudge from './components/KunBudge/src/components/KunBudge.vue';
import KunCard from './components/KunCard/src/components/KunCard.vue';
import KunCardText from './components/KunCardText/src/components/KunCardText.vue';
import KunCurrency from './components/KunCurrency/src/components/KunCurrency.vue';
import KunIcon from './components/KunIcon/src/components/KunIcon.vue';
import KunList from './components/KunList/src/components/KunList.vue';
import KunSpacer from './components/KunSpacer/src/components/KunSpacer.vue';
import KunTextField from './components/KunTextField/src/components/KunTextField.vue';
import KunToolbar from './components/KunToolbar/src/components/KunToolbar.vue';

const components = {
  KunAlert,
  KunAppbar,
  KunAppbarTitle,
  KunAutocomplete,
  KunBtn,
  KunBudge,
  KunCard,
  KunCardText,
  KunCurrency,
  KunIcon,
  KunList,
  KunSpacer,
  KunTextField,
  KunToolbar,
};

export {
  KunAlert,
  KunAppbar,
  KunAppbarTitle,
  KunAutocomplete,
  KunBtn,
  KunBudge,
  KunCard,
  KunCardText,
  KunCurrency,
  KunIcon,
  KunList,
  KunSpacer,
  KunTextField,
  KunToolbar,
};

export function install(app) {
  for (const name in components) {
    app.component(name, components[name]);
  }
}
