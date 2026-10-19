## Bordes y superficies

- Deja de ser `bg-inverted` (alto contraste): ahora `bg-default text-highlighted
  ring ring-default`, igual que el `tooltip` de Nuxt UI. El borde del globo es
  visible en light y dark.
- El composable `useTooltip.ts` está **deprecado** y no lo usa el SFC (que emplea
  `useTooltipPosition`); su `arrowClass` solo se actualizó por consistencia y no
  renderiza flecha (el SFC no monta flecha).
