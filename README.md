# Text List Manager — Prueba Técnica React

Aplicación para gestionar una lista de cadenas de texto, desarrollada con React 19 + TypeScript + Vite.

## Funcionalidades

- **Añadir ítems** mediante un modal con campo de texto. No se permiten entradas vacías.
- **Seleccionar ítems** con click. Soporta selección múltiple.
- **Eliminar ítems** seleccionados mediante el botón Delete. No se puede eliminar sin selección previa.
- **Eliminar con doble click** directamente sobre el ítem.
- **Deshacer** el último cambio (add o delete) mediante el botón Undo.
- **Diseño responsive** adaptado a móvil (breakpoint 600px).

## Tecnologías

| | |
|---|---|
| React 19 (compatible con 18) | Framework UI |
| TypeScript 5.9 | Tipado estático |
| Vite 7 | Bundler y dev server |
| SCSS Modules | Estilos con variables y mixins |
| MUI 7 | Theme provider y CssBaseline |
| Vitest + Testing Library | Tests unitarios |

## Estructura del proyecto

```
src/
├── components/
│   ├── ActionButtons/   # Botones Undo, Delete, Add
│   ├── AddItemModal/    # Modal para añadir ítems
│   ├── Header/          # Título y descripción
│   └── ItemList/        # Lista y cada ítem individual
├── hooks/
│   └── useListManager.ts  # Lógica de estado centralizada
├── styles/
│   ├── _variables.scss    # Tokens de diseño (colores, tipografía, espaciado)
│   ├── _mixins.scss       # Mixins reutilizables
│   └── global.scss        # Reset y estilos base
└── types/               # Tipos compartidos
```

## Instalación y uso

```bash
npm install
npm run dev
```

## Tests

```bash
npm test          # modo watch
npm run test:run  # ejecución única
```

## Build

```bash
npm run build
npm run preview
```
