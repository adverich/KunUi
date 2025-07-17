export const KunAutocompleteProps = {
  label: {
    type: String,
  },
  itemValue: {
    type: String,
    default: "",
  },
  itemTitle: {
    type: String,
    default: "",
  },
  itemText: {
    type: String,
    default: "",
  },
  itemSubtitle: {
    type: String,
    default: "",
  },

  returnObject: {
    type: Boolean,
    default: false,
  },

  searchableKeys: {
    type: Array,
    default: [],
  },

  focusOnRender: {
    type: Boolean,
    default: false,
  },
  focusOnSelect: {
    type: Boolean,
    default: false,
  },

  clearable: {
    type: Boolean,
    default: false,
  },
  clearOnSelect: {
    type: Boolean,
    default: false,
  },
  clearSearchOnSelect: {
    type: Boolean,
    default: true,
  },

  closeOnSelect: { type: Boolean, default: true },

  startEmtpy: { type: Boolean, default: false },
  placeholderText: { type: String, default: "Seleccionar" },
  textNoItems: { type: String, default: "No hay elementos" },

  hasCreateItem: { type: Boolean, default: false },
  btnCreateClass: { type: String, default: "w-full" },
  btnCreateBg: { typer: String, default: "bg-green-700" },
  btnCreateText: { typer: String, default: "Crear item" },

  multiple: { type: Boolean, default: false },
  required: {
    type: Boolean,
    default: false,
  },

  // ***** STYLE ***** //
  height: { default: 500 },
  maxHeight: { default: 500 },
  density: { type: String, default: "comfortable" },
  zIndex: { type: String, default: "z-50" },
  hideDetails: {
    type: Boolean,
    default: true,
  },
  hasIcons: {
    type: Boolean,
    default: true,
  },
  bgItemListColor: { type: String, default: "bg-transparent" },
  selectedItemListColor: { type: String, default: "bg-slate-100 dark:bg-slate-900" },
  hoverItemListColor: { type: String, default: "hover:bg-slate-300 dark:hover:bg-slate-700" },
  attach: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => [],
  },
};