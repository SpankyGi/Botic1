// Manual Apps Script test. This function can ONLY write to the disposable copy.
function testAdminRecoveryCopy() {
  var copyId = '1D5veHW_5M9ilIETPgBMvbzBXzxqfKjhC5v83JVGDmpI';
  if (SpreadsheetApp.getActiveSpreadsheet().getId() === copyId) throw new Error('Unexpected active spreadsheet');
  var ss = SpreadsheetApp.openById(copyId);
  if (ss.getId() !== copyId || ss.getName().indexOf('proves admin') < 0) throw new Error('Test-copy guard failed');
  var props = PropertiesService.getScriptProperties();
  var backup = {};
  ['plats','menus','configuracio'].forEach(function(name) { backup[name] = ss.getSheetByName(name).getDataRange().getValues(); });
  var receipts = [];
  function check(condition, label) { if (!condition) throw new Error('FAIL: ' + label); console.log('PASS: ' + label); }
  function login() { var r = adminHandle_({action:'login',user:props.getProperty('BOTIC_ADMIN_USER'),password:props.getProperty('BOTIC_ADMIN_PASSWORD')},ss); check(r.ok,'authenticated test session'); return r; }
  function make(session, table, row, values) {
    var id = Utilities.getUuid(); receipts.push('botic-save-' + copyId + '-' + id);
    return {action:'save',token:session.token,requestId:id,createdAt:Date.now(),recordRevision:row._revision,table:table,id:row.id,values:values};
  }
  try {
    var a=login(), b=login();
    var dish=a.snapshot.data.plats[0], other=a.snapshot.data.plats[1], menu=a.snapshot.data.menus[0];
    var request=make(a,'plats',dish,{nom_ca:'PROVA TÈCNICA — no publicat'});
    var saved=adminHandle_(request,ss);
    check(saved.ok && saved.requestId===request.requestId,'changed dish saved with receipt');
    var row=saved.snapshot.data.plats.find(function(r){return r.id===dish.id;});
    check(row.nom_ca==='PROVA TÈCNICA — no publicat','read-back matches changed text');
    var repeat=adminHandle_(request,ss);
    check(repeat.ok && repeat.snapshot.data.plats.find(function(r){return r.id===dish.id;})._revision===row._revision,'lost-response replay does not rewrite timestamp or row');
    var clash=adminHandle_(make(b,'plats',b.snapshot.data.plats[0],{nom_ca:'STALE OVERWRITE'}),ss);
    check(!clash.ok && clash.code==='CONFLICT','second session cannot overwrite changed dish');
    check(adminHandle_(make(b,'plats',other,{nom_ca:'OTHER TEST RECORD'}),ss).ok,'independent dish can be edited by second session');
    var price=adminHandle_(make(a,'menus',menu,{preu:123.45}),ss);
    check(price.ok && price.snapshot.data.menus[0].preu===123.45,'test price changed and read back');
    var read=adminHandle_({action:'read',token:a.token,requestId:request.requestId},ss);
    check(read.ok && read.receipt.state==='done','persistent receipt can be consulted');
    check(adminHandle_({action:'read',token:'invalid-test-session'},ss).code==='SESSION_EXPIRED','invalid session rejected');
    console.log('ALL REAL GOOGLE SHEETS COPY TESTS PASSED');
  } finally {
    Object.keys(backup).forEach(function(name) { var grid=backup[name]; ss.getSheetByName(name).getRange(1,1,grid.length,grid[0].length).setValues(grid); });
    SpreadsheetApp.flush();
    Object.keys(backup).forEach(function(name) { check(JSON.stringify(ss.getSheetByName(name).getDataRange().getValues())===JSON.stringify(backup[name]),'test-copy '+name+' restored exactly'); });
    receipts.forEach(function(k){props.deleteProperty(k);});
    console.log('Only the allowlisted test copy was written. Production menu data was never a write target.');
  }
}
