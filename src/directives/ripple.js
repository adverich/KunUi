export const vRipple = {
    mounted(el, binding) {
        el.style.position = 'relative'
        el.style.overflow = 'hidden'

        el.addEventListener('click', e => {
            const ripple = document.createElement('span')
            const diameter = Math.max(el.clientWidth, el.clientHeight)
            const radius = diameter / 2

            ripple.style.width = ripple.style.height = `${diameter}px`
            ripple.style.left = `${e.offsetX - radius}px`
            ripple.style.top = `${e.offsetY - radius}px`
            ripple.classList.add('ripple')

            const customClass = typeof binding.value === 'object' && binding.value.class
            if (customClass) ripple.classList.add(customClass)

            el.appendChild(ripple)

            setTimeout(() => {
                ripple.remove()
            }, 600)
        })
    },
}
