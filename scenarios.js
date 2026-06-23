const fallbackStudents = [
  { id: 'julius', name: 'Julius', age: 12, avatar: 'assets/students/julius.png', note: 'verträgt sich schlecht mit anderen Jungs' },
  { id: 'petra', name: 'Petra', age: 15, avatar: 'assets/students/petra.png', note: 'lenkt häufig Sitznachbar*innen ab' },
  { id: 'mehmet', name: 'Mehmet', age: 13, avatar: 'assets/students/mehmet.png', note: 'arbeitet ruhig und stabilisiert Gruppen' },
  { id: 'lina', name: 'Lina', age: 12, avatar: 'assets/students/lina.png', note: 'reagiert empfindlich auf Kritik und Spott' },
  { id: 'ben', name: 'Ben', age: 14, avatar: 'assets/students/ben.png', note: 'testet gerne Grenzen aus' },
  { id: 'sara', name: 'Sara', age: 13, avatar: 'assets/students/sara.png', note: 'arbeitet zuverlässig und hilft anderen' },
  { id: 'tom', name: 'Tom', age: 12, avatar: 'assets/students/tom.png', note: 'sucht Aufmerksamkeit durch Zwischenrufe' },
  { id: 'emily', name: 'Emily', age: 13, avatar: 'assets/students/emily.png', note: 'braucht klare Orientierung bei Übergängen' },
  { id: 'niklas', name: 'Niklas', age: 14, avatar: 'assets/students/niklas.png', note: 'versteckt gern das Handy unter dem Tisch' },
  { id: 'amira', name: 'Amira', age: 12, avatar: 'assets/students/amira.png', note: 'vermittelt oft zwischen Mitschüler*innen' }
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


const defaultBlockedCells = [
  { row: 0, col: 3, type: 'board', label: 'Tafel' },
  { row: 0, col: 4, type: 'board', label: 'Tafel' },
  { row: 0, col: 5, type: 'board', label: 'Tafel' },
  { row: 0, col: 6, type: 'board', label: 'Tafel' },
  { row: 1, col: 9, type: 'door', label: 'Tür' },
  { row: 2, col: 9, type: 'door', label: 'Tür' },
  { row: 6, col: 9, type: 'exit', label: 'Notausgang' },
  { row: 7, col: 9, type: 'exit', label: 'Notausgang' },
  { row: 2, col: 0, type: 'window', label: 'Fenster' },
  { row: 3, col: 0, type: 'window', label: 'Fenster' },
  { row: 5, col: 0, type: 'window', label: 'Fenster' },
  { row: 6, col: 0, type: 'window', label: 'Fenster' },
  { row: 8, col: 2, type: 'cabinet', label: 'Schrank' },
  { row: 8, col: 3, type: 'cabinet', label: 'Schrank' },
  { row: 8, col: 4, type: 'cabinet', label: 'Schrank' },
  { row: 8, col: 7, type: 'sink', label: 'Waschbecken' },
  { row: 8, col: 8, type: 'sink', label: 'Waschbecken' }
];

const defaultBranchDesks = [[2,1], [2,3], [2,6], [2,8], [4,1], [4,3], [4,6], [4,8], [6,3], [6,6]]
  .map((pos, index) => ({ id: `desk-${index + 1}`, row: pos[0], col: pos[1] }));

const defaultBranchAssignments = {
  'desk-1': 'petra',
  'desk-2': 'ben',
  'desk-3': 'julius',
  'desk-4': 'tom',
  'desk-5': 'niklas',
  'desk-6': 'sara',
  'desk-7': 'amira',
  'desk-8': 'lina',
  'desk-9': 'emily',
  'desk-10': 'mehmet'
};

const defaultBranchStep = {
  rows: 9,
  cols: 10,
  students: fallbackStudents,
  preparationScore: 5,
  rawPreparationScore: 5,
  chosenLayout: { key: 'rows', label: 'Reihensitzordnung' },
  blockedCells: defaultBlockedCells,
  desks: defaultBranchDesks,
  assignments: defaultBranchAssignments,
  teacher: { row: 1, col: 4, dir: 'down', mode: 'frontStanding' },
  objects: { trash: [], bin: { id: 'trash-bin-1', type: 'bin', row: 8, col: 9 } },
  metrics: {}
};

const trashAssetPool = ['assets/trash/paper.png', 'assets/trash/banana.png', 'assets/trash/apple.png'];

function pickRandomTrashAsset() {
  return trashAssetPool[Math.floor(Math.random() * trashAssetPool.length)];
}

function normalizeTrashItem(item = {}, index = 0) {
  return {
    ...item,
    id: item.id || `trash-${index + 1}`,
    type: 'trash',
    asset: item.asset || item.image || pickRandomTrashAsset(),
    removed: Boolean(item.removed)
  };
}

function normalizeRoomObjects(raw = {}) {
  const binSource = raw.bin || raw.broom || { id: 'trash-bin-1', type: 'bin', row: 8, col: 9 };
  return {
    bin: {
      ...binSource,
      id: binSource.id || 'trash-bin-1',
      type: 'bin',
      row: Number(binSource.row ?? 8),
      col: Number(binSource.col ?? 9),
      removed: false
    },
    trash: Array.isArray(raw.trash) ? raw.trash.map((item, index) => normalizeTrashItem(item, index)) : []
  };
}

function trashImageMarkup(object, className = 'trash-visual-img', alt = 'Müll') {
  const src = object?.asset || pickRandomTrashAsset();
  return `<img class="${className}" src="${src}" alt="${alt}" draggable="false" />`;
}

function normalizeStepDataForBranching(stepData = {}, ruleData = {}) {
  const fromRules = ruleData?.step1 && typeof ruleData.step1 === 'object' ? ruleData.step1 : {};
  const source = { ...defaultBranchStep, ...fromRules, ...stepData };
  const hasDesks = Array.isArray(source.desks) && source.desks.length > 0;
  const hasAssignments = source.assignments && Object.keys(source.assignments).length > 0;
  return {
    ...source,
    rows: source.rows || defaultBranchStep.rows,
    cols: source.cols || defaultBranchStep.cols,
    students: Array.isArray(source.students) && source.students.length ? source.students : defaultBranchStep.students,
    blockedCells: Array.isArray(source.blockedCells) && source.blockedCells.length ? source.blockedCells : defaultBranchStep.blockedCells,
    desks: hasDesks ? source.desks : defaultBranchStep.desks,
    assignments: hasAssignments ? source.assignments : defaultBranchStep.assignments,
    teacher: source.teacher || defaultBranchStep.teacher,
    objects: normalizeRoomObjects(source.objects && typeof source.objects === 'object' ? source.objects : defaultBranchStep.objects),
    metrics: source.metrics || {}
  };
}


const ruleCatalog = {
  'focus-neighbours': 'Während Arbeitsphasen arbeiten wir leise und lenken unsere Sitznachbar*innen nicht ab.',
  'respect-no-mock': 'Wir sprechen respektvoll miteinander und machen uns nicht über Fehler oder Beiträge lustig.',
  'first-instruction': 'Anweisungen der Lehrkraft werden beim ersten Signal umgesetzt.',
  'raise-hand': 'Wir melden uns, bevor wir sprechen.',
  'phone-away': 'Handys bleiben während des Unterrichts ausgeschaltet in der Tasche.',
  'help-signal': 'Wenn wir Hilfe brauchen, nutzen wir zuerst das vereinbarte Hilfesignal.',
  'material-ready': 'Zu Beginn liegen Arbeitsmaterialien bereit und die Startaufgabe beginnt sofort.',
  'group-roles': 'Bei Gruppenarbeit hat jede Person eine klare Aufgabe.',
  'transition-signal': 'Beim Wechsel der Sozialform warten wir auf das Startsignal.',
  'walkway': 'Material wird nur nach dem vereinbarten Ablauf geholt.',
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

const scenarioList = document.getElementById('scenarioList');
const scenarioCount = document.getElementById('scenarioCount');
const scenarioDrawer = document.getElementById('scenarioDrawer');
const openScenarioBtn = document.getElementById('openScenarioBtn');
const closeScenarioBtn = document.getElementById('closeScenarioBtn');
const stepSummary = document.getElementById('stepSummary');
const ruleSummary = document.getElementById('ruleSummary');
const selectedRulesList = document.getElementById('selectedRulesList');
const studentContextList = document.getElementById('studentContextList');

function readJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn('Daten konnten nicht gelesen werden:', key, error);
    return fallback;
  }
}

const rulesData = readJson('classroomGame.step2.rules', { acceptedRules: [], acceptedRuleIds: [] });
const step1 = normalizeStepDataForBranching(readJson('classroomGame.step1', rulesData?.step1 || defaultBranchStep), rulesData);
const context = buildContext(step1, rulesData);


function clearAllClassroomData() {
  try {
    const localKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('classroomGame')) localKeys.push(key);
    }
    localKeys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('LocalStorage konnte nicht vollständig geleert werden.', error);
  }
  try {
    sessionStorage.clear();
  } catch (error) {
    console.warn('SessionStorage konnte nicht geleert werden.', error);
  }
  try {
    document.cookie.split(';').forEach(cookie => {
      const eqIndex = cookie.indexOf('=');
      const name = eqIndex > -1 ? cookie.slice(0, eqIndex).trim() : cookie.trim();
      if (!name) return;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${location.pathname}`;
    });
  } catch (error) {
    console.warn('Cookies konnten nicht vollständig gelöscht werden.', error);
  }
}

function resetAppAndReload() {
  clearAllClassroomData();
  window.location.href = 'index.html';
}

function installPageUtilities() {
  let bar = document.querySelector('.page-utility-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'page-utility-bar';
    bar.innerHTML = '<button type="button" id="utilityResetBtn" class="utility-btn utility-btn-reset">Zurücksetzen</button>';
    document.body.prepend(bar);
  }
  const resetUtilityBtn = bar.querySelector('#utilityResetBtn');
  if (resetUtilityBtn && !resetUtilityBtn.dataset.bound) {
    resetUtilityBtn.addEventListener('click', resetAppAndReload);
    resetUtilityBtn.dataset.bound = 'true';
  }
}
const SCENARIOS = buildDynamicScenarios(context);


function studentAvatarSrc(student) {
  return student?.avatar || (student?.id ? `assets/students/${student.id}.png` : '');
}

function studentAvatarMarkup(student, className = 'student-avatar', altSuffix = '') {
  const src = studentAvatarSrc(student);
  const alt = `${student?.name || 'Schüler*in'}${altSuffix}`;
  return src ? `<img class="${className}" src="${src}" alt="${escapeHtml(alt)}" />` : `<span class="${className} avatar-fallback">${escapeHtml((student?.name || '?').charAt(0))}</span>`;
}

function buildContext(stepData, ruleData) {
  const students = enrichStudents(Array.isArray(stepData?.students) ? stepData.students : fallbackStudents);
  const desks = Array.isArray(stepData?.desks) && stepData.desks.length ? stepData.desks : defaultBranchStep.desks;
  const assignments = stepData?.assignments && Object.keys(stepData.assignments).length ? stepData.assignments : defaultBranchStep.assignments;
  const metrics = stepData?.metrics || {};
  const studentById = Object.fromEntries(students.map(student => [student.id, student]));
  const deskByStudentId = {};

  Object.entries(assignments).forEach(([deskId, studentId]) => {
    const desk = desks.find(item => item.id === deskId);
    if (desk) deskByStudentId[studentId] = desk;
  });

  const acceptedRules = Array.isArray(ruleData?.acceptedRules) ? ruleData.acceptedRules : [];
  const acceptedRuleIds = Array.isArray(ruleData?.acceptedRuleIds)
    ? ruleData.acceptedRuleIds
    : acceptedRules.map(rule => rule.id).filter(Boolean);

  const riskStudents = students.filter(student => (student.hidden?.risk || 0) >= 3 || student.hidden?.needsMonitoring);
  const supportStudents = students.filter(student => student.hidden?.stabilizer || student.hidden?.mediator);
  const sensitiveStudent = students.find(student => student.hidden?.sensitive) || students.find(student => student.id === 'lina') || students[0];
  const callsOutStudent = students.find(student => student.hidden?.callsOut) || students.find(student => student.id === 'tom') || riskStudents[0] || students[0];
  const phoneStudent = students.find(student => student.hidden?.phoneRisk) || students.find(student => student.id === 'niklas') || riskStudents[0] || students[0];
  const distractorStudent = students.find(student => student.hidden?.distractor) || students.find(student => student.id === 'petra') || riskStudents[0] || students[0];
  const boundaryStudent = students.find(student => student.hidden?.boundaryTesting) || students.find(student => student.id === 'ben') || riskStudents[0] || students[0];
  const transitionStudent = students.find(student => student.hidden?.transitions || student.hidden?.needsStructure) || students.find(student => student.id === 'emily') || students[0];
  const conflictStudent = students.find(student => student.hidden?.conflictWithBoys) || students.find(student => student.id === 'julius') || riskStudents[0] || students[0];
  const mediatorStudent = students.find(student => student.hidden?.mediator) || students.find(student => student.id === 'amira') || supportStudents[0] || students[0];
  const stabilizerStudent = students.find(student => student.hidden?.stabilizer) || students.find(student => student.id === 'sara') || supportStudents[0] || students[0];

  const blindRiskStudents = normalizeStudentRecords(metrics.blindRiskStudents, studentById);
  const weaklyVisibleRiskStudents = normalizeStudentRecords(metrics.weaklyVisibleRiskStudents, studentById);
  const visibleRiskStudents = normalizeStudentRecords(metrics.visionRiskStudents, studentById);
  const backRowRisks = normalizeStudentRecords(metrics.backRowRisks, studentById);

  const riskyPairs = normalizePairs(metrics.riskyPairs, studentById);
  const neutralizedRiskPairs = normalizePairs(metrics.neutralizedRiskPairs, studentById);
  const stabilizingPairs = normalizePairs(metrics.stabilizingPairs, studentById);

  const fallbackRiskPair = makeFallbackPair([conflictStudent, boundaryStudent, distractorStudent, callsOutStudent], studentById, 'typische riskante Kombination');
  const fallbackSupportPair = makeFallbackPair([stabilizerStudent, callsOutStudent, mediatorStudent, distractorStudent], studentById, 'stabilisierende Ressource');

  const activeTrash = metrics.roomObjects?.activeTrash || (stepData?.objects?.trash || []).filter(item => !item.removed) || [];
  const invalidSpacing = metrics.spacing?.invalidPairs || [];
  const hooks = Array.isArray(stepData?.suggestedScenarioHooks) ? stepData.suggestedScenarioHooks : [];
  const continuedStartScore = Number.isFinite(Number(ruleData?.evaluation?.finalLives))
    ? Number(ruleData.evaluation.finalLives)
    : normalizeStartScore(stepData?.rawPreparationScore ?? stepData?.preparationScore ?? 5);

  return {
    stepData,
    startScore: continuedStartScore,
    ruleData,
    students,
    studentById,
    desks,
    assignments,
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
    fallbackRiskPair,
    fallbackSupportPair,
    activeTrash,
    invalidSpacing,
    hooks
  };
}

function enrichStudents(input) {
  return input.map(student => ({
    ...student,
    avatar: student.avatar || `assets/students/${student.id}.png`,
    hidden: { ...(hiddenDefaults[student.id] || {}), ...(student.hidden || {}) }
  }));
}

function normalizeStudentRecords(records = [], studentById) {
  return records.map(record => {
    const student = studentById[record.studentId] || studentById[record.id] || null;
    return {
      ...record,
      studentId: record.studentId || record.id || student?.id,
      name: record.name || student?.name || 'Schüler*in'
    };
  });
}

function normalizePairs(records = [], studentById) {
  return records.map(record => {
    const ids = Array.isArray(record.pair) ? record.pair : [];
    const students = ids.map(id => studentById[id]).filter(Boolean);
    const names = Array.isArray(record.names) && record.names.length ? record.names : students.map(student => student.name);
    return {
      ...record,
      pair: ids,
      students,
      names,
      label: names.join(' und ') || 'zwei Schüler*innen',
      reason: record.reason || 'Die Sitznachbarschaft ist pädagogisch relevant.'
    };
  });
}

function makeFallbackPair(candidates, studentById, reason) {
  const unique = [];
  candidates.forEach(student => {
    if (student && !unique.some(item => item.id === student.id)) unique.push(student);
  });
  const pairStudents = unique.slice(0, 2);
  if (pairStudents.length < 2) {
    const additional = Object.values(studentById).find(student => !pairStudents.some(item => item.id === student.id));
    if (additional) pairStudents.push(additional);
  }
  return {
    pair: pairStudents.map(student => student.id),
    students: pairStudents,
    names: pairStudents.map(student => student.name),
    label: pairStudents.map(student => student.name).join(' und ') || 'zwei Schüler*innen',
    reason
  };
}

function hasRule(ruleId) {
  return context.acceptedRuleIds.includes(ruleId);
}

function hasAnyRule(ruleIds) {
  return ruleIds.some(ruleId => hasRule(ruleId));
}

function firstSelectedRule(ruleIds) {
  return ruleIds.find(ruleId => hasRule(ruleId)) || ruleIds[0];
}

function ruleText(ruleId) {
  const accepted = context.acceptedRules.find(rule => rule.id === ruleId);
  return accepted?.text || ruleCatalog[ruleId] || ruleId;
}

function studentName(studentOrRecord, fallback = 'ein*e Schüler*in') {
  if (!studentOrRecord) return fallback;
  if (studentOrRecord.name) return studentOrRecord.name;
  if (studentOrRecord.studentId && context.studentById[studentOrRecord.studentId]) return context.studentById[studentOrRecord.studentId].name;
  return fallback;
}

function deskPlace(studentOrRecord) {
  const studentId = studentOrRecord?.studentId || studentOrRecord?.id;
  const desk = studentId ? context.deskByStudentId[studentId] : null;
  if (!desk) return 'ohne eindeutig gespeicherten Platz';
  return `Reihe ${desk.row + 1}, Feld ${desk.col + 1}`;
}

function selectedOrCatalog(ruleId) {
  return hasRule(ruleId) ? 'ausgewählte Klassenregel' : 'nicht ausgewählte Regelvariante';
}

function scenario(id, type, matched, source, title, scene, answers, focus = [], contextNote = '') {
  return { id, type, matched: Boolean(matched), source, title, scene, answers, focus, contextNote };
}

function plus(text, feedback) { return { delta: 1, text, feedback }; }
function zero(text, feedback) { return { delta: 0, text, feedback }; }
function minus(text, feedback) { return { delta: -1, text, feedback }; }

function kvPositive(name, target = 'ein konkretes Arbeitsziel') {
  return `Du beschreibst das beobachtbare Verhalten ruhig, klärst kurz mit ${name}, was hilft, und vereinbarst ${target}.`;
}

function buildDynamicScenarios(ctx) {
  const n = student => studentName(student);
  const problem = {
    niklas: ctx.phoneStudent || ctx.studentById.niklas || ctx.riskStudents[0],
    tom: ctx.callsOutStudent || ctx.studentById.tom || ctx.riskStudents[0],
    ben: ctx.boundaryStudent || ctx.studentById.ben || ctx.riskStudents[0],
    petra: ctx.distractorStudent || ctx.studentById.petra || ctx.riskStudents[0],
    lina: ctx.sensitiveStudent || ctx.studentById.lina || ctx.riskStudents[0],
    julius: ctx.conflictStudent || ctx.studentById.julius || ctx.riskStudents[0],
    emily: ctx.transitionStudent || ctx.studentById.emily || ctx.riskStudents[0]
  };
  const resource = ctx.stabilizerStudent || ctx.mediatorStudent || ctx.studentById.sara || ctx.studentById.amira || ctx.students[0];
  const risk = ctx.riskStudents[0] || problem.tom || ctx.students[0];

  const ruleActive = ids => hasAnyRule(ids);
  const ruleLabel = ids => ruleText(firstSelectedRule(ids));
  const selectedHint = ids => ruleActive(ids)
    ? `Die ausgewählte Klassenregel lautet: „${ruleLabel(ids)}“`
    : 'Für diese Situation wurde vorher keine genau passende Klassenregel ausgewählt.';

  const s = [];
  const add = (id, type, matched, source, title, scene, answers, focus = [], contextNote = '') => {
    s.push(scenario(id, type, matched, source, title, scene, answers, focus, contextNote));
  };

  const goodRuleAnswer = (student, ids, concrete) => {
    const name = n(student);
    return ruleActive(ids)
      ? `Ich erinnere ${name} ruhig an die passende Klassenregel. ${concrete}`
      : `Ich treffe mit ${name} ruhig eine kurze Sofortvereinbarung. ${concrete}`;
  };

  add('S01', 'Classroom Management', true, 'phoneRisk', 'Handy unter dem Tisch',
    `${n(problem.niklas)} schaut wiederholt unter den Tisch und tippt heimlich. Einige Mitschüler*innen beobachten bereits, ob die Lehrkraft es bemerkt.`,
    [
      plus(goodRuleAnswer(problem.niklas, ['phone-away', 'handy'], 'Das Handy bleibt weg; die nächste Aufgabe startet jetzt.'), 'Classroom Management: Die Handy-Regel wird kurz aktiviert und der Unterrichtsfluss bleibt erhalten.'),
      zero(`Ich stelle mich kurz zu ${n(problem.niklas)} und beobachte, ob das Handy verschwindet.`, 'Die Präsenz passt, aber die Handy-Regel und eine Selbststeuerungshilfe bleiben ungeklärt.'),
      minus(`Ich nehme das Handy sichtbar weg und mache die Situation zum Beispiel für alle.`, 'Die Regel wird zur Strafbühne; das schwächt Kooperation und verstärkt Aufmerksamkeit.')
    ], [n(problem.niklas), 'Handy'], selectedHint(['phone-away', 'handy']));

  add('S02', 'Kooperative Verhaltensmodifikation', true, 'callsOut', 'Zwischenruf im Plenum',
    `${n(problem.tom)} ruft eine Antwort in die Klasse, bevor andere fertig nachdenken können. Dadurch kippt die Aufmerksamkeit vom Arbeitsauftrag weg.`,
    [
      plus(goodRuleAnswer(problem.tom, ['raise-hand', 'melden', 'meldenplus'], 'Er meldet sich und wartet kurz, bis er dran ist.'), 'Kooperative Verhaltensmodifikation: Das Ersatzverhalten wird konkret benannt und später verstärkt.'),
      zero(`Ich sage kurz: „Leiser bitte“, und setze den Unterricht fort.`, 'Das stoppt wenig, klärt aber weder Melde-Regel noch erreichbares Zielverhalten.'),
      minus(`Ich diskutiere vor der Klasse, warum ${n(problem.tom)} immer dazwischenruft.`, 'Das ist Problemzuschreibung statt kooperativer Diagnose; die Störung bekommt Bühne.')
    ], [n(problem.tom), 'Melden'], selectedHint(['raise-hand', 'melden', 'meldenplus']));

  add('S03', 'Kooperative Verhaltensmodifikation', true, 'boundaryTesting', 'Grenze wird getestet',
    `${n(problem.ben)} grinst, verzögert den Arbeitsbeginn und schaut zur Klasse, ob jemand reagiert. Die Situation ist noch klein, kann aber schnell größer werden.`,
    [
      plus(goodRuleAnswer(problem.ben, ['first-instruction'], 'Er beginnt mit Schritt eins; ich prüfe gleich kurz den Start.'), 'Kooperative Verhaltensmodifikation: Grenze, Teilziel und Rückmeldung unterstützen Selbststeuerung.'),
      zero(`Ich warte kurz ab, ob ${n(problem.ben)} von selbst beginnt.`, 'Abwarten kann reichen, lässt aber Zielklärung und konsequente Regelumsetzung offen.'),
      minus(`Ich drohe direkt mit Strafe, damit ${n(problem.ben)} den Ernst versteht.`, 'Die Drohung ersetzt Kooperation durch Machtkampf und berücksichtigt das Austesten nicht.')
    ], [n(problem.ben), 'Grenze'], selectedHint(['first-instruction']));

  add('S04', 'Classroom Management', true, 'distractor', 'Ablenkung am Nachbartisch',
    `${n(problem.petra)} spricht leise mit der Sitznachbarin, obwohl die Arbeitsphase schon begonnen hat. Die Nachbarin lacht und legt den Stift weg.`,
    [
      plus(goodRuleAnswer(problem.petra, ['focus-neighbours', 'pausen'], 'Beide starten jetzt mit einer klaren Zwei-Minuten-Aufgabe.'), 'Classroom Management: Arbeitsphasen-Regel und Gruppenfokus werden kurz wiederhergestellt.'),
      zero(`Ich stelle mich neben den Tisch und warte kurz ab.`, 'Präsenz hilft nur teilweise, weil die Regel und der nächste Arbeitsschritt fehlen.'),
      minus(`Ich setze ${n(problem.petra)} sofort um, ohne Regel oder Grund zu klären.`, 'Die Störung stoppt vielleicht, bleibt aber unkooperativ und erzeugt neue Unruhe.')
    ], [n(problem.petra), 'Ablenkung'], selectedHint(['focus-neighbours', 'pausen']));

  add('S05', 'Kooperative Verhaltensmodifikation', true, 'sensitive', 'Spott nach einem Fehler',
    `${n(problem.lina)} verzieht das Gesicht und sagt kaum noch etwas, nachdem ein Kommentar aus der Nähe kam. Die Stimmung am Tisch wird unsicher.`,
    [
      plus(goodRuleAnswer(problem.lina, ['respect-no-mock', 'respekt', 'kommentar'], 'Ich sichere Respekt und gebe ihr einen kleinen Wiedereinstieg.'), 'Kooperative Verhaltensmodifikation: Gefühl, Regel und Rückkehrverhalten werden gemeinsam berücksichtigt.'),
      zero(`Ich gehe weiter, damit die Situation nicht größer wird.`, 'Der Schutz vor Öffentlichkeit passt, aber die Respekt-Regel bleibt ungeklärt.'),
      minus(`Ich sage vor allen, dass ${n(problem.lina)} nicht so empfindlich sein soll.`, 'Die Respekt-Regel wird verletzt; das Schülerverhalten und ihre emotionale Lage werden missachtet.')
    ], [n(problem.lina), 'Respekt'], selectedHint(['respect-no-mock', 'respekt', 'kommentar']));

  add('S06', 'Classroom Management', Boolean(ctx.blindRiskStudents.length), 'blindspot', 'Unruhe im toten Winkel',
    `${n(ctx.blindRiskStudents[0] || risk)} nutzt einen Moment, in dem die Lehrkraft den Bereich kaum im Blick hat. Die Arbeitsruhe dort wird sichtbar schwächer.`,
    [
      plus(`Ich gehe in den Nachbarbereich, gebe ein kurzes Präsenzsignal und nenne den nächsten Arbeitsschritt.`, 'Classroom Management: Präsenz, Withitness und knappe Aufgabenorientierung verhindern Welleneffekte.'),
      zero(`Ich schaue aus der Entfernung kurz hin und mache weiter.`, 'Der Blick kann reichen, aber der tote Winkel bleibt als strukturelles Risiko bestehen.'),
      minus(`Ich rufe quer durch den Raum, dass dort hinten Ruhe sein soll.`, 'Das macht die Störung öffentlich und ersetzt keine wirksame Präsenz.')
    ], ['Sichtbereich'], 'Das Szenario wird wahrscheinlicher, wenn riskante Schüler außerhalb des Sichtbereichs sitzen.');

  add('S07', 'Classroom Management', Boolean(ctx.weaklyVisibleRiskStudents.length), 'weakVision', 'Halber Blickkontakt reicht nicht',
    `${n(ctx.weaklyVisibleRiskStudents[0] || risk)} arbeitet nur scheinbar mit. Weil die Sichtlinie schwach ist, merkt die Lehrkraft die Abweichung erst spät.`,
    [
      plus(`Ich gehe ruhig näher heran und vereinbare eine kleine überprüfbare Teilaufgabe.`, 'Classroom Management: Nähe und überprüfbare Aktivierung sichern den Arbeitsfokus ohne Bloßstellung.'),
      zero(`Ich erinnere die ganze Klasse allgemein an konzentriertes Arbeiten.`, 'Die Erinnerung ist regelhaft, aber zu unspezifisch für das konkrete Verhalten.'),
      minus(`Ich sage laut, dass ich das Nichtarbeiten genau gesehen habe.`, 'Öffentliche Kontrolle schwächt Beziehung und baut keine Selbststeuerung auf.')
    ], ['Sichtbereich']);

  add('S08', 'Classroom Management', Boolean(ctx.backRowRisks.length), 'backRow', 'Hinten entsteht Nebenbeschäftigung',
    `${n(ctx.backRowRisks[0] || risk)} wirkt im hinteren Bereich abgekoppelt. Andere orientieren sich kurz daran statt an der Aufgabe.`,
    [
      plus(`Ich positioniere mich mit Blick auf den Bereich und gebe dort kurze Arbeitsrückmeldung.`, 'Classroom Management: Raumpräsenz und Gruppenfokus wirken präventiv gegen Abkopplung.'),
      zero(`Ich ändere erst nach der Stunde die Sitzordnung.`, 'Das kann strukturell sinnvoll sein, löst aber die akute Unruhe nicht.'),
      minus(`Ich kündige strenge Kontrolle für den hinteren Bereich an.`, 'Das setzt auf Überwachung statt auf Unterrichtsfluss und Selbststeuerung.')
    ], ['Sitzordnung']);

  add('S09', 'Classroom Management', Boolean(ctx.metrics?.spacing?.invalidPairs?.length), 'spacing', 'Der Weg ist blockiert',
    `Ein Tischbereich ist so eng gestellt, dass die Lehrkraft nicht schnell genug zu einem auffälligen Schüler gelangt. Die Störung dauert dadurch länger als nötig.`,
    [
      plus(`Ich nutze einen erreichbaren Nachbarweg und korrigiere die Tischstellung später.`, 'Classroom Management: Akute Präsenz und spätere Raumgestaltung bearbeiten Ursache und Wirkung.'),
      zero(`Ich dränge mich durch die enge Stelle, um direkt hinzukommen.`, 'Das reagiert schnell, kostet aber Zeit und erhöht Unruhe im Raum.'),
      minus(`Ich rufe aus der Distanz, weil ich nicht schnell hinkomme.`, 'Die Störung wird öffentlich; die räumliche Struktur bleibt unbeachtet.')
    ], ['Laufwege']);

  add('S10', 'Kooperative Verhaltensmodifikation', Boolean(ctx.riskyPairs.length), 'riskyPairs', 'Zwei verstärken sich',
    `${n(ctx.riskyPairs[0]?.students?.[0] || problem.julius)} und ${n(ctx.riskyPairs[0]?.students?.[1] || problem.ben)} reagieren sichtbar aufeinander. Aus einer kleinen Bemerkung wird fast ein Wettbewerb.`,
    [
      plus(`Ich stoppe die Dynamik ruhig und gebe beiden getrennte, konkrete Arbeitsrollen.`, 'Kooperative Verhaltensmodifikation: Das Problem wird als Interaktion gesehen, nicht als Schuldfrage.'),
      zero(`Ich beobachte, ob sich die beiden wieder beruhigen.`, 'Bei bekannter Risikokombination fehlt eine klare Veränderung der Bedingungen.'),
      minus(`Ich bestimme sofort, wer schuld ist, und kritisiere diese Person.`, 'Schuldzuweisung ignoriert das Beziehungsmuster und erschwert kooperative Klärung.')
    ], ['Sitznachbarschaft']);

  add('S11', 'Kooperative Verhaltensmodifikation', true, 'peerConflict', 'Reibung mit Julius',
    `${n(problem.julius)} reagiert gereizt auf eine Bemerkung eines Jungen in seiner Nähe. Die Körpersprache wird angespannter.`,
    [
      plus(`Ich beschreibe nur das sichtbare Verhalten und gebe beiden kurz getrennte Aufgaben.`, 'Kooperative Verhaltensmodifikation: Deeskalation kommt vor gemeinsamer Diagnose der Konfliktbedingungen.'),
      zero(`Ich bitte beide, sich einfach zusammenzureißen.`, 'Die Erwartung ist klar, aber ein konkretes Ersatzverhalten fehlt.'),
      minus(`Ich lasse beide den Konflikt sofort vor der Gruppe ausdiskutieren.`, 'Die Klärung wird zu früh und öffentlich; das überfordert die Arbeitsphase.')
    ], [n(problem.julius), 'Konflikt']);

  add('S12', 'Classroom Management', true, 'transition', 'Unklarer Wechsel',
    `Beim Wechsel in eine andere Arbeitsform entsteht Bewegung im Raum. ${n(problem.emily)} wirkt unsicher und beginnt, andere zu fragen, was jetzt zu tun ist.`,
    [
      plus(goodRuleAnswer(problem.emily, ['transition-signal', 'wechsel'], 'Alle warten auf das Signal und beginnen dann mit Schritt eins.'), 'Classroom Management: Übergangsregel, Signal und klare Instruktion geben Struktur.'),
      zero(`Ich erkläre den Auftrag ausführlich für die ganze Klasse neu.`, 'Das kann helfen, schwächt aber den Unterrichtsfluss im Übergang.'),
      minus(`Ich sage, dass man jetzt selbst wissen müsse, was zu tun ist.`, 'Die Unsicherheit wird als Störung behandelt; Struktur und Unterstützung fehlen.')
    ], [n(problem.emily), 'Übergang'], selectedHint(['transition-signal', 'wechsel']));

  add('S13', 'Classroom Management', true, 'material', 'Material wird zum Vorwand',
    `${n(problem.ben)} sagt, er müsse noch Material holen, bleibt aber stehen und schaut, wer reagiert.`,
    [
      plus(goodRuleAnswer(problem.ben, ['walkway', 'material'], 'Er startet mit dem vorhandenen Material; echten Bedarf klären wir leise.'), 'Classroom Management: Die Material-Regel schützt Laufwege und Unterrichtsfluss.'),
      zero(`Ich lasse ihn gehen, damit der Unterricht nicht weiter stockt.`, 'Das hält es kurz, macht aber die Material-Regel unklar.'),
      minus(`Ich halte ausführlich fest, dass Materialvorbereitung eine klare Pflicht ist.`, 'Die eigene Lehrerreaktion wird zur Störung und nimmt der Klasse Arbeitszeit.')
    ], [n(problem.ben), 'Material'], selectedHint(['walkway', 'material']));

  add('S14', 'Kooperative Verhaltensmodifikation', true, 'selfControl', 'Selbstkontrolle bricht ab',
    `${n(problem.niklas)} beginnt konzentriert, verliert aber nach kurzer Zeit die Orientierung und greift wieder in Richtung Tasche.`,
    [
      plus(`Ich erinnere leise an das Ziel und frage, was ihm zwei Minuten Dranbleiben hilft.`, 'Kooperative Verhaltensmodifikation: Ziel, Selbstbeobachtung und Selbststeuerung werden angebahnt.'),
      zero(`Ich lege die Aufgabe kommentarlos noch einmal auf den Tisch.`, 'Das unterstützt sachlich, klärt aber Verhalten und Selbstkontrolle nicht.'),
      minus(`Ich sage: „Du kannst es wohl einfach nicht lassen.“`, 'Das etikettiert den Schüler und ignoriert Selbststeuerung als Ziel.')
    ], [n(problem.niklas), 'Selbstkontrolle']);

  add('S15', 'Kooperative Verhaltensmodifikation', true, 'attention', 'Aufmerksamkeit durch Geräusche',
    `${n(problem.tom)} erzeugt kleine Geräusche und wartet auf Reaktionen. Einige Köpfe drehen sich bereits.`,
    [
      plus(`Ich gebe nah ein Stoppsignal und flüstere den nächsten Arbeitsauftrag.`, 'Kooperative Verhaltensmodifikation: Die Bühne sinkt, und ruhiges Zielverhalten kann verstärkt werden.'),
      zero(`Ich ignoriere das Geräusch vollständig und arbeite weiter.`, 'Ignorieren kann passen, aber die Klasse reagiert bereits auf das Verhalten.'),
      minus(`Ich imitiere das Geräusch ironisch, damit die Störung auffällt.`, 'Ironie beschämt und verstärkt das aufmerksamkeitssuchende Verhalten.')
    ], [n(problem.tom), 'Aufmerksamkeit']);

  add('S16', 'Classroom Management', true, 'lessonFlow', 'Arbeitsfluss kippt',
    `Mehrere Schüler*innen schauen nicht mehr auf ihre Aufgaben. Der Auslöser ist klein, aber die Klasse orientiert sich zunehmend an der Störung.`,
    [
      plus(`Ich setze ein klares Signal und gebe die nächste Arbeitsminute konkret vor.`, 'Classroom Management: Signal, Gruppenfokus und Unterrichtsfluss werden schnell gesichert.'),
      zero(`Ich spreche weiter, damit keine zusätzliche Unterbrechung entsteht.`, 'Der Plan läuft weiter, aber der kippende Gruppenfokus bleibt unbeachtet.'),
      minus(`Ich unterbreche lange und kritisiere die Mitarbeit der Klasse.`, 'Die Lehrerreaktion vergrößert die Störung und senkt aktive Lernzeit.')
    ], ['Arbeitsfluss']);

  add('S17', 'Kooperative Verhaltensmodifikation', true, 'resourceUse', 'Ressource am Tisch',
    `${n(resource)} arbeitet ruhig und könnte als Ressource wirken. In der Nähe entsteht trotzdem Unruhe.`,
    [
      plus(`Ich gebe dem Tisch eine Mini-Aufgabe und bestätige ${n(resource)} kurz für ruhige Mitarbeit.`, 'Kooperative Verhaltensmodifikation: Ressourcen werden verstärkt, ohne Schülerverantwortung zu überlasten.'),
      zero(`Ich bitte ${n(resource)}, die anderen am Tisch zu beruhigen.`, 'Das kann helfen, verlagert aber pädagogische Verantwortung statt Kooperation aufzubauen.'),
      minus(`Ich sage laut, alle sollten sich an ${n(resource)} ein Beispiel nehmen.`, 'Der Vergleich kann beschämen und verschlechtert die kooperative Gruppendynamik.')
    ], [n(resource), 'Ressource']);

  add('S18', 'Classroom Management', true, 'rules', 'Regel ist da, aber nicht präsent',
    `Eine vereinbarte Klassenregel passt zur Situation, wird im Moment aber nicht automatisch genutzt. Die Klasse braucht eine knappe Erinnerung.`,
    [
      plus(`Ich erinnere knapp an die Regel und nenne sofort das gewünschte Verhalten.`, 'Classroom Management: Regeln wirken, wenn sie positiv, kurz und handlungsnah genutzt werden.'),
      zero(`Ich sage allgemein, dass die Klassenregeln weiterhin gelten.`, 'Das stimmt, bleibt aber ohne konkrete Verhaltenserwartung.'),
      minus(`Ich lasse die Klasse alle Regeln noch einmal laut vorlesen.`, 'Die lange Unterbrechung verletzt den Unterrichtsfluss und macht die Störung größer.')
    ], ['Klassenregeln']);

  add('S19', 'Kooperative Verhaltensmodifikation', true, 'debrief', 'Klärung nach der Stunde',
    `${n(problem.petra)} arbeitet nach der Intervention kurz mit, wirkt aber weiterhin angespannt und ablenkbar.`,
    [
      plus(`Ich halte es akut kurz und kündige ein zeitnahes Nachgespräch an.`, 'Kooperative Verhaltensmodifikation: Die eigentliche Diagnose und Vereinbarung werden vorbereitet.'),
      zero(`Ich lasse es dabei, weil die Situation im Moment ruhig ist.`, 'Die akute Stabilität bleibt, aber eine kooperative Veränderungsvereinbarung fehlt.'),
      minus(`Ich führe sofort ein längeres Gespräch am Tisch.`, 'Die Klärung ist zu öffentlich und stört die Arbeitsphase.')
    ], [n(problem.petra), 'Nachgespräch']);

  add('S20', 'Classroom Management', true, 'proximity', 'Nähe ohne Bloßstellung',
    `${n(problem.lina)} braucht Unterstützung, ohne vor der Klasse herausgestellt zu werden. Ein falscher Ton würde die Situation verschärfen.`,
    [
      plus(`Ich gehe seitlich an den Tisch und gebe leise eine machbare nächste Handlung.`, 'Classroom Management: Nähe wirkt präventiv, ohne emotionale Sicherheit zu gefährden.'),
      zero(`Ich frage von vorne, ob alles in Ordnung ist.`, 'Die Frage ist freundlich, aber öffentlich und ohne klare Handlungshilfe.'),
      minus(`Ich erkläre der Klasse, dass manche Personen empfindlicher reagieren.`, 'Das etikettiert Lina und missachtet ihren Schutzbedarf.')
    ], [n(problem.lina), 'Schutz']);

  add('S21', 'Classroom Management', Boolean(ctx.activeTrash?.length), 'trash', 'Müll lenkt ab',
    `Ein Müllfeld liegt im Laufweg. Es bindet Aufmerksamkeit und erschwert schnelle Präsenz der Lehrkraft.`,
    [
      plus(`Ich entferne den Müll zügig und kehre direkt zur Unterrichtshandlung zurück.`, 'Classroom Management: Raumgestaltung und Reibungslosigkeit werden sofort gesichert.'),
      zero(`Ich warte, bis später jemand Zeit zum Aufräumen hat.`, 'Die Ablenkung und der blockierte Laufweg bleiben als Störfaktoren bestehen.'),
      minus(`Ich mache die Klasse laut für den Müll im Raum verantwortlich.`, 'Die Reaktion schafft Unruhe, ohne die situative Störungsursache zu beseitigen.')
    ], ['Müll']);

  add('S22', 'Kooperative Verhaltensmodifikation', true, 'avoidance', 'Ausweichen statt Arbeiten',
    `${n(problem.ben)} fragt zum dritten Mal nach einer Nebensache, obwohl der Arbeitsauftrag klar ist. Es wirkt wie ein Ausweichen vor dem Beginn.`,
    [
      plus(`Ich nehme die Frage kurz auf und vereinbare: erst Aufgabe eins, dann Klärung.`, 'Kooperative Verhaltensmodifikation: Bedürfnis und Arbeitsziel werden transparent verbunden.'),
      zero(`Ich beantworte jede Nachfrage ausführlich.`, 'Das wirkt zugewandt, kann aber das Ausweichverhalten verstärken.'),
      minus(`Ich sage, dass solche Fragen nur stören.`, 'Die Reaktion wertet ab und ignoriert das ausweichende Schülerverhalten.')
    ], [n(problem.ben), 'Ausweichen']);

  add('S23', 'Classroom Management', true, 'noise', 'Lautstärke steigt',
    `Die Arbeitslautstärke steigt schrittweise. ${n(problem.tom)} nutzt den Moment, um erneut Aufmerksamkeit zu bekommen.`,
    [
      plus(`Ich nutze das bekannte Ruhezeichen und gebe danach die nächste Arbeitsminute vor.`, 'Classroom Management: Stoppsignal und klare Aktivierung halten die Störung klein.'),
      zero(`Ich bitte mehrfach um Ruhe, während ich weiter erkläre.`, 'Die Bitte ist passend gemeint, verliert aber ohne klares Signal Wirkung.'),
      minus(`Ich werde lauter, bis die Klasse leise wird.`, 'Die Lehrkraft verstärkt die Gesamtlautstärke und unterbricht den Unterrichtsfluss.')
    ], ['Lautstärke']);

  add('S24', 'Kooperative Verhaltensmodifikation', true, 'choice', 'Kleine Wahlmöglichkeit',
    `${n(problem.niklas)} wirkt kurz vor dem Ausstieg aus der Aufgabe. Ein harter Befehl würde vermutlich Widerstand auslösen.`,
    [
      plus(`Ich biete zwei klare Startoptionen und lasse ${n(problem.niklas)} eine wählen.`, 'Kooperative Verhaltensmodifikation: Begrenzte Wahl stärkt Selbststeuerung innerhalb des Ziels.'),
      zero(`Ich sage nur, dass er jetzt anfangen soll.`, 'Die Erwartung ist klar, aber sie enthält keine Selbststeuerungshilfe.'),
      minus(`Ich erkläre lange, warum die Aufgabe wichtig ist.`, 'Zu viel Erklärung verzögert den Start und ignoriert das Ausstiegsrisiko.')
    ], [n(problem.niklas), 'Selbststeuerung']);

  add('S25', 'Classroom Management', true, 'firstMinute', 'Die erste Minute zählt',
    `Direkt nach dem Start der Arbeitsphase entsteht Unruhe. Noch ist die Situation gut steuerbar.`,
    [
      plus(`Ich sichere den Start mit Signal, sichtbarer Präsenz und einer Mini-Aufgabe.`, 'Classroom Management: Frühe Struktur verhindert, dass kleine Störungen wachsen.'),
      zero(`Ich gebe der Klasse mehr Zeit, sich selbst zu sortieren.`, 'Das kann funktionieren, berücksichtigt bekannte Risikoprofile aber nur schwach.'),
      minus(`Ich starte mit Ermahnungen, bevor klar ist, wer Unterstützung braucht.`, 'Der Stundenstart kippt in Kontrolllogik statt präventive Struktur.')
    ], ['Startphase']);

  add('S26', 'Kooperative Verhaltensmodifikation', true, 'feedback', 'Positives Verhalten übersehen',
    `${n(problem.tom)} meldet sich einmal korrekt, kurz danach droht wieder ein Zwischenruf. Der Moment ist günstig für Verstärkung.`,
    [
      plus(`Ich bestätige die korrekte Meldung kurz und konkret.`, 'Kooperative Verhaltensmodifikation: Zielverhalten wird verstärkt und dadurch wahrscheinlicher.'),
      zero(`Ich nehme ihn einfach dran und mache weiter.`, 'Das ist sachlich, nutzt aber die Chance zur positiven Verstärkung nicht.'),
      minus(`Ich erinnere gleichzeitig daran, wie oft er sonst dazwischenruft.`, 'Die Rückmeldung entwertet das Zielverhalten und schwächt Selbstwirksamkeit.')
    ], [n(problem.tom), 'Verstärkung']);

  add('S27', 'Classroom Management', true, 'seating', 'Sitzordnung als Auslöser',
    `An einem Tisch entsteht wiederholt Ablenkung. Die aktuelle Sitznähe scheint die Störung mit auszulösen.`,
    [
      plus(`Ich interveniere knapp und plane danach eine gezielte Sitzkorrektur.`, 'Classroom Management: Die akute Störung und die strukturelle Sitzursache werden berücksichtigt.'),
      zero(`Ich tausche sofort mehrere Plätze mitten in der Arbeitsphase.`, 'Das kann helfen, stört aber den Unterrichtsfluss durch viel Bewegung.'),
      minus(`Ich ignoriere die Sitzursache und arbeite nur mit Ermahnungen.`, 'Die situative Bedingung bleibt bestehen; die Reaktion ist zu eindimensional.')
    ], ['Sitzordnung']);

  add('S28', 'Kooperative Verhaltensmodifikation', true, 'reflection', 'Kurze Reflexion statt Moralpredigt',
    `${n(problem.ben)} hält sich nach einer Intervention wieder an die Aufgabe. Die Lehrkraft kann jetzt entscheiden, wie sie den Moment abschließt.`,
    [
      plus(`Ich gebe kurz Rückmeldung und formuliere die Erwartung für die nächsten Minuten.`, 'Kooperative Verhaltensmodifikation: Gelingen wird verstärkt und an ein klares Ziel gebunden.'),
      zero(`Ich sage nichts weiter, weil es jetzt läuft.`, 'Das ist störungsarm, verschenkt aber eine wirksame Verstärkung.'),
      minus(`Ich erkläre ausführlich, warum es vorher problematisch war.`, 'Die Rückschau reaktiviert die Störung und unterbricht den Arbeitsfluss.')
    ], [n(problem.ben), 'Rückmeldung']);

  add('S29', 'Classroom Management', true, 'taskClarity', 'Auftrag zu offen',
    `Einige Schüler*innen wissen nicht, was als Nächstes zählt. ${n(problem.petra)} nutzt die Unklarheit für Nebengespräche.`,
    [
      plus(`Ich formuliere sichtbar: zwei Minuten Aufgabe eins markieren, dann Rückmeldung.`, 'Classroom Management: Klarheit und Zeitrahmen reduzieren Ausweich- und Ablenkungsverhalten.'),
      zero(`Ich frage, wer die Aufgabe noch nicht verstanden hat.`, 'Das kann helfen, schwächt aber Unterrichtsfluss und klare Aktivierung.'),
      minus(`Ich sage, dass die Aufgabe doch eindeutig erklärt wurde.`, 'Die Unsicherheit wird ignoriert; klare Instruktion als Classroom-Management-Hilfe fehlt.')
    ], [n(problem.petra), 'Auftragsklarheit']);

  add('S30', 'Kooperative Verhaltensmodifikation', true, 'emotion', 'Emotion vor Verhalten',
    `${n(problem.lina)} wirkt nach einem Kommentar innerlich ausgestiegen. Eine reine Ermahnung zur Mitarbeit würde zu kurz greifen.`,
    [
      plus(`Ich spreche leise an, gebe Sicherheit und biete einen kleinen Startschritt an.`, 'Kooperative Verhaltensmodifikation: Gefühl, Auslöser und Rückkehrhandlung werden zusammen gesehen.'),
      zero(`Ich lasse ihr kurz Zeit und gehe weiter.`, 'Der Schutz vor Öffentlichkeit passt, aber die Rückkehrhilfe zum Zielverhalten fehlt.'),
      minus(`Ich fordere sofort Mitarbeit, ohne den Auslöser zu beachten.`, 'Das Schülerverhalten wird isoliert bewertet; die emotionale Bedingung bleibt unbeachtet.')
    ], [n(problem.lina), 'Emotion']);

  add('S31', 'Classroom Management', true, 'door', 'Blick wandert zur Tür',
    `${n(problem.niklas)} schaut wiederholt zur Tür und wirkt, als wolle er die Situation verlassen oder sich entziehen.`,
    [
      plus(`Ich gehe nah heran, frage leise nach dem Grund und kläre die Rückkehr.`, 'Classroom Management: Frühe Präsenz klärt Anlass und verhindert Modellwirkung für andere.'),
      zero(`Ich stelle mich in Türnähe und beobachte.`, 'Das kann Weggehen verhindern, klärt aber weder Anlass noch Regel.'),
      minus(`Ich rufe von vorne, dass niemand den Raum verlässt.`, 'Die Reaktion ist öffentlich und ersetzt keine kooperative Klärung.')
    ], [n(problem.niklas), 'Tür']);

  add('S32', 'Kooperative Verhaltensmodifikation', true, 'agreement', 'Vereinbarung braucht Kontrolle',
    `Eine vorherige Vereinbarung zeigt erste Wirkung, ist aber noch nicht stabil. ${n(problem.tom)} schaut, ob die Lehrkraft konsequent bleibt.`,
    [
      plus(`Ich erinnere kurz an die Vereinbarung und frage nach dem Hilfeschritt.`, 'Kooperative Verhaltensmodifikation: Vereinbarung, Kontrolle und Selbststeuerung bleiben verlässlich.'),
      zero(`Ich verhandle die Vereinbarung in der Situation erneut.`, 'Das ist wertschätzend, schwächt aber Verbindlichkeit und Kontrollplanung.'),
      minus(`Ich sage, dass Vereinbarungen bei ihm ohnehin nichts bringen.`, 'Das beschädigt Beziehung und Selbstwirksamkeit statt Selbstbewertung aufzubauen.')
    ], [n(problem.tom), 'Vereinbarung']);

  add('S33', 'Classroom Management', true, 'preventivePresence', 'Präventive Präsenz',
    `Noch ist keine offene Störung sichtbar, aber mehrere riskante Plätze liegen außerhalb der direkten Aufmerksamkeit.`,
    [
      plus(`Ich verändere meine Position, sodass riskante Plätze im Blick liegen.`, 'Classroom Management: Withitness wirkt präventiv, bevor eine Störung sichtbar wird.'),
      zero(`Ich bleibe vorne, damit die Erklärung vollständig bleibt.`, 'Das kann sachlich nötig sein, lässt aber blinde Bereiche ohne Präsenz.'),
      minus(`Ich kündige an, gleich streng zu kontrollieren, wer nicht arbeitet.`, 'Die Ankündigung setzt auf Drohung statt auf Präsenz und Gruppenfokus.')
    ], ['Präsenz']);

  add('S34', 'Kooperative Verhaltensmodifikation', true, 'cooperation', 'Kooperation statt Machtkampf',
    `${n(problem.ben)} widerspricht knapp. Die Situation kann entweder klein bleiben oder zum Machtkampf werden.`,
    [
      plus(`Ich wiederhole die Erwartung ruhig und gebe eine Wahl innerhalb der Regel.`, 'Kooperative Verhaltensmodifikation: Klarheit bleibt bestehen, ohne Kooperation zu verlieren.'),
      zero(`Ich erkläre ausführlich, warum die Regel sinnvoll ist.`, 'Das ist pädagogisch plausibel, schwächt aber im Moment den Unterrichtsfluss.'),
      minus(`Ich fordere sofort eine Entschuldigung vor der Klasse.`, 'Der Druck macht den Konflikt öffentlich und verhindert kooperative Klärung.')
    ], [n(problem.ben), 'Kooperation']);

  add('S35', 'Classroom Management', true, 'sink', 'Weg zum Waschbecken',
    `${n(problem.petra)} schaut zum Waschbecken und scheint gleich aufzustehen. Die Aufgabe ist noch nicht begonnen.`,
    [
      plus(`Ich frage leise nach dem Grund und kläre kurz Weg oder Arbeitsstart.`, 'Classroom Management: Regel, legitimes Bedürfnis und Unterrichtsfluss werden abgewogen.'),
      zero(`Ich lasse den Weg zu, solange es ruhig bleibt.`, 'Das hält die Situation klein, lässt aber die Regel unklar.'),
      minus(`Ich verbiete grundsätzlich jeden Gang durch den Raum.`, 'Mögliche berechtigte Gründe werden ignoriert; die Regel wird unflexibel eingesetzt.')
    ], [n(problem.petra), 'Waschbecken']);

  add('S36', 'Kooperative Verhaltensmodifikation', true, 'cabinet', 'Weg zum Schrank',
    `${n(problem.emily)} steht unsicher auf und geht in Richtung Schrank. Es ist unklar, ob Material fehlt oder ob sie der Aufgabe ausweicht.`,
    [
      plus(`Ich frage kurz nach und vereinbare: Material holen, dann zurück zur Aufgabe.`, 'Kooperative Verhaltensmodifikation: Anlassklärung, Ziel und Rückkehrregel werden verbunden.'),
      zero(`Ich schicke sie sofort zurück, damit niemand anderes aufsteht.`, 'Das sichert Ordnung, prüft aber den möglichen Materialbedarf nicht.'),
      minus(`Ich rufe quer durch den Raum, dass der Schrank tabu ist.`, 'Die Reaktion ist öffentlich und klärt weder Bedürfnis noch Regel.')
    ], [n(problem.emily), 'Schrank']);

  add('S37', 'Classroom Management', true, 'classFocus', 'Viele schauen zur Störung',
    `Eine kleine Störung zieht plötzlich viele Blicke auf sich. Der Unterricht droht, seinen Fokus zu verlieren.`,
    [
      plus(`Ich halte die Intervention klein und gebe allen sofort eine klare Aufgabe.`, 'Classroom Management: Gruppenfokus und aktive Lernzeit bleiben im Vordergrund.'),
      zero(`Ich warte, bis sich die Aufmerksamkeit wieder verteilt.`, 'Das kann funktionieren, verliert aber wertvolle Arbeitszeit.'),
      minus(`Ich bespreche mit der ganzen Klasse, warum Störungen stören.`, 'Die Besprechung macht die Störung zum Mittelpunkt.')
    ], ['Aufmerksamkeit']);

  add('S38', 'Kooperative Verhaltensmodifikation', true, 'supportPlan', 'Ein Plan für den nächsten Versuch',
    `${n(problem.niklas)} hat die Regel erneut nicht eingehalten. Die akute Situation ist gestoppt, aber eine Wiederholung ist wahrscheinlich.`,
    [
      plus(`Ich vereinbare kurz einen Wenn-dann-Plan und erinnere daran zu Stundenbeginn.`, 'Kooperative Verhaltensmodifikation: Ziel, Bedingung und Kontrolle unterstützen Selbststeuerung.'),
      zero(`Ich notiere mir, das irgendwann im Klassenrat anzusprechen.`, 'Eine spätere Klärung kann helfen, ist aber zu unkonkret.'),
      minus(`Ich kündige für das nächste Mal sofort eine harte Konsequenz an.`, 'Die Drohung ersetzt keine kooperative Planungs- und Kontrollhilfe.')
    ], [n(problem.niklas), 'Wenn-dann-Plan']);

  add('S39', 'Classroom Management', true, 'overlap', 'Zwei Ereignisse gleichzeitig',
    `Während eine Störung bearbeitet wird, entsteht an anderer Stelle ein zweites Warnsignal. Die Lehrkraft muss priorisieren.`,
    [
      plus(`Ich schließe das Erste knapp ab und gehe dann zum dringenderen Signal.`, 'Classroom Management: Overlapping und Priorisierung halten den Unterrichtsrahmen stabil.'),
      zero(`Ich spreche beide Situationen von der Mitte des Raumes aus an.`, 'Das ist schnell, bleibt aber ungenau und nutzt Präsenz kaum.'),
      minus(`Ich ignoriere das zweite Signal, bis die erste Situation ganz geklärt ist.`, 'Die zweite Störung kann eskalieren; Withitness wird nicht genutzt.')
    ], ['Priorisierung']);

  add('S40', 'Kooperative Verhaltensmodifikation', true, 'closing', 'Ruhiger Abschluss einer Intervention',
    `Die Situation ist geklärt. Entscheidend ist jetzt, ob die Klasse wieder schnell in die Aufgabe findet.`,
    [
      plus(`Ich fasse die Erwartung kurz zusammen und gebe den nächsten Arbeitsschritt.`, 'Kooperative Verhaltensmodifikation: Das Zielverhalten bleibt klar, ohne die Störung zu verlängern.'),
      zero(`Ich frage nach, ob jetzt wirklich alles verstanden wurde.`, 'Das kann Sicherheit geben, verlängert aber die Störung und Lernzeit sinkt.'),
      minus(`Ich wiederhole ausführlich, was vorher falsch lief.`, 'Die Störung wird reaktiviert und die aktive Lernzeit sinkt.')
    ], ['Abschluss']);

  return s;
}


function init() {
  renderContext();
  renderScenarioCatalog();
  bindEvents();
}

function bindEvents() {
  if (openScenarioBtn) openScenarioBtn.addEventListener('click', () => scenarioDrawer.hidden = false);
  if (closeScenarioBtn) closeScenarioBtn.addEventListener('click', () => scenarioDrawer.hidden = true);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && scenarioDrawer && !scenarioDrawer.hidden) scenarioDrawer.hidden = true;
  });
}

function renderContext() {
  const score = context.stepData?.rawPreparationScore ?? context.stepData?.preparationScore ?? '–';
  const hooks = Array.isArray(context.stepData?.suggestedScenarioHooks) ? context.stepData.suggestedScenarioHooks : [];
  if (stepSummary) {
    const dynamicBits = [
      `${context.blindRiskStudents.length} blinde Risikoschüler*innen`,
      `${context.riskyPairs.length} riskante Nachbarschaften`,
      `${context.stabilizingPairs.length} stabilisierende Nachbarschaften`,
      `${context.activeTrash.length} Müllfelder`,
      `${context.invalidSpacing.length} enge Laufwege`
    ];
    stepSummary.innerHTML = `<strong>Startstabilität:</strong> ${score} · <strong>dynamische Auslöser:</strong> ${dynamicBits.join(' · ')}${hooks.length ? `<br><strong>Hooks:</strong> ${hooks.map(escapeHtml).join(', ')}` : ''}`;
  }

  if (ruleSummary) ruleSummary.textContent = `${context.acceptedRules.length} verbindliche Klassenregeln gespeichert`;
  if (selectedRulesList) {
    selectedRulesList.innerHTML = context.acceptedRules.length
      ? context.acceptedRules.map(rule => `<li>${escapeHtml(rule.text || rule.id)}</li>`).join('')
      : '<li>Keine Regeln gespeichert. Regel-Szenarien werden als Katalogvarianten angezeigt.</li>';
  }

  if (studentContextList) {
    studentContextList.innerHTML = context.students.map(student => {
      const place = deskPlace(student);
      const markers = [];
      if (student.hidden?.risk >= 3) markers.push('störanfällig');
      if (student.hidden?.stabilizer) markers.push('stabilisierend');
      if (student.hidden?.mediator) markers.push('vermittelnd');
      if (student.hidden?.phoneRisk) markers.push('Handy-Risiko');
      return `<li>${studentAvatarMarkup(student, 'scenario-student-avatar')}<div><strong>${escapeHtml(student.name)} (${student.age})</strong><span>${escapeHtml(student.note || '')}</span><small>${escapeHtml(place)}${markers.length ? ` · ${markers.join(', ')}` : ''}</small></div></li>`;
    }).join('');
  }
}

function scenarioFitLabel(scenario) {
  if (scenario.matched) return 'aus dieser Runde';
  if (scenario.source?.startsWith('nicht')) return 'Regel nicht gewählt';
  return 'Fallback / Katalog';
}

function renderScenarioCatalog() {
  if (!scenarioList) return;
  if (scenarioCount) scenarioCount.textContent = `${SCENARIOS.length} Szenarien`;
  scenarioList.innerHTML = SCENARIOS.map((scenarioItem, index) => `
    <article class="scenario-card ${scenarioItem.matched ? 'matched' : 'fallback'}" data-type="${escapeHtml(scenarioItem.type)}">
      <div class="scenario-card-head">
        <span class="scenario-number">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <p class="eyebrow">${escapeHtml(scenarioItem.type)}</p>
          <h3>${escapeHtml(scenarioItem.title)}</h3>
        </div>
        <span class="scenario-fit">${escapeHtml(scenarioFitLabel(scenarioItem))}</span>
      </div>
      <p class="scenario-scene">${escapeHtml(polishGerman(scenarioItem.scene))}</p>
      ${scenarioItem.contextNote ? `<p class="scenario-context-note">${escapeHtml(scenarioItem.contextNote)}</p>` : ''}
      <div class="scenario-focus">${(scenarioItem.focus || []).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
      <div class="scenario-answers">
        ${scenarioItem.answers.map(answer => `
          <div class="scenario-answer delta-${answer.delta > 0 ? 'plus' : answer.delta < 0 ? 'minus' : 'zero'}">
            <strong>${answer.delta > 0 ? '+1' : answer.delta < 0 ? '-1' : '0'}</strong>
            <p>${escapeHtml(polishGerman(answer.text))}</p>
            <small>${escapeHtml(polishGerman(answer.feedback))}</small>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}



/* ===== Branching-Prototyp: Live-Unterricht ===== */
const branchGrid = document.getElementById('branchClassroomGrid');
const lessonTimerEl = document.getElementById('lessonTimer');
const branchLifeSegments = document.getElementById('branchLifeSegments');
const branchScorePill = document.getElementById('branchScorePill');
const branchScoreNote = document.getElementById('branchScoreNote');
const teacherMoodImage = document.getElementById('teacherMoodImage');
const teacherMoodLabel = document.getElementById('teacherMoodLabel');
const teacherStatus = document.getElementById('teacherStatus');
const startLessonBtn = document.getElementById('startLessonBtn');
const pauseLessonBtn = document.getElementById('pauseLessonBtn');
const restartLessonBtn = document.getElementById('restartLessonBtn');
const incidentCounter = document.getElementById('incidentCounter');
const incidentList = document.getElementById('incidentList');
const branchLog = document.getElementById('branchLog');
const branchEventCards = document.getElementById('branchEventCards');
const activeMethodLabel = document.getElementById('activeMethodLabel');
const scenarioModal = document.getElementById('scenarioModal');
const scenarioModalArea = document.getElementById('scenarioModalArea');
const scenarioModalTitle = document.getElementById('scenarioModalTitle');
const scenarioModalScene = document.getElementById('scenarioModalScene');
const scenarioAnswerList = document.getElementById('scenarioAnswerList');
const scenarioResultBox = document.getElementById('scenarioResultBox');
const continueScenarioBtn = document.getElementById('continueScenarioBtn');
const answerTimerEl = document.getElementById('answerTimer');
const currentHighscoreEl = document.getElementById('currentHighscore');
const highscoreNote = document.getElementById('highscoreNote');
const scoreEventList = document.getElementById('scoreEventList');
const scoreEventCounter = document.getElementById('scoreEventCounter');
const outcomeModal = document.getElementById('outcomeModal');
const outcomeImage = document.getElementById('outcomeImage');
const outcomeEyebrow = document.getElementById('outcomeEyebrow');
const outcomeTitle = document.getElementById('outcomeTitle');
const outcomeText = document.getElementById('outcomeText');
const outcomeAdvice = document.getElementById('outcomeAdvice');
const outcomeHighscore = document.getElementById('outcomeHighscore');
const outcomeBreakdown = document.getElementById('outcomeBreakdown');
const restartOutcomeBtn = document.getElementById('restartOutcomeBtn');
const branchTutorialOverlay = document.getElementById('branchTutorialOverlay');
const branchTutorialProgress = document.getElementById('branchTutorialProgress');
const branchTutorialSkipBtn = document.getElementById('branchTutorialSkipBtn');
const branchTutorialSlide = document.getElementById('branchTutorialSlide');
const branchTutorialVisual = document.getElementById('branchTutorialVisual');
const branchTutorialTitle = document.getElementById('branchTutorialTitle');
const branchTutorialText = document.getElementById('branchTutorialText');
const branchTutorialList = document.getElementById('branchTutorialList');
const branchTutorialDots = document.getElementById('branchTutorialDots');
const branchTutorialPrevBtn = document.getElementById('branchTutorialPrevBtn');
const branchTutorialNextBtn = document.getElementById('branchTutorialNextBtn');

const LESSON_SECONDS = 300;
const INCIDENT_REACTION_MS = 7000;
const ANSWER_SECONDS = 20;
const TEACHER_FIRST_STEP_MS = 100;
const TEACHER_STEP_MS = 400;
const STUDENT_STEP_MS = 1500;
const SCORE_PER_LIFE = 500;
const SCORE_GOOD_ANSWER = 200;
const SCORE_BAD_ANSWER = -200;
const EVENT_SPEED_PER_MINUTE = 0.85;
const MIN_STUDENT_EVENT_DELAY_MS = 1200;
const MIN_TRASH_EVENT_DELAY_MS = 2000;
const WANDER_EVENT_INTERVAL_MS = 30000;

const audioState = {
  unlocked: false,
  timer: null,
  alert: null,
  good: null,
  bad: null
};

const game = {
  started: false,
  finished: false,
  lessonLeft: LESSON_SECONDS,
  score: normalizeStartScore(context.startScore ?? context.stepData?.rawPreparationScore ?? context.stepData?.preparationScore ?? 5),
  teacher: normalizeTeacher(context.stepData?.teacher),
  teacherPath: [],
  teacherMoveTimer: null,
  teacherMoveStepIndex: 0,
  lessonTimer: null,
  spawnTimer: null,
  nextIncidentAt: 0,
  nextTrashAt: 0,
  nextWanderAt: 0,
  activeIncidents: [],
  currentScenarioIncident: null,
  scenarioCountdown: null,
  answerLeft: ANSWER_SECONDS,
  scenarioOpen: false,
  manualPause: false,
  tutorialOpen: true,
  pausedAt: null,
  eventSeq: 0,
  usedScenarioIds: new Set(),
  highscoreBase: 0,
  lifeBonus: 0,
  finalHighscore: 0,
  finalBonusAdded: false,
  finishReason: null,
  scoreEvents: [],
  dynamicTrash: [],
  studentPositions: {},
  studentMoveTimers: {},
  pendingWanderResolution: null,
  bin: context.stepData?.objects?.bin || context.stepData?.objects?.broom || { id: 'trash-bin-1', type: 'bin', row: (context.stepData?.rows || 9) - 1, col: (context.stepData?.cols || 10) - 1 }
};

const liveTrashDragState = { objectId: null };

const branchTutorialSlides = [
  {
    title: 'Worum geht es in dieser Spielphase?',
    text: 'Du steuerst die Lehrkraft durch den laufenden Unterricht. Reagiere auf akute Störungen, halte Wege frei und sichere die Unterrichtsstabilität bis zum Stundenende.',
    bullets: [
      'Bewege die Lehrkraft mit Klicks auf erreichbare Felder.',
      'Fange akute Probleme schnell ab, bevor Zeit oder Stabilität verloren gehen.',
      'Behalte gleichzeitig Unterrichtsstabilität, aktuelle Probleme und Highscore im Blick.'
    ],
    visual: { type: 'overview' }
  },
  {
    title: 'Zu Problemen hingehen',
    text: 'Wenn ein Problem auftritt, erscheint ein gelbes Zielfeld. Klicke dorthin: Die Lehrkraft läuft automatisch zum Feld und kann die Situation dann klären.',
    bullets: [
      'Rote Countdown-Felder zeigen akuten Handlungsdruck.',
      'Die Lehrkraft muss rechtzeitig in die Nähe des Problems gelangen.',
      'Ein gelber Richtungsmarker zeigt, wo du hinklicken solltest.'
    ],
    visual: { type: 'annotated-single', src: 'assets/tutorial/phase3_problem_move.png', alt: 'Lehrkraft, gelber Richtungsmarker und rotes Countdown-Feld' }
  },
  {
    title: 'Szenarien sicher lösen',
    text: 'Wenn die Lehrkraft einen betroffenen Schüler erreicht, kann ein Szenario starten. Dann hast du 20 Sekunden Zeit, um eine passende pädagogische Reaktion auszuwählen.',
    bullets: [
      'Eine gute Lösung stärkt die Unterrichtsstabilität und verbessert den Highscore.',
      'Eine problematische Intervention kostet Punkte und kann Unterrichtsstabilität verlieren lassen.',
      'Eine kurzfristige Notlösung bringt in der Regel keine Punkteveränderung.'
    ],
    visual: { type: 'single', src: 'assets/tutorial/phase3_scenario.png', alt: 'Szenariofenster mit Antwortoptionen' }
  },
  {
    title: 'Müll blockiert den Weg',
    text: 'Müll kann Laufwege blockieren. Räume ihn schnell aus dem Weg, indem du ihn in den Mülleimer ziehst.',
    bullets: [
      'Blockierte Felder erschweren den Weg zu Problemen.',
      'Ziehe den Müll per Drag-and-Drop in den Mülleimer unten rechts.',
      'Müll zählt nicht zu den maximal drei aktiven Problemen und kann zusätzlich auftauchen.'
    ],
    visual: {
      type: 'dual',
      items: [
        { src: 'assets/tutorial/phase3_trash_block.png', alt: 'Müll blockiert ein Feld', caption: 'Müll blockiert den Weg' },
        { src: 'assets/tutorial/phase3_trash_bin.png', alt: 'Müll wird in den Mülleimer entsorgt', caption: 'Schnell in den Mülleimer ziehen' }
      ]
    }
  },
  {
    title: 'Weglaufende Schüler abfangen',
    text: 'Manchmal verlassen Schüler ohne Absprache ihren Platz und bewegen sich zum Schrank, Waschbecken oder zur Tür. Reagiere frühzeitig, um die Situation professionell zu klären.',
    bullets: [
      'Unterbrich das Weglaufen möglichst früh.',
      'Klär kurz den Anlass und führe die Person wieder in den Arbeitsprozess zurück.',
      'Auch diese laufenden Schüler zählen zu den maximal drei aktiven Problemen.'
    ],
    visual: { type: 'single', src: 'assets/tutorial/phase3_student_move.png', alt: 'Schüler bewegt sich vom Platz weg' }
  },
  {
    title: 'Unterrichtsstabilität im Blick behalten',
    text: 'Die Unterrichtsstabilität ersetzt die bisherige Lebensanzeige. Verlierst du zu viel Stabilität, endet die Runde.',
    bullets: [
      'Wenn du sich bewegende Schüler nicht rechtzeitig stoppst, sinkt die Unterrichtsstabilität.',
      'Auch eine schlecht gelöste Szenarioentscheidung kann Stabilität kosten.',
      'Läuft der Timer eines akuten Problems ab, ohne dass du rechtzeitig dort bist, verlierst du ebenfalls Unterrichtsstabilität.'
    ],
    visual: { type: 'single', src: 'assets/tutorial/phase3_stability.png', alt: 'Lehrkraftbild mit Unterrichtsstabilität' }
  },
  {
    title: 'So entsteht dein Highscore',
    text: 'Der Highscore belohnt schnelles und passendes Handeln im Unterricht.',
    bullets: [
      'Reaktionspunkte gibt es, wenn du Probleme schnell erreichst.',
      'Gute Interventionen bringen zusätzliche Pluspunkte.',
      'Problematische Entscheidungen und verpasste Situationen kosten Punkte.'
    ],
    visual: { type: 'single', src: 'assets/tutorial/phase3_scores.png', alt: 'Highscore-Ereignisse mit Plus- und Minuspunkten' }
  }
];

let branchTutorialIndex = 0;

function isGameplayPaused() {
  return Boolean(game.scenarioOpen || game.manualPause || game.tutorialOpen);
}

function updateControlButtons() {
  if (startLessonBtn) {
    startLessonBtn.disabled = game.started;
    startLessonBtn.textContent = game.started ? 'Unterricht läuft' : 'Unterricht starten';
  }
  if (pauseLessonBtn) {
    pauseLessonBtn.disabled = !game.started || game.finished || game.scenarioOpen || game.tutorialOpen;
    pauseLessonBtn.textContent = game.manualPause ? 'Fortsetzen' : 'Pausieren';
  }
}

function markPhase3TutorialSeen() {
  try { sessionStorage.setItem('classroomGame.phase3TutorialSeen', '1'); } catch (error) {}
}

function wasPhase3TutorialSeen() {
  try { return sessionStorage.getItem('classroomGame.phase3TutorialSeen') === '1'; } catch (error) { return false; }
}

function restartCurrentPhase() {
  markPhase3TutorialSeen();
  window.location.reload();
}

function syncPhase3PanelHeights() {
  const shell = document.querySelector('.phase3-shell');
  const roomPanel = document.querySelector('.phase3-room-panel');
  if (!shell || !roomPanel) return;
  if (window.matchMedia('(max-width: 1420px)').matches) {
    shell.style.removeProperty('--phase3-panel-height');
    return;
  }
  window.requestAnimationFrame(() => {
    shell.style.setProperty('--phase3-panel-height', `${roomPanel.offsetHeight}px`);
  });
}

function tutorialVisualMarkup(visual) {
  if (!visual) return '<div class="branch-tutorial-placeholder"><strong>Unterrichtsstunde</strong><span>Akute Probleme erkennen, Wege freihalten und stabil handeln.</span></div>';
  if (visual.type === 'overview') {
    return `
      <div class="branch-tutorial-overview-card">
        <div class="branch-tutorial-overview-icon">LK</div>
        <div>
          <strong>Unterricht souverän steuern</strong>
          <p>Du hältst den Unterricht am Laufen, indem du Probleme schnell erreichst, Müll beseitigst und passende Entscheidungen in Szenarien triffst.</p>
        </div>
      </div>`;
  }
  if (visual.type === 'annotated-single') {
    return `
      <div class="branch-tutorial-image branch-tutorial-image--annotated">
        <img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.alt || '')}" draggable="false" />
        <span class="branch-tutorial-arrow branch-tutorial-arrow--move" aria-hidden="true"></span>
      </div>`;
  }
  if (visual.type === 'dual') {
    return `<div class="branch-tutorial-dual">${(visual.items || []).map(item => `
      <figure class="branch-tutorial-figure">
        <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || '')}" draggable="false" />
        ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ''}
      </figure>`).join('')}</div>`;
  }
  return `
    <figure class="branch-tutorial-figure branch-tutorial-figure--single">
      <img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.alt || '')}" draggable="false" />
    </figure>`;
}

function renderBranchTutorial(animated = false, direction = 'next') {
  if (!branchTutorialSlide) return;
  const render = () => {
    const slide = branchTutorialSlides[branchTutorialIndex];
    if (branchTutorialProgress) branchTutorialProgress.textContent = `${branchTutorialIndex + 1}/${branchTutorialSlides.length}`;
    if (branchTutorialTitle) branchTutorialTitle.textContent = slide.title;
    if (branchTutorialText) branchTutorialText.textContent = slide.text;
    if (branchTutorialVisual) branchTutorialVisual.innerHTML = tutorialVisualMarkup(slide.visual);
    if (branchTutorialList) branchTutorialList.innerHTML = (slide.bullets || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
    if (branchTutorialPrevBtn) branchTutorialPrevBtn.disabled = branchTutorialIndex === 0;
    if (branchTutorialNextBtn) branchTutorialNextBtn.textContent = branchTutorialIndex === branchTutorialSlides.length - 1 ? "Los geht's" : 'Weiter';
    renderBranchTutorialDots();
  };

  if (!animated) {
    render();
    return;
  }
  branchTutorialSlide.classList.remove('tutorial-enter-left', 'tutorial-enter-right', 'tutorial-exit-left', 'tutorial-exit-right');
  branchTutorialSlide.classList.add(direction === 'prev' ? 'tutorial-exit-right' : 'tutorial-exit-left');
  window.setTimeout(() => {
    render();
    branchTutorialSlide.classList.remove('tutorial-exit-left', 'tutorial-exit-right');
    branchTutorialSlide.classList.add(direction === 'prev' ? 'tutorial-enter-left' : 'tutorial-enter-right');
    window.setTimeout(() => branchTutorialSlide.classList.remove('tutorial-enter-left', 'tutorial-enter-right'), 360);
  }, 260);
}

function renderBranchTutorialDots() {
  if (!branchTutorialDots) return;
  branchTutorialDots.innerHTML = '';
  branchTutorialSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    if (index === branchTutorialIndex) dot.classList.add('active');
    dot.setAttribute('aria-label', `Erklärseite ${index + 1}`);
    dot.addEventListener('click', () => {
      if (index === branchTutorialIndex) return;
      const direction = index < branchTutorialIndex ? 'prev' : 'next';
      branchTutorialIndex = index;
      renderBranchTutorial(true, direction);
    });
    branchTutorialDots.appendChild(dot);
  });
}

function openBranchTutorial() {
  game.tutorialOpen = true;
  branchTutorialIndex = 0;
  if (branchTutorialOverlay) branchTutorialOverlay.hidden = false;
  document.body.classList.add('tutorial-open');
  renderBranchTutorial(false);
  updateControlButtons();
}

function closeBranchTutorial() {
  game.tutorialOpen = false;
  markPhase3TutorialSeen();
  if (branchTutorialOverlay) branchTutorialOverlay.hidden = true;
  document.body.classList.remove('tutorial-open');
  updateControlButtons();
  syncPhase3PanelHeights();
}

function nextBranchTutorialSlide() {
  if (branchTutorialIndex >= branchTutorialSlides.length - 1) {
    closeBranchTutorial();
    return;
  }
  branchTutorialIndex += 1;
  renderBranchTutorial(true, 'next');
}

function prevBranchTutorialSlide() {
  if (branchTutorialIndex <= 0) return;
  branchTutorialIndex -= 1;
  renderBranchTutorial(true, 'prev');
}

function applyPausedTimeShift() {
  const pauseDuration = game.pausedAt ? Date.now() - game.pausedAt : 0;
  if (pauseDuration <= 0) return;
  game.activeIncidents.forEach(incident => { if (incident.deadline) incident.deadline += pauseDuration; });
  if (game.nextIncidentAt) game.nextIncidentAt += pauseDuration;
  if (game.nextTrashAt) game.nextTrashAt += pauseDuration;
  if (game.nextWanderAt) game.nextWanderAt += pauseDuration;
}

function toggleLessonPause() {
  if (!game.started || game.finished || game.scenarioOpen || game.tutorialOpen) return;
  if (!game.manualPause) {
    game.manualPause = true;
    game.pausedAt = Date.now();
    stopTeacherMovement();
    if (teacherStatus) teacherStatus.textContent = 'Unterricht pausiert.';
  } else {
    game.manualPause = false;
    applyPausedTimeShift();
    game.pausedAt = null;
    if (teacherStatus) teacherStatus.textContent = 'Unterricht fortgesetzt.';
    if (game.teacherPath.length) queueNextTeacherStep();
    renderBranchGame();
  }
  updateControlButtons();
}

function init() {
  renderContext();
  renderScenarioCatalog();
  renderBranchGame();
  renderLife();
  renderHighscore();
  bindEvents();
  updateControlButtons();
  if (wasPhase3TutorialSeen()) {
    game.tutorialOpen = false;
    if (branchTutorialOverlay) branchTutorialOverlay.hidden = true;
  } else {
    openBranchTutorial();
  }
  syncPhase3PanelHeights();
  window.addEventListener('resize', syncPhase3PanelHeights);
  logEvent('Bereit. Starte den Unterricht, sobald du die Runde beginnen willst.', 'info');
}

function bindEvents() {
  if (openScenarioBtn) openScenarioBtn.addEventListener('click', () => scenarioDrawer.hidden = false);
  if (closeScenarioBtn) closeScenarioBtn.addEventListener('click', () => scenarioDrawer.hidden = true);
  if (startLessonBtn) startLessonBtn.addEventListener('click', startLesson);
  if (pauseLessonBtn) pauseLessonBtn.addEventListener('click', toggleLessonPause);
  if (restartLessonBtn) restartLessonBtn.addEventListener('click', restartCurrentPhase);
  if (continueScenarioBtn) continueScenarioBtn.addEventListener('click', closeScenarioModal);
  if (restartOutcomeBtn) restartOutcomeBtn.addEventListener('click', restartCurrentPhase);
  if (branchTutorialSkipBtn) branchTutorialSkipBtn.addEventListener('click', closeBranchTutorial);
  if (branchTutorialNextBtn) branchTutorialNextBtn.addEventListener('click', nextBranchTutorialSlide);
  if (branchTutorialPrevBtn) branchTutorialPrevBtn.addEventListener('click', prevBranchTutorialSlide);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && scenarioDrawer && !scenarioDrawer.hidden) scenarioDrawer.hidden = true;
  });
}

function renderScenarioCatalog() {
  if (!scenarioList) return;
  if (scenarioCount) scenarioCount.textContent = `${SCENARIOS.length} Szenarien`;
  scenarioList.innerHTML = SCENARIOS.map((scenarioItem, index) => `
    <article class="scenario-card ${scenarioItem.matched ? 'matched' : 'fallback'}" data-type="${escapeHtml(scenarioItem.type)}">
      <div class="scenario-card-head">
        <span class="scenario-number">${String(index + 1).padStart(2, '0')}</span>
        <div>
          <p class="eyebrow">${escapeHtml(scenarioItem.type)}</p>
          <h3>${escapeHtml(scenarioItem.title)}</h3>
        </div>
        <span class="scenario-fit">${escapeHtml(scenarioFitLabel(scenarioItem))}</span>
      </div>
      <p class="scenario-scene">${escapeHtml(scenarioItem.scene)}</p>
      ${scenarioItem.contextNote ? `<p class="scenario-context-note">${escapeHtml(scenarioItem.contextNote)}</p>` : ''}
      <div class="scenario-focus">${(scenarioItem.focus || []).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
      <div class="scenario-answers hidden-score">
        ${shuffle(scenarioItem.answers).map((answer, optionIndex) => `
          <div class="scenario-answer">
            <strong>Option ${String.fromCharCode(65 + optionIndex)}</strong>
            <p>${escapeHtml(answer.text)}</p>
            <small>${escapeHtml(answer.feedback)}</small>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');
}

function normalizeStartScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 5;
  return Math.max(0, Math.min(10, Math.round(number)));
}

function normalizeTeacher(teacher = {}) {
  const row = Number.isInteger(teacher.row) ? teacher.row : 1;
  const col = Number.isInteger(teacher.col) ? teacher.col : 4;
  return { row, col, dir: teacher.dir || 'down' };
}

function startLesson() {
  if (game.started) return;
  unlockAudio();
  game.started = true;
  game.finished = false;
  game.manualPause = false;
  game.lessonLeft = LESSON_SECONDS;
  game.highscoreBase = 0;
  game.lifeBonus = 0;
  game.finalHighscore = 0;
  game.finalBonusAdded = false;
  game.finishReason = null;
  game.scoreEvents = [];
  game.nextIncidentAt = Date.now() + scaledDelay(3000, 5000, MIN_STUDENT_EVENT_DELAY_MS);
  game.nextTrashAt = Date.now() + scaledDelay(6500, 10000, MIN_TRASH_EVENT_DELAY_MS);
  game.nextWanderAt = Date.now() + WANDER_EVENT_INTERVAL_MS;
  game.dynamicTrash = [];
  clearAllStudentMovement();
  game.studentPositions = {};
  game.pendingWanderResolution = null;
  game.pausedAt = null;

  game.teacherPath = [];
  game.teacherMoveStepIndex = 0;
  updateControlButtons();
  if (teacherStatus) teacherStatus.textContent = 'Unterricht läuft. Reagiere auf Probleme im Raum.';
  logEvent('Der Unterricht beginnt. Reagiere auf blinkende Störungen. Müll kann zusätzlich auftauchen und blockiert Laufwege, bis er in den Mülleimer gezogen wird.', 'info');
  game.lessonTimer = window.setInterval(tickLesson, 250);
  renderBranchGame();
  renderHighscore();
}

function tickLesson() {
  if (game.finished) return;
  if (game.score <= 0) {
    finishLesson('lost');
    return;
  }
  if (isGameplayPaused()) return;
  game.lessonLeft = Math.max(0, game.lessonLeft - 0.25);
  updateLessonTimer();
  checkIncidentTimeouts();
  if (game.activeIncidents.length) renderBranchGame();
  else renderIncidents();
  maybeSpawnIncident();
  if (game.lessonLeft <= 0) finishLesson('time');
}

function updateLessonTimer() {
  if (!lessonTimerEl) return;
  const whole = Math.max(0, Math.ceil(game.lessonLeft));
  const minutes = String(Math.floor(whole / 60)).padStart(2, '0');
  const seconds = String(whole % 60).padStart(2, '0');
  lessonTimerEl.textContent = `${minutes}:${seconds}`;
}

function finishLesson(reason = 'time') {
  if (game.finished) return;
  const lost = reason === 'lost' || game.score <= 0;
  game.finished = true;
  game.finishReason = lost ? 'lost' : 'won';
  game.lessonLeft = Math.max(0, game.lessonLeft);
  stopTeacherMovement();
  clearAllStudentMovement();
  clearInterval(game.lessonTimer);
  clearTimeout(game.spawnTimer);
  clearAnswerCountdown();
  stopTimerAudio();
  game.activeIncidents = [];
  game.scenarioOpen = false;
  game.currentScenarioIncident = null;
  if (scenarioModal) {
    scenarioModal.hidden = true;
    scenarioModal.setAttribute('hidden', '');
  }
  if (continueScenarioBtn) continueScenarioBtn.hidden = true;

  const scoreBeforeLifeBonus = game.highscoreBase;
  game.lifeBonus = Math.max(0, Math.min(10, game.score)) * SCORE_PER_LIFE;
  if (!game.finalBonusAdded) {
    game.finalBonusAdded = true;
    if (game.lifeBonus > 0) {
      addHighscoreEvent(game.lifeBonus, `Stabilitätsbonus am Ende: ${game.score} × ${SCORE_PER_LIFE} Punkte`, 'good', { finalBonus: true });
    } else {
      addHighscoreEvent(0, 'Kein Stabilitätsbonus: 0 verbleibende Stabilität.', 'bad', { finalBonus: true });
    }
  }
  game.finalHighscore = scoreBeforeLifeBonus + game.lifeBonus;
  game.highscoreBase = game.finalHighscore;

  renderBranchGame();
  renderIncidents();

  if (lost) {
    logEvent('Die Unterrichtsstabilität ist auf 0 gefallen. Die Runde ist verloren.', 'bad');
    if (teacherStatus) teacherStatus.textContent = 'Runde verloren: Die Unterrichtsstabilität ist auf 0 gefallen.';
    updateControlButtons();
    showOutcomeModal('lost');
  } else {
    logEvent(`Unterricht beendet. Endstabilität: ${game.score}/10.`, game.score > 5 ? 'good' : game.score < 3 ? 'bad' : 'neutral');
    if (teacherStatus) teacherStatus.textContent = 'Unterricht beendet.';
    updateControlButtons();
    showOutcomeModal('won');
  }
  renderLife();
  renderHighscore();
}

function currentDifficultyLimit() {
  const elapsed = LESSON_SECONDS - game.lessonLeft;
  const progress = elapsed / LESSON_SECONDS;
  if (progress > 0.72) return 3;
  if (progress > 0.42) return 2;
  return 1;
}

function elapsedWholeMinutes() {
  return Math.max(0, Math.floor((LESSON_SECONDS - game.lessonLeft) / 60));
}

function speedFactor() {
  return Math.pow(EVENT_SPEED_PER_MINUTE, elapsedWholeMinutes());
}

function scaledDelay(minMs, maxMs, minClamp = 1000) {
  return Math.max(minClamp, Math.round(randomInt(minMs, maxMs) * speedFactor()));
}

function trashLimit() {
  return Math.min(5, 1 + elapsedWholeMinutes());
}

function trashSpawnChance() {
  return Math.min(0.63, (0.35 + elapsedWholeMinutes() * 0.12) * 0.7);
}

function maybeSpawnIncident() {
  if (!game.started || game.finished || isGameplayPaused()) return;
  const now = Date.now();
  maybeSpawnStudentIncidents(now);
  maybeSpawnTrashEvents(now);
  maybeSpawnWanderEvents(now);
}

function maybeSpawnStudentIncidents(now) {
  if (now < game.nextIncidentAt) return;
  const limit = Math.min(3, currentDifficultyLimit());
  const activeProblemIncidents = game.activeIncidents.filter(incident => incident.kind !== 'trash').length;
  const activeStudentIncidents = game.activeIncidents.filter(incident => incident.kind === 'student').length;
  const freeSlots = Math.max(0, Math.min(limit, 3) - Math.max(activeProblemIncidents, activeStudentIncidents));
  if (freeSlots > 0) {
    const spawnCount = Math.max(1, Math.min(freeSlots, progressBasedSpawnCount()));
    for (let i = 0; i < spawnCount; i++) spawnIncident();
  }
  const latePhase = game.lessonLeft < 90;
  game.nextIncidentAt = now + (latePhase
    ? scaledDelay(2600, 3800, MIN_STUDENT_EVENT_DELAY_MS)
    : scaledDelay(3300, 5200, MIN_STUDENT_EVENT_DELAY_MS));
}

function maybeSpawnTrashEvents(now) {
  if (now < game.nextTrashAt) return;
  const activeTrash = game.activeIncidents.filter(incident => incident.kind === 'trash').length;
  if (activeTrash < trashLimit() && Math.random() < trashSpawnChance()) {
    spawnTrashIncident();
  }
  game.nextTrashAt = now + scaledDelay(6000, 10300, MIN_TRASH_EVENT_DELAY_MS);
}


function wanderLimit() {
  return elapsedWholeMinutes() >= 3 ? 2 : 1;
}

function maybeSpawnWanderEvents(now) {
  if (now < game.nextWanderAt) return;
  const activeProblems = game.activeIncidents.filter(incident => incident.kind !== 'trash').length;
  const activeWander = game.activeIncidents.filter(incident => incident.kind === 'wander').length;
  if (activeProblems < 3 && activeWander < wanderLimit()) {
    spawnWanderIncident();
  }
  game.nextWanderAt = now + WANDER_EVENT_INTERVAL_MS;
}

function progressBasedSpawnCount() {
  const limit = currentDifficultyLimit();
  const minute = elapsedWholeMinutes();
  if (limit === 3 && Math.random() < Math.min(0.85, 0.45 + minute * 0.08)) return 3;
  if (limit >= 2 && Math.random() < Math.min(0.82, 0.55 + minute * 0.07)) return 2;
  return 1;
}

function spawnIncident() {
  const candidate = pickIncidentCandidate();
  if (!candidate) return false;
  const id = `incident-${++game.eventSeq}`;
  const incident = {
    id,
    kind: 'student',
    student: candidate.student,
    desk: candidate.desk,
    scenario: candidate.scenario,
    createdAt: Date.now(),
    deadline: Date.now() + INCIDENT_REACTION_MS,
    handled: false,
    escalation: buildEscalationMessage(candidate.student, candidate.scenario)
  };
  game.activeIncidents.push(incident);
  playAlertAudio();
  logEvent(`${candidate.student.name} zeigt ein Warnsignal. Du hast 7 Sekunden, um die Lehrkraft in die Nähe zu bewegen.`, 'warn');
  renderBranchGame();
  renderIncidents();
  return true;
}


function teacherRadiusCells() {
  const positions = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const row = game.teacher.row + dr;
      const col = game.teacher.col + dc;
      if (insideLocal(row, col)) positions.push({ row, col });
    }
  }
  return positions;
}

function isDeskWithinTeacherRadius(desk) {
  return Boolean(desk) && Math.max(Math.abs(desk.row - game.teacher.row), Math.abs(desk.col - game.teacher.col)) <= 1;
}

function isCellNearTeacher(row, col) {
  return manhattan({ row, col }, game.teacher) <= 1;
}

function pickTrashCandidate() {
  const seatedStudents = context.students
    .map(student => ({ student, desk: context.deskByStudentId[student.id] }))
    .filter(item => item.desk);
  const candidates = [];
  const seen = new Set();
  seatedStudents.forEach(item => {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const row = item.desk.row + dr;
        const col = item.desk.col + dc;
        const key = `${row},${col}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (!insideLocal(row, col)) continue;
        if (context.desks.some(desk => desk.row === row && desk.col === col)) continue;
        if (getBlockedCellLocal(row, col)) continue;
        if (isCellNearTeacher(row, col)) continue;
        if (getObjectAtLocal(row, col)) continue;
        candidates.push({ row, col, nearStudent: item.student, nearDesk: item.desk });
      }
    }
  });
  if (!candidates.length) return null;
  return candidates[randomInt(0, candidates.length - 1)];
}

function spawnTrashIncident() {
  const candidate = pickTrashCandidate();
  if (!candidate) return false;
  const id = `incident-${++game.eventSeq}`;
  const incident = {
    id,
    kind: 'trash',
    label: 'Müll blockiert den Weg',
    student: candidate.nearStudent,
    desk: candidate.nearDesk,
    row: candidate.row,
    col: candidate.col,
    createdAt: Date.now(),
    deadline: null,
    handled: false,
    escalation: 'Der Müll bleibt liegen und blockiert weiter den Laufweg im Raum.'
  };
  game.dynamicTrash.push({ id, type: 'trash', row: candidate.row, col: candidate.col, asset: pickRandomTrashAsset(), removed: false });
  game.activeIncidents.push(incident);
  playAlertAudio();
  logEvent(`Müll taucht nahe bei ${candidate.nearStudent.name} auf. Er blockiert Laufwege zusätzlich zu den Schülerereignissen, bis du ihn in den Mülleimer ziehst.`, 'warn');
  renderBranchGame();
  renderIncidents();
  return true;
}


function isStudentAway(studentId) {
  const position = game.studentPositions?.[studentId];
  return Boolean(position && position.state !== 'seated');
}

function hasActiveStudentIncident(studentId) {
  return game.activeIncidents.some(incident => incident.student?.id === studentId && incident.kind !== 'trash');
}

function isStudentUnavailable(studentId) {
  return isStudentAway(studentId) || hasActiveStudentIncident(studentId);
}

function pickWanderReason(targetType, student) {
  const targetLabel = targetType === 'door' ? 'zur Tür' : targetType === 'sink' ? 'zum Waschbecken' : 'zum Schrank';
  const pools = {
    door: [
      { hasGoodReason: true, subtype: 'toilet', title: 'Dringender Gang zur Toilette', scene: `${student.name} steht auf und geht zur Tür. Auf Nachfrage wird klar: Der Toilettengang ist dringend und soll kurz geregelt werden.`, targetLabel },
      { hasGoodReason: false, subtype: 'avoidance', title: 'Ausweichen zur Tür', scene: `${student.name} geht ohne Auftrag zur Tür. Es wirkt eher wie ein Ausstieg aus der Arbeitsphase als wie ein dringender Grund.`, targetLabel }
    ],
    sink: [
      { hasGoodReason: true, subtype: 'wash', title: 'Kurzer Weg zum Waschbecken', scene: `${student.name} geht zum Waschbecken. Der Grund ist nachvollziehbar: Die Hände oder das Material müssen kurz gereinigt werden.`, targetLabel },
      { hasGoodReason: false, subtype: 'avoidance', title: 'Unklarer Weg zum Waschbecken', scene: `${student.name} steht auf und geht zum Waschbecken, ohne vorher zu fragen. Andere schauen schon, ob das erlaubt ist.`, targetLabel }
    ],
    cabinet: [
      { hasGoodReason: true, subtype: 'material', title: 'Material am Schrank', scene: `${student.name} geht zum Schrank. Es fehlt tatsächlich Material, das für die Weiterarbeit gebraucht wird.`, targetLabel },
      { hasGoodReason: false, subtype: 'avoidance', title: 'Gang zum Schrank ohne Auftrag', scene: `${student.name} geht zum Schrank, obwohl kein Materialauftrag besteht. Die Bewegung lenkt die Klasse vom Arbeiten ab.`, targetLabel }
    ]
  };
  const options = pools[targetType] || pools.cabinet;
  return options[randomInt(0, options.length - 1)];
}



function buildWanderScenario(student, targetType, reason) {
  const targetLabel = reason.targetLabel;
  const isToilet = reason.subtype === 'toilet';
  const allowFeedback = isToilet
    ? `Kooperative Verhaltensmodifikation: Der berechtigte Anlass wird leise geklärt; die Rückkehrregel hält Bedürfnis und Klassenregel zusammen.`
    : `Kooperative Verhaltensmodifikation: Der nachvollziehbare Grund wird geprüft und mit einer klaren Rückkehrregel verbunden.`;
  const returnFeedback = 'Die Bewegung endet, aber kooperative Diagnose und Bedürfnisprüfung bleiben unvollständig.';
  const badFeedback = 'Die Situation wird öffentlich; die Regel bekommt Bühne statt ruhiger Klärung.';

  if (reason.hasGoodReason) {
    return {
      id: `wander-${targetType}-${reason.subtype}-${student.id}-${Date.now()}`,
      type: 'Kooperative Verhaltensmodifikation',
      title: reason.title,
      scene: reason.scene,
      focus: [student.name, targetLabel],
      wanderScenario: true,
      wanderMeta: { targetType, hasGoodReason: true, subtype: reason.subtype },
      answers: [
        { delta: 1, action: 'allow-target-return', text: `Ich frage leise nach dem Grund und erlaube den Weg mit Rückkehrregel.`, feedback: allowFeedback },
        { delta: 0, action: 'return-seat', text: `Ich gebe ein Rückkehrsignal und kläre den Grund später.`, feedback: returnFeedback },
        { delta: -1, action: 'return-seat', text: `Ich kommentiere den Gang laut vor der Klasse.`, feedback: badFeedback }
      ]
    };
  }

  return {
    id: `wander-${targetType}-${reason.subtype}-${student.id}-${Date.now()}`,
    type: 'Classroom Management',
    title: reason.title,
    scene: reason.scene,
    focus: [student.name, targetLabel],
    wanderScenario: true,
    wanderMeta: { targetType, hasGoodReason: false, subtype: reason.subtype },
    answers: [
      { delta: 1, action: 'return-seat', text: `Ich frage kurz nach und verweise auf die Platz-Regel; danach geht ${student.name} zurück.`, feedback: 'Classroom Management: Die Regel wird kurz geklärt und der Unterrichtsfluss bleibt erhalten.' },
      { delta: 0, action: 'return-seat', text: `Ich schicke ${student.name} mit einem kurzen Zeichen zurück.`, feedback: 'Das stoppt die Bewegung, lässt aber Regel und Ersatzverhalten unklar.' },
      { delta: -1, action: 'allow-target-return', text: `Ich lasse ${student.name} weitergehen, damit der Unterricht nicht stockt.`, feedback: 'Die Platz-Regel wird übergangen; andere sehen ein unkontrolliertes Ausweichmodell.' }
    ]
  };
}


function targetTypes() {
  return ['cabinet', 'sink', 'door'];
}

function isWalkableForStudent(row, col, studentId = null) {
  if (!insideLocal(row, col)) return false;
  if (getBlockedCellLocal(row, col)) return false;
  if (context.desks.some(desk => desk.row === row && desk.col === col)) return false;
  const object = getObjectAtLocal(row, col);
  if (object) return false;
  if (game.teacher.row === row && game.teacher.col === col) return false;
  return !Object.entries(game.studentPositions || {}).some(([id, pos]) => id !== studentId && pos.state !== 'hidden' && pos.row === row && pos.col === col);
}

function targetCellsForType(type) {
  const targets = (context.stepData?.blockedCells || []).filter(cell => cell.type === type);
  const candidates = [];
  const seen = new Set();
  targets.forEach(target => {
    neighbors(target).forEach(nb => {
      const key = `${nb.row},${nb.col}`;
      if (seen.has(key)) return;
      seen.add(key);
      if (isWalkableForStudent(nb.row, nb.col)) candidates.push({ ...nb, targetType: type });
    });
  });
  return candidates;
}

function findStudentPath(start, target, studentId) {
  return findPathWithWalkable(start, target, (row, col) => isWalkableForStudent(row, col, studentId));
}

function spawnWanderIncident() {
  const candidates = [];
  const reserved = currentApproachCueKeys();
  const shuffledStudents = shuffle(context.students
    .map(student => ({ student, desk: context.deskByStudentId[student.id] }))
    .filter(item => item.desk)
    .filter(item => !isStudentUnavailable(item.student.id))
    .filter(item => !isDeskWithinTeacherRadius(item.desk)));

  shuffledStudents.forEach(item => {
    shuffle(targetTypes()).forEach(type => {
      const cols = context.stepData?.cols || 10;
      if (type === 'door' && item.desk.col >= Math.floor(cols / 2)) return;
      const targetCells = shuffle(targetCellsForType(type));
      const target = targetCells.find(cell => findStudentPath(item.desk, cell, item.student.id).length > 0);
      if (!target) return;
      const path = findStudentPath(item.desk, target, item.student.id);
      if (!path.length) return;
      candidates.push({ ...item, targetType: type, target, path });
    });
  });

  if (!candidates.length) return false;
  const candidate = shuffle(candidates)[0];
  if (!candidate) return false;
  const reason = pickWanderReason(candidate.targetType, candidate.student);
  const id = `incident-${++game.eventSeq}`;
  const incident = {
    id,
    kind: 'wander',
    student: candidate.student,
    desk: candidate.desk,
    row: candidate.desk.row,
    col: candidate.desk.col,
    targetType: candidate.targetType,
    target: candidate.target,
    path: candidate.path,
    scenario: buildWanderScenario(candidate.student, candidate.targetType, reason),
    createdAt: Date.now(),
    deadline: null,
    handled: false,
    reachedTarget: false,
    escalation: `${candidate.student.name} erreicht ${reason.targetLabel}, ohne dass die Lehrkraft die Situation klärt. Die Regel zum Verlassen des Platzes bleibt unklar.`
  };
  game.activeIncidents.push(incident);
  startStudentMovement(incident, candidate.path, () => handleWanderTargetReached(incident));
  playAlertAudio();
  logEvent(`${candidate.student.name} verlässt den Platz und geht ${reason.targetLabel}.`, 'warn');
  renderBranchGame();
  renderIncidents();
  return true;
}

function pickIncidentCandidate() {
  const seatedStudents = context.students
    .map(student => ({ student, desk: context.deskByStudentId[student.id] }))
    .filter(item => item.desk)
    .filter(item => !isStudentUnavailable(item.student.id));
  if (!seatedStudents.length) return null;

  const outsideRadius = seatedStudents.filter(item => !isDeskWithinTeacherRadius(item.desk));
  const eligible = outsideRadius.length ? outsideRadius : seatedStudents;
  const weighted = [];
  eligible.forEach(item => {
    const weight = (item.student.hidden?.risk || 1) + (item.student.hidden?.needsMonitoring ? 2 : 0) + (item.student.hidden?.stabilizer ? 0 : 1);
    for (let i = 0; i < weight; i++) weighted.push(item);
  });

  const reserved = currentApproachCueKeys();
  const pool = shuffle(weighted.length ? weighted : eligible);
  const chosen = pool.find(item => hasAvailableApproachCue({ kind: 'student', student: item.student, desk: item.desk }, reserved));
  if (!chosen) return null;
  return { ...chosen, scenario: pickScenarioForStudent(chosen.student) };
}


function isScenarioBlockedBySelectedRule(scenarioItem) {
  const text = `${scenarioItem?.title || ''} ${scenarioItem?.scene || ''} ${(scenarioItem?.focus || []).join(' ')}`.toLowerCase();
  if ((text.includes('handy') || text.includes('niklas')) && hasAnyRule(['phone-away', 'handy'])) return true;
  if ((text.includes('zwischenruf') || text.includes('tom') || text.includes('melden')) && hasAnyRule(['raise-hand', 'melden', 'meldenplus'])) return true;
  if ((text.includes('ben') || text.includes('grenze') || text.includes('austesten')) && hasAnyRule(['first-instruction'])) return true;
  if ((text.includes('petra') || text.includes('ablenkung') || text.includes('nachbartisch')) && hasAnyRule(['focus-neighbours', 'pausen'])) return true;
  if ((text.includes('lina') || text.includes('spott') || text.includes('respekt')) && hasAnyRule(['respect-no-mock', 'respekt', 'kommentar'])) return true;
  if ((text.includes('wechsel') || text.includes('übergang')) && hasAnyRule(['transition-signal', 'wechsel'])) return true;
  if ((text.includes('material') || text.includes('schrank')) && hasAnyRule(['walkway', 'material'])) return true;
  return false;
}

function weightedScenarioPick(pool) {
  const weighted = [];
  pool.forEach(item => {
    const suppressed = isScenarioBlockedBySelectedRule(item);
    const weight = suppressed ? 1 : 4;
    for (let i = 0; i < weight; i++) weighted.push(item);
  });
  return weighted[randomInt(0, weighted.length - 1)] || pool[0];
}

function pickScenarioForStudent(student) {
  const nameMatches = SCENARIOS.filter(item => item.scene.includes(student.name) || item.title.includes(student.name) || (item.focus || []).includes(student.name));
  const matched = nameMatches.length ? nameMatches : SCENARIOS.filter(item => item.matched);
  const pool = matched.length ? matched : SCENARIOS;
  const unused = pool.filter(item => !game.usedScenarioIds.has(item.id));
  const activePool = unused.length ? unused : pool;
  const scenarioItem = weightedScenarioPick(activePool);
  game.usedScenarioIds.add(scenarioItem.id);
  if (game.usedScenarioIds.size > 30) game.usedScenarioIds.clear();
  return scenarioItem;
}



function buildEscalationMessage(student, scenarioItem) {
  const name = student?.name || 'Die betroffene Person';
  const lower = `${scenarioItem?.title || ''} ${scenarioItem?.scene || ''}`.toLowerCase();
  if (lower.includes('handy')) return `${name} nutzt den Moment weiter aus; weitere Schüler*innen schauen zum Handybereich und die Arbeitsruhe kippt kurz.`;
  if (lower.includes('streit') || lower.includes('einander') || lower.includes('konflikt')) return `${name} zieht andere in die Spannung hinein; aus dem leisen Kommentar wird ein sichtbarer Konflikt am Tisch.`;
  if (lower.includes('müll')) return `Der Störreiz bleibt liegen; mehrere Blicke wandern weg von der Aufgabe und die Gruppe verliert Arbeitszeit.`;
  if (lower.includes('regel')) return `Die Regel bleibt in diesem Moment unklar; mehrere Schüler*innen testen, ob sie gerade wirklich gilt.`;
  return `${name} bekommt zu lange keine Unterstützung; die Unruhe breitet sich am Tisch aus und kostet Unterrichtsstabilität.`;
}

function checkIncidentTimeouts() {
  if (!game.activeIncidents.length || isGameplayPaused()) return;
  const now = Date.now();
  const expired = game.activeIncidents.filter(incident => incident.kind === 'student' && incident.deadline && now >= incident.deadline);
  expired.forEach(incident => failIncidentLate(incident));
}

function failIncidentLate(incident) {
  removeIncident(incident.id);
  if (incident.kind === 'trash') {
    removeDynamicTrash(incident.id);
    addHighscoreEvent(0, 'Müll nicht rechtzeitig entfernt, keine Reaktionspunkte.', 'neutral');
  } else if (incident.kind === 'wander') {
    stopStudentMovement(incident.student.id);
    addHighscoreEvent(-500, `${incident.student.name}: erreicht das Ziel ohne Klärung.`, 'bad');
  } else {
    addHighscoreEvent(0, `${incident.student.name}: zu spät erreicht, keine Reaktionspunkte.`, 'neutral');
  }
  changeScore(-1);
  playBadAudio();
  logEvent(incident.escalation, 'bad');
  renderBranchGame();
  renderIncidents();
}

function removeIncident(id) {
  game.activeIncidents = game.activeIncidents.filter(incident => incident.id !== id);
}

function removeDynamicTrash(id) {
  game.dynamicTrash = (game.dynamicTrash || []).filter(item => item.id !== id);
}


function startStudentMovement(incident, path, onArrive) {
  const studentId = incident.student.id;
  stopStudentMovement(studentId);
  const queue = [...path];
  const step = () => {
    if (game.finished) return;
    if (isGameplayPaused()) {
      game.studentMoveTimers[studentId] = window.setTimeout(step, 500);
      return;
    }
    if (!queue.length) {
      stopStudentMovement(studentId);
      if (typeof onArrive === 'function') onArrive();
      renderBranchGame();
      return;
    }
    const next = queue.shift();
    game.studentPositions[studentId] = { row: next.row, col: next.col, state: 'moving', incidentId: incident.id, targetType: incident.targetType };
    renderBranchGame();
    game.studentMoveTimers[studentId] = window.setTimeout(step, STUDENT_STEP_MS);
  };
  const startPosition = incident.start || incident.desk;
  game.studentPositions[studentId] = { row: startPosition.row, col: startPosition.col, state: 'moving', incidentId: incident.id, targetType: incident.targetType };
  game.studentMoveTimers[studentId] = window.setTimeout(step, STUDENT_STEP_MS);
}

function stopStudentMovement(studentId) {
  const timer = game.studentMoveTimers?.[studentId];
  if (timer) window.clearTimeout(timer);
  if (game.studentMoveTimers) delete game.studentMoveTimers[studentId];
}

function clearAllStudentMovement() {
  Object.keys(game.studentMoveTimers || {}).forEach(stopStudentMovement);
  game.studentMoveTimers = {};
}

function moveStudentToSeat(studentId) {
  const desk = context.deskByStudentId[studentId];
  if (!desk) {
    delete game.studentPositions[studentId];
    renderBranchGame();
    return;
  }
  const current = game.studentPositions[studentId];
  if (!current || current.state === 'hidden') {
    delete game.studentPositions[studentId];
    renderBranchGame();
    return;
  }
  const path = findStudentPath({ row: current.row, col: current.col }, desk, studentId);
  const pseudo = { id: `return-${studentId}-${Date.now()}`, student: context.studentById[studentId], desk, start: { row: current.row, col: current.col }, targetType: 'seat' };
  if (!path.length) {
    delete game.studentPositions[studentId];
    renderBranchGame();
    return;
  }
  startStudentMovement(pseudo, path, () => {
    delete game.studentPositions[studentId];
    renderBranchGame();
  });
}

function moveStudentToTargetThenReturn(incident) {
  const studentId = incident.student.id;
  const current = game.studentPositions[studentId] || { row: incident.desk.row, col: incident.desk.col };
  const pathToTarget = findStudentPath(current, incident.target, studentId);
  const afterTarget = () => {
    if (incident.scenario?.wanderMeta?.subtype === 'toilet' && incident.targetType === 'door') {
      game.studentPositions[studentId] = { row: incident.target.row, col: incident.target.col, state: 'hidden', incidentId: incident.id, targetType: incident.targetType };
      renderBranchGame();
      const returnAfterToilet = () => {
        if (game.finished) return;
        if (isGameplayPaused()) {
          window.setTimeout(returnAfterToilet, 500);
          return;
        }
        game.studentPositions[studentId] = { row: incident.target.row, col: incident.target.col, state: 'moving', incidentId: incident.id, targetType: incident.targetType };
        moveStudentToSeat(studentId);
      };
      window.setTimeout(returnAfterToilet, 10000);
      return;
    }
    if (incident.targetType === 'sink' || incident.targetType === 'cabinet') {
      game.studentPositions[studentId] = { row: incident.target.row, col: incident.target.col, state: 'at-target', incidentId: incident.id, targetType: incident.targetType };
      renderBranchGame();
      const returnAfterTargetWait = () => {
        if (game.finished) return;
        if (isGameplayPaused()) {
          window.setTimeout(returnAfterTargetWait, 500);
          return;
        }
        moveStudentToSeat(studentId);
      };
      window.setTimeout(returnAfterTargetWait, 5000);
      return;
    }
    moveStudentToSeat(studentId);
  };
  if (!pathToTarget.length) {
    afterTarget();
    return;
  }
  startStudentMovement({ ...incident, start: { row: current.row, col: current.col } }, pathToTarget, afterTarget);
}



function handleWanderTargetReached(incident) {
  const active = game.activeIncidents.find(item => item.id === incident.id);
  if (!active || game.finished) return;
  active.reachedTarget = true;
  active.deadline = null;
  game.studentPositions[active.student.id] = { row: active.target.row, col: active.target.col, state: active.targetType === 'door' && active.scenario?.wanderMeta?.subtype === 'toilet' ? 'hidden' : 'at-target', incidentId: active.id, targetType: active.targetType };
  renderBranchGame();
  renderIncidents();

  const failAndReturn = () => {
    const stillActive = game.activeIncidents.find(item => item.id === active.id);
    if (!stillActive || game.finished) return;
    if (isGameplayPaused()) {
      window.setTimeout(failAndReturn, 500);
      return;
    }
    removeIncident(stillActive.id);
    addHighscoreEvent(-500, `${stillActive.student.name}: Rückweg ohne Klärung.`, 'bad');
    const ended = changeScore(-1);
    playBadAudio();
    logEvent(`${stillActive.student.name} hat das Ziel erreicht und befindet sich nun auf dem Rückweg, ohne dass die Lehrkraft nachgefragt oder eine Regel geklärt hat. Das kostet 1 Stabilität und 500 Punkte.`, 'bad');
    if (stillActive.targetType === 'door' && stillActive.scenario?.wanderMeta?.subtype === 'toilet') {
      game.studentPositions[stillActive.student.id] = { row: stillActive.target.row, col: stillActive.target.col, state: 'moving', incidentId: stillActive.id, targetType: stillActive.targetType };
    }
    moveStudentToSeat(stillActive.student.id);
    if (!ended) {
      renderBranchGame();
      renderIncidents();
    }
  };

  const waitMs = active.targetType === 'door' && active.scenario?.wanderMeta?.subtype === 'toilet' ? 10000 : 5000;
  window.setTimeout(failAndReturn, waitMs);
}



function resolveWanderAfterModal() {
  const pending = game.pendingWanderResolution;
  if (!pending) return;
  game.pendingWanderResolution = null;
  const { incident, answer } = pending;
  if (!incident?.student) return;
  removeIncident(incident.id);
  if (answer.action === 'allow-target-return') {
    moveStudentToTargetThenReturn(incident);
  } else {
    moveStudentToSeat(incident.student.id);
  }
}


function incidentPosition(incident) {
  if (!incident) return null;
  if (incident.kind === 'wander') {
    const pos = game.studentPositions?.[incident.student.id];
    if (pos && pos.state !== 'hidden') return { row: pos.row, col: pos.col };
    return incident.desk || null;
  }
  if (incident.kind === 'student') return incident.desk || null;
  return null;
}

function approachCellsForIncident(incident) {
  const pos = incidentPosition(incident);
  if (!pos) return [];
  const candidates = neighbors(pos)
    .filter(cell => isWalkable(cell.row, cell.col));
  candidates.sort((a, b) => {
    const teacherDiff = manhattan(game.teacher, a) - manhattan(game.teacher, b);
    if (teacherDiff !== 0) return teacherDiff;
    return a.row - b.row || a.col - b.col;
  });
  return candidates.map(cell => {
    let arrow = '➜';
    if (cell.row < pos.row) arrow = '↓';
    else if (cell.row > pos.row) arrow = '↑';
    else if (cell.col < pos.col) arrow = '→';
    else if (cell.col > pos.col) arrow = '←';
    return { ...cell, arrow, studentName: incident.student?.name || 'Schüler*in', incidentId: incident.id || null };
  });
}

function bestApproachCellForIncident(incident, reservedKeys = new Set()) {
  return approachCellsForIncident(incident).find(cell => !reservedKeys.has(`${cell.row},${cell.col}`)) || null;
}

function buildApproachCueMap(incidents = game.activeIncidents) {
  const map = new Map();
  const reservedKeys = new Set();
  incidents
    .filter(incident => incident.kind === 'student')
    .forEach(incident => {
      const cue = bestApproachCellForIncident(incident, reservedKeys);
      if (!cue) return;
      const key = `${cue.row},${cue.col}`;
      reservedKeys.add(key);
      map.set(key, cue);
    });
  return map;
}

function currentApproachCueKeys() {
  return new Set(buildApproachCueMap().keys());
}

function hasAvailableApproachCue(incident, reservedKeys = currentApproachCueKeys()) {
  return Boolean(bestApproachCellForIncident(incident, reservedKeys));
}

function renderBranchGame() {
  if (!branchGrid) return;
  const rows = context.stepData?.rows || 9;
  const cols = context.stepData?.cols || 10;
  branchGrid.style.setProperty('--branch-cols', cols);
  branchGrid.style.setProperty('--branch-rows', rows);
  branchGrid.innerHTML = '';
  const blockedGroups = buildBlockedGroups(context.stepData?.blockedCells || []);
  const activeByStudent = new Map(game.activeIncidents.filter(incident => incident.kind === 'student' && incident.student).map(incident => [incident.student.id, incident]));
  const activeWanderByStudent = new Map(game.activeIncidents.filter(incident => incident.kind === 'wander' && incident.student).map(incident => [incident.student.id, incident]));
  const movingStudentByCell = new Map(Object.entries(game.studentPositions || {}).filter(([, pos]) => pos && pos.state !== 'hidden').map(([studentId, pos]) => [`${pos.row},${pos.col}`, { studentId, ...pos }]));
  const activeTrashByCell = new Map(game.activeIncidents.filter(incident => incident.kind === 'trash').map(incident => [`${incident.row},${incident.col}`, incident]));
  const approachCueByCell = buildApproachCueMap();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'branch-cell';
      cell.dataset.row = row;
      cell.dataset.col = col;

      const blocked = getBlockedCellLocal(row, col);
      if (blocked) {
        const group = getBlockedGroupAtLocal(blockedGroups, row, col);
        cell.classList.add('branch-blocked', `branch-blocked-${blocked.type}`);
        if (group) cell.classList.add(...getJoinClasses(group, row, col));
        if (group && group.minRow === row && group.minCol === col) {
          const marker = document.createElement('span');
          marker.className = `branch-block-label branch-${group.type}`;
          marker.style.setProperty('--span-cols', String(group.colSpan));
          marker.style.setProperty('--span-rows', String(group.rowSpan));
          marker.innerHTML = formatRoomLabel(group);
          cell.appendChild(marker);
        }
        cell.disabled = true;
      }

      const desk = context.desks.find(item => item.row === row && item.col === col);
      if (desk) {
        const studentId = context.assignments?.[desk.id];
        const student = studentId ? context.studentById[studentId] : null;
        const away = student ? isStudentAway(student.id) : false;
        const activeIncident = student && !away ? activeByStudent.get(student.id) : null;
        const deskEl = document.createElement('div');
        deskEl.className = `branch-desk${activeIncident ? ' incident-pulse' : ''}${student && !away ? ' has-student' : ''}${away ? ' student-away' : ''}`;
        if (student && !away) {
          deskEl.innerHTML = `${studentAvatarMarkup(student, 'branch-student-avatar', ' am Tisch')}${activeIncident ? `<strong class="incident-countdown-number">${Math.max(0, Math.ceil((activeIncident.deadline - Date.now()) / 1000))}</strong>` : '<strong class="sr-only">'+ escapeHtml(student.name) +'</strong>'}`;
        } else {
          deskEl.innerHTML = `<strong class="sr-only">Platz frei</strong>`;
        }
        if (activeIncident) {
          const left = Math.max(0, Math.ceil((activeIncident.deadline - Date.now()) / 1000));
          cell.setAttribute('aria-label', `${student.name}: Störung, noch ${left} Sekunden`);
        }
        cell.appendChild(deskEl);
        if (student && !away) cell.dataset.studentId = student.id;
      }

      const object = getObjectAtLocal(row, col);
      if (object) {
        const obj = document.createElement('span');
        obj.addEventListener('pointerdown', event => event.stopPropagation());
        const trashIncident = object.type === 'trash' ? activeTrashByCell.get(`${row},${col}`) : null;
        obj.className = `branch-object branch-object-${object.type}${trashIncident ? ' is-blocking' : ''}`;
        if (object.type === 'bin') {
          obj.innerHTML = '<span class="branch-object-icon" aria-hidden="true">🗑️</span>';
          obj.title = 'Mülleimer: Ziehe Müll hier hinein.';
          obj.addEventListener('dragover', event => {
            const type = event.dataTransfer?.getData('type');
            const objectId = event.dataTransfer?.getData('objectId') || liveTrashDragState.objectId;
            if ((type && type !== 'trash') || !objectId) return;
            event.preventDefault();
            event.stopPropagation();
            if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
            obj.classList.add('trash-drop-ready');
          });
          obj.addEventListener('dragleave', () => obj.classList.remove('trash-drop-ready'));
          obj.addEventListener('drop', event => {
            const type = event.dataTransfer?.getData('type');
            const objectId = event.dataTransfer?.getData('objectId') || liveTrashDragState.objectId;
            if ((type && type !== 'trash') || !objectId) return;
            event.preventDefault();
            event.stopPropagation();
            obj.classList.remove('trash-drop-ready');
            const target = (game.dynamicTrash || []).find(item => item.id === objectId && !item.removed)
              || (context.stepData?.objects?.trash || []).find(item => item.id === objectId && !item.removed);
            liveTrashDragState.objectId = null;
            if (!target) return;
            clearTrashIncidentAt(target.row, target.col);
          });
        } else {
          obj.draggable = true;
          obj.innerHTML = trashImageMarkup(object, 'trash-visual-img branch-trash-img', 'Müll im Klassenraum');
          obj.title = 'Ziehe dieses Müllbild in den Mülleimer unten rechts.';
          obj.addEventListener('dragstart', event => {
            event.stopPropagation();
            liveTrashDragState.objectId = object.id;
            if (event.dataTransfer) {
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('type', 'trash');
              event.dataTransfer.setData('objectId', object.id);
            }
            obj.classList.add('dragging-trash');
          });
          obj.addEventListener('dragend', () => {
            obj.classList.remove('dragging-trash');
            liveTrashDragState.objectId = null;
          });
        }
        cell.appendChild(obj);
      }

      const movingStudent = movingStudentByCell.get(`${row},${col}`);
      if (movingStudent) {
        const movingStudentData = context.studentById[movingStudent.studentId];
        const wanderIncident = activeWanderByStudent.get(movingStudent.studentId);
        const el = document.createElement('div');
        el.className = `branch-moving-student${wanderIncident ? ' wander-active' : ''}`;
        el.innerHTML = `${studentAvatarMarkup(movingStudentData, 'branch-moving-student-avatar', ' unterwegs')}`;
        if (wanderIncident) el.title = `${movingStudentData.name} ist auf dem Weg ${wanderIncident.scenario?.focus?.[1] || 'zu einem Ziel'}`;
        cell.appendChild(el);
      }

      const approachCue = approachCueByCell.get(`${row},${col}`);
      if (approachCue) {
        const arrow = document.createElement('span');
        arrow.className = 'branch-approach-arrow';
        arrow.textContent = approachCue.arrow;
        arrow.title = `Lehrkraft hierher führen, um ${approachCue.studentName} zu erreichen.`;
        cell.appendChild(arrow);
      }

      if (game.teacher.row === row && game.teacher.col === col) {
        const teacher = document.createElement('div');
        teacher.className = 'branch-teacher';
        teacher.textContent = 'LK';
        cell.appendChild(teacher);
      }

      cell.addEventListener('pointerdown', event => { event.preventDefault(); handleBranchCellClick(row, col); });
      branchGrid.appendChild(cell);
    }
  }
  renderIncidents();
  renderLife();
  syncPhase3PanelHeights();
}

function handleBranchCellClick(row, col) {
  if (!game.started || game.finished || isGameplayPaused()) return;
  const object = getObjectAtLocal(row, col);
  if (object?.type === 'bin') {
    if (teacherStatus) teacherStatus.textContent = 'Ziehe den Müll in den Mülleimer unten rechts, um das Feld freizuräumen.';
    return;
  }
  if (object?.type === 'trash') {
    if (teacherStatus) teacherStatus.textContent = 'Ziehe dieses Müllbild in den Mülleimer unten rechts.';
    return;
  }

  const target = resolveReachableTarget(row, col);
  if (!target) {
    if (teacherStatus) teacherStatus.textContent = 'Dieses Ziel ist nicht erreichbar. Wähle ein freies Feld oder ein erreichbares Nachbarfeld.';
    return;
  }
  const path = findPath(game.teacher, target);
  if (!path.length) {
    checkArrivalAtIncident();
    if (teacherStatus && !isGameplayPaused()) teacherStatus.textContent = 'Die Lehrkraft steht bereits an diesem erreichbaren Feld.';
    return;
  }
  game.teacherPath = path;
  game.teacherMoveStepIndex = 0;
  if (teacherStatus) teacherStatus.textContent = `Lehrkraft läuft zu Reihe ${target.row + 1}, Feld ${target.col + 1}.`;
  startTeacherMovement();
}


function clearTrashIncidentAt(row, col) {
  const incident = game.activeIncidents.find(item => item.kind === 'trash' && item.row === row && item.col === col);
  if (!incident) {
    const staticTrash = (context.stepData?.objects?.trash || []).find(item => !item.removed && item.row === row && item.col === col);
    if (staticTrash) {
      staticTrash.removed = true;
      if (teacherStatus) teacherStatus.textContent = 'Müll entfernt. Das Feld ist wieder frei.';
    }
  
    renderBranchGame();
    return;
  }
  removeIncident(incident.id);
  removeDynamicTrash(incident.id);

  addHighscoreEvent(0, 'Müll entfernt und Laufweg wieder freigemacht.', 'neutral');
  logEvent(`Der Weg nahe bei ${incident.student?.name || 'einem Tisch'} ist wieder frei.`, 'neutral');
  renderBranchGame();
  renderIncidents();
}

function resolveReachableTarget(row, col) {
  if (isWalkable(row, col)) return { row, col };
  const nearby = neighbors({ row, col }).filter(pos => isWalkable(pos.row, pos.col));
  if (!nearby.length) return null;
  nearby.sort((a, b) => manhattan(game.teacher, a) - manhattan(game.teacher, b));
  return nearby[0];
}

function startTeacherMovement() {
  stopTeacherMovement();
  game.teacherMoveStepIndex = 0;
  queueNextTeacherStep();
}

function queueNextTeacherStep() {
  if (!game.teacherPath.length) {
    stopTeacherMovement();
    checkArrivalAtIncident();
    renderBranchGame();
    return;
  }
  const delay = game.teacherMoveStepIndex === 0 ? TEACHER_FIRST_STEP_MS : TEACHER_STEP_MS;
  game.teacherMoveTimer = window.setTimeout(() => {
    const next = game.teacherPath.shift();
    if (!next) {
      stopTeacherMovement();
      checkArrivalAtIncident();
      renderBranchGame();
      return;
    }
    game.teacherMoveStepIndex += 1;
    game.teacher = { ...game.teacher, ...next };
    renderBranchGame();
    checkArrivalAtIncident();
    if (isGameplayPaused() || !game.started || game.finished) return;
    if (!game.teacherPath.length) {
      stopTeacherMovement();
      checkArrivalAtIncident();
      renderBranchGame();
      return;
    }
    queueNextTeacherStep();
  }, delay);
}

function stopTeacherMovement() {
  if (game.teacherMoveTimer) window.clearTimeout(game.teacherMoveTimer);
  game.teacherMoveTimer = null;
}

function checkArrivalAtIncident() {
  if (!game.activeIncidents.length || isGameplayPaused()) return;
  const reachable = game.activeIncidents.find(incident => {
    if (incident.kind === 'trash') return false;
    const position = incident.kind === 'wander'
      ? (game.studentPositions[incident.student.id] || incident.desk)
      : incident.desk;
    return position && position.state !== 'hidden' && manhattan(game.teacher, position) <= 1;
  });
  if (!reachable) return;
  if (reachable.kind === 'student' && Date.now() > reachable.deadline) {
    failIncidentLate(reachable);
    return;
  }
  const reactionPoints = reactionPointsForIncident(reachable);
  addHighscoreEvent(reactionPoints, `${reachable.student.name}: rechtzeitig erreicht (${reactionPoints} Reaktionspunkte).`, reactionPoints > 0 ? 'good' : 'neutral');
  stopTeacherMovement();
  if (reachable.kind === 'wander') {
    stopStudentMovement(reachable.student.id);
    renderBranchGame();
    renderIncidents();
    openScenarioModal(reachable);
    return;
  }
  removeIncident(reachable.id);
  renderBranchGame();
  renderIncidents();
  if (Math.random() < 0.5) {
    logEvent(`${reachable.student.name} bemerkt die ruhige Präsenz der Lehrkraft und findet ohne weiteres Gespräch zur Aufgabe zurück.`, 'good');
  } else {
    openScenarioModal(reachable);
  }
}

function openScenarioModal(incident) {
  game.currentScenarioIncident = incident;
  game.scenarioOpen = true;
  game.pausedAt = Date.now();
  stopTeacherMovement();
  updateControlButtons();
  const scenarioItem = incident.scenario;
  if (activeMethodLabel) activeMethodLabel.textContent = scenarioItem.type || 'Kooperative Verhaltensmodifikation';
  if (scenarioModalArea) scenarioModalArea.textContent = scenarioItem.type || 'Kooperative Verhaltensmodifikation';
  if (scenarioModalTitle) scenarioModalTitle.textContent = scenarioItem.title;
  if (scenarioModalScene) scenarioModalScene.textContent = polishGerman(scenarioItem.scene);
  if (scenarioResultBox) {
    scenarioResultBox.hidden = true;
    scenarioResultBox.innerHTML = '';
  }
  if (continueScenarioBtn) continueScenarioBtn.hidden = true;
  renderScenarioAnswerButtons(scenarioItem);
  if (scenarioModal) scenarioModal.hidden = false;
  startAnswerCountdown();
}

function renderScenarioAnswerButtons(scenarioItem) {
  if (!scenarioAnswerList) return;
  const answers = prepareAnswerSet(scenarioItem);
  scenarioAnswerList.innerHTML = answers.map((answer, index) => `
    <button type="button" class="branch-answer-btn" data-answer-index="${index}">
      <span>Option ${String.fromCharCode(65 + index)}</span>
      <strong>${escapeHtml(polishGerman(answer.text))}</strong>
    </button>
  `).join('');
  scenarioAnswerList.querySelectorAll('button').forEach((button, index) => {
    button.addEventListener('click', () => chooseScenarioAnswer(answers[index]));
  });
}

function prepareAnswerSet(scenarioItem) {
  return shuffle(scenarioItem.answers.map(answer => ({ ...answer })));
}




function toIchForm(text) {
  let result = String(text || '');
  const replacements = [
    [/^Du wartest\b/i, 'Ich warte'],
    [/^Du gehst\b/i, 'Ich gehe'],
    [/^Du erinnerst\b/i, 'Ich erinnere'],
    [/^Du hältst\b/i, 'Ich halte'],
    [/^Du beschreibst\b/i, 'Ich beschreibe'],
    [/^Du klärst\b/i, 'Ich kläre'],
    [/^Du vereinbarst\b/i, 'Ich vereinbare'],
    [/^Du gibst\b/i, 'Ich gebe'],
    [/^Du nutzt\b/i, 'Ich nutze'],
    [/^Du lässt\b/i, 'Ich lasse'],
    [/^Du stellst\b/i, 'Ich stelle'],
    [/^Du sprichst\b/i, 'Ich spreche'],
    [/^Du fragst\b/i, 'Ich frage'],
    [/^Du lobst\b/i, 'Ich gebe eine kurze positive Rückmeldung'],
    [/^Du greifst\b/i, 'Ich greife'],
    [/^Du bittest\b/i, 'Ich bitte'],
    [/^Du verweist\b/i, 'Ich verweise'],
    [/^Du setzt\b/i, 'Ich setze'],
    [/^Du stoppst\b/i, 'Ich stoppe'],
    [/^Du öffnest\b/i, 'Ich öffne'],
    [/^Du formulierst\b/i, 'Ich formuliere'],
    [/^Du bestätigst\b/i, 'Ich bestätige'],
    [/^Du nimmst\b/i, 'Ich nehme'],
    [/^Du sammelst\b/i, 'Ich sammle'],
    [/^Du trennst\b/i, 'Ich trenne']
  ];
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(result)) return result.replace(pattern, replacement);
  }
  return result.replace(/^Du\s+/i, 'Ich ');
}

function polishGerman(text) {
  return String(text || '')
    .replace(/Einige Blicke gehen zu\s+/g, 'Einige Blicke wandern zu ')
    .replace(/Ich wartest\b/g, 'Ich warte')
    .replace(/Ich erinnerst\b/g, 'Ich erinnere')
    .replace(/Ich hältst\b/g, 'Ich halte')
    .replace(/Ich beschreibst\b/g, 'Ich beschreibe')
    .replace(/Ich klärst\b/g, 'Ich kläre')
    .replace(/Ich vereinbarst\b/g, 'Ich vereinbare')
    .replace(/Ich gehst\b/g, 'Ich gehe')
    .replace(/Ich gibst\b/g, 'Ich gebe')
    .replace(/Ich nutzt\b/g, 'Ich nutze')
    .replace(/Ich lässt\b/g, 'Ich lasse')
    .replace(/Ich stellst\b/g, 'Ich stelle')
    .replace(/Ich sprichst\b/g, 'Ich spreche')
    .replace(/Ich fragst\b/g, 'Ich frage');
}

function makeLessObviousPositive(scenarioItem, answer) {
  const base = toIchForm(answer.text);
  if (scenarioItem.type === 'Classroom Management' && scenarioItem.focus?.some(item => String(item).includes('Regel'))) return polishGerman(base);
  return polishGerman(base.replace('konkretes', 'kleines, beobachtbares'));
}

function makeNeutralOption(scenarioItem, answer) {
  return polishGerman(toIchForm(answer.text).replace('erst einmal', 'für den Moment').replace('warte ab', 'halte kurz inne und beobachte'));
}

function makePlausibleMisconception(scenarioItem, answer) {
  const text = `${scenarioItem.title} ${scenarioItem.scene}`.toLowerCase();
  if (text.includes('ressource') || text.includes('stabil') || text.includes('hilfe')) return 'Ich gebe der stabileren Person den Auftrag, die Situation am Tisch eigenständig mit zu lösen.';
  if (text.includes('regel') || scenarioItem.type === 'Classroom Management') return 'Ich halte die Klasse kurz an und erkläre die Regel ausführlich, damit sofort allen klar ist, dass sie gilt.';
  if (text.includes('sicht') || text.includes('blind') || text.includes('hinten')) return 'Ich stelle mich demonstrativ in die Nähe und mache deutlich, dass ich diesen Bereich jetzt besonders kontrolliere.';
  if (text.includes('konflikt') || text.includes('einander') || text.includes('streit')) return 'Ich trenne die Beteiligten sofort und bestimme direkt, wer für den Rest der Stunde wo arbeitet.';
  if (text.includes('handy')) return 'Ich sammle das Handy sichtbar ein und nutze den Moment als klares Beispiel für die Klasse.';
  return polishGerman(toIchForm(answer.text).replace('sofort', 'direkt').replace('öffentlich', 'klar sichtbar'));
}

function makeNegativeConsequence(scenarioItem, answer) {
  const text = `${scenarioItem.title} ${scenarioItem.scene}`.toLowerCase();
  if (text.includes('ressource') || text.includes('stabil') || text.includes('hilfe')) return 'Die stabile Person übernimmt zusätzliche Verantwortung, statt selbst positive Rückmeldung zu bekommen; das senkt langfristig Motivation und belastet die Beziehung.';
  if (text.includes('regel') || scenarioItem.type === 'Classroom Management') return 'Die Regel wird zwar erwähnt, aber die lange Unterbrechung macht die Störung größer und nimmt dem Unterricht Tempo.';
  if (text.includes('sicht') || text.includes('blind') || text.includes('hinten')) return 'Die Kontrolle wirkt kurzfristig, aber die betroffene Person erlebt vor allem Überwachung; die Selbststeuerung wird nicht aufgebaut.';
  if (text.includes('konflikt') || text.includes('einander') || text.includes('streit')) return 'Die schnelle Entscheidung verhindert Klärung; die Spannung bleibt bestehen und verlagert sich in die nächste Phase.';
  if (text.includes('handy')) return 'Das Handyproblem wird zur Bühne; mehrere Schüler*innen beobachten die Sanktion statt wieder zu arbeiten.';
  return answer.feedback;
}

function startAnswerCountdown() {
  game.answerLeft = ANSWER_SECONDS;
  updateAnswerTimer();
  playTimerAudio();
  if (game.scenarioCountdown) window.clearInterval(game.scenarioCountdown);
  game.scenarioCountdown = window.setInterval(() => {
    game.answerLeft -= 1;
    updateAnswerTimer();
    if (game.answerLeft <= 0) scenarioAnswerTimeout();
  }, 1000);
}

function updateAnswerTimer() {
  if (answerTimerEl) answerTimerEl.textContent = String(Math.max(0, game.answerLeft));
}

function scenarioAnswerTimeout() {
  clearAnswerCountdown();
  const incident = game.currentScenarioIncident;
  if (!incident) return closeScenarioModal();
  addHighscoreEvent(SCORE_BAD_ANSWER, `${incident.student.name}: Szenario nicht rechtzeitig beantwortet.`, 'bad');
  if (incident.kind === 'wander') game.pendingWanderResolution = { incident, answer: { action: 'return-seat', delta: -1 } };
  const ended = changeScore(-1);
  playBadAudio();
  if (!ended) showScenarioResult(incident.escalation, -1, 'bad');
}

function chooseScenarioAnswer(answer) {
  clearAnswerCountdown();
  const scenarioPoints = answer.delta > 0 ? SCORE_GOOD_ANSWER : answer.delta < 0 ? SCORE_BAD_ANSWER : 0;
  addHighscoreEvent(scenarioPoints, `Szenarioantwort: ${scenarioPoints > 0 ? 'wirksame Intervention' : scenarioPoints < 0 ? 'problematische Intervention' : 'keine Punkteveränderung'}.`, answer.delta > 0 ? 'good' : answer.delta < 0 ? 'bad' : 'neutral');
  const ended = changeScore(answer.delta);
  if (answer.delta > 0) playGoodAudio();
  if (answer.delta < 0) playBadAudio();
  if (game.currentScenarioIncident?.kind === 'wander') {
    game.pendingWanderResolution = { incident: game.currentScenarioIncident, answer };
  }
  if (ended) return;
  const resultType = answer.delta > 0 ? 'good' : answer.delta < 0 ? 'bad' : 'neutral';
  const deltaText = answer.delta > 0 ? '+1 Stabilität' : answer.delta < 0 ? '-1 Stabilität' : 'keine Veränderung';
  showScenarioResult(`${answer.feedback} (${deltaText})`, answer.delta, resultType);
}

function clearAnswerCountdown() {
  if (game.scenarioCountdown) window.clearInterval(game.scenarioCountdown);
  game.scenarioCountdown = null;
  stopTimerAudio();
}

function showScenarioResult(text, delta, type) {
  if (scenarioAnswerList) scenarioAnswerList.innerHTML = '';
  if (scenarioResultBox) {
    scenarioResultBox.hidden = false;
    scenarioResultBox.className = `scenario-result-box ${type}`;
    scenarioResultBox.innerHTML = `<strong>${delta > 0 ? 'Stabilisierung' : delta < 0 ? 'Eskalation' : 'Zwischenstand'}</strong><p>${escapeHtml(text)}</p>`;
  }
  if (continueScenarioBtn) continueScenarioBtn.hidden = game.finished;
  logEvent(text, type);
}

function closeScenarioModal() {
  clearAnswerCountdown();
  if (scenarioModal) scenarioModal.hidden = true;
  applyPausedTimeShift();
  game.pausedAt = null;
  game.scenarioOpen = false;
  game.currentScenarioIncident = null;
  updateControlButtons();
  resolveWanderAfterModal();
  if (!game.finished) {
    const now = Date.now();
    game.nextIncidentAt = now + scaledDelay(3000, 5000, MIN_STUDENT_EVENT_DELAY_MS);
    game.nextTrashAt = Math.max(game.nextTrashAt || 0, now + scaledDelay(3000, 5000, MIN_TRASH_EVENT_DELAY_MS));
    game.nextWanderAt = Math.max(game.nextWanderAt || 0, now + 3000);
  }
  renderBranchGame();
}

function renderIncidents() {
  const currentProblems = game.activeIncidents.filter(incident => incident.kind !== 'trash').slice(0, 3);
  if (incidentCounter) incidentCounter.textContent = String(currentProblems.length);
  const now = Date.now();
  const cards = currentProblems.map(incident => {
    if (incident.kind === 'wander') {
      return `<article class="incident-item event-card"><strong>${escapeHtml(incident.student.name)} ist unterwegs</strong><span>Bitte schnell ansprechen</span><small>${escapeHtml(incident.scenario.title)}</small></article>`;
    }
    const left = Math.max(0, Math.ceil((incident.deadline - now) / 1000));
    return `<article class="incident-item event-card"><strong>${escapeHtml(incident.student.name)} braucht Hilfe</strong><span>${left}s bis Eskalation</span><small>${escapeHtml(incident.scenario.title)}</small></article>`;
  }).join('');
  if (incidentList) {
    incidentList.innerHTML = currentProblems.length ? cards : '<p class="hint">Keine akute Störung.</p>';
  }
  if (branchEventCards) {
    branchEventCards.innerHTML = currentProblems.length ? cards : '<p class="hint">Noch keine Ereigniskarte aktiv.</p>';
  }
  syncPhase3PanelHeights();
}

function renderLife() {
  if (branchScorePill) branchScorePill.textContent = `${game.score}/10`;
  if (branchScoreNote) branchScoreNote.textContent = '';
  updateTeacherMoodImage();
  if (!branchLifeSegments) return;
  branchLifeSegments.classList.toggle('life-low', game.score <= 3);
  branchLifeSegments.classList.toggle('life-mid', game.score > 3 && game.score <= 6);
  branchLifeSegments.classList.toggle('life-high', game.score > 6);
  branchLifeSegments.innerHTML = Array.from({ length: 10 }, (_, index) => `<span class="${index < game.score ? 'filled' : ''}"></span>`).join('');
}

function teacherMoodForScore(score) {
  const lives = Math.max(0, Math.min(10, Math.round(Number(score) || 0)));
  if (lives <= 1) return { file: 'teacher_1.png', label: 'panisch / stark belastet' };
  if (lives === 2) return { file: 'teacher_2.png', label: 'sehr gestresst' };
  if (lives === 3) return { file: 'teacher_3.png', label: 'unsicher' };
  if (lives === 4) return { file: 'teacher_4.png', label: 'leicht verunsichert' };
  if (lives === 5) return { file: 'teacher_5.png', label: 'neutral' };
  if (lives <= 7) return { file: 'teacher_6-7.png', label: 'zufrieden' };
  return { file: 'teacher_8-10.png', label: 'selbstbewusst' };
}

function updateTeacherMoodImage() {
  const mood = teacherMoodForScore(game.score);
  if (teacherMoodImage) {
    const nextSrc = `assets/teachers/${mood.file}`;
    if (!teacherMoodImage.getAttribute('src')?.endsWith(nextSrc)) teacherMoodImage.src = nextSrc;
    teacherMoodImage.alt = `Lehrkraft-Zustand bei ${game.score} von 10 Stabilität: ${mood.label}`;
  }
  if (teacherMoodLabel) teacherMoodLabel.textContent = `${mood.label} · ${game.score}/10`;
}

function reactionPointsForIncident(incident) {
  if (incident.kind === 'wander') {
    const age = Date.now() - incident.createdAt;
    const remaining = Math.max(0, INCIDENT_REACTION_MS - age);
    return Math.max(0, Math.min(7, Math.ceil(remaining / 1000))) * 10;
  }
  const left = Math.max(0, Math.ceil((incident.deadline - Date.now()) / 1000));
  const capped = Math.max(0, Math.min(7, left));
  return capped * 10;
}

function addHighscoreEvent(points, label, type = 'neutral', options = {}) {
  const numeric = Number(points) || 0;
  game.highscoreBase += numeric;
  const event = {
    points: numeric,
    label,
    type,
    finalBonus: Boolean(options.finalBonus),
    time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
  game.scoreEvents.unshift(event);
  game.scoreEvents = game.scoreEvents.slice(0, 3);
  renderHighscore();
}

function renderHighscore() {
  const visibleScore = game.finished ? game.finalHighscore : game.highscoreBase;
  if (currentHighscoreEl) currentHighscoreEl.textContent = String(visibleScore);
  if (highscoreNote) {
    highscoreNote.textContent = game.finished
      ? `Endwert inklusive Stabilitätsbonus: ${visibleScore} Punkte.`
      : '';
  }
  if (scoreEventCounter) scoreEventCounter.textContent = String(game.scoreEvents.length);
  if (scoreEventList) {
    scoreEventList.innerHTML = game.scoreEvents.length
      ? game.scoreEvents.map(event => `
        <article class="score-event-item ${escapeHtml(event.type)}">
          <strong>${event.points > 0 ? '+' : ''}${event.points}</strong>
          <div><span>${escapeHtml(event.label)}</span><small>${escapeHtml(event.time)}</small></div>
        </article>
      `).join('')
      : '<p class="hint">Noch keine Ereignisse.</p>';
  }
}

function showOutcomeModal(result) {
  const won = result === 'won';
  const finalScore = Number.isFinite(game.finalHighscore) ? game.finalHighscore : game.highscoreBase;
  if (outcomeImage) {
    outcomeImage.src = won ? 'assets/outcomes/win.png' : 'assets/outcomes/lose.png';
    outcomeImage.alt = won ? 'Gewonnener Unterrichtsverlauf' : 'Verlorener Unterrichtsverlauf';
  }
  if (outcomeEyebrow) outcomeEyebrow.textContent = won ? 'Unterricht geschafft' : 'Game over';
  if (outcomeTitle) outcomeTitle.textContent = won ? 'Du hast den Unterricht stabil gehalten.' : 'Die Klasse ist gekippt.';
  if (outcomeText) {
    outcomeText.textContent = won
      ? `Die fünf Minuten sind abgelaufen, ohne dass die Unterrichtsstabilität auf 0 gefallen ist. Übrig: ${game.score}/10 Stabilität.`
      : 'Die Unterrichtsstabilität ist auf 0 gefallen. Die Klasse hat die gemeinsame Arbeitsruhe verloren.';
  }
  if (outcomeAdvice) {
    outcomeAdvice.textContent = won
      ? 'Achte im nächsten Durchlauf darauf, frühe Warnsignale schnell anzulaufen und Ressourcen im Sitzplan gezielt zu nutzen, um den Highscore weiter zu verbessern.'
      : 'Achte beim nächsten Mal besonders auf kurze Wege zur Lehrkraft, freie Laufwege, sichtbare Risikoschüler*innen und klare, knappe Interventionen statt langer Unterbrechungen.';
  }
  if (outcomeHighscore) outcomeHighscore.textContent = String(finalScore);
  if (outcomeBreakdown) outcomeBreakdown.textContent = `Interventionen/Reaktionen: ${finalScore - game.lifeBonus} · Stabilitätsbonus: ${game.lifeBonus} (${game.score} × ${SCORE_PER_LIFE})`;
  if (restartOutcomeBtn) restartOutcomeBtn.textContent = won ? 'Nochmal spielen' : 'Neuer Versuch';
  if (outcomeModal) {
    outcomeModal.hidden = false;
    outcomeModal.removeAttribute('hidden');
    outcomeModal.classList.add('is-visible');
    outcomeModal.setAttribute('data-result', won ? 'won' : 'lost');
  }
}

function changeScore(delta) {
  if (game.finished) return true;
  game.score = Math.max(0, Math.min(10, game.score + delta));
  renderLife();
  renderHighscore();
  if (game.score <= 0 && !game.finished) {
    finishLesson('lost');
    return true;
  }
  return false;
}

function logEvent(text, type = 'neutral') {
  if (!branchLog) return;
  const entry = document.createElement('article');
  entry.className = `branch-log-entry ${type}`;
  const time = lessonTimerEl?.textContent || '05:00';
  entry.innerHTML = `<span>${escapeHtml(time)}</span><p>${escapeHtml(text)}</p>`;
  branchLog.prepend(entry);
}

function isWalkable(row, col) {
  if (!insideLocal(row, col)) return false;
  if (getBlockedCellLocal(row, col)) return false;
  if (context.desks.some(desk => desk.row === row && desk.col === col)) return false;
  if (getObjectAtLocal(row, col)) return false;
  return true;
}

function findPathWithWalkable(start, target, walkableFn) {
  const startKey = `${start.row},${start.col}`;
  const targetKey = `${target.row},${target.col}`;
  if (startKey === targetKey) return [];
  const queue = [{ row: start.row, col: start.col }];
  const prev = new Map([[startKey, null]]);
  while (queue.length) {
    const current = queue.shift();
    for (const nb of neighbors(current)) {
      const key = `${nb.row},${nb.col}`;
      if (prev.has(key)) continue;
      const allowed = key === targetKey || walkableFn(nb.row, nb.col);
      if (!allowed) continue;
      prev.set(key, current);
      if (key === targetKey) return reconstructPath(prev, target);
      queue.push(nb);
    }
  }
  return [];
}

function findPath(start, target) {
  const startKey = `${start.row},${start.col}`;
  const targetKey = `${target.row},${target.col}`;
  if (startKey === targetKey) return [];
  const queue = [{ row: start.row, col: start.col }];
  const prev = new Map([[startKey, null]]);
  while (queue.length) {
    const current = queue.shift();
    for (const nb of neighbors(current)) {
      const key = `${nb.row},${nb.col}`;
      if (prev.has(key)) continue;
      const allowed = key === targetKey || isWalkable(nb.row, nb.col);
      if (!allowed) continue;
      prev.set(key, current);
      if (key === targetKey) return reconstructPath(prev, target);
      queue.push(nb);
    }
  }
  return [];
}

function reconstructPath(prev, target) {
  const path = [];
  let cursor = target;
  while (cursor) {
    path.unshift(cursor);
    cursor = prev.get(`${cursor.row},${cursor.col}`);
  }
  path.shift();
  return path;
}

function neighbors(pos) {
  return [
    { row: pos.row - 1, col: pos.col },
    { row: pos.row + 1, col: pos.col },
    { row: pos.row, col: pos.col - 1 },
    { row: pos.row, col: pos.col + 1 }
  ].filter(item => insideLocal(item.row, item.col));
}

function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function insideLocal(row, col) {
  const rows = context.stepData?.rows || 9;
  const cols = context.stepData?.cols || 10;
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function getBlockedCellLocal(row, col) {
  return (context.stepData?.blockedCells || []).find(item => item.row === row && item.col === col) || null;
}

function getObjectAtLocal(row, col) {
  const bin = game.bin || context.stepData?.objects?.bin || context.stepData?.objects?.broom;
  if (bin && bin.row === row && bin.col === col) return { ...bin, type: 'bin' };
  const dynamicTrash = (game.dynamicTrash || []).find(item => !item.removed && item.row === row && item.col === col);
  if (dynamicTrash) return dynamicTrash;
  return (context.stepData?.objects?.trash || []).find(item => !item.removed && item.row === row && item.col === col) || null;
}

function buildBlockedGroups(blocked) {
  const groups = [];
  const visited = new Set();
  blocked.forEach(cell => {
    const key = `${cell.row},${cell.col},${cell.type}`;
    if (visited.has(key)) return;
    const sameRow = blocked.filter(c => c.type === cell.type && c.row === cell.row).sort((a,b) => a.col - b.col);
    const sameCol = blocked.filter(c => c.type === cell.type && c.col === cell.col).sort((a,b) => a.row - b.row);
    const hRun = [cell];
    let c = cell.col - 1;
    while (sameRow.some(x => x.col === c)) { hRun.unshift(sameRow.find(x => x.col === c)); c--; }
    c = cell.col + 1;
    while (sameRow.some(x => x.col === c)) { hRun.push(sameRow.find(x => x.col === c)); c++; }
    const vRun = [cell];
    let r = cell.row - 1;
    while (sameCol.some(x => x.row === r)) { vRun.unshift(sameCol.find(x => x.row === r)); r--; }
    r = cell.row + 1;
    while (sameCol.some(x => x.row === r)) { vRun.push(sameCol.find(x => x.row === r)); r++; }
    const cells = hRun.length >= vRun.length ? hRun : vRun;
    cells.forEach(gc => visited.add(`${gc.row},${gc.col},${gc.type}`));
    const rows = cells.map(gc => gc.row);
    const cols = cells.map(gc => gc.col);
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

function getBlockedGroupAtLocal(groups, row, col) {
  return groups.find(group => group.cells.some(cell => cell.row === row && cell.col === col)) || null;
}

function getJoinClasses(group, row, col) {
  const has = (r, c) => group.cells.some(cell => cell.row === r && cell.col === c);
  const classes = [];
  if (has(row, col - 1)) classes.push('join-left');
  if (has(row, col + 1)) classes.push('join-right');
  if (has(row - 1, col)) classes.push('join-up');
  if (has(row + 1, col)) classes.push('join-down');
  return classes;
}

function formatRoomLabel(group) {
  if (group.type === 'sink') return 'Wasch-<br>becken';
  if (group.type === 'exit') return 'Notaus-<br>gang';
  return group.label || group.type;
}

function unlockAudio() {
  audioState.unlocked = true;
  ['timer', 'alert', 'good', 'bad'].forEach(kind => {
    const audio = getAudio(kind);
    if (!audio) return;
    audio.volume = kind === 'timer' ? 0.35 : 0.55;
  });
}

function audioCandidates(kind) {
  if (kind === 'good') return ['Gut.mp3'];
  if (kind === 'bad') return ['Bad.mp3'];
  if (kind === 'timer') return ['Timer.mp3'];
  if (kind === 'alert') return ['Alert.mp3'];
  return [];
}

function getAudio(kind) {
  if (audioState[kind]) return audioState[kind];
  const src = audioCandidates(kind)[0];
  if (!src) return null;
  const audio = new Audio(src);
  audio.preload = 'auto';
  audioState[kind] = audio;
  return audio;
}

function playOnce(kind) {
  if (!audioState.unlocked) return;
  const audio = getAudio(kind);
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  audio.loop = false;
  audio.play().catch(() => {});
}

function playAlertAudio() { playOnce('alert'); }
function playGoodAudio() { playOnce('good'); }
function playBadAudio() { playOnce('bad'); }

function playTimerAudio() {
  if (!audioState.unlocked) return;
  const audio = getAudio('timer');
  if (!audio) return;
  audio.loop = true;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function stopTimerAudio() {
  const audio = audioState.timer;
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  audio.loop = false;
}

function shuffle(input) {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

init();
