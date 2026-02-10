<template>
    <KunDialog v-if="filterDialog" v-model="filterDialog" yPosition="top" maxWidth="max-w-1/2">
        <div class="w-full">
            <div class="flex justify-end px-1">
                <KunBtn @click="closeDialog" rounded="rounded-full" size="xxs" bgColor="bg-transparent">
                    <KunIcon color="text-red-500" :icon="IconClose" size="text-lg" />
                </KunBtn>
            </div>
            <KunRow>
                <KunCol cols="4" v-for="filter in filters" class="px-2">
                    <KunAutocomplete multiple v-model="selectedFilters[filter.value]" :items="filter.items" z-index="z-250" 
                        item-value="id" :item-title="filter.title ?? filter.text" item-text="filter.text" :label="filter.label ?? ''"
                        :text-no-items="filter.textNoItem ?? `No hay ${filter.name ?? 'elementos' } disponibles`"
                        :placeholder-text="filter.placeholderText ?? 'Seleccionar'"
                    />
                </KunCol>
            </KunRow>
            <div class="flex justify-end mt-8 p-2 gap-x-2">
                <KunBtn @click="clearFilters">
                    Limpiar filtros
                </KunBtn>

                <KunBtn @click="setFilters">
                    Aplicar
                </KunBtn>
            </div>
        </div>
    </KunDialog>
</template>

<script setup>
/**
 * KunTableFilter.vue
 * 
 * Diálogo modal para configuración avanzada de filtros por columna.
 * Muestra un formulario con todos los filtros disponibles definidos en 'filters' prop.
 */
import { computed, onMounted, ref, watch } from 'vue';
import KunDialog from '../../../KunDialog/src/components/KunDialog.vue';
import KunRow from '../../../KunRow/src/components/KunRow.vue';
import KunCol from '../../../KunCol/src/components/KunCol.vue';
import KunAutocomplete from '../../../KunAutocomplete/src/components/KunAutocomplete.vue';
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue';
import IconClose from '../../../../icons/IconClose.vue';

const props = defineProps({
    modelValue: Boolean, // Controla visibilidad del diálogo
    filters: Array,      // Definición de filtros [{value: 'col', items: [], label: ''}]
    activeFilters: Object, // Filtros actualmente aplicados { col: [values] }
})
const emits = defineEmits(['update:modelValue', 'applyFilters', 'clearFilters']);

// Sincronizar v-model del diálogo
const filterDialog = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
});

// Estado local de filtros seleccionados antes de aplicar
const selectedFilters = ref({});

// Al montar, cargas los filtros que ya estaban activos
onMounted(() => {
    selectedFilters.value = { ...props.filters.reduce((acc, filter) => {
        const key = filter.value;
        const currentVal = props.activeFilters?.[key];
        if (currentVal !== undefined) acc[key] = currentVal;
        return acc;
    }, {}) };
})

function setFilters() {
    emits('applyFilters', selectedFilters.value);
    closeDialog();
}

function clearFilters() {
    emits('clearFilters')
    closeDialog();
}

function closeDialog(){
    emits('update:modelValue', false);
}

// Limpiar keys vacías para no enviar basura
watch(selectedFilters, (val) => {
  for (const key in val) {
    if (Array.isArray(val[key]) && val[key].length === 0) {
      delete val[key];
    }
  }
}, { deep: true });
</script>