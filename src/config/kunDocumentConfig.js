const state = {
    documentTypes: [],
    countries: [],
};

export const kunDocumentConfig = {
    get documentTypes() { return state.documentTypes; },
    get countries() { return state.countries; },

    configure({ documentTypes, countries } = {}) {
        if (documentTypes) state.documentTypes = documentTypes;
        if (countries) state.countries = countries;
    },

    setDocumentTypes(types) { state.documentTypes = types || []; },
    setCountries(countries) { state.countries = countries || []; },
};
