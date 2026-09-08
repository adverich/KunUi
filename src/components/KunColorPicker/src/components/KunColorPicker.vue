<template>
  <div ref="rootRef" class="relative w-full">
    <label v-if="label" class="mb-1 block text-sm font-medium text-ui">{{ label }}</label>

    <button
      ref="triggerRef"
      type="button"
      class="flex w-full items-center gap-3 rounded-lg border border-ui bg-field-background px-3 py-2 text-left text-ui transition-colors hover:border-ui-focus focus:outline-none focus:ring-2 focus:ring-ui-focus disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="disabled"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      @click="isOpen = !isOpen"
    >
      <span class="checkerboard h-7 w-7 shrink-0 overflow-hidden rounded-md border border-ui-subtle">
        <span class="block h-full w-full" :style="{ backgroundColor: selectedColor }" />
      </span>
      <span class="min-w-0 flex-1 truncate font-mono text-sm">{{ displayValue }}</span>
      <svg class="h-4 w-4 shrink-0 text-ui-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.09 1.04l-4.25 4.5a.75.75 0 01-1.09 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="panelRef"
        class="fixed z-250 w-90 max-w-[calc(100vw-16px)] overflow-y-auto rounded-xl border border-ui bg-ui-surface-raised p-4 shadow-xl"
        :style="popoverStyle"
        role="dialog"
        aria-label="Selector de color"
      >
      <div v-if="showPreview" class="mb-4 grid grid-cols-2 gap-3">
        <div>
          <span class="mb-1 block text-xs text-ui-muted">Original</span>
          <div class="checkerboard overflow-hidden rounded-lg border border-ui-subtle p-1">
            <div class="h-10 rounded-md" :style="{ backgroundColor: resetColor }" />
          </div>
          <span class="mt-1 block truncate font-mono text-xs text-ui-muted">{{ resetColor }}</span>
        </div>
        <div>
          <span class="mb-1 block text-xs text-ui-muted">Seleccionado</span>
          <div class="checkerboard overflow-hidden rounded-lg border border-ui-subtle p-1">
            <div class="h-10 rounded-md" :style="{ backgroundColor: selectedColor }" />
          </div>
          <span class="mt-1 block truncate font-mono text-xs text-ui-muted">{{ displayValue }}</span>
        </div>
      </div>

      <div class="mb-3 flex items-center gap-3">
        <input
          class="h-11 w-14 cursor-pointer rounded border border-ui bg-transparent p-0.5 disabled:cursor-not-allowed"
          type="color"
          :value="hexColor"
          :disabled="disabled || isTransparent"
          aria-label="Color"
          @input="updateHex($event.target.value)"
        >
        <input
          class="min-w-0 flex-1 rounded-lg border border-ui bg-field-background px-3 py-2 font-mono text-sm text-ui outline-none focus:border-ui-focus focus:ring-1 focus:ring-ui-focus"
          :value="formattedValue"
          :placeholder="placeholder"
          :disabled="disabled || isTransparent"
          :aria-label="`Valor ${activeColorType} del color`"
          @change="updateFromColorInput($event.target.value)"
          @keyup.enter="updateFromColorInput($event.target.value)"
        >
        <select
          v-if="colorType === 'all'"
          v-model="selectedFormat"
          class="cursor-pointer rounded-lg border border-ui bg-field-background px-2 py-2 font-mono text-sm text-ui outline-none focus:border-ui-focus focus:ring-1 focus:ring-ui-focus"
          aria-label="Formato de color"
        >
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
          <option value="hsl">HSL</option>
        </select>
      </div>

      <div class="mb-4 flex items-center gap-2 text-sm text-ui">
        <input id="transparent-checkbox" class="cursor-pointer disabled:cursor-not-allowed" type="checkbox" :checked="isTransparent" :disabled="disabled || !allowTransparent" @change="toggleTransparency($event.target.checked)">
        <label for="transparent-checkbox" class="cursor-pointer select-none">Transparente</label>
      </div>

      <div class="mb-4" :class="{ 'opacity-50': isTransparent }">
        <div class="mb-1 flex justify-between text-xs text-ui-muted">
          <span>Opacidad</span><span>{{ alphaPercent }}%</span>
        </div>
        <input
          class="w-full cursor-pointer accent-ui-primary disabled:cursor-not-allowed"
          type="range"
          min="0"
          max="100"
          :value="alphaPercent"
          :disabled="disabled || isTransparent"
          aria-label="Opacidad"
          @input="updateAlpha($event.target.value)"
        >
      </div>

      <div class="flex justify-end gap-2 border-t border-ui-subtle pt-3">
        <button type="button" class="rounded-md px-3 py-1.5 text-sm text-ui hover:bg-ui-hover disabled:opacity-50" :disabled="disabled" @click="isOpen = false">Cerrar</button>
        <button v-if="resettable" type="button" class="rounded-md px-3 py-1.5 text-sm text-ui hover:bg-ui-hover disabled:opacity-50" :disabled="disabled" @click="reset">Restablecer</button>
      </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { kunColorPickerProps } from '../composables/kunColorPickerProps'

const props = defineProps(kunColorPickerProps)
const emit = defineEmits(['update:modelValue', 'change', 'reset', 'open', 'close'])

const rootRef = ref(null)
const panelRef = ref(null)
const triggerRef = ref(null)
const isOpen = ref(false)
const initialColor = ref(props.modelValue || '#000000')
const selectedColor = ref(normalizeColor(props.modelValue))
const lastOpaqueColor = ref(colorToHex(selectedColor.value))
const selectedFormat = ref(inferColorType(props.modelValue))
const popoverStyle = ref({ visibility: 'hidden' })

const resetColor = computed(() => normalizeColor(props.originalColor ?? initialColor.value))
const parsedColor = computed(() => parseColor(selectedColor.value))
const hexColor = computed(() => rgbToHex(parsedColor.value))
const activeColorType = computed(() => props.colorType === 'all' ? selectedFormat.value : props.colorType)
const formattedValue = computed(() => isTransparent.value ? 'transparent' : formatColor(parsedColor.value, activeColorType.value))
const alphaPercent = computed(() => Math.round(parsedColor.value.a * 100))
const isTransparent = computed(() => parsedColor.value.a === 0)
const displayValue = computed(() => formattedValue.value)

watch(() => props.modelValue, value => {
  const normalized = normalizeColor(value)
  if (normalized !== selectedColor.value) selectedColor.value = normalized
  if (parseColor(normalized).a > 0) lastOpaqueColor.value = colorToHex(normalized)
  if (props.colorType === 'all') selectedFormat.value = inferColorType(normalized)
})

watch(isOpen, async open => {
  if (open) {
    await nextTick()
    updatePopoverPosition()
    emit('open')
  } else {
    emit('close')
  }
})

function normalizeColor(value) {
  if (!value || String(value).toLowerCase() === 'transparent') return 'rgba(0, 0, 0, 0)'
  return String(value).trim()
}

function inferColorType(value) {
  const normalized = normalizeColor(value).toLowerCase()
  if (normalized.startsWith('hsl')) return 'hsl'
  if (normalized.startsWith('rgb')) return 'rgb'
  return 'hex'
}

function parseColor(color) {
  const value = normalizeColor(color)
  if (value.startsWith('#')) {
    const hex = value.slice(1)
    const expanded = hex.length === 3 || hex.length === 4 ? [...hex].map(char => char + char).join('') : hex
    if (/^[\da-f]{6}([\da-f]{2})?$/i.test(expanded)) {
      return { r: parseInt(expanded.slice(0, 2), 16), g: parseInt(expanded.slice(2, 4), 16), b: parseInt(expanded.slice(4, 6), 16), a: expanded.length === 8 ? parseInt(expanded.slice(6, 8), 16) / 255 : 1 }
    }
  }
  const channels = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*[,/]\s*([\d.]+)%?)?\s*\)$/i)
  if (channels) {
    const alpha = channels[4] == null ? 1 : (value.includes('%') ? Number(channels[4]) / 100 : Number(channels[4]))
    return { r: clamp(channels[1]), g: clamp(channels[2]), b: clamp(channels[3]), a: Math.max(0, Math.min(1, alpha)) }
  }
  const hslChannels = value.match(/^hsla?\(\s*([\d.]+)(?:deg)?\s*[,\s]\s*([\d.]+)%\s*[,\s]\s*([\d.]+)%(?:\s*[,/]\s*([\d.]+)%?)?\s*\)$/i)
  if (hslChannels) {
    const alpha = hslChannels[4] == null ? 1 : (/([\d.]+)%\s*\)$/i.test(value) ? Number(hslChannels[4]) / 100 : Number(hslChannels[4]))
    return { ...hslToRgb(Number(hslChannels[1]), Number(hslChannels[2]), Number(hslChannels[3])), a: Math.max(0, Math.min(1, alpha)) }
  }
  return { r: 0, g: 0, b: 0, a: 1 }
}

function clamp(value) { return Math.max(0, Math.min(255, Number(value) || 0)) }
function rgbToHex({ r, g, b }) { return `#${[r, g, b].map(value => Math.round(value).toString(16).padStart(2, '0')).join('')}`.toUpperCase() }
function colorToHex(color) { return rgbToHex(parseColor(color)) }
function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360 / 360
  const saturation = Math.max(0, Math.min(100, s)) / 100
  const lightness = Math.max(0, Math.min(100, l)) / 100
  if (saturation === 0) return { r: Math.round(lightness * 255), g: Math.round(lightness * 255), b: Math.round(lightness * 255) }
  const hueToRgb = (p, q, t) => {
    let channel = t < 0 ? t + 1 : t > 1 ? t - 1 : t
    if (channel < 1 / 6) return p + (q - p) * 6 * channel
    if (channel < 1 / 2) return q
    if (channel < 2 / 3) return p + (q - p) * (2 / 3 - channel) * 6
    return p
  }
  const q = lightness < .5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation
  const p = 2 * lightness - q
  return { r: Math.round(hueToRgb(p, q, hue + 1 / 3) * 255), g: Math.round(hueToRgb(p, q, hue) * 255), b: Math.round(hueToRgb(p, q, hue - 1 / 3) * 255) }
}
function rgbToHsl({ r, g, b }) {
  const red = r / 255, green = g / 255, blue = b / 255
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue)
  const lightness = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l: Math.round(lightness * 100) }
  const delta = max - min
  const saturation = lightness > .5 ? delta / (2 - max - min) : delta / (max + min)
  let hue = max === red ? (green - blue) / delta + (green < blue ? 6 : 0) : max === green ? (blue - red) / delta + 2 : (red - green) / delta + 4
  return { h: Math.round(hue * 60), s: Math.round(saturation * 100), l: Math.round(lightness * 100) }
}
function formatColor(color, type) {
  const alpha = Number(color.a.toFixed(2))
  if (type === 'rgb') return alpha >= 1 ? `rgb(${color.r}, ${color.g}, ${color.b})` : `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
  if (type === 'hsl') {
    const hsl = rgbToHsl(color)
    return alpha >= 1 ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`
  }
  if (alpha >= 1) return rgbToHex(color)
  return `${rgbToHex(color)}${Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase()}`
}

function setColor(color) {
  const parsed = typeof color === 'string' ? parseColor(color) : color
  selectedColor.value = `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${parsed.a})`
  if (parsed.a > 0) lastOpaqueColor.value = rgbToHex(parsed)
  const value = parsed.a === 0 ? 'transparent' : formatColor(parsed, activeColorType.value)
  emit('update:modelValue', value)
  emit('change', value)
}
function updateHex(hex) { setColor({ ...parseColor(hex), a: parsedColor.value.a || 1 }) }
function updateFromColorInput(value) {
  const input = value.trim()
  const valid = activeColorType.value === 'hex'
    ? /^#?([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(input)
    : activeColorType.value === 'rgb'
      ? /^rgba?\(/i.test(input)
      : /^hsla?\(/i.test(input)
  if (valid) setColor(input.startsWith('#') || activeColorType.value !== 'hex' ? input : `#${input}`)
}
function updateAlpha(value) { setColor({ ...parsedColor.value, a: Number(value) / 100 }) }
function toggleTransparency(transparent) {
  if (transparent) setColor({ ...parsedColor.value, a: 0 })
  else setColor(lastOpaqueColor.value || '#000000')
}
function reset() {
  const color = resetColor.value
  setColor(color)
  emit('reset', color)
}

function updatePopoverPosition() {
  const trigger = triggerRef.value
  const panel = panelRef.value
  if (!trigger || !panel) return

  const gap = 8
  const viewportPadding = 8
  const triggerRect = trigger.getBoundingClientRect()
  const panelRect = panel.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const panelWidth = panelRect.width
  const panelHeight = Math.min(panelRect.height, viewportHeight - viewportPadding * 2)

  const candidates = [
    { side: 'right', left: triggerRect.right + gap, top: triggerRect.top },
    { side: 'left', left: triggerRect.left - panelWidth - gap, top: triggerRect.top },
    { side: 'bottom', left: triggerRect.left, top: triggerRect.bottom + gap },
    { side: 'top', left: triggerRect.left, top: triggerRect.top - panelHeight - gap },
  ]
  const fits = candidate => (
    candidate.left >= viewportPadding &&
    candidate.top >= viewportPadding &&
    candidate.left + panelWidth <= viewportWidth - viewportPadding &&
    candidate.top + panelHeight <= viewportHeight - viewportPadding
  )
  const bestCandidate = candidates.find(fits) ?? candidates
    .map(candidate => ({
      ...candidate,
      visibleArea: Math.max(0, Math.min(candidate.left + panelWidth, viewportWidth - viewportPadding) - Math.max(candidate.left, viewportPadding)) *
        Math.max(0, Math.min(candidate.top + panelHeight, viewportHeight - viewportPadding) - Math.max(candidate.top, viewportPadding)),
    }))
    .sort((a, b) => b.visibleArea - a.visibleArea)[0]

  popoverStyle.value = {
    left: `${Math.min(Math.max(bestCandidate.left, viewportPadding), viewportWidth - panelWidth - viewportPadding)}px`,
    top: `${Math.min(Math.max(bestCandidate.top, viewportPadding), viewportHeight - panelHeight - viewportPadding)}px`,
    maxHeight: `${viewportHeight - viewportPadding * 2}px`,
    visibility: 'visible',
  }
}

function onClickOutside(event) {
  const clickedTrigger = rootRef.value?.contains(event.target)
  const clickedPopover = panelRef.value?.contains(event.target)
  if (isOpen.value && !clickedTrigger && !clickedPopover) isOpen.value = false
}
function onViewportChange() {
  if (isOpen.value) updatePopoverPosition()
}
onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
  window.addEventListener('resize', onViewportChange)
  window.addEventListener('scroll', onViewportChange, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})

defineExpose({ reset, open: () => { isOpen.value = true }, close: () => { isOpen.value = false } })
</script>

<style scoped>
.checkerboard {
  background-color: #fff;
  background-image: linear-gradient(45deg, #d1d5db 25%, transparent 25%), linear-gradient(-45deg, #d1d5db 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #d1d5db 75%), linear-gradient(-45deg, transparent 75%, #d1d5db 75%);
  background-position: 0 0, 0 4px, 4px -4px, -4px 0;
  background-size: 8px 8px;
}
</style>
