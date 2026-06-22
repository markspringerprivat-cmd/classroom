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
const SCENARIOS = buildDynamicScenarios(context);

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

  return {
    stepData,
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
      return `<li><strong>${escapeHtml(student.name)} (${student.age})</strong><span>${escapeHtml(student.note || '')}</span><small>${escapeHtml(place)}${markers.length ? ` · ${markers.join(', ')}` : ''}</small></li>`;
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
      <p class="scenario-scene">${escapeHtml(scenarioItem.scene)}</p>
      ${scenarioItem.contextNote ? `<p class="scenario-context-note">${escapeHtml(scenarioItem.contextNote)}</p>` : ''}
      <div class="scenario-focus">${(scenarioItem.focus || []).map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div>
      <div class="scenario-answers">
        ${scenarioItem.answers.map(answer => `
          <div class="scenario-answer delta-${answer.delta > 0 ? 'plus' : answer.delta < 0 ? 'minus' : 'zero'}">
            <strong>${answer.delta > 0 ? '+1' : answer.delta < 0 ? '-1' : '0'}</strong>
            <p>${escapeHtml(answer.text)}</p>
            <small>${escapeHtml(answer.feedback)}</small>
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

init();
