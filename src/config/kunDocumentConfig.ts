import { reactive } from 'vue';

export interface KunDocumentType {
    id: string | number;
    country_id?: string | number | null;
    country?: { id?: string | number; iso2?: string } | null;
    country_iso2?: string;
    short_name?: string;
    name?: string;
    [key: string]: unknown;
}

export interface KunCountry {
    id: string | number;
    iso2?: string;
    iso_code?: string;
    code?: string;
    [key: string]: unknown;
}

const state = reactive<{ documentTypes: KunDocumentType[]; countries: KunCountry[] }>({
    documentTypes: [],
    countries: [],
});

export const kunDocumentConfig = {
    get documentTypes(): KunDocumentType[] { return state.documentTypes; },
    get countries(): KunCountry[] { return state.countries; },

    configure({ documentTypes, countries }: { documentTypes?: KunDocumentType[]; countries?: KunCountry[] } = {}): void {
        if (documentTypes) state.documentTypes = documentTypes;
        if (countries) state.countries = countries;
    },

    setDocumentTypes(types: KunDocumentType[] | null | undefined): void { state.documentTypes = types || []; },
    setCountries(countries: KunCountry[] | null | undefined): void { state.countries = countries || []; },
};
