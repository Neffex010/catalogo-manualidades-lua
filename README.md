# 🧶 Manualidades Lua — Catálogo interactivo de crochet

> **Creaciones artesanales tejidas con amor**

Sitio web responsivo de **Manualidades Lua** con dos bloques con intención distinta:

- **Diseños tejidos a pedido** (`#disenos`): un portafolio con piezas reales que se tejen
  por encargo. No hay precio, stock ni inventario: la foto muestra la calidad del trabajo y
  el pedido se cotiza por WhatsApp.
- **Estambres y trapillo** (`#materiales`): cinco marcas con **todos** sus tonos (148 en
  total), cada una como tarjeta comprable. La tarjeta muestra cinco muestras; `+N` abre la
  ficha con la paleta completa y la cantidad. El pedido sale por WhatsApp con producto, código,
  color y cantidad. El precio y el stock son **opcionales**: si la tienda aún no los define,
  una sola nota en la sección invita a confirmarlos en lugar de inventar cifras. Al final, la
  **carta de color** muestra los 148 tonos en foto y cada uno se pide con un toque.

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
| `npm run variants`| Genera la foto 4:5 de cada tono (148)          |
| `npm run colors`  | Genera el manifiesto y las miniaturas de la carta |

> **Imágenes:** al añadir o reemplazar una foto en `public/images/catalogo/`, ejecuta
> `npm run images`. El script crea las versiones 400/600/800 en AVIF y WebP, el placeholder
> borroso y el color dominante, y actualiza `src/data/images.json`. Los PNG de
> `public/images/brand/` son los *masters*: si cambias el arte, reemplaza el PNG y vuelve a
> lanzarlo. Si te saltas este paso nada se rompe, pero esa foto se servirá como JPEG original
> a todos los dispositivos en vez de elegir la resolución adecuada.

> **Variantes de color:** las fotos originales viven en `assets/<marca>/` (fuera de
> `public/`, así que no se publican). La lista de tonos **no se escribe a mano**: sale de
> `src/data/colorCatalog.json`, el mismo manifiesto que alimenta la carta. Para añadir un
> color, deja la foto en `assets/<marca>/`, ejecuta `npm run colors` y después
> `npm run variants`. El segundo recorta cada original a 4:5 y lo guarda como WebP en
> `public/images/catalogo/estambres/<marca>/`, que es la ruta que ya espera el catálogo.

> **Carta de color:** `npm run colors` lee `assets/<marca>/`, ignora las capturas
> (`SmartSelect*`, `alize-velluto.jpg`), genera una miniatura cuadrada de 320 px por tono en
> `public/images/catalogo/carta-colores/<marca>/` y escribe `src/data/colorCatalog.json` con
> código, nombre, color promedio, miniatura y la ruta de la foto 4:5. Es idempotente: si
> cambias o agregas fotos, vuelve a lanzarlo. La carta es solo una referencia visual; el
> pedido sale por WhatsApp con marca, código y color.

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
│   ├── sync-variant-images.mjs    # Normaliza las fotos de colores (npm run variants)
│   └── build-color-catalog.mjs    # Carta de color por marca (npm run colors)
├── assets/
│   ├── alize velluto/             # Originales de Drive por marca (fuera de public)
│   ├── karina kairo/
│   ├── komfy mini/
│   ├── Kotton milk/
│   └── trapillo kraft/
├── public/
│   ├── favicon-32.png, favicon-192.png, apple-touch-icon.png
│   ├── og-image.jpg
│   ├── images/brand/                    # Logotipos (PNG = master, WebP = derivado)
│   ├── images/catalogo/                 # Manualidades + estambres/trapillo por tono
│   ├── images/catalogo/carta-colores/   # Miniaturas de la carta de color
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
    │   ├── products.js            # 📦 Fuente única: manualidades + 5 marcas de estambre
    │   ├── colorCatalog.json      # 🤖 Generado: marcas, tonos y miniaturas
    │   └── images.json            # 🤖 Generado: srcset, LQIP y color de cada foto
    │
    ├── services/
    │   └── productService.js      # 🔌 CAPA DE DATOS (JSON ⇄ API REST)
    │
    ├── hooks/
    │   ├── useProducts.js         # Estado de carga / error / refetch
    │   ├── useActiveSection.js    # Sección visible para la navbar (aria-current)
    │   └── useRevealOnScroll.js   # Anima las tarjetas al entrar en pantalla
    │
    ├── utils/
    │   ├── whatsapp.js            # URLs wa.me con producto, color y cantidad
    │   ├── availability.js        # Estado disponible / agotado / sin dato
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
        ├── Materials.jsx           # Materiales #materiales: estambres y trapillo
        ├── ColorCatalog.jsx        # Carta de color por marca (12 tonos + expandir)
        ├── SectionHeading.jsx      # Encabezado común de las dos secciones
        ├── ProductCard.jsx         # Material: tipo, tonos y pedido por WhatsApp
        ├── ProductDetailModal.jsx  # Detalle: paleta completa, cantidad y CTA
        ├── ColorSwatchPicker.jsx   # Muestras circulares (5 + N abre la ficha)
        ├── SubcategoryFilter.jsx   # Tipos de diseño del portafolio
        ├── ProductCardSkeleton.jsx # Esqueletos de carga
        ├── StoreInfo.jsx           # Dirección, horario, contacto, marcas y servicios
        ├── SocialIcon.jsx          # Iconos de Instagram y Facebook
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

**Marcas y tipos de hilo/estambre:** Sinfonía, La Abuelita, Alize Velluto, Komfy Mini,
Candy, Karina Kairo, Kotton Milk, Cristal, Hilo Vela e Hilo para coser. La sección Tienda
separa dos grupos: **Carta de color completa**, un enlace a Materiales para las marcas del
manifiesto (Alize Velluto, Komfy Mini, Karina Kairo, Kotton Milk y Trapillo Kraft), y
**También en tienda**, con las marcas que solo se consultan por WhatsApp. Así la tienda ya no
promete tonos con foto para marcas que no los tienen. Trapillo Kraft se muestra como
**trapillo**, no como estambre.

**Otros productos:** accesorios para tejido, bastidores/aros de bordado y ganchillos.

**Servicios:** tejido por encargo y pedidos personalizados.

> **Precios y stock:** ambos son opcionales y viven en `src/data/products.js`.
> - `price` numérico → la tarjeta publica la cifra. `null` o ausente → no se pinta el bloque
>   de precio; la sección lo explica una sola vez y el CTA de WhatsApp sigue visible. No se usa
>   `0` como sinónimo de "sin precio".
> - `stock` por tono → `N` disponible, `0` agotado, ausente = sin dato. Sin dato, la tarjeta no
>   repite "Existencia por confirmar" en cada marca: la nota de la sección y la ficha de la
>   pieza lo resuelven. La tienda puede empezar sin inventario y activarlo color por color.
>
> El JSON-LD solo genera `offers` cuando hay precio real, y el orden por precio manda al final
> las piezas sin cifra.

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
  - `#materiales` publica las cinco marcas de estambre como `Product`. Solo llevan `offers`
    cuando la tienda ya definió un precio real; la disponibilidad se declara únicamente si
    existe el dato. Nada de cifras o existencias inventadas.
  La imagen publicada es la de la primera variante disponible; si no hay dato, la primera.

---

## 💬 Flujo de WhatsApp

Cada tarjeta abre `https://wa.me/<numero>?text=<mensaje codificado>` con un mensaje corto que
identifica lo que el cliente quiere:

- **Diseños del portafolio** (hechos a pedido): toman la pieza como referencia.

```
Hola, me interesa encargar un diseño como: Ramo romántico pastel (Flores). ¿Me podrías cotizar?
```

- **Estambres y trapillo**: incluyen cantidad, producto, código y color elegido.

```
Hola, quiero pedir de Manualidades Lua: 2 ovillos de Estambre Kotton Milk, color 06 Vidrio. ¿Está disponible y cuánto cuesta?
```

El trapillo no se vende como ovillo de estambre: su mensaje usa **pieza(s)** para no afirmar una
presentación que la tienda no confirmó (`getUnitLabel` en `src/utils/whatsapp.js`). El modal
acompaña la etiqueta de cantidad con la misma unidad.

```
Hola, quiero pedir de Manualidades Lua: 3 piezas de Trapillo Kraft, color 01 Blanco. ¿Está disponible y cuánto cuesta?
```

- **Tonos de la carta de color**: no tienen tarjeta propia, así que la marca y el código son
  la referencia.

```
Hola, me interesa el tono 06 Vidrio de Alize Velluto. ¿Está disponible y cuánto cuesta?
```

El contacto general del hero y del footer usa un mensaje más largo:

```
¡Hola! Gracias por visitar el catálogo de Manualidades Lua.

Me gustaría recibir información sobre los estambres, los hilos y las piezas tejidas a mano.

¿Me podrías compartir precios, existencias y tiempos de entrega?
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
  price       NUMERIC(10,2),         -- NULL = se cotiza por WhatsApp
  description TEXT         NOT NULL DEFAULT '',
  image_url   TEXT,
  available   BOOLEAN,               -- NULL = sin dato (sobre pedido)
  tags        TEXT[]       NOT NULL DEFAULT '{}'
);

CREATE TABLE product_variants (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_code  VARCHAR(10) NOT NULL,
  color_name  VARCHAR(80) NOT NULL,
  hex_color   VARCHAR(7),
  image_url   TEXT,
  stock       INTEGER,               -- NULL = sin dato; 0 = agotado
  UNIQUE (product_id, color_code)
);
```

### Detalles de diseño pensados para crecer

- **Dos bloques, dos intenciones**: `Catalog.jsx` separa los datos por categoría y entrega
  `manualidades` a `Portfolio` y el resto a `Materials`. El portafolio no muestra precio, stock ni
  badge de disponibilidad; los materiales muestran esos datos solo cuando existen.
- **Portafolio por tandas**: 6 diseños visibles, filtro por tipo (Amigurumis, Eventos, Flores,
  Llaveros) y botón "Ver 8 más · N diseños", que lleva el conteo dentro del propio botón.
  Cambiar de tipo reinicia la tanda.
- **Materiales directos**: las 5 marcas de estambre y trapillo (148 tonos en total) se
  muestran sin buscador, orden, filtros de categoría ni familias de color. Menos controles,
  menos carga visual. El título de cada tarjeta es la marca, el chip dice el tipo real
  (`Estambre`, `Estambre e hilo`, `Trapillo`) y el selector muestra 3 muestras + `+N`; el
  conteo total vive en la ficha y en la carta, no se repite en cada tarjeta.
- **Variantes de color**: cada marca trae el selector completo. Al cambiar de tono se
  actualizan la foto, la disponibilidad y el mensaje de WhatsApp de esa tarjeta. La lista no
  se mantiene a mano: `src/data/colorCatalog.json` guarda código, nombre, color promedio y
  las dos rutas de imagen (miniatura de la carta y foto 4:5 de la tarjeta), y
  `products.js` la convierte en variantes comprables.
- **Precio y stock opcionales**: el producto publica precio si `price` es numérico. Sin cifra
  no se pinta un bloque vacío en cada tarjeta: una nota bajo el encabezado avisa que precios y
  existencias se confirman por WhatsApp, y solo aparece si ninguna marca tiene datos. El stock
  por tono es `número` (disponible), `0` (agotado) o ausente (sin dato). El helper
  `src/utils/availability.js` centraliza esa lectura y evita que "sin dato" se confunda con
  "agotado".
- **Imagen de respaldo**: si la foto falla, la tarjeta muestra el placeholder de marca
  (`onError` en `ProductCard.jsx` y `DesignCard.jsx`); nunca se ve el ícono de imagen rota.
- **Estados incluidos**: carga (skeletons), error con reintento, categoría sin diseños, material
  agotado (solo con dato real) y color agotado (solo si se marcó con `stock: 0`).
- **Selector compacto**: la tarjeta muestra 3 muestras y `+N` (sin el código pintado dentro:
  el tono activo ya se lee en la línea "Tono"); ese botón abre la ficha con la paleta completa
  y sus códigos, en lugar de estirar la tarjeta. Si la variante activa cae fuera de la primera
  tanda, se reserva su lugar. Al abrir la ficha, el tono elegido se conserva
  (`initialVariantId`).
- **Información sin duplicados**: la ficha de tienda (dirección, horario, teléfono y redes) se
  muestra una sola vez en `StoreInfo`, con teléfono y WhatsApp en una sola fila porque son el
  mismo número; "Otros productos" y "Servicios" comparten una franja de etiquetas. El footer
  cierra con CTA, identidad y aviso legal; sus accesos rápidos se ocultan en móvil porque la
  cabecera fija ya los repite. El hero tiene un solo acceso a Materiales y su paleta enlaza a la
  carta completa en lugar de repetir la invitación a elegir un tono; en móvil la ficha de dos
  columnas se reduce a la línea de autoría. La carta de color toma sus tonos del mismo manifiesto
  que el catálogo; las pestañas declaran cuántos tonos tiene cada marca y el panel no repite ese
  conteo. Las tarjetas de material ya no repiten el total de tonos: el chip `+N` y la carta lo
  cubren. En Tienda, las 5 marcas de la carta se resumen en un enlace a Materiales y solo se
  listan las que no tienen carta.
- **Voz de una sola artesana**: el copy habla en primera persona ("tejo", "te cotizo",
  "escríbeme"), no en plural. Los mensajes de WhatsApp también usan el singular
  ("¿Me podrías...?").
- **Accesibilidad**: HTML semántico, `aria-label` / `aria-pressed` / `aria-live`, foco visible,
  paleta con contraste AA y respeto a `prefers-reduced-motion`. El filtro de tipos usa
  `aria-pressed` (son botones de filtro) y no el patrón `tablist`, que exigiría un `tabpanel`
  y navegación con flechas que aquí no existen. La navegación fija marca la sección visible con
  `aria-current="location"`; hay un enlace "Saltar al contenido" para teclado; la ficha modal
  atrapa el foco, lo devuelve a la tarjeta al cerrar y se anuncia con `aria-labelledby` y
  `aria-describedby`.
- **Responsive**: el portafolio usa 2 columnas en móvil, 2 en tablet, 3 en escritorio y 4 en
  pantallas anchas; Materiales usa 2 columnas desde 320 px y 3 desde `md`, con tarjetas
  compactas (foto, título, tono y CTA). La sexta celda del grid es una tarjeta de contacto
  ("¿Buscas otra marca?") que completa cualquier rejilla sin inventar un producto. La carta de
  color usa 6 columnas en escritorio, 4 en tablet y 3 en móvil, con pestañas que se envuelven en
  varias filas para que ninguna marca quede cortada. La navbar de móvil coloca la navegación en
  una segunda fila desplazable y `scroll-padding-top` compensa la cabecera fija al usar anclas.

---

## 🧪 Verificación realizada

- `npm run lint` → sin errores ni advertencias.
- `npm run build` → `✓ built` (JS 325.95 kB / 80.16 kB gzip · CSS 44.87 kB / 8.57 kB gzip ·
  HTML 57.09 kB / 6.57 kB gzip). El HTML publica dos listas JSON-LD separadas (diseños y
  materiales).
- **Datos separados:** 105 diseños en `#disenos` y 5 marcas en `#materiales` (25 + 25 + 34 +
  17 + 47 = 148 tonos).
- **Variantes:** `npm run variants` generó 148 fotos 4:5 en
  `public/images/catalogo/estambres/<marca>/` (9.8 MB). La carpeta legacy
  `public/images/catalogo/hilos/` se eliminó: no hay productos de hilo con foto propia.
- **Precios y stock:** ninguna tarjeta inventa cifras. Sin `price` no se pinta el bloque y la
  sección explica una sola vez que se confirman por WhatsApp; sin `stock` no se repite
  "Existencia por confirmar" en cada tarjeta. En el JSON-LD, `#materiales` publica 5 `Product`
  sin `offers` mientras no haya precio.
- **Materiales (Edge headless, 1440 px y 390 px):** se ven las 5 tarjetas con su selector de
  tonos y la sexta celda "¿Buscas otra marca?" en cualquier ancho; en escritorio el grid queda
  3 + 3 y en móvil 2 + 2 + 2. Cada tarjeta muestra 3 muestras y el chip `+N` en una sola fila y
  mide **406 px** en 390 px (antes 716 px); la sección baja de **4,963 px a 2,296 px** y la página
  de 10,556 px a **7,205 px**. Sin desbordamiento horizontal y con la consola limpia.
- **Modal de material:** el título es la marca y el chip dice el tipo real (`Estambre`,
  `Trapillo`). La paleta muestra los 25/34/47 tonos completos, el tono elegido en la tarjeta se
  conserva al abrir y la ficha arranca en "Tono seleccionado". En móvil la foto se limita a
  `42vh` y el CTA queda fijo al pie del modal; en escritorio el botón vive al final de la
  columna y "Compartir" está en el encabezado, sin chocar con el cierre. Con 3 unidades, el
  mensaje es `Hola, quiero pedir de Manualidades Lua: 3 ovillos de Estambre Komfy Mini, color 01
  Blanco. ¿Está disponible y cuánto cuesta?`; para Trapillo Kraft dice `3 piezas` y la etiqueta
  del contador es `Cantidad (piezas)`.
- **Carta de color:** las 5 pestañas muestran 25/25/34/17/47 tonos con "Ver los N tonos"; cada
  tono es un enlace `wa.me` con marca, código y nombre. La cuadrícula ya no repite un icono de
  WhatsApp en cada tono: la instrucción vive una sola vez en el encabezado. Se abren 6 muestras
  (dos filas en móvil) y el botón suma el resto. El hero declara "5 marcas · 148 tonos" y la
  carta no repite el conteo: cada pestaña ya lo muestra. El grid queda en 6 columnas en
  escritorio (6 muestras = una fila), 4 en tablet y 3 en móvil. Las pestañas se envuelven en
  varias filas: en 390 px caben las 5 sin cortes ni scroll horizontal.
- **Portafolio (Edge headless, 1440 px y 390 px):** se ven 6 diseños al entrar; el filtro
  "Amigurumis" muestra 6 de 40 y el botón indica "Ver 8 más · 40 diseños"; al pulsarlo sube a 14
  y el anuncio de lectores de pantalla lo refleja; "Todos los diseños" vuelve a 105 y reinicia
  la tanda.
- **Modal de diseño:** muestra "Hecho por encargo", "Lo cotizo a tu medida" y el CTA
  "Quiero uno así"; no aparece "Disponible"/"Agotado" ni selector de color. El enlace de WhatsApp
  envía `Hola, me interesa encargar un diseño como: Abejita (Amigurumis). ¿Me podrías cotizar?`.
- **Sin desbordamiento horizontal** en 1440, 1280, 768, 640, 390, 375, 360 y 320 px. La navbar
  mide 73 px en escritorio y 109 px en móvil; en 320 px los cuatro enlaces de navegación caben sin
  scroll. Los anclas dejan 88 px de margen en escritorio y 120 px en móvil, por encima de la
  cabecera fija.
- **Medidas finales (Edge headless, `scrollHeight`):** 390×844 → página **7,205 px**, secciones
  966 / 1,491 / 2,296 / 1,511 / 637 y tarjeta de material **406 px**; 320×720 → **7,197 px** y
  tarjeta **373 px**; 640×900 → **8,907 px** y tarjeta **650 px**; 768×900 → **7,873 px** y
  tarjeta **623 px**; 1280×900 → **6,760 px** y tarjeta **799 px**. La página baja de 10,556 px
  a 7,205 px en móvil (−3,351 px, −32 %) y de los 12,294 px originales (−5,089 px). Las 3 muestras
  y el chip `+N` caben en una sola fila en todos los anchos medidos.
- **Redundancia (DOM):** dirección, horario y teléfono aparecen una sola vez en `StoreInfo`, con
  teléfono y WhatsApp en la misma fila; las redes no se repiten en la navbar; el hero tiene un
  único acceso a Materiales y su paleta enlaza a la carta. En `#materiales` las menciones visibles
  de "WhatsApp" bajan de 17 a 5 y desaparecen "Existencia por confirmar" y "Precio por WhatsApp"
  de cada tarjeta; "colores" se unifica como "tonos". Las tarjetas muestran 3 muestras sin repetir
  el total, la carta concentra la paleta completa y Tienda resume las marcas de la carta en un
  enlace.
- **Pulido de navegación:** la navbar subraya la sección activa (`aria-current`), el salto directo
  "Ir a la carta de color" evita recorrer las cinco tarjetas y el botón flotante de volver arriba
  se retiró: la cabecera fija ya ofrece "Inicio" y el flotante tapaba el CTA de las tarjetas.
  En móvil las descripciones de material se ocultan (la ficha las conserva), como ya hacía el
  portafolio, y el pie eliminó el enlace duplicado a WhatsApp.
- **Teclado y foco:** "Saltar al contenido" aparece como botón fijo de 164×48 px al recibir foco
  (verificado con `Emulation.setFocusEmulationEnabled`; sin eso, un headless reporta 1×1 px
  porque la ventana no tiene foco y `:focus` no matchea). La ficha modal enfoca el diálogo al
  abrir, encierra Tab/Shift+Tab entre sus 29 controles visibles y devuelve el foco a la tarjeta al
  cerrar. El scrollspy marca "Inicio", "Diseños", "Materiales" y "Tienda" con `aria-current`.
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
