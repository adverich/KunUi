export const KunAutocompleteProps = {
  label: {
    type: String,
  },
  itemValue: {
    type: String,
    default: null,
  },
  itemTitle: {
    type: [String, Array],
    default: null,
  },
  itemText: {
    type: [String, Array],
    default: null,
  },
  itemSubtitle: {
    type: [String, Array],
    default: null,
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
  clearOnNotFound: { type: Boolean, default: true },

  closeOnSelect: { type: Boolean, default: true },
  menuOrigin: { type: String, default: "bottom left" },

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
  height: { default: "h-[500px]" },
  maxHeight: { default: "max-h-1/2" },
  density: { type: String, default: "default" },
  zIndex: { type: String, default: "z-250" },
  hideDetails: {
    type: Boolean,
    default: true,
  },
  hasIcons: {
    type: Boolean,
    default: true,
  },
  bgMenuColor: { type: String, default: "bg-menu" },
  bgItemListColor: { type: String, default: "bg-transparent" },
  selectedItemListColor: { type: String, default: "bg-select-background" },
  hoverItemListColor: { type: String, default: "hover:bg-select-hover" },
  attach: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => [],
  },
};