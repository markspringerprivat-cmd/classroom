const fallbackStudents = [
  { id: 'julius', name: 'Julius', age: 12, note: 'verträgt sich schlecht mit anderen Jungs' },
  { id: 'petra', name: 'Petra', age: 15, note: 'lenkt häufig Sitznachbar*innen ab' },
  { id: 'mehmet', name: 'Mehmet', age: 13, note: 'arbeitet ruhig und stabilisiert Gruppen' },
  { id: 'lina', name: 'Lina', age: 12, note: 'reagiert empfindlich auf Kritik und Spott' },
  { id: 'ben', name: 'Ben', age: 14, note: 'testet gerne Grenzen aus' },
  { id: 'sara', name: 'Sara', age: 13, note: 'arbeitet zuverlässig und hilft anderen' },
  { id: 'tom', name: 'Tom', age: 12, note: 'sucht Aufmerksamkeit durch Zwischenrufe' },
  { id: 'emily', name: 'Emily', age: 13, note: 'braucht klare Orientierung bei Übergängen' },
  { id: 'niklas', name: 'Niklas', age: 14, note: 'versteckt gern das Handy unter dem Tisch' },
  { id: 'amira', name: 'Amira', age: 12, note: 'vermittelt oft zwischen Mitschüler*innen' }
];

const hiddenDefaults = {
  julius: { gender: 'm', risk: 3, conflictWithBoys: true, needsMonitoring: true },
  petra: { gender: 'f', risk: 3, distractor: true, needsMonitoring: true },
  mehmet: { gender: 'm', risk: 1, stabilizer: true },
  lina: { gender: 'f', risk: 2, sensitive: true, needsSafety: true },
  ben: { gender: 'm', risk: 3, boundaryTesting: true, needsMonitoring: true },
  sara: { gender: 'f', risk: 1, stabilizer: true },
  tom: { gender: 'm', risk: 3, callsOut: true, needsMonitoring: true },
  emily: { gender: 'f', risk: 2, transitions: true, needsStructure: true },
  niklas: { gender: 'm', risk: 3, phoneRisk: true, needsMonitoring: true },
  amira: { gender: 'f', risk: 1, mediator: true }
};

const ruleCatalog = {
  melden: 'Wir melden uns, bevor wir sprechen.',
  ausreden: 'Wir hören einander ausreden.',
  handy: 'Handys bleiben während des Unterrichts in der Tasche.',
  platz: 'Während Arbeitsphasen bleiben wir am Platz, außer es gibt einen Auftrag.',
  lautstaerke: 'Wir sprechen in Arbeitsphasen in angemessener Lautstärke.',
  respekt: 'Wir gehen respektvoll mit Fehlern und Beiträgen anderer um.',
  hilfezeichen: 'Wenn wir Hilfe brauchen, nutzen wir zuerst das vereinbarte Hilfesignal.',
  rollen: 'Bei Gruppenarbeit hat jede Person eine klare Aufgabe.',
  material: 'Material wird nur nach dem vereinbarten Ablauf geholt.',
  stoppsignal: 'Beim Ruhezeichen stoppen wir Gespräche und richten den Blick nach vorne.',
  start: 'Zu Beginn liegt das Arbeitsmaterial bereit und die Startaufgabe wird bearbeitet.',
  wechsel: 'Beim Wechsel der Sozialform warten wir auf das Startsignal.',
  kommentar: 'Kommentare über Mitschüler*innen werden unterlassen.',
  meldenplus: 'Wer sprechen möchte, meldet sich und wartet, bis er oder sie aufgerufen wird.',
  pausen: 'Private Gespräche werden auf Pausen verschoben.'
};

const lessonGrid = document.getElementById('lessonGrid');
const lessonTimer = document.getElementById('lessonTimer');
const lessonPhase = document.getElementById('lessonPhase');
const lessonScoreText = document.getElementById('lessonScoreText');
const lessonLifeSegments = document.getElementById('lessonLifeSegments');
const lessonLifeHint = document.getElementById('lessonLifeHint');
const eventStatusTitle = document.getElementById('eventStatusTitle');
const eventStatusText = document.getElementById('eventStatusText');
const startLessonBtn = document.getElementById('startLessonBtn');
const stepSummary = document.getElementById('stepSummary');
const selectedRulesList = document.getElementById('selectedRulesList');
const ruleCountPill = document.getElementById('ruleCountPill');
const scenarioModal = document.getElementById('scenarioModal');
const scenarioModalType = document.getElementById('scenarioModalType');
const scenarioModalTitle = document.getElementById('scenarioModalTitle');
const scenarioModalSource = document.getElementById('scenarioModalSource');
const scenarioModalScene = document.getElementById('scenarioModalScene');
const scenarioModalAnswers = document.getElementById('scenarioModalAnswers');
const scenarioModalOutcome = document.getElementById('scenarioModalOutcome');
const continueLessonBtn = document.getElementById('continueLessonBtn');
const scenarioList = document.getElementById('scenarioList');
const scenarioCount = document.getElementById('scenarioCount');
const scenarioDrawer = document.getElementById('scenarioDrawer');
const openScenarioBtn = document.getElementById('openScenarioBtn');
const closeScenarioBtn = document.getElementById('closeScenarioBtn');

function readJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('Daten konnten nicht gelesen werden:', key, error);
    return fallback;
  }
}

const step1 = readJson('classroomGame.step1', {});
const rulesData = readJson('classroomGame.step2.rules', { acceptedRules: [], acceptedRuleIds: [] });
const context = buildContext(step1, rulesData);
const SCENARIOS = buildDynamicScenarios(context);

const lessonState = {
  started: false,
  ended: false,
  timeLeft: 600,
  score: clampScore(context.startScore),
  teacher: { ...context.teacher },
  activeEvent: null,
  currentScenario: null,
  usedScenarioIds: new Set(),
  timerId: null,
  eventTimeoutId: null,
  responseTimeoutId: null,
  responseIntervalId: null,
  responseLeft: 0,
  dragTeacher: false
};

function buildContext(stepData, ruleData) {
  const students = enrichStudents(Array.isArray(stepData?.students) ? stepData.students : fallbackStudents);
  const rows = Number(stepData?.rows || 9);
  const cols = Number(stepData?.cols || 10);
  const desks = Array.isArray(stepData?.desks) && stepData.desks.length ? stepData.desks : defaultDesks();
  const assignments = stepData?.assignments || {};
  const metrics = stepData?.metrics || {};
  const blockedCells = Array.isArray(stepData?.blockedCells) ? stepData.blockedCells : defaultBlockedCells();
  const objects = stepData?.objects || { trash: [], broom: null };
  const teacher = stepData?.teacher ? { ...stepData.teacher } : { row: 1, col: 4, dir: 'down', mode: 'frontStanding' };
  const studentById = Object.fromEntries(students.map(student => [student.id, student]));
  const deskById = Object.fromEntries(desks.map(desk => [desk.id, desk]));
  const deskByStudentId = {};

  Object.entries(assignments).forEach(([deskId, studentId]) => {
    const desk = deskById[deskId];
    if (desk && studentById[studentId]) deskByStudentId[studentId] = desk;
  });

  const acceptedRules = Array.isArray(ruleData?.acceptedRules) ? ruleData.acceptedRules : [];
  const acceptedRuleIds = Array.isArray(ruleData?.acceptedRuleIds)
    ? ruleData.acceptedRuleIds
    : acceptedRules.map(rule => rule.id).filter(Boolean);

  const riskStudents = students.filter(student => (student.hidden?.risk || 0) >= 3 || student.hidden?.needsMonitoring);
  const supportStudents = students.filter(student => student.hidden?.stabilizer || student.hidden?.mediator);
  const callsOutStudent = students.find(student => student.hidden?.callsOut) || students.find(student => student.id === 'tom') || riskStudents[0] || students[0];
  const phoneStudent = students.find(student => student.hidden?.phoneRisk) || students.find(student => student.id === 'niklas') || riskStudents[0] || students[0];
  const distractorStudent = students.find(student => student.hidden?.distractor) || students.find(student => student.id === 'petra') || riskStudents[0] || students[0];
  const boundaryStudent = students.find(student => student.hidden?.boundaryTesting) || students.find(student => student.id === 'ben') || riskStudents[0] || students[0];
  const transitionStudent = students.find(student => student.hidden?.transitions || student.hidden?.needsStructure) || students.find(student => student.id === 'emily') || students[0];
  const conflictStudent = students.find(student => student.hidden?.conflictWithBoys) || students.find(student => student.id === 'julius') || riskStudents[0] || students[0];
  const sensitiveStudent = students.find(student => student.hidden?.sensitive) || students.find(student => student.id === 'lina') || students[0];
  const mediatorStudent = students.find(student => student.hidden?.mediator) || students.find(student => student.id === 'amira') || supportStudents[0] || students[0];
  const stabilizerStudent = students.find(student => student.hidden?.stabilizer) || students.find(student => student.id === 'sara') || supportStudents[0] || students[0];

  const blindRiskStudents = normalizeStudentRecords(metrics.blindRiskStudents, studentById);
  const weaklyVisibleRiskStudents = normalizeStudentRecords(metrics.weaklyVisibleRiskStudents, studentById);
  const visibleRiskStudents = normalizeStudentRecords(metrics.visionRiskStudents, studentById);
  const backRowRisks = normalizeStudentRecords(metrics.backRowRisks, studentById);
  const riskyPairs = normalizePairs(metrics.riskyPairs, studentById);
  const neutralizedRiskPairs = normalizePairs(metrics.neutralizedRiskPairs, studentById);
  const stabilizingPairs = normalizePairs(metrics.stabilizingPairs, studentById);
  const computedPairs = computeAdjacencyPairs(desks, assignments, studentById);

  const fallbackRiskPair = riskyPairs[0] || computedPairs.risky[0] || makeFallbackPair([conflictStudent, boundaryStudent, distractorStudent, callsOutStudent], studentById, 'typische riskante Sitzkonstellation');
  const fallbackSupportPair = stabilizingPairs[0] || computedPairs.support[0] || makeFallbackPair([stabilizerStudent, callsOutStudent, mediatorStudent, distractorStudent], studentById, 'mögliche Ressource durch Sitznachbarschaft');
  const activeTrash = metrics.roomObjects?.activeTrash || (objects?.trash || []).filter(item => !item.removed) || [];
  const invalidSpacing = metrics.spacing?.invalidPairs || [];
  const startScore = stepData?.rawPreparationScore ?? stepData?.preparationScore ?? 5;

  return {
    stepData,
    ruleData,
    students,
    rows,
    cols,
    desks,
    assignments,
    blockedCells,
    blockedGroups: buildBlockedGroups(blockedCells),
    objects,
    teacher,
    studentById,
    deskById,
    deskByStudentId,
    metrics,
    acceptedRules,
    acceptedRuleIds,
    riskStudents,
    supportStudents,
    callsOutStudent,
    phoneStudent,
    distractorStudent,
    boundaryStudent,
    transitionStudent,
    conflictStudent,
    sensitiveStudent,
    mediatorStudent,
    stabilizerStudent,
    blindRiskStudents,
    weaklyVisibleRiskStudents,
    visibleRiskStudents,
    backRowRisks,
    riskyPairs,
    neutralizedRiskPairs,
    stabilizingPairs,
    computedPairs,
    fallbackRiskPair,
    fallbackSupportPair,
    activeTrash,
    invalidSpacing,
    startScore
  };
}

function enrichStudents(input) {
  return input.map(student => ({ ...student, hidden: { ...(hiddenDefaults[student.id] || {}), ...(student.hidden || {}) } }));
}

function defaultDesks() {
  return [[2,1], [2,3], [2,6], [2,8], [4,1], [4,3], [4,6], [4,8], [6,3], [6,6]].map((pos, index) => ({ id: `desk-${index + 1}`, row: pos[0], col: pos[1] }));
}

function defaultBlockedCells() {
  return [
    { row: 0, col: 3, type: 'board', label: 'Tafel' }, { row: 0, col: 4, type: 'board', label: 'Tafel' }, { row: 0, col: 5, type: 'board', label: 'Tafel' }, { row: 0, col: 6, type: 'board', label: 'Tafel' },
    { row: 1, col: 9, type: 'door', label: 'Tür' }, { row: 2, col: 9, type: 'door', label: 'Tür' },
    { row: 6, col: 9, type: 'exit', label: 'Notausgang' }, { row: 7, col: 9, type: 'exit', label: 'Notausgang' },
    { row: 2, col: 0, type: 'window', label: 'Fenster' }, { row: 3, col: 0, type: 'window', label: 'Fenster' }, { row: 5, col: 0, type: 'window', label: 'Fenster' }, { row: 6, col: 0, type: 'window', label: 'Fenster' },
    { row: 8, col: 2, type: 'cabinet', label: 'Schrank' }, { row: 8, col: 3, type: 'cabinet', label: 'Schrank' }, { row: 8, col: 4, type: 'cabinet', label: 'Schrank' },
    { row: 8, col: 7, type: 'sink', label: 'Waschbecken' }, { row: 8, col: 8, type: 'sink', label: 'Waschbecken' }
  ];
}

function normalizeStudentRecords(records = [], studentById) {
  return records.map(record => {
    const student = studentById[record.studentId] || studentById[record.id] || null;
    return { ...record, studentId: record.studentId || record.id || student?.id, name: record.name || student?.name || 'Schüler*in' };
  });
}

function normalizePairs(records = [], studentById) {
  return records.map(record => {
    const ids = Array.isArray(record.pair) ? record.pair : [];
    const students = ids.map(id => studentById[id]).filter(Boolean);
    const names = Array.isArray(record.names) && record.names.length ? record.names : students.map(student => student.name);
    return { ...record, pair: ids, students, names, label: names.join(' und ') || 'zwei Schüler*innen', reason: record.reason || 'Die Sitznachbarschaft ist pädagogisch relevant.' };
  });
}

function computeAdjacencyPairs(desks, assignments, studentById) {
  const placed = desks.map(desk => ({ desk, student: studentById[assignments[desk.id]] })).filter(item => item.student);
  const risky = [];
  const support = [];
  for (let i = 0; i < placed.length; i += 1) {
    for (let j = i + 1; j < placed.length; j += 1) {
      const a = placed[i];
      const b = placed[j];
      const distance = Math.abs(a.desk.row - b.desk.row) + Math.abs(a.desk.col - b.desk.col);
      if (distance > 2) continue;
      const oneRisk = (a.student.hidden?.risk || 0) >= 3 || (b.student.hidden?.risk || 0) >= 3;
      const bothRisk = (a.student.hidden?.risk || 0) >= 2 && (b.student.hidden?.risk || 0) >= 2;
      const oneSupport = a.student.hidden?.stabilizer || a.student.hidden?.mediator || b.student.hidden?.stabilizer || b.student.hidden?.mediator;
      const record = { pair: [a.student.id, b.student.id], students: [a.student, b.student], names: [a.student.name, b.student.name], label: `${a.student.name} und ${b.student.name}`, reason: 'aus Sitznähe berechnet' };
      if (bothRisk || oneRisk) risky.push(record);
      if (oneRisk && oneSupport) support.push(record);
    }
  }
  return { risky, support };
}

function makeFallbackPair(candidates, studentById, reason) {
  const unique = [];
  candidates.forEach(student => {
    if (student && !unique.some(item => item.id === student.id)) unique.push(student);
  });
  if (unique.length < 2) Object.values(studentById).forEach(student => { if (unique.length < 2 && !unique.some(item => item.id === student.id)) unique.push(student); });
  return { pair: unique.slice(0, 2).map(student => student.id), students: unique.slice(0, 2), names: unique.slice(0, 2).map(student => student.name), label: unique.slice(0, 2).map(student => student.name).join(' und ') || 'zwei Schüler*innen', reason };
}

function buildBlockedGroups(blockedCells) {
  const groups = [];
  const visited = new Set();
  blockedCells.forEach(cell => {
    const key = `${cell.row},${cell.col},${cell.type}`;
    if (visited.has(key)) return;
    const same = blockedCells.filter(item => item.type === cell.type);
    const sameRow = same.filter(item => item.row === cell.row).sort((a, b) => a.col - b.col);
    const sameCol = same.filter(item => item.col === cell.col).sort((a, b) => a.row - b.row);
    const hRun = [cell];
    let col = cell.col - 1;
    while (sameRow.some(item => item.col === col)) { hRun.unshift(sameRow.find(item => item.col === col)); col -= 1; }
    col = cell.col + 1;
    while (sameRow.some(item => item.col === col)) { hRun.push(sameRow.find(item => item.col === col)); col += 1; }
    const vRun = [cell];
    let row = cell.row - 1;
    while (sameCol.some(item => item.row === row)) { vRun.unshift(sameCol.find(item => item.row === row)); row -= 1; }
    row = cell.row + 1;
    while (sameCol.some(item => item.row === row)) { vRun.push(sameCol.find(item => item.row === row)); row += 1; }
    const cells = hRun.length >= vRun.length ? hRun : vRun;
    cells.forEach(item => visited.add(`${item.row},${item.col},${item.type}`));
    const rows = cells.map(item => item.row);
    const cols = cells.map(item => item.col);
    groups.push({
      type: cell.type,
      label: cell.label,
      cells,
      minRow: Math.min(...rows),
      minCol: Math.min(...cols),
      rowSpan: Math.max(...rows) - Math.min(...rows) + 1,
      colSpan: Math.max(...cols) - Math.min(...cols) + 1
    });
  });
  return groups;
}

function hasRule(ruleId) { return context.acceptedRuleIds.includes(ruleId); }
function ruleText(ruleId) {
  const accepted = context.acceptedRules.find(rule => rule.id === ruleId);
  return accepted?.text || ruleCatalog[ruleId] || ruleId;
}
function studentName(value, fallback = 'ein*e Schüler*in') {
  if (!value) return fallback;
  if (value.name) return value.name;
  if (value.studentId && context.studentById[value.studentId]) return context.studentById[value.studentId].name;
  if (value.id && context.studentById[value.id]) return context.studentById[value.id].name;
  return fallback;
}
function studentId(value) { return value?.studentId || value?.id || null; }
function deskPlace(value) {
  const id = studentId(value);
  const desk = id ? context.deskByStudentId[id] : null;
  if (!desk) return 'ohne gespeicherten Platz';
  return `Reihe ${desk.row + 1}, Feld ${desk.col + 1}`;
}
function firstStudentFromPair(pair, fallback) { return pair?.students?.[0] || context.studentById[pair?.pair?.[0]] || fallback || context.students[0]; }
function clampScore(value) { return Math.max(0, Math.min(10, Number.isFinite(Number(value)) ? Math.round(Number(value)) : 5)); }

function answer(kind, text, feedback) {
  const delta = kind === 'plus' ? 1 : kind === 'minus' ? -1 : 0;
  return { kind, delta, text, feedback };
}
function good(text, feedback) { return answer('plus', text, feedback); }
function neutral(text, feedback) { return answer('zero', text, feedback); }
function poor(text, feedback) { return answer('minus', text, feedback); }

function scenario(id, type, matched, source, title, scene, target, answers, focus = [], contextNote = '') {
  return { id, type, matched: Boolean(matched), source, title, scene, targetStudentId: studentId(target), answers, focus, contextNote };
}

function focusRule(ruleId) { return `${hasRule(ruleId) ? 'gewählte Regel' : 'nicht gewählt'}: ${ruleText(ruleId)}`; }

function buildDynamicScenarios(ctx) {
  const blind = ctx.blindRiskStudents[0] || ctx.backRowRisks[0] || ctx.weaklyVisibleRiskStudents[0] || ctx.riskStudents[0] || ctx.students[0];
  const weak = ctx.weaklyVisibleRiskStudents[0] || ctx.blindRiskStudents[0] || ctx.riskStudents[0] || ctx.students[0];
  const visible = ctx.visibleRiskStudents[0] || ctx.riskStudents[0] || ctx.students[0];
  const riskyPair = ctx.riskyPairs[0] || ctx.computedPairs.risky[0] || ctx.fallbackRiskPair;
  const riskyPair2 = ctx.riskyPairs[1] || ctx.computedPairs.risky[1] || ctx.fallbackRiskPair;
  const neutralPair = ctx.neutralizedRiskPairs[0] || ctx.fallbackSupportPair;
  const supportPair = ctx.stabilizingPairs[0] || ctx.computedPairs.support[0] || ctx.fallbackSupportPair;
  const support = ctx.stabilizerStudent || ctx.mediatorStudent || ctx.students[0];
  const risk = ctx.riskStudents[0] || ctx.callsOutStudent || ctx.students[0];
  const targetRiskPairStudent = firstStudentFromPair(riskyPair, risk);
  const targetSupportPairStudent = firstStudentFromPair(supportPair, support);

  const s = [];

  s.push(scenario('D01', 'Kooperative Verhaltensmodifikation', ctx.blindRiskStudents.length > 0, 'blindRiskStudents', `${studentName(blind)} verliert im blinden Bereich den Anschluss`, `${studentName(blind)} arbeitet kaum weiter. Der Platz liegt ungünstig im Sichtfeld (${deskPlace(blind)}).`, blind, [
    good(`Du gehst nah heran, beschreibst kurz die Beobachtung und vereinbarst mit ${studentName(blind)} ein überprüfbares Zwischenziel.`, `${studentName(blind)} weiß, woran gearbeitet wird; die Störung wird ohne Bloßstellung bearbeitbar.`),
    neutral('Du stellst dich für einen Moment in die Nähe und wiederholst die Aufgabe für den Tisch.', 'Die Nähe wirkt kurzfristig, aber das Muster wird noch nicht gemeinsam geklärt.'),
    poor(`Du markierst ${studentName(blind)} vor der Klasse als jemanden, den man ständig kontrollieren muss.`, 'Die öffentliche Zuschreibung verstärkt Widerstand und macht kooperative Veränderung unwahrscheinlicher.')
  ], ['Sichtfeld', studentName(blind)], `Dynamisch aus der Sichtfeldauswertung: ${studentName(blind)}.`));

  s.push(scenario('D02', 'Kooperative Verhaltensmodifikation', Boolean(ctx.phoneStudent), 'phoneRisk', `${studentName(ctx.phoneStudent)} schaut verdeckt nach unten`, `${studentName(ctx.phoneStudent)} schaut wiederholt unter den Tisch. Das Profil enthält ein Handy-Risiko.`, ctx.phoneStudent, [
    good(`Du sprichst ${studentName(ctx.phoneStudent)} leise an und vereinbarst nach der Phase ein klares Handy-Ziel mit kurzer Selbstkontrolle.`, 'Die Intervention bleibt ruhig und setzt auf Zielklärung statt auf eine öffentliche Bühne.'),
    neutral('Du bleibst häufiger in der Nähe des Tisches und beobachtest weiter.', 'Die Kontrolle kann bremsen, ersetzt aber keine gemeinsame Veränderungsvereinbarung.'),
    poor('Du nimmst das Handy lautstark weg und diskutierst vor der Klasse darüber.', 'Das Verhalten bekommt Aufmerksamkeit, die Beziehung wird belastet und die Kooperation sinkt.')
  ], ['Handy-Risiko', studentName(ctx.phoneStudent)]));

  s.push(scenario('D03', 'Classroom Management', ctx.backRowRisks.length > 0, 'backRowRisks', `${studentName(ctx.backRowRisks[0] || weak)} sitzt weit hinten`, `${studentName(ctx.backRowRisks[0] || weak)} sitzt in einem Bereich, der leicht aus dem Fokus gerät. Die Mitarbeit wird unklar.`, ctx.backRowRisks[0] || weak, [
    good('Du setzt ein kurzes Präsenzsignal und gibst eine kleine nächste Teilaufgabe.', 'Die Störung wird früh abgefangen, ohne den Unterrichtsfluss zu unterbrechen.'),
    neutral('Du wartest noch einen Moment, ob die Arbeitsruhe wiederkommt.', 'Es eskaliert nicht sofort, aber die ungünstige Position bleibt wirksam.'),
    poor('Du konzentrierst dich dauerhaft nur auf den vorderen Bereich.', 'Das verdeckte Verhalten kann sich stabilisieren und später deutlicher auftreten.')
  ], ['Sitzplatz hinten', studentName(ctx.backRowRisks[0] || weak)]));

  s.push(scenario('D04', 'Classroom Management', ctx.visibleRiskStudents.length > 0, 'visionRiskStudents', `${studentName(visible)} kommentiert sichtbar`, `${studentName(visible)} beginnt zu kommentieren, sitzt aber im wirksamen Sichtbereich.`, visible, [
    good('Du nutzt Blickkontakt und ein kurzes vereinbartes Signal, während du den Unterricht weiterführst.', 'Das Sichtfeld wird als präventive Ressource genutzt; die Störung bekommt wenig Bühne.'),
    neutral('Du ignorierst den Kommentar zunächst und erklärst weiter.', 'Das kann funktionieren, lässt aber die vorhandene Steuerungsmöglichkeit ungenutzt.'),
    poor('Du stoppst den Unterricht für eine ausführliche Ermahnung.', 'Eine kleine Störung wird groß gemacht und erhält zusätzliche Aufmerksamkeit.')
  ], ['Sichtfeld-Ressource', studentName(visible)]));

  s.push(scenario('D05', 'Kooperative Verhaltensmodifikation', ctx.riskyPairs.length > 0 || ctx.computedPairs.risky.length > 0, 'riskyPairs', `${riskyPair.label} geraten aneinander`, `${riskyPair.label} sitzen nah beieinander. Ein spitzer Kommentar löst sichtbare Spannung aus.`, targetRiskPairStudent, [
    good(`Du stoppst knapp, trennst Verhalten von Person und klärst später mit ${riskyPair.names[0]} und ${riskyPair.names[1]} ein konkretes Arbeitsziel.`, 'Der Konflikt wird begrenzt und in eine überprüfbare Zielvereinbarung übersetzt.'),
    neutral('Du setzt beide für diese Aufgabe auseinander und machst weiter.', 'Akut entsteht Ruhe, aber die Beziehungsspannung bleibt unbearbeitet.'),
    poor('Du entscheidest vor der Klasse, wer angefangen hat.', 'Die Schuldfrage verschärft die Fronten und macht Kooperation schwieriger.')
  ], ['riskante Nachbarschaft', riskyPair.label], riskyPair.reason));

  s.push(scenario('D06', 'Kooperative Verhaltensmodifikation', Boolean(riskyPair2), 'riskyPairs[1]', `${riskyPair2.label} reizen sich gegenseitig`, `${riskyPair2.label} reagieren aufeinander mit Nebenbemerkungen.`, firstStudentFromPair(riskyPair2, risk), [
    good('Du beschreibst das Muster neutral und vereinbarst mit beiden ein Tischziel für die nächsten Minuten.', 'Die Intervention bleibt konkret und kontrollierbar.'),
    neutral('Du setzt dich kurz in die Nähe und lässt die Aufgabe weiterlaufen.', 'Nähe kann dämpfen, ersetzt aber keine gemeinsame Klärung.'),
    poor('Du sagst, die beiden könnten grundsätzlich nicht zusammenarbeiten.', 'Die Etikettierung verfestigt das Muster.')
  ], ['Sitznähe', riskyPair2.label]));

  s.push(scenario('D07', 'Kooperative Verhaltensmodifikation', ctx.stabilizingPairs.length > 0 || ctx.computedPairs.support.length > 0, 'stabilizingPairs', `Ressource am Tisch: ${supportPair.label}`, `${supportPair.label} sitzen so, dass Unterstützung möglich ist. Am Tisch entsteht Unruhe.`, targetSupportPairStudent, [
    good('Du gibst eine kurze Rollenklärung und nutzt die Ressource als freiwillige Strukturhilfe, ohne Verantwortung abzugeben.', 'Die Ressource wird pädagogisch geführt und nicht auf Mitschüler*innen abgeschoben.'),
    neutral('Du lässt die Sitznachbarschaft unverändert und beobachtest weiter.', 'Die Ressource kann wirken, wird aber nicht bewusst aktiviert.'),
    poor(`Du sagst der stabileren Person, sie solle den Nachbarn einfach mitbetreuen.`, 'Aus Unterstützung wird Zusatzbelastung; Motivation und Beziehung können leiden.')
  ], ['stabilisierende Nachbarschaft', supportPair.label]));

  s.push(scenario('D08', 'Kooperative Verhaltensmodifikation', ctx.neutralizedRiskPairs.length > 0, 'neutralizedRiskPairs', `Neutralisierte Nähe: ${neutralPair.label}`, `${neutralPair.label} sitzen nah beieinander, aber die Vorbereitung hat ein Schutzmoment markiert. Jetzt entsteht leichte Spannung.`, firstStudentFromPair(neutralPair, support), [
    good('Du sicherst das Schutzmoment mit einer klaren Mini-Aufgabe und kurzer Rückmeldung.', 'Die neutralisierte Lage bleibt stabil, weil die Ressource aktiv gemacht wird.'),
    neutral('Du verlässt dich darauf, dass die Sitzordnung das schon auffängt.', 'Die Lage bleibt zunächst kontrollierbar, aber das Schutzmoment wird nicht gestärkt.'),
    poor('Du stellst die beiden als Problemkombination vor der Klasse heraus.', 'Die zuvor neutralisierte Spannung kann wieder aktiviert werden.')
  ], ['neutralisierte Nähe', neutralPair.label]));

  s.push(scenario('D09', 'Classroom Management', ctx.activeTrash.length > 0, 'roomObjects.activeTrash', 'Müll wird zum Störreiz', 'Im Klassenraum liegt noch Müll. In der Nähe wandern mehrere Blicke weg von der Aufgabe.', risk, [
    good('Du lässt den Störreiz knapp entfernen und führst die Aufmerksamkeit direkt zur Aufgabe zurück.', 'Der Raumfaktor wird bereinigt, bevor daraus eine größere Unterrichtsstörung wird.'),
    neutral('Du wartest, ob die Aufmerksamkeit von selbst zurückkommt.', 'Die Lage kann abklingen, aber der Störreiz bleibt bestehen.'),
    poor('Du hältst eine längere Standpauke über Ordnung.', 'Der Störreiz erhält zusätzliche Aufmerksamkeit und unterbricht den Unterrichtsfluss.')
  ], ['Müll', `${ctx.activeTrash.length} Müllfeld(er)`]));

  s.push(scenario('D10', 'Classroom Management', ctx.invalidSpacing.length > 0, 'spacing.invalidPairs', 'Der Laufweg ist blockiert', 'Zwischen zwei Tischreihen ist kaum Platz. Beim Helfen staut sich Bewegung im Raum.', ctx.transitionStudent, [
    good('Du regelst Hilfe zunächst über Signale und veränderst den Laufweg nach der Phase.', 'Der Unterricht bleibt ruhig und die räumliche Ursache wird später korrigiert.'),
    neutral('Du arbeitest dich vorsichtig durch den engen Bereich.', 'Der Unterricht geht weiter, aber das Raumproblem bleibt bestehen.'),
    poor('Du lässt mehrere Schüler*innen gleichzeitig im engen Bereich aufstehen.', 'Die räumliche Schwäche wird zur zusätzlichen Störung.')
  ], ['Laufweg', 'Raumstruktur']));

  s.push(scenario('D11', 'Klassenregel', hasRule('melden'), 'rule:melden', `${studentName(ctx.callsOutStudent)} ruft dazwischen`, `${studentName(ctx.callsOutStudent)} ruft eine Antwort in die Klasse. Die Melde-Regel ist ${hasRule('melden') ? 'vereinbart' : 'nicht gewählt'}.`, ctx.callsOutStudent, [
    good(`Du verweist knapp auf die Regel „${ruleText('melden')}“ und gibst ${studentName(ctx.callsOutStudent)} danach eine reguläre Beteiligungsmöglichkeit.`, 'Die Regel wird nicht als Strafe, sondern als gemeinsame Struktur genutzt.'),
    neutral('Du nimmst die richtige Antwort an und machst weiter.', 'Die Aufgabe läuft weiter, aber das Reinrufen wird indirekt bestätigt.'),
    poor('Du lobst den Inhalt laut und übergehst die Form vollständig.', 'Das kann fachlich angenehm wirken, verstärkt aber das unerwünschte Meldeverhalten.')
  ], [focusRule('melden'), studentName(ctx.callsOutStudent)]));

  s.push(scenario('D12', 'Klassenregel', hasRule('ausreden'), 'rule:ausreden', `${studentName(ctx.distractorStudent)} unterbricht`, `${studentName(ctx.distractorStudent)} fällt einer anderen Person ins Wort.`, ctx.distractorStudent, [
    good(`Du stoppst kurz und bindest die Regel „${ruleText('ausreden')}“ an den nächsten Redebeitrag zurück.`, 'Die Gesprächsstruktur wird wiederhergestellt, ohne eine lange Belehrung zu starten.'),
    neutral('Du bittest allgemein um Ruhe und lässt weitersprechen.', 'Die Lage beruhigt sich, aber die konkrete Gesprächsregel bleibt unscharf.'),
    poor('Du unterbrichst selbst mehrfach, um das Unterbrechen zu kritisieren.', 'Die Intervention modelliert genau das Verhalten, das reduziert werden soll.')
  ], [focusRule('ausreden'), studentName(ctx.distractorStudent)]));

  s.push(scenario('D13', 'Klassenregel', hasRule('handy'), 'rule:handy', `${studentName(ctx.phoneStudent)} berührt das Handy`, `${studentName(ctx.phoneStudent)} schiebt etwas unter dem Tisch zurecht.`, ctx.phoneStudent, [
    good(`Du erinnerst leise an „${ruleText('handy')}“ und vereinbarst nach der Phase eine kurze Selbstkontrolle.`, 'Regelstruktur und kooperative Zielarbeit greifen zusammen.'),
    neutral('Du gehst näher heran und beobachtest weiter.', 'Die Nähe wirkt möglicherweise, klärt aber die Regel- und Zielseite nicht.'),
    poor('Du machst eine öffentliche Handy-Kontrolle bei mehreren Schüler*innen.', 'Aus einer Einzelsituation wird eine große Störung mit Misstrauen.')
  ], [focusRule('handy'), studentName(ctx.phoneStudent)]));

  s.push(scenario('D14', 'Klassenregel', hasRule('platz'), 'rule:platz', `${studentName(ctx.boundaryStudent)} steht auf`, `${studentName(ctx.boundaryStudent)} steht während der Arbeitsphase auf, obwohl kein Auftrag dazu erkennbar ist.`, ctx.boundaryStudent, [
    good(`Du verweist knapp auf „${ruleText('platz')}“ und gibst eine klare Alternative: Hilfesignal oder kurze Rückfrage am Platz.`, 'Die Regel wird mit einer handhabbaren Alternative verbunden.'),
    neutral('Du winkst die Person zurück an den Platz.', 'Das stoppt den Moment, aber der Grund für das Aufstehen bleibt offen.'),
    poor('Du erlaubst es, damit es keinen Konflikt gibt.', 'Die Regel verliert Verbindlichkeit und die Bewegung kann andere aktivieren.')
  ], [focusRule('platz'), studentName(ctx.boundaryStudent)]));

  s.push(scenario('D15', 'Klassenregel', hasRule('lautstaerke'), 'rule:lautstaerke', `${studentName(ctx.distractorStudent)} wird lauter`, `Am Tisch von ${studentName(ctx.distractorStudent)} steigt die Lautstärke.`, ctx.distractorStudent, [
    good(`Du nutzt das vereinbarte Lautstärkesignal und knüpfst an „${ruleText('lautstaerke')}“ an.`, 'Die Klasse bekommt eine klare, bekannte Orientierung ohne lange Unterbrechung.'),
    neutral('Du erinnerst allgemein: „Bitte leiser.“', 'Das kann kurz helfen, bleibt aber weniger verbindlich.'),
    poor('Du übertönst die Gruppe mit lauter Stimme.', 'Die Lautstärke steigt als Modell und die Arbeitsruhe wird weiter belastet.')
  ], [focusRule('lautstaerke'), studentName(ctx.distractorStudent)]));

  s.push(scenario('D16', 'Klassenregel', hasRule('respekt'), 'rule:respekt', `${studentName(ctx.sensitiveStudent)} reagiert auf einen Kommentar`, `${studentName(ctx.sensitiveStudent)} wirkt getroffen, nachdem ein Fehler kommentiert wurde.`, ctx.sensitiveStudent, [
    good(`Du schützt die Person knapp und bindest die Klasse an „${ruleText('respekt')}“ zurück.`, 'Die Beziehungssicherheit wird wiederhergestellt, ohne die Person bloßzustellen.'),
    neutral('Du wechselst schnell zum nächsten Beitrag.', 'Die Situation wird nicht größer, aber die Verletzung bleibt ungeklärt.'),
    poor('Du sagst, man müsse Kritik eben aushalten lernen.', 'Die verletzende Dynamik wird normalisiert und die Sicherheit sinkt.')
  ], [focusRule('respekt'), studentName(ctx.sensitiveStudent)]));

  s.push(scenario('D17', 'Klassenregel', hasRule('hilfezeichen'), 'rule:hilfezeichen', `${studentName(ctx.transitionStudent)} ruft nach Hilfe`, `${studentName(ctx.transitionStudent)} ist unsicher und ruft mehrfach nach dir.`, ctx.transitionStudent, [
    good(`Du erinnerst an „${ruleText('hilfezeichen')}“ und bestätigst, dass du gleich nach dem Signal kommst.`, 'Hilfesuche wird strukturiert, ohne Unsicherheit zu beschämen.'),
    neutral('Du beantwortest die Frage direkt und gehst weiter.', 'Die Aufgabe wird gelöst, aber das Hilfesystem wird nicht gestärkt.'),
    poor('Du sagst, wer jetzt noch fragt, habe nicht aufgepasst.', 'Die Hemmung zu fragen steigt und Unsicherheit kann verdeckt weiterwirken.')
  ], [focusRule('hilfezeichen'), studentName(ctx.transitionStudent)]));

  s.push(scenario('D18', 'Klassenregel', hasRule('rollen'), 'rule:rollen', 'Gruppenrolle kippt', `In einer Gruppe übernimmt ${studentName(ctx.boundaryStudent)} plötzlich alles, während andere aussteigen.`, ctx.boundaryStudent, [
    good(`Du stellst die Rollen kurz neu klar und verweist auf „${ruleText('rollen')}“.`, 'Die Kooperation wird strukturiert, ohne einzelne Personen als Problem abzustempeln.'),
    neutral('Du bittest die Gruppe, sich besser aufzuteilen.', 'Der Hinweis ist plausibel, aber noch wenig konkret.'),
    poor(`Du lässt ${studentName(ctx.boundaryStudent)} weitermachen, weil dann wenigstens etwas entsteht.`, 'Ein dominantes Muster wird belohnt und die Gruppenarbeit verliert ihren kooperativen Charakter.')
  ], [focusRule('rollen'), studentName(ctx.boundaryStudent)]));

  s.push(scenario('D19', 'Klassenregel', hasRule('material'), 'rule:material', 'Materialgang erzeugt Unruhe', `Mehrere Schüler*innen wollen gleichzeitig Material holen. ${studentName(ctx.transitionStudent)} steht schon halb auf.`, ctx.transitionStudent, [
    good(`Du stoppst kurz und aktivierst „${ruleText('material')}“ mit einer klaren Reihenfolge.`, 'Die Situation wird über Struktur und nicht über einzelne Ermahnungen geregelt.'),
    neutral('Du lässt es laufen und hoffst, dass es schnell geht.', 'Es kann klappen, bleibt aber anfällig für Bewegung und Nebenkommunikation.'),
    poor('Du gibst zusätzlich neue Materialaufträge an mehrere Tische gleichzeitig.', 'Die Unruhe wird durch weitere Bewegungsanlässe verstärkt.')
  ], [focusRule('material'), studentName(ctx.transitionStudent)]));

  s.push(scenario('D20', 'Klassenregel', hasRule('stoppsignal'), 'rule:stoppsignal', 'Ruhezeichen wird übersehen', `${studentName(ctx.callsOutStudent)} redet weiter, während das Ruhezeichen gegeben wird.`, ctx.callsOutStudent, [
    good(`Du wartest konsequent kurz aus und knüpfst an „${ruleText('stoppsignal')}“ an.`, 'Das Signal bleibt verbindlich und braucht keine lange Zusatzrede.'),
    neutral('Du wiederholst das Signal etwas deutlicher.', 'Das kann helfen, aber die Verbindlichkeit hängt weiter von Wiederholung ab.'),
    poor('Du redest über die Unruhe hinweg weiter.', 'Das Signal verliert Wirkung und Gespräche bleiben lohnend.')
  ], [focusRule('stoppsignal'), studentName(ctx.callsOutStudent)]));

  s.push(scenario('D21', 'Klassenregel', hasRule('start'), 'rule:start', 'Startaufgabe stockt', `${studentName(ctx.transitionStudent)} beginnt nicht mit der Startaufgabe und sucht Blickkontakt zu anderen.`, ctx.transitionStudent, [
    good(`Du zeigst knapp auf „${ruleText('start')}“ und gibst den ersten Arbeitsschritt.`, 'Die Regel wird mit Handlungssicherheit verbunden.'),
    neutral('Du erinnerst die ganze Klasse noch einmal an den Arbeitsbeginn.', 'Das kann helfen, kostet aber Aufmerksamkeit für alle.'),
    poor('Du gibst der Person sofort eine Zusatzaufgabe, damit sie beschäftigt ist.', 'Die eigentliche Startstruktur wird umgangen und die Überforderung kann steigen.')
  ], [focusRule('start'), studentName(ctx.transitionStudent)]));

  s.push(scenario('D22', 'Klassenregel', hasRule('wechsel'), 'rule:wechsel', 'Sozialformwechsel wird unruhig', `Beim Wechsel zur Partnerarbeit bewegt sich ${studentName(ctx.boundaryStudent)} schon los.`, ctx.boundaryStudent, [
    good(`Du stoppst den Wechsel kurz und verweist auf „${ruleText('wechsel')}“, dann gibst du das Startsignal neu.`, 'Der Übergang wird gemeinsam strukturiert und bleibt steuerbar.'),
    neutral('Du lässt den Wechsel weiterlaufen und regulierst einzelne Zurufe.', 'Die Stunde geht weiter, aber die Übergangsregel wird schwach.'),
    poor('Du brichst die Partnerarbeit komplett ab.', 'Die Maßnahme ist unverhältnismäßig und kann Widerstand gegen Arbeitsformen erzeugen.')
  ], [focusRule('wechsel'), studentName(ctx.boundaryStudent)]));

  s.push(scenario('D23', 'Klassenregel', hasRule('kommentar'), 'rule:kommentar', 'Kommentar über Mitschüler*in', `${studentName(ctx.conflictStudent)} kommentiert eine Mitschülerin. Die Stimmung kippt kurz.`, ctx.conflictStudent, [
    good(`Du stoppst den Kommentar und bindest an „${ruleText('kommentar')}“ zurück; die inhaltliche Arbeit läuft danach weiter.`, 'Die Grenze wird klar, aber die Situation bekommt keine unnötige Bühne.'),
    neutral('Du wechselst schnell das Thema.', 'Die Eskalation wird vermieden, aber die Norm bleibt unausgesprochen.'),
    poor('Du antwortest mit einem spitzen Gegenkommentar.', 'Das modelliert Abwertung und verstärkt die Dynamik.')
  ], [focusRule('kommentar'), studentName(ctx.conflictStudent)]));

  s.push(scenario('D24', 'Klassenregel', hasRule('meldenplus'), 'rule:meldenplus', 'Warten fällt schwer', `${studentName(ctx.callsOutStudent)} meldet sich, spricht aber sofort los.`, ctx.callsOutStudent, [
    good(`Du bestätigst die Meldung, verweist auf „${ruleText('meldenplus')}“ und gibst danach bewusst das Wort.`, 'Die Beteiligung bleibt erwünscht, die Form wird aber geklärt.'),
    neutral('Du lässt den Beitrag zu, weil er fachlich passt.', 'Der fachliche Fluss bleibt, aber das Warten wird nicht geübt.'),
    poor('Du nimmst die Person für den Rest der Stunde nicht mehr dran.', 'Aus Struktur wird Ausschluss; Motivation und Beziehung werden belastet.')
  ], [focusRule('meldenplus'), studentName(ctx.callsOutStudent)]));

  s.push(scenario('D25', 'Klassenregel', hasRule('pausen'), 'rule:pausen', 'Privatgespräch im Unterricht', `${studentName(ctx.distractorStudent)} beginnt ein privates Gespräch mit der Sitznachbarschaft.`, ctx.distractorStudent, [
    good(`Du lenkst knapp auf „${ruleText('pausen')}“ und gibst eine konkrete Arbeitsfrage an den Tisch.`, 'Die Regel wird direkt in Arbeitsverhalten übersetzt.'),
    neutral('Du schaust kurz hin und wartest ab.', 'Das Gespräch kann enden, aber die Regel bleibt unscharf.'),
    poor('Du führst selbst ein längeres Gespräch darüber, warum Privatgespräche stören.', 'Die Unterbrechung wird größer als die ursprüngliche Störung.')
  ], [focusRule('pausen'), studentName(ctx.distractorStudent)]));

  s.push(scenario('D26', 'Kooperative Verhaltensmodifikation', true, 'positive-reinforcement', `${studentName(ctx.stabilizerStudent)} arbeitet stabil`, `${studentName(ctx.stabilizerStudent)} hält die Aufgabe gut, während daneben Unruhe entsteht.`, ctx.stabilizerStudent, [
    good(`Du gibst ${studentName(ctx.stabilizerStudent)} eine konkrete Rückmeldung zum Arbeitsverhalten und lässt die Verantwortung bei dir.`, 'Das erwünschte Verhalten wird verstärkt, ohne die Person als Hilfslehrkraft zu benutzen.'),
    neutral('Du nimmst das stabile Arbeiten wahr und greifst nicht ein.', 'Die Stabilität bleibt möglich, wird aber nicht als Ressource gestärkt.'),
    poor(`Du sagst: „Wenn du fertig bist, hilf ${studentName(risk)} noch bei seinen Aufgaben.“`, `${studentName(ctx.stabilizerStudent)} erhält statt Anerkennung zusätzliche Verantwortung; langfristig kann Motivation sinken.`)
  ], ['positive Verstärkung', studentName(ctx.stabilizerStudent)]));

  s.push(scenario('D27', 'Kooperative Verhaltensmodifikation', true, 'self-monitoring', `${studentName(risk)} zeigt ein wiederkehrendes Muster`, `${studentName(risk)} zeigt zum zweiten Mal ein ähnliches Störverhalten.`, risk, [
    good(`Du vereinbarst mit ${studentName(risk)} eine kurze Selbstbeobachtung: Wann klappt es, wann wird es schwierig?`, 'Die Person wird an der Analyse beteiligt; Veränderung wird konkret beobachtbar.'),
    neutral('Du erinnerst noch einmal knapp an die Aufgabe.', 'Das kann kurzfristig genügen, greift bei Wiederholung aber zu kurz.'),
    poor('Du kündigst an, jeden weiteren Fehler an der Tafel zu notieren.', 'Die Kontrolle wird öffentlich; Scham und Widerstand werden wahrscheinlicher.')
  ], ['Selbstbeobachtung', studentName(risk)]));

  s.push(scenario('D28', 'Kooperative Verhaltensmodifikation', true, 'goal-setting', 'Ziel muss konkret werden', `${studentName(ctx.boundaryStudent)} sagt: „Ich mache doch gar nichts.“ Gleichzeitig ist das Verhalten wiederholt beobachtbar.`, ctx.boundaryStudent, [
    good('Du beschreibst neutral das beobachtbare Verhalten und übersetzt es in ein kleines Ziel für die nächste Phase.', 'Aus einem Vorwurf wird eine überprüfbare Zielvereinbarung.'),
    neutral('Du sagst, ihr sprecht nach der Stunde darüber.', 'Das kann deeskalieren, bleibt aber im Moment noch unkonkret.'),
    poor('Du sagst: „Du störst immer.“', 'Die Verallgemeinerung provoziert Verteidigung statt Veränderung.')
  ], ['Zielvereinbarung']));

  s.push(scenario('D29', 'Kooperative Verhaltensmodifikation', true, 'diagnosis', 'Auslöser bleibt unklar', 'Eine Störung tritt auf, aber der Auslöser ist nicht eindeutig: Aufgabe, Sitznachbarschaft oder Aufmerksamkeit könnten eine Rolle spielen.', risk, [
    good('Du sammelst kurz Beobachtungen und klärst mit der betroffenen Person, was der Auslöser gewesen sein könnte.', 'Die Intervention beginnt mit kooperativer Diagnose statt vorschneller Sanktion.'),
    neutral('Du wartest ab, ob es einmalig bleibt.', 'Das ist möglich, aber bei Wiederholung fehlt eine Grundlage.'),
    poor('Du legst sofort eine Konsequenz fest, ohne den Auslöser zu klären.', 'Die Maßnahme kann am eigentlichen Problem vorbeigehen.')
  ], ['kooperative Diagnose']));

  s.push(scenario('D30', 'Kooperative Verhaltensmodifikation', true, 'reinforcement', 'Teilziel wurde erreicht', `${studentName(ctx.transitionStudent)} hält eine kurze Arbeitsphase besser durch als zuvor.`, ctx.transitionStudent, [
    good('Du gibst konkrete Rückmeldung zum erreichten Teilziel und vereinbarst den nächsten kleinen Schritt.', 'Veränderung wird sichtbar und anschlussfähig.'),
    neutral('Du gehst direkt zur nächsten Aufgabe über.', 'Der Ablauf bleibt flüssig, aber die Veränderung wird nicht stabilisiert.'),
    poor('Du betonst nur, was noch nicht funktioniert hat.', 'Der Fortschritt wird entwertet; Motivation kann sinken.')
  ], ['Verstärkung', studentName(ctx.transitionStudent)]));

  s.push(scenario('D31', 'Kooperative Verhaltensmodifikation', true, 'deescalation', `${studentName(ctx.sensitiveStudent)} zieht sich zurück`, `${studentName(ctx.sensitiveStudent)} sagt kaum noch etwas und vermeidet Blickkontakt.`, ctx.sensitiveStudent, [
    good('Du bietest leise eine Wahl zwischen kurzer Pause, Hilfesignal oder erstem kleinen Arbeitsschritt an.', 'Die Person erhält Handlungskontrolle zurück, ohne aus dem Unterricht herauszufallen.'),
    neutral('Du lässt die Person zunächst in Ruhe und beobachtest.', 'Das kann schützen, löst aber die Anschlussfrage noch nicht.'),
    poor('Du forderst sofort vor allen eine Erklärung ein.', 'Der Druck steigt und Rückzug kann sich verstärken.')
  ], ['Rückzug', studentName(ctx.sensitiveStudent)]));

  s.push(scenario('D32', 'Kooperative Verhaltensmodifikation', true, 'peer-resource', `${studentName(ctx.mediatorStudent)} will schlichten`, `${studentName(ctx.mediatorStudent)} bemerkt eine Spannung und bietet spontan Hilfe an.`, ctx.mediatorStudent, [
    good('Du nimmst die Ressource auf, klärst aber den Rahmen und bleibst selbst verantwortlich.', 'Peer-Unterstützung wird genutzt, ohne pädagogische Verantwortung auszulagern.'),
    neutral('Du bedankst dich und übernimmst die Situation allein.', 'Die Situation bleibt geführt, aber die Ressource wird nicht genutzt.'),
    poor('Du lässt die Schlichtung vollständig von der Schülerin übernehmen.', 'Die Person kann überfordert werden und die Verantwortung verschiebt sich unangemessen.')
  ], ['Peer-Ressource', studentName(ctx.mediatorStudent)]));

  s.push(scenario('D33', 'Classroom Management', true, 'attention economy', 'Aufmerksamkeit droht zur Belohnung zu werden', `${studentName(ctx.callsOutStudent)} testet mit kleinen Bemerkungen, ob die Klasse reagiert.`, ctx.callsOutStudent, [
    good('Du gibst eine knappe, ruhige Grenze und verstärkst direkt das nächste passende Arbeitsverhalten.', 'Aufmerksamkeit wird an erwünschtes Verhalten gekoppelt, nicht an Provokation.'),
    neutral('Du ignorierst die Bemerkung und beobachtest weiter.', 'Das kann reichen, wenn keine Folgeaufmerksamkeit entsteht.'),
    poor('Du diskutierst jede Bemerkung ausführlich aus.', 'Die Bemerkungen erhalten genau die Aufmerksamkeit, die sie wahrscheinlich attraktiv macht.')
  ], ['Aufmerksamkeitssteuerung', studentName(ctx.callsOutStudent)]));

  s.push(scenario('D34', 'Kooperative Verhaltensmodifikation', true, 'overhelping', 'Hilfe wird zur Abhängigkeit', `${studentName(ctx.transitionStudent)} fragt bei jedem kleinen Schritt nach Bestätigung.`, ctx.transitionStudent, [
    good('Du vereinbarst ein Hilfesignal und zwei Schritte, die zuerst selbst geprüft werden.', 'Unterstützung bleibt verfügbar, fördert aber Selbststeuerung.'),
    neutral('Du beantwortest die nächste Frage knapp.', 'Das löst den Moment, kann das Abhängigkeitsmuster aber erhalten.'),
    poor('Du setzt sofort eine starke Person daneben, die jeden Schritt erklärt.', 'Kurzfristig entsteht Hilfe, langfristig kann Selbstständigkeit weiter sinken.')
  ], ['Hilfeverhalten', studentName(ctx.transitionStudent)]));

  s.push(scenario('D35', 'Classroom Management', true, 'transition-management', 'Übergang in Partnerarbeit', `Der Wechsel wird unruhig; ${studentName(ctx.boundaryStudent)} nutzt die Bewegung für Kommentare.`, ctx.boundaryStudent, [
    good('Du stoppst kurz, gibst ein eindeutiges Startsignal und lässt erst danach wechseln.', 'Der Übergang wird strukturiert und verliert Störpotenzial.'),
    neutral('Du erinnerst während des Wechsels an Ruhe.', 'Es kann funktionieren, aber die Struktur kommt spät.'),
    poor('Du drohst mit dem Abbruch aller Partnerarbeit.', 'Die Drohung kann die Arbeitsform negativ aufladen und Widerstand erzeugen.')
  ], ['Übergang', studentName(ctx.boundaryStudent)]));

  s.push(scenario('D36', 'Kooperative Verhaltensmodifikation', true, 'private-feedback', 'Rückmeldung nach der Störung', `${studentName(risk)} hat sich nach einem Signal wieder gefangen.`, risk, [
    good('Du gibst später kurz privat Rückmeldung: Was hat geholfen und was gilt beim nächsten Mal?', 'Die Rückmeldung stabilisiert das gelingende Verhalten ohne öffentliche Markierung.'),
    neutral('Du machst weiter, weil die Störung vorbei ist.', 'Die Stunde läuft weiter, aber die Lernchance bleibt ungenutzt.'),
    poor('Du sagst vor der Klasse, dass es diesmal gerade noch gut gegangen sei.', 'Die öffentliche Bewertung kann Beschämung auslösen und die Beziehung belasten.')
  ], ['private Rückmeldung', studentName(risk)]));

  s.push(scenario('D37', 'Classroom Management', true, 'teacher-position', 'Lehrkraft steht ungünstig', `Während du vorne erklärst, beginnt am Rand bei ${studentName(weak)} Bewegung.`, weak, [
    good('Du veränderst deine Position so, dass der Randbereich sichtbar bleibt, und erklärst weiter.', 'Die räumliche Präsenz wirkt präventiv, ohne den Ablauf zu stoppen.'),
    neutral('Du beendest erst den Satz und gehst danach hin.', 'Das kann reichen, solange die Bewegung klein bleibt.'),
    poor('Du ignorierst den Randbereich, weil du gerade an der Tafel bist.', 'Die Randdynamik kann wachsen und später eine größere Intervention erzwingen.')
  ], ['Lehrkraftposition', studentName(weak)]));

  s.push(scenario('D38', 'Kooperative Verhaltensmodifikation', true, 'false-positive-praise', 'Lob könnte kippen', `${studentName(support)} arbeitet gut, während ${studentName(risk)} am Nachbartisch stockt.`, support, [
    good(`Du gibst ${studentName(support)} konkrete Rückmeldung und fragst, ob eine kurze Partnerhilfe freiwillig passt.`, 'Anerkennung bleibt Anerkennung; Unterstützung wird nicht zur Pflicht.'),
    neutral('Du sagst nur kurz „gut“ und gehst weiter.', 'Das Verhalten wird knapp bestätigt, aber wenig ausgebaut.'),
    poor(`Du lobst ${studentName(support)} laut als Vorbild und sagst ${studentName(risk)}, er solle sich daran ein Beispiel nehmen.`, 'Das Lob wird zum Vergleich; der andere Schüler kann beschämt reagieren und die Ressource verliert Qualität.')
  ], ['Ressource ohne Überforderung', studentName(support)]));

  s.push(scenario('D39', 'Kooperative Verhaltensmodifikation', true, 'evaluation', 'Kurze Auswertung nach der Phase', 'Eine Arbeitsphase endet. Ein vereinbartes Verhalten soll kurz ausgewertet werden.', risk, [
    good('Du fragst knapp: Was hat geholfen, was war schwierig, was ist der nächste Schritt?', 'Die Auswertung macht den Veränderungsprozess transparent und anschlussfähig.'),
    neutral('Du beendest die Phase pünktlich ohne Rückblick.', 'Der Ablauf bleibt sauber, aber die Intervention verliert Anschluss.'),
    poor('Du bewertest öffentlich, ob es gut oder schlecht war.', 'Die Auswertung wird zur Bloßstellung statt zur gemeinsamen Reflexion.')
  ], ['Auswertung']));

  s.push(scenario('D40', 'Kooperative Verhaltensmodifikation', true, 'lessonReflection', 'Stunde endet mit Restspannung', 'Die Stunde endet, aber ein wiederkehrendes Problem ist noch nicht abschließend gelöst.', risk, [
    good('Du hältst kurz fest, welches Ziel in der nächsten Stunde weiter gilt und welche Unterstützung dafür vereinbart wurde.', 'Der Prozess bleibt kooperativ und wird nicht einfach abgebrochen.'),
    neutral('Du beendest pünktlich und beobachtest es beim nächsten Mal erneut.', 'Es eskaliert nicht, aber der Prozess bleibt offen.'),
    poor('Du beendest die Stunde mit einer pauschalen Drohung für das nächste Mal.', 'Die nächste Stunde startet mit Druck statt mit geklärtem Ziel.')
  ], ['Folgeziel']));

  return s.slice(0, 40);
}

function init() {
  renderStaticContext();
  renderLife();
  renderClassroom();
  renderScenarioCatalog();
  bindEvents();
}

function bindEvents() {
  if (startLessonBtn) startLessonBtn.addEventListener('click', startLesson);
  if (continueLessonBtn) continueLessonBtn.addEventListener('click', continueAfterScenario);
  if (openScenarioBtn) openScenarioBtn.addEventListener('click', () => { scenarioDrawer.hidden = false; });
  if (closeScenarioBtn) closeScenarioBtn.addEventListener('click', () => { scenarioDrawer.hidden = true; });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (scenarioDrawer && !scenarioDrawer.hidden) scenarioDrawer.hidden = true;
    }
  });
}

function renderStaticContext() {
  if (ruleCountPill) ruleCountPill.textContent = `${context.acceptedRules.length}`;
  if (selectedRulesList) {
    selectedRulesList.innerHTML = context.acceptedRules.length
      ? context.acceptedRules.map(rule => `<li>${escapeHtml(rule.text || rule.id)}</li>`).join('')
      : '<li>Keine Regeln gespeichert. Regel-Szenarien laufen als allgemeine Varianten.</li>';
  }
  if (stepSummary) {
    const bits = [
      `Start: ${clampScore(context.startScore)}/10`,
      `${context.blindRiskStudents.length} blinde Risiken`,
      `${context.riskyPairs.length || context.computedPairs.risky.length} riskante Nähe`,
      `${context.stabilizingPairs.length || context.computedPairs.support.length} Ressourcen`,
      `${context.activeTrash.length} Müll`
    ];
    stepSummary.textContent = bits.join(' · ');
  }
}

function renderLife() {
  if (lessonScoreText) lessonScoreText.textContent = `${lessonState.score}/10 Punkte`;
  if (lessonLifeHint) lessonLifeHint.textContent = lessonState.score <= 3 ? 'Niedrige Stabilität: Jede Eskalation ist kritisch.' : lessonState.score <= 6 ? 'Mittlere Stabilität: Entscheidungen verändern die Lage deutlich.' : 'Hohe Stabilität: Gute Vorbereitung gibt Handlungsspielraum.';
  if (!lessonLifeSegments) return;
  lessonLifeSegments.innerHTML = '';
  lessonLifeSegments.classList.remove('life-low', 'life-mid', 'life-high');
  lessonLifeSegments.classList.add(lessonState.score <= 3 ? 'life-low' : lessonState.score <= 6 ? 'life-mid' : 'life-high');
  for (let i = 1; i <= 10; i += 1) {
    const segment = document.createElement('span');
    if (i <= lessonState.score) segment.classList.add('active');
    lessonLifeSegments.appendChild(segment);
  }
}

function renderClassroom() {
  if (!lessonGrid) return;
  lessonGrid.style.setProperty('--lesson-cols', String(context.cols));
  lessonGrid.style.setProperty('--lesson-rows', String(context.rows));
  lessonGrid.innerHTML = '';
  for (let row = 0; row < context.rows; row += 1) {
    for (let col = 0; col < context.cols; col += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'lesson-cell';
      cell.dataset.row = row;
      cell.dataset.col = col;

      const block = getBlockedCell(row, col);
      const group = block ? getBlockedGroupAt(row, col) : null;
      if (block) {
        cell.classList.add('lesson-blocked', `lesson-blocked-${block.type}`);
        if (group) cell.classList.add(...getJoinClasses(group, row, col));
        cell.disabled = true;
        if (group && group.minRow === row && group.minCol === col) cell.appendChild(createLessonBlockedLabel(group));
      }

      const desk = getDeskAt(row, col);
      if (desk) cell.appendChild(createLessonDesk(desk));

      const object = getRoomObjectAt(row, col);
      if (object) cell.appendChild(createLessonObject(object));

      if (lessonState.teacher.row === row && lessonState.teacher.col === col) cell.appendChild(createLessonTeacher());

      cell.addEventListener('click', () => moveTeacherTo(row, col));
      cell.addEventListener('dragover', event => { if (lessonState.dragTeacher && canTeacherMove(row, col)) event.preventDefault(); });
      cell.addEventListener('drop', event => { event.preventDefault(); if (lessonState.dragTeacher) moveTeacherTo(row, col); });
      lessonGrid.appendChild(cell);
    }
  }
}

function getBlockedCell(row, col) { return context.blockedCells.find(cell => cell.row === row && cell.col === col) || null; }
function getBlockedGroupAt(row, col) { return context.blockedGroups.find(group => group.cells.some(cell => cell.row === row && cell.col === col)) || null; }
function getJoinClasses(group, row, col) {
  const has = (r, c) => group.cells.some(cell => cell.row === r && cell.col === c);
  return [has(row, col - 1) && 'join-left', has(row, col + 1) && 'join-right', has(row - 1, col) && 'join-up', has(row + 1, col) && 'join-down'].filter(Boolean);
}
function getDeskAt(row, col) { return context.desks.find(desk => desk.row === row && desk.col === col) || null; }
function getRoomObjectAt(row, col) {
  const broom = context.objects?.broom;
  if (broom && broom.row === row && broom.col === col) return { ...broom, type: 'broom' };
  return (context.objects?.trash || []).find(item => !item.removed && item.row === row && item.col === col) || null;
}
function canTeacherMove(row, col) { return !getBlockedCell(row, col) && !getDeskAt(row, col) && !getRoomObjectAt(row, col); }

function createLessonBlockedLabel(group) {
  const el = document.createElement('span');
  el.className = `lesson-blocked-label lesson-${group.type}`;
  el.style.setProperty('--span-cols', String(group.colSpan));
  el.style.setProperty('--span-rows', String(group.rowSpan));
  el.innerHTML = group.type === 'sink' ? 'Wasch-<br>becken' : group.type === 'exit' ? 'Notaus-<br>gang' : escapeHtml(group.label || group.type);
  return el;
}

function createLessonDesk(desk) {
  const el = document.createElement('div');
  const assignedId = context.assignments[desk.id];
  const student = assignedId ? context.studentById[assignedId] : null;
  el.className = 'lesson-desk';
  if (lessonState.activeEvent?.targetStudentId === assignedId) el.classList.add('event-target');
  el.innerHTML = `<span>${escapeHtml(desk.id.replace('desk-', 'T'))}</span><strong>${escapeHtml(student?.name || 'frei')}</strong>`;
  return el;
}

function createLessonObject(object) {
  const el = document.createElement('span');
  el.className = `lesson-object lesson-object-${object.type}`;
  el.textContent = object.type === 'broom' ? '🧹' : '🗑️';
  return el;
}

function createLessonTeacher() {
  const el = document.createElement('div');
  el.className = 'lesson-teacher';
  el.draggable = true;
  el.textContent = 'LK';
  el.title = 'Lehrkraft ziehen oder freies Feld anklicken';
  el.addEventListener('dragstart', event => { lessonState.dragTeacher = true; event.dataTransfer.setData('text/plain', 'teacher'); });
  el.addEventListener('dragend', () => { lessonState.dragTeacher = false; });
  return el;
}

function moveTeacherTo(row, col) {
  if (!lessonState.started || lessonState.ended || scenarioModal && !scenarioModal.hidden) return;
  if (!canTeacherMove(row, col)) return;
  lessonState.teacher = { ...lessonState.teacher, row, col };
  renderClassroom();
  checkTeacherResponse();
}

function startLesson() {
  if (lessonState.started) return;
  lessonState.started = true;
  lessonState.ended = false;
  if (startLessonBtn) startLessonBtn.disabled = true;
  updatePhase('Unterricht läuft', 'Die Klasse arbeitet. Die nächste Störung kann jederzeit entstehen.');
  lessonState.timerId = window.setInterval(tickLessonTimer, 1000);
  renderTimer();
  scheduleNextEvent();
}

function tickLessonTimer() {
  lessonState.timeLeft -= 1;
  if (lessonState.timeLeft <= 0) {
    lessonState.timeLeft = 0;
    endLesson();
  }
  renderTimer();
}

function renderTimer() {
  if (!lessonTimer) return;
  const minutes = String(Math.floor(lessonState.timeLeft / 60)).padStart(2, '0');
  const seconds = String(lessonState.timeLeft % 60).padStart(2, '0');
  lessonTimer.textContent = `${minutes}:${seconds}`;
}

function scheduleNextEvent() {
  clearEventTimers();
  if (!lessonState.started || lessonState.ended || lessonState.timeLeft <= 0) return;
  updatePhase('Unterricht läuft', 'Die Klasse arbeitet. Beobachte den Raum.');
  const delay = randomInt(3000, 5000);
  lessonState.eventTimeoutId = window.setTimeout(triggerEvent, delay);
}

function triggerEvent() {
  if (lessonState.ended || !lessonState.started) return;
  const scenarioItem = pickScenario();
  lessonState.currentScenario = scenarioItem;
  lessonState.activeEvent = { scenarioId: scenarioItem.id, targetStudentId: scenarioItem.targetStudentId, responseResolved: false };
  lessonState.responseLeft = 3;
  renderClassroom();
  updatePhase('Auffälligkeit bemerkt', `${studentName(context.studentById[scenarioItem.targetStudentId])} blinkt. Bewege die Lehrkraft innerhalb von 3 Sekunden in die Nähe.`);
  if (lessonPhase) lessonPhase.textContent = 'Reaktion: 3 s';
  lessonState.responseIntervalId = window.setInterval(() => {
    lessonState.responseLeft -= 1;
    if (lessonPhase) lessonPhase.textContent = `Reaktion: ${Math.max(0, lessonState.responseLeft)} s`;
  }, 1000);
  lessonState.responseTimeoutId = window.setTimeout(() => openScenario(scenarioItem, 'missed'), 3000);
}

function pickScenario() {
  const candidates = SCENARIOS.filter(item => item.targetStudentId && context.deskByStudentId[item.targetStudentId]);
  const notUsed = candidates.filter(item => !lessonState.usedScenarioIds.has(item.id));
  const pool = notUsed.length ? notUsed : candidates;
  const matched = pool.filter(item => item.matched);
  const chosenPool = matched.length ? matched : pool;
  const chosen = chosenPool[Math.floor(Math.random() * chosenPool.length)] || SCENARIOS[0];
  lessonState.usedScenarioIds.add(chosen.id);
  return chosen;
}

function checkTeacherResponse() {
  if (!lessonState.activeEvent || lessonState.activeEvent.responseResolved) return;
  const targetDesk = context.deskByStudentId[lessonState.activeEvent.targetStudentId];
  if (!targetDesk) return;
  const distance = Math.abs(lessonState.teacher.row - targetDesk.row) + Math.abs(lessonState.teacher.col - targetDesk.col);
  if (distance <= 1) {
    lessonState.activeEvent.responseResolved = true;
    clearResponseTimers();
    if (Math.random() < 0.5) {
      openScenario(lessonState.currentScenario, 'approached');
    } else {
      const name = studentName(context.studentById[lessonState.activeEvent.targetStudentId]);
      updatePhase('Früh abgefangen', `${name} beruhigt sich durch deine Nähe. Es entsteht diesmal kein Branching-Szenario.`);
      lessonState.activeEvent = null;
      renderClassroom();
      scheduleNextEvent();
    }
  }
}

function openScenario(scenarioItem, mode) {
  if (!scenarioItem || lessonState.ended) return;
  clearResponseTimers();
  clearTimeout(lessonState.eventTimeoutId);
  lessonState.eventTimeoutId = null;
  const name = studentName(context.studentById[scenarioItem.targetStudentId]);
  if (scenarioModalType) scenarioModalType.textContent = scenarioItem.type;
  if (scenarioModalTitle) scenarioModalTitle.textContent = scenarioItem.title;
  if (scenarioModalSource) scenarioModalSource.textContent = mode === 'missed' ? 'zu spät reagiert' : 'trotz Präsenz ausgelöst';
  if (scenarioModalScene) scenarioModalScene.textContent = mode === 'missed'
    ? `${name} wurde nicht rechtzeitig erreicht. ${scenarioItem.scene}`
    : `${name} wurde rechtzeitig erreicht, aber die Situation braucht trotzdem eine Entscheidung. ${scenarioItem.scene}`;
  if (scenarioModalOutcome) { scenarioModalOutcome.hidden = true; scenarioModalOutcome.innerHTML = ''; }
  if (continueLessonBtn) continueLessonBtn.hidden = true;
  if (scenarioModalAnswers) {
    const shuffled = shuffle([...scenarioItem.answers]);
    scenarioModalAnswers.innerHTML = '';
    shuffled.forEach((item, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'modal-answer-btn';
      btn.innerHTML = `<span>Option ${String.fromCharCode(65 + index)}</span><strong>${escapeHtml(item.text)}</strong>`;
      btn.addEventListener('click', () => chooseAnswer(item, btn));
      scenarioModalAnswers.appendChild(btn);
    });
  }
  if (scenarioModal) scenarioModal.hidden = false;
  updatePhase('Entscheidung nötig', 'Wähle eine Reaktion. Die Wirkung wird danach sichtbar.');
}

function chooseAnswer(answerItem) {
  if (!scenarioModalAnswers) return;
  [...scenarioModalAnswers.querySelectorAll('button')].forEach(button => { button.disabled = true; });
  const previous = lessonState.score;
  lessonState.score = clampScore(lessonState.score + answerItem.delta);
  renderLife();
  const effect = answerItem.delta > 0 ? 'Die Stabilität steigt.' : answerItem.delta < 0 ? 'Die Stabilität sinkt.' : 'Die Stabilität bleibt unverändert.';
  if (scenarioModalOutcome) {
    scenarioModalOutcome.hidden = false;
    scenarioModalOutcome.className = `scenario-outcome outcome-${answerItem.kind}`;
    scenarioModalOutcome.innerHTML = `<strong>${effect} ${previous}/10 → ${lessonState.score}/10</strong><p>${escapeHtml(answerItem.feedback)}</p>`;
  }
  if (continueLessonBtn) continueLessonBtn.hidden = false;
  updatePhase('Folge sichtbar', effect);
}

function continueAfterScenario() {
  if (scenarioModal) scenarioModal.hidden = true;
  lessonState.activeEvent = null;
  lessonState.currentScenario = null;
  renderClassroom();
  if (lessonState.score <= 0) {
    endLesson('Die Lebensleiste ist leer. Der Unterricht kippt und muss neu vorbereitet werden.');
    return;
  }
  scheduleNextEvent();
}

function endLesson(message = 'Die zehn Minuten Unterrichtszeit sind vorbei.') {
  lessonState.ended = true;
  lessonState.started = false;
  window.clearInterval(lessonState.timerId);
  clearEventTimers();
  if (startLessonBtn) startLessonBtn.disabled = true;
  if (scenarioModal) scenarioModal.hidden = true;
  updatePhase('Unterricht beendet', `${message} Endstabilität: ${lessonState.score}/10.`);
}

function clearResponseTimers() {
  window.clearTimeout(lessonState.responseTimeoutId);
  window.clearInterval(lessonState.responseIntervalId);
  lessonState.responseTimeoutId = null;
  lessonState.responseIntervalId = null;
}
function clearEventTimers() {
  window.clearTimeout(lessonState.eventTimeoutId);
  clearResponseTimers();
  lessonState.eventTimeoutId = null;
}
function updatePhase(title, text) {
  if (eventStatusTitle) eventStatusTitle.textContent = title;
  if (eventStatusText) eventStatusText.textContent = text;
  if (lessonPhase && !lessonState.activeEvent) lessonPhase.textContent = title;
}

function renderScenarioCatalog() {
  if (!scenarioList) return;
  if (scenarioCount) scenarioCount.textContent = `${SCENARIOS.length} Szenarien`;
  scenarioList.innerHTML = SCENARIOS.map((item, index) => `
    <article class="scenario-card ${item.matched ? 'matched' : 'fallback'}" data-type="${escapeHtml(item.type)}">
      <div class="scenario-card-head">
        <span class="scenario-number">${String(index + 1).padStart(2, '0')}</span>
        <div><p class="eyebrow">${escapeHtml(item.type)}</p><h3>${escapeHtml(item.title)}</h3></div>
        <span class="scenario-fit">${item.matched ? 'aus dieser Runde' : 'Katalog / falls passend'}</span>
      </div>
      <p class="scenario-scene">${escapeHtml(item.scene)}</p>
      ${item.contextNote ? `<p class="scenario-context-note">${escapeHtml(item.contextNote)}</p>` : ''}
      <div class="scenario-focus">${(item.focus || []).map(f => `<span>${escapeHtml(f)}</span>`).join('')}</div>
      <div class="scenario-answers catalog-answer-list">
        ${item.answers.map((ans, answerIndex) => `
          <div class="scenario-answer catalog-answer">
            <strong>${String.fromCharCode(65 + answerIndex)}</strong>
            <p>${escapeHtml(ans.text)}</p>
            <small>${escapeHtml(ans.feedback)}</small>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');
}

function shuffle(values) {
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}

init();
