<template>
  <div
    :class="mergedWrapperClass"
    v-bind="$attrs"
    style="user-select: text"
    :aria-busy="loading ? 'true' : undefined"
  >
    <div
      v-if="searchable || filterable || $slots.prependHeader || $slots.prependSearch || $slots.appendSearch"
      class="p-2 bg-surface print:hidden flex w-full justify-between"
      :class="{ 'pointer-events-none opacity-60': loading }"
    >
      <div class="w-full flex items-center" v-if="showSearchBtn || !isMobile">
        <slot name="prependHeader" />
      </div>

      <div class="inline-flex items-center justify-center whitespace-nowrap" v-if="selectedItems.length && !hideSelected">
        <span class="pr-2">Se han seleccionado {{ selectedItems.length }} registros.</span>
        <span
          v-if="selectedItems.length"
          @click="clearSelection"
          class="bg-blue-300 dark:bg-blue-700 hover:!bg-blue-500 rounded cursor-pointer px-2 ml-2"
        >
          Anular selección
        </span>
      </div>

      <div class="min-w-1/3 flex h-full items-center justify-end">
        <slot name="prependSearch" />

        <KunBtn
          class="h-fit"
          v-if="filterable && filters.length"
          @click="modalFilter = true"
          rounded="rounded-full"
          size="xs"
          bgColor="bg-green-200 dark:bg-green-800"
        >
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
          <KunIcon :icon="IconSearch" @click="handleSearchFocus" v-show="showSearchBtn" />
        </div>

        <slot name="appendSearch" />
      </div>
    </div>

    <div class="relative flex-1 overflow-auto bg-surface">
      <table :class="mergedTableClass" v-if="rows.length">
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
          :more-than-paginated="false"
          :some-selected="someSelected"
          :thead-class="theadClass"
          :tr-class="trClass"
          :th-class="thClass"
          :has-actions="hasActions"
          :action-label="actionLabel"
          :disabled="loading"
          @sort="updateSort"
          @toggle-select-all="toggleSelectAll"
          :customHeaders="customSlots"
        />
        <slot v-else name="thead" v-bind="slotProps" />

        <template v-if="!isMobile">
          <slot name="body.prepend" v-bind="slotProps" />
          <KunTableRows
            :items="rows"
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
            :item-key="getRowRenderKey"
            @toggle-expand="toggleExpand"
            @toggle-select="toggleSelect"
            :customSlots="customSlots"
            :get-action-loading="getActionLoading"
          >
            <template v-for="(_, name) in $slots" #[name]="innerSlotProps">
              <slot :name="name" v-bind="innerSlotProps" />
            </template>
          </KunTableRows>
          <slot name="body.append" v-bind="slotProps" />
        </template>

        <template v-else>
          <KunTableIterators
            :items="rows"
            :headers="resolvedHeaders"
            :row-class="rowClass"
            :row-class-condition="rowClassCondition"
            :is-selected="isSelected"
            :is-expanded="isExpanded"
            :show-select="showSelect"
            :show-expand="showExpand"
            :has-actions="hasActions"
            :action-loading-map="actionLoadingMap"
            :item-key="getRowRenderKey"
            @toggle-expand="toggleExpand"
            @toggle-select="toggleSelect"
            :customSlots="customSlots"
            :get-action-loading="getActionLoading"
          >
            <template v-for="(_, name) in $slots" #[name]="innerSlotProps">
              <slot :name="name" v-bind="innerSlotProps" />
            </template>
          </KunTableIterators>
        </template>

        <template v-if="$slots.tfoot">
          <tfoot><slot name="tfoot" v-bind="slotProps" /></tfoot>
        </template>
      </table>

      <div v-else class="h-full flex justify-center items-center">
        <div class="text-center text-4xl">
          {{ loading ? loadingText : noDataText }}
        </div>
      </div>

      <div
        v-if="loading && rows.length"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/60 dark:bg-black/50 print:hidden"
      >
        <KunLoaderCircular :size="40" :width="4" />
        <span class="text-sm text-slate-700 dark:text-slate-200">{{ loadingText }}</span>
      </div>
    </div>

    <div
      v-if="!hideDefaultFooter"
      class="sticky bottom-0 z-10 print:hidden"
      :class="{ 'pointer-events-none opacity-50': loading }"
    >
      <KunTableFooter
        :items-length="pagination.total"
        :items-per-page="options.itemsPerPage"
        :current-page="options.page"
        :total-pages="pagination.lastPage"
        :from="pagination.from"
        :to="pagination.to"
        :page-options="pageOptions"
        @update:itemsPerPage="options.itemsPerPage = $event"
        @update:page="options.page = $event"
      />
    </div>
    <slot v-else name="footer" v-bind="slotProps" />

    <KunTableFilter
      v-if="filterable && modalFilter"
      :filters="filters"
      v-model="modalFilter"
      @applyFilters="applyColumnFilters"
      @clearFilters="clearFilters"
      :activeFilters="appliedFilters.byColumn"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { isMobile } from '@/utils/_platform';
import { debounce } from '@/utils/utils.js';

import KunIcon from '../../../KunIcon/src/components/KunIcon.vue';
import IconFilter from '../../../../icons/IconFilter.vue';
import IconSearch from '../../../../icons/IconSearch.vue';
import KunTableHeaders from '../../../KunTable/src/components/KunTableHeaders.vue';
import KunTableFooter from '../../../KunTable/src/components/KunTableFooter.vue';
import KunTableRows from '../../../KunTable/src/components/KunTableRows.vue';
import KunTableIterators from '../../../KunTable/src/components/KunTableIterators.vue';
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';
import KunTableFilter from '../../../KunTable/src/components/KunTableFilter.vue';
import KunLoaderCircular from '../../../KunLoaderCircular/src/components/KunLoaderCircular.vue';

import useExpand from '../../../KunTable/src/composables/useExpand';
import { resolveRowKeyValue } from '../../../KunTable/src/composables/useRowKey';
import kunTableServerSideProps from '../composables/KunTableServerSideProps';

const emits = defineEmits([
  'update:page',
  'update:itemsPerPage',
  'update:sortBy',
  'update:search',
  'update:query',
  'focusOnSearch',
]);

const props = defineProps(kunTableServerSideProps());
const propsRefs = toRefs(props);
const selectedItems = defineModel('selectedItems', { type: Array, default: () => [] });

const {
  headers,
  showExpand,
  showSelect,
  rowKey,
  rowClass,
  hideDefaultFooter,
  hideDefaultHeader,
  tableClass,
  wrapperClass,
  pageOptions,
  searchable,
  filters,
  hideSelected
} = propsRefs;

const normalizeSortBy = (rawSortBy) => {
  if (typeof rawSortBy === 'string') return [{ key: rawSortBy, order: 'asc' }];
  if (Array.isArray(rawSortBy)) return rawSortBy.map(s => typeof s === 'string' ? { key: s, order: 'asc' } : s);
  return [];
};

const unwrapResult = computed(() => {
  if (props.result?.result && typeof props.result.result === 'object') return props.result.result;
  return props.result ?? {};
});

const rows = computed(() => Array.isArray(unwrapResult.value?.data) ? unwrapResult.value.data : []);

const pagination = computed(() => ({
  currentPage: Number(unwrapResult.value?.current_page ?? props.page ?? 1) || 1,
  lastPage: Number(unwrapResult.value?.last_page ?? 0) || 0,
  perPage: Number(unwrapResult.value?.per_page ?? props.itemsPerPage ?? 10) || 10,
  total: Number(unwrapResult.value?.total ?? rows.value.length ?? 0) || 0,
  from: unwrapResult.value?.from == null ? null : Number(unwrapResult.value.from),
  to: unwrapResult.value?.to == null ? null : Number(unwrapResult.value.to),
}));

const options = reactive({
  page: pagination.value.currentPage,
  itemsPerPage: pagination.value.perPage,
  sortBy: normalizeSortBy(props.sortBy),
});

const searchQuery = ref(props.search);
const modalFilter = ref(false);
const isSyncingFromExternal = ref(false);
const appliedFilters = reactive({
  search: props.search ?? '',
  byColumn: {},
});

const syncFromExternal = (fn) => {
  isSyncingFromExternal.value = true;
  try {
    fn();
  } finally {
    nextTick(() => {
      isSyncingFromExternal.value = false;
    });
  }
};

watch(() => props.search, (val) => {
  syncFromExternal(() => {
    if (val !== searchQuery.value) searchQuery.value = val ?? '';
    if ((val ?? '') !== appliedFilters.search) appliedFilters.search = val ?? '';
  });
});

watch(() => props.sortBy, (val) => {
  syncFromExternal(() => {
    options.sortBy = normalizeSortBy(val);
  });
}, { deep: true });

watch(() => props.page, (val) => {
  const nextPage = Number(val);
  if (Number.isFinite(nextPage) && nextPage > 0 && nextPage !== options.page) {
    syncFromExternal(() => {
      options.page = nextPage;
    });
  }
});

watch(() => props.itemsPerPage, (val) => {
  const nextPerPage = Number(val);
  if (Number.isFinite(nextPerPage) && nextPerPage > 0 && nextPerPage !== options.itemsPerPage) {
    syncFromExternal(() => {
      options.itemsPerPage = nextPerPage;
    });
  }
});

watch(pagination, (val) => {
  syncFromExternal(() => {
    if (val.currentPage !== options.page) options.page = val.currentPage;
    if (val.perPage !== options.itemsPerPage) options.itemsPerPage = val.perPage;
  });
}, { deep: true });

const resolvedHeaders = computed(() => {
  return props.headers.map(header => {
    const newHeader = { ...header };

    if (header.columnType === 'function' && typeof header.columnFunction === 'string') {
      const resolvedFn = props.functionMap?.[header.columnFunction];
      newHeader.columnFunction = typeof resolvedFn === 'function' ? resolvedFn : () => '';
    }

    return newHeader;
  });
});

const getRowKeyValue = (item, index = -1) => resolveRowKeyValue(item, rowKey.value, index);
const getRowRenderKey = (item, index = -1) => getRowKeyValue(item, index) ?? `kun-table-server-row-${index}`;
const getActionLoading = (item, index = -1) => {
  const key = getRowKeyValue(item, index);
  return key === null ? false : props.actionLoadingMap?.[key] || false;
};
const isSameItem = (leftItem, rightItem, leftIndex = -1, rightIndex = -1) => {
  const leftKey = getRowKeyValue(leftItem, leftIndex);
  const rightKey = getRowKeyValue(rightItem, rightIndex);

  if (leftKey !== null && rightKey !== null) {
    return leftKey === rightKey;
  }

  return leftItem === rightItem;
};

const isSelected = (item) => selectedItems.value.some((selectedItem, index) => isSameItem(selectedItem, item, index));

const clearSelection = () => {
  selectedItems.value = [];
};

const toggleSelect = (item) => {
  if (isSelected(item)) {
    selectedItems.value = selectedItems.value.filter((selectedItem, index) => !isSameItem(selectedItem, item, index));
    return;
  }
  selectedItems.value = [...selectedItems.value, item];
};

const allSelected = computed(() => rows.value.length > 0 && rows.value.every(isSelected));
const someSelected = computed(() => rows.value.some(isSelected) && !allSelected.value);

const toggleSelectAll = () => {
  if (allSelected.value) {
    clearSelection();
    return;
  }
  selectedItems.value = [...rows.value];
};

watch(rows, () => {
  selectedItems.value = selectedItems.value.filter((item, selectedIndex) => {
    return rows.value.some((row, rowIndex) => isSameItem(item, row, selectedIndex, rowIndex));
  });
}, { deep: true });

const { isExpanded, toggleExpand } = useExpand();

const toQueryPayload = () => {
  const [firstSort] = options.sortBy;
  return {
    page: options.page,
    per_page: options.itemsPerPage,
    search: appliedFilters.search,
    sortBy: options.sortBy,
    sort: firstSort?.key ?? null,
    direction: firstSort?.order ?? null,
    filters: { ...appliedFilters.byColumn },
  };
};

const emitQueryChange = () => {
  emits('update:page', options.page);
  emits('update:itemsPerPage', options.itemsPerPage);
  emits('update:sortBy', options.sortBy);
  emits('update:query', toQueryPayload());
};

const debouncedSearchEmit = debounce((value) => {
  appliedFilters.search = value ?? '';
  if (options.page !== 1) {
    options.page = 1;
    return;
  }
  emitQueryChange();
}, props.debounceTime ?? 300);

watch(searchQuery, (val) => {
  if (isSyncingFromExternal.value) return;
  emits('update:search', val);
  debouncedSearchEmit(val);
});

watch(() => options.page, (newVal, oldVal) => {
  if (isSyncingFromExternal.value) return;
  if (newVal !== oldVal) emitQueryChange();
});

watch(() => options.itemsPerPage, (newVal, oldVal) => {
  if (isSyncingFromExternal.value) return;
  if (newVal !== oldVal) {
    if (options.page !== 1) {
      options.page = 1;
      return;
    }
    emitQueryChange();
  }
});

watch(() => options.sortBy, (newVal, oldVal) => {
  if (isSyncingFromExternal.value) return;
  if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
    if (options.page !== 1) {
      options.page = 1;
      return;
    }
    emitQueryChange();
  }
}, { deep: true });

const applyColumnFilters = (columnFilters) => {
  appliedFilters.byColumn = { ...columnFilters };
  if (options.page !== 1) {
    options.page = 1;
    return;
  }
  emitQueryChange();
};

const clearFilters = () => {
  appliedFilters.byColumn = {};
  if (options.page !== 1) {
    options.page = 1;
    return;
  }
  emitQueryChange();
};

const updateSort = ({ key, order }) => {
  if (props.loading) return;
  const existing = options.sortBy.find(s => s.key === key);
  if (existing) {
    options.sortBy = [{ key, order }];
    return;
  }
  options.sortBy = [{ key, order }];
};

const slotProps = computed(() => ({
  items: rows.value,
  headers: headers.value,
  page: options.page,
  itemsPerPage: options.itemsPerPage,
  toggleSelect,
  isSelected,
  toggleExpand,
  isExpanded,
  sortBy: options.sortBy,
  hasActions: props.hasActions,
  getRowKey: getRowKeyValue,
  pagination: pagination.value,
}));

const baseWrapperClass = 'overflow-hidden h-full w-full flex flex-col border border-slate-200 dark:border-slate-800 rounded';
const mergedWrapperClass = [baseWrapperClass, wrapperClass.value];

const baseTableClass = 'table-auto w-full h-fit text-sm text-left';
const mergedTableClass = [baseTableClass, tableClass.value];

onMounted(() => showIconSearch());
const searchRef = ref(null);
const showSearch = ref(true);
const showSearchBtn = ref(false);
const searchClass = ref('w-full border max-w-sm');

function handleSearchFocus() {
  focusOnSearch();
}

function focusOnSearch() {
  if (!isMobile.value) return;
  hideIconSearch();
  nextTick(() => {
    searchRef.value?.focus();
  });
}

function showIconSearch() {
  if (!isMobile.value) return;
  searchClass.value = 'w-fit';
  showSearch.value = false;
  showSearchBtn.value = true;
  emits('focusOnSearch', false);
}

function hideIconSearch() {
  if (!isMobile.value) return;
  searchClass.value = 'w-full border';
  showSearchBtn.value = false;
  showSearch.value = true;
  emits('focusOnSearch', true);
}
</script>
