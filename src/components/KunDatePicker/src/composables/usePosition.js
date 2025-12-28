import { ref, onMounted, onUnmounted } from 'vue';

export function usePosition(triggerRef, contentRef, options = {}) {
    const { offset = 8, placement = 'bottom-start' } = options;
    const style = ref({
        position: 'fixed',
        top: '0px',
        left: '0px',
        opacity: '0',
        pointerEvents: 'none',
        transform: 'scale(0.95)',
        maxHeight: 'auto', // Default
    });
    const position = ref('bottom');
    const isVisible = ref(false);

    const update = async () => {
        if (!triggerRef.value || !contentRef.value) return;

        const triggerEl = triggerRef.value.rootRef || triggerRef.value.$el || triggerRef.value;
        const contentEl = contentRef.value;

        if (!triggerEl || !triggerEl.getBoundingClientRect) return;

        const rect = triggerEl.getBoundingClientRect();
        const contentRect = contentEl.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        const margin = 12; // Safety margin from screen edges

        // Check space below vs above
        const spaceBelow = viewportHeight - rect.bottom - offset - margin;
        const spaceAbove = rect.top - offset - margin;

        // Decision logic: prefer bottom unless space is tight AND top has more space
        const fitBelow = spaceBelow >= contentRect.height;
        const fitAbove = spaceAbove >= contentRect.height;

        let top = 0;
        let left = 0;
        let origin = 'top center';
        let allowedHeight = 0;

        // Determine Vertical Position
        if (fitBelow || (!fitAbove && spaceBelow >= spaceAbove)) {
            // Place Bottom
            top = rect.bottom + offset;
            position.value = 'bottom';
            origin = 'top center';
            allowedHeight = spaceBelow;
        } else {
            // Place Top
            // For top placement, top coordinate is (triggerTop - height - offset).
            // But if we are constraining height, we need to calculate 'top' based on the constrained height, 
            // OR use bottom positioning logic relative to screen?
            // Easier: Set 'bottom' css property? No, keeping 'top' for consistency but calculation changes.
            // Correct Top calculation: 
            // We want the bottom of the popover to be at (rect.top - offset).
            // So Top = (rect.top - offset) - contentHeight.
            // BUT if we constrain height, contentHeight changes.
            // It's safer to calculate allowedHeight first.

            allowedHeight = spaceAbove;
            // We will set explicit height style if content exceeds allowedHeight, ensuring correct positioning requires re-reading height?
            // CSS flex columns handle resizing well, but 'top' position depends on height.
            // If we set maxHeight, the browser renders it smaller. We need that final height to calculate Top.
            // Strategy: Set maxHeight style first, let browser layout, then read height? Too flickery.

            // Alternative: Use `bottom` CSS property for Top placement?
            // If we use `bottom: viewportHeight - rect.top + offset`, it grows upwards automatically!
            // Let's try to switch to Top/Bottom properties if possible, or calculate precisely.

            position.value = 'top';
            origin = 'bottom center';
        }

        // Horizontal Positioning
        if (options.align === 'right') {
            left = rect.right - contentRect.width;
            origin = position.value === 'bottom' ? 'top right' : 'bottom right';
        } else if (options.align === 'center') {
            left = rect.left + (rect.width / 2) - (contentRect.width / 2);
            origin = position.value === 'bottom' ? 'top center' : 'bottom center';
        } else {
            // Left / Start
            left = rect.left;
            origin = position.value === 'bottom' ? 'top left' : 'bottom left';
        }

        // Horizontal Boundary Check
        if (left + contentRect.width > viewportWidth - margin) {
            left = viewportWidth - contentRect.width - margin;
        }
        if (left < margin) {
            left = margin;
        }

        const commonStyles = {
            position: 'fixed',
            left: `${left}px`,
            opacity: '1',
            pointerEvents: 'auto',
            transform: 'scale(1)',
            transformOrigin: origin,
            zIndex: '99999',
            maxWidth: `${viewportWidth - (margin * 2)}px`,
            // Essential for scrolling: Restrict max-height to available space
            maxHeight: `${allowedHeight}px`,
        };

        if (position.value === 'top') {
            // For Top positioning, relying on 'bottom' css property is much more stable for variable heights
            style.value = {
                ...commonStyles,
                top: 'auto',
                bottom: `${viewportHeight - rect.top + offset}px`
            };
        } else {
            style.value = {
                ...commonStyles,
                top: `${top}px`,
                bottom: 'auto'
            };
        }

        isVisible.value = true;
    };

    const handleScroll = () => {
        if (isVisible.value) update();
    };

    const handleResize = () => {
        if (isVisible.value) update();
    };

    onMounted(() => {
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, true);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
    });

    return { style, update, position, isVisible };
}
