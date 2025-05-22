<template>
  <div class="flex flex-col">
    <div class="w-full bg-blue-200 flex flex-col justify-center items-center gap-4 py-8" style="overflow: hidden;">
      <div class="w-1/2 flex flex-col justrify-center text-center">
        <KunAutocomplete v-model="testing" activator="parent" return-object :items="testProducts" item-title="name"
          item-text="name" :max-height="300" label="Seleccionar sucursal" :searchable-keys="['name']" />
      </div>

      <div class="w-1/2 flex flex-col justrify-center text-center mt-6">
        <KunTextField label="Etiqueta text field">
          <KunIcon :icon="IconASterisk" size="text-xs" class="pr-2"/>
        </KunTextField>
        <KunTextField label="Etiqueta text field" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import KunAutocomplete from './components/KunAutocomplete/src/components/KunAutocomplete.vue';
import KunTextField from './components/KunTextField/src/components/KunTextField.vue';
import KunIcon from './components/KunIcon/src/components/KunIcon.vue';
import IconASterisk from './icons/IconAsterisk.vue';

const testing = ref(null);
const testProducts = generateFakeProductsFull(50000);

function generateFakeProductsFull(count = 100) {
  const products = [];
  const now = new Date();

  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
      .toISOString();
  }

  for (let i = 1; i <= count; i++) {
    const id = 74980 + i;
    const product_variant_id = 26000 + i;
    const company_id = 36;
    const product_brand_id = 10883;
    const measurement_unit_id = 7;

    const created_at = randomDate(new Date(2023, 0, 1), now);
    const updated_at = randomDate(new Date(2024, 0, 1), now);

    const stockValue = (-30 - (i % 50)).toFixed(2);

    const name = `Producto Prueba ${i}`;
    const fullName = `RASSIT - ${name} 1 UN`;

    products.push({
      id,
      company_id,
      bar_code: "",
      sku: null,
      serial_number: null,
      status: 1,
      is_active_online: 1,
      is_composite: 0,
      composition: null,
      hasVariants: 0,
      hasStock: 0,
      product_category_id: 82,
      product_family_id: 665,
      product_brand_id,
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
      product_mkup_id: 39,
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
      product_brand: {
        id: product_brand_id,
        company_id,
        name: "RASSIT",
        deleted_at: null,
        created_at: "2024-03-25T15:36:30.000000Z",
        updated_at: "2024-03-25T15:36:30.000000Z"
      },
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

</script>