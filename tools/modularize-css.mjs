// CSS modularization helper. Keep this script logic-only: it must not change calculator JavaScript.
import fs from 'node:fs';
import path from 'node:path';

const sourcePath = 'kalkulator-pionier-dev/index.html/kalkulator_pionier_energia_v55_.html.html';
const html = fs.readFileSync(sourcePath, 'utf8');
const styleMatch = html.match(/<style>\r?\n?([\s\S]*?)\r?\n?<\/style>/);
if (!styleMatch) throw new Error('No <style> block found in source HTML');
const css = styleMatch[1];

function readBlock(input, start) {
  const open = input.indexOf('{', start);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < input.length; i++) {
    if (input[i] === '{') depth++;
    else if (input[i] === '}') {
      depth--;
      if (depth === 0) return { end: i + 1, text: input.slice(start, i + 1) };
    }
  }
  throw new Error(`Unclosed CSS block at ${start}`);
}

function extractPrintBlocks(input) {
  let rest = '';
  let print = '';
  let i = 0;
  while (i < input.length) {
    const idx = input.indexOf('@media print', i);
    if (idx === -1) {
      rest += input.slice(i);
      break;
    }
    rest += input.slice(i, idx);
    const block = readBlock(input, idx);
    print += `${block.text.trim()}\n\n`;
    i = block.end;
  }
  return { rest, print };
}

function topLevelChunks(input) {
  const chunks = [];
  let i = 0;
  while (i < input.length) {
    let start = i;
    while (start < input.length && /\s/.test(input[start])) start++;
    if (start >= input.length) break;
    if (input.startsWith('/*', start)) {
      const end = input.indexOf('*/', start + 2);
      if (end === -1) throw new Error('Unclosed CSS comment');
      chunks.push(input.slice(start, end + 2));
      i = end + 2;
      continue;
    }
    const block = readBlock(input, start);
    if (!block) break;
    chunks.push(block.text);
    i = block.end;
  }
  return chunks;
}

function bracesBalanced(text) {
  let depth = 0;
  for (const ch of text) {
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    if (depth < 0) return false;
  }
  return depth === 0;
}

const { rest, print } = extractPrintBlocks(css);
const chunks = topLevelChunks(rest);
const reportMarkers = [
  '.report', '.reportPage', '.reportHead', '.reportTitle', '.rGrid', '.rBox',
  '.heroReport', '.homeImg', '.recommendBlock', '.kpi', '.balanceNote',
  '.reportVariants', '.reportVariant', '.variantImg', '.flag', '.bigMoney',
  '.grossMoney', '.benefit', '.detailTable', '.tariffTable', '.pstryk',
  '.contactGrid', '.peopleImg', '.legal', '.chartTiny', '.barCurrent', '.barAfter',
  '.scenario', '.neg', '.compactReport', '.energy', '.tariffReadable',
  '.savingsAlt', '.contactBox', '#pstrykInfoBox', '.netbillingNote',
  '.reportCostLabel', '.variantOrderNote'
];
const main = [];
const report = [];
for (const chunk of chunks) {
  const isReport = reportMarkers.some(marker => chunk.includes(marker));
  (isReport ? report : main).push(chunk);
}

fs.mkdirSync('css', { recursive: true });
const header = '/* Extracted from kalkulator_pionier_energia_v55_.html.html. CSS only; JavaScript logic unchanged. */\n\n';
const mainCss = `${header}${main.join('\n\n').trim()}\n`;
const reportCss = `${header}${report.join('\n\n').trim()}\n`;
const printCss = `${header}${print.trim()}\n`;

for (const [name, content] of [['main.css', mainCss], ['report.css', reportCss], ['print.css', printCss]]) {
  if (!bracesBalanced(content)) throw new Error(`${name} has unbalanced braces`);
  fs.writeFileSync(path.join('css', name), content, 'utf8');
}

const links = '<link rel="stylesheet" href="css/main.css">\n<link rel="stylesheet" href="css/report.css">\n<link rel="stylesheet" href="css/print.css">';
const newHtml = html.replace(styleMatch[0], links);
if (/<style>/.test(newHtml)) throw new Error('Inline <style> block still present after extraction');
if ((html.match(/<script>/g) || []).length !== (newHtml.match(/<script>/g) || []).length) {
  throw new Error('Script tag count changed unexpectedly');
}
fs.writeFileSync('index.html', newHtml, 'utf8');

const planPath = 'docs/reorganization-plan.md';
if (fs.existsSync(planPath)) {
  let plan = fs.readFileSync(planPath, 'utf8');
  plan = plan.replace('## Etap 2 - nastepny bezpieczny krok', '## Etap 2 - wykonany');
  plan = plan.replace('Mechanicznie wydzielic CSS z bloku `<style>` w pliku produkcyjnym:', 'CSS zostal mechanicznie wydzielony z bloku `<style>` w pliku produkcyjnym:');
  fs.writeFileSync(planPath, plan, 'utf8');
}

console.log(JSON.stringify({
  sourcePath,
  cssBytes: Buffer.byteLength(css),
  mainRules: main.length,
  reportRules: report.length,
  printBlocks: (print.match(/@media print/g) || []).length,
  output: ['index.html', 'css/main.css', 'css/report.css', 'css/print.css']
}, null, 2));
