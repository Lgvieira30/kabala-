// ============================================================
// Kabala de Mussifin — Apps Script para validação de chaves
// Colar em: Google Sheets > Extensões > Apps Script
// Publicar como: Executar como "Eu", Acesso "Qualquer pessoa"
// ============================================================

var NOME_ABA = 'Chaves';

// Colunas da aba "Chaves":
// A = chave | B = whatsapp | C = nome | D = criada_em | E = acessada_em | F = pagou

function doGet(e) {
  var acao  = e.parameter.acao;
  var chave = (e.parameter.k || '').trim().toLowerCase();

  var resultado;

  if (acao === 'validar') {
    resultado = validarChave(chave);
  } else if (acao === 'marcar_acesso') {
    resultado = marcarAcesso(chave);
  } else if (acao === 'criar') {
    resultado = criarChave(chave, e.parameter.whatsapp, e.parameter.nome);
  } else {
    resultado = { erro: 'acao_invalida' };
  }

  return ContentService
    .createTextOutput(JSON.stringify(resultado))
    .setMimeType(ContentService.MimeType.JSON);
}

function validarChave(chave) {
  if (!chave) return { valida: false };

  var aba   = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOME_ABA);
  var dados = aba.getDataRange().getValues();

  for (var i = 1; i < dados.length; i++) {
    var chaveCadastrada = (dados[i][0] || '').toString().trim().toLowerCase();
    if (chaveCadastrada === chave) {
      return { valida: true };
    }
  }

  return { valida: false };
}

function criarChave(chave, whatsapp, nome) {
  if (!chave) return { ok: false, erro: 'chave_vazia' };
  var aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOME_ABA);
  aba.appendRow([chave, whatsapp || '', nome || '', new Date(), '', false]);
  return { ok: true, chave: chave };
}

function marcarAcesso(chave) {
  if (!chave) return { ok: false };

  var aba   = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOME_ABA);
  var dados = aba.getDataRange().getValues();

  for (var i = 1; i < dados.length; i++) {
    var chaveCadastrada = (dados[i][0] || '').toString().trim().toLowerCase();
    if (chaveCadastrada === chave) {
      aba.getRange(i + 1, 5).setValue(new Date()); // coluna E = acessada_em
      return { ok: true };
    }
  }

  return { ok: false };
}
