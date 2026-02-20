export const kunAppbarProps = {
  bgColor: { type: String, default: 'bg-transparent' },
  title: String,
  titleImage: String,
  titleSize: { type: String, default: 'text-base' },
  titleWeight: { type: String, default: 'font-medium' },
  titlePosition: {
    type: String,
    default: 'center',
    validator: val => ['left', 'center', 'right'].includes(val)
  },
  density: { type: String, default: 'default' },
  height: String,
  elevation: { type: String, default: 'md' },
  bordered: { type: Boolean, default: false },
  borderColor: { type: String, default: 'border-b border-slate-200 dark:border-slate-800' },
  showDrawerButton: { type: Boolean, default: true },
  buttonClass: { type: String, default: 'px-2' },
  buttonBg: { type: String, default: 'bg-button-disabled opacity-75' },
  leftSectionClass: { type: String, default: 'flex items-center gap-2' },
  rightSectionClass: { type: String, default: 'flex items-center gap-2 justify-end ml-auto' },
  zIndex: { type: String, default: 'z-1000' },
  fixed: { type: Boolean, default: false },
  sticky: { type: Boolean, default: false },
  glass: { type: Boolean, default: false },
  autoHideOnScroll: { type: Boolean, default: false },
  responsiveCollapse: { type: Boolean, default: false },
  collapseBreakpoint: { type: Number, default: 768 },
  transition: {
    type: String,
    default: 'fade-slide',
    validator: val => ['fade-slide', 'fade', 'scale'].includes(val)
  },
  animationClass: { type: String, default: '' }
}
