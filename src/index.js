import { defineAsyncComponent } from 'vue'
import './styles/style.css'
import './utils/utils.js'

// 1. Carga dinámica para el instalador global
const componentModules = import.meta.glob('./components/**/src/components/*.vue');

// 2. Objeto para registro global
export const components = Object.fromEntries(
  Object.entries(componentModules).map(([path, component]) => {
    const name = path.split('/')[2];
    return [name, defineAsyncComponent(component)];
  })
);

// 3. Exporta TODOS los componentes individualmente (para imports manuales)
export { default as KunAlert } from './components/KunAlert/src/components/KunAlert.vue';
export { default as KunAppbar } from './components/KunAppbar/src/components/KunAppbar.vue';
export { default as KunAppbarTitle } from './components/KunAppbarTitle/src/components/KunAppbarTitle.vue';
export { default as KunAutocomplete } from './components/KunAutocomplete/src/components/KunAutocomplete.vue';
export { default as KunAvatar } from './components/KunAvatar/src/components/KunAvatar.vue';
export { default as KunBtn } from './components/KunBtn/src/components/KunBtn.vue';
export { default as KunBadge } from './components/KunBadge/src/components/KunBadge.vue';
export { default as KunCard } from './components/KunCard/src/components/KunCard.vue';
export { default as KunCardActions } from './components/KunCardActions/src/components/KunCardActions.vue';
export { default as KunCardItem } from './components/KunCardItem/src/components/KunCardItem.vue';
export { default as KunCardSubtitle } from './components/KunCardSubtitle/src/components/KunCardSubtitle.vue';
export { default as KunCardText } from './components/KunCardText/src/components/KunCardText.vue';
export { default as KunCardTitle } from './components/KunCardTitle/src/components/KunCardTitle.vue';
export { default as KunChip } from './components/KunChip/src/components/KunChip.vue';
export { default as KunCol } from './components/KunCol/src/components/KunCol.vue';
export { default as KunContainer } from './components/KunContainer/src/components/KunContainer.vue';
export { default as KunCurrency } from './components/KunCurrency/src/components/KunCurrency.vue';
export { default as KunDialog } from './components/KunDialog/src/components/KunDialog.vue';
export { default as KunDivider } from './components/KunDivider/src/components/KunDivider.vue';
export { default as KunDrawer } from './components/KunDrawer/src/components/KunDrawer.vue';
export { default as KunFileInput } from './components/KunFileInput/src/components/KunFileInput.vue';
export { default as KunForm } from './components/KunForm/src/components/KunForm.vue';
export { default as KunIcon } from './components/KunIcon/src/components/KunIcon.vue';
export { default as KunList } from './components/KunList/src/components/KunList.vue';
export { default as KunListGroup } from './components/KunListGroup/src/components/KunListGroup.vue';
export { default as KunListImg } from './components/KunListImg/src/components/KunListImg.vue';
export { default as KunListItem } from './components/KunListItem/src/components/KunListItem.vue';
export { default as KunListItemAction } from './components/KunListItemAction/src/components/KunListItemAction.vue';
export { default as KunListItemAvatar } from './components/KunListItemAvatar/src/components/KunListItemAvatar.vue';
export { default as KunListItemSubtitle } from './components/KunListItemSubtitle/src/components/KunListItemSubtitle.vue';
export { default as KunListItemTitle } from './components/KunListItemTitle/src/components/KunListItemTitle.vue';
export { default as KunListItemText } from './components/KunListItemText/src/components/KunListItemText.vue';
export { default as KunListSubheader } from './components/KunListSubheader/src/components/KunListSubheader.vue';
export { default as KunMenu } from './components/KunMenu/src/components/KunMenu.vue';
export { default as KunModalFooter } from './components/KunModalFooter/src/components/KunModalFooter.vue';
export { default as KunMultipleModalFooter } from './components/KunModalFooter/src/components/KunMultipleModalFooter.vue';
export { default as KunNumberField } from './components/KunNumberField/src/components/KunNumberField.vue';
export { default as KunLoaderCircular } from './components/KunLoaderCircular/src/components/KunLoaderCircular.vue';
export { default as KunRadio } from './components/KunRadio/src/components/KunRadio.vue';
export { default as KunRadioGroup } from './components/KunRadioGroup/src/components/KunRadioGroup.vue';
export { default as KunRow } from './components/KunRow/src/components/KunRow.vue';
export { default as KunSlider } from './components/KunSlider/src/components/KunSlider.vue';
export { default as KunSpacer } from './components/KunSpacer/src/components/KunSpacer.vue';
export { default as KunSwitch } from './components/KunSwitch/src/components/KunSwitch.vue';
export { default as KunTable } from './components/KunTable/src/components/KunTable.vue';
export { default as KunTab } from './components/KunTabs/src/components/KunTab.vue';
export { default as KunTabs } from './components/KunTabs/src/components/KunTabs.vue';
export { default as KunTextarea } from './components/KunTextarea/src/components/KunTextarea.vue';
export { default as KunTextField } from './components/KunTextField/src/components/KunTextField.vue';
export { default as KunToolbar } from './components/KunToolbar/src/components/KunToolbar.vue';
export { default as KunToolbarTitle } from './components/KunToolbar/src/components/KunToolbarTitle.vue';
export { default as KunTooltip } from './components/KunTooltip/src/components/KunTooltip.vue';

// 4. Función de instalación global
export function install(app, { skipIfRegistered = true } = {}) {
  const components = import.meta.glob('./components/**/*.vue', { eager: true });

  Object.entries(components).forEach(([path, component]) => {
    const name = path.split('/')[2];

    if (!skipIfRegistered || !app._context.components[name]) {
      app.component(name, component.default);
    }
  });
}

// 5. Exporta todo por defecto (para app.use())
export default {
  install,
  ...components,
  // Re-exporta todos los componentes en el default
  KunAlert: components.KunAlert,
  KunAppbar: components.KunAppbar,
  KunAppbarTitle: components.KunAppbarTitle,
  KunAutocomplete: components.KunAutocomplete,
  KunAvatar: components.KunAvatar,
  KunBtn: components.KunBtn,
  KunBadge: components.KunBadge,
  KunCard: components.KunCard,
  KunCardActions: components.KunCardActions,
  KunCardItem: components.KunCardItem,
  KunCardSubtitle: components.KunCardSubtitle,
  KunCardText: components.KunCardText,
  KunCardTitle: components.KunCardTitle,
  KunChip: components.KunChip,
  KunCol: components.KunCol,
  KunContainer: components.KunContainer,
  KunCurrency: components.KunCurrency,
  KunDialog: components.KunDialog,
  KunDivider: components.KunDivider,
  KunDrawer: components.KunDrawer,
  KunFileInput: components.KunFileInput,
  KunForm: components.KunForm,
  KunIcon: components.KunIcon,
  KunList: components.KunList,
  KunListGroup: components.KunListGroup,
  KunListImg: components.KunListImg,
  KunListItem: components.KunListItem,
  KunListItemAction: components.KunListItemAction,
  KunListItemAvatar: components.KunListItemAvatar,
  KunListItemSubtitle: components.KunListItemSubtitle,
  KunListItemTitle: components.KunListItemTitle,
  KunListItemText: components.KunListItemText,
  KunListSubheader: components.KunListSubheader,
  KunMenu: components.KunMenu,
  KunModalFooter: components.KunModalFooter,
  KunMultipleModalFooter: components.KunMultipleModalFooter,
  KunNumberField: components.KunNumberField,
  KunLoaderCircular: components.KunLoaderCircular,
  KunRadio: components.KunRadio,
  KunRadioGroup: components.KunRadioGroup,
  KunRow: components.KunRow,
  KunSlider: components.KunSlider,
  KunSpacer: components.KunSpacer,
  KunSwitch: components.KunSwitch,
  KunTable: components.KunTable,
  KunTab: components.KunTab,
  KunTabs: components.KunTabs,
  KunTextarea: components.KunTextarea,
  KunTextField: components.KunTextField,
  KunToolbar: components.KunToolbar,
  KunToolbarTitle: components.KunToolbarTitle,
  KunTooltip: components.KunTooltip
};