# NOVO.V — React + Vite (Ancient Greece Theme)

Rediseño completo de la web de NOVO.V con estética de la **Antigua Grecia**.

## Cómo correr el proyecto

```bash
# 1. Instala dependencias
npm install

# 2. Corre el servidor de desarrollo
npm run dev

# 3. Abre en tu navegador
# http://localhost:5173
```

## Cómo hacer build para producción

```bash
npm run build
npm run preview
```

## Estructura del proyecto

```
src/
├── components/
│   ├── Navbar.jsx / .module.css     → Navegación con patrón de meandro
│   ├── Hero.jsx / .module.css       → Sección hero con columnas griegas
│   ├── Marquee.jsx / .module.css    → Banda deslizante
│   ├── Drops.jsx / .module.css      → Nuevos lanzamientos
│   ├── Catalog.jsx / .module.css    → Catálogo con filtros
│   ├── About.jsx / .module.css      → Historia con pilares griegos
│   ├── Contact.jsx / .module.css    → Contacto y formulario
│   ├── Cart.jsx / .module.css       → Carrito lateral
│   ├── Footer.jsx / .module.css     → Pie de página
│   └── CapSVG.jsx                   → Ilustraciones SVG de gorras
├── App.jsx                          → Estado global y cursor personalizado
├── App.module.css
├── index.css                        → Variables globales CSS + reset
└── main.jsx                         → Entry point

```

## Diseño

- **Paleta**: Obsidiana, oro (#C9A96E), mármol, piedra antigua
- **Tipografía**: Cinzel Decorative (display), Cinzel (headings), EB Garamond (body)
- **Motivos**: Meandro griego, columnas jónicas, laureles, owl de Atenea, sol de Helios
- **Interacciones**: Cursor personalizado, hover con escala, reveals on scroll
- **Carrito**: Panel lateral con gestión de productos (añadir, quitar, borrar)

## Para agregar imágenes reales

Reemplaza los SVG en `CapSVG.jsx` con etiquetas `<img>` apuntando a tus fotos:

```jsx
// En CapObsidian, reemplaza el SVG por:
<img src="/img/obsidian.jpg" alt="Obsidian I" style={{width:'100%'}} />
```

Y coloca tus imágenes en la carpeta `public/img/`.
