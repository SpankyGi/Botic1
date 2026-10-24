/** Add as a separate Apps Script file alongside bo-tic-cms.gs.
 * Set BOTIC_ADMIN_USER and BOTIC_ADMIN_PASSWORD in Script Properties yourself.
 * Use a unique password (at least 9 characters). Never commit it.
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
function adminRowRevision_(row) {
  var clean = {};
  Object.keys(row).filter(function(k) { return k !== '_revision'; }).sort().forEach(function(k) { clean[k] = row[k]; });
  return adminDigest_(JSON.stringify(clean));
}
function adminRows_(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return [];
  var grid = sheet.getDataRange().getValues(), headers = grid.shift();
  return grid.filter(function(r) { return r[0]; }).map(function(r) {
    var row = {}; headers.forEach(function(h, i) { row[String(h).trim()] = r[i]; });
    return row;
  });
}
function adminSnapshot_(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  var data = {};
  Object.keys(ADMIN_FIELDS).forEach(function(name) {
    data[name] = adminRows_(ss, name);
  });
  var revision = adminDigest_(JSON.stringify(data));
  Object.keys(data).forEach(function(name) { data[name].forEach(function(row) { row._revision = adminRowRevision_(row); }); });
  return { data: data, revision: revision, protocol: 2 };
}
function adminReadNotices_() {
  return llegir_dades_pestanya_('avisos').filter(function(r) { return r.id && es_actiu_(r.actiu); });
}
function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || '{}';
    if (raw.length > 40000) throw new Error('Petició massa gran.');
    return adminJson_(adminHandle_(JSON.parse(raw)));
  } catch (error) { return adminJson_({ ok: false, error: String(error.message || error) }); }
}
// The optional spreadsheet is only used by server-side tests, never from a request.
function adminHandle_(body, ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  var lock = LockService.getScriptLock();
  try {
    var props = PropertiesService.getScriptProperties();
    var user = props.getProperty('BOTIC_ADMIN_USER');
    var password = props.getProperty('BOTIC_ADMIN_PASSWORD');
    if (!user || !password) throw new Error('Accés pendent de configurar.');
    if (password.length < 9) throw new Error('La contrasenya configurada ha de tenir almenys 9 caràcters.');
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
      return { ok: true, token: token, snapshot: adminSnapshot_(ss) };
    }
    var key = 'botic-session-' + adminDigest_(String(body.token || ''));
    if (cache.get(key) !== adminDigest_(user + password)) return { ok: false, code: 'SESSION_EXPIRED', error: 'La sessió ha caducat. Torna a identificar-te; conservem els teus textos.' };
    if (body.action === 'logout') { cache.remove(key); return { ok: true }; }
    if (body.action === 'read') {
      var savedReceipt = body.requestId && /^[a-f0-9-]{36}$/i.test(body.requestId) ? props.getProperty('botic-save-' + ss.getId() + '-' + body.requestId) : null;
      return { ok: true, snapshot: adminSnapshot_(ss), receipt: savedReceipt ? { requestId: body.requestId, state: JSON.parse(savedReceipt).state } : null };
    }
    if (body.action !== 'save') throw new Error('Acció desconeguda.');
    var snapshot = adminSnapshot_(ss);
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
    var receiptKey, receipt, fingerprint;
    if (body.requestId) {
      if (!/^[a-f0-9-]{36}$/i.test(body.requestId)) throw new Error('Identificador de desament no vàlid.');
      if (typeof body.createdAt !== 'number' || Date.now() - body.createdAt > 86400000 || body.createdAt > Date.now() + 300000) throw new Error('Aquest intent de desament ha caducat. Revisa les dades abans de tornar-ho a provar.');
      receiptKey = 'botic-save-' + ss.getId() + '-' + body.requestId;
      fingerprint = adminDigest_(JSON.stringify({ owner: user, table: table, id: body.id, values: values, recordRevision: body.recordRevision, createdAt: body.createdAt }));
      var stored = props.getProperty(receiptKey);
      receipt = stored ? JSON.parse(stored) : null;
      if (receipt && receipt.fingerprint !== fingerprint) throw new Error('Aquest identificador ja correspon a un altre canvi.');
      if (receipt && receipt.state === 'done') return { ok: true, requestId: body.requestId, snapshot: snapshot };
      // A crash after the row write must be recovered without writing it again.
      if (receipt && adminValuesMatch_(row, values)) {
        receipt.state = 'done'; props.setProperty(receiptKey, JSON.stringify(receipt));
        return { ok: true, requestId: body.requestId, snapshot: snapshot };
      }
    }
    var expected = receipt ? receipt.before : body.recordRevision;
    if (expected ? expected !== row._revision : body.revision !== snapshot.revision) return { ok: false, code: 'CONFLICT', snapshot: snapshot, error: 'Aquest registre ha canviat en una altra sessió. Conservem els teus textos. Cancel·la i obre el registre actualitzat per revisar-lo.' };
    if (receiptKey && !receipt) {
      // Durable receipts contain hashes only, never passwords or menu text.
      var all = props.getProperties(), receiptCount = 0;
      Object.keys(all).filter(function(k) { return k.indexOf('botic-save-') === 0; }).forEach(function(k) {
        if (Date.now() - JSON.parse(all[k]).createdAt > 86400000) props.deleteProperty(k); else receiptCount++;
      });
      if (receiptCount >= 500) throw new Error('S’ha arribat al límit de desaments del dia. Contacta amb el suport.');
      receipt = { fingerprint: fingerprint, before: row._revision, state: 'pending', createdAt: body.createdAt };
      props.setProperty(receiptKey, JSON.stringify(receipt));
    }
    var sheet = ss.getSheetByName(table);
    var grid = sheet.getDataRange().getValues(), headers = grid[0];
    var index = grid.findIndex(function(r, i) { return i > 0 && r[0] === body.id; });
    if (index < 1) throw new Error('Registre no trobat.');
    var range = sheet.getRange(index + 1, 1, 1, headers.length);
    var formulas = range.getFormulas()[0];
    var updated = grid[index].map(function(v, i) { return formulas[i] || v; });
    Object.keys(values).forEach(function(field) {
      var col = headers.indexOf(field);
      if (col < 0) throw new Error('Columna no trobada.');
      // Text format for dates avoids timezone shifts when reading back.
      if (field === 'inici' || field === 'fi') sheet.getRange(index + 1, col + 1).setNumberFormat('@');
      updated[col] = values[field];
    });
    if (table === 'plats' && headers.indexOf('actualitzat_el') >= 0) updated[headers.indexOf('actualitzat_el')] = new Date();
    // One row write avoids leaving half of a translated dish updated.
    range.setValues([updated]);
    SpreadsheetApp.flush();
    var after = adminSnapshot_(ss);
    var saved = after.data[table].find(function(r) { return r.id === body.id; });
    if (!adminValuesMatch_(saved, values)) throw new Error('No s’ha pogut verificar el canvi. Conserva els textos i torna-ho a comprovar.');
    if (receiptKey) { receipt.state = 'done'; props.setProperty(receiptKey, JSON.stringify(receipt)); }
    // The public feed reads live rows; its version counter is only a cache hint.
    try { actualitzar_versio_interna_(ss.getSheetByName('configuracio')); } catch (ignored) {}
    return { ok: true, requestId: body.requestId || null, snapshot: after };
  } catch (error) {
    return { ok: false, error: String(error.message || error), uncertain: !!receiptKey };
  } finally { if (lock.hasLock()) lock.releaseLock(); }
}
function adminValuesMatch_(row, values) {
  return !!row && Object.keys(values).every(function(k) {
    if (k === 'actiu') return (row[k] === true || row[k] === 'CERT') === (values[k] === true || values[k] === 'CERT');
    return String(row[k] == null ? '' : row[k]) === String(values[k] == null ? '' : values[k]);
  });
}
