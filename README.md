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

> **Nota Windows:** si `npm install` avisa sobre *install scripts* de `esbuild`, ejecuta
> `npm approve-scripts esbuild` una sola vez. Es lo que permite que Vite compile.

---

## 📁 Estructura del proyecto

```
manualidades-lua/
├── index.html                     # Meta tags, Open Graph y tipografías
├── vite.config.js
├── tailwind.config.js             # Paleta y sistema de diseño de la marca
├── postcss.config.js
├── eslint.config.js
├── public/
│   ├── favicon.svg
│   └── images/product-placeholder.svg   # Imagen de respaldo si falla una foto
└── src/
    ├── main.jsx                   # Punto de entrada
    ├── App.jsx                    # Orquestador: Navbar + Hero + Grid + Footer
    ├── index.css                  # Tailwind + estilos base
    │
    ├── config/
    │   └── site.js                # ⚙️  BRAND, CATEGORIES, WhatsApp y redes (edita aquí)
    │
    ├── data/
    │   └── products.json          # 📦 Catálogo mock (16 productos, 4 categorías)
    │
    ├── services/
    │   └── productService.js      # 🔌 CAPA DE DATOS (JSON ⇄ API REST)
    │
    ├── hooks/
    │   └── useProducts.js         # Estado de carga / error / refetch
    │
    ├── utils/
    │   ├── whatsapp.js            # Construye URLs wa.me con mensaje prellenado
    │   └── catalog.js             # Búsqueda, filtros y categorías (funciones puras)
    │
    └── components/
        ├── Navbar.jsx              # Marca + eslogan + Instagram/Facebook (sticky)
        ├── Hero.jsx               # Portada
        ├── SearchBar.jsx          # Búsqueda por nombre/etiqueta
        ├── CategoryFilter.jsx     # Filtro de categorías dinámico
        ├── ProductGrid.jsx        # ⭐ Estado de búsqueda + filtrado + grid
        ├── ProductCard.jsx        # Tarjeta + botón de WhatsApp
        ├── ProductCardSkeleton.jsx# Esqueletos de carga
        ├── EmptyState.jsx         # Sin resultados / error
        └── Footer.jsx             # CTA de contacto
```

---

## 🎨 Identidad visual

| Token               | Uso                       | Valor     |
| ------------------- | ------------------------- | --------- |
| `canvas`            | Fondo general             | `#F7F5FC` |
| `surface`           | Tarjetas y contenedores   | `#FFFFFF` |
| `line`              | Bordes y acentos          | `#E3D5F2` |
| `ink`               | Texto principal           | `#2C2A29` |
| `brand` / `lila-600`| Botones y acentos         | `#9B7EDE` |
| `display`           | Títulos (Fraunces)        | serif     |
| `sans`              | Texto (Inter)             | system-ui |

> Los colores viven **solo** en `tailwind.config.js`. Para un rebrand, cambia esos 5 valores y
> toda la aplicación se actualiza.

---

## 💬 Flujo de WhatsApp

Cada tarjeta abre `https://wa.me/<numero>?text=<mensaje codificado>` con:

```
¡Hola! 👋 Vi el catálogo de *Manualidades Lua* y me interesa este producto:

🧶 *Osito Amigurumi Grande*
📂 Categoría: Amigurumis
🏷️ Etiquetas: figura grande, decoración, regalo

Quisiera saber el *precio* y si es posible *personalizarlo* (colores, detalles, tamaño).
También me gustaría confirmar disponibilidad y tiempo de entrega. ¡Gracias! 💜
```

### ⚠️ Configura tu número

Abre `src/config/site.js` y reemplaza el placeholder:

```js
export const WHATSAPP_NUMBER = '5210000000000' // 👈 pon aquí tu número real
```

También actualiza las URLs de `SOCIAL_LINKS` (`instagram.com/manualidades_lua_` y el Facebook
correspondiente). Todo el resto de la app leerá esos valores.

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
- **Accesibilidad**: HTML semántico, `aria-label` / `aria-selected` / `aria-live`, foco visible
  y respeto a `prefers-reduced-motion`.
- **Responsive**: 1 columna en móvil, 2 en tablet, 3 en escritorio; filtros en carrusel con
  `scroll-snap` en pantallas pequeñas.

---

## 🧪 Verificación realizada

- `npm run lint` → sin errores ni advertencias.
- `npm run build` → `✓ built` (JS 181 kB / 57 kB gzip · CSS 27 kB / 5.7 kB gzip).
- Lógica verificada con esbuild + node: 16 productos repartidos 4/4/4/4 en las 4 categorías,
  orden del filtro correcto, filtrado por categoría sin fugas, categoría vacía visible con `0`,
  búsqueda sin acentos, agotados al final y las 16 URLs `wa.me` con el nombre del producto.
