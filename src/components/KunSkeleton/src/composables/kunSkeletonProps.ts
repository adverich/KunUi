export const kunSkeletonProps = {
  loading: { type: Boolean, default: true },
  variant: { type: String, default: "rect" },
  width: { type: [String, Number], default: "100%" },
  height: { type: [String, Number], default: "1rem" },
  rounded: { type: String, default: "md" },
  animation: { type: String, default: "shimmer" },
  duration: { type: Number, default: 1500 },
  colorFrom: { type: String, default: "bg-ui-surface-subtle" },
  colorTo: { type: String, default: "bg-ui-hover" },
  repeat: { type: Boolean, default: true },
  class: { type: [String, Array, Object], default: "" }
}
