# 🧶 Manualidades Lua — Catálogo interactivo de crochet

> **Creaciones artesanales tejidas con amor**

Catálogo web responsivo de manualidades de crochet, organizado en 4 categorías (**Amigurumis**,
**Eventos**, **Flores** y **Llaveros**). El usuario busca, filtra por categoría y **cotiza
directamente por WhatsApp** con el mensaje prellenado con el nombre exacto del producto.

Construido con **React 18 + Vite 6 + Tailwind CSS 3** y una **capa de datos desacoplada** que hoy
lee un JSON local y mañana talks con FastAPI + PostgreSQL sin modificar un solo componente.

---

## 🚀 Puesta en marcha

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script            | Descripción                                        |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo con HMR                     |
| `npm run build`   | Build de producción en `dist/`                     |
| `npm run preview` | Sirve el build de producción                       |
| `npm run lint`    | ESLint 9 (configuración flat)                      |
| `npm run images`  | Genera las variantes responsivas de las fotos      |

> **Imágenes:** al añadir o reemplazar una foto en `public/images/catalogo/`, ejecuta
> `npm run images`. El script crea las versiones 400/600/800 en AVIF y WebP, el placeholder
> borroso y el color dominante, y actualiza `src/data/images.json`. Los PNG de
> `public/images/brand/` son los *masters*: si cambias el arte, reemplaza el PNG y vuelve a
> lanzarlo. Si te saltas este paso nada se rompe, pero esa foto se servirá como JPEG original
> a todos los dispositivos en vez de elegir la resolución adecuada.

> **Nota Windows:** si `npm install` avisa sobre *install scripts* de `esbuild`, ejecuta
> `npm approve-scripts esbuild` una sola vez. Es lo que permite que Vite compile.

---

## 🚀 Despliegue en Netlify

El proyecto trae `netlify.toml`, así que **no hay que configurar nada a mano en el panel**:

1. Entra en [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
2. Elige el repositorio `catalogo-manualidades-lua`. Netlify detecta `netlify.toml` y rellena
   solo el comando de build (`npm run build`) y la carpeta a publicar (`dist`).
3. Pulsa **Deploy site**. En unos minutos queda published en una URL
   `https://<nombre>.netlify.app`.

Cada `push` a `main` vuelve a publicar el sitio automáticamente.

### Antes de publicar: una cosa

| Qué | Dónde | Por qué importa |
| --- | --- | --- |
| `VITE_SITE_URL` | Site configuration → Environment variables | Rellena el `canonical` y el `og:image`. Si no, apuntarán al placeholder `https://manualidadeslua.com` y al compartir el enlace en WhatsApp o Facebook se verá la imagen de otro sitio. |

> `WHATSAPP_NUMBER` ya tiene un número real de prueba (`527717761908`, lada de Puebla). Sustitúyelo
> por el de la tienda antes de publicar: todos los botones de cotización abren ese número.

La URL se puede poner en `.env` en local o en el panel de Netlify; tiene prioridad lo que esté
definido en el panel durante el build.

### Conectar un dominio propio (después)

Site configuration → **Domain management** → **Add custom domain**. Netlify emite los
certificados TLS automáticamente y también añade el `www` y el dominio naked. **No hace falta
tocar el código**: no hay `base` de Vite porque el sitio se sirve en la raíz del dominio.

Si en algún momento migraras a GitHub Pages (donde sí se sirve en una subcarpeta
`github.io/catalogo-manualidades-lua/`), ahí sí habría que añadir `base` en `vite.config.js` y
prefijar con `import.meta.env.BASE_URL` las rutas de las fotos, que vienen de `products.json` y
`images.json` como cadenas en runtime y Vite no las reescribe.

---

## 📁 Estructura del proyecto

```
manualidades-lua/
├── index.html                     # Meta tags, Open Graph, canonical y tipografías
├── vite.config.js                 # Inyecta la URL pública y el JSON-LD en index.html
├── tailwind.config.js             # Paleta y sistema de diseño de la marca
├── postcss.config.js
├── eslint.config.js
├── scripts/
│   └── generate-images.mjs        # Genera las variantes responsivas (npm run images)
├── public/
│   ├── favicon-32.png, favicon-192.png, apple-touch-icon.png
│   ├── og-image.jpg
│   ├── images/brand/                    # Logotipos (PNG = master, WebP = derivado)
│   ├── images/catalogo/                 # Fotos + variantes (generadas por npm run images)
│   └── images/product-placeholder.svg   # Imagen de respaldo si falla una foto
└── src/
    ├── main.jsx                   # Punto de entrada
    ├── App.jsx                    # Orquestador: Navbar + Hero + Grid + Footer
    ├── index.css                  # Tailwind + estilos base
    │
    ├── config/
    │   └── site.js                # ⚙️  BRAND, CATEGORIES, SECTIONS, WhatsApp y redes
    │
    ├── data/
    │   ├── products.json          # 📦 Catálogo mock (105 productos, 4 categorías)
    │   └── images.json            # 🤖 Generado: srcset, LQIP y color de cada foto
    │
    ├── services/
    │   └── productService.js      # 🔌 CAPA DE DATOS (JSON ⇄ API REST)
    │
    ├── hooks/
    │   ├── useProducts.js         # Estado de carga / error / refetch
    │   └── useRevealOnScroll.js   # Anima las tarjetas al entrar en pantalla
    │
    ├── utils/
    │   ├── whatsapp.js            # Construye URLs wa.me con mensaje prellenado
    │   └── catalog.js             # Búsqueda, filtros y categorías (funciones puras)
    │
    └── components/
        ├── Navbar.jsx              # Marca + secciones + Instagram/Facebook (sticky)
        ├── Hero.jsx               # Portada
        ├── SearchBar.jsx          # Búsqueda por nombre/etiqueta
        ├── CategoryFilter.jsx     # Filtro de categorías dinámico
        ├── ProductGrid.jsx        # ⭐ Estado de búsqueda + filtrado + paginación
        ├── ProductCard.jsx        # Tarjeta + botón de WhatsApp
        ├── ProductCardSkeleton.jsx# Esqueletos de carga
        ├── EmptyState.jsx         # Sin resultados / error
        ├── BackToTop.jsx          # Botón de volver arriba
        └── Footer.jsx             # CTA de contacto
```

---

## 🎨 Identidad visual

| Token                | Uso                                    | Valor     | Contraste medido           |
| -------------------- | -------------------------------------- | --------- | -------------------------- |
| `canvas`             | Fondo general                          | `#F7F5FC` | —                          |
| `surface`            | Tarjetas y contenedores                | `#FFFFFF` | —                          |
| `line`               | Bordes y divisores                     | `#E3D5F2` | decorativo                 |
| `ink`                | Texto principal                        | `#2C2A29` | 13.21:1 sobre canvas        |
| `ink-soft`           | Texto secundario                       | `#57534E` | 7.06:1 sobre canvas         |
| `ink-muted`          | Texto terciario y placeholders         | `#6B6577` | 5.17:1 sobre canvas         |
| `brand` (= `lila-700`)| Botones y acentos                      | `#8363C9` | **4.57:1** con texto blanco |
| `lila-600`           | Acentos, iconos y degradados           | `#9B7EDE` | 3.02:1, solo texto grande   |
| `lila-800`           | Antetítulos, etiquetas y hovers        | `#6B4FA8` | 5.87:1 sobre canvas         |
| `success`            | Etiqueta "Disponible" (sobre `-soft`)  | `#237A4B` | 4.75:1                     |
| `danger`             | Etiqueta "Agotado" (sobre `-soft`)     | `#B23A46` | 5.15:1                     |
| `whatsapp`           | Hover de los botones de cotización     | `#107C41` | 5.27:1 con texto blanco     |

> **Contraste:** todo lo que lleva texto encima está elegido para cumplir WCAG AA (≥ 4.5:1).
> `brand` solía ser `#9B7EDE` y daba solo **3.26:1** contra blanco, lo que dejaba ilegibles
> todos los botones; por eso el morado "de marca" ahora es el tono 700 de la escala. Si subes
> cualquier token relleno, comprueba la relación de contraste antes de usarlo.

> **Tipografías:** Fraunces (títulos) e Inter (texto), servidas por Google Fonts. A Fraunces se
> le deja el eje óptico (`opsz`) libre pero se le fija el peso en **600**, el único que usa el
> sitio: pedir el rango 400-700 entero costaba 77 kB de woff2 y esto 42 kB (latin + latin-ext).
> Si añades títulos en otro peso, sube el peso en el `<link>` de `index.html`; `index.css`
> aplica `font-semibold` a `h1`-`h3` para que ningún título quede en un peso que el
> navegador tendría que sintetizar.

> Los colores viven **solo** en `tailwind.config.js`. Para un rebrand, cambia esos valores y
> toda la aplicación se actualiza. La URL pública (canonical, Open Graph y JSON-LD) vive en
> `VITE_SITE_URL`; ver `.env.example`.

---

## 🔎 SEO

- **Canonical y Open Graph** con URL **absoluta**, inyectada en `index.html` por un plugin de
  `vite.config.js` a partir de `VITE_SITE_URL`. Facebook y WhatsApp no resuelven rutas relativas.
- **Datos estructurados JSON-LD** (`Organization`, `WebSite` e `ItemList` con los 105 productos)
  generados en el build desde `src/data/products.json`, para que los buscadores tengan el
  catálogo sin ejecutar JavaScript.

---

## 💬 Flujo de WhatsApp

Cada tarjeta abre `https://wa.me/<numero>?text=<mensaje codificado>` con:

```
¡Hola! 👋 Vi el catálogo de *Manualidades Lua* y me interesa este producto:

🧶 *Abejita*
📂 Categoría: Amigurumis
🏷️ Etiquetas: abeja, cute, pequeño

Quisiera saber el *precio* y si es posible *personalizarlo* (colores, detalles, tamaño).
También me gustaría confirmar disponibilidad y tiempo de entrega. ¡Gracias! 💜
```

### ⚠️ Configura tu número

Abre `src/config/site.js` y sustituye los 10 dígitos finales por los de la tienda, dejando el `52`
inicial (clave de México, que exige el formato `wa.me`):

```js
export const WHATSAPP_NUMBER = '527717761908' // 👈 número de prueba, lada de Puebla
```

Para una lada distinta solo cambian los 10 últimos dígitos. También actualiza las URLs de
`SOCIAL_LINKS` (`instagram.com/manualidades_lua_` y el Facebook correspondiente). Todo el resto de
la app leerá esos valores.

---

## 🏗️ Arquitectura: designed for CRUD

La UI **nunca** importa el JSON directamente. Sigue siempre esta cadena:

```
ProductGrid / ProductCard   ← componentes puros de presentación
        ↓
     useProducts()          ← hook: loading / error / refetch
        ↓
   productService.js       ← ÚNICA pieza que conoce el origen de los datos
        ↓
  mockRepository  ⇄  httpRepository (fetch)
   products.json         API REST
```

### Migrar a FastAPI + PostgreSQL

1. **Define la variable de entorno** en un archivo `.env`:

   ```bash
   VITE_API_BASE_URL=https://api.manualidadeslua.com/api
   ```

   Con esto el servicio cambia **solo** a `httpRepository` y empieza a usar `fetch()`.
   No se toca ningún componente.

2. **Endpoints esperados** (los que ya implementa `httpRepository`):

   | Método  | Ruta             | Respuesta                        |
   | ------- | ---------------- | -------------------------------- |
   | `GET`   | `/products`      | `[{...}]` o `{ "items": [...] }` |
   | `GET`   | `/products/{id}` | `{...}` o `404`                  |

3. **Mutaciones**: conecta `createProduct`, `updateProduct` y `deleteProduct` (hoy lanzan
   `notImplemented`) a `POST /products`, `PATCH /products/{id}` y `DELETE /products/{id}`
   para construir el panel de administración.

4. **Cambio de nombres de campos**: si tu backend usa `imageUrl` / `is_active` / `categoria`,
   ajusta solo el normalizador `normalizeProduct()` en `productService.js`. Los componentes
   siguen recibiendo el mismo modelo.

Ejemplo de esquema SQL inicial:

```sql
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(160) NOT NULL,
  category    VARCHAR(80)  NOT NULL,
  description TEXT         NOT NULL DEFAULT '',
  image_url   TEXT,
  available   BOOLEAN      NOT NULL DEFAULT TRUE,
  tags        TEXT[]       NOT NULL DEFAULT '{}'
);
```

### Detalles de diseño pensados para crecer

- **Categorías con orden oficial**: las 4 de `CATEGORIES` en `site.js` (Amigurumis, Eventos,
  Flores, Llaveros) siempre se muestran y en ese orden, aunque una llegue vacía. Las categorías
  extra que llegue a mandar el backend se agregan al final, así que nada se pierde.
- **Búsqueda sin acentos**: `matchesSearch()` normaliza texto, así que “floracion” encuentra
  “floración”. Palabras múltiples usan lógica **AND** para ser más precisa.
- **Imagen de respaldo**: si la foto falla, la tarjeta muestra el placeholder de marca
  (`onError` en `ProductCard.jsx`); nunca se ve el ícono de imagen rota.
- **Estados incluidos**: carga (skeletons), error con reintento, sin resultados y producto agotado.
- **Paginación por tandas**: 12 tarjetas por vez con "Cargar más" y un contador
  "Mostrando X de Y". Filtrar o buscar reinicia la lista al principio.
- **Accesibilidad**: HTML semántico, `aria-label` / `aria-pressed` / `aria-live`, foco visible,
  paleta con contraste AA y respeto a `prefers-reduced-motion`. El filtro de categorías usa
  `aria-pressed` (son botones de filtro) y no el patrón `tablist`, que exigiría un `tabpanel`
  y navegación con flechas que aquí no existen.
- **Responsive**: 1 columna en móvil, 2 en tablet, 3 en escritorio y 4 en pantallas anchas;
  filtros en carrusel con `scroll-snap` en pantallas pequeñas, con degradado que avisa de que
  hay más categorías fuera de pantalla.

---

## 🧪 Verificación realizada

- `npm run lint` → sin errores ni advertencias.
- `npm run build` → `✓ built` (JS 260.92 kB / 67.47 kB gzip · CSS 29.50 kB / 6.01 kB gzip ·
  HTML 42.70 kB / 7.85 kB gzip, casi todo el JSON-LD).
- **Contraste:** las 21 combinaciones texto/fondo que usa la interfaz se comprobaron contra
  WCAG AA. Antes fallaban cinco —botones morados (3.26:1), texto terciario (3.27:1) y las
  etiquetas "Disponible"/"Agotado" (2.43 y 3.08)—; ahora la más justa es el botón morado con
  4.57:1.
- **Tipografías:** peso real de los woff2 medido contra Google Fonts (latin + latin-ext):
  Fraunces pasó de 77.2 kB a 42.3 kB al fijarle el peso en 600. Quitar el eje `ital` no ahorra
  bytes reales (el navegador nunca descargaba la cursiva), pero sí 3.7 kB del CSS.
- **Render:** 16 comprobaciones sobre el HTML generado con los 105 productos reales (navegación
  de secciones, `aria-pressed` sin restos de `tablist`, srcset AVIF y WebP, ambos estados de
  disponibilidad, paginación, `alt` en todas las imágenes y ausencia de marcadores sin
  sustituir).
