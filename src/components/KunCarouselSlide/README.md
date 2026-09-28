# KunCarouselSlide

Slide individual para `KunCarousel`. También se pueden usar `div`s comunes
como slides; este componente añade el hook de accesibilidad y permite
sobrescribir el tamaño por slide.

```vue
<KunCarousel>
  <KunCarouselSlide v-for="s in slides" :key="s.id">
    <img :src="s.src" />
  </KunCarouselSlide>
</KunCarousel>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| slideClass | String/Array/Object | '' | Clase extra del slide |
| size | String | null | flex-basis individual (sobrescribe `slideSize` del carousel) |

## Slots

| Slot | Descripción |
|------|-------------|
| default | Contenido del slide |
