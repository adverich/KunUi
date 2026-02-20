export const kunSkeletonProps = {
  loading: { type: Boolean, default: true },
  variant: { type: String, default: "rect" },
  width: { type: [String, Number], default: "100%" },
  height: { type: [String, Number], default: "1rem" },
  rounded: { type: String, default: "md" },
  animation: { type: String, default: "shimmer" },
  duration: { type: Number, default: 1500 },
  colorFrom: { type: String, default: "bg-gray-200" },
  colorTo: { type: String, default: "bg-gray-300" },
  repeat: { type: Boolean, default: true },
  class: { type: [String, Array, Object], default: "" }
}
