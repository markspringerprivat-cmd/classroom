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
  objects: { trash: [], broom: { id: 'broom-fixed', type: 'broom', row: 8, col: 9 } },
  metrics: {}
};

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
    objects: source.objects && typeof source.objects === 'object'
      ? { trash: Array.isArray(source.objects.trash) ? source.objects.trash : [], broom: source.objects.broom || defaultBranchStep.objects.broom }
      : defaultBranchStep.objects,
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

  const goodRuleAnswer = (student, ids, concrete, followUp = 'Nach der Stunde prüfe ich mit ihm kurz, welche Selbstkontrolle ihm hilft.') => {
    const name = n(student);
    return ruleActive(ids)
      ? `Ich gehe ruhig zu ${name}, benenne kurz, was ich sehe, und erinnere an die vereinbarte Regel: „${ruleLabel(ids)}“ Danach bekommt ${name} einen klaren nächsten Arbeitsschritt. ${followUp}`
      : `Ich gehe ruhig zu ${name}, benenne kurz, was ich sehe, und formuliere eine knappe Sofortvereinbarung: ${concrete} ${followUp}`;
  };

  add('S01', 'Classroom Management', true, 'phoneRisk', 'Handy unter dem Tisch',
    `${n(problem.niklas)} schaut wiederholt unter den Tisch und tippt heimlich. Einige Mitschüler*innen beobachten bereits, ob die Lehrkraft es bemerkt.`,
    [
      plus(goodRuleAnswer(problem.niklas, ['phone-away', 'handy'], 'Das Handy bleibt jetzt weg und die nächste Aufgabe wird begonnen.', 'Wenn es schwerfällt, vereinbare ich nach der Stunde eine konkrete Aufbewahrungslösung.'), 'Die Intervention ist nah, ruhig und regelbezogen. Sie stellt Arbeitsfähigkeit her, ohne die Situation vorzuführen.'),
      zero(`Ich stelle mich kurz in die Nähe von ${n(problem.niklas)} und beobachte, ob das Handy verschwindet.`, 'Präsenz kann kurz helfen, klärt aber weder Regel noch Selbststeuerung.'),
      minus(`Ich nehme das Handy sichtbar an mich und erkläre der Klasse ausführlich, warum so etwas gar nicht geht.`, 'Die Störung wird zur Bühne; die Arbeitsruhe sinkt und die Beziehung wird belastet.')
    ], [n(problem.niklas), 'Handy'], selectedHint(['phone-away', 'handy']));

  add('S02', 'Kooperative Verhaltensmodifikation', true, 'callsOut', 'Zwischenruf im Plenum',
    `${n(problem.tom)} ruft eine Antwort in die Klasse, bevor andere fertig nachdenken können. Dadurch kippt die Aufmerksamkeit vom Arbeitsauftrag weg.`,
    [
      plus(goodRuleAnswer(problem.tom, ['raise-hand', 'melden', 'meldenplus'], 'Erst melden, dann kurz warten, bis du dran bist.', 'Nach der Sequenz gebe ich eine kurze positive Rückmeldung, wenn das Warten gelingt.'), 'Die Regel wird knapp aktiviert und mit einem erreichbaren Ziel verbunden.'),
      zero(`Ich sage nur kurz: „Leiser bitte“, und setze den Unterricht fort.`, 'Die Situation wird nicht größer, aber das konkrete Ersatzverhalten bleibt unklar.'),
      minus(`Ich diskutiere mit ${n(problem.tom)} vor der Klasse, warum er immer dazwischenruft.`, 'Die öffentliche Diskussion verlängert die Störung und verstärkt die Aufmerksamkeit für das Verhalten.')
    ], [n(problem.tom), 'Melden'], selectedHint(['raise-hand', 'melden', 'meldenplus']));

  add('S03', 'Kooperative Verhaltensmodifikation', true, 'boundaryTesting', 'Grenze wird getestet',
    `${n(problem.ben)} grinst, verzögert den Arbeitsbeginn und schaut zur Klasse, ob jemand reagiert. Die Situation ist noch klein, kann aber schnell größer werden.`,
    [
      plus(goodRuleAnswer(problem.ben, ['first-instruction'], 'Du beginnst jetzt mit dem ersten Schritt; ich komme gleich wieder und schaue auf den Start.', 'Bei gelingendem Start bestätige ich ihn kurz und sachlich.'), 'Die Lehrkraft setzt eine klare Grenze und verbindet sie mit unmittelbarer Rückmeldung.'),
      zero(`Ich warte noch einen Moment ab, weil ${n(problem.ben)} vielleicht von selbst anfängt.`, 'Abwarten kann funktionieren, gibt aber unnötig Raum für weiteres Austesten.'),
      minus(`Ich drohe direkt mit einer Strafe, damit ${n(problem.ben)} merkt, dass ich es ernst meine.`, 'Die Drohung verschiebt die Situation in einen Machtkampf.')
    ], [n(problem.ben), 'Grenze'], selectedHint(['first-instruction']));

  add('S04', 'Classroom Management', true, 'distractor', 'Ablenkung am Nachbartisch',
    `${n(problem.petra)} spricht leise mit der Sitznachbarin, obwohl die Arbeitsphase schon begonnen hat. Die Nachbarin lacht und legt den Stift weg.`,
    [
      plus(goodRuleAnswer(problem.petra, ['focus-neighbours', 'pausen'], 'In der Arbeitsphase bleiben Gespräche auf die Aufgabe bezogen.', 'Ich gebe beiden einen kurzen, klaren Arbeitsauftrag für die nächsten zwei Minuten.'), 'Die Intervention schützt die Arbeitsphase und macht das erwartete Verhalten sichtbar.'),
      zero(`Ich stelle mich neben den Tisch, ohne etwas zu sagen.`, 'Präsenz kann kurz beruhigen, ersetzt aber keine klare gemeinsame Orientierung.'),
      minus(`Ich setze ${n(problem.petra)} sofort um, ohne den Grund oder die Regel zu klären.`, 'Das stoppt die Situation vielleicht, bleibt aber wenig kooperativ und erzeugt neue Unruhe.')
    ], [n(problem.petra), 'Ablenkung'], selectedHint(['focus-neighbours', 'pausen']));

  add('S05', 'Kooperative Verhaltensmodifikation', true, 'sensitive', 'Spott nach einem Fehler',
    `${n(problem.lina)} verzieht das Gesicht und sagt kaum noch etwas, nachdem ein Kommentar aus der Nähe kam. Die Stimmung am Tisch wird unsicher.`,
    [
      plus(goodRuleAnswer(problem.lina, ['respect-no-mock', 'respekt', 'kommentar'], 'Fehler werden nicht kommentiert; wir bleiben sachlich und respektvoll.', 'Nach der Stunde kann ich mit den Beteiligten kurz klären, wie Beiträge sicherer werden.'), 'Die Lehrkraft schützt die emotionale Sicherheit und bindet die Regel an ein konkretes Verhalten.'),
      zero(`Ich gehe weiter, damit die Situation nicht noch mehr Aufmerksamkeit bekommt.`, 'Das verhindert Öffentlichkeit, lässt aber die verletzende Dynamik bestehen.'),
      minus(`Ich sage vor allen, dass ${n(problem.lina)} nicht so empfindlich sein soll.`, 'Das verstärkt Beschämung und verschlechtert die Beziehung.')
    ], [n(problem.lina), 'Respekt'], selectedHint(['respect-no-mock', 'respekt', 'kommentar']));

  add('S06', 'Classroom Management', Boolean(ctx.blindRiskStudents.length), 'blindspot', 'Unruhe im toten Winkel',
    `${n(ctx.blindRiskStudents[0] || risk)} nutzt einen Moment, in dem die Lehrkraft den Bereich kaum im Blick hat. Die Arbeitsruhe dort wird sichtbar schwächer.`,
    [
      plus(`Ich bewege mich gezielt in einen erreichbaren Nachbarbereich, gebe ein kurzes Präsenzsignal und formuliere den nächsten Arbeitsschritt direkt an ${n(ctx.blindRiskStudents[0] || risk)}.`, 'Die Reaktion verbindet Raumpräsenz, klare Erwartung und minimale Unterbrechung.'),
      zero(`Ich schaue aus der Entfernung kurz hin und mache weiter.`, 'Das kann kurz reichen, bleibt aber bei schlechter Sicht unsicher.'),
      minus(`Ich rufe quer durch den Raum, dass dort hinten endlich Ruhe sein soll.`, 'Der Ruf macht die Störung größer und ersetzt keine wirksame Präsenz.')
    ], ['Sichtbereich'], 'Das Szenario wird wahrscheinlicher, wenn riskante Schüler außerhalb des Sichtbereichs sitzen.');

  add('S07', 'Classroom Management', Boolean(ctx.weaklyVisibleRiskStudents.length), 'weakVision', 'Halber Blickkontakt reicht nicht',
    `${n(ctx.weaklyVisibleRiskStudents[0] || risk)} arbeitet nur scheinbar mit. Weil die Sichtlinie schwach ist, merkt die Lehrkraft die Abweichung erst spät.`,
    [
      plus(`Ich gehe ruhig näher heran, sichere Blickkontakt und vereinbare eine kleine überprüfbare Teilaufgabe.`, 'Die Lehrkraft nutzt Nähe, ohne zu kontrollierend zu wirken, und macht Erfolg überprüfbar.'),
      zero(`Ich erinnere die ganze Klasse allgemein an konzentriertes Arbeiten.`, 'Die Erinnerung ist nicht falsch, aber zu unspezifisch für das konkrete Verhalten.'),
      minus(`Ich sage laut, dass ich genau gesehen habe, dass nicht gearbeitet wird.`, 'Die Aussage kann als Bloßstellung erlebt werden und erhöht Widerstand.')
    ], ['Sichtbereich']);

  add('S08', 'Classroom Management', Boolean(ctx.backRowRisks.length), 'backRow', 'Hinten entsteht Nebenbeschäftigung',
    `${n(ctx.backRowRisks[0] || risk)} wirkt im hinteren Bereich abgekoppelt. Andere orientieren sich kurz daran statt an der Aufgabe.`,
    [
      plus(`Ich stelle mich so, dass der Bereich wieder im Blick liegt, und gebe eine kurze, sachliche Arbeitsrückmeldung am Platz.`, 'Das ist eine direkte, niedrigschwellige Präventionshandlung.'),
      zero(`Ich ändere erst nach der Stunde die Sitzordnung.`, 'Eine spätere Änderung kann sinnvoll sein, löst die akute Situation aber nicht.'),
      minus(`Ich kündige an, dass der hintere Bereich ab jetzt besonders streng kontrolliert wird.`, 'Das erzeugt Kontrolllogik statt Selbststeuerung.')
    ], ['Sitzordnung']);

  add('S09', 'Classroom Management', Boolean(ctx.metrics?.spacing?.invalidPairs?.length), 'spacing', 'Der Weg ist blockiert',
    `Ein Tischbereich ist so eng gestellt, dass die Lehrkraft nicht schnell genug zu einem auffälligen Schüler gelangt. Die Störung dauert dadurch länger als nötig.`,
    [
      plus(`Ich wähle den erreichbaren Nachbarweg, reagiere kurz und merke mir, die Tischstellung nach der Sequenz zu korrigieren.`, 'Akut wird gehandelt; die Raumursache wird danach bearbeitet.'),
      zero(`Ich versuche mich trotzdem durch die enge Stelle zu drängen.`, 'Das kostet Zeit und erhöht Unruhe im Raum.'),
      minus(`Ich rufe aus der Distanz, weil ich nicht schnell hinkomme.`, 'Die Störung wird öffentlich und die Lehrkraft verliert Präsenz.')
    ], ['Laufwege']);

  add('S10', 'Kooperative Verhaltensmodifikation', Boolean(ctx.riskyPairs.length), 'riskyPairs', 'Zwei verstärken sich',
    `${n(ctx.riskyPairs[0]?.students?.[0] || problem.julius)} und ${n(ctx.riskyPairs[0]?.students?.[1] || problem.ben)} reagieren sichtbar aufeinander. Aus einer kleinen Bemerkung wird fast ein Wettbewerb.`,
    [
      plus(`Ich gehe nah heran, stoppe die Dynamik knapp und gebe beiden getrennte, konkrete Arbeitsrollen für die nächsten Minuten.`, 'Die Intervention unterbricht die Verstärkung und schafft kooperativ klare Handlungsalternativen.'),
      zero(`Ich beobachte, ob sich die beiden wieder beruhigen.`, 'Bei einer bekannten Risikokombination ist reines Beobachten zu schwach.'),
      minus(`Ich entscheide sofort, wer schuld ist, und kritisiere die Person vor dem Tisch.`, 'Schuldzuweisung erhöht die Spannung und verhindert Klärung.')
    ], ['Sitznachbarschaft']);

  add('S11', 'Kooperative Verhaltensmodifikation', true, 'peerConflict', 'Reibung mit Julius',
    `${n(problem.julius)} reagiert gereizt auf eine Bemerkung eines Jungen in seiner Nähe. Die Körpersprache wird angespannter.`,
    [
      plus(`Ich gehe ruhig dazwischen, beschreibe nur das sichtbare Verhalten und gebe beiden eine kurze, getrennte Aufgabe. Eine Klärung kündige ich für später an, wenn beide wieder ansprechbar sind.`, 'Das schützt die Arbeitsphase und vermeidet eine öffentliche Konfliktverhandlung.'),
      zero(`Ich bitte beide, sich einfach zusammenzureißen.`, 'Das benennt eine Erwartung, bietet aber keine konkrete Hilfe.'),
      minus(`Ich lasse die beiden den Konflikt sofort vor der Gruppe ausdiskutieren.`, 'Die Situation wird zu groß und überfordert die Arbeitsphase.')
    ], [n(problem.julius), 'Konflikt']);

  add('S12', 'Classroom Management', true, 'transition', 'Unklarer Wechsel',
    `Beim Wechsel in eine andere Arbeitsform entsteht Bewegung im Raum. ${n(problem.emily)} wirkt unsicher und beginnt, andere zu fragen, was jetzt zu tun ist.`,
    [
      plus(goodRuleAnswer(problem.emily, ['transition-signal', 'wechsel'], 'Wir warten auf das Startsignal und beginnen dann mit Schritt eins.', 'Ich wiederhole den ersten Schritt knapp sichtbar für alle.'), 'Die Lehrkraft gibt Struktur, ohne Unsicherheit als Störung zu etikettieren.'),
      zero(`Ich erkläre den Auftrag noch einmal ausführlich für die ganze Klasse.`, 'Das kann helfen, unterbricht aber mehr als nötig.'),
      minus(`Ich sage, dass man nach der Erklärung nun wirklich selbst wissen müsse, was zu tun ist.`, 'Das erhöht Unsicherheit und erschwert Kooperation.')
    ], [n(problem.emily), 'Übergang'], selectedHint(['transition-signal', 'wechsel']));

  add('S13', 'Classroom Management', true, 'material', 'Material wird zum Vorwand',
    `${n(problem.ben)} sagt, er müsse noch Material holen, bleibt aber stehen und schaut, wer reagiert.`,
    [
      plus(goodRuleAnswer(problem.ben, ['walkway', 'material'], 'Material wird nur nach dem vereinbarten Ablauf geholt; jetzt startest du mit dem vorhandenen Material.', 'Wenn wirklich etwas fehlt, klären wir es leise am Platz.'), 'Die Lehrkraft trennt echten Bedarf von Ausweichen und hält den Unterricht im Fluss.'),
      zero(`Ich lasse ihn gehen, damit der Unterricht nicht weiter unterbrochen wird.`, 'Kurzfristig ruhig, aber die Regel wird unklar.'),
      minus(`Ich mache daraus eine Grundsatzrede über fehlende Vorbereitung.`, 'Die Klasse wird aus der Aufgabe gezogen und der Konflikt vergrößert sich.')
    ], [n(problem.ben), 'Material'], selectedHint(['walkway', 'material']));

  add('S14', 'Kooperative Verhaltensmodifikation', true, 'selfControl', 'Selbstkontrolle bricht ab',
    `${n(problem.niklas)} beginnt konzentriert, verliert aber nach kurzer Zeit die Orientierung und greift wieder in Richtung Tasche.`,
    [
      plus(`Ich gehe kurz hin, erinnere an das vereinbarte Ziel und frage leise: „Was hilft dir jetzt, die nächsten zwei Minuten dranzubleiben?“`, 'Das stärkt Selbststeuerung und hält die Intervention klein.'),
      zero(`Ich lege die Aufgabe kommentarlos noch einmal auf den Tisch.`, 'Das kann unterstützen, klärt aber das Verhalten nicht.'),
      minus(`Ich sage: „Du kannst es wohl einfach nicht lassen.“`, 'Die Aussage etikettiert den Schüler und schwächt Kooperation.')
    ], [n(problem.niklas), 'Selbstkontrolle']);

  add('S15', 'Kooperative Verhaltensmodifikation', true, 'attention', 'Aufmerksamkeit durch Geräusche',
    `${n(problem.tom)} erzeugt kleine Geräusche und wartet auf Reaktionen. Einige Köpfe drehen sich bereits.`,
    [
      plus(`Ich gehe nah heran, gebe ein nonverbales Stoppsignal und flüstere den nächsten Arbeitsauftrag. Wenn es gelingt, bestätige ich die ruhige Mitarbeit kurz.`, 'Die Lehrkraft nimmt die Bühne weg und verstärkt das Zielverhalten.'),
      zero(`Ich ignoriere es vollständig.`, 'Ignorieren kann bei Aufmerksamkeitsverhalten helfen, ist hier aber riskant, weil die Klasse schon reagiert.'),
      minus(`Ich imitiere das Geräusch ironisch, damit klar wird, wie störend es ist.`, 'Ironie beschämt und kann die Dynamik verstärken.')
    ], [n(problem.tom), 'Aufmerksamkeit']);

  add('S16', 'Classroom Management', true, 'lessonFlow', 'Arbeitsfluss kippt',
    `Mehrere Schüler*innen schauen nicht mehr auf ihre Aufgaben. Der Auslöser ist klein, aber die Klasse orientiert sich zunehmend an der Störung.`,
    [
      plus(`Ich stoppe kurz, setze ein klares Signal und gebe eine sehr konkrete nächste Arbeitsminute vor. Danach gehe ich zuerst zu den riskanten Plätzen.`, 'Das verbindet Klassenmanagement mit gezielter Präsenz.'),
      zero(`Ich spreche weiter, damit keine zusätzliche Unterbrechung entsteht.`, 'Das hält den Plan, übersieht aber den kippenden Arbeitsfluss.'),
      minus(`Ich unterbreche lange und bespreche, wie schlecht die Mitarbeit gerade ist.`, 'Die Unterbrechung vergrößert den Störwert.')
    ], ['Arbeitsfluss']);

  add('S17', 'Kooperative Verhaltensmodifikation', true, 'resourceUse', 'Ressource am Tisch',
    `${n(resource)} arbeitet ruhig und könnte als Ressource wirken. In der Nähe entsteht trotzdem Unruhe.`,
    [
      plus(`Ich nutze ${n(resource)} nicht als Hilfslehrkraft, sondern gebe dem Tisch eine klare Mini-Aufgabe und bestätige die ruhige Mitarbeit von ${n(resource)} kurz.`, 'Ressourcen werden anerkannt, aber nicht überlastet.'),
      zero(`Ich bitte ${n(resource)}, die anderen am Tisch zu beruhigen.`, 'Das kann kurz helfen, verlagert aber pädagogische Verantwortung auf einen Schüler.'),
      minus(`Ich sage laut, dass sich alle ein Beispiel an ${n(resource)} nehmen sollen.`, 'Vergleiche können beschämen und die soziale Lage verschlechtern.')
    ], [n(resource), 'Ressource']);

  add('S18', 'Classroom Management', true, 'rules', 'Regel ist da, aber nicht präsent',
    `Eine vereinbarte Klassenregel passt zur Situation, wird im Moment aber nicht automatisch genutzt. Die Klasse braucht eine knappe Erinnerung.`,
    [
      plus(`Ich erinnere knapp an die passende Regel, benenne das gewünschte Verhalten und führe die Klasse sofort zurück zur Aufgabe.`, 'Regeln wirken, wenn sie kurz, situationsnah und handlungsbezogen genutzt werden.'),
      zero(`Ich sage allgemein, dass die Regeln gelten.`, 'Das stimmt, bleibt aber unkonkret.'),
      minus(`Ich lasse die Klasse alle Regeln noch einmal laut vorlesen.`, 'Die lange Unterbrechung macht die Störung größer.')
    ], ['Klassenregeln']);

  add('S19', 'Kooperative Verhaltensmodifikation', true, 'debrief', 'Klärung nach der Stunde',
    `${n(problem.petra)} arbeitet nach der Intervention kurz mit, wirkt aber weiterhin angespannt und ablenkbar.`,
    [
      plus(`Ich halte die akute Phase knapp und kündige leise an: „Wir klären nach der Stunde kurz, was dir hilft, in Arbeitsphasen bei dir zu bleiben.“`, 'Die akute Ordnung bleibt erhalten; die eigentliche Verhaltensvereinbarung wird zeitnah vorbereitet.'),
      zero(`Ich lasse es dabei, weil die Situation im Moment ruhig ist.`, 'Kurzfristig reicht das, aber es entsteht keine Veränderungsvereinbarung.'),
      minus(`Ich führe sofort ein längeres Gespräch am Tisch.`, 'Das zieht Aufmerksamkeit und Zeit aus der Unterrichtsphase.')
    ], [n(problem.petra), 'Nachgespräch']);

  add('S20', 'Classroom Management', true, 'proximity', 'Nähe ohne Bloßstellung',
    `${n(problem.lina)} braucht Unterstützung, ohne vor der Klasse herausgestellt zu werden. Ein falscher Ton würde die Situation verschärfen.`,
    [
      plus(`Ich gehe seitlich an den Tisch, spreche leise und gebe eine konkrete, machbare nächste Handlung.`, 'Die Unterstützung ist respektvoll und unmittelbar.'),
      zero(`Ich frage von vorne, ob alles in Ordnung ist.`, 'Die Frage ist freundlich, aber öffentlich und wenig konkret.'),
      minus(`Ich erkläre der Klasse, dass manche Personen eben empfindlicher reagieren.`, 'Das etikettiert und verletzt Schutzbedürfnisse.')
    ], [n(problem.lina), 'Schutz']);

  add('S21', 'Classroom Management', Boolean(ctx.activeTrash?.length), 'trash', 'Müll lenkt ab',
    `Ein Müllfeld liegt im Laufweg. Es bindet Aufmerksamkeit und erschwert schnelle Präsenz der Lehrkraft.`,
    [
      plus(`Ich entferne den Müll zügig mit dem Besen und kehre direkt zur nächsten Unterrichtshandlung zurück.`, 'Der Störreiz verschwindet, ohne die Situation groß zu machen.'),
      zero(`Ich warte, bis später jemand Zeit hat, den Müll wegzuräumen.`, 'Die Ablenkung bleibt bestehen.'),
      minus(`Ich mache die Klasse laut dafür verantwortlich, dass Müll im Raum liegt.`, 'Die Reaktion erzeugt Unruhe, ohne das Feld zu klären.')
    ], ['Müll']);

  add('S22', 'Kooperative Verhaltensmodifikation', true, 'avoidance', 'Ausweichen statt Arbeiten',
    `${n(problem.ben)} fragt zum dritten Mal nach einer Nebensache, obwohl der Arbeitsauftrag klar ist. Es wirkt wie ein Ausweichen vor dem Beginn.`,
    [
      plus(`Ich bestätige kurz die Frage, begrenze sie und vereinbare: „Erst Aufgabe eins, danach klären wir den Rest.“`, 'Das nimmt das Bedürfnis wahr und schützt gleichzeitig die Arbeitszeit.'),
      zero(`Ich beantworte jede Nachfrage ausführlich.`, 'Das ist zugewandt, verstärkt aber möglicherweise das Ausweichen.'),
      minus(`Ich sage, dass solche Fragen nur stören.`, 'Die Reaktion ist abwertend und verschlechtert Kooperation.')
    ], [n(problem.ben), 'Ausweichen']);

  add('S23', 'Classroom Management', true, 'noise', 'Lautstärke steigt',
    `Die Arbeitslautstärke steigt schrittweise. ${n(problem.tom)} nutzt den Moment, um erneut Aufmerksamkeit zu bekommen.`,
    [
      plus(`Ich nutze ein bekanntes Ruhezeichen, warte kurz auf Wirkung und gebe dann die nächste Arbeitsminute klar vor.`, 'Ein eingeübtes Signal ist kurz, vorhersehbar und unterbricht wenig.'),
      zero(`Ich bitte mehrfach um Ruhe, während ich weiter erkläre.`, 'Die Bitte ist verständlich, verliert aber schnell Wirkung.'),
      minus(`Ich erhöhe meine Stimme, bis die Klasse leise wird.`, 'Die Lautstärke der Lehrkraft verstärkt die Gesamtunruhe.')
    ], ['Lautstärke']);

  add('S24', 'Kooperative Verhaltensmodifikation', true, 'choice', 'Kleine Wahlmöglichkeit',
    `${n(problem.niklas)} wirkt kurz vor dem Ausstieg aus der Aufgabe. Ein harter Befehl würde vermutlich Widerstand auslösen.`,
    [
      plus(`Ich gebe zwei klare, gleichwertige Startoptionen und lasse ${n(problem.niklas)} eine davon wählen.`, 'Die Wahl ist begrenzt und fördert Selbststeuerung.'),
      zero(`Ich sage nur, dass er anfangen soll.`, 'Die Erwartung ist klar, aber wenig unterstützend.'),
      minus(`Ich stelle die gesamte Aufgabe infrage und erkläre lange, warum sie wichtig ist.`, 'Zu viel Erklärung verzögert den Start weiter.')
    ], [n(problem.niklas), 'Selbststeuerung']);

  add('S25', 'Classroom Management', true, 'firstMinute', 'Die erste Minute zählt',
    `Direkt nach dem Start der Arbeitsphase entsteht Unruhe. Noch ist die Situation gut steuerbar.`,
    [
      plus(`Ich sichere die ersten sechzig Sekunden mit einem klaren Startsignal, sichtbarer Präsenz und einer überprüfbaren Mini-Aufgabe.`, 'Frühe Struktur verhindert, dass kleine Störungen wachsen.'),
      zero(`Ich gebe der Klasse mehr Zeit, sich selbst zu sortieren.`, 'Das kann funktionieren, ist bei bekannten Risikoprofilen aber unsicher.'),
      minus(`Ich beginne sofort mit Ermahnungen, bevor klar ist, wer Hilfe braucht.`, 'Die Stunde startet in einer negativen Kontrolllogik.')
    ], ['Startphase']);

  add('S26', 'Kooperative Verhaltensmodifikation', true, 'feedback', 'Positives Verhalten übersehen',
    `${n(problem.tom)} meldet sich einmal korrekt, kurz danach droht wieder ein Zwischenruf. Der Moment ist günstig für Verstärkung.`,
    [
      plus(`Ich bestätige die korrekte Meldung kurz und konkret: „Danke, genau so kann ich dich drannehmen.“`, 'Positives Zielverhalten wird sichtbar verstärkt.'),
      zero(`Ich nehme ihn einfach dran.`, 'Das ist sachlich, nutzt aber die Chance zur Verstärkung nicht.'),
      minus(`Ich erinnere gleichzeitig daran, wie oft er sonst dazwischenruft.`, 'Die positive Handlung wird entwertet.')
    ], [n(problem.tom), 'Verstärkung']);

  add('S27', 'Classroom Management', true, 'seating', 'Sitzordnung als Auslöser',
    `An einem Tisch entsteht wiederholt Ablenkung. Die aktuelle Sitznähe scheint die Störung mit auszulösen.`,
    [
      plus(`Ich interveniere jetzt knapp und plane anschließend eine gezielte Sitzkorrektur, statt mitten in der Phase hektisch umzubauen.`, 'Akut bleibt die Stunde stabil; die strukturelle Ursache wird später bearbeitet.'),
      zero(`Ich tausche sofort mehrere Plätze.`, 'Das kann helfen, verursacht aber im laufenden Unterricht viel Bewegung.'),
      minus(`Ich ignoriere die Sitzursache und arbeite nur mit Ermahnungen.`, 'Dann bleibt der strukturelle Auslöser bestehen.')
    ], ['Sitzordnung']);

  add('S28', 'Kooperative Verhaltensmodifikation', true, 'reflection', 'Kurze Reflexion statt Moralpredigt',
    `${n(problem.ben)} hält sich nach einer Intervention wieder an die Aufgabe. Die Lehrkraft kann jetzt entscheiden, wie sie den Moment abschließt.`,
    [
      plus(`Ich gebe kurz Rückmeldung zum gelungenen Verhalten und formuliere die Erwartung für die nächsten Minuten.`, 'Der Abschluss stabilisiert, ohne die Situation erneut groß zu machen.'),
      zero(`Ich sage nichts weiter, weil es jetzt läuft.`, 'Das ist störungsarm, verschenkt aber Verstärkung.'),
      minus(`Ich erkläre ausführlich, warum es vorher problematisch war.`, 'Die lange Rückschau holt die Störung zurück.')
    ], [n(problem.ben), 'Rückmeldung']);

  add('S29', 'Classroom Management', true, 'taskClarity', 'Auftrag zu offen',
    `Einige Schüler*innen wissen nicht, was als Nächstes zählt. ${n(problem.petra)} nutzt die Unklarheit für Nebengespräche.`,
    [
      plus(`Ich formuliere den nächsten Schritt sichtbar und zeitlich begrenzt: „Zwei Minuten: Aufgabe eins markieren, dann kurze Rückmeldung.“`, 'Klarheit reduziert Ausweich- und Ablenkungsverhalten.'),
      zero(`Ich frage, wer die Aufgabe noch nicht verstanden hat.`, 'Das kann helfen, öffnet aber eine längere Unterbrechung.'),
      minus(`Ich sage, dass die Aufgabe doch eindeutig erklärt wurde.`, 'Das klärt nichts und verstärkt Unsicherheit.')
    ], [n(problem.petra), 'Auftragsklarheit']);

  add('S30', 'Kooperative Verhaltensmodifikation', true, 'emotion', 'Emotion vor Verhalten',
    `${n(problem.lina)} wirkt nach einem Kommentar innerlich ausgestiegen. Eine reine Ermahnung zur Mitarbeit würde zu kurz greifen.`,
    [
      plus(`Ich spreche leise an, dass der Moment schwierig war, und gebe eine kleine Rückkehrhilfe: „Starte mit Zeile eins, ich komme gleich wieder.“`, 'Die Intervention verbindet emotionale Sicherheit mit konkreter Handlung.'),
      zero(`Ich lasse ihr kurz Zeit und gehe weiter.`, 'Das schützt vor Öffentlichkeit, bietet aber noch keine Rückkehrhilfe.'),
      minus(`Ich fordere sofort Mitarbeit ein, ohne den Auslöser zu beachten.`, 'Das kann als Druck erlebt werden und die Verweigerung verstärken.')
    ], [n(problem.lina), 'Emotion']);

  add('S31', 'Classroom Management', true, 'door', 'Blick wandert zur Tür',
    `${n(problem.niklas)} schaut wiederholt zur Tür und wirkt, als wolle er die Situation verlassen oder sich entziehen.`,
    [
      plus(`Ich gehe nah genug heran, frage leise nach dem Grund und kläre sofort, ob es einen legitimen Anlass gibt oder ob die Rückkehr an die Aufgabe nötig ist.`, 'Die Bewegung wird früh geklärt, bevor sie zum Modell für andere wird.'),
      zero(`Ich stelle mich in Türnähe und beobachte.`, 'Das kann verhindern, dass jemand geht, klärt aber nicht den Anlass.'),
      minus(`Ich rufe von vorne, dass niemand den Raum verlässt.`, 'Die Reaktion ist öffentlich und wenig kooperativ.')
    ], [n(problem.niklas), 'Tür']);

  add('S32', 'Kooperative Verhaltensmodifikation', true, 'agreement', 'Vereinbarung braucht Kontrolle',
    `Eine vorherige Vereinbarung zeigt erste Wirkung, ist aber noch nicht stabil. ${n(problem.tom)} schaut, ob die Lehrkraft konsequent bleibt.`,
    [
      plus(`Ich erinnere kurz an die Vereinbarung und frage nach dem vereinbarten Hilfeschritt, statt neu zu diskutieren.`, 'Konsequente Umsetzung macht Vereinbarungen verlässlich.'),
      zero(`Ich verhandle die Vereinbarung erneut.`, 'Das kann wertschätzend sein, schwächt aber die Verbindlichkeit in der akuten Situation.'),
      minus(`Ich erkläre, dass Vereinbarungen bei ihm ohnehin nichts bringen.`, 'Das beschädigt Beziehung und Selbstwirksamkeit.')
    ], [n(problem.tom), 'Vereinbarung']);

  add('S33', 'Classroom Management', true, 'preventivePresence', 'Präventive Präsenz',
    `Noch ist keine offene Störung sichtbar, aber mehrere riskante Plätze liegen außerhalb der direkten Aufmerksamkeit.`,
    [
      plus(`Ich verändere meine Position so, dass die riskanten Plätze im Blick liegen, ohne den Unterrichtsfluss zu unterbrechen.`, 'Prävention ist wirksamer als spätes Reagieren.'),
      zero(`Ich bleibe vorne, damit die Erklärung vollständig bleibt.`, 'Das kann sachlich nötig sein, lässt aber blinde Bereiche entstehen.'),
      minus(`Ich kündige an, dass ich gleich kontrollieren werde, wer nicht arbeitet.`, 'Die Ankündigung setzt auf Drohung statt Präsenz.')
    ], ['Präsenz']);

  add('S34', 'Kooperative Verhaltensmodifikation', true, 'cooperation', 'Kooperation statt Machtkampf',
    `${n(problem.ben)} widerspricht knapp. Die Situation kann entweder klein bleiben oder zum Machtkampf werden.`,
    [
      plus(`Ich bleibe ruhig, wiederhole die Erwartung einmal knapp und gebe eine konkrete Wahl innerhalb der Regel.`, 'Die Lehrkraft bleibt klar und erhält Kooperation.'),
      zero(`Ich erkläre ausführlich, warum die Regel sinnvoll ist.`, 'Das ist pädagogisch nachvollziehbar, aber im Moment zu lang.'),
      minus(`Ich fordere sofort eine Entschuldigung vor der Klasse.`, 'Das erhöht den Druck und macht den Konflikt öffentlich.')
    ], [n(problem.ben), 'Kooperation']);

  add('S35', 'Classroom Management', true, 'sink', 'Weg zum Waschbecken',
    `${n(problem.petra)} schaut zum Waschbecken und scheint gleich aufzustehen. Die Aufgabe ist noch nicht begonnen.`,
    [
      plus(`Ich frage leise nach dem Grund. Wenn es nötig ist, erlaube ich den kurzen Weg mit Rückkehrregel; wenn nicht, verweise ich direkt auf den Arbeitsstart.`, 'Die Lehrkraft unterscheidet Bedürfnis und Ausweichen.'),
      zero(`Ich lasse den Weg zu, solange es ruhig bleibt.`, 'Das hält die Situation klein, macht die Regel aber unklar.'),
      minus(`Ich verbiete grundsätzlich jeden Gang durch den Raum.`, 'Das ignoriert mögliche berechtigte Gründe und wirkt unflexibel.')
    ], [n(problem.petra), 'Waschbecken']);

  add('S36', 'Kooperative Verhaltensmodifikation', true, 'cabinet', 'Weg zum Schrank',
    `${n(problem.emily)} steht unsicher auf und geht in Richtung Schrank. Es ist unklar, ob Material fehlt oder ob sie der Aufgabe ausweicht.`,
    [
      plus(`Ich gehe hin, frage kurz nach dem Grund und gebe eine klare Rückkehrregel: Material holen, dann direkt wieder zur Aufgabe.`, 'Die Handlung wird strukturiert, nicht pauschal bestraft.'),
      zero(`Ich schicke sie sofort zurück, damit niemand anderes aufsteht.`, 'Das kann Ordnung sichern, klärt aber den möglichen Bedarf nicht.'),
      minus(`Ich rufe quer durch den Raum, dass der Schrank tabu ist.`, 'Das ist öffentlich und ungenau.')
    ], [n(problem.emily), 'Schrank']);

  add('S37', 'Classroom Management', true, 'classFocus', 'Viele schauen zur Störung',
    `Eine kleine Störung zieht plötzlich viele Blicke auf sich. Der Unterricht droht, seinen Fokus zu verlieren.`,
    [
      plus(`Ich halte die Intervention klein: kurze Nähe zur betroffenen Person, klare Aufgabe für alle, dann sofort weiterarbeiten lassen.`, 'So bekommt die Störung wenig Bühne.'),
      zero(`Ich warte, bis sich die Aufmerksamkeit wieder verteilt.`, 'Das kann funktionieren, verliert aber Zeit.'),
      minus(`Ich bespreche mit der ganzen Klasse, warum solche Störungen stören.`, 'Die Besprechung macht die Störung zum Mittelpunkt.')
    ], ['Aufmerksamkeit']);

  add('S38', 'Kooperative Verhaltensmodifikation', true, 'supportPlan', 'Ein Plan für den nächsten Versuch',
    `${n(problem.niklas)} hat die Regel erneut nicht eingehalten. Die akute Situation ist gestoppt, aber eine Wiederholung ist wahrscheinlich.`,
    [
      plus(`Ich vereinbare nach der Stunde kurz einen konkreten Wenn-dann-Plan und erinnere in der nächsten Stunde zu Beginn daran.`, 'Das entspricht kooperativer Verhaltensmodifikation: Problem klären, Vereinbarung treffen, Einhaltung unterstützen.'),
      zero(`Ich notiere mir, das irgendwann im Klassenrat anzusprechen.`, 'Eine spätere Klärung kann helfen, ist aber zu unkonkret.'),
      minus(`Ich kündige an, dass beim nächsten Mal sofort eine harte Konsequenz kommt.`, 'Die Drohung ersetzt keine tragfähige Verhaltenshilfe.')
    ], [n(problem.niklas), 'Wenn-dann-Plan']);

  add('S39', 'Classroom Management', true, 'overlap', 'Zwei Ereignisse gleichzeitig',
    `Während eine Störung bearbeitet wird, entsteht an anderer Stelle ein zweites Warnsignal. Die Lehrkraft muss priorisieren.`,
    [
      plus(`Ich beende die erste Intervention knapp, sichere die Klasse mit einem kurzen Arbeitsauftrag und gehe dann zum dringenderen Warnsignal.`, 'Die Reaktion priorisiert ohne Hektik und hält den Arbeitsrahmen.'),
      zero(`Ich versuche beide Situationen von der Mitte des Raumes aus anzusprechen.`, 'Das ist schnell, bleibt aber ungenau.'),
      minus(`Ich ignoriere das zweite Signal, bis die erste Situation vollständig geklärt ist.`, 'Dadurch kann die zweite Störung eskalieren.')
    ], ['Priorisierung']);

  add('S40', 'Kooperative Verhaltensmodifikation', true, 'closing', 'Ruhiger Abschluss einer Intervention',
    `Die Situation ist geklärt. Entscheidend ist jetzt, ob die Klasse wieder schnell in die Aufgabe findet.`,
    [
      plus(`Ich fasse die Erwartung in einem Satz zusammen, gebe den nächsten Arbeitsschritt und wende mich wieder dem Unterricht zu.`, 'Die Intervention endet klar und kurz; der Unterricht bleibt im Vordergrund.'),
      zero(`Ich frage noch nach, ob jetzt wirklich alles verstanden wurde.`, 'Das kann Sicherheit geben, verlängert aber unnötig.'),
      minus(`Ich wiederhole noch einmal ausführlich, was falsch lief.`, 'Die Störung wird erneut aktiviert.')
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
  pausedAt: null,
  eventSeq: 0,
  usedScenarioIds: new Set(),
  highscoreBase: 0,
  lifeBonus: 0,
  finalHighscore: 0,
  finalBonusAdded: false,
  finishReason: null,
  scoreEvents: [],
  cleaningMode: false,
  dynamicTrash: [],
  studentPositions: {},
  studentMoveTimers: {},
  pendingWanderResolution: null,
  broom: context.stepData?.objects?.broom || { id: 'broom-fixed', type: 'broom', row: (context.stepData?.rows || 9) - 1, col: (context.stepData?.cols || 10) - 1 }
};

function init() {
  renderContext();
  renderScenarioCatalog();
  renderBranchGame();
  renderLife();
  renderHighscore();
  bindEvents();
  logEvent('Bereit. Starte den Unterricht, sobald du die Runde beginnen willst.', 'info');
}

function bindEvents() {
  if (openScenarioBtn) openScenarioBtn.addEventListener('click', () => scenarioDrawer.hidden = false);
  if (closeScenarioBtn) closeScenarioBtn.addEventListener('click', () => scenarioDrawer.hidden = true);
  if (startLessonBtn) startLessonBtn.addEventListener('click', startLesson);
  if (continueScenarioBtn) continueScenarioBtn.addEventListener('click', closeScenarioModal);
  if (restartOutcomeBtn) restartOutcomeBtn.addEventListener('click', () => window.location.reload());
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
  game.cleaningMode = false;
  game.teacherPath = [];
  game.teacherMoveStepIndex = 0;
  if (startLessonBtn) {
    startLessonBtn.disabled = true;
    startLessonBtn.textContent = 'Unterricht läuft';
  }
  logEvent('Der Unterricht beginnt. Reagiere auf blinkende Störungen. Müll kann zusätzlich auftauchen und blockiert Laufwege, bis er weggefegt wird.', 'info');
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
  if (game.scenarioOpen) return;
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
      addHighscoreEvent(game.lifeBonus, `Lebensbonus am Ende: ${game.score} × ${SCORE_PER_LIFE} Punkte`, 'good', { finalBonus: true });
    } else {
      addHighscoreEvent(0, 'Kein Lebensbonus: 0 verbleibende Leben.', 'bad', { finalBonus: true });
    }
  }
  game.finalHighscore = scoreBeforeLifeBonus + game.lifeBonus;
  game.highscoreBase = game.finalHighscore;

  renderBranchGame();
  renderIncidents();

  if (lost) {
    logEvent('Die Unterrichtsstabilität ist auf 0 gefallen. Die Runde ist verloren.', 'bad');
    if (teacherStatus) teacherStatus.textContent = 'Runde verloren: Die Unterrichtsstabilität ist auf 0 gefallen.';
    showOutcomeModal('lost');
  } else {
    logEvent(`Unterricht beendet. Endstabilität: ${game.score}/10.`, game.score > 5 ? 'good' : game.score < 3 ? 'bad' : 'neutral');
    if (teacherStatus) teacherStatus.textContent = 'Unterricht beendet.';
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
  if (!game.started || game.finished || game.scenarioOpen) return;
  const now = Date.now();
  maybeSpawnStudentIncidents(now);
  maybeSpawnTrashEvents(now);
  maybeSpawnWanderEvents(now);
}

function maybeSpawnStudentIncidents(now) {
  if (now < game.nextIncidentAt) return;
  const limit = currentDifficultyLimit();
  const activeStudentIncidents = game.activeIncidents.filter(incident => incident.kind === 'student').length;
  const freeSlots = Math.max(0, limit - activeStudentIncidents);
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
  const activeWander = game.activeIncidents.filter(incident => incident.kind === 'wander').length;
  if (activeWander < wanderLimit()) {
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
  game.dynamicTrash.push({ id, type: 'trash', row: candidate.row, col: candidate.col, removed: false });
  game.activeIncidents.push(incident);
  playAlertAudio();
  logEvent(`Müll taucht nahe bei ${candidate.nearStudent.name} auf. Er blockiert Laufwege zusätzlich zu den Schülerereignissen, bis du ihn mit dem Besen entfernst.`, 'warn');
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
    ? `${student.name} bekommt eine kurze Erlaubnis, verlässt den Raum für einen begrenzten Zeitraum und kehrt danach zurück. Die Regel bleibt klar und die Klasse arbeitet weiter.`
    : `${student.name} erklärt den nachvollziehbaren Grund, geht kontrolliert ${targetLabel}, bleibt dort kurz und kehrt anschließend zum Platz zurück.`;
  const returnFeedback = `${student.name} kehrt an den Platz zurück. Das stoppt die Bewegung, klärt den Anlass aber nur teilweise.`;
  const badFeedback = 'Die Situation wird öffentlich oder unklar behandelt. Die Bewegung bekommt zu viel Aufmerksamkeit und die Arbeitsruhe sinkt.';

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
        { delta: 1, action: 'allow-target-return', text: `Ich gehe ruhig zu ${student.name}, frage kurz nach dem Grund und erlaube den Weg mit klarer Rückkehrregel.`, feedback: allowFeedback },
        { delta: 0, action: 'return-seat', text: `Ich gebe ein knappes Rückkehrsignal und kläre den Grund erst später.`, feedback: returnFeedback },
        { delta: -1, action: 'return-seat', text: `Ich kommentiere den Gang laut vor der Klasse, damit alle merken, dass Aufstehen problematisch ist.`, feedback: badFeedback }
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
      { delta: 1, action: 'return-seat', text: `Ich gehe ruhig zu ${student.name}, frage kurz nach und verweise knapp auf die Regel: erst melden oder fragen, dann den Platz verlassen. Danach geht ${student.name} zurück an den Platz.`, feedback: `${student.name} bekommt eine klare Grenze, ohne bloßgestellt zu werden. Die Regel wird unmittelbar kommuniziert.` },
      { delta: 0, action: 'return-seat', text: `Ich schicke ${student.name} mit einem kurzen Zeichen zurück, ohne die Regel zu klären.`, feedback: 'Die Bewegung endet, aber die Erwartung bleibt unklar.' },
      { delta: -1, action: 'allow-target-return', text: `Ich lasse ${student.name} weitergehen, damit der Unterricht nicht länger unterbrochen wird.`, feedback: 'Die Bewegung wird nicht geklärt. Andere sehen, dass man den Platz ohne Auftrag verlassen kann.' }
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
  if (object && object.type !== 'broom') return false;
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
  const shuffledStudents = shuffle(context.students
    .map(student => ({ student, desk: context.deskByStudentId[student.id] }))
    .filter(item => item.desk)
    .filter(item => !hasActiveStudentIncident(item.student.id))
    .filter(item => !isStudentAway(item.student.id))
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
  const candidate = candidates[randomInt(0, candidates.length - 1)];
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
    .filter(item => !hasActiveStudentIncident(item.student.id))
    .filter(item => !isStudentAway(item.student.id));
  if (!seatedStudents.length) return null;

  const outsideRadius = seatedStudents.filter(item => !isDeskWithinTeacherRadius(item.desk));
  const eligible = outsideRadius.length ? outsideRadius : seatedStudents;
  const weighted = [];
  eligible.forEach(item => {
    const weight = (item.student.hidden?.risk || 1) + (item.student.hidden?.needsMonitoring ? 2 : 0) + (item.student.hidden?.stabilizer ? 0 : 1);
    for (let i = 0; i < weight; i++) weighted.push(item);
  });
  const chosen = weighted[randomInt(0, weighted.length - 1)] || eligible[0];
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
  if (!game.activeIncidents.length || game.scenarioOpen) return;
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
    if (game.scenarioOpen) {
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
        if (game.scenarioOpen) {
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
        if (game.scenarioOpen) {
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
    if (game.scenarioOpen) {
      window.setTimeout(failAndReturn, 500);
      return;
    }
    removeIncident(stillActive.id);
    addHighscoreEvent(-500, `${stillActive.student.name}: Rückweg ohne Klärung.`, 'bad');
    const ended = changeScore(-1);
    playBadAudio();
    logEvent(`${stillActive.student.name} hat das Ziel erreicht und befindet sich nun auf dem Rückweg, ohne dass die Lehrkraft nachgefragt oder eine Regel geklärt hat. Das kostet 1 Leben und 500 Punkte.`, 'bad');
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

function bestApproachCellForIncident(incident) {
  const pos = incidentPosition(incident);
  if (!pos) return null;
  const candidates = neighbors(pos)
    .filter(cell => isWalkable(cell.row, cell.col));
  if (!candidates.length) return null;
  candidates.sort((a, b) => {
    const teacherDiff = manhattan(game.teacher, a) - manhattan(game.teacher, b);
    if (teacherDiff !== 0) return teacherDiff;
    return a.row - b.row || a.col - b.col;
  });
  const cell = candidates[0];
  let arrow = '➜';
  if (cell.row < pos.row) arrow = '↓';
  else if (cell.row > pos.row) arrow = '↑';
  else if (cell.col < pos.col) arrow = '→';
  else if (cell.col > pos.col) arrow = '←';
  return { ...cell, arrow, studentName: incident.student?.name || 'Schüler*in' };
}

function buildApproachCueMap() {
  const map = new Map();
  game.activeIncidents
    .filter(incident => incident.kind !== 'trash')
    .forEach(incident => {
      const cue = bestApproachCellForIncident(incident);
      if (cue) map.set(`${cue.row},${cue.col}`, cue);
    });
  return map;
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
        const trashIncident = object.type === 'trash' ? activeTrashByCell.get(`${row},${col}`) : null;
        obj.className = `branch-object branch-object-${object.type}${game.cleaningMode && object.type === 'broom' ? ' active-cleaning' : ''}${trashIncident ? ' is-blocking' : ''}`;
        obj.innerHTML = `<span class="branch-object-icon">${object.type === 'broom' ? '🧹' : '🗑️'}</span>`;
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
}

function handleBranchCellClick(row, col) {
  if (!game.started || game.finished || game.scenarioOpen) return;
  const object = getObjectAtLocal(row, col);
  if (object?.type === 'broom') {
    game.cleaningMode = !game.cleaningMode;
    if (teacherStatus) teacherStatus.textContent = game.cleaningMode
      ? 'Besen aktiviert. Klicke jetzt auf den Müll, um das Feld freizuräumen.'
      : 'Besen wieder abgelegt.';
    renderBranchGame();
    return;
  }
  if (object?.type === 'trash') {
    if (!game.cleaningMode) {
      if (teacherStatus) teacherStatus.textContent = 'Klicke zuerst unten rechts auf den Besen und dann auf das Müllfeld.';
      return;
    }
    clearTrashIncidentAt(row, col);
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
    if (teacherStatus && !game.scenarioOpen) teacherStatus.textContent = 'Die Lehrkraft steht bereits an diesem erreichbaren Feld.';
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
    game.cleaningMode = false;
    renderBranchGame();
    return;
  }
  removeIncident(incident.id);
  removeDynamicTrash(incident.id);
  game.cleaningMode = false;
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
    if (game.scenarioOpen || !game.started || game.finished) return;
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
  if (!game.activeIncidents.length || game.scenarioOpen) return;
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
  const pauseDuration = game.pausedAt ? Date.now() - game.pausedAt : 0;
  if (pauseDuration > 0) {
    game.activeIncidents.forEach(incident => { if (incident.deadline) incident.deadline += pauseDuration; });
    if (game.nextIncidentAt) game.nextIncidentAt += pauseDuration;
    if (game.nextTrashAt) game.nextTrashAt += pauseDuration;
    if (game.nextWanderAt) game.nextWanderAt += pauseDuration;
  }
  game.pausedAt = null;
  game.scenarioOpen = false;
  game.currentScenarioIncident = null;
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
  if (incidentCounter) incidentCounter.textContent = String(game.activeIncidents.length);
  const now = Date.now();
  const cards = game.activeIncidents.map(incident => {
    if (incident.kind === 'trash') {
      return `<article class="incident-item event-card"><strong>Müll blockiert den Weg</strong><span>mit dem Besen entfernen</span><small>nahe bei ${escapeHtml(incident.student?.name || 'einem Tisch')}</small></article>`;
    }
    if (incident.kind === 'wander') {
      return `<article class="incident-item event-card"><strong>${escapeHtml(incident.student.name)} ist unterwegs</strong><span>Lehrkraft muss nachfragen</span><small>${escapeHtml(incident.scenario.title)}</small></article>`;
    }
    const left = Math.max(0, Math.ceil((incident.deadline - now) / 1000));
    return `<article class="incident-item event-card"><strong>${escapeHtml(incident.student.name)}</strong><span>${left}s bis Eskalation</span><small>${escapeHtml(incident.scenario.title)}</small></article>`;
  }).join('');
  if (incidentList) {
    incidentList.innerHTML = game.activeIncidents.length ? cards : '<p class="hint">Keine akute Störung.</p>';
  }
  if (branchEventCards) {
    branchEventCards.innerHTML = game.activeIncidents.length ? cards : '<p class="hint">Noch keine Ereigniskarte aktiv.</p>';
  }
}

function renderLife() {
  if (branchScorePill) branchScorePill.textContent = `${game.score}/10`;
  if (branchScoreNote) branchScoreNote.textContent = `Startwert nach Schritt 2: ${normalizeStartScore(context.startScore ?? context.stepData?.rawPreparationScore ?? context.stepData?.preparationScore ?? 5)}/10.`;
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
  game.scoreEvents = game.scoreEvents.slice(0, 12);
  renderHighscore();
}

function renderHighscore() {
  const visibleScore = game.finished ? game.finalHighscore : game.highscoreBase;
  if (currentHighscoreEl) currentHighscoreEl.textContent = String(visibleScore);
  if (highscoreNote) {
    highscoreNote.textContent = game.finished
      ? `Endwert inklusive Lebensbonus: ${visibleScore} Punkte.`
      : 'Lebensbonus wird erst am Ende addiert.';
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
      : '<p class="hint">Noch keine Punkte-Ereignisse.</p>';
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
      ? `Die fünf Minuten sind abgelaufen, ohne dass die Unterrichtsstabilität auf 0 gefallen ist. Übrig: ${game.score}/10 Leben.`
      : 'Die Unterrichtsstabilität ist auf 0 gefallen. Die Klasse hat die gemeinsame Arbeitsruhe verloren.';
  }
  if (outcomeAdvice) {
    outcomeAdvice.textContent = won
      ? 'Achte im nächsten Durchlauf darauf, frühe Warnsignale schnell anzulaufen und Ressourcen im Sitzplan gezielt zu nutzen, um den Highscore weiter zu verbessern.'
      : 'Achte beim nächsten Mal besonders auf kurze Wege zur Lehrkraft, freie Laufwege, sichtbare Risikoschüler*innen und klare, knappe Interventionen statt langer Unterbrechungen.';
  }
  if (outcomeHighscore) outcomeHighscore.textContent = String(finalScore);
  if (outcomeBreakdown) outcomeBreakdown.textContent = `Interventionen/Reaktionen: ${finalScore - game.lifeBonus} · Lebensbonus: ${game.lifeBonus} (${game.score} × ${SCORE_PER_LIFE})`;
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
  const broom = game.broom || context.stepData?.objects?.broom;
  if (broom && broom.row === row && broom.col === col) return { ...broom, type: 'broom' };
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

installPageUtilities();
init();
