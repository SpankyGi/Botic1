export const menus = [
  {
    id: 'esencia',
    variant: 'esencia',
    tag: 'Mediodía',
    title: 'Esencia',
    price: '90€',
    aperitivoGroups: [
      {
        cat: 'Bar',
        items: ['Mojito y escabeche', 'Cacahuete', 'Pez con burrida', 'Tortita de patatas', 'Calamar a la romana'],
      },
    ],
    platos: [
      { num: 'I',   name: 'Bacalao' },
      { num: 'II',  name: 'Raya'    },
      { num: 'III', name: 'Pato'    },
    ],
    postres: [
      { num: 'IV', name: 'Brújula' },
    ],
  },
  {
    id: 'degustacion',
    variant: '',
    tag: 'Tasting',
    title: 'Degustación',
    price: '190€',
    aperitivoGroups: [
      {
        cat: 'Bar',
        items: ['Mojito y escabeche', 'Cacahuete', 'Pez con burrida', 'Tortita de patatas', 'Calamar a la romana'],
      },
      {
        cat: 'Estación',
        items: ['Rebanada de "calçada"', 'Habas con calderetas', 'Mandonguilles doradas', 'Diente blanco de Palamós', 'Algodón de hierba y miel'],
      },
      {
        cat: 'Guisos',
        items: ['Canelón', 'Suquet de pescado', 'Arroz del Empordà'],
      },
      {
        cat: 'Pastelería',
        items: ['Crepe de bonito', 'Gelée de Brioxs con trufa', 'Buñuelo de cala'],
      },
    ],
    platos: [
      {
        num: 'I',
        name: 'Ensalada de berberechos',
        description: [
          'Berberechos escaldados con su agua',
          'Licuado de tomate y vodka',
          'Sorbete de tomate y cebolla encurtida',
          'Granizado Thai y crema de suero de parmesano',
          'Hojas de lechugas',
        ],
      },
      { num: 'II',   name: 'Buey de mar'             },
      { num: 'III',  name: 'Espárrago blanco'         },
      { num: 'IV',   name: 'Merluza'                  },
      { num: 'V',    name: 'Cordero'                  },
    ],
    postres: [
      { num: 'VI',   name: 'Cítricos' },
      { num: 'VII',  name: 'Fresa'    },
      { num: 'VIII', name: 'Galleta'  },
    ],
  },
  {
    id: 'chef',
    variant: '',
    tag: 'Signature',
    title: 'del Chef',
    price: '250€',
    aperitivoGroups: [
      {
        cat: 'Bar',
        items: ['Mojito y escabeche', 'Cacahuete', 'Pez con burrida', 'Tortita de patatas', 'Calamar a la romana'],
      },
      {
        cat: 'Estación',
        items: ['Rebanada de "calçada"', 'Habas con calderetas', 'Mandonguilles doradas', 'Diente blanco de Palamós', 'Algodón de hierba y miel'],
      },
      {
        cat: 'Guisos',
        items: ['Canelón', 'Suquet de pescado', 'Arroz del Empordà'],
      },
      {
        cat: 'Pastelería',
        items: ['Crepe de bonito', 'Gelée de Brioxs con trufa', 'Buñuelo de cala'],
      },
    ],
    platos: [
      { num: 'I',    name: 'Ostra'              },
      { num: 'II',   name: 'Erizo de mar'       },
      { num: 'III',  name: 'Gamba'              },
      { num: 'IV',   name: 'Tártar de ternera'  },
      { num: 'V',    name: 'Tendones de ternera'},
      { num: 'VI',   name: 'Tomate'             },
      { num: 'VII',  name: 'Mero'               },
      { num: 'VIII', name: 'Pollo y bogavante'  },
      { num: 'IX',   name: 'Colmenillas'        },
    ],
    postres: [
      { num: 'X',    name: 'Labios'      },
      { num: 'XI',   name: 'Manzana'     },
      { num: 'XII',  name: 'El Goloso'   },
      { num: 'XIII', name: 'Bo.TiC 2024' },
    ],
  },
]
