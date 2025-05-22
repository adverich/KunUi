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

  closeOnSelect: {
    type: Boolean,
    default: true,
  },

  startEmtpy: {
    type: Boolean,
    default: false,
  },
  placeholderText: {
    type: String,
    default: "Seleccionar",
  },
  textNoItems: {
    type: String,
    default: "No hay elementos",
  },

  hasCreateItem: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },

  // ***** STYLE ***** //
  height: {
    default: 500,
  },
  maxHeight: {
    default: 500,
  },
  density: {
    type: String,
    default: "comfortable",
  },
  hideDetails: {
    type: Boolean,
    default: true,
  },
  hasIcons: {
    type: Boolean,
    default: true,
  },
  bgItemListColor: {
    type: String,
    default: "bg-transparent",
  },
  selectedColor: {
    type: String,
    default: "bg-green-200",
  },
  attach: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => [],
  }
};