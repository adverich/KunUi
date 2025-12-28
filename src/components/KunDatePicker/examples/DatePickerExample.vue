<template>
  <div class="h-full w-full overflow-y-auto p-10 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
    <div class="max-w-4xl mx-auto flex flex-col gap-8">
        <h1 class="text-3xl font-bold text-blue-600 dark:text-blue-400">KunDatePicker V3 Demo</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Basic Date (YYYY-MM-DD) -->
            <section class="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 class="text-xl font-semibold mb-4">Solo Fecha (String)</h2>
                <KunDatePicker
                    v-model="dateStr"
                    label="Fecha de Inicio"
                    value-format="YYYY-MM-DD"
                    placeholder="YYYY-MM-DD"
                />
                <div class="mt-2 text-xs text-slate-500 font-mono bg-slate-100 p-2 rounded">
                    Result: {{ dateStr }} ({{ typeof dateStr }})
                </div>
            </section>

             <!-- Date + Time (YYYY-MM-DD HH:mm:ss) -->
             <section class="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 class="text-xl font-semibold mb-4">Fecha y Hora (String)</h2>
                <KunDatePicker
                    v-model="dateTimeStr"
                    label="Fecha y Hora"
                    mode="datetime"
                    enableSeconds
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :auto-apply="false"
                />
                <div class="mt-2 text-xs text-slate-500 font-mono bg-slate-100 p-2 rounded">
                    Result: {{ dateTimeStr }}
                </div>
            </section>

             <!-- Time Only (HH:mm:ss) -->
             <section class="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 class="text-xl font-semibold mb-4">Solo Hora (String)</h2>
                <KunDatePicker
                    v-model="timeStr"
                    label="Hora de Inicio"
                    mode="time"
                    enableSeconds
                    value-format="HH:mm:ss"
                    :auto-apply="false"
                />
                <div class="mt-2 text-xs text-slate-500 font-mono bg-slate-100 p-2 rounded">
                    Result: {{ timeStr }}
                </div>
            </section>

            <!-- Range (YYYY-MM-DD) -->
            <section class="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 class="text-xl font-semibold mb-4">Rango (Array Strings)</h2>
                <KunDatePicker
                    v-model="rangeStr"
                    range
                    value-format="YYYY-MM-DD"
                    label="Rango"
                />
                 <div class="mt-2 text-xs text-slate-500 font-mono bg-slate-100 p-2 rounded">
                    Result: {{ rangeStr }}
                 </div>
            </section>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { KunDatePicker } from '../index.js';

const dateStr = ref('2025-12-27');
const dateTimeStr = ref(null);
const timeStr = ref('03:30:00');
const rangeStr = ref([]);
</script>
