<template>
  <div :class="mergedWrapperClass" v-bind="$attrs" style="user-select: text">
    <!-- Barra de búsqueda -->
    <div
      v-if="searchable || filterable || $slots.prependHeader || $slots.prependSearch || $slots.appendSearch"
      class="p-2 bg-surface print:hidden flex w-full justify-between"
    >
      <div class="w-full flex items-center" v-if="showSearchBtn || !isMobile">
        <slot name="prependHeader" />
      </div>

      <div class="inline-flex items-center justify-center whitespace-nowrap" v-if="selectedItems.length">
        <span class="pr-2">Se han seleccionado {{ selectedItems.length }} registros.</span>
        <template v-if="paginatedItems.length !== filteredItems.length">
          <span v-if="paginatedItems.length === selectedItems.length" @click="selectCompleteAll"
            class="bg-secondary hover:!bg-blue-500 rounded cursor-pointer px-2 ml-2"
          >
            Seleccionar todos los {{ filteredItems.length }} registros
          </span>
          <span v-if="filteredItems.length === selectedItems.length" @click="clearSelection" 
            class="bg-secondary hover:!bg-blue-500 rounded cursor-pointer px-2 ml-2"
          >
            Anular selección
          </span>
        </template>
      </div>

      <div class="min-w-1/3 flex h-full items-center justify-end">
        <slot name="prependSearch" />

        <KunBtn class="h-fit" v-if="filterable && filters.length" @click="modalFilter = true" rounded="rounded-full" size="xs" bgColor="bg-green-200 dark:bg-green-800">
          <KunIcon class="h-fit" :icon="IconFilter" size="text-lg" />
        </KunBtn>

        <div v-if="searchable" class="rounded flex mx-2" :class="[searchClass]">
          <input
            v-model="searchQuery"
            v-show="showSearch"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full text-sm"
            :class="isMobile ? 'px-1' : 'px-2 py-1'"
            ref="searchRef"
            @focus="hideIconSearch"
            @blur="showIconSearch"
          />
          <KunIcon :icon="IconSearch" @click="handleSearchFocus" v-show="showSearchBtn"/>
        </div>

        <slot name="appendSearch" />
      </div>
    </div>

    <div class="flex-1 overflow-auto bg-surface">
      <table :class="mergedTableClass" v-if="paginatedItems.length">
        <template v-if="$slots.colgroup && !isMobile">
          <colgroup><slot name="colgroup" v-bind="slotProps" /></colgroup>
        </template>

        <KunTableHeaders
          v-if="!hideDefaultHeader && !isMobile"
          :headers="headers"
          :sort-by="options.sortBy"
          :show-select="showSelect"
          :show-expand="showExpand"
          :all-selected="allSelected"
          :more-than-paginated="moreThanPaginated"
          :some-selected="someSelected"
          :thead-class="theadClass"
          :tr-class="trClass"
          :th-class="thClass"
          :has-actions="hasActions"
          :action-label="actionLabel"
          @sort="updateSort"
          @toggle-select-all="toggleSelectAll"
          :customHeaders="customSlots"
        />
        <slot v-else name="thead" v-bind="slotProps" />

        <template v-if="!isMobile">
          <slot name="body.prepend" v-bind="slotProps" />
          <KunTableRows 
            :items="paginatedItems"
            :headers="resolvedHeaders"
            :tbody-class="tbodyClass"
            :row-class="rowClass"
            :row-class-condition="rowClassCondition"
            :tr-class="trClass"
            :td-class="tdClass"
            :selected-class="selectedClass"
            :striped-class="stripedClass"
            :is-selected="isSelected"
            :is-expanded="isExpanded"
            :show-select="showSelect"
            :show-expand="showExpand"
            :has-actions="hasActions"
            :action-loading-map="actionLoadingMap"
            @toggle-expand="toggleExpand"
            @toggle-select="toggleSelect"
            :customSlots="customSlots"
          >
            <template v-for="(_, name) in $slots" #[name]="slotProps">
              <slot :name="name" v-bind="slotProps" />
            </template>
          </KunTableRows>
          <slot name="body.append" v-bind="slotProps" />
        </template>

        <template v-else="isMobile">
          <KunTableIterators
            :items="paginatedItems"
            :headers="resolvedHeaders"
            :row-class="rowClass"
            :row-class-condition="rowClassCondition"
            :is-selected="isSelected"
            :is-expanded="isExpanded"
            :show-select="showSelect"
            :show-expand="showExpand"
            :has-actions="hasActions"
            :action-loading-map="actionLoadingMap"
            @toggle-expand="toggleExpand"
            @toggle-select="toggleSelect"
            :customSlots="customSlots"
          >
            <template v-for="(_, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps" />
            </template>
          </KunTableIterators>
        </template>

        <template v-if="$slots.tfoot">
            <tfoot><slot name="tfoot" v-bind="slotProps" /></tfoot>
        </template>
      </table>

      <div v-if="!paginatedItems.length" class="h-full flex justify-center items-center">
        <div class="text-center text-4xl">
          {{ noDataText }}
        </div>
      </div>
    </div>

    <!-- Footer Fijo -->
    <div v-if="!hideDefaultFooter" class="sticky bottom-0 z-10 print:hidden">
      <KunTableFooter
        :items-length="filteredItems.length"
        :items-per-page="options.itemsPerPage"
        :current-page="options.page"
        :page-options="pageOptions"
        @update:itemsPerPage="options.itemsPerPage = $event"
        @update:page="options.page = $event"
      />
    </div>
    <slot v-else name="footer" v-bind="slotProps" />

    <KunTableFilter v-if="filterable && modalFilter" :filters="filters" v-model="modalFilter" @applyFilters="applyColumnFilters" @clearFilters="clearFilters" :activeFilters="appliedFilters.byColumn" />
  </div>
</template>

<script setup>
/**
 * KunTable.vue
 * 
 * Componente principal de tabla de datos con funcionalidades avanzadas:
 * - Paginación
 * - Ordenamiento (simple y múltiple)
 * - Filtrado (búsqueda global y por columnas)
 * - Selección de filas
 * - Expansión de filas
 * - Adaptable a móvil (vista de tarjetas)
 */
import { computed, onMounted, ref, toRefs, watch, nextTick } from 'vue';
import { isMobile } from '@/utils/_platform';

// Componentes UI internos y externos
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue';
import IconFilter from '../../../../icons/IconFilter.vue';
import IconSearch from '../../../../icons/IconSearch.vue';
import KunTableHeaders from './KunTableHeaders.vue';
import KunTableFooter from './KunTableFooter.vue';
import KunTableRows from './KunTableRows.vue';
import KunTableIterators from './KunTableIterators.vue';
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';
import KunTableFilter from './KunTableFilter.vue';

// Composables para lógica separada
import useExpand from '../composables/useExpand';
import useOptions from '../composables/useOptions';
import useSelect from '../composables/useSelect';
import useFilter from '../composables/useFilter';

import kunTableProps from '../composables/KunTableProps';

// Eventos emitidos por la tabla
const emits = defineEmits(['update:page', 'update:itemsPerPage', 'update:sortBy', 'update:search', 'focusOnSearch']);

// Props definidos en un archivo separado para reutilización
const props = defineProps(kunTableProps());
const propsRefs = toRefs(props);
const selectedItems = defineModel('selectedItems', { type: Array, default: () => [] })

// Destructuring de props reactivos para uso en template
const {
  headers,
  showExpand,
  showSelect,
  rowClass,
  hideDefaultFooter,
  hideDefaultHeader,
  tableClass,
  wrapperClass,
  pageOptions,
  items,
  searchable,
  debounceTime,
} = propsRefs;

// --- Lógica de Búsqueda ---
const searchQuery = ref(props.search);
// Sincronizar prop 'search' con el estado local
watch(() => props.search, (val) => {
  if (val !== searchQuery.value) {
    searchQuery.value = val;
  }
});

// --- Procesamiento de Headers ---
// Resuelve funciones en headers que vienen como strings (útil para configs guardadas en DB)
const resolvedHeaders = computed(() => {
  return props.headers.map(header => {
    const newHeader = { ...header };

    if (
      (header.columnType === 'function') && typeof header.columnFunction === 'string'
    ) {
      const resolvedFn = props.functionMap?.[header.columnFunction];
      if (typeof resolvedFn === 'function') {
        newHeader.columnFunction = resolvedFn;
      } else {
        // console.warn(`[KunTable] No se encontró la función "${header.columnFunction}" en functionMap`);
        newHeader.columnFunction = () => ''; // fallback para evitar errores
      }
    }

    return newHeader;
  });
});

// --- Integración de Composables ---

// Lógica de filtrado (Búsqueda global y filtros por columna)
const { filteredItems, setSearch, modalFilter, applyColumnFilters, clearFilters, appliedFilters } = useFilter(propsRefs, debounceTime, resolvedHeaders);

// Sincronizar input de búsqueda con el filtro
watch(searchQuery, (val) => {
  emits('update:search', val);
  setSearch(val);
});

// Lógica de paginación y ordenamiento
const { options, paginatedItems, updateSort } = useOptions(propsRefs, emits, filteredItems, resolvedHeaders);

// Lógica de selección de filas
const { isSelected, toggleSelect, toggleSelectAll, allSelected, someSelected, moreThanPaginated, clearSelection, selectCompleteAll } = useSelect(paginatedItems, selectedItems, filteredItems);

// Lógica de expansión de filas
const { isExpanded, toggleExpand } = useExpand();

// --- Computed para Slots ---
// Pasa todas las propiedades útiles a los slots personalizados
const slotProps = computed(() => ({
  items: paginatedItems.value,
  headers: headers.value,
  page: options.page,
  itemsPerPage: options.itemsPerPage,
  toggleSelect,
  isSelected,
  toggleExpand,
  isExpanded,
  sortBy: options.sortBy,
  hasActions: props.hasActions,
}));

// --- Estilos ---
const baseWrapperClass = 'overflow-hidden h-full w-full flex flex-col border border-slate-200 dark:border-slate-800 rounded';
const mergedWrapperClass = [baseWrapperClass, wrapperClass.value];

const baseTableClass = 'table-auto w-full h-fit text-sm text-left';
const mergedTableClass = [baseTableClass, tableClass.value];

// --- Control de UI para Búsqueda (móvil/desktop) ---
onMounted(() => showIconSearch());
const searchRef = ref(null);
const showSearch = ref(true);
const showSearchBtn = ref(false);

function handleSearchFocus(){
  focusOnSearch();
}

function focusOnSearch(){
  if(!isMobile.value) return;
  hideIconSearch();
  nextTick(() => {
    searchRef.value.focus();
  })
}

function showIconSearch(){
  if(!isMobile.value) return;
  searchClass.value = "w-fit";
  showSearch.value = false;
  showSearchBtn.value = true;
  emits('focusOnSearch', false);
}

function hideIconSearch(){
  if(!isMobile.value) return;
  searchClass.value = "w-full border";
  showSearchBtn.value = false;
  showSearch.value = true;
  emits('focusOnSearch', true);
}
const searchClass = ref("w-full border max-w-sm");
</script>
