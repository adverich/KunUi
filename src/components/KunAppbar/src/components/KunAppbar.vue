<template>
  <transition
    :enter-active-class="transitionMap[transition].enterActive"
    :enter-from-class="transitionMap[transition].enterFrom"
    :leave-active-class="transitionMap[transition].leaveActive"
    :leave-to-class="transitionMap[transition].leaveTo"
  >
    <header
      v-show="isVisible"
      ref="el"
      class="w-full flex transition-all duration-300"
      :class="mergedClass"
      :style="{ zIndex }"
      v-bind="$attrs"
    >
      <!-- IZQUIERDA -->
      <div :class="leftSectionClass">
        <slot name="appbarButton">
          <KunBtn
            v-if="showDrawerButton"
            :class="buttonClass"
            :bgColor="buttonBg"
            minWidth="fit-content"
            rounded="rounded-full"
            textColor="text-black dark:text-white"

            @click="$emit('toggle-drawer')"
          >
            <KunIcon :icon="IconMenuRounded" size="text-3xl" />
          </KunBtn>
        </slot>

        <slot name="prepend" />

        <template v-if="titlePosition === 'left'">
          <slot name="title">
            <KunAppbarTitle
              v-if="title"
              :title="title"
              :titleImage="titleImage"
              :textSize="titleSize"
              :fontWeight="titleWeight"
            />
          </slot>
        </template>
      </div>

      <!-- CENTRO -->
      <div v-if="titlePosition === 'center'" class="flex-1 flex justify-center">
        <slot name="title">
          <KunAppbarTitle
            v-if="title"
            :title="title"
            :titleImage="titleImage"
            :textSize="titleSize"
            :fontWeight="titleWeight"
          />
        </slot>
      </div>

      <!-- DERECHA -->
      <div :class="rightSectionClass">
        <slot name="actions" />

        <template v-if="titlePosition === 'right'">
          <slot name="title">
            <KunAppbarTitle
              v-if="title"
              :title="title"
              :titleImage="titleImage"
              :textSize="titleSize"
              :fontWeight="titleWeight"
            />
          </slot>
        </template>
      </div>
    </header>
  </transition>
</template>

<script setup>
import { computed, ref, onMounted, onUpdated, nextTick, onBeforeUnmount, defineExpose } from 'vue';
import KunAppbarTitle from '../../../KunAppbarTitle/src/components/KunAppbarTitle.vue';
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue';
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue';
import IconMenuRounded from '../../../../icons/IconMenuRounded.vue';
import { setAppbarHeight } from '@/utils/useLayout';
import { kunAppbarProps } from '../composables/kunAppbarProps'

const props = defineProps(kunAppbarProps)
defineOptions({ inheritAttrs: false });

const el = ref(null);
const isVisible = ref(true);
const responsiveCollapsed = ref(false);

function updateHeight() {
  nextTick(() => {
    if (el.value) {
      const rect = el.value.getBoundingClientRect()
      setAppbarHeight(Math.round(rect.height))
    }
  })
};

function handleScroll() {
  if (!props.autoHideOnScroll) return
  const current = window.scrollY
  isVisible.value = current < lastScroll.value || current < 10
  lastScroll.value = current
};

function handleResize() {
  if (!props.responsiveCollapse) return
  responsiveCollapsed.value = window.innerWidth < props.collapseBreakpoint
};

const lastScroll = ref(0);

onMounted(() => {
  updateHeight()
  if (props.autoHideOnScroll) {
    window.addEventListener('scroll', handleScroll)
  }
  if (props.responsiveCollapse) {
    window.addEventListener('resize', handleResize)
    handleResize()
  }
});

onUpdated(updateHeight);

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
});

defineExpose({
  el,
  updateHeight
});

const heightClass = computed(() => {
  if(props.height) return props.height;

  switch (props.density) {
    case 'comfortable':
      return 'h-[56px]'
    case 'compact':
      return 'h-[48px]'
    default:
      return 'h-[64px]'
  }
});

const elevationClass = computed(() => {
  const allowed = ['sm', 'md', 'lg', 'xl', '2xl']
  return props.elevation === 'none' || !allowed.includes(props.elevation)
    ? ''
    : `shadow-${props.elevation}`
});

const mergedClass = computed(() => [
  heightClass.value,
  props.bgColor,
  elevationClass.value,
  props.bordered ? props.borderColor : '',
  props.fixed ? 'fixed top-0 left-0 right-0' : '',
  props.sticky ? 'sticky top-0' : '',
  props.glass ? 'backdrop-blur-md' : '',
  responsiveCollapsed.value ? 'justify-between px-2' : '',
  props.animationClass
]);

const transitionMap = {
  'fade-slide': {
    enterActive: 'transition-all duration-300 ease-out',
    enterFrom: 'opacity-0 -translate-y-full',
    leaveActive: 'transition-all duration-300 ease-in',
    leaveTo: 'opacity-0 -translate-y-full'
  },
  'fade': {
    enterActive: 'transition-opacity duration-300',
    enterFrom: 'opacity-0',
    leaveActive: 'transition-opacity duration-300',
    leaveTo: 'opacity-0'
  },
  'scale': {
    enterActive: 'transition-transform duration-300',
    enterFrom: 'scale-95 opacity-0',
    leaveActive: 'transition-transform duration-300',
    leaveTo: 'scale-95 opacity-0'
  }
};
</script>
