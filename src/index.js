import './styles/style.css'

import KunAlert from './components/KunAlert/src/components/KunAlert.vue';
import KunAppbar from './components/KunAppbar/src/components/KunAppbar.vue';
import KunAppbarTitle from './components/KunAppbarTitle/src/components/KunAppbarTitle.vue';
import KunAutocomplete from './components/KunAutocomplete/src/components/KunAutocomplete.vue';
import KunBtn from './components/KunBtn/src/components/KunBtn.vue';
import KunBudge from './components/KunBudge/src/components/KunBudge.vue';
import KunCard from './components/KunCard/src/components/KunCard.vue';
import KunCardActions from './components/KunCardActions/src/components/KunCardActions.vue';
import KunCardItem from './components/KunCardItem/src/components/KunCardItem.vue';
import KunCardSubtitle from './components/KunCardSubtitle/src/components/KunCardSubtitle.vue';
import KunCardText from './components/KunCardText/src/components/KunCardText.vue';
import KunCardTitle from './components/KunCardTitle/src/components/KunCardTitle.vue';
import KunCol from './components/KunCol/src/components/KunCol.vue';
import KunContainer from './components/KunContainer/src/components/KunContainer.vue';
import KunCurrency from './components/KunCurrency/src/components/KunCurrency.vue';
import KunDivider from './components/KunDivider/src/components/KunDivider.vue';
import KunForm from './components/KunForm/src/components/KunForm.vue';
import KunIcon from './components/KunIcon/src/components/KunIcon.vue';
import KunList from './components/KunList/src/components/KunList.vue';
import KunLoaderCircular from './components/KunLoaderCircular/src/components/KunLoaderCircular.vue';
import KunRow from './components/KunRow/src/components/KunRow.vue';
import KunSlider from './components/KunSlider/src/components/KunSlider.vue';
import KunSpacer from './components/KunSpacer/src/components/KunSpacer.vue';
import KunSwitch from './components/KunSwitch/src/components/KunSwitch.vue';
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
  KunCardActions,
  KunCardItem,
  KunCardSubtitle,
  KunCardText,
  KunCardTitle,
  KunCol,
  KunContainer,
  KunCurrency,
  KunDivider,
  KunForm,
  KunIcon,
  KunList,
  KunLoaderCircular,
  KunRow,
  KunSlider,
  KunSpacer,
  KunSwitch,
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
  KunCardActions,
  KunCardItem,
  KunCardSubtitle,
  KunCardText,
  KunCardTitle,
  KunCol,
  KunContainer,
  KunCurrency,
  KunDivider,
  KunForm,
  KunIcon,
  KunList,
  KunLoaderCircular,
  KunRow,
  KunSlider,
  KunSpacer,
  KunSwitch,
  KunTextField,
  KunToolbar,
};

export function install(app) {
  for (const name in components) {
    app.component(name, components[name]);
  }
}
