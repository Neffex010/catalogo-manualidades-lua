# 🧶 Manualidades Lua — Catálogo interactivo de crochet

> **Creaciones artesanales tejidas con amor**

Sitio web responsivo de **Manualidades Lua** con dos bloques con intención distinta:

- **Diseños tejidos a pedido** (`#disenos`): un portafolio con piezas reales que se tejen
  por encargo. No hay precio, stock ni inventario: la foto muestra la calidad del trabajo y
  el pedido se cotiza por WhatsApp.
- **Hilos y estambres** (`#materiales`): los insumos disponibles, con variantes de color,
  existencias y precio fijo solo en los hilos.

Construido con **React 18 + Vite 6 + Tailwind CSS 3** y una **capa de datos desacoplada** que hoy
lee un catálogo local y mañana habla con FastAPI + PostgreSQL sin modificar un solo componente.

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
| `npm run variants`| Normaliza las fotos de estambres e hilos por color |

> **Imágenes:** al añadir o reemplazar una foto en `public/images/catalogo/`, ejecuta
> `npm run images`. El script crea las versiones 400/600/800 en AVIF y WebP, el placeholder
> borroso y el color dominante, y actualiza `src/data/images.json`. Los PNG de
> `public/images/brand/` son los *masters*: si cambias el arte, reemplaza el PNG y vuelve a
> lanzarlo. Si te saltas este paso nada se rompe, pero esa foto se servirá como JPEG original
> a todos los dispositivos en vez de elegir la resolución adecuada.

> **Variantes de color:** las fotos originales viven en `assets/estambres-fotos` (fuera de
> `public/`, así que no se publican). Al añadir un color, agrégalo también en
> `src/data/products.js` y en el mapa de `scripts/sync-variant-images.mjs`, y ejecuta
> `npm run variants`. El script recorta cada foto a 4:5 y la guarda como WebP con el nombre
> que espera el catálogo.

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
| `VITE_SITE_URL` | Site configuration → Environment variables | Rellena el `canonical` y el `og:image`. Si no, apuntarán al placeholder `https://manualidadeslua.com` y al compartir el enlace en WhatsApp se verá la imagen de otro sitio. |

> `WHATSAPP_NUMBER` usa el número de la tienda (`527711415822`, lada de Pachuca, Hidalgo). Si cambia,
> actualízalo en `src/config/site.js`: todos los botones de cotización leen ese valor.

La URL se puede poner en `.env` en local o en el panel de Netlify; tiene prioridad lo que esté
definido en el panel durante el build.

### Conectar un dominio propio (después)

Site configuration → **Domain management** → **Add custom domain**. Netlify emite los
certificados TLS automáticamente y también añade el `www` y el dominio naked. **No hace falta
tocar el código**: no hay `base` de Vite porque el sitio se sirve en la raíz del dominio.

Si en algún momento migraras a GitHub Pages (donde sí se sirve en una subcarpeta
`github.io/catalogo-manualidades-lua/`), ahí sí habría que añadir `base` en `vite.config.js` y
prefijar con `import.meta.env.BASE_URL` las rutas de las fotos, que vienen de `products.js`,
`manualidades.js` e `images.json` como cadenas en runtime y Vite no las reescribe.

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
│   ├── generate-images.mjs        # Variantes responsivas de las fotos (npm run images)
│   └── sync-variant-images.mjs    # Normaliza las fotos de colores (npm run variants)
├── assets/
│   └── estambres-fotos/           # Originales de Drive (fuera de public: no se publican)
├── public/
│   ├── favicon-32.png, favicon-192.png, apple-touch-icon.png
│   ├── og-image.jpg
│   ├── images/brand/                    # Logotipos (PNG = master, WebP = derivado)
│   ├── images/catalogo/                 # Manualidades + estambres/hilos por color
│   └── images/product-placeholder.svg   # Imagen de respaldo si falla una foto
└── src/
    ├── main.jsx                   # Punto de entrada
    ├── App.jsx                    # Orquestador: Navbar + Hero + Catalog + StoreInfo + Footer
    ├── index.css                  # Tailwind + estilos base
    │
    ├── config/
    │   └── site.js                # ⚙️  BRAND, CATEGORIES, SECTIONS, WhatsApp y redes
    │
    ├── data/
    │   ├── manualidades.js        # 📦 105 piezas artesanales (sin variantes)
    │   ├── products.js            # 📦 Fuente única: manualidades + estambres/hilos
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
    │   ├── whatsapp.js            # Construye URLs wa.me con producto y color
    │   ├── catalog.js             # Búsqueda, filtros, orden y familias de color
    │   ├── color.js               # Familias, paleta fallback y contraste
    │   └── format.js              # Precios en MXN
    │
    └── components/
        ├── Navbar.jsx              # Marca + secciones + CTA de WhatsApp (sticky)
        ├── Hero.jsx                # Portada Bento (marca, portafolio, color, sello)
        ├── Catalog.jsx             # ⭐ Reparte diseños/materiales + modal compartido
        ├── Portfolio.jsx           # Portafolio #disenos: subcategorías + paginación
        ├── DesignCard.jsx          # Tarjeta de diseño a pedido (sin precio ni stock)
        ├── Materials.jsx           # Materiales #materiales: hilos y estambres
        ├── SectionHeading.jsx      # Encabezado común de las dos secciones
        ├── ProductCard.jsx         # Material: selector de color, stock y WhatsApp
        ├── ProductDetailModal.jsx  # Detalle: copy de encargo o de material
        ├── ColorSwatchPicker.jsx   # Muestras circulares colapsables (6 + N)
        ├── SubcategoryFilter.jsx   # Tipos de diseño del portafolio
        ├── ProductCardSkeleton.jsx # Esqueletos de carga
        ├── StoreInfo.jsx           # Dirección, horario, contacto, marcas y servicios
        ├── SocialIcon.jsx          # Iconos de Instagram y Facebook
        ├── BackToTop.jsx           # Botón de volver arriba
        └── Footer.jsx              # CTA final + accesos rápidos + aviso legal
```

---

## 🎨 Identidad visual

| Token                | Uso                                    | Valor     | Contraste medido           |
| -------------------- | -------------------------------------- | --------- | -------------------------- |
| `canvas`             | Fondo general (papel cálido)           | `#FAF7F2` | —                          |
| `surface`            | Tarjetas y contenedores                | `#FFFDF9` | —                          |
| `line`               | Bordes y divisores                     | `#E8DED1` | decorativo                 |
| `sand-50/100/200`    | Cajas suaves, esqueletos y estados     | `#FBF7F1` → `#E9DFD1` | decorativo |
| `ink`                | Texto principal                        | `#2C2A29` | 13.37:1 sobre canvas        |
| `ink-soft`           | Texto secundario                       | `#57534E` | 7.14:1 sobre canvas         |
| `ink-muted`          | Texto terciario y placeholders         | `#6B6577` | 5.24:1 sobre canvas         |
| `brand` (= `lila-700`)| Botones y acentos                      | `#8363C9` | **4.57:1** con texto blanco |
| `lila-600`           | Acentos, iconos y degradados           | `#9B7EDE` | 3.02:1, solo texto grande   |
| `lila-800`           | Antetítulos, etiquetas y hovers        | `#6B4FA8` | 5.94:1 sobre canvas         |
| `success`            | Etiqueta "Disponible" (sobre `-soft`)  | `#237A4B` | 4.75:1                     |
| `danger`             | Etiqueta "Agotado" (sobre `-soft`)     | `#B23A46` | 5.15:1                     |
| `whatsapp`           | Hover de los botones de cotización     | `#107C41` | 5.27:1 con texto blanco     |

> **Base cálida, acento lila:** la dirección visual apuesta por papel y tela (canvas
> `#FAF7F2`, tarjetas `#FFFDF9`) en lugar de un lila frío de fondo. El lila se conserva
> para botones, antetítulos y detalles, donde mantiene el contraste AA. Las texturas
> `.texture-linen` y `.texture-grain` (en `src/index.css`) son CSS puro —cero peticiones—
> y se desactivan con `prefers-reduced-motion`.

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

## 🏪 Tienda y contacto

Estos datos viven en `CONTACT`, `MATERIAL_BRANDS`, `STORE_EXTRAS` y `STORE_SERVICES` de
`src/config/site.js`. `StoreInfo.jsx` los muestra en la sección **Tienda**, que también es el
destino del enlace "Tienda" de la navbar. El footer ya no repite la ficha de contacto: solo
cierra con una llamada a la acción, la identidad de la marca, accesos rápidos y el aviso legal.

| Dato | Valor |
| --- | --- |
| Dirección | San Antonio el Desmonte, calle 24 de febrero No. 33 |
| Referencia | Dentro de "Ferre-eléctrica Chofo" |
| Horario | 1:00 pm a 9:00 pm |
| Teléfono / WhatsApp | 771-141-5822 |
| Instagram | @manualidades_lua_ |
| Facebook | Manualidades lua |

**Marcas y tipos de hilo/estambre:** Sinfonía, La Abuelita, Alize Velluto, Karina Komfy Mini,
Candy, Karina Kairo, Karina Kotton Milk, Cristal, Hilo Vela e Hilo para coser.

**También encontrarás:** accesorios para tejido, bastidores/aros de bordado y ganchillos.

**Servicio:** tejido 100% a mano y levantamiento de pedidos.

> **Precios:** solo la categoría **Hilos** publica precio (`PRICED_CATEGORIES`). Manualidades y
> estambres muestran **"A cotizar"**, porque el costo depende del tamaño, el color y la
> personalización. Por la misma razón, el JSON-LD solo genera `offers` para los hilos y el
> orden por precio manda al final las piezas a cotizar.

---

## 🔎 SEO

- **Canonical y Open Graph** con URL **absoluta**, inyectada en `index.html` por un plugin de
  `vite.config.js` a partir de `VITE_SITE_URL`. Las redes sociales y los mensageros no resuelven
  rutas relativas.
- **Datos estructurados JSON-LD** (`Organization`, `WebSite` y dos `ItemList`) generados en el
  build desde `src/data/products.js`, para que los buscadores tengan el contenido sin ejecutar
  JavaScript:
  - `#disenos` publica las piezas como `VisualArtwork` (portafolio) **sin oferta ni
    disponibilidad**: no son inventario.
  - `#materiales` publica hilos y estambres como `Product`. Solo los hilos llevan `offers` con
    precio y stock; los estambres se cotizan y no se inventa una cifra.
  La imagen publicada es la de la primera variante con stock.

---

## 💬 Flujo de WhatsApp

Cada tarjeta abre `https://wa.me/<numero>?text=<mensaje codificado>` con un mensaje corto que
identifica lo que el cliente quiere:

- **Diseños del portafolio** (hechos a pedido): toman la pieza como referencia.

```
Hola, me interesa encargar un diseño como: Ramo romántico pastel (Flores). ¿Me podrían cotizar?
```

- **Hilos y estambres**: incluyen el color elegido, si aplica.

```
Hola, me interesa pedir: Estambre Kotton Milk (Color: 06 - Vidrio)
```

El contacto general del hero y del footer usa un mensaje más largo:

```
¡Hola! Gracias por visitar el catálogo de Manualidades Lua.

Me gustaría recibir más información sobre sus creaciones tejidas a mano.

¿Me podrían compartir precios, tiempos de entrega y opciones de personalización?
¡Muchas gracias!
```

Los mensajes van **sin emoji a propósito**: el texto viaja dentro de una URL y hay clientes de
WhatsApp que solo aceptan el Plano Básico Multilingüe, así que un emoji de 4 bytes se les
convierte en un cuadrito con interrogante justo en el primer mensaje que ve el comprador. Los
acentos y la `ñ` (2 bytes) no tienen ese problema. Los asteriscos sí se conservan porque son
negrita nativa de WhatsApp en cualquier versión.

### ⚠️ Configura tu número

Abre `src/config/site.js` y ajusta el número de la tienda. Debe llevar el `52` inicial (clave
de México, que exige el formato `wa.me`) y los 10 dígitos sin guiones:

```js
export const WHATSAPP_NUMBER = '527711415822' // 771-141-5822, lada de Pachuca, Hidalgo
```

Para una lada distinta solo cambian los 10 últimos dígitos. `CONTACT` guarda además el
teléfono visible y el enlace `tel:` del mismo número. Las redes viven en `SOCIAL_LINKS`
(Instagram y Facebook); para añadir otra basta con una entrada en ese array y su icono en
`Navbar.jsx`, `Footer.jsx` y `StoreInfo.jsx`. Todo el resto de la app leerá esos valores.

---

## 🏗️ Arquitectura: designed for CRUD

La UI **nunca** importa el JSON directamente. Sigue siempre esta cadena:

```
Catalog → Portfolio/Materials      ← componentes puros de presentación
        ↓
     useProducts()                 ← hook: loading / error / refetch
        ↓
   productService.js               ← ÚNICA pieza que conoce el origen de los datos
        ↓
  mockRepository  ⇄  httpRepository (fetch)
   products.js           API REST
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
  brand       VARCHAR(80),
  category    VARCHAR(80)  NOT NULL, -- manualidades | estambres | hilos
  price       NUMERIC(10,2) NOT NULL,
  description TEXT         NOT NULL DEFAULT '',
  image_url   TEXT,
  available   BOOLEAN      NOT NULL DEFAULT TRUE,
  tags        TEXT[]       NOT NULL DEFAULT '{}'
);

CREATE TABLE product_variants (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_code  VARCHAR(10) NOT NULL,
  color_name  VARCHAR(80) NOT NULL,
  hex_color   VARCHAR(7),
  image_url   TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  UNIQUE (product_id, color_code)
);
```

### Detalles de diseño pensados para crecer

- **Dos bloques, dos intenciones**: `Catalog.jsx` separa los datos por categoría y entrega
  `manualidades` a `Portfolio` y el resto a `Materials`. El portafolio no muestra precio, stock ni
  badge de disponibilidad; los materiales sí, porque son la parte comprable.
- **Portafolio por tandas**: 8 diseños visibles, filtro por tipo (Amigurumis, Eventos, Flores,
  Llaveros) y botón "Ver más diseños" con contador "Mostrando X de Y". Cambiar de tipo reinicia la
  tanda.
- **Materiales directos**: los 4 productos (2 estambres y 2 hilos) se muestran sin buscador,
  orden, filtros de categoría ni familias de color. Menos controles, menos carga visual.
- **Variantes de color**: solo los productos de `estambres` e `hilos` muestran el selector. Al
  cambiar de color se actualizan la foto, el stock y el mensaje de WhatsApp de esa tarjeta.
  Los nombres de archivo (`01_BLANCO_KOMFY.webp`, `07_VIDRIO_KOTTON_MILK.webp`) son la fuente del
  código y del nombre del color; `parseDriveFilename()` los traduce al modelo de la UI.
- **Precio solo en hilos**: `PRICED_CATEGORIES` sigue siendo la fuente única. Las manualidades
  del portafolio se cotizan y los estambres muestran "A cotizar".
- **Imagen de respaldo**: si la foto falla, la tarjeta muestra el placeholder de marca
  (`onError` en `ProductCard.jsx` y `DesignCard.jsx`); nunca se ve el ícono de imagen rota.
- **Estados incluidos**: carga (skeletons), error con reintento, categoría sin diseños, material
  agotado y color agotado.
- **Swatches colapsables**: los productos con más de 6 colores muestran `6 + N`; al expandir
  se ven todos. Si la variante activa cae fuera de la primera tanda, se reserva su lugar.
- **Información sin duplicados**: la ficha de tienda (dirección, horario, teléfono y redes) se
  muestra una sola vez en `StoreInfo`; el footer cierra con CTA, identidad, accesos rápidos y
  aviso legal. La explicación de precios vive una sola vez en el encabezado de Materiales y las
  redes ya no se repiten en la navbar.
- **Accesibilidad**: HTML semántico, `aria-label` / `aria-pressed` / `aria-live`, foco visible,
  paleta con contraste AA y respeto a `prefers-reduced-motion`. El filtro de tipos usa
  `aria-pressed` (son botones de filtro) y no el patrón `tablist`, que exigiría un `tabpanel`
  y navegación con flechas que aquí no existen.
- **Responsive**: el portafolio usa 2 columnas en móvil, 2 en tablet, 3 en escritorio y 4 en
  pantallas anchas; Materiales pasa de 1 a 2 y a 4. La navbar de móvil coloca la navegación en
  una segunda fila desplazable y `scroll-padding-top` compensa la cabecera fija al usar anclas.

---

## 🧪 Verificación realizada

- `npm run lint` → sin errores ni advertencias.
- `npm run build` → `✓ built` (JS 287.67 kB / 73.64 kB gzip · CSS 36.59 kB / 7.07 kB gzip ·
  HTML 57.41 kB / 6.86 kB gzip). El HTML subió porque ahora publica dos listas JSON-LD
  separadas (diseños y materiales), pero el JS bajó al retirar buscador, orden y filtros que ya
  no se usan.
- **Datos separados:** 105 diseños en `#disenos` y 4 materiales en `#materiales` (2 estambres y
  2 hilos).
- **Variantes:** las 36 rutas de imagen generadas por `npm run variants` existen en
  `public/images/catalogo/estambres` y `public/images/catalogo/hilos` (18 + 18).
- **Precios:** solo las tarjetas de Hilos muestran precio; los estambres muestran "A cotizar" y
  los diseños del portafolio no muestran precio ni disponibilidad. En el JSON-LD, `#disenos`
  publica 105 `VisualArtwork` sin `offers`; `#materiales` publica 4 `Product` y solo los 2 hilos
  llevan `offers` (`price`, `priceCurrency` y `availability`).
- **Portafolio (Playwright, 1440 px y 390 px):** se ven 8 diseños al entrar; el filtro
  "Amigurumis" muestra "Mostrando 8 de 40 diseños"; "Ver más diseños" sube a 16 y el contador lo
  refleja; "Todos los diseños" vuelve a 105 y reinicia la tanda.
- **Modal de diseño:** muestra "Hecho por encargo", "Se cotiza a tu medida" y el CTA
  "Quiero uno así"; no aparece "Disponible"/"Agotado" ni selector de color. El enlace de WhatsApp
  envía `Hola, me interesa encargar un diseño como: Abejita (Amigurumis). ¿Me podrían cotizar?`.
- **Modal de material:** los estambres conservan el selector de color, el stock y "A cotizar";
  los hilos muestran su precio. El CTA es "Pedir o cotizar por WhatsApp".
- **Sin desbordamiento horizontal** en 1440, 390, 375, 360 y 320 px. La navbar mide 73 px en
  escritorio y 95 px en móvil; en 320 px los cuatro enlaces de navegación caben sin scroll. Los
  anclas dejan 88 px de margen en escritorio y 120 px en móvil, por encima de la cabecera fija.
- **Redundancia (DOM):** dirección, horario y teléfono aparecen una sola vez en `StoreInfo`; las
  redes ya no se repiten en la navbar; el portafolio no repite "A cotizar" en cada tarjeta y la
  explicación de precios vive solo en el encabezado de Materiales.
- **Contraste:** las 21 combinaciones texto/fondo que usa la interfaz se comprobaron contra
  WCAG AA. Antes fallaban cinco —botones morados (3.26:1), texto terciario (3.27:1) y las
  etiquetas "Disponible"/"Agotado" (2.43 y 3.08)—; ahora la más justa es el botón morado con
  4.57:1.
- **Tipografías:** peso real de los woff2 medido contra Google Fonts (latin + latin-ext):
  Fraunces pasó de 77.2 kB a 42.3 kB al fijarle el peso en 600. Quitar el eje `ital` no ahorra
  bytes reales (el navegador nunca descargaba la cursiva), pero sí 3.7 kB del CSS.
- **Render:** comprobaciones sobre el HTML generado con el catálogo real (navegación de cuatro
  secciones, `aria-pressed` sin restos de `tablist`, srcset AVIF y WebP, `alt` en todas las
  imágenes, dos listas JSON-LD y ausencia de marcadores sin sustituir).
