<template>
  <div class="flex flex-col h-dvh text-black dark:text-white overflow-hidden" style="overflow: hidden!important;">
    <KunAppbar bgColor="bg-slate-400 dark:bg-slate-800" @toggle-drawer="leftDrawerStatus = !leftDrawerStatus" showDrawerButton>
      <template #actions>
        <KunSwitch v-model="currentTheme" true-value="light" false-value="dark" on-color="bg-black" off-color="bg-white"
          icon-color="bg-blue-500" @update:model-value="setTheme" />

        <div class="h-15 w-max" ref="avatarRef">
          <KunAvatar class="bg-transparent" @click="menuModel = true">
            <KunIcon :icon="IconAccountOutline" color="text-red-500" />
            <KunMenu activator="parent" v-model="menuModel" :parent-ref="avatarRef" z-index="z-[2000]"
              location="bottom" origin="bottom right" 
              minWidth="min-w-48" width="w-64" maxWidth="max-w-64"
            >
              <KunList>
                <KunListItem>Hola mundo</KunListItem>
                <KunListItem>Hola mundo dos</KunListItem>
              </KunList>
            </KunMenu>
          </KunAvatar>
        </div>
      </template>
    </KunAppbar>

    <KunDrawer
      v-model="leftDrawerStatus"
      :temporary="true"
      location="start"
      scrim
      elevation="4"
      rounded="rounded-r-lg"
      color="bg-slate-100 dark:bg-slate-900"
    >
      <template #prepend>
        <div class="p-4 text-lg font-bold">Menú</div>
      </template>

      <div class="my-1 py-2 space-y-2">
        <div class="hover:bg-slate-200 p-2 rounded cursor-pointer">Inicio</div>
        <div class="hover:bg-slate-200 p-2 rounded cursor-pointer">Productos</div>
        <div class="hover:bg-slate-200 p-2 rounded cursor-pointer">Clientes</div>
      </div>

      <template #append>
        <div class="mt-auto p-4 text-sm text-gray-400">© 2025</div>
      </template>
    </KunDrawer>

    <KunToolbar bgColor="bg-red-800"/>

    <div class="h-full">
      <KunTable :items="products" :headers="headers" showSelect />
    </div>
    <div>
      <KunRow style="overflow: hidden!important;">
        <KunCol cols="3">
          <KunAutocomplete v-model="selected" activator="parent" :items="products" item-title="name" item-value="id"
            item-text="name" :max-height="300" label="Seleccionar sucursal" :searchable-keys="['name']"
            @update:model-value="vModelUpdated" :clear-on-select="true"
          />
        </KunCol>

        <KunCol cols="9">aca hay un col</KunCol>

        <KunCol cols="3">
          <KunTextarea auto-grow v-model="testingArea" bgColor="bg-red-800" />
        </KunCol>

        <KunCol cols="9">
          <KunFileInput v-model="file" />
        </KunCol>

        <KunCol cols="3">
          <KunNumberField noArrows v-model="numTest">
            <template #prepend-icon>
              <KunIcon color="text-green-500" :icon="IconAccountOutline" size="text-xl"/>
            </template>
          </KunNumberField>
        </KunCol>
      </KunRow>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import KunAutocomplete from './components/KunAutocomplete/src/components/KunAutocomplete.vue';
import KunIcon from './components/KunIcon/src/components/KunIcon.vue';
import IconAccountOutline from './icons/IconAccountOutline.vue';
import KunList from './components/KunList/src/components/KunList.vue';
import KunListItem from './components/KunListItem/src/components/KunListItem.vue';
import KunAppbar from './components/KunAppbar/src/components/KunAppbar.vue';
import KunSwitch from './components/KunSwitch/src/components/KunSwitch.vue';
import KunAvatar from './components/KunAvatar/src/components/KunAvatar.vue';
import KunMenu from './components/KunMenu/src/components/KunMenu.vue';
import KunDrawer from './components/KunDrawer/src/components/KunDrawer.vue';
import KunTextarea from './components/KunTextarea/src/components/KunTextarea.vue';
import KunRow from './components/KunRow/src/components/KunRow.vue';
import KunCol from './components/KunCol/src/components/KunCol.vue';
import KunNumberField from './components/KunNumberField/src/components/KunNumberField.vue';
import KunFileInput from './components/KunFileInput/src/components/KunFileInput.vue';

import KunTable from './components/KunTable/src/components/KunTable.vue';
import KunToolbar from './components/KunToolbar/src/components/KunToolbar.vue';

const menuModel = ref(false);
const avatarRef = ref(null);
const leftDrawerStatus = ref(false);
const numTest = ref()
const testingArea = ref('');
const file = ref();

const footerMessages = ref([]);
function vModelUpdated(value){
  // console.log('Actualizado');
  // console.log(value);
}

function showMessage(message, color = "green", time = 30000) {
  const id = Date.now();
  // Crear el mensaje con su timeout
  const newMessage = {
    id,
    text: message,
    color,
    modelValue: true,
    timeout: setTimeout(() => removeMessage(id), time) // Almacena el timeout en el objeto
  };

  footerMessages.value = [...footerMessages.value, newMessage];
}

const productBrands = ref(generateFakeBrands(500));
const productCategories = ref(generateFakeCategories(20));
const productFamilies = ref(generateFakeFamilies(100));
const productMkups = ref(generateFakeMkups(5));
const products = ref(generateFakeProductsFull(20));

const currentTheme = ref('dark')
const loader = ref(false)
const selected = ref(74983)

const value = ref(5);
const minQuantity = ref(0);
function setMin() {
  setTimeout(() => {
    minQuantity.value = 4;
  }, 2500);
}
setMin();

const trueOrFalse = [
  { id: 1, value: true, name: "Si" },
  { id: 2, value: false, name: "No" },
];

function getTotalAmount(item){
  return Number(item.stock) * Number(item.price_base);
}

const headers = [
  {value: 'bar_code', label: 'CB', sortable: true, align: 'center', headerAlign: 'center' },
  {value: 'fullName', label: 'Producto', sortable: true, headerAlign: 'center' },
  {value: 'amount_content', label: 'contenido', align: 'center', headerAlign: 'center', sortable: true },
  {value: 'measurement_unit_id', label: 'Unidad', align: 'center', headerAlign: 'center' },
  // {value: 'product_brand', label: 'Marca', align: 'center', headerAlign: 'center' },
  {value: 'price_base', label: 'Precio', align: 'center', headerAlign: 'center' },
  {value: 'total_price', label: 'Precio total', align: 'center', headerAlign: 'center', columnType: 'function', columnFunction: getTotalAmount, columnFormat: 'money' },
  {value: 'created_at', label: 'Fecha', align: 'center', headerAlign: 'center', columnFormat: 'dateTime' },
]

const filters = [
  { value: 'product_category_id', label: 'Categoria', title: 'name', items: productCategories.value, placeholder: 'Seleccionar categorias' },
  { value: 'product_family_id', label: 'Familia', title: 'name', items: productFamilies.value, placeholder: 'Seleccionar familias' },
  { value: 'product_brand', label: 'Marca', title: 'name', items: productBrands.value, placeholder: 'Seleccionar marcas' },
]

function generateFakeBrands(count = 10) {
  const brands = [];
  for (let i = 0; i < count; i++) {
    const id = 10000 + i;
    brands.push({
      id,
      company_id: 36,
      name: `Marca ${i + 1}`,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  return brands;
}

function generateFakeCategories(count = 10) {
  const categories = [];
  for (let i = 0; i < count; i++) {
    categories.push({
      id: 80 + i,
      name: `Categoría ${i + 1}`
    });
  }
  return categories;
}

function generateFakeFamilies(count = 10) {
  const families = [];
  for (let i = 0; i < count; i++) {
    families.push({
      id: 660 + i,
      name: `Familia ${i + 1}`
    });
  }
  return families;
}

function generateFakeMkups(count = 5) {
  const mkups = [];
  for (let i = 0; i < count; i++) {
    mkups.push({
      id: 30 + i,
      name: `Mkup ${i + 1}`
    });
  }
  return mkups;
}

function generateRandomBarcode() {
  let barcode = '';
  for (let i = 0; i < 13; i++) {
    barcode += Math.floor(Math.random() * 10);
  }
  return barcode;
}

function generateFakeProductsFull(count = 100) {
  const products = [];
  const now = new Date();

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      .toISOString();
  }

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  for (let i = 1; i <= count; i++) {
    const id = 74980 + i;
    const product_variant_id = 26000 + i;
    const company_id = 36;
    const measurement_unit_id = 7;

    const created_at = randomDate(new Date(2023, 0, 1), now);
    const updated_at = randomDate(new Date(2024, 0, 1), now);

    const stockValue = (30 + (i % 50)).toFixed(2);

    const name = `Producto Prueba ${i}`;
    const fullName = `RASSIT - ${name} 1 UN`;

    const product_brand = getRandomItem(productBrands.value);
    const product_category = getRandomItem(productCategories.value);
    const product_family = getRandomItem(productFamilies.value);
    const product_mkup = getRandomItem(productMkups.value);

    products.push({
      id,
      company_id,
      bar_code: generateRandomBarcode(),
      sku: null,
      serial_number: null,
      status: 1,
      is_active_online: 1,
      is_composite: 0,
      composition: null,
      hasVariants: 0,
      hasStock: 0,
      product_category_id: product_category.id,
      product_family_id: product_family.id,
      product_brand_id: product_brand.id,
      name,
      description: null,
      tags: null,
      observation: null,
      amount_content: "1.00",
      can_have_discount: 0,
      editable_name: 0,
      editable_price: 1,
      measurement_unit_id,
      weight: "0.00",
      volume: "0.00",
      cost_net: "330.58",
      cost_untaxed: "0.00",
      vat_id: 5,
      product_mkup_id: product_mkup.id,
      price_base: "1200.00",
      price_discounted: "0.00",
      stock: stockValue,
      inventory: stockValue,
      quantity_limit: null,
      min_limit: null,
      order_limit: null,
      max_limit: null,
      avatar: null,
      entity_supplier_id: null,
      expiration_date: null,
      exp_first_alert: 0,
      exp_last_alert: 0,
      deleted_at: null,
      created_at,
      updated_at,
      fullName,
      product_promotions: [],
      product_variants: [
        {
          id: product_variant_id,
          product_id: id,
          sku: null,
          status: 1,
          is_active_online: 1,
          can_have_discount: 0,
          description: null,
          tags: null,
          avatar: null,
          deleted_at: null,
          created_at,
          updated_at,
          variants: [],
          warehouses: [
            {
              id: 12,
              company_id,
              branch_id: 29,
              is_branch_wh: 1,
              name: "Deposito Minimercado El 22",
              short_name: "DM22",
              description: null,
              tags: null,
              status: null,
              config: null,
              deleted_at: null,
              created_at: null,
              updated_at: null,
              pivot: {
                product_variant_id,
                warehouse_id: 12,
                stock: (parseFloat(stockValue) - 4).toFixed(2),
                inventory: (parseFloat(stockValue) - 4).toFixed(2),
                created_at: null,
                updated_at,
              }
            }
          ]
        }
      ],
      price_lists: [],
      taxes: [],
      product_brand,
      measurement_unit: {
        id: measurement_unit_id,
        measurement_unit_id,
        name: "Unidad",
        short_name: "UN",
        deleted_at: null,
        created_at: null,
        updated_at: null
      }
    });
  }

  return products;
}

const actionLoading = ref({})
function editItem(value){
  if (!actionLoading.value[value.id]) actionLoading.value[value.id] = {};
  actionLoading.value[value.id].edit = true;
}

function deleteItem(value){
  if (!actionLoading.value[value.id]) actionLoading.value[value.id] = {};
  actionLoading.value[value.id].delete = true;
}

function setTheme(theme) {
  const html = document.documentElement;

  if (theme === 'light') {
    html.classList.remove('dark');
  } else {
    html.classList.add('dark');
  }

  currentTheme.value = theme;
}
</script>

<style>
body {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>