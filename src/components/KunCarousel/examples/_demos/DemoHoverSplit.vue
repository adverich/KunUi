<script setup>
import { ref } from 'vue'
import KunCarousel from '../../src/components/KunCarousel.vue'
import KunCarouselSlide from '../../../KunCarouselSlide/src/components/KunCarouselSlide.vue'

const selected = ref(0)
const stepsPosition = ref('bottom')

const steps = ref([
  {
    id: 1,
    label: 'CLEANSE',
    product: 'pineapple refresh',
    detail: 'PGA daily cleanser',
    productBg: 'bg-amber-300',
    mediaBg: 'bg-stone-600',
    mediaLabel: 'Glazed morning',
  },
  {
    id: 2,
    label: 'PREP',
    product: 'glazing milk',
    detail: 'ceramide facial essence',
    productBg: 'bg-stone-100',
    mediaBg: 'bg-stone-700',
    mediaLabel: 'Prep ritual',
  },
  {
    id: 3,
    label: 'TREAT',
    product: 'peptide glazing fluid',
    detail: 'barrier-boosting serum',
    productBg: 'bg-rose-200',
    mediaBg: 'bg-stone-800',
    mediaLabel: 'Treat & seal',
  },
  {
    id: 4,
    label: 'MOISTURIZE',
    product: 'barrier butter',
    detail: 'rich cream seal',
    productBg: 'bg-yellow-100',
    mediaBg: 'bg-neutral-700',
    mediaLabel: 'Soft finish',
  },
  {
    id: 5,
    label: 'PROTECT',
    product: 'peptide eye tint',
    detail: 'sheer glaze shield',
    productBg: 'bg-orange-200',
    mediaBg: 'bg-neutral-800',
    mediaLabel: 'Day ready',
  },
])

function goTo(i) {
  if (i === selected.value) return
  selected.value = i
}

function stepNumber(i) {
  return String(i + 1).padStart(2, '0')
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-md border px-3 py-1 text-xs font-medium"
        :class="stepsPosition === 'bottom' ? 'border-primary bg-primary/10' : 'border-surface'"
        @click="stepsPosition = 'bottom'"
      >
        Números abajo
      </button>
      <button
        type="button"
        class="rounded-md border px-3 py-1 text-xs font-medium"
        :class="stepsPosition === 'side' ? 'border-primary bg-primary/10' : 'border-surface'"
        @click="stepsPosition = 'side'"
      >
        Números al costado
      </button>
    </div>

    <div class="overflow-hidden rounded-xl border border-surface">
      <div
        class="grid h-[min(28rem,68vh)] min-h-[22rem] grid-cols-1 md:grid-cols-2"
      >
        <div
          class="relative flex min-h-0 bg-neutral-800 text-white"
          :class="stepsPosition === 'side' ? 'flex-row' : 'flex-col'"
        >
          <nav
            v-if="stepsPosition === 'side'"
            class="flex shrink-0 flex-col items-center justify-center gap-3 border-r border-white/10 px-3 py-4"
            aria-label="Routine steps"
          >
            <button
              v-for="(s, i) in steps"
              :key="`side-${s.id}`"
              type="button"
              class="group flex items-center gap-2"
              :aria-current="i === selected ? 'step' : undefined"
              :aria-label="`${stepNumber(i)} ${s.label}`"
              @mouseenter="goTo(i)"
              @focus="goTo(i)"
              @click="goTo(i)"
            >
              <span
                :class="[
                  'flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition',
                  i === selected
                    ? 'text-white'
                    : 'border border-white/40 text-white/70 group-hover:border-white/80 group-hover:text-white',
                ]"
                :style="i === selected ? { backgroundColor: '#6b705c' } : undefined"
              >
                {{ stepNumber(i) }}
              </span>
              <span
                class="w-14 truncate text-[10px] font-semibold uppercase tracking-wider"
                :class="i === selected ? 'text-white/90' : 'text-transparent'"
              >
                {{ s.label }}
              </span>
            </button>
          </nav>

          <div class="flex min-h-0 min-w-0 flex-1 flex-col">
            <header class="shrink-0 space-y-1 px-6 pt-6">
              <h4 class="text-lg font-semibold tracking-tight sm:text-xl">
                The rhode ROUTINE for GLAZED skin.
              </h4>
              <p class="text-sm text-white/60">Your morning and evening skincare steps.</p>
            </header>

            <div class="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4">
              <KunCarousel
                v-model="selected"
                align="center"
                slide-size="100%"
                gap="0"
                :duration="55"
                :draggable="false"
                :show-arrows="false"
                :show-dots="false"
                wrapper-class="h-full w-full"
              >
                <KunCarouselSlide v-for="s in steps" :key="`product-${s.id}`">
                  <div class="flex h-full min-h-[12rem] items-center justify-center gap-0 px-4">
                    <div class="max-w-[9rem] text-right">
                      <p class="text-sm font-semibold">{{ s.product }}</p>
                      <p class="mt-0.5 text-xs text-white/55">{{ s.detail }}</p>
                    </div>
                    <div class="mx-1 h-px w-8 bg-white/50 sm:w-10" aria-hidden="true" />
                    <div
                      :class="[
                        'flex h-28 w-28 items-center justify-center rounded text-center text-xs font-semibold text-neutral-800 shadow-lg',
                        s.productBg,
                      ]"
                    >
                      swatch
                    </div>
                  </div>
                </KunCarouselSlide>
              </KunCarousel>
            </div>

            <nav
              v-if="stepsPosition === 'bottom'"
              class="flex shrink-0 items-end justify-center gap-4 px-6 pb-5"
              aria-label="Routine steps"
            >
              <button
                v-for="(s, i) in steps"
                :key="s.id"
                type="button"
                class="group flex flex-col items-center gap-1.5"
                :aria-current="i === selected ? 'step' : undefined"
                :aria-label="`${stepNumber(i)} ${s.label}`"
                @mouseenter="goTo(i)"
                @focus="goTo(i)"
                @click="goTo(i)"
              >
                <span
                  :class="[
                    'flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition',
                    i === selected
                      ? 'text-white'
                      : 'border border-white/40 text-white/70 group-hover:border-white/80 group-hover:text-white',
                  ]"
                  :style="i === selected ? { backgroundColor: '#6b705c' } : undefined"
                >
                  {{ stepNumber(i) }}
                </span>
                <span
                  class="h-4 text-[10px] font-semibold uppercase tracking-wider"
                  :class="i === selected ? 'text-white/90' : 'text-transparent'"
                >
                  {{ s.label }}
                </span>
              </button>
            </nav>
          </div>
        </div>

        <div class="relative min-h-[14rem] overflow-hidden bg-neutral-900 md:min-h-0">
          <KunCarousel
            v-model="selected"
            align="center"
            slide-size="100%"
            gap="0"
            :duration="55"
            :draggable="false"
            :show-arrows="false"
            :show-dots="false"
            wrapper-class="h-full min-h-[14rem] md:min-h-full"
          >
            <KunCarouselSlide v-for="s in steps" :key="`media-${s.id}`">
              <div
                :class="[
                  'flex h-full min-h-[14rem] items-end justify-start p-6 text-2xl font-semibold text-white md:min-h-full',
                  s.mediaBg,
                ]"
              >
                {{ s.mediaLabel }}
              </div>
            </KunCarouselSlide>
          </KunCarousel>
        </div>
      </div>
    </div>
  </div>
</template>
