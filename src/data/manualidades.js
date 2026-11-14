/**
 * manualidades.js
 * -----------------------------------------------------------------------------
 * Catalogo de piezas artesanales (amigurumis, eventos, flores y llaveros).
 *
 * Estas piezas son unicas y no manejan variantes de color ni precio fijo:
 * por eso `variants` siempre es un array vacio y cada pieza se cotiza por
 * WhatsApp segun tamano, color y detalles. Los valores por defecto
 * (category: 'manualidades', width: 800, height: 1000)
 * se asignan centralizadamente mediante definePiece para evitar codigo redundante.
 * -----------------------------------------------------------------------------
 */

function definePiece(data) {
  return {
    category: 'manualidades',
    width: 800,
    height: 1000,
    variants: [],
    ...data,
  }
}

export const MANUALIDADES = [
  {
    "id": "1",
    "name": "Abejita",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de abeja.",
    "imageUrl": "/images/catalogo/amigurumis/aveja.jpg",
    "tags": [
      "abeja",
      "cute",
      "pequeño"
    ]
  },
  {
    "id": "2",
    "name": "Ballenita Azul",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de ballena en azul.",
    "imageUrl": "/images/catalogo/amigurumis/ballena-azul.jpg",
    "tags": [
      "ballena",
      "figura grande",
      "decoración"
    ]
  },
  {
    "id": "3",
    "name": "Ballenita Morada",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de ballena en morado.",
    "imageUrl": "/images/catalogo/amigurumis/ballenita-morada.jpg",
    "tags": [
      "ballenita",
      "tonos pastel",
      "abrazo"
    ]
  },
  {
    "id": "4",
    "name": "Ballenita Roja",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de ballena en rojo.",
    "imageUrl": "/images/catalogo/amigurumis/ballenita-roja.jpg",
    "tags": [
      "ballenita",
      "regalo",
      "colorido"
    ]
  },
  {
    "id": "5",
    "name": "Ballenita Rosa",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de ballena en rosa.",
    "imageUrl": "/images/catalogo/amigurumis/ballenita-rosa.jpg",
    "tags": [
      "ballenita",
      "rosa",
      "decoración"
    ]
  },
  {
    "id": "6",
    "name": "Cabrita",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de cabra.",
    "imageUrl": "/images/catalogo/amigurumis/cabrita.jpg",
    "tags": [
      "cabra",
      "cascabel",
      "sonajero"
    ]
  },
  {
    "id": "7",
    "name": "Capibara",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de capibara.",
    "imageUrl": "/images/catalogo/amigurumis/capibara.jpg",
    "tags": [
      "capibara",
      "animalito",
      "oficina"
    ]
  },
  {
    "id": "8",
    "name": "Cerebro",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de cerebro.",
    "imageUrl": "/images/catalogo/amigurumis/cerebro.jpg",
    "tags": [
      "cerebro",
      "curioso",
      "decoración"
    ]
  },
  {
    "id": "9",
    "name": "Conejito",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de conejo.",
    "imageUrl": "/images/catalogo/amigurumis/conejito.jpg",
    "tags": [
      "conejo",
      "orejas largas",
      "suave"
    ]
  },
  {
    "id": "10",
    "name": "Coraje",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Coraje.",
    "imageUrl": "/images/catalogo/amigurumis/coraje.jpg",
    "tags": [
      "coraje",
      "superhéroe",
      "personalizable"
    ]
  },
  {
    "id": "11",
    "name": "Escandaloso",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Escandaloso.",
    "imageUrl": "/images/catalogo/amigurumis/escandalosos.jpg",
    "tags": [
      "personaje",
      "figura",
      "coleccionable"
    ]
  },
  {
    "id": "12",
    "name": "Harry Potter",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Harry Potter.",
    "imageUrl": "/images/catalogo/amigurumis/harry-potter.jpg",
    "tags": [
      "harry potter",
      "varita",
      "magia"
    ]
  },
  {
    "id": "13",
    "name": "Hello Kitty",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Hello Kitty.",
    "imageUrl": "/images/catalogo/amigurumis/hello-kitty.jpg",
    "tags": [
      "hello kitty",
      "sanrio",
      "detalle"
    ]
  },
  {
    "id": "14",
    "name": "Honguito Azul",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Honguito en azul.",
    "imageUrl": "/images/catalogo/amigurumis/honguito-azul.jpg",
    "tags": [
      "honguito",
      "azul",
      "figura mediana"
    ]
  },
  {
    "id": "15",
    "name": "Honguito Rojo",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Honguito en rojo.",
    "imageUrl": "/images/catalogo/amigurumis/honguito-rojo.jpg",
    "tags": [
      "honguito",
      "rojo",
      "regalo"
    ]
  },
  {
    "id": "16",
    "name": "Loro",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de loro.",
    "imageUrl": "/images/catalogo/amigurumis/loro.jpg",
    "tags": [
      "loro",
      "ave",
      "colorido"
    ]
  },
  {
    "id": "17",
    "name": "Merlina",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Merlina la bruja.",
    "imageUrl": "/images/catalogo/amigurumis/merlina.jpg",
    "tags": [
      "bruja",
      "merlina",
      "halloween"
    ]
  },
  {
    "id": "18",
    "name": "Osito Café",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de oso color café.",
    "imageUrl": "/images/catalogo/amigurumis/osito-cafe.jpg",
    "tags": [
      "oso",
      "café",
      "abrazo"
    ]
  },
  {
    "id": "19",
    "name": "Oveja",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de oveja.",
    "imageUrl": "/images/catalogo/amigurumis/oveja.jpg",
    "tags": [
      "oveja",
      "algodón",
      "suave"
    ]
  },
  {
    "id": "20",
    "name": "Panda",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de panda.",
    "imageUrl": "/images/catalogo/amigurumis/panda.jpg",
    "tags": [
      "panda",
      "animalito",
      "bebés"
    ]
  },
  {
    "id": "21",
    "name": "Pato",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de pato.",
    "imageUrl": "/images/catalogo/amigurumis/pato.jpg",
    "tags": [
      "pato",
      "bebés",
      "juguete"
    ]
  },
  {
    "id": "22",
    "name": "Pollito Girasol",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de pollito con girasol.",
    "imageUrl": "/images/catalogo/amigurumis/pollito-girasol.jpg",
    "tags": [
      "pollito",
      "girasol",
      "cálidos"
    ]
  },
  {
    "id": "23",
    "name": "Pollito",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de pollito.",
    "imageUrl": "/images/catalogo/amigurumis/pollito.jpg",
    "tags": [
      "pollito",
      "bebés",
      "pequeño"
    ]
  },
  {
    "id": "24",
    "name": "Pulpo",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de pulpo.",
    "imageUrl": "/images/catalogo/amigurumis/pulpo.jpg",
    "tags": [
      "pulpo",
      "mar",
      "curioso"
    ]
  },
  {
    "id": "25",
    "name": "Rino",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de rinoceronte.",
    "imageUrl": "/images/catalogo/amigurumis/rino.jpg",
    "tags": [
      "rinoceronte",
      "animalito",
      "figura grande"
    ]
  },
  {
    "id": "26",
    "name": "Snoppy",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Snoppy.",
    "imageUrl": "/images/catalogo/amigurumis/snnopy.jpg",
    "tags": [
      "snoppy",
      "perro",
      "detalle"
    ]
  },
  {
    "id": "27",
    "name": "Spiderman Versión G",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Spiderman en color alternativo.",
    "imageUrl": "/images/catalogo/amigurumis/spider-g.jpg",
    "tags": [
      "spiderman",
      "color alternativo",
      "superhéroe"
    ]
  },
  {
    "id": "28",
    "name": "Spiderman Telaraña",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Spiderman con telaraña.",
    "imageUrl": "/images/catalogo/amigurumis/spiderman-telarana.jpg",
    "tags": [
      "spiderman",
      "telaraña",
      "pose"
    ]
  },
  {
    "id": "29",
    "name": "Spiderman Variación",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Spiderman en variación de color.",
    "imageUrl": "/images/catalogo/amigurumis/spiderman-variacion.jpg",
    "tags": [
      "spiderman",
      "variación",
      "superhéroe"
    ]
  },
  {
    "id": "30",
    "name": "Spiderman",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Spiderman.",
    "imageUrl": "/images/catalogo/amigurumis/spiderman.jpg",
    "tags": [
      "spiderman",
      "superhéroe",
      "coleccionable"
    ]
  },
  {
    "id": "31",
    "name": "Stitch",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Stitch.",
    "imageUrl": "/images/catalogo/amigurumis/stitch.jpg",
    "tags": [
      "stitch",
      "disney",
      "ojos de botón"
    ]
  },
  {
    "id": "32",
    "name": "Stitch Variación",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de Stitch en variación de color.",
    "imageUrl": "/images/catalogo/amigurumis/stitch-variacion.jpg",
    "tags": [
      "stitch",
      "variación",
      "disney"
    ]
  },
  {
    "id": "33",
    "name": "Toro",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de toro.",
    "imageUrl": "/images/catalogo/amigurumis/toro.jpg",
    "tags": [
      "toro",
      "figura grande",
      "decoración"
    ]
  },
  {
    "id": "34",
    "name": "Tortugita Rosa",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de tortuga en rosa.",
    "imageUrl": "/images/catalogo/amigurumis/tortugita-rosa.jpg",
    "tags": [
      "tortuga",
      "rosa",
      "bebés"
    ]
  },
  {
    "id": "35",
    "name": "Tortuguita Azul",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de tortuga en azul.",
    "imageUrl": "/images/catalogo/amigurumis/tortuguita-azul.jpg",
    "tags": [
      "tortuga",
      "azul",
      "sonrisa"
    ]
  },
  {
    "id": "36",
    "name": "Tortuguita",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de tortuga.",
    "imageUrl": "/images/catalogo/amigurumis/tortuguita.jpg",
    "tags": [
      "tortuga",
      "texturizada",
      "duradera"
    ]
  },
  {
    "id": "37",
    "name": "Trapito",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de trapito de cocina.",
    "imageUrl": "/images/catalogo/amigurumis/trapito.jpg",
    "tags": [
      "trapito",
      "hogar",
      "cocina"
    ]
  },
  {
    "id": "38",
    "name": "Unicornio",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de unicornio.",
    "imageUrl": "/images/catalogo/amigurumis/unicornio.jpg",
    "tags": [
      "unicornio",
      "fantasía",
      "crin de colores"
    ]
  },
  {
    "id": "39",
    "name": "Vaca Rosa",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de vaca en rosa.",
    "imageUrl": "/images/catalogo/amigurumis/vaca-rosa.jpg",
    "tags": [
      "vaca",
      "rosa",
      "original"
    ]
  },
  {
    "id": "40",
    "name": "Vaquita",
    "subcategory": "Amigurumis",
    "description": "Amigurumi de vaquita.",
    "imageUrl": "/images/catalogo/amigurumis/vaquita.jpg",
    "tags": [
      "vaquita",
      "animalito",
      "regalo"
    ]
  },
  {
    "id": "41",
    "name": "Angelito para Bautizo",
    "subcategory": "Eventos",
    "description": "Angelito bordado para bautizo.",
    "imageUrl": "/images/catalogo/eventos/angle.jpg",
    "tags": [
      "bautizo",
      "angelito",
      "colgante"
    ]
  },
  {
    "id": "42",
    "name": "Angelitos",
    "subcategory": "Eventos",
    "description": "Pareja de angelitos.",
    "imageUrl": "/images/catalogo/eventos/anguelitos.jpg",
    "tags": [
      "bautizo",
      "pareja",
      "mesa de dulces"
    ]
  },
  {
    "id": "43",
    "name": "Cruces Bordadas",
    "subcategory": "Eventos",
    "description": "Cruces bordadas a medida.",
    "imageUrl": "/images/catalogo/eventos/cruces.jpg",
    "tags": [
      "cruces",
      "bordado",
      "personalizable"
    ]
  },
  {
    "id": "44",
    "name": "Cruz para Bautizo",
    "subcategory": "Eventos",
    "description": "Cruz bordada para bautizo.",
    "imageUrl": "/images/catalogo/eventos/cruz.jpg",
    "tags": [
      "cruz",
      "bautizo",
      "bordado"
    ]
  },
  {
    "id": "45",
    "name": "Graduada",
    "subcategory": "Eventos",
    "description": "Graduada con birrete y toga bordada.",
    "imageUrl": "/images/catalogo/eventos/graduada.jpg",
    "tags": [
      "graduación",
      "birrete",
      "bordado"
    ]
  },
  {
    "id": "46",
    "name": "Graduados",
    "subcategory": "Eventos",
    "description": "Pareja de graduados con birrete y toga.",
    "imageUrl": "/images/catalogo/eventos/graduados.jpg",
    "tags": [
      "graduación",
      "pareja",
      "toga"
    ]
  },
  {
    "id": "47",
    "name": "Oso Graduado",
    "subcategory": "Eventos",
    "description": "Oso con birrete y toga.",
    "imageUrl": "/images/catalogo/eventos/oso-graduado.jpg",
    "tags": [
      "graduación",
      "oso",
      "tierna"
    ]
  },
  {
    "id": "48",
    "name": "Pato Graduado",
    "subcategory": "Eventos",
    "description": "Pato con birrete y toga.",
    "imageUrl": "/images/catalogo/eventos/pato-graduado.jpg",
    "tags": [
      "graduación",
      "pato",
      "divertido"
    ]
  },
  {
    "id": "49",
    "name": "Rosario",
    "subcategory": "Eventos",
    "description": "Rosario tejido a mano.",
    "imageUrl": "/images/catalogo/eventos/rosario.jpg",
    "tags": [
      "rosario",
      "religioso",
      "artesanal"
    ]
  },
  {
    "id": "50",
    "name": "Arreglo de 3 Rosas",
    "subcategory": "Flores",
    "description": "Arreglo de tres rosas.",
    "imageUrl": "/images/catalogo/flores/arreglo-de-3-rosas.jpg",
    "tags": [
      "ramo",
      "rosas",
      "centro de mesa"
    ]
  },
  {
    "id": "51",
    "name": "Flor Individual",
    "subcategory": "Flores",
    "description": "Flor suelta con tallo forrado.",
    "imageUrl": "/images/catalogo/flores/flor-individual.jpg",
    "tags": [
      "flor",
      "individual",
      "para vaso"
    ]
  },
  {
    "id": "52",
    "name": "Flor Individual Blanca",
    "subcategory": "Flores",
    "description": "Flor individual en blanco.",
    "imageUrl": "/images/catalogo/flores/flor-individual-blanca.jpg",
    "tags": [
      "flor",
      "blanca",
      "elegante"
    ]
  },
  {
    "id": "53",
    "name": "Girasol con 2 Flores",
    "subcategory": "Flores",
    "description": "Dos girasoles en una base.",
    "imageUrl": "/images/catalogo/flores/girasol-2-flores-variacion.jpg",
    "tags": [
      "girasol",
      "variación",
      "decoración"
    ]
  },
  {
    "id": "54",
    "name": "Girasol Individual",
    "subcategory": "Flores",
    "description": "Girasol individual con tallo forrado.",
    "imageUrl": "/images/catalogo/flores/girasol-individual.jpg",
    "tags": [
      "girasol",
      "individual",
      "verano"
    ]
  },
  {
    "id": "55",
    "name": "Maceta Miniatura con Flor",
    "subcategory": "Flores",
    "description": "Maceta miniatura con su flor.",
    "imageUrl": "/images/catalogo/flores/maceta-miniatura-con-flor.jpg",
    "tags": [
      "maceta",
      "miniatura",
      "escritorio"
    ]
  },
  {
    "id": "56",
    "name": "Ramo Clásico Rojo",
    "subcategory": "Flores",
    "description": "Ramo clásico de rosas rojas.",
    "imageUrl": "/images/catalogo/flores/ramo-clasico-rojo.jpg",
    "tags": [
      "ramo",
      "rojo",
      "clásico"
    ]
  },
  {
    "id": "57",
    "name": "Ramo de 2 Girasoles",
    "subcategory": "Flores",
    "description": "Ramo de dos girasoles con tallos de alambre.",
    "imageUrl": "/images/catalogo/flores/ramo-girasol-con-2-flores.jpg",
    "tags": [
      "girasol",
      "ramo",
      "alambre"
    ]
  },
  {
    "id": "58",
    "name": "Ramo de Girasoles",
    "subcategory": "Flores",
    "description": "Ramo de girasoles con tallos de alambre.",
    "imageUrl": "/images/catalogo/flores/ramo-girasoles.jpg",
    "tags": [
      "girasol",
      "ramo",
      "alegre"
    ]
  },
  {
    "id": "59",
    "name": "Ramo Mixto de Tulipanes",
    "subcategory": "Flores",
    "description": "Ramo de tulipanes en varios tonos.",
    "imageUrl": "/images/catalogo/flores/ramo-mixto-tulipanes.jpg",
    "tags": [
      "tulipanes",
      "ramo",
      "colores"
    ]
  },
  {
    "id": "60",
    "name": "Ramo Romántico con Luces",
    "subcategory": "Flores",
    "description": "Ramo con luces led.",
    "imageUrl": "/images/catalogo/flores/ramo-romantico-pastel-luces.jpg",
    "tags": [
      "ramo",
      "luces",
      "romántico"
    ]
  },
  {
    "id": "61",
    "name": "Ramo Romántico Pastel",
    "subcategory": "Flores",
    "description": "Ramo en tonos pastel.",
    "imageUrl": "/images/catalogo/flores/ramo-romantico-pastel.jpg",
    "tags": [
      "ramo",
      "pastel",
      "romántico"
    ]
  },
  {
    "id": "62",
    "name": "Ramito Pequeño",
    "subcategory": "Flores",
    "description": "Ramito pequeño, del tamaño de la mano.",
    "imageUrl": "/images/catalogo/flores/ramo-pequeno.jpg",
    "tags": [
      "ramito",
      "pequeño",
      "regalo"
    ]
  },
  {
    "id": "63",
    "name": "Rosa Individual",
    "subcategory": "Flores",
    "description": "Rosa individual con tallo forrado.",
    "imageUrl": "/images/catalogo/flores/rosa-individual.jpg",
    "tags": [
      "rosa",
      "individual",
      "para vaso"
    ]
  },
  {
    "id": "64",
    "name": "Tulipán con Corazón",
    "subcategory": "Flores",
    "description": "Tulipán con un corazón al centro.",
    "imageUrl": "/images/catalogo/flores/tulipan-flor-especial-con-corazon.jpg",
    "tags": [
      "tulipán",
      "corazón",
      "san valentín"
    ]
  },
  {
    "id": "65",
    "name": "Ajolote",
    "subcategory": "Llaveros",
    "description": "Llavero de ajolote.",
    "imageUrl": "/images/catalogo/llaveros/ajolote.jpg",
    "tags": [
      "ajolote",
      "rosa",
      "miniatura"
    ]
  },
  {
    "id": "66",
    "name": "Abejita",
    "subcategory": "Llaveros",
    "description": "Llavero de abeja.",
    "imageUrl": "/images/catalogo/llaveros/aveja.jpg",
    "tags": [
      "abeja",
      "rayas",
      "mochila"
    ]
  },
  {
    "id": "67",
    "name": "Capibara",
    "subcategory": "Llaveros",
    "description": "Llavero de capibara.",
    "imageUrl": "/images/catalogo/llaveros/capibara.jpg",
    "width": 705,
    "height": 881,
    "tags": [
      "capibara",
      "animalito",
      "mochila"
    ]
  },
  {
    "id": "68",
    "name": "Chefsito",
    "subcategory": "Llaveros",
    "description": "Llavero de chef.",
    "imageUrl": "/images/catalogo/llaveros/chefsito.jpg",
    "tags": [
      "chefsito",
      "cocina",
      "miniatura"
    ]
  },
  {
    "id": "69",
    "name": "Conito de Helado",
    "subcategory": "Llaveros",
    "description": "Llavero de cono de helado.",
    "imageUrl": "/images/catalogo/llaveros/cono.jpg",
    "tags": [
      "helado",
      "cono",
      "verano"
    ]
  },
  {
    "id": "70",
    "name": "Coraje con Uva",
    "subcategory": "Llaveros",
    "description": "Llavero de Coraje con una uva.",
    "imageUrl": "/images/catalogo/llaveros/coraje-uva.jpg",
    "tags": [
      "coraje",
      "uva",
      "original"
    ]
  },
  {
    "id": "71",
    "name": "Coraje",
    "subcategory": "Llaveros",
    "description": "Llavero de Coraje.",
    "imageUrl": "/images/catalogo/llaveros/coraje.jpg",
    "tags": [
      "coraje",
      "superhéroe",
      "clásico"
    ]
  },
  {
    "id": "72",
    "name": "Cupcake",
    "subcategory": "Llaveros",
    "description": "Llavero de cupcake.",
    "imageUrl": "/images/catalogo/llaveros/cupcake.jpg",
    "tags": [
      "cupcake",
      "postre",
      "colorido"
    ]
  },
  {
    "id": "73",
    "name": "Donita Blanca",
    "subcategory": "Llaveros",
    "description": "Llavero de donita blanca.",
    "imageUrl": "/images/catalogo/llaveros/donita-blanca.jpg",
    "tags": [
      "donita",
      "blanca",
      "chispas"
    ]
  },
  {
    "id": "74",
    "name": "Donita Café",
    "subcategory": "Llaveros",
    "description": "Llavero de donita color café.",
    "imageUrl": "/images/catalogo/llaveros/donita-cafe.jpg",
    "tags": [
      "donita",
      "café",
      "chispas"
    ]
  },
  {
    "id": "75",
    "name": "Donita Rosa",
    "subcategory": "Llaveros",
    "description": "Llavero de donita rosa.",
    "imageUrl": "/images/catalogo/llaveros/donita-rosa.jpg",
    "tags": [
      "donita",
      "rosa",
      "regalo"
    ]
  },
  {
    "id": "76",
    "name": "Estrella",
    "subcategory": "Llaveros",
    "description": "Llavero de estrella.",
    "imageUrl": "/images/catalogo/llaveros/estrella.jpg",
    "tags": [
      "estrella",
      "clásico",
      "sencillo"
    ]
  },
  {
    "id": "77",
    "name": "Fantasmita Azul",
    "subcategory": "Llaveros",
    "description": "Llavero de fantasmita azul.",
    "imageUrl": "/images/catalogo/llaveros/fantasmita-azul.jpg",
    "tags": [
      "fantasmita",
      "halloween",
      "azul"
    ]
  },
  {
    "id": "78",
    "name": "Fantasmita Rosa",
    "subcategory": "Llaveros",
    "description": "Llavero de fantasmita rosa.",
    "imageUrl": "/images/catalogo/llaveros/fantasmita-rosa.jpg",
    "tags": [
      "fantasmita",
      "halloween",
      "rosa"
    ]
  },
  {
    "id": "79",
    "name": "Fresa",
    "subcategory": "Llaveros",
    "description": "Llavero de fresa.",
    "imageUrl": "/images/catalogo/llaveros/fresa.jpg",
    "tags": [
      "fresa",
      "fruta",
      "colorido"
    ]
  },
  {
    "id": "80",
    "name": "Gary",
    "subcategory": "Llaveros",
    "description": "Llavero de Gary.",
    "imageUrl": "/images/catalogo/llaveros/gary.jpg",
    "tags": [
      "gary",
      "tortuga",
      "caricatura"
    ]
  },
  {
    "id": "81",
    "name": "Gatito Negro",
    "subcategory": "Llaveros",
    "description": "Llavero de gatito negro.",
    "imageUrl": "/images/catalogo/llaveros/gatito-negro.jpg",
    "tags": [
      "gatito",
      "negro",
      "misterioso"
    ]
  },
  {
    "id": "82",
    "name": "Hello Kitty",
    "subcategory": "Llaveros",
    "description": "Llavero de Hello Kitty.",
    "imageUrl": "/images/catalogo/llaveros/hello-kitty.jpg",
    "tags": [
      "hello kitty",
      "sanrio",
      "miniatura"
    ]
  },
  {
    "id": "83",
    "name": "Hombresito",
    "subcategory": "Llaveros",
    "description": "Llavero de hombre.",
    "imageUrl": "/images/catalogo/llaveros/hombresito.jpg",
    "tags": [
      "hombresito",
      "cara",
      "miniatura"
    ]
  },
  {
    "id": "84",
    "name": "Honguito Azul F",
    "subcategory": "Llaveros",
    "description": "Llavero de Honguito azul, edición limitada.",
    "imageUrl": "/images/catalogo/llaveros/honguito-azul-f.jpg",
    "tags": [
      "honguito",
      "azul",
      "edición limitada"
    ]
  },
  {
    "id": "85",
    "name": "Honguito Azul",
    "subcategory": "Llaveros",
    "description": "Llavero de Honguito azul.",
    "imageUrl": "/images/catalogo/llaveros/honguito-azul.jpg",
    "tags": [
      "honguito",
      "azul",
      "reforzado"
    ]
  },
  {
    "id": "86",
    "name": "Honguito Rojo",
    "subcategory": "Llaveros",
    "description": "Llavero de Honguito rojo.",
    "imageUrl": "/images/catalogo/llaveros/honguito-rojo.jpg",
    "tags": [
      "honguito",
      "rojo",
      "sonriente"
    ]
  },
  {
    "id": "87",
    "name": "Kuromi",
    "subcategory": "Llaveros",
    "description": "Llavero de Kuromi.",
    "imageUrl": "/images/catalogo/llaveros/kuromi.jpg",
    "tags": [
      "kuromi",
      "sanrio",
      "capucha"
    ]
  },
  {
    "id": "88",
    "name": "Lobito",
    "subcategory": "Llaveros",
    "description": "Llavero de lobito.",
    "imageUrl": "/images/catalogo/llaveros/lobito.jpg",
    "tags": [
      "lobito",
      "gris",
      "suave"
    ]
  },
  {
    "id": "89",
    "name": "Marciano",
    "subcategory": "Llaveros",
    "description": "Llavero de marciano.",
    "imageUrl": "/images/catalogo/llaveros/marciano.jpg",
    "tags": [
      "marciano",
      "verde",
      "clásico"
    ]
  },
  {
    "id": "90",
    "name": "McQueen",
    "subcategory": "Llaveros",
    "description": "Llavero de McQueen.",
    "imageUrl": "/images/catalogo/llaveros/mcqueen.jpg",
    "tags": [
      "mcqueen",
      "carreras",
      "coche"
    ]
  },
  {
    "id": "91",
    "name": "Melody",
    "subcategory": "Llaveros",
    "description": "Llavero de Melody.",
    "imageUrl": "/images/catalogo/llaveros/melody.jpg",
    "tags": [
      "melody",
      "sanrio",
      "delicada"
    ]
  },
  {
    "id": "92",
    "name": "Miniyoda",
    "subcategory": "Llaveros",
    "description": "Llavero de Yoda.",
    "imageUrl": "/images/catalogo/llaveros/mini-yoda.jpg",
    "tags": [
      "yoda",
      "star wars",
      "miniatura"
    ]
  },
  {
    "id": "93",
    "name": "Minion",
    "subcategory": "Llaveros",
    "description": "Llavero de Minion.",
    "imageUrl": "/images/catalogo/llaveros/minion.jpg",
    "tags": [
      "minion",
      "desayuno",
      "divertido"
    ]
  },
  {
    "id": "94",
    "name": "Oreo",
    "subcategory": "Llaveros",
    "description": "Llavero de galleta Oreo.",
    "imageUrl": "/images/catalogo/llaveros/oreo.jpg",
    "tags": [
      "oreo",
      "galleta",
      "blandito"
    ]
  },
  {
    "id": "95",
    "name": "Pandita",
    "subcategory": "Llaveros",
    "description": "Llavero de panda.",
    "imageUrl": "/images/catalogo/llaveros/pandita.jpg",
    "tags": [
      "pandita",
      "rojo",
      "tierno"
    ]
  },
  {
    "id": "96",
    "name": "Pinguinita",
    "subcategory": "Llaveros",
    "description": "Llavero de pingüinita.",
    "imageUrl": "/images/catalogo/llaveros/pinguinita.jpg",
    "tags": [
      "pinguinita",
      "polar",
      "suave"
    ]
  },
  {
    "id": "97",
    "name": "Pinguinito",
    "subcategory": "Llaveros",
    "description": "Llavero de pingüino.",
    "imageUrl": "/images/catalogo/llaveros/pinguinito.jpg",
    "tags": [
      "pinguinito",
      "gorro",
      "invierno"
    ]
  },
  {
    "id": "98",
    "name": "Piolín",
    "subcategory": "Llaveros",
    "description": "Llavero de búho.",
    "imageUrl": "/images/catalogo/llaveros/piolin.jpg",
    "tags": [
      "piolín",
      "búho",
      "protegido"
    ]
  },
  {
    "id": "99",
    "name": "Piolón",
    "subcategory": "Llaveros",
    "description": "Llavero de búho con gafas.",
    "imageUrl": "/images/catalogo/llaveros/piolon.jpg",
    "tags": [
      "piolón",
      "búho",
      "gafas"
    ]
  },
  {
    "id": "100",
    "name": "Ranita",
    "subcategory": "Llaveros",
    "description": "Llavero de ranita.",
    "imageUrl": "/images/catalogo/llaveros/ranita.jpg",
    "tags": [
      "ranita",
      "verde",
      "saludable"
    ]
  },
  {
    "id": "101",
    "name": "Snoppy Variación",
    "subcategory": "Llaveros",
    "description": "Llavero de Snoppy en variación de color.",
    "imageUrl": "/images/catalogo/llaveros/snoppy-variacion.jpg",
    "tags": [
      "snoppy",
      "variación",
      "perro"
    ]
  },
  {
    "id": "102",
    "name": "Snoppy",
    "subcategory": "Llaveros",
    "description": "Llavero de Snoppy.",
    "imageUrl": "/images/catalogo/llaveros/snoppy.jpg",
    "tags": [
      "snoppy",
      "perro",
      "clásico"
    ]
  },
  {
    "id": "103",
    "name": "Sonic",
    "subcategory": "Llaveros",
    "description": "Llavero de Sonic.",
    "imageUrl": "/images/catalogo/llaveros/sonic.jpg",
    "tags": [
      "sonic",
      "juego",
      "azul"
    ]
  },
  {
    "id": "104",
    "name": "Tortuguita",
    "subcategory": "Llaveros",
    "description": "Llavero de tortuga.",
    "imageUrl": "/images/catalogo/llaveros/tortuguita.jpg",
    "tags": [
      "tortuga",
      "verde",
      "pequeño"
    ]
  },
  {
    "id": "105",
    "name": "Vaquita",
    "subcategory": "Llaveros",
    "description": "Llavero de vaquita.",
    "imageUrl": "/images/catalogo/llaveros/vaquita.jpg",
    "tags": [
      "vaquita",
      "manchas",
      "mamífero"
    ]
  }
].map(definePiece)
