<template>
  <div :class="mergedWrapperClass" v-bind="$attrs" style="user-select: text">
    <!-- Barra de búsqueda -->
    <div
      v-if="searchable || filterable || $slots.prependSearch || $slots.appendSearch"
      class="p-2 bg-surface print:hidden"
      :class="{
        'justify-start flex': searchPosition === 'start',
        'justify-center flex': searchPosition === 'center',
        'justify-end flex': searchPosition === 'end'
      }"
    >
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
        :items-length="items.length"
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
import { computed, onMounted, ref, toRefs, watch, nextTick } from 'vue';
import { isMobile } from '@/utils/_platform';
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue';
import IconFilter from '../../../../icons/IconFilter.vue';
import IconSearch from '../../../../icons/IconSearch.vue';
import KunTableHeaders from './KunTableHeaders.vue';
import KunTableFooter from './KunTableFooter.vue';
import KunTableRows from './KunTableRows.vue';
import KunTableIterators from './KunTableIterators.vue';
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';
import KunTableFilter from './KunTableFilter.vue';

import useExpand from '../composables/useExpand';
import useOptions from '../composables/useOptions';
import useSelect from '../composables/useSelect';
import useFilter from '../composables/useFilter';

import kunTableProps from '../composables/KunTableProps';

const emits = defineEmits(['update:page', 'update:itemsPerPage', 'update:sortBy', 'update:search', 'focusOnSearch']);
const props = defineProps(kunTableProps());
const propsRefs = toRefs(props);
const selectedItems = defineModel('selectedItems', { type: Array, default: () => [] })

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

// Estado de búsqueda
const searchQuery = ref(props.search);
watch(() => props.search, (val) => {
  if (val !== searchQuery.value) {
    searchQuery.value = val;
  }
});

const { filteredItems, setSearch, modalFilter, applyColumnFilters, clearFilters, appliedFilters } = useFilter(propsRefs, debounceTime);

// Sincronizar búsqueda
watch(searchQuery, (val) => {
  emits('update:search', val);   // opcional: si querés que sea bidireccional
  setSearch(val);
});

const { options, paginatedItems, updateSort } = useOptions(propsRefs, emits, filteredItems);
const { isSelected, toggleSelect, toggleSelectAll, allSelected, someSelected } = useSelect(paginatedItems, selectedItems);
const { isExpanded, toggleExpand } = useExpand();

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

const baseWrapperClass = 'overflow-hidden h-full w-full flex flex-col border border-slate-200 dark:border-slate-800 rounded';
const mergedWrapperClass = [baseWrapperClass, wrapperClass.value];

const baseTableClass = 'table-auto w-full h-fit text-sm text-left';
const mergedTableClass = [baseTableClass, tableClass.value];

const resolvedHeaders = computed(() => {
  return props.headers.map(header => {
    const newHeader = { ...header };

    if (
      (header.columnType === 'function' || header.columnType == 'objectFunction' || header.columnType == 'simpleFunction') && 
      typeof header.columnFunction === 'string'
    ) {
      const resolvedFn = props.functionMap?.[header.columnFunction];
      if (typeof resolvedFn === 'function') {
        newHeader.columnFunction = resolvedFn;
      } else {
        console.warn(
          `[KunTable] No se encontró la función "${header.columnFunction}" en functionMap`
        );
        newHeader.columnFunction = () => ''; // fallback para evitar errores
      }
    }

    if (header.columnFormat === 'function' && typeof header.columnRowText === 'string') {
      const resolvedFn = props.functionMap?.[header.columnRowText];
      if (typeof resolvedFn === 'function') {
        newHeader.columnRowText = resolvedFn;
      } else {
        console.warn(
          `[KunTable] No se encontró la función "${header.columnRowText}" en functionMap`
        );
        newHeader.columnRowText = () => ''; // fallback para evitar errores
      }
    }

    return newHeader;
  });
});

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
