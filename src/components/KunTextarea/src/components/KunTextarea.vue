<template>
  <div :class="wrapperClasses" ref="rootRef" v-bind="restAttrs">
    <!-- Label (variantes no outline: posición contra el wrapper) -->
    <slot v-if="!isOutline" name="label" :for="uid" v-bind="labelSlotBindings">
      <label
        v-if="label"
        :for="uid"
        class="absolute transition-all duration-200 ease-in-out pointer-events-none select-none z-10"
        :class="[fieldTextColorClass, labelLeftClass, labelPositionClass]"
      >
        {{ label }}
      </label>
    </slot>

    <div class="relative ">

      <!-- Prepend Icon -->
      <div v-if="prependIcon || $slots.prepend" class="absolute left-2 top-2 flex items-center z-10">
        <slot name="prepend" v-bind="prependSlotBindings">
          <div @click="handleIconClick($event, 'prepend')">
            <component :is="renderIconSlot(prependIcon)" />
          </div>
        </slot>
      </div>

      <!-- Prepend-inner Icon -->
      <div v-if="prependInnerIcon || $slots['prepend-inner']" class="absolute left-2 top-2 ml-1 z-10">
        <slot name="prepend-inner">
          <div @click="handleIconClick($event, 'prependInner')">
            <component :is="renderIconSlot(prependInnerIcon)" />
          </div>
        </slot>
      </div>

      <!-- Variante outline: el textarea lleva borde transparente propio (métricas),
           un overlay dibuja el borde con muesca medida (sin fieldset/legend:
           idéntico en todos los navegadores), y el label flota sobre el hueco. -->
      <template v-if="isOutline">
        <div
          aria-hidden="true"
          data-kun-notch="KunTextarea"
          ref="overlayRef"
          class="absolute inset-0 pointer-events-none border bg-transparent transition-colors duration-150"
          :class="[fieldsetRoundedClass, notchBorderClass]"
          :style="notchMaskStyle"
        />
        <slot name="label" :for="uid" v-bind="labelSlotBindings">
          <label
            ref="labelRef"
            v-if="label && !$slots.label"
            :for="uid"
            :style="labelShiftStyle"
            class="absolute transition-all duration-200 ease-in-out pointer-events-none select-none z-10"
            :class="[fieldTextColorClass, labelLeftClass, labelPositionClass]"
          >
            {{ label }}
          </label>
        </slot>
      </template>

      <!-- Textarea (outline: borde transparente, el visible lo da el fieldset) -->
      <textarea
        v-if="isOutline"
        ref="textareaRef"
        :id="uid"
        :value="internalValue"
        :rows="rows"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :maxlength="maxLength"
        @input="handleInput"
        @change="handleChange"
        @animationstart="handleAnimationStart"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleJsonEnter"
        @click="$emit('click:control', $event)"
        @mousedown="$emit('mousedown:control', $event)"
        class="bg-transparent border border-transparent"
        :class="[fieldTextColorClass, textareaOutlinedInnerClasses]"
        style="width: 100%; box-sizing: border-box;"
        :style="autoGrow ? 'overflow-y: hidden;' : 'overflow-y: auto;'"
      ></textarea>

      <!-- Textarea (variantes no outline: con su propio borde/fondo) -->
      <textarea
        v-else
        ref="textareaRef"
        :id="uid"
        :value="internalValue"
        :rows="rows"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :maxlength="maxLength"
        @input="handleInput"
        @change="handleChange"
        @animationstart="handleAnimationStart"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown.enter="handleJsonEnter"
        @click="$emit('click:control', $event)"
        @mousedown="$emit('mousedown:control', $event)"
        :class="[fieldTextColorClass, textareaClasses]"
        style="width: 100%; box-sizing: border-box;"
        :style="autoGrow ? 'overflow-y: hidden;' : 'overflow-y: auto;'"
      ></textarea>

      <!-- Clear -->
      <div
        v-if="clearable && internalValue"
        class="absolute right-2 top-2"
        :class="clearIconClasses"
      >
        <slot name="clear" v-bind="clearSlotBindings">
          <button type="button" @click="handleClear" class="text-muted hover:text-default" v-if="clearIcon">
            <component :is="renderIconSlot(clearIcon)" />
          </button>
        </slot>
      </div>

      <!-- Append-inner Icon -->
      <div v-if="appendInnerIcon || $slots['append-inner']" class="absolute right-2 top-2 mr-1">
        <slot name="append-inner">
          <div @click="handleIconClick($event, 'appendInner')">
            <component :is="renderIconSlot(appendInnerIcon)" />
          </div>
        </slot>
      </div>

      <!-- Append Icon -->
      <div v-if="appendIcon || $slots.append" class="absolute right-2 top-2 flex items-center">
        <slot name="append" v-bind="appendSlotBindings">
          <div @click="handleIconClick($event, 'append')">
            <component :is="renderIconSlot(appendIcon)" />
          </div>
        </slot>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="mt-1">
        <slot name="loader" :color="loadingColor" :isActive="true">
          <div class="h-1 w-full bg-muted rounded-md overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              :class="[loadingColor]"
              style="width: 100%"
            />
          </div>
        </slot>
      </div>

      <!-- Details -->
      <div
        v-if="!hideDetails || (hideDetails === 'auto' && (displayedMessages.length || hint))"
        class="text-xs mt-1 space-y-1"
        :class="{ 'text-error': hasError, 'text-muted': !hasError }"
      >
        <slot name="details">
          <template v-if="hasError">
            <template v-for="(msg, i) in displayedMessages" :key="i">
              <slot name="message" :message="msg">
                <div>{{ msg }}</div>
              </slot>
            </template>
          </template>
          <template v-else-if="hint">
            <slot name="hint" :hint="hint">
              <div v-show="persistentHint || isFocused">{{ hint }}</div>
            </slot>
          </template>
        </slot>
      </div>

      <!-- Counter -->
      <div v-if="counterVisible" class="text-xs text-right mt-1 text-muted">
        <slot name="counter" :counter="valueLength" :max="counterMax" :value="valueLength">
          {{ valueLength }}<span v-if="counterMax"> / {{ counterMax }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAttrs, computed, ref, useId, useSlots, nextTick, type Ref } from 'vue'
import { kunTextareaProps } from '../composables/kunTextareaProps.js'
import useTextarea from '../composables/useKunTextareaComposable.js'
import { resolveKunColor, resolveKunVariant, type KunColor, type KunVariant } from '../../../../theme/kunVariants.js'
import {
  kunFieldBaseClass,
  kunFieldTextClass,
  KUN_FIELD_FOCUS_BORDER,
  KUN_FIELD_ERROR_RING,
  KUN_FIELD_FOCUS_RING,
} from '@/utils/kunFieldVariant.js'
import { isAutofillAnimation } from '@/utils/kunAutofill.js'
import { renderIconSlot } from '@/utils/renderIcon.js'
import { useKunFieldNotch } from '@/utils/useKunFieldNotch.js'
import { debounce } from '@/utils/utils.js';

const props = defineProps({ ...kunTextareaProps })
const emits = defineEmits(['update:modelValue', 'click:clear', 'click:control', 'update:focused', 'mousedown:control'])
const attrs = useAttrs()

// Color/variante canónicos: prop > theme.defaults.input > (primary, outline).
const resolvedColor = computed<KunColor>(() => resolveKunColor(props.color ?? null, 'input'))
const resolvedVariant = computed<KunVariant>(() => resolveKunVariant(props.variant, 'input'))
// Solo `outline` lleva label flotante con muesca (borde transparente propio).
const isOutline = computed(() => resolvedVariant.value === 'outline')
const fieldTextColorClass = computed(() => kunFieldTextClass(resolvedVariant.value, resolvedColor.value))

const textareaRef: Ref<HTMLTextAreaElement | null> = ref(null)
const uid = props.id || `textarea-${useId()}`

const {
  isFocused,
  internalValue,
  updateModel,
  syncFromDom,
  validate,
  reset,
  resetValidation,
  hasError,
  displayedMessages,
  adjustHeight,
  handleJsonEnter,
  isLocalChange,
} = useTextarea(props, emits, textareaRef)

// Iconos laterales: re-emiten como click de control (antes no hacían nada)
function handleIconClick(e: MouseEvent, position: string): void {
  emits('click:control', e, position)
}

function handleClear(): void {
  updateModel('')
  emits('click:clear')
}

// Función para guardar/restaurar la posición del cursor
interface CursorPos { start: number; end: number }
const saveCursor = (): CursorPos | null => {
  const el = textareaRef.value
  return el ? { start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 } : null
}

const restoreCursor = (pos: CursorPos | null): void => {
  const el = textareaRef.value
  if (el && pos !== null) {
    el.setSelectionRange(pos.start, pos.end)
  }
}

// Funciones para guardar/restaurar scroll de contenedores padres
interface ScrollPos { el: Element | Window; scrollTop: number }
const saveScrollPositions = (): ScrollPos[] => {
  const positions: ScrollPos[] = []
  let el = textareaRef.value?.parentElement as Element | null | undefined
  while (el) {
    if (el.scrollHeight > el.clientHeight) {
      positions.push({ el, scrollTop: el.scrollTop })
    }
    el = el.parentElement
  }
  positions.push({ el: window, scrollTop: window.scrollY || window.pageYOffset })
  return positions
}

const restoreScrollPositions = (positions: ScrollPos[]): void => {
  positions.forEach(({ el, scrollTop }: ScrollPos) => {
    if (el === window) {
      (el as Window).scrollTo(0, scrollTop)
    } else {
      (el as Element).scrollTop = scrollTop
    }
  })
}

const handleInput = (e: Event): void => {
  const target = e.target as HTMLTextAreaElement
  const value = target.value
  const cursorPos = { start: target.selectionStart ?? 0, end: target.selectionEnd ?? 0 }
  const scrollState = saveScrollPositions()

  isLocalChange.value = true

  // Ajustar altura preservando scroll y cursor
  if (props.autoGrow) {
    requestAnimationFrame(() => {
      adjustHeight()
      restoreCursor(cursorPos)
      restoreScrollPositions(scrollState)
    })
  }

  debouncedUpdateModel(value)
}

const debouncedUpdateModel = debounce((val: unknown) => {
  updateModel(val)
}, Number(props.debounceTime ?? 300))

const handleFocus = () => {
  // Por si el navegador rellenó sin eventos (autofill): el padre recibe el
  // valor ahora.
  syncFromDom()
  isFocused.value = true
  emits('update:focused', true)
}

const handleBlur = () => {
  // Sincronizar antes de apagar el foco para que el label quede arriba si hay
  // texto autocompletado.
  syncFromDom()
  isFocused.value = false
  emits('update:focused', false)
}

// Chrome dispara `change` (pero no `input`) al autocompletar.
const handleChange = () => {
  syncFromDom()
}

// `animationstart` de `kun-autofill-*` (ver `style.css`): autofill de WebKit.
const handleAnimationStart = (e: Event) => {
  if (!isAutofillAnimation(e)) return
  nextTick(() => {
    syncFromDom()
  })
}

const isActive = computed(() => isFocused.value || !!internalValue.value || props.dirty)
const isSingleRow = computed(() => Number(props.rows) === 1)
const labelPositionClass = computed(() => {
  if (isActive.value || props.placeholder) return 'top-[-2px] -translate-y-1/2 text-xs opacity-80'
  // Con 1 fila se centra verticalmente como KunTextField; con más filas se ancla arriba
  if (isSingleRow.value) return 'top-1/2 -translate-y-1/2 text-sm opacity-80'
  return 'top-3 text-sm opacity-80'
})
const isLabelFloating = computed(() => isActive.value || !!props.placeholder)
const slots = useSlots()
const labelLeftClass = computed(() => {
  if (isLabelFloating.value) return 'left-2'
  if (props.prependInnerIcon || props.prependIcon || slots['prepend-inner'] || slots.prepend) return 'left-10'
  return 'left-2'
})
const valueLength = computed(() => (typeof internalValue.value === 'string' ? internalValue.value.length : 0))
const counterMax = computed(() => (props.counter === true ? 25 : props.counter || null))
const counterVisible = computed(() => props.persistentCounter || (props.counter && isFocused.value))

const wrapperClasses = computed(() => ['relative w-full flex flex-col', props.class, props.wrapperClass])
const clearIconClasses = computed(() =>
  props.persistentClear ? 'opacity-100' : 'hover:opacity-100 opacity-0 transition-opacity duration-200'
)

// Fondo/estructura de reposo por variante (tokens de superficie, nunca
// interpolados) + estado de foco/error con ring literal por color. En
// `outline` el borde visible lo dibuja el overlay (`notchBorderClass`).
const fieldBaseClass = computed(() => kunFieldBaseClass(resolvedVariant.value, resolvedColor.value, { overlayBorder: true }))
const fieldStateClass = computed(() => {
  if (props.disabled) return ''
  if (hasError.value) return KUN_FIELD_ERROR_RING
  if (isFocused.value) return KUN_FIELD_FOCUS_RING[resolvedColor.value]
  return ''
})

const densityClass = computed(() =>
  // Misma escala que KunTextField para que rows="1" iguale su alto (1 línea)
  props.density === 'compact' ? 'px-2 py-1 text-sm min-h-[30px]' : props.density === 'comfortable' ? 'px-3 py-2 text-sm min-h-[38px]' : 'px-3 py-3 text-sm min-h-[46px]'
)

const textAlignClass = computed(() => {
  const alignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return alignMap[props.textAlign as string] || 'text-left'
})

const textareaClasses = computed(() => [
  'block w-full resize-none transition-colors duration-150 leading-normal',
  textAlignClass.value,
  props.inputClass,
  fieldsetRoundedClass.value,
  {
    'text-disabled': props.disabled,
    'focus:outline-none focus:ring-1': !props.disabled,
    'resize-none': props.noResize || props.autoGrow,
    'resize': !props.noResize && !props.autoGrow,
  },
  fieldBaseClass.value,
  fieldStateClass.value,
  densityClass.value,
])

// Redondeo del fieldset (outline): replica la lógica del textarea para que
// el borde con notch herede `tile` / `rounded`.
const fieldsetRoundedClass = computed(() => {
  if (props.tile) return 'rounded-none'
  return props.rounded || 'rounded-md'
})

// Clases del textarea en variante `outline`: borde transparente propio
// (métricas), tipografía, densidad y foco. El borde visible (con muesca) lo
// dibuja el overlay (hermano posterior en el DOM, pinta encima).
const textareaOutlinedInnerClasses = computed(() => [
  'block w-full resize-none transition-colors duration-150 leading-normal',
  textAlignClass.value,
  props.inputClass,
  fieldsetRoundedClass.value,
  {
    'text-disabled': props.disabled,
    'focus:outline-none': !props.disabled,
    'resize-none': props.noResize || props.autoGrow,
    'resize': !props.noResize && !props.autoGrow,
  },
  densityClass.value,
])

// Muesca del borde (`outline`) + desplazamiento del label (ver `useKunFieldNotch`).
// `roundedClass` es la clase resuelta del overlay (`fieldsetRoundedClass`).
const { labelRef, overlayRef, notchMaskStyle, labelShiftStyle } = useKunFieldNotch(
  {
    isFloating: () => isLabelFloating.value,
    hasLabel: () => props.label,
    labelLeftClass: () => labelLeftClass.value,
    roundedClass: () => fieldsetRoundedClass.value,
  },
  [() => props.variant]
);
// Color del borde del overlay: error > foco (color resuelto) > reposo accent.
const notchBorderClass = computed(() => {
  if (hasError.value) return 'border-error'
  if (isFocused.value && !props.disabled) return KUN_FIELD_FOCUS_BORDER[resolvedColor.value]
  return 'border-accented'
})

const labelSlotBindings = {
  label: props.label,
  isFocused,
  isActive,
  controlRef: textareaRef,
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  props,
}
const clearSlotBindings = {
  isActive: !!internalValue.value,
  isFocused,
  controlRef: textareaRef,
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  props,
}
const prependSlotBindings = clearSlotBindings
const appendSlotBindings = clearSlotBindings

const restAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

defineExpose({
  validate,
  reset,
  resetValidation,
  errorMessages: displayedMessages,
  isValid: computed(() => !hasError.value),
  focus: () => textareaRef.value?.focus(),
  rootRef: textareaRef,
})
</script>

