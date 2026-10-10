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
          class="bg-ui-selection hover:bg-ui-primary rounded cursor-pointer px-2 ml-2"
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
          bgColor="bg-success"
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
        class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-ui-overlay print:hidden"
      >
        <KunLoaderCircular :size="40" :width="4" />
        <span class="text-sm text-ui">{{ loadingText }}</span>
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
        :from="pagination.from ?? undefined"
        :to="pagination.to ?? undefined"
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

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, toRefs, watch, type Ref } from 'vue';
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

import useExpand from '../../../KunTable/src/composables/useExpand.js';
import { resolveRowKeyValue, type TableItem } from '../../../KunTable/src/composables/useRowKey.js';
import type { KunTableHeader } from '@/utils/tableFormatters.js';
import kunTableServerSideProps from '../composables/KunTableServerSideProps.js';

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
const selectedItems = defineModel<TableItem[]>('selectedItems', { default: () => [] })

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

const normalizeSortBy = (rawSortBy: unknown): { key: string; order: string }[] => {
  if (typeof rawSortBy === 'string') return [{ key: rawSortBy, order: 'asc' }];
  if (Array.isArray(rawSortBy)) return (rawSortBy as (string | { key: string; order: string })[]).map((s: string | { key: string; order: string }) => typeof s === 'string' ? { key: s, order: 'asc' } : s);
  return [];
};

interface PaginatedResult {
  data?: TableItem[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
  from?: number | null;
  to?: number | null;
  [key: string]: unknown;
}

const unwrapResult = computed(() => {
  const nested = (props.result as Record<string, unknown> | undefined)?.result;
  if (nested && typeof nested === 'object') return nested as PaginatedResult;
  return (props.result ?? {}) as PaginatedResult;
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

const syncFromExternal = (fn: () => void): void => {
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
  return (props.headers as KunTableHeader[]).map((header: KunTableHeader) => {
    const newHeader = { ...header };

    if (header.columnType === 'function' && typeof header.columnFunction === 'string') {
      const resolvedFn = (props.functionMap as Record<string, unknown> | undefined)?.[header.columnFunction];
      newHeader.columnFunction = (typeof resolvedFn === 'function' ? resolvedFn : () => '') as (item: TableItem, header: KunTableHeader) => unknown;
    }

    return newHeader;
  });
});

const getRowKeyValue = (item: TableItem, index = -1): unknown => resolveRowKeyValue(item, rowKey.value as string | ((item: TableItem, index: number) => unknown), index);
const getRowRenderKey = (item: TableItem, index = -1): string => String(getRowKeyValue(item, index) ?? `kun-table-server-row-${index}`);
const getActionLoading = (item: TableItem, index = -1): boolean => {
  const key = getRowKeyValue(item, index);
  return key === null ? false : ((props.actionLoadingMap as Record<string, unknown> | undefined)?.[key as string] as boolean) || false;
};
const isSameItem = (leftItem: TableItem, rightItem: TableItem, leftIndex = -1, rightIndex = -1): boolean => {
  const leftKey = getRowKeyValue(leftItem, leftIndex);
  const rightKey = getRowKeyValue(rightItem, rightIndex);

  if (leftKey !== null && rightKey !== null) {
    return leftKey === rightKey;
  }

  return leftItem === rightItem;
};

const isSelected = (item: TableItem): boolean => selectedItems.value.some((selectedItem: TableItem, index: number) => isSameItem(selectedItem, item, index));

const clearSelection = (): void => {
  selectedItems.value = [];
};

const toggleSelect = (item: TableItem): void => {
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
  selectedItems.value = selectedItems.value.filter((item: TableItem, selectedIndex: number) => {
    return rows.value.some((row: TableItem, rowIndex: number) => isSameItem(item, row, selectedIndex, rowIndex));
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

const debouncedSearchEmit = debounce((value: unknown) => {
  appliedFilters.search = String(value ?? '');
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

const applyColumnFilters = (columnFilters: Record<string, unknown>): void => {
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

const updateSort = ({ key, order }: { key: string; order: string }): void => {
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

const baseWrapperClass = 'overflow-hidden h-full w-full flex flex-col border border-ui rounded';
const mergedWrapperClass = [baseWrapperClass, wrapperClass.value];

const baseTableClass = 'table-auto w-full h-fit text-sm text-left';
const mergedTableClass = [baseTableClass, tableClass.value];

onMounted(() => showIconSearch());
const searchRef: Ref<HTMLInputElement | null> = ref(null);
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

