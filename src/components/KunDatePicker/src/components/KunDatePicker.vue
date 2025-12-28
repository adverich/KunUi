<template>
    <div class="relative w-full" ref="containerRef">
        <!-- Trigger Input -->
        <KunTextField
            ref="triggerRef"
            :model-value="displayInputValue"
            :label="label"
            :placeholder="placeholder"
            :disabled="disabled"
            readonly
            v-bind="$attrs"
            @handleClick="togglePopover"
            @click="togglePopover"
            @keydown.enter="togglePopover"
            @keydown.space="togglePopover"
            :class="['cursor-pointer', inputClass]"
            :error-message="errorMessage"
            :has-error="!!errorMessage"
            hide-details
        >
            <template #append-inner>
                <div class="cursor-pointer text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors" @click.stop="togglePopover">
                    <svg v-if="mode === 'time'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </template>
        </KunTextField>

        <!-- Popover Teleport -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
                <div
                    v-if="isOpen"
                    ref="popoverRef"
                    class="fixed shadow-2xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col font-sans select-none overflow-hidden"
                    :class="[dialogClass]"
                    :style="[popoverStyle, dimensionsStyle]"
                    @click.stop
                >
                    <!-- Header (Month/Year Navigation) -->
                    <div v-if="mode !== 'time'" class="px-2 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex-shrink-0">
                        <button type="button" class="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400" @click="changeMonth(-1)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <div class="font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1 rounded transition-colors text-center" @click="toggleViewMode">
                            {{ currentMonthName }} {{ currentYear }}
                        </div>
                        <button type="button" class="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400" @click="changeMonth(1)">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    <!-- Calendar Body (Scrollable if needed) -->
                    <!-- We set min-h-0 to allow flex container to shrink below content size if constrained by maxHeight -->
                    <div v-if="mode !== 'time'" class="flex-1 overflow-y-auto custom-scrollbar p-3 min-h-0">
                        <!-- Days View -->
                        <div v-if="viewMode === 'days'">
                            <div class="grid grid-cols-7 mb-2 text-center">
                                <span v-for="day in weekDays" :key="day" class="text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                    {{ day }}
                                </span>
                            </div>
                            <div class="grid grid-cols-7 gap-1">
                                <div v-for="(dateObj, index) in calendarDays" :key="index"
                                    class="relative flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer group"
                                    :style="{ width: daySize, height: daySize, fontSize: fontSize }"
                                    :class="dayClasses(dateObj)"
                                    @click="selectDay(dateObj)"
                                >
                                    {{ dateObj.day }}
                                </div>
                            </div>
                        </div>

                        <!-- Years View -->
                        <div v-else class="grid grid-cols-3 gap-2">
                            <div v-for="year in yearList" :key="year"
                                class="p-2 text-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors text-sm border border-transparent"
                                :class="{'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-bold': year === currentYear}"
                                @click="selectYear(year)"
                            >
                                {{ year }}
                            </div>
                        </div>
                    </div>
                            
                    <!-- Time Picker (Optional) -->
                    <div v-if="shouldShowTime" class="border-t border-slate-100 dark:border-slate-700 p-3 bg-slate-50/50 dark:bg-slate-800/50 grid grid-cols-3 gap-2 text-center flex-shrink-0">
                        <div class="flex flex-col items-center">
                                <KunNumberField 
                                    v-model="time.hours" 
                                    :min="0" :max="23" 
                                    @change="updateTime" 
                                    precision="0"
                                    text-center
                                    label="Hora"
                                    noArrows hide-details
                                    density="compact"
                                    placeholder="00"
                                />
                        </div>
                        <div class="flex flex-col items-center">
                                <KunNumberField 
                                    v-model="time.minutes" 
                                    :min="0" :max="59" 
                                    @change="updateTime" 
                                    precision="0"
                                    text-center
                                    label="Min"
                                    noArrows hide-details
                                    density="compact"
                                    placeholder="00"
                                />
                        </div>
                        <div v-if="enableSeconds" class="flex flex-col items-center">
                                <KunNumberField 
                                    v-model="time.seconds" 
                                    :min="0" :max="59" 
                                    @change="updateTime" 
                                    precision="0" 
                                    text-center
                                    label="Seg"
                                    noArrows hide-details
                                    density="compact"
                                    placeholder="00"
                                />
                        </div>
                    </div>

                    <!-- Actions Footer (Apply/Cancel) -->
                    <div v-if="!autoApply" class="p-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2 bg-white dark:bg-slate-800 flex-shrink-0">
                            <KunBtn @click="closePopover" size="xs">Cancelar</KunBtn>
                            <KunBtn @click="applySelection" size="xs" bgColor="bg-success">Aplicar</KunBtn>
                    </div>

                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch, provide, inject } from 'vue';
import KunTextField from '../../../KunTextField/src/components/KunTextField.vue';
import KunNumberField from '../../../KunNumberField/src/components/KunNumberField.vue';
import { usePosition } from '../composables/usePosition';
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';

// Props
const props = defineProps({
  modelValue: { type: [Date, Array, String], default: null },
  range: { type: Boolean, default: false },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' }, // Dynamic default handled in computed usually, or standard
  disabled: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' },

  // Logic
  autoApply: { type: Boolean, default: true },
  
  // Modes: 'date', 'datetime', 'time'
  mode: { type: String, default: 'date' }, 
  
  // Backwards compat / Overrides
  enableTime: { type: Boolean, default: false }, // If true implies datetime unless mode is set
  enableSeconds: { type: Boolean, default: false },
  
  minDate: { type: Date, default: null },
  maxDate: { type: Date, default: null },
  locale: { type: String, default: 'es-ES' },
  
  // Formatting
  valueFormat: { type: String, default: null }, // e.g., 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'HH:mm:ss'
  displayFormat: { type: String, default: null }, // Override display format

  // Styling & Layout
  width: { type: [String, Number], default: null },
  calendarWidth: { type: [String, Number], default: 320 },
  fullWidth: { type: Boolean, default: false }, 
  align: { type: String, default: 'left' }, 
  daySize: { type: String, default: '2rem' }, 
  fontSize: { type: String, default: '0.875rem' },
  maxHeight: { type: String, default: '400px' }, 
  
  inputClass: { default: '' },
  dialogClass: { default: '' },
});

const emit = defineEmits(['update:modelValue', 'change', 'close', 'open']);

// Global Click Manager
const instanceId = Math.random().toString(36).substr(2, 9);

// Refs
const containerRef = ref(null);
const triggerRef = ref(null);
const popoverRef = ref(null);
const isOpen = ref(false);
const viewMode = ref<'days' | 'years'>('days');

// Internal State
const tempValue = ref<Date | Date[] | null>(null);
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const time = ref({ hours: 0, minutes: 0, seconds: 0 });

// Helpers
function parseDateString(val: string, format: string): Date | null {
    // Simple parser for standard ISO-like formats
    // Check if format is provided, otherwise standard legacy parsing
    // Currently robust parsing without libs is tricky, assume ISO or basic 'YYYY-MM-DD' / 'HH:mm:ss'
    const d = new Date(val); // Try native first
    if (!isNaN(d.getTime())) return d;
    
    // Manual standard parse if native fails (browser dependent for some strings like 'YYYY-MM-DD HH:mm:ss')
    // Let's implement basic regex parser based on valueFormat tokens
    // Tokens: YYYY, MM, DD, HH, mm, ss
    
    // If we only implement standard ISO in valueFormat this is easier.
    // '2025-12-27', '03:30:00' (Time only needs dummy date)
    
    if (props.mode === 'time') {
       // Expect HH:mm or HH:mm:ss
       const parts = val.split(':');
       if (parts.length >= 2) {
           const now = new Date();
           now.setHours(parseInt(parts[0]) || 0, parseInt(parts[1]) || 0, parseInt(parts[2]) || 0, 0);
           return now;
       }
    }
    
    return null;
}

function formatDate(date: Date, format: string): string {
    const map: Record<string, string> = {
        YYYY: date.getFullYear().toString(),
        MM: String(date.getMonth() + 1).padStart(2, '0'),
        DD: String(date.getDate()).padStart(2, '0'),
        HH: String(date.getHours()).padStart(2, '0'),
        mm: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0'),
    };
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, matched => map[matched]);
}


// Initialization & Watchers
const effectiveMode = computed(() => {
    if (props.mode) return props.mode;
    if (props.enableTime) return 'datetime';
    return 'date';
});

const shouldShowTime = computed(() => {
    return effectiveMode.value === 'datetime' || effectiveMode.value === 'time' || props.enableTime;
});

const shouldEnableSeconds = computed(() => props.enableSeconds || (props.valueFormat && props.valueFormat.includes('ss')));

watch(() => props.modelValue, (val) => {
    initFromValue(val);
}, { immediate: true });

function initFromValue(val: any) {
    if (val) {
        if (props.range && Array.isArray(val) && val.length > 0) {
            tempValue.value = val.map(v => parser(v));
            const first = Array.isArray(tempValue.value) ? tempValue.value[0] : null;
            if (first instanceof Date) {
                currentMonth.value = first.getMonth();
                currentYear.value = first.getFullYear();
                if (shouldShowTime.value) extractTime(first);
            }
        } else {
            const d = parser(val);
            if (d instanceof Date) {
                tempValue.value = d;
                currentMonth.value = d.getMonth();
                currentYear.value = d.getFullYear();
                if (shouldShowTime.value) extractTime(d);
            }
        }
    } else {
        tempValue.value = null;
        const now = new Date();
        time.value = { hours: now.getHours(), minutes: now.getMinutes(), seconds: 0 };
    }
}

function parser(v: any): Date {
    if (v instanceof Date) return v;
    if (typeof v === 'string') {
        // Try native date constructor which handles ISO8601
        // If mode is time, we create a date today with that time
        if (effectiveMode.value === 'time') {
             const [h, m, s] = v.split(/[:\s]/).map(Number);
             const d = new Date();
             d.setHours(h || 0, m || 0, s || 0, 0);
             return d;
        }
        // Try replace space with T for ISO compatibility in some browsers if "YYYY-MM-DD HH:mm:ss"
        const iso = v.replace(' ', 'T');
        const d = new Date(iso);
        if (!isNaN(d.getTime())) return d;
    }
    return new Date(); // Fallback? Or null?
}

function extractTime(date: Date) {
    time.value = {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
    };
}

// Positioning
const { style: popoverStyle, update: updatePosition } = usePosition(triggerRef, popoverRef, { 
    offset: 8, 
    align: props.align 
});

const dimensionsStyle = computed(() => {
    let w = props.calendarWidth;
    if (props.fullWidth && triggerRef.value?.rootRef) {
       w = triggerRef.value.rootRef.getBoundingClientRect().width;
    }
    if (effectiveMode.value === 'time') {
        w = 200; // Smaller width for time only
    }
    return {
        width: typeof w === 'number' ? `${w}px` : w,
    };
});


// Display Logic
const currentMonthName = computed(() => new Date(currentYear.value, currentMonth.value).toLocaleString(props.locale, { month: 'long' }).replace(/^\w/, c => c.toUpperCase()));

const weekDays = computed(() => {
    const days = [];
    const d = new Date(2023, 0, 1); 
    while (d.getDay() !== 1) { d.setDate(d.getDate() + 1); }
    for (let i = 0; i < 7; i++) {
        days.push(d.toLocaleString(props.locale, { weekday: 'narrow' }).replace('.', ''));
        d.setDate(d.getDate() + 1);
    }
    return days;
});

const displayInputValue = computed(() => {
    if (!props.modelValue) return '';
    
    // Formatting for Display
    const dateOpts: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: shouldEnableSeconds.value ? '2-digit' : undefined };
    
    // If displayFormat provided, use manual formatting logic
    const manualFormat = (d: Date) => {
        if (props.displayFormat) return formatDate(d, props.displayFormat);
        
        // Defaults based on mode
        let str = '';
        if (effectiveMode.value !== 'time') str += d.toLocaleDateString(props.locale, dateOpts);
        if (effectiveMode.value === 'datetime') str += ' ' + d.toLocaleTimeString(props.locale, timeOpts);
        if (effectiveMode.value === 'time') str = d.toLocaleTimeString(props.locale, timeOpts);
        return str;
    };

    if (props.range && Array.isArray(props.modelValue)) {
        // Range usually assumes same format for start/end
        const start = props.modelValue[0] ? manualFormat(parser(props.modelValue[0])) : '';
        const end = props.modelValue[1] ? manualFormat(parser(props.modelValue[1])) : '';
        
        if (!start) return '';
        if (!end) return `${start} ~ ...`;
        return `${start} ~ ${end}`;
    }
    
    return manualFormat(parser(props.modelValue));
});

// Calendar Logic
const calendarDays = computed(() => {
    if (effectiveMode.value === 'time') return [];
    
    const year = currentYear.value;
    const month = currentMonth.value;
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev Month
    for (let i = 0; i < startOffset; i++) {
        days.push({
            day: daysInPrevMonth - startOffset + i + 1,
            date: new Date(year, month - 1, daysInPrevMonth - startOffset + i + 1),
            isCurrentMonth: false
        });
    }

    // Current Month
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            day: i,
            date: new Date(year, month, i),
            isCurrentMonth: true
        });
    }

    // Next Month
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({
            day: i,
            date: new Date(year, month + 1, i),
            isCurrentMonth: false
        });
    }
    return days;
});

const yearList = computed(() => {
    const years = [];
    const current = new Date().getFullYear();
    for (let i = current - 100; i <= current + 20; i++) {
        years.push(i);
    }
    return years.reverse();
});


// Actions
function togglePopover() {
    if (props.disabled) return;
    if (isOpen.value) closePopover();
    else openPopover();
}

function openPopover() {
    window.dispatchEvent(new CustomEvent('kun:datepicker:open', { detail: { id: instanceId } }));
    isOpen.value = true;
    initFromValue(props.modelValue);
    emit('open');
    nextTick(() => {
        updatePosition();
    });
}

function closePopover() {
    isOpen.value = false;
    emit('close');
}

function handleOtherOpen(e: Event) {
    const detail = (e as CustomEvent).detail;
    if (detail.id !== instanceId && isOpen.value) {
        closePopover();
    }
}

function clickOutside(e: MouseEvent) {
    if (!isOpen.value) return;
    const target = e.target as HTMLElement;
    if (popoverRef.value && popoverRef.value.contains(target)) return;
    if (triggerRef.value && ((triggerRef.value.rootRef && triggerRef.value.rootRef.contains(target)) || (triggerRef.value.$el && triggerRef.value.$el.contains(target)))) return;
    closePopover();
}

onMounted(() => {
    document.addEventListener('click', clickOutside, true); 
    window.addEventListener('kun:datepicker:open', handleOtherOpen);
});
onUnmounted(() => {
    document.removeEventListener('click', clickOutside, true);
    window.removeEventListener('kun:datepicker:open', handleOtherOpen);
});

// Date Manipulation
function changeMonth(delta: number) {
    let newMonth = currentMonth.value + delta;
    if (newMonth > 11) {
        newMonth = 0;
        currentYear.value++;
    } else if (newMonth < 0) {
        newMonth = 11;
        currentYear.value--;
    }
    currentMonth.value = newMonth;
}

function toggleViewMode() {
    viewMode.value = viewMode.value === 'days' ? 'years' : 'days';
}

function selectYear(year: number) {
    currentYear.value = year;
    viewMode.value = 'days';
}

function mergeTime(date: Date) {
    const d = new Date(date);
    if (effectiveMode.value === 'time' || effectiveMode.value === 'datetime' || props.enableTime) {
        d.setHours(time.value.hours || 0);
        d.setMinutes(time.value.minutes || 0);
        d.setSeconds(time.value.seconds || 0);
    } else {
        d.setHours(0, 0, 0, 0); 
    }
    return d;
}

function selectDay(dateObj: any) {
    const selectedDate = mergeTime(dateObj.date);

    if (props.range) {
        let current = Array.isArray(tempValue.value) ? [...tempValue.value] : [];
        if (current.length === 2) current = []; // Reset on restart
        if (current.length === 0) {
            current = [selectedDate];
        } else if (current.length === 1) {
            let start = current[0] as Date;
            let end = selectedDate;
            if (end < start) [start, end] = [end, start];
            current = [start, end];
        }
        tempValue.value = current;
        if (props.autoApply && current.length === 2 && !shouldShowTime.value) {
            applySelection();
        }
    } else {
        tempValue.value = selectedDate;
        if (props.autoApply && !shouldShowTime.value) {
            applySelection();
        }
    }
}

function updateTime() {
    let base = tempValue.value instanceof Date ? tempValue.value : new Date();
    // If tempValue is null, we can assume Today as base?
    if (!tempValue.value && effectiveMode.value === 'time') {
         // Time mode defaults to today + time
         base = new Date();
    }
    
    const d = mergeTime(base);
    // If not range, update tempValue
    if (!props.range) {
        tempValue.value = d;
        // If it's time mode and autoApply, should we emit?
        // Usually time pickers don't auto-close on every minute change, but we could update model.
    }
}

function getValueToEmit() {
    const val = tempValue.value;
    if (!val) return null;

    const formatter = (d: Date) => {
        if (props.valueFormat) return formatDate(d, props.valueFormat);
        return d;
    };

    if (Array.isArray(val)) {
        return val.map(d => formatter(d));
    }
    return formatter(val as Date);
}

function applySelection() {
    // If Time Mode, ensure we have a valid tempValue
    if (effectiveMode.value === 'time' && !tempValue.value) {
        // If parsed input was empty, maybe init default?
        // Or if user just moved spinners without picking a date (impossible in time mode as there is no date grid)
        // We set Today + time
        updateTime();
    } else if (shouldShowTime.value && tempValue.value && !Array.isArray(tempValue.value)) {
        // Merge final time state
        tempValue.value = mergeTime(tempValue.value as Date);
    }

    const output = getValueToEmit();
    
    emit('update:modelValue', output);
    emit('change', output);
    closePopover();
}

// Styling
function dayClasses(dayObj: any) {
    const { date, isCurrentMonth } = dayObj;
    const now = new Date();
    const isToday = isSameDay(date, now);
    
    let isSelected = false;
    let inRange = false;

    const val = tempValue.value; 

    // Visual comparison uses Dates logic, tempValue might be Dates here from initFromValue
    
    // Helper to extract date part only for comparison
    const same = (a: any, b: Date) => {
        if (!(a instanceof Date)) return false; 
        return isSameDay(a, b);
    }

    if (props.range && Array.isArray(val)) {
        const [start, end] = val;
        if (start && same(start, date)) isSelected = true;
        if (end && same(end, date)) isSelected = true;
        if (start && end && start instanceof Date && end instanceof Date && date > start && date < end) inRange = true;
    } else if (!props.range && val instanceof Date) {
        if (same(val, date)) isSelected = true;
    }

    const base = 'flex items-center justify-center font-medium text-sm z-10'; 
    const text = !isCurrentMonth ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200';
    
    if (isSelected) {
        return `${base} bg-blue-600 text-white shadow-md hover:bg-blue-700 rounded-full`;
    }
    if (inRange) {
        return `${base} bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-none`;
    }
    
    const hover = 'hover:bg-slate-100 dark:hover:bg-slate-700';
    const todayBorder = isToday ? 'border border-blue-500 text-blue-600 dark:text-blue-400 font-bold' : '';

    return `${base} ${text} ${hover} ${todayBorder}`;
}

function isSameDay(d1: Date, d2: Date) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #475569;
}

/* Transitions */
.scale-95 { transform: scale(0.95); }
.scale-100 { transform: scale(1); }
</style>
