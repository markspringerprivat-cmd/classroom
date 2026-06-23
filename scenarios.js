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

const step1 = readJson('classroomGame.step1', {});
const rulesData = readJson('classroomGame.step2.rules', { acceptedRules: [], acceptedRuleIds: [] });
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
  if (document.querySelector('.page-utility-bar')) return;
  const bar = document.createElement('div');
  bar.className = 'page-utility-bar';
  bar.innerHTML = '<button type="button" id="utilityResetBtn" class="utility-btn utility-btn-reset">Zurücksetzen</button>';
  document.body.prepend(bar);
  bar.querySelector('#utilityResetBtn')?.addEventListener('click', resetAppAndReload);
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
  const desks = Array.isArray(stepData?.desks) ? stepData.desks : [];
  const assignments = stepData?.assignments || {};
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
  const blind = ctx.blindRiskStudents[0] || ctx.backRowRisks[0] || ctx.weaklyVisibleRiskStudents[0] || ctx.riskStudents[0];
  const weak = ctx.weaklyVisibleRiskStudents[0] || ctx.blindRiskStudents[0] || ctx.riskStudents[0];
  const visible = ctx.visibleRiskStudents[0] || ctx.riskStudents[0];
  const riskyPair = ctx.riskyPairs[0] || ctx.fallbackRiskPair;
  const riskyPair2 = ctx.riskyPairs[1] || ctx.fallbackRiskPair;
  const neutralPair = ctx.neutralizedRiskPairs[0] || ctx.fallbackSupportPair;
  const supportPair = ctx.stabilizingPairs[0] || ctx.fallbackSupportPair;
  const support = ctx.stabilizerStudent || ctx.mediatorStudent;
  const risk = ctx.riskStudents[0] || ctx.callsOutStudent;

  const s = [];

  s.push(scenario('D01', 'Kooperative Verhaltensmodifikation', ctx.blindRiskStudents.length > 0, 'blindRiskStudents', `${studentName(blind)} entzieht sich im blinden Bereich`, `${studentName(blind)} arbeitet leise nicht weiter. Der Platz liegt außerhalb oder nur schwach im Sichtfeld (${deskPlace(blind)}).`, [
    plus(kvPositive(studentName(blind), 'ein kurzes Kontrollsignal für die nächste Aufgabe'), 'Das Verhalten wird konkret bearbeitet, ohne den Schüler öffentlich festzulegen.'),
    zero('Du gehst kurz näher an den Tisch und arbeitest danach weiter.', 'Die Präsenz kann kurz wirken, verändert aber das Muster noch nicht.'),
    minus(`Du rufst quer durch den Raum, dass ${studentName(blind)} endlich arbeiten soll.`, 'Die öffentliche Korrektur erhöht Widerstand und nutzt die ungünstige Sitzposition nicht produktiv.')
  ], ['blindRiskStudents', studentName(blind)], `Dynamisch aus Sichtfeld-Auswertung: ${studentName(blind)}.`));

  s.push(scenario('D02', 'Kooperative Verhaltensmodifikation', Boolean(ctx.phoneStudent), 'student.hidden.phoneRisk', `${studentName(ctx.phoneStudent)} und verdecktes Handyverhalten`, `${studentName(ctx.phoneStudent)} schaut wiederholt unter den Tisch. Die vorbereitete Klasse enthält ein Handy-Risikoprofil.`, [
    plus(`Du klärst nach der Phase mit ${studentName(ctx.phoneStudent)} ein konkretes Handy-Ziel und vereinbarst eine Selbstkontrolle.`, 'Die Intervention setzt auf Zielklärung und Eigensteuerung statt auf bloße Sanktion.'),
    zero('Du positionierst dich häufiger in der Nähe des Tisches.', 'Das kann bremsen, bleibt aber eine reine Kontrollmaßnahme.'),
    minus('Du nimmst das Handy öffentlich weg und diskutierst vor der Klasse darüber.', 'Das Problem wird zur Bühne und die Kooperation wird unwahrscheinlicher.')
  ], ['phoneRisk', studentName(ctx.phoneStudent)]));

  s.push(scenario('D03', 'Classroom Management', ctx.backRowRisks.length > 0, 'backRowRisks', `${studentName(ctx.backRowRisks[0] || ctx.phoneStudent)} sitzt hinten und wird unruhig`, `${studentName(ctx.backRowRisks[0] || ctx.phoneStudent)} sitzt weit hinten und verliert den Fokus. Andere bemerken es noch kaum.`, [
    plus('Du setzt ein kurzes Präsenzsignal und gibst eine klare nächste Teilaufgabe.', 'Die Störung wird früh abgefangen und der Arbeitsfluss bleibt erhalten.'),
    zero('Du beobachtest weiter, ob sich das Verhalten von selbst legt.', 'Es eskaliert nicht sofort, aber die Störanfälligkeit bleibt bestehen.'),
    minus('Du ignorierst den Bereich dauerhaft, weil vorne gerade mehr los ist.', 'Das verdeckte Verhalten kann sich stabilisieren und später stärker auftreten.')
  ], ['backRowRisks', studentName(ctx.backRowRisks[0] || ctx.phoneStudent)]));

  s.push(scenario('D04', 'Classroom Management', ctx.visibleRiskStudents.length > 0, 'visionRiskStudents', `${studentName(visible)} ist gut sichtbar`, `${studentName(visible)} beginnt zu kommentieren, sitzt aber in einem wirksamen Sichtbereich der Lehrkraft.`, [
    plus('Du nutzt Blickkontakt und ein kurzes Stoppsignal, bevor du ohne Unterbrechung weiterleitest.', 'Das gute Sichtfeld wird als präventive Ressource genutzt.'),
    zero('Du wartest ab, ob der Kommentar endet.', 'Die Situation kann sich legen, aber die Ressource Sichtfeld bleibt ungenutzt.'),
    minus('Du unterbrichst den Unterricht für eine lange Grundsatzrede.', 'Eine kleine Störung bekommt zu viel Bühne.')
  ], ['visionRiskStudents', studentName(visible)]));

  s.push(scenario('D05', 'Kooperative Verhaltensmodifikation', ctx.riskyPairs.length > 0, 'riskyPairs', `${riskyPair.label} geraten aneinander`, `${riskyPair.label} sitzen direkt oder diagonal nah beieinander. Es entsteht ein spitzer Kommentar und die Spannung steigt.`, [
    plus(`Du stoppst die Eskalation knapp und klärst später mit ${riskyPair.names[0]} und ${riskyPair.names[1]} ein konkretes Ziel für die Zusammenarbeit.`, 'Der Konflikt wird begrenzt und in eine kooperative Zielvereinbarung übersetzt.'),
    zero('Du trennst die beiden für diese Aufgabe räumlich und machst weiter.', 'Das kann akut helfen, löst aber die Beziehungsspannung noch nicht.'),
    minus('Du entscheidest sofort vor der Klasse, wer schuld ist.', 'Die Zuschreibung verstärkt den Konflikt und erschwert Kooperation.')
  ], ['riskyPairs', riskyPair.label], riskyPair.reason));

  s.push(scenario('D06', 'Kooperative Verhaltensmodifikation', ctx.riskyPairs.length > 1, 'riskyPairs[1]', `${riskyPair2.label} stören sich gegenseitig`, `${riskyPair2.label} reagieren aufeinander mit Nebenbemerkungen. Der Sitzplan hat diese Nähe als riskant markiert.`, [
    plus('Du benennst das konkrete Muster und vereinbarst mit beiden ein beobachtbares Tischziel für die nächsten zehn Minuten.', 'Die Intervention bleibt konkret, überprüfbar und gemeinsam bearbeitbar.'),
    zero('Du setzt dich kurz in die Nähe und wartest, ob es ruhiger wird.', 'Die Nähe der Lehrkraft kann dämpfen, verändert aber noch keine Vereinbarung.'),
    minus('Du sagst, beide könnten grundsätzlich nicht zusammenarbeiten.', 'Die Schüler werden etikettiert und die Situation wird verfestigt.')
  ], ['riskyPairs', riskyPair2.label], riskyPair2.reason));

  s.push(scenario('D07', 'Kooperative Verhaltensmodifikation', ctx.stabilizingPairs.length > 0, 'stabilizingPairs', `Ressource am Tisch: ${supportPair.label}`, `${supportPair.label} sitzen so, dass eine stabilisierende Nachbarschaft möglich ist. Ein unruhiger Moment kann aufgefangen werden.`, [
    plus('Du gibst beiden eine kurze Rollenklärung und nutzt die stabilere Person als strukturierende Unterstützung, ohne Verantwortung abzugeben.', 'Die Ressource wird genutzt, bleibt aber pädagogisch geführt.'),
    zero('Du lässt die Sitznachbarschaft unverändert und beobachtest.', 'Es kann funktionieren, aber die Ressource wird nicht aktiv gemacht.'),
    minus('Du erklärst die stabilere Person für das Verhalten des anderen verantwortlich.', 'Das überfordert Mitschüler*innen und verschiebt Lehrer*innenverantwortung.')
  ], ['stabilizingPairs', supportPair.label]));

  s.push(scenario('D08', 'Kooperative Verhaltensmodifikation', ctx.neutralizedRiskPairs.length > 0, 'neutralizedRiskPairs', `Neutralisierte Nähe: ${neutralPair.label}`, `${neutralPair.label} sitzen nah beieinander, aber die Vorbereitung hat eine mögliche Stabilisierung markiert. Jetzt entsteht trotzdem leichte Spannung.`, [
    plus('Du stärkst die vorhandene Stabilisierung durch eine klare Mini-Aufgabe und kurze Rückmeldung.', 'Das vorhandene Schutzmoment wird bewusst gesichert.'),
    zero('Du verlässt dich darauf, dass die Sitzordnung schon reicht.', 'Die Lage bleibt kontrollierbar, aber die Stabilisierung wird nicht aktiv unterstützt.'),
    minus('Du stellst die beiden vor der Klasse als Problemfall dar.', 'Dadurch kann die zuvor neutralisierte Spannung wieder aktiviert werden.')
  ], ['neutralizedRiskPairs', neutralPair.label]));

  s.push(scenario('D09', 'Classroom Management', ctx.activeTrash.length > 0, 'roomObjects.activeTrash', 'Müll lenkt den Tischbereich ab', `Im Klassenraum liegt noch Müll. In der Nähe entsteht Unruhe und mehrere Blicke wandern dorthin.`, [
    plus('Du lässt den Störreiz kurz entfernen und führst die Aufmerksamkeit direkt zurück zur Aufgabe.', 'Der Raumfaktor wird bereinigt, bevor daraus ein Unterrichtsproblem wird.'),
    zero('Du wartest, bis die Aufmerksamkeit wieder bei der Aufgabe ist.', 'Die Situation kann abklingen, aber der Störreiz bleibt bestehen.'),
    minus('Du machst daraus eine lange Standpauke über Ordnung.', 'Der Müll bekommt mehr Aufmerksamkeit als nötig und unterbricht den Unterrichtsfluss.')
  ], ['room-trash-distraction', `${ctx.activeTrash.length} Müllfeld(er)`]));

  s.push(scenario('D10', 'Classroom Management', ctx.invalidSpacing.length > 0, 'spacing.invalidPairs', 'Laufweg ist blockiert', `Zwischen zwei Tischreihen ist kein Gang frei. Beim Helfen staut sich Bewegung im Raum.`, [
    plus('Du organisierst die Hilfe zunächst über Signale und veränderst den Laufweg nach der Phase.', 'Der Unterricht bleibt ruhig und die räumliche Ursache wird nachgesteuert.'),
    zero('Du arbeitest dich vorsichtig durch den engen Bereich.', 'Es geht weiter, aber die räumliche Schwäche bleibt bestehen.'),
    minus('Du beschwerst dich bei der Klasse über das Chaos, ohne den Ablauf zu verändern.', 'Das Problem bleibt räumlich bestehen und erzeugt zusätzliche Unruhe.')
  ], ['spacing', `${ctx.invalidSpacing.length} enge Tischabstände`]));

  s.push(scenario('D11', 'Kooperative Verhaltensmodifikation', Boolean(ctx.distractorStudent), 'student.hidden.distractor', `${studentName(ctx.distractorStudent)} lenkt den Nachbarn ab`, `${studentName(ctx.distractorStudent)} kommentiert leise die Aufgabe und der Sitznachbar verliert den Fokus.`, [
    plus(`Du vereinbarst mit ${studentName(ctx.distractorStudent)} ein kurzes Arbeitsziel und eine Selbstbeobachtung bis zur nächsten Rückmeldung.`, 'Das störende Verhalten wird in eine konkrete Veränderungsaufgabe übersetzt.'),
    zero('Du stellst dich kurz neben den Tisch.', 'Das stoppt die Ablenkung im Moment, bleibt aber abhängig von deiner Nähe.'),
    minus('Du setzt die Person kommentarlos weg und sagst, sie könne nicht neben anderen sitzen.', 'Die Maßnahme beschämt und verhindert kooperative Bearbeitung.')
  ], ['distractor', studentName(ctx.distractorStudent)]));

  s.push(scenario('D12', 'Kooperative Verhaltensmodifikation', Boolean(ctx.boundaryStudent), 'student.hidden.boundaryTesting', `${studentName(ctx.boundaryStudent)} testet eine Grenze`, `${studentName(ctx.boundaryStudent)} macht bewusst etwas anderes als vereinbart und schaut, wie du reagierst.`, [
    plus(`Du benennst die Abweichung ruhig und vereinbarst mit ${studentName(ctx.boundaryStudent)} den nächsten machbaren Arbeitsschritt.`, 'Die Grenze bleibt klar und der Schüler bekommt eine Rückkehrmöglichkeit.'),
    zero('Du ignorierst es, solange niemand direkt gestört wird.', 'Die Stunde läuft weiter, aber die Grenze bleibt uneindeutig.'),
    minus('Du steigst in eine öffentliche Diskussion ein.', 'Das Grenztesten erhält Bühne und wird wahrscheinlicher.')
  ], ['boundaryTesting', studentName(ctx.boundaryStudent)]));

  s.push(scenario('D13', 'Kooperative Verhaltensmodifikation', Boolean(ctx.callsOutStudent), 'student.hidden.callsOut', `${studentName(ctx.callsOutStudent)} ruft hinein`, `${studentName(ctx.callsOutStudent)} ruft die Antwort heraus, bevor andere reagieren können.`, [
    plus(`Du beschreibst das Reinrufen konkret und vereinbarst mit ${studentName(ctx.callsOutStudent)} ein Meldesignal als Ziel für die nächste Plenumsphase.`, 'Die Intervention ist kooperativ, konkret und überprüfbar.'),
    zero('Du nimmst die richtige Antwort auf und gehst weiter.', 'Der Inhalt stimmt, aber das Verhalten wird indirekt verstärkt.'),
    minus(`Du sagst vor der Klasse, dass ${studentName(ctx.callsOutStudent)} immer stört.`, 'Die Person wird etikettiert und die Beziehung belastet.')
  ], ['callsOut', studentName(ctx.callsOutStudent)]));

  s.push(scenario('D14', 'Kooperative Verhaltensmodifikation', Boolean(ctx.transitionStudent), 'student.hidden.transitions', `${studentName(ctx.transitionStudent)} verliert den Übergang`, `Beim Wechsel der Sozialform bleibt ${studentName(ctx.transitionStudent)} sitzen und schaut suchend auf das Material.`, [
    plus(`Du klärst mit ${studentName(ctx.transitionStudent)} den ersten Übergangsschritt und vereinbarst ein sichtbares Startsignal.`, 'Der Übergang wird konkret unterstützt und wiederholbar gemacht.'),
    zero('Du erklärst den Auftrag noch einmal leise.', 'Das hilft kurzfristig, verändert aber die Übergangsstruktur nicht.'),
    minus('Du kommentierst, dass alle anderen es ja auch schaffen.', 'Der Vergleich verunsichert und klärt das Problem nicht.')
  ], ['transitions', studentName(ctx.transitionStudent)]));

  s.push(scenario('D15', 'Classroom Management', hasRule('melden'), selectedOrCatalog('melden'), 'Melderegel wird übergangen', 'Mehrere Schüler*innen rufen gleichzeitig Antworten hinein. Die Gesprächsstruktur kippt kurz.', [
    plus(`Du verweist knapp auf die Regel „${ruleText('melden')}“ und gibst danach einer gemeldeten Person das Wort.`, 'Die ausgewählte Regel wird aktiviert und der Gesprächsfluss bleibt erhalten.'),
    zero('Du nimmst eine hineingerufene Antwort auf und stellst die nächste Frage.', 'Inhaltlich geht es weiter, aber das Reinrufen bleibt als Muster bestehen.'),
    minus('Du drohst der ganzen Klasse sofort mit Strafarbeit.', 'Die Reaktion ist pauschal und verschiebt das Problem in Richtung Machtkampf.')
  ], ['Regel melden', hasRule('melden') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D16', 'Classroom Management', hasRule('ausreden'), selectedOrCatalog('ausreden'), 'Ausreden klappt nicht', 'Beim Sammeln von Ideen fallen sich mehrere gegenseitig ins Wort.', [
    plus(`Du stoppst kurz und aktivierst die Regel „${ruleText('ausreden')}“.`, 'Die Gesprächsstruktur wird wieder hergestellt.'),
    zero('Du notierst nur die lautesten Beiträge.', 'Es entsteht ein Ergebnis, aber ruhigere Personen werden weniger beteiligt.'),
    minus('Du lässt alle weiter durcheinanderreden und bewertest dann die Beiträge.', 'Unklare Gesprächsbedingungen verstärken Frust und Konkurrenz.')
  ], ['Regel ausreden', hasRule('ausreden') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D17', 'Classroom Management', hasRule('handy'), selectedOrCatalog('handy'), 'Handyregel wird relevant', `Ein leises Vibrieren ist zu hören. Einige Blicke gehen zu ${studentName(ctx.phoneStudent)}.`, [
    plus(`Du erinnerst ruhig an die Regel „${ruleText('handy')}“ und führst den Blick zurück zur Aufgabe.`, 'Die Regel wird klar, kurz und für alle gleich nachvollziehbar.'),
    zero('Du wartest ab, ob das Geräusch wiederkommt.', 'Die Situation beruhigt sich kurz, aber Regelklarheit entsteht nicht.'),
    minus('Du suchst sofort alle Taschen der Klasse ab.', 'Die Maßnahme ist unverhältnismäßig und erzeugt Misstrauen.')
  ], ['Regel handy', studentName(ctx.phoneStudent), hasRule('handy') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D18', 'Classroom Management', hasRule('platz'), selectedOrCatalog('platz'), 'Umherlaufen ohne Auftrag', 'Eine Person steht wiederholt auf und läuft an mehreren Tischen vorbei.', [
    plus(`Du verweist knapp auf die Regel „${ruleText('platz')}“ und gibst eine konkrete Hilfe-Alternative.`, 'Die Bewegung wird begrenzt und ein legitimer Weg für Bedarf bleibt offen.'),
    zero('Du lässt die Person laufen, solange niemand direkt angesprochen wird.', 'Die Störung bleibt moderat, kann aber übernommen werden.'),
    minus('Du stellst die Person für den Rest der Stunde vor die Tür.', 'Die Maßnahme ist unverhältnismäßig und bricht pädagogische Bearbeitung ab.')
  ], ['Regel platz', hasRule('platz') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D19', 'Classroom Management', hasRule('lautstaerke'), selectedOrCatalog('lautstaerke'), 'Lautstärke steigt', 'Die Lautstärke wächst langsam. Fachliche und private Gespräche mischen sich.', [
    plus(`Du erinnerst an „${ruleText('lautstaerke')}“ und machst einen kurzen Lautstärke-Check.`, 'Die Klasse erhält eine konkrete Rückmeldung und kann sich selbst nachsteuern.'),
    zero('Du schließt die Tür und arbeitest mit einer einzelnen Gruppe weiter.', 'Die Außenwirkung sinkt, aber die Arbeitslautstärke bleibt ungeklärt.'),
    minus('Du erklärst die Klasse für unreif und verbietest Gruppenarbeit.', 'Die Abwertung verhindert Lernen am Gruppenarbeitsprozess.')
  ], ['Regel lautstaerke', hasRule('lautstaerke') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D20', 'Classroom Management', hasRule('respekt'), selectedOrCatalog('respekt'), `${studentName(ctx.sensitiveStudent)} wird ausgelacht`, `${studentName(ctx.sensitiveStudent)} gibt eine unsichere Antwort. Zwei Mitschüler*innen kichern hörbar.`, [
    plus(`Du verweist auf „${ruleText('respekt')}“ und sicherst den Beitrag fachlich wertschätzend ab.`, 'Die Regel schützt die Lernatmosphäre und die betroffene Person bleibt handlungsfähig.'),
    zero('Du übergehst das Kichern und stellst direkt die nächste Fachfrage.', 'Die Stunde geht weiter, aber Unsicherheit bleibt wahrscheinlich bestehen.'),
    minus('Du sagst, Kritik müsse man eben aushalten lernen.', 'Die Verantwortung wird einseitig verschoben; Schutz und Regelklarheit fehlen.')
  ], ['Regel respekt', studentName(ctx.sensitiveStudent), hasRule('respekt') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D21', 'Classroom Management', hasRule('hilfezeichen'), selectedOrCatalog('hilfezeichen'), 'Hilfe wird hineingerufen', 'Mehrere rufen gleichzeitig nach Hilfe. Du kannst nicht erkennen, wer wirklich blockiert ist.', [
    plus(`Du erinnerst an „${ruleText('hilfezeichen')}“ und arbeitest die sichtbaren Signale der Reihe nach ab.`, 'Die Hilfesituation wird geordnet und die Klasse muss nicht lauter werden.'),
    zero('Du gehst zur lautesten Person zuerst.', 'Die akute Lautstärke sinkt, aber lautes Rufen wird eher belohnt.'),
    minus('Du sagst, wer ruft, bekommt heute keine Hilfe mehr.', 'Blockierte Schüler*innen bleiben ohne Unterstützung und die Regel wird zur Strafe.')
  ], ['Regel hilfezeichen', hasRule('hilfezeichen') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D22', 'Classroom Management', hasRule('rollen'), selectedOrCatalog('rollen'), 'Gruppenarbeit ohne Rollen', 'In einer Gruppe arbeiten zwei, während zwei andere nur zusehen.', [
    plus(`Du aktivierst „${ruleText('rollen')}“ und lässt jede Person eine konkrete Teilaufgabe übernehmen.`, 'Die Verantwortlichkeit steigt und Leerlauf wird reduziert.'),
    zero('Du lobst die zwei arbeitenden Schüler*innen und gehst weiter.', 'Die Gruppe produziert etwas, aber passive Beteiligung bleibt bestehen.'),
    minus('Du brichst die Gruppenarbeit für die ganze Klasse ab.', 'Die Reaktion ist pauschal und nimmt funktionierenden Gruppen die Arbeitsform.')
  ], ['Regel rollen', hasRule('rollen') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D23', 'Classroom Management', hasRule('material'), selectedOrCatalog('material'), 'Materialholen wird unruhig', 'Mehrere stehen gleichzeitig auf, um Material zu holen. Der Laufweg wird eng.', [
    plus(`Du stoppst kurz, verweist auf „${ruleText('material')}“ und lässt Gruppen nacheinander starten.`, 'Der Ablauf wird wieder steuerbar und unnötige Bewegung nimmt ab.'),
    zero('Du wartest, bis alle wieder sitzen.', 'Die Unruhe endet irgendwann, aber der Ablauf bleibt unklar.'),
    minus('Du verbietest Materialholen für den Rest der Stunde komplett.', 'Die Maßnahme löst den Ablauf nicht und behindert die Arbeitsfähigkeit.')
  ], ['Regel material', hasRule('material') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D24', 'Classroom Management', hasRule('stoppsignal'), selectedOrCatalog('stoppsignal'), 'Ruhezeichen greift nicht sofort', 'Nach dem Ruhezeichen sprechen einige weiter. Die Arbeitsphase soll ins Plenum zurückgeführt werden.', [
    plus(`Du wartest sichtbar, wiederholst das Signal knapp und aktivierst „${ruleText('stoppsignal')}“.`, 'Das Ritual wird stabilisiert und bleibt berechenbar.'),
    zero('Du beginnst trotz Restgeräuschen mit der Erklärung.', 'Ein Teil hört zu, aber die Steuerbarkeit bleibt eingeschränkt.'),
    minus('Du wirst lauter als die Klasse und schimpfst über fehlenden Respekt.', 'Die Lautstärke steigt und das Ruhezeichen verliert Funktion.')
  ], ['Regel stoppsignal', hasRule('stoppsignal') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D25', 'Classroom Management', hasRule('start'), selectedOrCatalog('start'), 'Stundenbeginn wird unruhig', 'Einige haben Material bereit, andere suchen noch im Rucksack. Der Start verzögert sich.', [
    plus(`Du nutzt „${ruleText('start')}“ und gibst eine kurze sichtbare Startaufgabe.`, 'Der Beginn wird strukturiert und Wartezeiten werden reduziert.'),
    zero('Du wartest, bis alle von selbst fertig sind.', 'Es wird irgendwann ruhiger, aber Leerlauf entsteht.'),
    minus('Du beginnst mit einer langen Beschwerde über fehlende Vorbereitung.', 'Der Einstieg wird negativ aufgeladen und kostet zusätzliche Zeit.')
  ], ['Regel start', hasRule('start') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D26', 'Classroom Management', hasRule('wechsel'), selectedOrCatalog('wechsel'), 'Wechsel der Sozialform kippt', 'Beim Wechsel in Partnerarbeit bewegen sich mehrere gleichzeitig und fragen durcheinander.', [
    plus(`Du stoppst kurz, verweist auf „${ruleText('wechsel')}“ und gibst das Startsignal erneut.`, 'Der Übergang wird wieder berechenbar.'),
    zero('Du beantwortest einzelne Fragen, während andere schon loslegen.', 'Einzelne werden geklärt, aber der Gesamtübergang bleibt unruhig.'),
    minus('Du lässt alle zurück auf Anfang und wertest die Klasse ab.', 'Die Reaktion erzeugt Frust und klärt den Ablauf nicht.')
  ], ['Regel wechsel', hasRule('wechsel') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D27', 'Classroom Management', hasRule('kommentar'), selectedOrCatalog('kommentar'), 'Kommentar über Mitschüler*innen', 'Ein Schüler kommentiert leise: „War ja klar, dass du das nicht kannst.“ Einige hören es.', [
    plus(`Du stoppst den Kommentar und verweist kurz auf „${ruleText('kommentar')}“.`, 'Die soziale Grenze wird klar, ohne den Unterricht unnötig zu verlängern.'),
    zero('Du schaust streng in die Richtung und machst weiter.', 'Das Signal kann reichen, aber die Norm wird nicht ausdrücklich geklärt.'),
    minus('Du lässt die Klasse darüber abstimmen, ob der Kommentar schlimm war.', 'Die betroffene Person wird ausgestellt und die Situation verschärft sich.')
  ], ['Regel kommentar', hasRule('kommentar') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D28', 'Classroom Management', hasRule('meldenplus'), selectedOrCatalog('meldenplus'), 'Warten bis zum Aufruf', `${studentName(ctx.callsOutStudent)} meldet sich, beginnt aber schon zu sprechen, bevor der Aufruf erfolgt.`, [
    plus(`Du verweist knapp auf „${ruleText('meldenplus')}“ und gibst danach geordnet das Wort.`, 'Die Regel wird präzise auf das Verhalten bezogen.'),
    zero('Du lässt den Beitrag zu Ende sprechen.', 'Der Inhalt wird genutzt, aber die Wartestruktur wird geschwächt.'),
    minus('Du verbietest der Person für den Rest der Stunde Beiträge.', 'Das ist unverhältnismäßig und verhindert Beteiligung.')
  ], ['Regel meldenplus', studentName(ctx.callsOutStudent), hasRule('meldenplus') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D29', 'Classroom Management', hasRule('pausen'), selectedOrCatalog('pausen'), 'Private Gespräche laufen weiter', 'Während einer Arbeitsphase entstehen private Seitengespräche, die den Tisch langsam ablenken.', [
    plus(`Du erinnerst an „${ruleText('pausen')}“ und gibst eine klare fachliche Teilaufgabe zurück.`, 'Die Grenze wird benannt und direkt mit Arbeitsorientierung verbunden.'),
    zero('Du ignorierst das Gespräch, solange es leise bleibt.', 'Es stört nicht sofort stark, bleibt aber als Ablenkung bestehen.'),
    minus('Du beschuldigst die Gruppe, absichtlich gegen dich zu arbeiten.', 'Die Aussage personalisiert die Störung und verschärft die Stimmung.')
  ], ['Regel pausen', hasRule('pausen') ? 'gewählt' : 'nicht gewählt']));

  s.push(scenario('D30', 'Kooperative Verhaltensmodifikation', Boolean(ctx.sensitiveStudent), 'student.hidden.sensitive', `${studentName(ctx.sensitiveStudent)} zieht sich zurück`, `${studentName(ctx.sensitiveStudent)} wirkt nach einem Fehler still und beteiligt sich nicht mehr.`, [
    plus(`Du klärst mit ${studentName(ctx.sensitiveStudent)} kurz, welche Rückmeldung hilfreich ist, und vereinbarst ein kleines Beteiligungsziel.`, 'Die emotionale Situation wird ernst genommen und in einen machbaren Schritt übersetzt.'),
    zero('Du lässt die Person in Ruhe und gehst weiter.', 'Das schützt kurzfristig, kann aber Rückzug stabilisieren.'),
    minus('Du forderst sofort eine Antwort vor der Klasse.', 'Der Druck erhöht die Unsicherheit und kann Vermeidung verstärken.')
  ], ['sensitive', studentName(ctx.sensitiveStudent)]));

  s.push(scenario('D31', 'Kooperative Verhaltensmodifikation', Boolean(ctx.conflictStudent), 'student.hidden.conflictWithBoys', `${studentName(ctx.conflictStudent)} reagiert gereizt`, `${studentName(ctx.conflictStudent)} reagiert auf einen Mitschüler gereizt. Die Spannung am Tisch ist sichtbar.`, [
    plus(`Du begrenzt den Kommentar und vereinbarst mit ${studentName(ctx.conflictStudent)} später ein konkretes Ziel für respektvolle Reaktionen.`, 'Der Konflikt wird gestoppt und nicht nur moralisch bewertet.'),
    zero('Du wechselst schnell das Thema und beobachtest weiter.', 'Die Spannung wird nicht größer, bleibt aber unbearbeitet.'),
    minus('Du sagst, die Person solle sich nicht so anstellen.', 'Die Abwertung kann Reizbarkeit verstärken und verhindert Verständigung.')
  ], ['conflictWithBoys', studentName(ctx.conflictStudent)]));

  s.push(scenario('D32', 'Kooperative Verhaltensmodifikation', Boolean(ctx.mediatorStudent), 'student.hidden.mediator', `${studentName(ctx.mediatorStudent)} als Vermittlungsressource`, `${studentName(ctx.mediatorStudent)} sitzt in der Nähe einer angespannten Situation und könnte beruhigend wirken.`, [
    plus('Du nutzt die Ressource dosiert, indem du eine kurze strukturierte Partnerklärung anleitest.', 'Mitschüler*innen werden einbezogen, ohne pädagogische Verantwortung abzugeben.'),
    zero('Du wartest, ob die Situation durch die Nähe von selbst ruhiger wird.', 'Die Ressource bleibt möglich, aber nicht bewusst genutzt.'),
    minus(`${studentName(ctx.mediatorStudent)} soll den Konflikt allein regeln.`, 'Das überfordert die vermittelnde Person und kann neue Spannungen erzeugen.')
  ], ['mediator', studentName(ctx.mediatorStudent)]));

  s.push(scenario('D33', 'Kooperative Verhaltensmodifikation', Boolean(ctx.stabilizerStudent), 'student.hidden.stabilizer', `${studentName(ctx.stabilizerStudent)} arbeitet stabil`, `${studentName(ctx.stabilizerStudent)} hält die Aufgabe gut, während am Nachbartisch Unruhe entsteht.`, [
    plus('Du gibst eine kurze positive Rückmeldung und nutzt das stabile Arbeiten als Orientierung für die nächste Teilaufgabe.', 'Positive Verstärkung macht erwünschtes Verhalten sichtbar, ohne andere bloßzustellen.'),
    zero('Du freust dich innerlich und greifst nicht ein.', 'Das stabile Verhalten bleibt erhalten, wird aber nicht als Ressource genutzt.'),
    minus('Du sagst der stabilen Person, sie müsse jetzt die anderen mitziehen.', 'Das erzeugt Überforderung und verschiebt Verantwortung.')
  ], ['stabilizer', studentName(ctx.stabilizerStudent)]));

  s.push(scenario('D34', 'Kooperative Verhaltensmodifikation', ctx.riskStudents.length > 0, 'riskStudents', `Wiederholtes Muster bei ${studentName(risk)}`, `${studentName(risk)} zeigt zum zweiten Mal ein ähnliches Störmuster. Eine reine Erinnerung reicht wahrscheinlich nicht mehr.`, [
    plus(`Du formulierst mit ${studentName(risk)} ein konkretes Veränderungsziel und legst eine kurze Auswertung nach der Stunde fest.`, 'Das wiederkehrende Verhalten wird systematisch und kooperativ bearbeitet.'),
    zero('Du erinnerst noch einmal an die Arbeitsphase.', 'Das kann kurzfristig reichen, bleibt aber bei Wiederholung zu dünn.'),
    minus('Du wertest die Person als grundsätzlich schwierig.', 'Die Zuschreibung verhindert eine veränderbare Zielperspektive.')
  ], ['riskStudents', studentName(risk)]));

  s.push(scenario('D35', 'Kooperative Verhaltensmodifikation', true, 'cooperative-diagnosis', 'Ursache bleibt unklar', 'Eine Störung tritt auf, aber der Auslöser ist nicht eindeutig: Aufgabe, Sitznachbarschaft oder Aufmerksamkeit könnten eine Rolle spielen.', [
    plus('Du sammelst kurz Beobachtungen und klärst mit der betroffenen Person, was der Auslöser gewesen sein könnte.', 'Die Intervention beginnt mit kooperativer Diagnose statt vorschneller Sanktion.'),
    zero('Du wartest ab, ob es einmalig bleibt.', 'Das ist möglich, aber bei Wiederholung fehlt eine Grundlage.'),
    minus('Du legst sofort eine Strafe fest, ohne den Auslöser zu klären.', 'Die Maßnahme kann am eigentlichen Problem vorbeigehen.')
  ], ['kooperative Diagnose']));

  s.push(scenario('D36', 'Kooperative Verhaltensmodifikation', true, 'goal-setting', 'Ziel muss konkret werden', 'Eine Schülerin sagt: „Ich störe doch gar nicht.“ Das Verhalten ist aber wiederholt beobachtbar.', [
    plus('Du beschreibst neutral, was beobachtbar war, und übersetzt es in ein kleines Ziel für die nächste Phase.', 'So wird aus Vorwurf eine überprüfbare Zielvereinbarung.'),
    zero('Du sagst, ihr redet später darüber.', 'Das kann deeskalieren, bleibt aber noch unkonkret.'),
    minus('Du sagst: „Doch, du störst immer.“', 'Die Verallgemeinerung provoziert Verteidigung statt Veränderung.')
  ], ['Zielvereinbarung']));

  s.push(scenario('D37', 'Kooperative Verhaltensmodifikation', true, 'self-monitoring', 'Selbstbeobachtung einsetzen', 'Ein Verhalten tritt nicht ständig auf, aber immer wieder in bestimmten Phasen.', [
    plus('Du vereinbarst eine kurze Selbstbeobachtung: Wann klappt es, wann wird es schwierig?', 'Das macht Muster sichtbar und beteiligt die Person an der Veränderung.'),
    zero('Du beobachtest es allein weiter.', 'Du bekommst Informationen, aber die Person wird noch nicht beteiligt.'),
    minus('Du kündigst an, jeden Fehler sofort zu notieren.', 'Das wirkt kontrollierend und kann Widerstand erzeugen.')
  ], ['Selbstbeobachtung']));

  s.push(scenario('D38', 'Kooperative Verhaltensmodifikation', true, 'reinforcement', 'Verstärkung planen', 'Ein vereinbartes Ziel wurde in der ersten Arbeitsphase teilweise erreicht.', [
    plus('Du gibst eine konkrete Rückmeldung zum erreichten Verhalten und vereinbarst, woran weitergearbeitet wird.', 'Positive Rückmeldung stabilisiert Veränderung und bleibt lernorientiert.'),
    zero('Du nimmst es zur Kenntnis und gehst zur nächsten Aufgabe.', 'Das Ziel bleibt bestehen, wird aber nicht gestärkt.'),
    minus('Du betonst nur, was noch nicht geklappt hat.', 'Die Veränderung wird entwertet und Motivation sinkt.')
  ], ['Rückmeldung', 'Verstärkung']));

  s.push(scenario('D39', 'Kooperative Verhaltensmodifikation', true, 'evaluation', 'Kurze Auswertung nach der Phase', 'Die Arbeitsphase endet. Ein zuvor vereinbartes Verhalten soll kurz ausgewertet werden.', [
    plus('Du fragst knapp: Was hat geholfen, was war schwierig, was gilt als nächster Schritt?', 'Die Auswertung macht den Veränderungsprozess transparent und anschlussfähig.'),
    zero('Du beendest die Phase pünktlich ohne Rückblick.', 'Der Ablauf bleibt sauber, aber die Intervention verliert Anschluss.'),
    minus('Du bewertest nur öffentlich, ob es gut oder schlecht war.', 'Die Auswertung wird zur Bloßstellung statt zur gemeinsamen Reflexion.')
  ], ['Auswertung']));

  s.push(scenario('D40', 'Kooperative Verhaltensmodifikation', true, 'lessonReflection', 'Stunde endet mit Restspannung', 'Die Stunde endet, aber ein wiederkehrendes Problem ist noch nicht abschließend gelöst.', [
    plus('Du hältst kurz fest, welches Ziel in der nächsten Stunde weiter gilt und welche Unterstützung dafür vereinbart wurde.', 'Der Prozess bleibt kooperativ und wird nicht einfach abgebrochen.'),
    zero('Du beendest die Stunde pünktlich und beobachtest es beim nächsten Mal erneut.', 'Es eskaliert nicht, aber der Prozess bleibt offen.'),
    minus('Du beendest die Stunde mit einer pauschalen Drohung für das nächste Mal.', 'Die nächste Stunde startet mit Druck statt mit geklärtem Ziel.')
  ], ['Reflexion', 'Folgeziel']));

  return s.slice(0, 40);
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
const SCORE_PER_LIFE = 500;
const SCORE_GOOD_ANSWER = 200;
const SCORE_BAD_ANSWER = -200;
const TRASH_EVENT_CHANCE = 0.28;

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
  game.nextIncidentAt = Date.now() + randomInt(3000, 5000);
  game.dynamicTrash = [];
  game.cleaningMode = false;
  game.teacherPath = [];
  game.teacherMoveStepIndex = 0;
  if (startLessonBtn) {
    startLessonBtn.disabled = true;
    startLessonBtn.textContent = 'Unterricht läuft';
  }
  logEvent('Der Unterricht beginnt. Reagiere auf blinkende Störungen innerhalb von 7 Sekunden.', 'info');
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

function maybeSpawnIncident() {
  if (!game.started || game.finished || game.scenarioOpen) return;
  const now = Date.now();
  if (now < game.nextIncidentAt) return;
  const limit = currentDifficultyLimit();
  const freeSlots = Math.max(0, limit - game.activeIncidents.length);
  if (freeSlots > 0) {
    const spawnCount = Math.max(1, Math.min(freeSlots, progressBasedSpawnCount()));
    for (let i = 0; i < spawnCount; i++) spawnRandomIncident();
  }
  const delay = game.lessonLeft < 90 ? randomInt(3000, 4000) : randomInt(3500, 5000);
  game.nextIncidentAt = now + delay;
}

function progressBasedSpawnCount() {
  const limit = currentDifficultyLimit();
  if (limit === 3 && Math.random() < 0.45) return 3;
  if (limit >= 2 && Math.random() < 0.55) return 2;
  return 1;
}


function spawnRandomIncident() {
  const preferTrash = Math.random() < TRASH_EVENT_CHANCE;
  if (preferTrash && spawnTrashIncident()) return;
  spawnIncident();
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
  return Math.max(Math.abs((desk?.row ?? 0) - game.teacher.row), Math.abs((desk?.col ?? 0) - game.teacher.col)) <= 1;
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
        if (game.teacher.row === row && game.teacher.col === col) continue;
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
    deadline: Date.now() + INCIDENT_REACTION_MS,
    handled: false,
    escalation: 'Der Müll bleibt liegen, blockiert weiter den Laufweg und verstärkt die Unruhe im Raum.'
  };
  game.dynamicTrash.push({ id, type: 'trash', row: candidate.row, col: candidate.col, removed: false });
  game.activeIncidents.push(incident);
  playAlertAudio();
  logEvent(`Müll taucht nahe bei ${candidate.nearStudent.name} auf. Aktiviere unten rechts den Besen und entferne den Müll innerhalb von 7 Sekunden.`, 'warn');
  renderBranchGame();
  renderIncidents();
  return true;
}

function pickIncidentCandidate() {
  const seatedStudents = context.students
    .map(student => ({ student, desk: context.deskByStudentId[student.id] }))
    .filter(item => item.desk)
    .filter(item => !game.activeIncidents.some(incident => incident.kind === 'student' && incident.student?.id === item.student.id));
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

function pickScenarioForStudent(student) {
  const nameMatches = SCENARIOS.filter(item => item.scene.includes(student.name) || item.title.includes(student.name) || (item.focus || []).includes(student.name));
  const matched = nameMatches.length ? nameMatches : SCENARIOS.filter(item => item.matched);
  const pool = matched.length ? matched : SCENARIOS;
  const unused = pool.filter(item => !game.usedScenarioIds.has(item.id));
  const scenarioItem = (unused.length ? unused : pool)[randomInt(0, (unused.length ? unused : pool).length - 1)];
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
  const expired = game.activeIncidents.filter(incident => now >= incident.deadline);
  expired.forEach(incident => failIncidentLate(incident));
}

function failIncidentLate(incident) {
  removeIncident(incident.id);
  if (incident.kind === 'trash') {
    removeDynamicTrash(incident.id);
    addHighscoreEvent(0, 'Müll nicht rechtzeitig entfernt, keine Reaktionspunkte.', 'neutral');
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

function renderBranchGame() {
  if (!branchGrid) return;
  const rows = context.stepData?.rows || 9;
  const cols = context.stepData?.cols || 10;
  branchGrid.style.setProperty('--branch-cols', cols);
  branchGrid.style.setProperty('--branch-rows', rows);
  branchGrid.innerHTML = '';
  const blockedGroups = buildBlockedGroups(context.stepData?.blockedCells || []);
  const activeByStudent = new Map(game.activeIncidents.filter(incident => incident.kind !== 'trash' && incident.student).map(incident => [incident.student.id, incident]));
  const activeTrashByCell = new Map(game.activeIncidents.filter(incident => incident.kind === 'trash').map(incident => [`${incident.row},${incident.col}`, incident]));

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
        const activeIncident = student ? activeByStudent.get(student.id) : null;
        const deskEl = document.createElement('div');
        deskEl.className = `branch-desk${activeIncident ? ' incident-pulse' : ''}${student ? ' has-student' : ''}`;
        if (student) {
          deskEl.innerHTML = `${studentAvatarMarkup(student, 'branch-student-avatar', ' am Tisch')}${activeIncident ? `<strong class="incident-countdown-number">${Math.max(0, Math.ceil((activeIncident.deadline - Date.now()) / 1000))}</strong>` : '<strong class="sr-only">'+ escapeHtml(student.name) +'</strong>'}`;
        } else {
          deskEl.innerHTML = `<strong>frei</strong>`;
        }
        if (activeIncident) {
          const left = Math.max(0, Math.ceil((activeIncident.deadline - Date.now()) / 1000));
          cell.setAttribute('aria-label', `${student.name}: Störung, noch ${left} Sekunden`);
        }
        cell.appendChild(deskEl);
        if (student) cell.dataset.studentId = student.id;
      }

      const object = getObjectAtLocal(row, col);
      if (object) {
        const obj = document.createElement('span');
        const trashIncident = object.type === 'trash' ? activeTrashByCell.get(`${row},${col}`) : null;
        obj.className = `branch-object branch-object-${object.type}${game.cleaningMode && object.type === 'broom' ? ' active-cleaning' : ''}`;
        obj.innerHTML = `${object.type === 'broom' ? '🧹' : '🗑️'}${trashIncident ? `<strong class="incident-countdown-badge">${Math.max(0, Math.ceil((trashIncident.deadline - Date.now()) / 1000))}</strong>` : ''}`;
        cell.appendChild(obj);
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
  if (Date.now() > incident.deadline) {
    game.cleaningMode = false;
    failIncidentLate(incident);
    return;
  }
  const points = reactionPointsForIncident(incident);
  removeIncident(incident.id);
  removeDynamicTrash(incident.id);
  game.cleaningMode = false;
  addHighscoreEvent(points, 'Müll rechtzeitig entfernt.', points > 0 ? 'good' : 'neutral');
  playGoodAudio();
  logEvent(`Der Weg nahe bei ${incident.student?.name || 'einem Tisch'} ist wieder frei.`, 'good');
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
  if (!game.activeIncidents.length || game.scenarioOpen || game.teacherMoveTimer) return;
  const reachable = game.activeIncidents.find(incident => incident.kind !== 'trash' && manhattan(game.teacher, incident.desk) <= 1);
  if (!reachable) return;
  if (Date.now() > reachable.deadline) {
    failIncidentLate(reachable);
    return;
  }
  const reactionPoints = reactionPointsForIncident(reachable);
  addHighscoreEvent(reactionPoints, `${reachable.student.name}: rechtzeitig erreicht (${reactionPoints} Reaktionspunkte).`, reactionPoints > 0 ? 'good' : 'neutral');
  removeIncident(reachable.id);
  stopTeacherMovement();
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
  const adjusted = scenarioItem.answers.map(answer => {
    if (answer.delta < 0) return { ...answer, text: makePlausibleMisconception(scenarioItem, answer), feedback: makeNegativeConsequence(scenarioItem, answer) };
    if (answer.delta > 0) return { ...answer, text: makeLessObviousPositive(scenarioItem, answer) };
    return { ...answer, text: makeNeutralOption(scenarioItem, answer) };
  });
  return shuffle(adjusted);
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
    game.activeIncidents.forEach(incident => { incident.deadline += pauseDuration; });
  }
  game.pausedAt = null;
  game.scenarioOpen = false;
  game.currentScenarioIncident = null;
  if (!game.finished) game.nextIncidentAt = Date.now() + randomInt(3000, 5000);
  renderBranchGame();
}

function renderIncidents() {
  if (incidentCounter) incidentCounter.textContent = String(game.activeIncidents.length);
  const now = Date.now();
  const cards = game.activeIncidents.map(incident => {
    const left = Math.max(0, Math.ceil((incident.deadline - now) / 1000));
    if (incident.kind === 'trash') {
      return `<article class="incident-item event-card"><strong>Müll</strong><span>${left}s bis Eskalation</span><small>nahe bei ${escapeHtml(incident.student?.name || 'einem Tisch')}</small></article>`;
    }
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
