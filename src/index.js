import './styles/style.css'
import './utils/utils.js'

import KunAlert from './components/KunAlert/src/components/KunAlert.vue';
import KunAppbar from './components/KunAppbar/src/components/KunAppbar.vue';
import KunAppbarTitle from './components/KunAppbarTitle/src/components/KunAppbarTitle.vue';
import KunAutocomplete from './components/KunAutocomplete/src/components/KunAutocomplete.vue';
import KunAvatar from './components/KunAvatar/src/components/KunAvatar.vue';
import KunBtn from './components/KunBtn/src/components/KunBtn.vue';
import KunBudge from './components/KunBudge/src/components/KunBudge.vue';
import KunCard from './components/KunCard/src/components/KunCard.vue';
import KunCardActions from './components/KunCardActions/src/components/KunCardActions.vue';
import KunCardItem from './components/KunCardItem/src/components/KunCardItem.vue';
import KunCardSubtitle from './components/KunCardSubtitle/src/components/KunCardSubtitle.vue';
import KunCardText from './components/KunCardText/src/components/KunCardText.vue';
import KunCardTitle from './components/KunCardTitle/src/components/KunCardTitle.vue';
import KunChip from './components/KunChip/src/components/KunChip.vue';
import KunCol from './components/KunCol/src/components/KunCol.vue';
import KunContainer from './components/KunContainer/src/components/KunContainer.vue';
import KunCurrency from './components/KunCurrency/src/components/KunCurrency.vue';
import KunDivider from './components/KunDivider/src/components/KunDivider.vue';
import KunForm from './components/KunForm/src/components/KunForm.vue';
import KunIcon from './components/KunIcon/src/components/KunIcon.vue';
import KunList from './components/KunList/src/components/KunList.vue';
import KunListGroup from './components/KunListGroup/src/components/KunListGroup.vue';
import KunListImg from './components/KunListImg/src/components/KunListImg.vue';
import KunListItem from './components/KunListItem/src/components/KunListItem.vue';
import KunListItemAction from './components/KunListItemAction/src/components/KunListItemAction.vue';
import KunListItemAvatar from './components/KunListItemAvatar/src/components/KunListItemAvatar.vue';
import KunListItemSubtitle from './components/KunListItemSubtitle/src/components/KunListItemSubtitle.vue';
import KunListItemTitle from './components/KunListItemTitle/src/components/KunListItemTitle.vue';
import KunListItemText from './components/KunListItemText/src/components/KunListItemText.vue';
import KunListSubheader from './components/KunListSubheader/src/components/KunListSubheader.vue';
import KunMenu from './components/KunMenu/src/components/KunMenu.vue';
import KunNumberField from './components/KunNumberField/src/components/KunNumberField.vue';
import KunLoaderCircular from './components/KunLoaderCircular/src/components/KunLoaderCircular.vue';
import KunRow from './components/KunRow/src/components/KunRow.vue';
import KunSlider from './components/KunSlider/src/components/KunSlider.vue';
import KunSpacer from './components/KunSpacer/src/components/KunSpacer.vue';
import KunSwitch from './components/KunSwitch/src/components/KunSwitch.vue';
import KunTable from './components/KunTable/src/components/KunTable.vue';
import KunTextField from './components/KunTextField/src/components/KunTextField.vue';
import KunToolbar from './components/KunToolbar/src/components/KunToolbar.vue';
import KunTooltip from './components/KunTooltip/src/components/KunTooltip.vue';

const components = {
  KunAlert,
  KunAppbar,
  KunAppbarTitle,
  KunAutocomplete,
  KunAvatar,
  KunBtn,
  KunBudge,
  KunCard,
  KunCardActions,
  KunCardItem,
  KunCardSubtitle,
  KunListItemTitle,
  KunCardText,
  KunCardTitle,
  KunChip,
  KunCol,
  KunContainer,
  KunCurrency,
  KunDivider,
  KunForm,
  KunIcon,
  KunList,
  KunListGroup,
  KunListImg,
  KunListItem,
  KunListItemAction,
  KunListItemAvatar,
  KunListItemSubtitle,
  KunListItemText,
  KunListSubheader,
  KunMenu,
  KunNumberField,
  KunLoaderCircular,
  KunRow,
  KunSlider,
  KunSpacer,
  KunSwitch,
  KunTable,
  KunTextField,
  KunToolbar,
  KunTooltip,
};

export {
  KunAlert,
  KunAppbar,
  KunAppbarTitle,
  KunAutocomplete,
  KunAvatar,
  KunBtn,
  KunBudge,
  KunCard,
  KunCardActions,
  KunCardItem,
  KunCardSubtitle,
  KunCardText,
  KunCardTitle,
  KunChip,
  KunCol,
  KunContainer,
  KunCurrency,
  KunDivider,
  KunForm,
  KunIcon,
  KunList,
  KunListGroup,
  KunListImg,
  KunListItem,
  KunListItemAction,
  KunListItemAvatar,
  KunListItemSubtitle,
  KunListItemTitle,
  KunListItemText,
  KunListSubheader,
  KunMenu,
  KunLoaderCircular,
  KunRow,
  KunSlider,
  KunSpacer,
  KunSwitch,
  KunTable,
  KunTextField,
  KunToolbar,
  KunTooltip,
};

export function install(app) {
  for (const name in components) {
    app.component(name, components[name]);
  }
}
