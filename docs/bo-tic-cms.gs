/**
 * Bo.TiC · Sistema de gestió de menús
 * Google Apps Script — versió 1.0
 *
 * Funció principal: configurar_cms_menus()
 * Executa-la una sola vegada en un full de càlcul buit.
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

var PESTANYES = {
  MENUS:        'menus',
  GRUPS:        'grups',
  PLATS:        'plats',
  CONFIG:       'configuracio',
  INSTRUCCIONS: 'instruccions'
};

var COL_MENUS  = ['id', 'ordre', 'preu', 'actiu', 'nom_ca', 'nom_es', 'nom_fr', 'nom_en'];
var COL_GRUPS  = ['id', 'menu_id', 'seccio_id', 'ordre', 'actiu', 'nom_ca', 'nom_es', 'nom_fr', 'nom_en'];
var COL_PLATS  = ['id', 'menu_id', 'grup_id', 'ordre', 'actiu', 'nom_ca', 'nom_es', 'nom_fr', 'nom_en',
                  'descripcio_ca', 'descripcio_es', 'descripcio_fr', 'descripcio_en',
                  'allergens', 'suplement', 'actualitzat_el'];
var COL_CONFIG = ['clau', 'valor', 'descripcio'];

// Colors per a la capçalera de cada tipus de columna
var C = {
  TEC_FOSC:  '#546e7a',  // columnes tècniques (id, *_id)
  TEC_CLAR:  '#78909c',  // columnes semi-tècniques
  EDIT_BLAU: '#1565c0',  // camp editable principal (nom_ca)
  EDIT_CLAR: '#1976d2',  // camps editables secundaris
  EDIT_CYAN: '#0277bd',  // descripcions
  EDIT_VERD: '#00695c',  // allergens
  TEXT_BLANC:'#ffffff',
  // Fons per a dades
  F_TEC:     '#e8eaed',
  F_SEMI:    '#f3f3f3',
  F_BLANC:   '#ffffff',
  F_CLAR:    '#f8f9fa',
  F_BLAU:    '#e3f2fd',
  F_CYAN:    '#e1f5fe',
  F_VERD:    '#e0f2f1'
};

// Pestanyes que disparen actualització de versió quan s'editen
var PESTANYES_VIGILADES = [PESTANYES.MENUS, PESTANYES.GRUPS, PESTANYES.PLATS];

// ─────────────────────────────────────────────────────────────────────────────
// MENÚ PERSONALITZAT
// ─────────────────────────────────────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Bo.TiC · Menús')
    .addItem('⚙️  Configurar CMS',        'configurar_cms_menus')
    .addSeparator()
    .addItem('✅  Validar dades',          'validar_dades')
    .addItem('🔄  Actualitzar versió',     'actualitzar_versio')
    .addItem('👁️  Previsualitzar JSON',    'previsualitzar_json')
    .addSeparator()
    .addItem('📋  Obrir instruccions',     'obrir_instruccions')
    .addItem('🔍  Comprovar errors',       'comprovar_errors')
    .addToUi();
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIÓ PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

function configurar_cms_menus() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Detecta pestanyes ja existents
  var existents = Object.values(PESTANYES).filter(function(nom) {
    return ss.getSheetByName(nom) !== null;
  });

  if (existents.length > 0) {
    var resp = ui.alert(
      'Bo.TiC · Configurar CMS',
      'Ja existeixen les pestanyes: ' + existents.join(', ') + '.\n\n' +
      'Si continues, totes les dades actuals s\'esborraran i es reiniciaran amb els valors predeterminats.\n\n' +
      'Vols continuar?',
      ui.ButtonSet.YES_NO
    );
    if (resp !== ui.Button.YES) {
      ui.alert('Cancel·lat', 'No s\'ha modificat res.', ui.ButtonSet.OK);
      return;
    }
  }

  crear_pestanya_menus_(ss);
  crear_pestanya_grups_(ss);
  crear_pestanya_plats_(ss);
  crear_pestanya_configuracio_(ss);
  crear_pestanya_instruccions_(ss);

  // Elimina el full per defecte si és buit i no és cap de les nostres pestanyes
  ['Full 1', 'Sheet1', 'Hoja 1', 'Feuille 1'].forEach(function(nom) {
    var f = ss.getSheetByName(nom);
    if (f && ss.getSheets().length > 5) {
      try { ss.deleteSheet(f); } catch (e) {}
    }
  });

  // Navega a instruccions
  var instrSheet = ss.getSheetByName(PESTANYES.INSTRUCCIONS);
  if (instrSheet) ss.setActiveSheet(instrSheet);

  ui.alert(
    '✅  CMS configurat correctament',
    'S\'han creat les pestanyes:\n' +
    '  • menus\n  • grups\n  • plats\n  • configuracio\n  • instruccions\n\n' +
    'Propera passa:\n' +
    '1. Publica aquest script com a Aplicació web (veure instruccions)\n' +
    '2. Copia la URL acabada en /exec\n' +
    '3. Enganxa-la a public/config.json de la web',
    ui.ButtonSet.OK
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CREACIÓ DE PESTANYES
// ─────────────────────────────────────────────────────────────────────────────

function crear_pestanya_menus_(ss) {
  var sheet = crear_o_reiniciar_pestanya_(ss, PESTANYES.MENUS, COL_MENUS);

  var notes = {
    'id':     'Identificador únic. Minúscules, sense accents, sense espais. EXEMPLE: degustacio, chef. NO canviar un cop creat.',
    'ordre':  'Nombre enter positiu. Controla l\'ordre a la web (1 = primer).',
    'preu':   'Preu en euros, sense símbols. EXEMPLE: 190. Opcional.',
    'actiu':  'Marca la casella per mostrar el menú a la web. Desmarca per amagar-lo.',
    'nom_ca': '★ OBLIGATORI. Nom en català.',
    'nom_es': 'Nom en castellà.',
    'nom_fr': 'Nom en francès.',
    'nom_en': 'Nom en anglès.'
  };
  afegir_notes_(sheet, COL_MENUS, notes);

  var dades = [
    ['degustacio', 1, 190, 'CERT', 'Menú Degustació', 'Menú Degustación', 'Menu Dégustation', 'Tasting Menu']
  ];
  sheet.getRange(2, 1, dades.length, COL_MENUS.length).setValues(dades);

  // Capçaleres: colors per columna
  var hColors = [C.TEC_FOSC, C.TEC_FOSC, C.TEC_FOSC, C.TEC_FOSC,
                 C.EDIT_BLAU, C.EDIT_CLAR, C.EDIT_CLAR, C.EDIT_CLAR];
  aplicar_colors_capçalera_(sheet, COL_MENUS.length, hColors);

  // Fons de dades
  var dFons = [C.F_TEC, C.F_SEMI, C.F_SEMI, C.F_SEMI,
               C.F_BLANC, C.F_CLAR, C.F_CLAR, C.F_CLAR];
  aplicar_fons_dades_(sheet, COL_MENUS.length, dFons, 100);

  aplicar_checkbox_actiu_(sheet, 4, 100);
  aplicar_validacio_nombre_positiu_(sheet, 2, 100);  // ordre
  aplicar_validacio_nombre_positiu_(sheet, 3, 100);  // preu

  var amples = [140, 70, 70, 70, 180, 180, 180, 180];
  aplicar_amplades_(sheet, amples);

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, sheet.getLastRow(), COL_MENUS.length).createFilter();
  aplicar_format_condicional_buit_(sheet, [1, 5], 2, 100);
}

function crear_pestanya_grups_(ss) {
  var sheet = crear_o_reiniciar_pestanya_(ss, PESTANYES.GRUPS, COL_GRUPS);

  var notes = {
    'id':       'Identificador únic del grup. EXEMPLE: snacks, entrants, principals. NO canviar.',
    'menu_id':  'Ha de coincidir exactament amb un id de la pestanya "menus". NO canviar.',
    'seccio_id':'Classificació opcional. EXEMPLE: aperitius, carns, postres.',
    'ordre':    'Nombre enter positiu. Ordre dins del menú.',
    'actiu':    'Marca per mostrar el grup a la web.',
    'nom_ca':   '★ OBLIGATORI. Nom en català.',
    'nom_es':   'Nom en castellà.',
    'nom_fr':   'Nom en francès.',
    'nom_en':   'Nom en anglès.'
  };
  afegir_notes_(sheet, COL_GRUPS, notes);

  var dades = [
    ['bar', 'degustacio', 'aperitius', 1, 'CERT', 'Bar', 'Bar', 'Bar', 'Bar']
  ];
  sheet.getRange(2, 1, dades.length, COL_GRUPS.length).setValues(dades);

  var hColors = [C.TEC_FOSC, C.TEC_FOSC, C.TEC_CLAR, C.TEC_FOSC, C.TEC_FOSC,
                 C.EDIT_BLAU, C.EDIT_CLAR, C.EDIT_CLAR, C.EDIT_CLAR];
  aplicar_colors_capçalera_(sheet, COL_GRUPS.length, hColors);

  var dFons = [C.F_TEC, C.F_TEC, C.F_SEMI, C.F_SEMI, C.F_SEMI,
               C.F_BLANC, C.F_CLAR, C.F_CLAR, C.F_CLAR];
  aplicar_fons_dades_(sheet, COL_GRUPS.length, dFons, 200);

  aplicar_checkbox_actiu_(sheet, 5, 200);
  aplicar_validacio_nombre_positiu_(sheet, 4, 200);  // ordre

  var amples = [140, 140, 120, 70, 70, 200, 200, 200, 200];
  aplicar_amplades_(sheet, amples);

  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, sheet.getLastRow(), COL_GRUPS.length).createFilter();
  aplicar_format_condicional_buit_(sheet, [1, 6], 2, 200);
}

function crear_pestanya_plats_(ss) {
  var sheet = crear_o_reiniciar_pestanya_(ss, PESTANYES.PLATS, COL_PLATS);

  var notes = {
    'id':           'Identificador únic del plat. EXEMPLE: deg-b1, deg-m3. NO canviar.',
    'menu_id':      'Ha de coincidir amb un id de "menus". NO canviar.',
    'grup_id':      'Ha de coincidir amb un id de "grups". NO canviar.',
    'ordre':        'Nombre enter positiu. Ordre dins del grup.',
    'actiu':        'Marca per mostrar el plat. Desmarca per amagar-lo sense eliminar la fila.',
    'nom_ca':       '★ OBLIGATORI. Nom en català.',
    'nom_es':       'Nom en castellà.',
    'nom_fr':       'Nom en francès.',
    'nom_en':       'Nom en anglès.',
    'descripcio_ca':'Descripció en català. Opcional.',
    'descripcio_es':'Descripció en castellà. Opcional.',
    'descripcio_fr':'Descripció en francès. Opcional.',
    'descripcio_en':'Descripció en anglès. Opcional.',
    'allergens':    'Al·lèrgens separats per comes. EXEMPLE: gluten, làctics, mol·luscs',
    'suplement':    'Suplement en euros (nombre positiu) o buit.',
    'actualitzat_el':'Data de l\'última modificació. S\'actualitza automàticament. NO editar.'
  };
  afegir_notes_(sheet, COL_PLATS, notes);

  var ara = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
  var dades = [
    ['deg-b1','degustacio','bar',1,'CERT','Musclo i escabetx','Mejillón en escabeche','Moule en escabèche','Pickled mussel','','','','','','',ara],
    ['deg-b2','degustacio','bar',2,'CERT','Cacauet','Cacahuete','Cacahuète','Peanut','','','','','','',ara],
    ['deg-b3','degustacio','bar',3,'CERT','Pa amb tomàquet i anxova de l\'Escala','Pan con tomate y anchoa de l\'Escala','Pain à la tomate et anchois de l\'Escala','Bread with tomato and l\'Escala anchovy','','','','','','',ara],
    ['deg-b4','degustacio','bar',4,'CERT','Truita de patata i ceba','Tortilla de patata y cebolla','Omelette de pomme de terre et oignon','Potato and onion omelette','','','','','','',ara],
    ['deg-b5','degustacio','bar',5,'CERT','Calamar a la romana','Calamar a la romana','Calmar à la romaine','Deep-fried squid','','','','','','',ara]
  ];
  sheet.getRange(2, 1, dades.length, COL_PLATS.length).setValues(dades);

  var hColors = [
    C.TEC_FOSC, C.TEC_FOSC, C.TEC_FOSC,          // id, menu_id, grup_id
    C.TEC_FOSC, C.TEC_FOSC,                        // ordre, actiu
    C.EDIT_BLAU, C.EDIT_CLAR, C.EDIT_CLAR, C.EDIT_CLAR,  // noms
    C.EDIT_CYAN, C.EDIT_CYAN, C.EDIT_CYAN, C.EDIT_CYAN,  // descripcions
    C.EDIT_VERD,                                    // allergens
    C.TEC_CLAR,                                     // suplement
    C.TEC_FOSC                                      // actualitzat_el
  ];
  aplicar_colors_capçalera_(sheet, COL_PLATS.length, hColors);

  var dFons = [
    C.F_TEC, C.F_TEC, C.F_TEC,
    C.F_SEMI, C.F_SEMI,
    C.F_BLANC, C.F_CLAR, C.F_CLAR, C.F_CLAR,
    C.F_BLAU, C.F_CYAN, C.F_CYAN, C.F_CYAN,
    C.F_VERD,
    C.F_SEMI,
    C.F_TEC
  ];
  aplicar_fons_dades_(sheet, COL_PLATS.length, dFons, 300);

  aplicar_checkbox_actiu_(sheet, 5, 300);
  aplicar_validacio_nombre_positiu_(sheet, 4, 300);  // ordre

  // suplement: nombre positiu o buit
  var valSup = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThanOrEqualTo(0)
    .setHelpText('Ha de ser un nombre positiu o deixar-lo buit.')
    .setAllowInvalid(true)
    .build();
  sheet.getRange(2, 15, 300, 1).setDataValidation(valSup);

  var amples = [110, 120, 110, 60, 60, 200, 200, 200, 200, 220, 220, 220, 220, 160, 80, 120];
  aplicar_amplades_(sheet, amples);

  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(3);
  sheet.getRange(1, 1, sheet.getLastRow(), COL_PLATS.length).createFilter();
  aplicar_format_condicional_buit_(sheet, [1, 6], 2, 300);
}

function crear_pestanya_configuracio_(ss) {
  var sheet = crear_o_reiniciar_pestanya_(ss, PESTANYES.CONFIG, COL_CONFIG);

  var ara = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  var dades = [
    ['versio',             '1',   'Número de versió. S\'incrementa automàticament quan s\'editen els menús.'],
    ['ultima_actualitzacio', ara,  'Data i hora de l\'última modificació. S\'actualitza automàticament.'],
    ['api_activa',         'CERT','Controla si l\'API retorna dades. Posa FALS per desactivar-la temporalment.'],
    ['temps_cache_minuts', '10',  'Temps en minuts que el navegador guarda en memòria cau les dades dels menús.']
  ];
  sheet.getRange(2, 1, dades.length, 3).setValues(dades);

  // Capçalera
  sheet.getRange(1, 1).setBackground('#455a64').setFontColor(C.TEXT_BLANC).setFontWeight('bold').setFontSize(11);
  sheet.getRange(1, 2).setBackground('#1565c0').setFontColor(C.TEXT_BLANC).setFontWeight('bold').setFontSize(11);
  sheet.getRange(1, 3).setBackground('#1565c0').setFontColor(C.TEXT_BLANC).setFontWeight('bold').setFontSize(11);
  sheet.getRange(1, 1, 1, 3).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 40);

  // Dades
  sheet.getRange(2, 1, 20, 1).setBackground(C.F_TEC).setFontWeight('bold');
  sheet.getRange(2, 2, 20, 1).setBackground(C.F_BLANC);
  sheet.getRange(2, 3, 20, 1).setBackground(C.F_CLAR).setFontColor('#546e7a').setFontStyle('italic');

  sheet.setColumnWidth(1, 190);
  sheet.setColumnWidth(2, 160);
  sheet.setColumnWidth(3, 450);
  sheet.setFrozenRows(1);
}

function crear_pestanya_instruccions_(ss) {
  var sheet = crear_o_reiniciar_pestanya_(ss, PESTANYES.INSTRUCCIONS, []);
  sheet.setColumnWidth(1, 30);
  sheet.setColumnWidth(2, 700);

  var files = [
    // [col A (icona), col B (text), font-size, bold, bg, color-text]
    ['',  'Bo.TiC · Sistema de gestió de menús — Instruccions d\'ús',  16, true,  '#1a73e8', '#ffffff'],
    ['',  '',                                                            11, false, '#ffffff',  '#000000'],
    ['⚠️', 'COLUMNES EN GRIS: NO LES MODIFIQUIS',                        12, true,  '#fff8e1',  '#b71c1c'],
    ['',  'Les columnes id, menu_id i grup_id identifiquen cada element. Si les canvies, la web pot deixar de funcionar.', 11, false, '#fff8e1', '#bf360c'],
    ['',  '',                                                            11, false, '#ffffff', '#000000'],
    ['📌', 'Com activar o desactivar un plat',                           12, true,  '#e3f2fd',  '#0d47a1'],
    ['',  '1. Ves a la pestanya "plats"',                               11, false, '#ffffff', '#333333'],
    ['',  '2. Busca el plat a la columna "nom_ca"',                     11, false, '#ffffff', '#333333'],
    ['',  '3. Fes clic a la casella de la columna "actiu" per marcar-la (✓ = visible) o desmarcar-la (□ = ocult)', 11, false, '#ffffff', '#333333'],
    ['',  '4. No cal desar: el canvi s\'aplica automàticament',         11, false, '#ffffff', '#333333'],
    ['',  '',                                                            11, false, '#ffffff', '#000000'],
    ['✏️', 'Com editar un nom o una descripció',                         12, true,  '#e3f2fd',  '#0d47a1'],
    ['',  '1. Ves a la pestanya "plats"',                               11, false, '#ffffff', '#333333'],
    ['',  '2. Fes clic a la cel·la que vols canviar (nom_ca, nom_es, descripcio_ca, etc.)', 11, false, '#ffffff', '#333333'],
    ['',  '3. Escriu el nou text i prem Intro',                        11, false, '#ffffff', '#333333'],
    ['',  '4. El canvi apareixerà a la web en un màxim de 10 minuts',  11, false, '#ffffff', '#333333'],
    ['',  '',                                                            11, false, '#ffffff', '#000000'],
    ['🔢', 'Com canviar l\'ordre dels plats',                            12, true,  '#e3f2fd',  '#0d47a1'],
    ['',  '1. A la columna "ordre", escriu el número de posició (1 = primer, 2 = segon...)', 11, false, '#ffffff', '#333333'],
    ['',  '2. Pots usar valors com 10, 20, 30 per deixar marge per a plats futurs', 11, false, '#ffffff', '#333333'],
    ['',  '',                                                            11, false, '#ffffff', '#000000'],
    ['➕', 'Com afegir un plat nou',                                     12, true,  '#e3f2fd',  '#0d47a1'],
    ['',  '1. Ves a la pestanya "plats" i afegeix una fila al final',   11, false, '#ffffff', '#333333'],
    ['',  '2. Omple obligatòriament: id (únic, sense espais ni accents), menu_id, grup_id, ordre, actiu, nom_ca', 11, false, '#ffffff', '#333333'],
    ['',  '3. L\'id ha de ser únic. EXEMPLES: deg-m6, chef-p2',        11, false, '#ffffff', '#333333'],
    ['',  '4. El menu_id ha de coincidir exactament amb un id de la pestanya "menus"', 11, false, '#ffffff', '#333333'],
    ['',  '5. El grup_id ha de coincidir exactament amb un id de la pestanya "grups"', 11, false, '#ffffff', '#333333'],
    ['',  '',                                                            11, false, '#ffffff', '#000000'],
    ['🚫', 'Com eliminar un plat (sense esborrar la fila)',              12, true,  '#e3f2fd',  '#0d47a1'],
    ['',  'Desmarca la casella de la columna "actiu". El plat desapareix de la web però les dades es conserven.', 11, false, '#ffffff', '#333333'],
    ['',  'MAI eliminis una fila si pots simplement desactivar-la.',    11, true,  '#fff8e1',  '#b71c1c'],
    ['',  '',                                                            11, false, '#ffffff', '#000000'],
    ['📂', 'Com afegir un grup nou (ex: Entrants, Postres)',             12, true,  '#e3f2fd',  '#0d47a1'],
    ['',  '1. Ves a la pestanya "grups" i afegeix una fila',            11, false, '#ffffff', '#333333'],
    ['',  '2. Omple: id (únic), menu_id, ordre, actiu (CERT), nom_ca', 11, false, '#ffffff', '#333333'],
    ['',  '3. Afegeix els plats del grup a la pestanya "plats" usant el nou grup_id', 11, false, '#ffffff', '#333333'],
    ['',  '',                                                            11, false, '#ffffff', '#000000'],
    ['📋', 'Com afegir un menú nou',                                     12, true,  '#e3f2fd',  '#0d47a1'],
    ['',  '1. Ves a la pestanya "menus" i afegeix una fila',            11, false, '#ffffff', '#333333'],
    ['',  '2. Omple: id (únic), ordre, preu, actiu (CERT), nom_ca',    11, false, '#ffffff', '#333333'],
    ['',  '3. Crea els grups a "grups" i els plats a "plats"',         11, false, '#ffffff', '#333333'],
    ['',  '',                                                            11, false, '#ffffff', '#000000'],
    ['⏱️', 'Quant triguen els canvis a veure\'s a la web?',              12, true,  '#e3f2fd',  '#0d47a1'],
    ['',  'Màxim 10 minuts (temps de memòria cau del navegador del visitant)', 11, false, '#ffffff', '#333333'],
    ['',  'Per veure el canvi immediatament: obre la pàgina en una finestra d\'incògnit', 11, false, '#ffffff', '#333333'],
    ['',  'O executa a la consola del navegador (F12): localStorage.removeItem(\'botic_menus_v1\')', 11, false, '#f3f3f3', '#333333'],
    ['',  '',                                                            11, false, '#ffffff', '#000000'],
    ['🔧', 'Eines del menú "Bo.TiC · Menús"',                           12, true,  '#e3f2fd',  '#0d47a1'],
    ['',  '✅  Validar dades → comprova que tot és correcte',            11, false, '#ffffff', '#333333'],
    ['',  '🔄  Actualitzar versió → força que tots els visitants recarreguin les dades', 11, false, '#ffffff', '#333333'],
    ['',  '👁️  Previsualitzar JSON → mostra les dades tal com les veurà la web',       11, false, '#ffffff', '#333333'],
    ['',  '🔍  Comprovar errors → detecta ids duplicats, camps buits i relacions trencades', 11, false, '#ffffff', '#333333']
  ];

  for (var i = 0; i < files.length; i++) {
    var f = files[i];
    var numFila = i + 1;
    if (f[0]) sheet.getRange(numFila, 1).setValue(f[0]);
    sheet.getRange(numFila, 2).setValue(f[1]);
    sheet.getRange(numFila, 1, 1, 2)
      .setBackground(f[4])
      .setFontColor(f[5])
      .setFontSize(f[2])
      .setFontWeight(f[3] ? 'bold' : 'normal')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(numFila, f[3] && f[2] >= 12 ? 35 : 24);
  }

  // Títol
  sheet.setRowHeight(1, 50);
  sheet.getRange(1, 1, 1, 2).setFontSize(15);
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS DE CREACIÓ
// ─────────────────────────────────────────────────────────────────────────────

function crear_o_reiniciar_pestanya_(ss, nom, columnes) {
  var sheet = ss.getSheetByName(nom);
  if (sheet) {
    sheet.clear();
    sheet.clearFormats();
    sheet.clearNotes();
    sheet.clearConditionalFormatRules();
    // Elimina tots els filtres existents
    var filter = sheet.getFilter();
    if (filter) filter.remove();
  } else {
    sheet = ss.insertSheet(nom);
  }
  if (columnes && columnes.length > 0) {
    var capRange = sheet.getRange(1, 1, 1, columnes.length);
    capRange.setValues([columnes]);
  }
  return sheet;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS DE FORMATACIÓ
// ─────────────────────────────────────────────────────────────────────────────

function aplicar_colors_capçalera_(sheet, nCols, colors) {
  sheet.setRowHeight(1, 40);
  for (var i = 0; i < nCols; i++) {
    sheet.getRange(1, i + 1)
      .setBackground(colors[i] || C.TEC_CLAR)
      .setFontColor(C.TEXT_BLANC)
      .setFontWeight('bold')
      .setFontSize(11)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
  }
}

function aplicar_fons_dades_(sheet, nCols, fons, numFiles) {
  for (var i = 0; i < nCols; i++) {
    sheet.getRange(2, i + 1, numFiles, 1).setBackground(fons[i] || C.F_BLANC);
  }
}

function aplicar_amplades_(sheet, amples) {
  for (var i = 0; i < amples.length; i++) {
    sheet.setColumnWidth(i + 1, amples[i]);
  }
}

function afegir_notes_(sheet, columnes, notes) {
  columnes.forEach(function(col, idx) {
    if (notes[col]) sheet.getRange(1, idx + 1).setNote(notes[col]);
  });
}

function aplicar_checkbox_actiu_(sheet, columna, numFiles) {
  var regla = SpreadsheetApp.newDataValidation()
    .requireCheckbox('CERT', 'FALS')
    .build();
  sheet.getRange(2, columna, numFiles, 1).setDataValidation(regla);
}

function aplicar_validacio_nombre_positiu_(sheet, columna, numFiles) {
  var regla = SpreadsheetApp.newDataValidation()
    .requireNumberGreaterThan(0)
    .setHelpText('Ha de ser un nombre positiu.')
    .build();
  sheet.getRange(2, columna, numFiles, 1).setDataValidation(regla);
}

function aplicar_format_condicional_buit_(sheet, columnes, filesInici, numFiles) {
  var regles = sheet.getConditionalFormatRules();
  columnes.forEach(function(col) {
    var range = sheet.getRange(filesInici, col, numFiles, 1);
    regles.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied('=AND(' + range.getA1Notation().split(':')[0] + '<>"",ISBLANK(' + range.getA1Notation().split(':')[0] + '))')
        .setBackground('#ffcdd2')
        .setRanges([range])
        .build()
    );
    // Red background if id cell is empty (row has content but no id)
    regles.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo('')
        .setBackground('#ffebee')
        .setRanges([range])
        .build()
    );
  });
  sheet.setConditionalFormatRules(regles);
}

// ─────────────────────────────────────────────────────────────────────────────
// LLEGIR DADES
// ─────────────────────────────────────────────────────────────────────────────

function llegir_dades_pestanya_(nom) {
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(nom);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var caps = data[0].map(function(h) { return String(h).trim(); });
  return data.slice(1)
    .filter(function(fila) { return fila.some(function(c) { return c !== '' && c !== null; }); })
    .map(function(fila) {
      var obj = {};
      caps.forEach(function(k, i) { obj[k] = fila[i]; });
      return obj;
    });
}

function llegir_config_() {
  var cfg = {};
  llegir_dades_pestanya_(PESTANYES.CONFIG).forEach(function(f) {
    cfg[String(f['clau']).trim()] = f['valor'];
  });
  return cfg;
}

function es_actiu_(val) {
  return val === true || val === 'CERT' || String(val).toUpperCase() === 'TRUE';
}

function sanititzar_(val) {
  if (typeof val === 'string') return val.replace(/<[^>]*>/g, '').trim();
  if (typeof val === 'number' || typeof val === 'boolean') return val;
  return String(val !== null && val !== undefined ? val : '').trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTRUIR JSON — FORMAT COMPATIBLE AMB EL FRONTEND
//
// El frontend (useMenusData.js) espera camps en anglès:
//   menus, groups, dishes, order, price, active, name_ca, group_id, etc.
// Aquí es fa la transformació Català → Anglès.
// ─────────────────────────────────────────────────────────────────────────────

function construir_json_menus_() {
  var cfg    = llegir_config_();
  var menus  = llegir_dades_pestanya_(PESTANYES.MENUS);
  var grups  = llegir_dades_pestanya_(PESTANYES.GRUPS);
  var plats  = llegir_dades_pestanya_(PESTANYES.PLATS);

  function ord(a, b) { return (Number(a['ordre']) || 0) - (Number(b['ordre']) || 0); }

  var menusActius = menus.filter(function(m) { return es_actiu_(m['actiu']); }).sort(ord);
  var grupsActius = grups.filter(function(g) { return es_actiu_(g['actiu']); }).sort(ord);
  var platsActius = plats.filter(function(p) { return es_actiu_(p['actiu']); }).sort(ord);

  var menuIds = new Set(menusActius.map(function(m) { return sanititzar_(m['id']); }));

  // Normalitza preu: sempre string amb " €" si té valor
  function formatar_preu(val) {
    var n = parseFloat(String(val).replace(/[^\d.,]/g, '').replace(',', '.'));
    return isNaN(n) || n <= 0 ? '' : n + ' €';
  }

  var menusOut = menusActius.map(function(m) {
    return {
      id:      sanititzar_(m['id']),
      order:   Number(m['ordre']) || 0,
      price:   formatar_preu(m['preu']),
      active:  true,
      name_ca: sanititzar_(m['nom_ca']),
      name_es: sanititzar_(m['nom_es'] || ''),
      name_fr: sanititzar_(m['nom_fr'] || ''),
      name_en: sanititzar_(m['nom_en'] || '')
    };
  });

  var grupsVàlids = grupsActius.filter(function(g) {
    return menuIds.has(sanititzar_(g['menu_id']));
  });
  var grupIds = new Set(grupsVàlids.map(function(g) { return sanititzar_(g['id']); }));

  var grupsOut = grupsVàlids.map(function(g) {
    return {
      id:        sanititzar_(g['id']),
      menu_id:   sanititzar_(g['menu_id']),
      seccio_id: sanititzar_(g['seccio_id'] || ''),
      order:     Number(g['ordre']) || 0,
      active:    true,
      name_ca:   sanititzar_(g['nom_ca']),
      name_es:   sanititzar_(g['nom_es'] || ''),
      name_fr:   sanititzar_(g['nom_fr'] || ''),
      name_en:   sanititzar_(g['nom_en'] || '')
    };
  });

  var platsOut = platsActius
    .filter(function(p) {
      return menuIds.has(sanititzar_(p['menu_id'])) &&
             grupIds.has(sanititzar_(p['grup_id']));
    })
    .map(function(p) {
      var sup = parseFloat(String(p['suplement']).replace(',', '.'));
      return {
        id:             sanititzar_(p['id']),
        menu_id:        sanititzar_(p['menu_id']),
        group_id:       sanititzar_(p['grup_id']),
        order:          Number(p['ordre']) || 0,
        active:         true,
        name_ca:        sanititzar_(p['nom_ca']),
        name_es:        sanititzar_(p['nom_es'] || ''),
        name_fr:        sanititzar_(p['nom_fr'] || ''),
        name_en:        sanititzar_(p['nom_en'] || ''),
        description_ca: sanititzar_(p['descripcio_ca'] || ''),
        description_es: sanititzar_(p['descripcio_es'] || ''),
        description_fr: sanititzar_(p['descripcio_fr'] || ''),
        description_en: sanititzar_(p['descripcio_en'] || ''),
        allergens:      sanititzar_(p['allergens'] || ''),
        supplement:     isNaN(sup) || sup <= 0 ? '' : String(sup)
      };
    });

  return {
    version:              String(cfg['versio'] || '1'),
    ultima_actualitzacio: String(cfg['ultima_actualitzacio'] || ''),
    temps_cache_minuts:   Number(cfg['temps_cache_minuts']) || 10,
    menus:   menusOut,
    groups:  grupsOut,
    dishes:  platsOut
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT API — doGet
// ─────────────────────────────────────────────────────────────────────────────

function doGet(e) {
  try {
    var cfg = llegir_config_();
    if (!es_actiu_(cfg['api_activa'])) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: true, message: 'API desactivada temporalment.' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var json = construir_json_menus_();
    return ContentService
      .createTextOutput(JSON.stringify(json))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: true, message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FUNCIONS DEL MENÚ
// ─────────────────────────────────────────────────────────────────────────────

function validar_dades() {
  var errors = obtenir_errors_();
  var ui = SpreadsheetApp.getUi();
  if (errors.length === 0) {
    ui.alert('✅  Validació correcta', 'No s\'han trobat errors. Les dades semblen correctes.', ui.ButtonSet.OK);
  } else {
    var msg = 'S\'han trobat ' + errors.length + ' problema(es):\n\n';
    msg += errors.slice(0, 12).join('\n');
    if (errors.length > 12) msg += '\n\n... i ' + (errors.length - 12) + ' errors més.';
    ui.alert('⚠️  Errors detectats', msg, ui.ButtonSet.OK);
  }
}

function comprovar_errors() {
  validar_dades();
}

function actualitzar_versio() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var configSheet = ss.getSheetByName(PESTANYES.CONFIG);
  if (!configSheet) {
    SpreadsheetApp.getUi().alert('Error', 'No s\'ha trobat la pestanya "configuracio".', SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  actualitzar_versio_interna_(configSheet);
  var cfg = llegir_config_();
  SpreadsheetApp.getUi().alert(
    '🔄  Versió actualitzada',
    'Versió: ' + cfg['versio'] + '\nActualitzat el: ' + cfg['ultima_actualitzacio'] + '\n\nEls visitants veuran els canvis com a màxim en ' + (cfg['temps_cache_minuts'] || 10) + ' minuts.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function previsualitzar_json() {
  try {
    var json = construir_json_menus_();
    var text = JSON.stringify(json, null, 2);
    var resum =
      'Menús actius: '   + json.menus.length   + '\n' +
      'Grups actius: '   + json.groups.length  + '\n' +
      'Plats actius: '   + json.dishes.length  + '\n' +
      'Versió: '         + json.version        + '\n' +
      'Mida JSON: '      + Math.round(text.length / 1024 * 10) / 10 + ' KB\n\n';

    var preview = text.length > 4000
      ? text.substring(0, 4000) + '\n\n... [JSON truncat a 4000 caràcters per a la previsualització]'
      : text;

    var html = HtmlService.createHtmlOutput(
      '<div style="font-family:sans-serif;font-size:12px;color:#333;margin-bottom:8px;">' +
      resum.replace(/\n/g, '<br>') + '</div>' +
      '<pre style="font-family:monospace;font-size:11px;white-space:pre-wrap;word-break:break-all;' +
      'background:#f8f9fa;padding:12px;border-radius:4px;border:1px solid #dadce0;max-height:380px;overflow-y:auto;">' +
      preview.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') +
      '</pre>'
    ).setWidth(740).setHeight(560).setTitle('Previsualització JSON — Bo.TiC Menús');

    SpreadsheetApp.getUi().showModalDialog(html, 'Previsualització JSON');
  } catch (err) {
    SpreadsheetApp.getUi().alert('Error en generar el JSON', err.message, SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

function obrir_instruccions() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(PESTANYES.INSTRUCCIONS);
  if (sheet) {
    ss.setActiveSheet(sheet);
  } else {
    SpreadsheetApp.getUi().alert(
      'No s\'ha trobat la pestanya d\'instruccions',
      'Executa "Bo.TiC · Menús → Configurar CMS" primer.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ONEDIT — Actualització automàtica en editar menus / grups / plats
// ─────────────────────────────────────────────────────────────────────────────

function onEdit(e) {
  var sheet = e.range.getSheet();
  var nomSheet = sheet.getName();

  // Només actua sobre les pestanyes de contingut
  if (PESTANYES_VIGILADES.indexOf(nomSheet) === -1) return;

  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Actualitza versió i data a la pestanya configuracio
  var configSheet = ss.getSheetByName(PESTANYES.CONFIG);
  if (configSheet) actualitzar_versio_interna_(configSheet);

  // A "plats", actualitza la columna "actualitzat_el" de la fila editada
  if (nomSheet === PESTANYES.PLATS) {
    var fila = e.range.getRow();
    var colEditada = e.range.getColumn();
    var colActualitzat = COL_PLATS.indexOf('actualitzat_el') + 1;  // 1-based
    // Evita bucle: no actualitzis si l'edició ja és a la columna actualitzat_el
    if (fila > 1 && colEditada !== colActualitzat) {
      var ara = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
      sheet.getRange(fila, colActualitzat).setValue(ara);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS INTERNS
// ─────────────────────────────────────────────────────────────────────────────

function actualitzar_versio_interna_(configSheet) {
  var data = configSheet.getDataRange().getValues();
  if (data.length < 2) return;
  var caps = data[0].map(function(h) { return String(h).trim(); });
  var iClau  = caps.indexOf('clau');
  var iValor = caps.indexOf('valor');
  if (iClau === -1 || iValor === -1) return;

  var ara = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss');
  for (var i = 1; i < data.length; i++) {
    var clau = String(data[i][iClau]).trim();
    if (clau === 'ultima_actualitzacio') {
      configSheet.getRange(i + 1, iValor + 1).setValue(ara);
    } else if (clau === 'versio') {
      configSheet.getRange(i + 1, iValor + 1).setValue((Number(data[i][iValor]) || 0) + 1);
    }
  }
}

function obtenir_errors_() {
  var errors = [];

  var menus  = llegir_dades_pestanya_(PESTANYES.MENUS);
  var grups  = llegir_dades_pestanya_(PESTANYES.GRUPS);
  var plats  = llegir_dades_pestanya_(PESTANYES.PLATS);

  // Validació menus
  var idsMenus = new Set();
  menus.forEach(function(m, i) {
    var f = i + 2;
    var id = String(m['id'] || '').trim();
    if (!id) {
      errors.push('menus · fila ' + f + ': falta el camp "id" (obligatori)');
    } else if (idsMenus.has(id)) {
      errors.push('menus · fila ' + f + ': id duplicat "' + id + '"');
    } else {
      idsMenus.add(id);
    }
    if (!String(m['nom_ca'] || '').trim()) errors.push('menus · fila ' + f + ': falta "nom_ca" (obligatori)');
    if (m['ordre'] !== '' && isNaN(Number(m['ordre']))) errors.push('menus · fila ' + f + ': "ordre" ha de ser un nombre');
  });

  // Validació grups
  var idsGrups = new Set();
  grups.forEach(function(g, i) {
    var f = i + 2;
    var id = String(g['id'] || '').trim();
    if (!id) {
      errors.push('grups · fila ' + f + ': falta el camp "id"');
    } else if (idsGrups.has(id)) {
      errors.push('grups · fila ' + f + ': id duplicat "' + id + '"');
    } else {
      idsGrups.add(id);
    }
    var mId = String(g['menu_id'] || '').trim();
    if (!idsMenus.has(mId)) errors.push('grups · fila ' + f + ': menu_id "' + mId + '" no existeix a la pestanya "menus"');
    if (!String(g['nom_ca'] || '').trim()) errors.push('grups · fila ' + f + ': falta "nom_ca"');
  });

  // Validació plats
  var idsPlats = new Set();
  plats.forEach(function(p, i) {
    var f = i + 2;
    var id = String(p['id'] || '').trim();
    if (!id) {
      errors.push('plats · fila ' + f + ': falta el camp "id"');
    } else if (idsPlats.has(id)) {
      errors.push('plats · fila ' + f + ': id duplicat "' + id + '"');
    } else {
      idsPlats.add(id);
    }
    var mId = String(p['menu_id'] || '').trim();
    var gId = String(p['grup_id'] || '').trim();
    if (!idsMenus.has(mId)) errors.push('plats · fila ' + f + ': menu_id "' + mId + '" no existeix a "menus"');
    if (!idsGrups.has(gId)) errors.push('plats · fila ' + f + ': grup_id "' + gId + '" no existeix a "grups"');
    if (!String(p['nom_ca'] || '').trim()) errors.push('plats · fila ' + f + ': falta "nom_ca"');
  });

  return errors;
}
