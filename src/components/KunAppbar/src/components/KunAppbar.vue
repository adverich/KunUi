<template>
  <header
    ref="el"
    class="w-full flex"
    :class="[heightClass, bgColor, elevationClass, bordered ? borderColor : '']"
    :style="{ zIndex }"
    v-bind="$attrs"
  >
    <!-- IZQUIERDA: Drawer + prepend + title (left) -->
    <div :class="leftSectionClass">
      <slot name="appbarButton">
        <KunBtn
          v-if="showDrawerButton"
          :class="buttonClass"
          minWidth="fit-content"
          bgColor="bg-transparent"
          textColor="text-black dark:text-white"
          @click="$emit('toggle-drawer')"
        >
          <KunIcon :icon="IconMenuRounded" size="text-3xl"  />
        </KunBtn>
      </slot>

      <slot name="prepend" />

      <!-- Custom title slot LEFT -->
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

      <!-- Custom title slot RIGHT -->
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
</template>

<script setup>
import { computed, defineProps, ref, onMounted, onUpdated, nextTick } from 'vue'
import KunAppbarTitle from '../../../KunAppbarTitle/src/components/KunAppbarTitle.vue'
import KunBtn from '../../../KunBtn/src/components/KunBtn.vue'
import KunIcon from '../../../KunIcon/src/components/KunIcon.vue'
import IconMenuRounded from '../../../../icons/IconMenuRounded.vue'
import { setAppbarHeight } from '@/utils/useLayout'

const props = defineProps({
  bgColor: {
    type: String,
    default: 'bg-transparent'
  },
  title: {
    type: String,
    default: ''
  },
  titleImage: {
    type: String,
    default: ''
  },
  titleSize: {
    type: String,
    default: 'text-base'
  },
  titleWeight: {
    type: String,
    default: 'font-medium'
  },
  titlePosition: {
    type: String,
    default: 'center',
    validator: val => ['left', 'center', 'right'].includes(val)
  },
  density: {
    type: String,
    default: 'default'
  },
  elevation: {
    type: String,
    default: 'md'
  },
  bordered: {
    type: Boolean,
    default: false
  },
  borderColor: {
    type: String,
    default: 'border-b border-gray-200'
  },
  showDrawerButton: {
    type: Boolean,
    default: true
  },
  buttonClass: {
    type: String,
    default: 'bg-transparent px-2'
  },
  leftSectionClass: {
    type: String,
    default: 'flex items-center gap-2'
  },
  rightSectionClass: {
    type: String,
    default: 'flex items-center gap-2 justify-end ml-auto'
  },
  zIndex: {
    type: [String, Number],
    default: 2000
  }
})
defineOptions({ inheritAttrs: false })

const heightClass = computed(() => {
  switch (props.density) {
    case 'comfortable':
      return 'min-h-12 py-1'
    case 'compact':
      return 'min-h-10 py-0.5'
    default:
      return 'min-h-14 py-2'
  }
})

const elevationClass = computed(() => {
  const allowed = ['sm', 'md', 'lg', 'xl', '2xl']
  return props.elevation === 'none' || !allowed.includes(props.elevation)
    ? ''
    : `shadow-${props.elevation}`
})

const el = ref(null)
async function updateHeight() {
  await nextTick()
  if (el.value) setAppbarHeight(el.value.offsetHeight);
}

onMounted(updateHeight)
onUpdated(updateHeight)
</script>
