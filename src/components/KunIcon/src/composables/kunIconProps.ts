import type { Component, PropType } from 'vue';

export type KunIconInput = string | Record<string, any> | Function | unknown[] | Component | boolean;

export const kunIconProps = {
  icon: {
    type: [String, Object, Function] as PropType<KunIconInput>,
    required: false as const,
    default: undefined,
  },
  aliases: {
    type: Object as PropType<Record<string, string>>,
    default: (): Record<string, string> => ({}),
  },
  size: {
    type: String,
    default: 'text-md',
  },
  color: {
    type: String,
    default: 'text-font-color',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  cursor: {
    type: String as PropType<string | null>,
    default: null as string | null,
  },
  contentClass: [String, Array, Object] as PropType<string | unknown[] | Record<string, unknown>>,
};
