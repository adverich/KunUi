<template>
  <div class="h-full w-full overflow-y-auto p-10 bg-default dark:bg-elevated text-default dark:text-default">
    <div class="max-w-4xl mx-auto flex flex-col gap-8">
        <h1 class="text-3xl font-bold text-primary dark:text-primary">KunDatePicker V3 Demo</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Basic Date (YYYY-MM-DD) -->
            <section class="p-6 bg-elevated rounded-lg shadow-sm ring ring-default">
                <h2 class="text-xl font-semibold mb-4">Solo Fecha (String)</h2>
                <KunDatePicker
                    v-model="dateStr"
                    label="Fecha de Inicio"
                    value-format="YYYY-MM-DD"
                    placeholder="YYYY-MM-DD"
                />
                <div class="mt-2 text-xs text-muted font-mono bg-muted p-2 rounded-md">
                    Result: {{ dateStr }} ({{ typeof dateStr }})
                </div>
            </section>

             <!-- Date + Time (YYYY-MM-DD HH:mm:ss) -->
             <section class="p-6 bg-elevated rounded-lg shadow-sm ring ring-default">
                <h2 class="text-xl font-semibold mb-4">Fecha y Hora (String)</h2>
                <KunDatePicker
                    v-model="dateTimeStr"
                    label="Fecha y Hora"
                    mode="datetime"
                    enableSeconds
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :auto-apply="false"
                />
                <div class="mt-2 text-xs text-muted font-mono bg-muted p-2 rounded-md">
                    Result: {{ dateTimeStr }}
                </div>
            </section>

             <!-- Time Only (HH:mm:ss) -->
             <section class="p-6 bg-elevated rounded-lg shadow-sm ring ring-default">
                <h2 class="text-xl font-semibold mb-4">Solo Hora (String)</h2>
                <KunDatePicker
                    v-model="timeStr"
                    label="Hora de Inicio"
                    mode="time"
                    enableSeconds
                    value-format="HH:mm:ss"
                    :auto-apply="false"
                />
                <div class="mt-2 text-xs text-muted font-mono bg-muted p-2 rounded-md">
                    Result: {{ timeStr }}
                </div>
            </section>

            <!-- Range (YYYY-MM-DD) -->
            <section class="p-6 bg-elevated rounded-lg shadow-sm ring ring-default">
                <h2 class="text-xl font-semibold mb-4">Rango (Array Strings)</h2>
                <KunDatePicker
                    v-model="rangeStr"
                    range
                    value-format="YYYY-MM-DD"
                    label="Rango"
                />
                 <div class="mt-2 text-xs text-muted font-mono bg-muted p-2 rounded-md">
                    Result: {{ rangeStr }}
                 </div>
            </section>

            <!-- Icon-only trigger -->
            <section class="p-6 bg-elevated rounded-lg shadow-sm ring ring-default">
                <h2 class="text-xl font-semibold mb-4">Activador de solo ícono</h2>
                <KunDatePicker
                    v-model="iconDate"
                    only-icon
                    label="Seleccionar fecha"
                    value-format="YYYY-MM-DD"
                    title="Abrir selector de fecha"
                />
                <div class="mt-2 text-xs text-muted font-mono bg-muted p-2 rounded-md">
                    Result: {{ iconDate }}
                </div>
            </section>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { KunDatePicker } from '../index.js';

const dateStr = ref('2025-12-27');
const dateTimeStr = ref(null);
const timeStr = ref('03:30:00');
const rangeStr = ref([]);
const iconDate = ref(null);
</script>
