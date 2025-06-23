<template>
    <div :class="mergedWrapperClass" v-bind="$attrs" style="user-select: text">
        <!-- Barra de búsqueda -->
        <div
            v-if="searchable || filterable"
            class="py-2 px-4 bg-slate-200 dark:bg-slate-800"
            :class="{
                'justify-start flex': searchPosition === 'start',
                'justify-center flex': searchPosition === 'center',
                'justify-end flex': searchPosition === 'end'
            }"
        >
            <KunBtn v-if="filterable" @click="modalFilter = true" text="Filtrar" bgColor="bg-slate-300 dark:bg-slate-700" />

            <input
                v-if="searchable"
                v-model="searchQuery"
                type="text"
                :placeholder="searchPlaceholder"
                class="border mx-2 px-3 py-1 rounded w-full max-w-sm text-sm"
            />
        </div>

        <table :class="mergedTableClass">
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
                :thead-class="theadClass"
                :tr-class="trClass"
                :th-class="thClass"
                :has-actions="hasActions"
                :action-label="actionLabel"
                @sort="updateSort"
                @toggle-select-all="toggleSelectAll"
            />
            <slot v-else name="thead" v-bind="slotProps" />

            <template v-if="paginatedItems.length && !isMobile">
                <slot name="body.prepend" v-bind="slotProps" />
                <KunTableRows 
                    :items="paginatedItems"
                    :headers="headers"
                    :tbody-class="tbodyClass"
                    :row-class="rowClass"
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
                >
                    <template v-for="(_, name) in $slots" #[name]="slotProps">
                        <slot :name="name" v-bind="slotProps" />
                    </template>
                </KunTableRows>
                <slot name="body.append" v-bind="slotProps" />
            </template>

            <template v-else-if="paginatedItems.length && isMobile">
                <KunTableIterators
                    :items="paginatedItems"
                    :headers="headers"
                    :row-class="rowClass"
                    :is-selected="isSelected"
                    :is-expanded="isExpanded"
                    :show-select="showSelect"
                    :show-expand="showExpand"
                    :has-actions="hasActions"
                    :action-loading-map="actionLoadingMap"
                    @toggle-expand="toggleExpand"
                    @toggle-select="toggleSelect"
                >
                    <template v-for="(_, name) in $slots" #[name]="slotProps">
                    <slot :name="name" v-bind="slotProps" />
                    </template>
                </KunTableIterators>
            </template>

            <template v-else>
                <tr>
                    <td :colspan="fullColspan">
                        <KunCard class="h-full flex justify-center items-center" title="No hay elementos disponibles" titleSize="text-4xl" />
                    </td>
                </tr>
            </template>

            <template v-if="$slots.tfoot">
                <tfoot><slot name="tfoot" v-bind="slotProps" /></tfoot>
            </template>
        </table>

        <div class="h-full"></div>
        <!-- Footer Fijo -->
        <div v-if="!hideDefaultFooter" class="sticky bottom-0 z-10">
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
import { computed, ref, toRefs, watch } from 'vue';
import { isMobile } from '@/utils/_platform';
import KunTableHeaders from './KunTableHeaders.vue';
import KunTableFooter from './KunTableFooter.vue';
import KunTableRows from './KunTableRows.vue';
import KunTableIterators from './KunTableIterators.vue';
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';
import KunTableFilter from './KunTableFilter.vue';
import KunCard from '../../../KunCard/src/components/KunCard.vue';

import useExpand from '../composables/useExpand';
import useOptions from '../composables/useOptions';
import useSelect from '../composables/useSelect';
import useFilter from '../composables/useFilter';

import kunTableProps from '../composables/KunTableProps';

const emits = defineEmits(['update:page', 'update:itemsPerPage', 'update:sortBy', 'update:selectedItems']);
const props = defineProps(kunTableProps());
const propsRefs = toRefs(props);

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
const searchQuery = ref('');
const { filteredItems, setSearch, modalFilter, applyColumnFilters, clearFilters, appliedFilters } = useFilter(propsRefs, debounceTime);
// Sincronizar búsqueda
watch(searchQuery, (q) => {
  setSearch(q);
});

const { options, paginatedItems, updateSort } = useOptions(propsRefs, emits, filteredItems);
const { isSelected, toggleSelect, toggleSelectAll, allSelected } = useSelect(propsRefs, emits);
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

const baseWrapperClass = 'overflow-auto h-full w-full flex flex-col border border-slate-200 dark:border-slate-800 rounded';
const mergedWrapperClass = [baseWrapperClass, wrapperClass.value];

const baseTableClass = 'table-auto w-full h-full text-sm text-left';
const mergedTableClass = [baseTableClass, tableClass.value];

const fullColspan = computed(() => {
  let total = props.headers?.length || 0;
  if (props.showSelect) total += 1;
  if (props.showExpand) total += 1;
  if (props.hasActions) total += 1;
  return total;
});
</script>
