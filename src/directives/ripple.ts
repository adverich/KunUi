import type { DirectiveBinding } from 'vue'

export const vRipple = {
    mounted(el: HTMLElement, binding: DirectiveBinding): void {
        el.style.position = 'relative';
        el.style.overflow = 'hidden';

        el.addEventListener('click', (e: MouseEvent) => {
            const ripple = document.createElement('span');
            const diameter = Math.max(el.clientWidth, el.clientHeight);
            const radius = diameter / 2;

            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.offsetX - radius}px`;
            ripple.style.top = `${e.offsetY - radius}px`;
            ripple.classList.add('ripple');

            const bindingValue = binding.value as { class?: string } | null | undefined;
            const customClass = typeof bindingValue === 'object' && bindingValue !== null
                ? bindingValue.class
                : undefined;
            if (customClass) ripple.classList.add(customClass);

            el.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    },
};
