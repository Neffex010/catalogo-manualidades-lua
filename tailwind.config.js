/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      /* ------------------------------------------------------------------
       * PALETA DE MARCA - Manualidades Lua
       * Lila ultra suave / blanco / lila lavanda / morado artesanal
       *
       * CONTRASTE: los colores "rellenos" (los que llevan texto blanco encima)
       * se eligieron para cumplir WCAG AA (>= 4.5:1) contra blanco. El antiguo
       * #9B7EDE daba solo 3.26:1 y hacia ilegible el texto de todos los
       * botones. Si subes el tono, revisa la relacion de contraste.
       * ---------------------------------------------------------------- */
      colors: {
        // Fondo general de la aplicacion
        canvas: '#F7F5FC',
        // Tarjetas y contenedores
        surface: '#FFFFFF',
        // Acentos, bordes y divisores
        line: '#E3D5F2',
        // Texto principal
        ink: {
          DEFAULT: '#2C2A29', // Gris oscuro / negro suave
          soft: '#57534E', // Texto secundario (7.06:1 sobre canvas)
          muted: '#6B6577', // Texto terciario / placeholders (5.17:1 sobre canvas)
        },
        // Escala de lila de la marca
        lila: {
          50: '#FAF8FE',
          100: '#F7F5FC',
          200: '#EFE9FA',
          300: '#E3D5F2', // Lavanda suave (bordes)
          400: '#CFBBF0',
          500: '#B79EE6',
          600: '#9B7EDE', // Morado artesanal (botones / destaques)
          700: '#8363C9',
          800: '#6B4FA8',
          900: '#4E3878',
        },
        // Color de marca principal (el que se usa CON texto blanco encima)
        brand: '#8363C9',
        // Verde de "disponible" y rojo suave de "agotado".
        // Los DEFAULT son los tonos legibles sobre sus fondos `soft`.
        success: {
          DEFAULT: '#237A4B',
          soft: '#E7F6EE',
        },
        danger: {
          DEFAULT: '#B23A46',
          soft: '#FCEDEE',
        },
        // Verde de WhatsApp, version legible con texto blanco (5.27:1).
        whatsapp: '#107C41',
      },

      /* Tipografia elegante y de aspecto artesanal.
         Fraunces se sirve con el peso fijo en 600 (ver index.html), asi que
         `font-display` se usa siempre con `font-semibold`. */
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },

      /* Sombras suaves y difusas, coherentes con el estilo artesanal.
       * El tinte violeta sigue al color de marca (#8363C9) para que el Morado
       * de la caja no desentone con los botones. */
      boxShadow: {
        soft: '0 1px 2px rgba(44, 42, 41, 0.04), 0 8px 24px -8px rgba(131, 99, 201, 0.18)',
        card: '0 1px 3px rgba(44, 42, 41, 0.05), 0 12px 32px -12px rgba(131, 99, 201, 0.22)',
        lift: '0 8px 16px -6px rgba(44, 42, 41, 0.10), 0 24px 48px -16px rgba(131, 99, 201, 0.32)',
        brand: '0 8px 20px -6px rgba(131, 99, 201, 0.5)',
        whatsapp: '0 8px 20px -6px rgba(16, 124, 65, 0.45)',
      },

      /* Radios generosos para el aspecto suave de la marca */
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      /* Proporcion vertical de las tarjetas de producto (4:5) */
      aspectRatio: {
        '4/5': '4 / 5',
      },

      /* Animaciones propias */
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.8s infinite',
      },

      transitionTimingFunction: {
        artisan: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
