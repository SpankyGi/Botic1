/** Add as a separate Apps Script file alongside bo-tic-cms.gs.
 * Set BOTIC_ADMIN_USER and BOTIC_ADMIN_PASSWORD in Script Properties yourself.
 * Use a unique generated password (at least 20 characters). Never commit it.
 * No setup function resets or seeds existing menu sheets.
 */
var ADMIN_FIELDS = {
  menus: ['ordre','preu','actiu','nom_ca','nom_es','nom_fr','nom_en'],
  seccions: ['ordre','actiu','nom_ca','nom_es','nom_fr','nom_en'],
  grups: ['ordre','actiu','nom_ca','nom_es','nom_fr','nom_en'],
  plats: ['ordre','actiu','nom_ca','nom_es','nom_fr','nom_en','descripcio_ca','descripcio_es','descripcio_fr','descripcio_en','allergens','suplement'],
  avisos: ['ordre','actiu','nom_ca','nom_es','nom_fr','nom_en','inici','fi']
};
function adminJson_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function adminDigest_(text) {
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text));
}
function adminEqual_(a, b) {
  var x = adminDigest_(String(a)), y = adminDigest_(String(b)), diff = 0;
  for (var i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}
function adminSnapshot_() {
  var data = {};
  Object.keys(ADMIN_FIELDS).forEach(function(name) {
    data[name] = llegir_dades_pestanya_(name).filter(function(r) { return r.id; });
  });
  // Revision covers direct spreadsheet edits, not just the version counter.
  return { data: data, revision: adminDigest_(JSON.stringify(data)) };
}
function adminReadNotices_() {
  return llegir_dades_pestanya_('avisos').filter(function(r) { return r.id && es_actiu_(r.actiu); });
}
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var raw = (e && e.postData && e.postData.contents) || '{}';
    if (raw.length > 40000) throw new Error('Petició massa gran.');
    var body = JSON.parse(raw);
    var props = PropertiesService.getScriptProperties();
    var user = props.getProperty('BOTIC_ADMIN_USER');
    var password = props.getProperty('BOTIC_ADMIN_PASSWORD');
    if (!user || !password || password.length < 20) throw new Error('Accés pendent de configurar.');
    lock.waitLock(10000);
    var cache = CacheService.getScriptCache();
    if (body.action === 'login') {
      var failures = Number(cache.get('botic-login-failures') || 0);
      if (failures >= 10) throw new Error('Massa intents. Torna-ho a provar al cap de 15 minuts.');
      if (!adminEqual_(body.user || '', user) || !adminEqual_(body.password || '', password)) {
        cache.put('botic-login-failures', String(failures + 1), 900);
        throw new Error('Usuari o contrasenya incorrectes.');
      }
      cache.remove('botic-login-failures');
      var token = Utilities.getUuid() + Utilities.getUuid();
      cache.put('botic-session-' + adminDigest_(token), adminDigest_(user + password), 3600);
      return adminJson_({ ok: true, token: token, snapshot: adminSnapshot_() });
    }
    var key = 'botic-session-' + adminDigest_(String(body.token || ''));
    if (cache.get(key) !== adminDigest_(user + password)) throw new Error('Sessió caducada. Torna a entrar.');
    if (body.action === 'logout') { cache.remove(key); return adminJson_({ ok: true }); }
    if (body.action === 'read') return adminJson_({ ok: true, snapshot: adminSnapshot_() });
    if (body.action !== 'save') throw new Error('Acció desconeguda.');
    var snapshot = adminSnapshot_();
    if (body.revision !== snapshot.revision) throw new Error('Les dades han canviat. Recarrega abans de desar.');
    var table = String(body.table || '');
    if (!Object.prototype.hasOwnProperty.call(ADMIN_FIELDS, table)) throw new Error('Taula no vàlida.');
    var row = snapshot.data[table].find(function(r) { return r.id === body.id; });
    if (!row) throw new Error('Registre no trobat.');
    var values = body.values;
    if (!values || typeof values !== 'object' || Array.isArray(values)) throw new Error('Dades no vàlides.');
    Object.keys(values).forEach(function(field) {
      if (ADMIN_FIELDS[table].indexOf(field) < 0) throw new Error('Camp no editable.');
      var v = values[field];
      if (field === 'actiu') {
        if (v !== 'CERT' && v !== 'FALS') throw new Error('Activació no vàlida.');
      } else if (['ordre','preu','suplement'].indexOf(field) >= 0) {
        if (!(field === 'suplement' && v === '') && (typeof v !== 'number' || !isFinite(v) || (field === 'suplement' ? v < 0 : v <= 0))) throw new Error('Número no vàlid.');
      } else if (typeof v !== 'string' || v.length > 3000 || /^[=+@]/.test(v) || /<[^>]*>/.test(v)) {
        throw new Error('Text no vàlid. No introdueixis fórmules ni HTML.');
      }
      if (['inici','fi'].indexOf(field) >= 0 && v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new Error('Data no vàlida.');
    });
    var next = Object.assign({}, row, values);
    if (table === 'avisos' && next.inici && next.fi && next.fi < next.inici) throw new Error('La data final és anterior a la inicial.');
    if (table === 'avisos' && next.actiu === 'CERT' && !String(next.nom_ca || '').trim()) throw new Error('Escriu el text de l’avís.');
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table);
    var grid = sheet.getDataRange().getValues(), headers = grid[0];
    var index = grid.findIndex(function(r, i) { return i > 0 && r[0] === body.id; });
    if (index < 1) throw new Error('Registre no trobat.');
    Object.keys(values).forEach(function(field) {
      var col = headers.indexOf(field);
      if (col < 0) throw new Error('Columna no trobada.');
      // Text format for dates avoids timezone shifts when reading back.
      if (field === 'inici' || field === 'fi') sheet.getRange(index + 1, col + 1).setNumberFormat('@');
      sheet.getRange(index + 1, col + 1).setValue(values[field]);
    });
    if (table === 'plats') sheet.getRange(index + 1, headers.indexOf('actualitzat_el') + 1).setValue(new Date());
    actualitzar_versio_interna_(SpreadsheetApp.getActiveSpreadsheet().getSheetByName('configuracio'));
    SpreadsheetApp.flush();
    return adminJson_({ ok: true, snapshot: adminSnapshot_() });
  } catch (error) {
    return adminJson_({ ok: false, error: String(error.message || error) });
  } finally { if (lock.hasLock()) lock.releaseLock(); }
}
