<template>
  <div class="flex flex-col h-dvh text-black dark:text-white overflow-hidden" style="overflow: hidden!important;">
    <KunAppbar bg-color="bg-slate-400 dark:bg-slate-800" @toggle-drawer="leftDrawerStatus = !leftDrawerStatus" showDrawerButton>
      <template #actions>
        <KunBtn @click="modaDialgo = true" text="dialgo"/>
        <KunSwitch v-model="currentTheme" true-value="light" false-value="dark" on-color="bg-black" off-color="bg-white"
          icon-color="bg-blue-500" @update:model-value="setTheme" />
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

    <!-- <div class="h-24"></div> -->

    <div class="h-fit flex overflow-auto justify-center bg-gray-900">
      <KunNumberField text-center v-model="testTxtArea" variant="outlined" 
        label="pepe" precision="0" dirty noArrows @update:model-value="checkItem"
        clearable
      />

      <KunAutocomplete v-model="selected" item-title="name" item-subtitle="name" item-value="id"
        :has-create-item="true"  label="hola mundo" return-object multiple
        :items="products" :searchable-keys="['name', 'fullName']"
      />
      <!-- <KunRelationMatrix 
        :columns="companies"
        :rows="products"
        row-key="id"
        column-key="id"
        row-label="name"
        column-label="fantasy_name"
        relation-key="users"
        relation-title="Test relacion" 
        relationDirection="column"
        @update:columns="val => companies = val"
      /> -->

      <!-- <KunTable showSelect searchable filterable :filters="[1,2]" :headers="headers" :items="products" :rowClassCondition="checkType" items-per-page="50"/> -->
    </div>
    <div>
      <KunCard to="/examples/KunCard">HOla</KunCard>
    </div>

    <!-- <div class="h-24"></div> -->

    <!-- <div class="flex justify-center bg-gray-400">
      <KunMenu v-model="pija" origin="top center" transition="slide-down">
        <template v-slot:activator="{ props }">
          <KunBtn bgColor="bg-amber-300" :icon="IconAccountOutline" v-bind="props" class="mx-2" @click="pija = true" />
        </template>
        <KunList>
          <KunListItem class="hover:bg-red-800">Hola mundo</KunListItem>
        </KunList>
      </KunMenu>
    </div> -->

    <KunDialog v-if="modaDialgo" v-model="modaDialgo" :fullscreen="true" minWidth="min-w-full" persistent>
      <div class="h-full flex-shrink">
        <KunToolbar rightSectionClass="bg-red-900" titlePosition="left" title="consumidor finalhola mundo arroba jaja" bgColor="bg-primary-200 dark:bg-primary-920" density="compact">
          <template #append>
              <div class="flex gap-x-2">
                  <slot name="tolbar-buttons"/>
                  <KunBtn rounded="rounded-xl" @click="menuModel = false" bgColor="bg-error" text="X" />
              </div>
          </template>
        </KunToolbar>

        <KunRow class="h-full overflow-auto">
          <KunCol cols="12">5</KunCol>
          <KunCol cols="12">3</KunCol>
          <KunCol cols="12">2</KunCol>
          <KunCol cols="12">1</KunCol>
          <KunCol cols="12">5</KunCol>
          <KunCol cols="12">8</KunCol>
          <KunCol cols="12">4</KunCol>
          <KunCol cols="12">3</KunCol>
          <KunCol cols="12">1</KunCol>
          <KunCol cols="12">2</KunCol>
          <KunCol cols="12">1</KunCol>
          <KunCol cols="12">5</KunCol>
          <KunCol cols="12">8</KunCol>
          <KunCol cols="12">4</KunCol>
          <KunCol cols="12">3</KunCol>
          <KunCol cols="12">1</KunCol>
        </KunRow>
      </div>
    </KunDialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import KunIcon from './components/KunIcon/src/components/KunIcon.vue';
import IconAccountOutline from './icons/IconAccountOutline.vue';
import KunList from './components/KunList/src/components/KunList.vue';
import KunListItem from './components/KunListItem/src/components/KunListItem.vue';
import KunAppbar from './components/KunAppbar/src/components/KunAppbar.vue';
import KunSwitch from './components/KunSwitch/src/components/KunSwitch.vue';
import KunTable from './components/KunTable/src/components/KunTable.vue';
import KunMenu from './components/KunMenu/src/components/KunMenu.vue';
import KunDrawer from './components/KunDrawer/src/components/KunDrawer.vue';
import KunBtn from './components/KunBtn/src/components/KunBtn.vue';
import KunRelationMatrix from './components/KunRelationMatrix/src/components/KunRelationMatrix.vue';
import KunToolbar from './components/KunToolbar/src/components/KunToolbar.vue';
import KunDialog from './components/KunDialog/src/components/KunDialog.vue';
import KunRow from './components/KunRow/src/components/KunRow.vue';
import KunCol from './components/KunCol/src/components/KunCol.vue';
import KunAutocomplete from './components/KunAutocomplete/src/components/KunAutocomplete.vue';
import KunCard from './components/KunCard/src/components/KunCard.vue';
import KunNumberField from './components/KunNumberField/src/components/KunNumberField.vue';

const menuModel = ref(false);
const leftDrawerStatus = ref(false);

function checkItem(value){
  console.log(testTxtArea.value);
}

const accountUsers = ref([
  { id: 1, email: "facu.ft@gmail.com" },
  { id: 6, email: "adverich@gmail.com" },
  { id: 158, email: "testing@neopos.ar " },
  { id: 39, email: "santiagoaloi@gmail.com"}
]);

const companies = ref([
  { id: 1, fantasy_name: "SAFTCloud", 
    users: [
      { id: 1, email: "facu.ft@gmail.com" },
      { id: 6, email: "adverich@gmail.com" }
    ] 
  },
  { id: 3, fantasy_name: "Pimplin", 
    users: [
      { id: 158, email: "richard@gmail.com" },
    ] 
  }
]);


const modaDialgo = ref(false);

const productBrands = ref(generateFakeBrands(500));
const productCategories = ref(generateFakeCategories(20));
const productFamilies = ref(generateFakeFamilies(100));
const productMkups = ref(generateFakeMkups(5));
const products = ref(generateFakeProductsFull(25));

const currentTheme = ref('dark')
const selected = ref([])
const testTxtArea = ref(null)

function checkType({item}){
  return item.name.includes('Prueba 1') ? 'bg-red-700' : ''
}

const minQuantity = ref(0);
function setMin() {
  setTimeout(() => {
    minQuantity.value = 4;
  }, 2500);
}
setMin();

function getTotalAmount(item){
  return Number(item.stock) * Number(item.price_base);
}

const headers = [
  {value: 'bar_code', label: 'CB', sortable: true, align: 'center', headerAlign: 'center' },
  {value: 'fullName', label: 'Producto', sortable: true, headerAlign: 'center' },
  {value: 'amount_content', label: 'contenido', align: 'center', headerAlign: 'center', sortable: true },
  {value: 'measurement_unit_id', label: 'Unidad', align: 'center', headerAlign: 'center' },
  // {value: 'product_brand', label: 'Marca', align: 'center', headerAlign: 'center' },
  {value: 'price_base', label: 'Precio', align: 'center', headerAlign: 'center', columnFormat: 'function', columnFunction: getTotalAmount },
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