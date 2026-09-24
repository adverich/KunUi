<template>
  <KunRow class="h-full flex flex-col overflow-auto bg-blue-700">
    <KunCol cols="4">
      <KunAutocomplete
        v-model="selectedColumns"
        :items="headers"
        density="comfortable"
        item-value="value"
        item-title="label"
        item-text="label"
        label="Columnas"
        multiple
        clearable
        placeholder-text="Seleccionar columnas"
        z-index="z-250"
      />

      <div class="w-1/3">
        <KunColorPicker v-model="colorSelected" />
      </div>
      <KunSwitch v-model="switchBtn" />
      <KunDatePicker :only-icon="true" />
    </KunCol>
    <KunCol cols="8" class="h-full flex flex-col overflow-auto py-1">
      <KunTable
        class="text-white"
        searchable
        :items="products"
        :headers="headers"
        :filters="filters"
        v-model:selected="selected"
        :showSelect="true"
        showExpand
        :hide-selected="smAndDown ? true : false"
      />
    </KunCol>
  </KunRow>
</template>

<script setup>
import { ref } from 'vue'
import { smAndDown } from '@/utils/_platform'
import KunSwitch from '../components/KunSwitch/src/components/KunSwitch.vue'
import KunTable from '../components/KunTable/src/components/KunTable.vue'
import KunAutocomplete from '../components/KunAutocomplete/src/components/KunAutocomplete.vue'
import KunRow from '../components/KunRow/src/components/KunRow.vue'
import KunCol from '../components/KunCol/src/components/KunCol.vue'
import KunDatePicker from '../components/KunDatePicker/src/components/KunDatePicker.vue'
import KunColorPicker from '../components/KunColorPicker/src/components/KunColorPicker.vue'

const colorSelected = ref('#913131')

const productBrands = ref(generateFakeBrands(500))
const productCategories = ref(generateFakeCategories(20))
const productFamilies = ref(generateFakeFamilies(100))
const productMkups = ref(generateFakeMkups(5))
const products = ref(generateFakeProductsFull(105))
const selectedColumns = ref([])
const selected = ref([])
const switchBtn = ref(false)

function getTotalAmount(item) {
  return Number(item.stock) * Number(item.price_base)
}

const headers = [
  { value: 'bar_code', label: 'CB', sortable: true, align: 'center', headerAlign: 'center' },
  { value: 'fullName', label: 'Producto', sortable: true, headerAlign: 'center' },
  { value: 'amount_content', label: 'contenido', align: 'center', headerAlign: 'center', sortable: true },
  { value: 'measurement_unit_id', label: 'Unidad', align: 'center', headerAlign: 'center' },
  {
    value: 'price_base',
    label: 'Precio',
    align: 'center',
    headerAlign: 'center',
    columnFormat: 'function',
    columnFunction: getTotalAmount,
  },
  {
    value: 'total_price',
    label: 'Precio total',
    align: 'center',
    headerAlign: 'center',
    columnType: 'function',
    columnFunction: getTotalAmount,
    columnFormat: 'money',
  },
  { value: 'cuit', label: 'cuit', align: 'center', headerAlign: 'center', columnType: 'document', columnFormat: 'document' },
]

const filters = [
  { value: 'product_category_id', label: 'Categoria', title: 'name', items: productCategories.value, placeholder: 'Seleccionar categorias' },
  { value: 'product_family_id', label: 'Familia', title: 'name', items: productFamilies.value, placeholder: 'Seleccionar familias' },
  { value: 'product_brand', label: 'Marca', title: 'name', items: productBrands.value, placeholder: 'Seleccionar marcas' },
]

function generateFakeBrands(count = 10) {
  const brands = []
  for (let i = 0; i < count; i++) {
    const id = 10000 + i
    brands.push({
      id,
      company_id: 36,
      name: `Marca ${i + 1}`,
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  }
  return brands
}

function generateFakeCategories(count = 10) {
  const categories = []
  for (let i = 0; i < count; i++) {
    categories.push({ id: 80 + i, name: `Categoría ${i + 1}` })
  }
  return categories
}

function generateFakeFamilies(count = 10) {
  const families = []
  for (let i = 0; i < count; i++) {
    families.push({ id: 660 + i, name: `Familia ${i + 1}` })
  }
  return families
}

function generateFakeMkups(count = 5) {
  const mkups = []
  for (let i = 0; i < count; i++) {
    mkups.push({ id: 30 + i, name: `Mkup ${i + 1}` })
  }
  return mkups
}

function generateRandomBarcode() {
  let barcode = ''
  for (let i = 0; i < 13; i++) {
    barcode += Math.floor(Math.random() * 10)
  }
  return barcode
}

function generateFakeProductsFull(count = 100) {
  const list = []
  const now = new Date()

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
  }

  function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)]
  }

  for (let i = 1; i <= count; i++) {
    const id = 74980 + i
    const product_variant_id = 26000 + i
    const company_id = 36
    const measurement_unit_id = 7
    const created_at = randomDate(new Date(2023, 0, 1), now)
    const updated_at = randomDate(new Date(2024, 0, 1), now)
    const stockValue = (30 + (i % 50)).toFixed(2)
    const name = `Producto Prueba ${i}`
    const fullName = `RASSIT - ${name} 1 UN`
    const product_brand = getRandomItem(productBrands.value)
    const product_category = getRandomItem(productCategories.value)
    const product_family = getRandomItem(productFamilies.value)
    const product_mkup = getRandomItem(productMkups.value)
    const cuit = 20324501364

    list.push({
      id,
      cuit,
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
      amount_content: '1.00',
      can_have_discount: 0,
      editable_name: 0,
      editable_price: 1,
      measurement_unit_id,
      weight: '0.00',
      volume: '0.00',
      cost_net: '330.58',
      cost_untaxed: '0.00',
      vat_id: 5,
      product_mkup_id: product_mkup.id,
      price_base: '1200.00',
      price_discounted: '0.00',
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
              name: 'Deposito Minimercado El 22',
              short_name: 'DM22',
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
              },
            },
          ],
        },
      ],
      price_lists: [],
      taxes: [],
      product_brand,
      measurement_unit: {
        id: measurement_unit_id,
        measurement_unit_id,
        name: 'Unidad',
        short_name: 'UN',
        deleted_at: null,
        created_at: null,
        updated_at: null,
      },
    })
  }

  return list
}
</script>
