const TOTAL_RULES = 15;
const REQUIRED_ACCEPTED = 6;
const REQUIRED_REJECTED = 9;

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

const rules = [
  { id: 'melden', text: 'Wir melden uns, bevor wir sprechen.', hint: 'Relevant bei Zwischenrufen und Plenumsgesprächen.' },
  { id: 'ausreden', text: 'Wir hören einander ausreden.', hint: 'Stützt Gesprächsführung und reduziert Unterbrechungen.' },
  { id: 'handy', text: 'Handys bleiben während des Unterrichts in der Tasche.', hint: 'Relevant bei verdecktem Off-Task-Verhalten.' },
  { id: 'platz', text: 'Während Arbeitsphasen bleiben wir am Platz, außer es gibt einen Auftrag.', hint: 'Relevant bei Umherlaufen und vermeidender Bewegung.' },
  { id: 'lautstaerke', text: 'Wir sprechen in Arbeitsphasen in angemessener Lautstärke.', hint: 'Relevant für Gruppenarbeit und Partnerarbeit.' },
  { id: 'respekt', text: 'Wir gehen respektvoll mit Fehlern und Beiträgen anderer um.', hint: 'Relevant bei Spott, Kritikempfindlichkeit und Konflikten.' },
  { id: 'hilfezeichen', text: 'Wenn wir Hilfe brauchen, nutzen wir zuerst das vereinbarte Hilfesignal.', hint: 'Reduziert Reinrufen und ungeplantes Aufstehen.' },
  { id: 'rollen', text: 'Bei Gruppenarbeit hat jede Person eine klare Aufgabe.', hint: 'Stärkt Verantwortlichkeit und verhindert Leerlauf.' },
  { id: 'material', text: 'Material wird nur nach dem vereinbarten Ablauf geholt.', hint: 'Relevant für Übergänge und Bewegung im Raum.' },
  { id: 'stoppsignal', text: 'Beim Ruhezeichen stoppen wir Gespräche und richten den Blick nach vorne.', hint: 'Sichert Steuerbarkeit bei Unruhe.' },
  { id: 'start', text: 'Zu Beginn liegt das Arbeitsmaterial bereit und die Startaufgabe wird bearbeitet.', hint: 'Stärkt Unterrichtsfluss und reduziert Anfangsunruhe.' },
  { id: 'wechsel', text: 'Beim Wechsel der Sozialform warten wir auf das Startsignal.', hint: 'Relevant bei Übergängen in Partner- oder Gruppenarbeit.' },
  { id: 'kommentar', text: 'Kommentare über Mitschüler*innen werden unterlassen.', hint: 'Relevant bei Provokation und empfindlichen Schüler*innen.' },
  { id: 'meldenplus', text: 'Wer sprechen möchte, meldet sich und wartet, bis er oder sie aufgerufen wird.', hint: 'Ähnlich zur Melde-Regel; könnte redundant sein.' },
  { id: 'pausen', text: 'Private Gespräche werden auf Pausen verschoben.', hint: 'Relevant bei Ablenkung von Sitznachbar*innen.' }
];

const defaultStep1 = {
  rows: 9,
  cols: 10,
  students: fallbackStudents,
  preparationScore: null,
  rawPreparationScore: null,
  chosenLayout: { key: 'rows', label: 'Reihensitzordnung' },
  teacher: { row: 1, col: 4, dir: 'down', mode: 'frontStanding' },
  desks: [[2,1], [2,3], [2,6], [2,8], [4,1], [4,3], [4,6], [4,8], [6,3], [6,6]].map((pos, index) => ({ id: `desk-${index + 1}`, row: pos[0], col: pos[1] })),
  assignments: {}
};

const step1Data = loadStep1Data();
const ruleState = {
  currentIndex: 0,
  currentRuleId: rules[0].id,
  lists: { accepted: [], pending: [], rejected: [] },
  dragRuleId: null,
  dragSource: null
};

const frozenGrid = document.getElementById('frozenGrid');
const studentList = document.getElementById('rulesStudentList');
const prepScorePill = document.getElementById('prepScorePill');
const chosenValue = document.getElementById('rulesChosenValue');
const progressText = document.getElementById('ruleDeckProgress');
const currentRuleCard = document.getElementById('currentRuleCard');
const currentRuleText = document.getElementById('currentRuleText');
const currentRuleHint = document.getElementById('currentRuleHint');
const acceptedList = document.getElementById('acceptedList');
const pendingList = document.getElementById('pendingList');
const rejectedList = document.getElementById('rejectedList');
const acceptedCounter = document.getElementById('acceptedCounter');
const pendingCounter = document.getElementById('pendingCounter');
const rejectedCounter = document.getElementById('rejectedCounter');
const statusText = document.getElementById('rulesStatusText');
const finishBtn = document.getElementById('finishRulesBtn');
const backBtn = document.getElementById('backToRoomBtn');

function loadStep1Data() {
  try {
    const raw = localStorage.getItem('classroomGame.step1');
    if (!raw) return defaultStep1;
    return { ...defaultStep1, ...JSON.parse(raw) };
  } catch (error) {
    console.warn('Schritt-1-Daten konnten nicht gelesen werden:', error);
    return defaultStep1;
  }
}

function getStudent(id) {
  return (step1Data.students || fallbackStudents).find(student => student.id === id);
}

function getBlockedCell(row, col) {
  return (step1Data.blockedCells || []).find(item => item.row === row && item.col === col) || null;
}

function buildBlockedGroups() {
  const groups = [];
  const cells = step1Data.blockedCells || [];
  const visited = new Set();

  cells.forEach(cell => {
    const key = `${cell.row},${cell.col},${cell.type}`;
    if (visited.has(key)) return;

    const horizontal = cells.filter(c => c.type === cell.type && c.row === cell.row).sort((a, b) => a.col - b.col);
    const vertical = cells.filter(c => c.type === cell.type && c.col === cell.col).sort((a, b) => a.row - b.row);

    const hRun = [cell];
    let col = cell.col - 1;
    while (horizontal.some(c => c.col === col)) { hRun.unshift(horizontal.find(c => c.col === col)); col -= 1; }
    col = cell.col + 1;
    while (horizontal.some(c => c.col === col)) { hRun.push(horizontal.find(c => c.col === col)); col += 1; }

    const vRun = [cell];
    let row = cell.row - 1;
    while (vertical.some(c => c.row === row)) { vRun.unshift(vertical.find(c => c.row === row)); row -= 1; }
    row = cell.row + 1;
    while (vertical.some(c => c.row === row)) { vRun.push(vertical.find(c => c.row === row)); row += 1; }

    const groupCells = hRun.length >= vRun.length ? hRun : vRun;
    groupCells.forEach(gc => visited.add(`${gc.row},${gc.col},${gc.type}`));

    const rows = groupCells.map(c => c.row);
    const cols = groupCells.map(c => c.col);
    groups.push({
      id: `${cell.type}-${Math.min(...rows)}-${Math.min(...cols)}`,
      type: cell.type,
      label: cell.label,
      cells: groupCells,
      minRow: Math.min(...rows),
      maxRow: Math.max(...rows),
      minCol: Math.min(...cols),
      maxCol: Math.max(...cols),
      rowSpan: Math.max(...rows) - Math.min(...rows) + 1,
      colSpan: Math.max(...cols) - Math.min(...cols) + 1
    });
  });

  return groups;
}

function getBlockedGroupAt(row, col) {
  return buildBlockedGroups().find(group => group.cells.some(cell => cell.row === row && cell.col === col)) || null;
}

function isBlockedGroupAnchor(group, row, col) {
  return Boolean(group) && group.minRow === row && group.minCol === col;
}

function formatBlockedLabel(group) {
  if (group.type === 'sink') return 'Wasch-<br>becken';
  if (group.type === 'exit') return 'Notaus-<br>gang';
  return group.label;
}

function getRoomObjectAt(row, col) {
  const broom = step1Data.objects?.broom;
  if (broom && broom.row === row && broom.col === col) return broom;
  return (step1Data.objects?.trash || []).find(item => !item.removed && item.row === row && item.col === col) || null;
}

function init() {
  restoreRuleState();
  renderFrozenGrid();
  renderStudents();
  renderRules();
  bindEvents();
}

function restoreRuleState() {
  try {
    const raw = localStorage.getItem('classroomGame.step2.rulesDraft');
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved || !saved.lists) return;
    ruleState.currentIndex = Number(saved.currentIndex || 0);
    ruleState.currentRuleId = saved.currentRuleId || rules[ruleState.currentIndex]?.id || null;
    ruleState.lists = {
      accepted: Array.isArray(saved.lists.accepted) ? saved.lists.accepted.filter(isValidRuleId) : [],
      pending: Array.isArray(saved.lists.pending) ? saved.lists.pending.filter(isValidRuleId) : [],
      rejected: Array.isArray(saved.lists.rejected) ? saved.lists.rejected.filter(isValidRuleId) : []
    };
    removeDuplicateAssignments();
  } catch (error) {
    console.warn('Regelentwurf konnte nicht geladen werden:', error);
  }
}

function isValidRuleId(id) { return rules.some(rule => rule.id === id); }
function getRule(id) { return rules.find(rule => rule.id === id); }

function removeDuplicateAssignments() {
  const seen = new Set();
  ['accepted', 'pending', 'rejected'].forEach(listName => {
    ruleState.lists[listName] = ruleState.lists[listName].filter(id => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  });
}

function renderFrozenGrid() {
  if (prepScorePill) {
    const value = step1Data.rawPreparationScore ?? step1Data.preparationScore;
    prepScorePill.textContent = value === null || value === undefined ? '– Punkte' : `${value} Punkte`;
  }
  const rows = step1Data.rows || 9;
  const cols = step1Data.cols || 10;
  frozenGrid.style.setProperty('--frozen-cols', cols);
  frozenGrid.style.setProperty('--frozen-rows', rows);
  frozenGrid.innerHTML = '';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = document.createElement('div');
      cell.className = 'frozen-cell';
      const block = getBlockedCell(row, col);
      const blockGroup = block ? getBlockedGroupAt(row, col) : null;
      if (block) {
        cell.classList.add('frozen-blocked', `frozen-blocked-${block.type}`);
        if (blockGroup && isBlockedGroupAnchor(blockGroup, row, col)) {
          const blockEl = document.createElement('span');
          const sideLabel = ['window', 'door', 'exit'].includes(blockGroup.type);
          blockEl.className = `frozen-blocked-label ${sideLabel ? 'side-label' : ''}`;
          blockEl.style.setProperty('--frozen-span-cols', String(blockGroup.colSpan));
          blockEl.style.setProperty('--frozen-span-rows', String(blockGroup.rowSpan));
          blockEl.innerHTML = `<span>${formatBlockedLabel(blockGroup)}</span>`;
          cell.appendChild(blockEl);
        }
      }
      const desk = (step1Data.desks || []).find(item => item.row === row && item.col === col);
      if (desk) {
        const deskEl = document.createElement('div');
        deskEl.className = 'frozen-desk';
        const studentId = step1Data.assignments?.[desk.id];
        const student = studentId ? getStudent(studentId) : null;
        deskEl.innerHTML = `<span>${desk.id.replace('desk-', 'T')}</span><strong>${student ? student.name : 'frei'}</strong>`;
        cell.appendChild(deskEl);
      }
      const object = getRoomObjectAt(row, col);
      if (object) {
        const objectEl = document.createElement('span');
        objectEl.className = `frozen-object frozen-object-${object.type}`;
        objectEl.textContent = object.type === 'broom' ? '🧹' : '🗑️';
        cell.appendChild(objectEl);
      }
      const teacher = step1Data.teacher || {};
      if (teacher.row === row && teacher.col === col) {
        const teacherEl = document.createElement('div');
        teacherEl.className = 'frozen-teacher';
        teacherEl.textContent = teacherArrow(teacher.dir);
        cell.appendChild(teacherEl);
      }
      frozenGrid.appendChild(cell);
    }
  }
}

function teacherArrow(dir) {
  return ({ up: 'L↑', down: 'L↓', left: 'L←', right: 'L→' })[dir] || 'L';
}

function renderStudents() {
  studentList.innerHTML = '';
  (step1Data.students || fallbackStudents).forEach(student => {
    const item = document.createElement('article');
    item.className = 'rules-student-card';
    const deskId = Object.entries(step1Data.assignments || {}).find(([, sid]) => sid === student.id)?.[0] || null;
    const desk = deskId ? (step1Data.desks || []).find(d => d.id === deskId) : null;
    item.innerHTML = `<strong>${student.name} (${student.age})</strong><span>${student.note}</span><small>${desk ? `Platz: Reihe ${desk.row + 1}, Feld ${desk.col + 1}` : 'nicht platziert'}</small>`;
    studentList.appendChild(item);
  });
}

function renderRules() {
  renderCurrentRule();
  renderList('accepted', acceptedList);
  renderList('pending', pendingList);
  renderList('rejected', rejectedList);
  updateCountersAndStatus();
  saveDraft();
}

function renderCurrentRule() {
  const assignedCount = getAssignedRuleIds().length;
  const current = getCurrentRule();
  currentRuleCard.classList.toggle('empty-deck', !current);
  if (current) {
    currentRuleCard.hidden = false;
    currentRuleCard.dataset.ruleId = current.id;
    currentRuleCard.draggable = true;
    progressText.textContent = `Regel ${assignedCount + 1}/${TOTAL_RULES}`;
    currentRuleText.textContent = current.text;
    currentRuleHint.textContent = 'Ziehe diese Regel in eine Liste.';
  } else {
    currentRuleCard.hidden = false;
    currentRuleCard.removeAttribute('data-rule-id');
    currentRuleCard.draggable = false;
    progressText.textContent = 'Alle 15 Regeln zugeordnet';
    currentRuleText.textContent = 'Keine neue Regel mehr im Stapel.';
    currentRuleHint.textContent = 'Sortiere die Listen um, bis genau sechs Klassenregeln gewählt sind und „Später zuordnen“ leer ist.';
  }
}

function getCurrentRule() {
  const assigned = new Set(getAssignedRuleIds());
  if (ruleState.currentRuleId && !assigned.has(ruleState.currentRuleId)) return getRule(ruleState.currentRuleId);
  const next = rules.find(rule => !assigned.has(rule.id));
  ruleState.currentRuleId = next ? next.id : null;
  return next || null;
}

function getAssignedRuleIds() {
  return [...ruleState.lists.accepted, ...ruleState.lists.pending, ...ruleState.lists.rejected];
}

function renderList(listName, container) {
  container.innerHTML = '';
  ruleState.lists[listName].forEach(ruleId => {
    const rule = getRule(ruleId);
    if (!rule) return;
    const card = document.createElement('article');
    card.className = `rule-item ${listName}`;
    card.draggable = true;
    card.dataset.ruleId = rule.id;
    card.dataset.source = listName;
    card.innerHTML = `<strong>${rule.text}</strong>`;
    card.title = 'Per Drag & Drop in eine andere Liste ziehen.';
    card.addEventListener('dragstart', event => startRuleDrag(event, rule.id, listName));
    card.addEventListener('dragend', clearRuleDrag);
    container.appendChild(card);
  });
}

function bindEvents() {
  currentRuleCard.addEventListener('dragstart', event => {
    const current = getCurrentRule();
    if (!current) return;
    startRuleDrag(event, current.id, 'current');
  });
  currentRuleCard.addEventListener('dragend', clearRuleDrag);

  document.querySelectorAll('.rule-dropzone').forEach(zone => {
    zone.addEventListener('dragover', event => {
      if (!ruleState.dragRuleId) return;
      event.preventDefault();
      zone.classList.add('drop-hover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drop-hover'));
    zone.addEventListener('drop', event => {
      event.preventDefault();
      zone.classList.remove('drop-hover');
      moveRule(ruleState.dragRuleId, zone.dataset.list);
      clearRuleDrag();
    });
  });

  finishBtn.addEventListener('click', finishRules);
  backBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
}

function startRuleDrag(event, ruleId, source) {
  ruleState.dragRuleId = ruleId;
  ruleState.dragSource = source;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('ruleId', ruleId);
  event.dataTransfer.setData('source', source);
}

function clearRuleDrag() {
  ruleState.dragRuleId = null;
  ruleState.dragSource = null;
  document.querySelectorAll('.rule-dropzone.drop-hover').forEach(el => el.classList.remove('drop-hover'));
}

function moveRule(ruleId, targetList) {
  if (!isValidRuleId(ruleId) || !['accepted', 'pending', 'rejected'].includes(targetList)) return;
  const currentList = findRuleList(ruleId);
  if (targetList === 'accepted' && currentList !== 'accepted' && ruleState.lists.accepted.length >= REQUIRED_ACCEPTED) {
    setStatus('Die Klassenregel-Liste ist voll. Entferne zuerst eine Regel aus dieser Liste.', 'warning');
    return;
  }

  ['accepted', 'pending', 'rejected'].forEach(list => {
    ruleState.lists[list] = ruleState.lists[list].filter(id => id !== ruleId);
  });
  ruleState.lists[targetList].push(ruleId);

  if (ruleState.currentRuleId === ruleId) {
    const next = rules.find(rule => !getAssignedRuleIds().includes(rule.id));
    ruleState.currentRuleId = next ? next.id : null;
  }
  renderRules();
}

function findRuleList(ruleId) {
  return ['accepted', 'pending', 'rejected'].find(list => ruleState.lists[list].includes(ruleId)) || null;
}

function updateCountersAndStatus() {
  const accepted = ruleState.lists.accepted.length;
  const pending = ruleState.lists.pending.length;
  const rejected = ruleState.lists.rejected.length;
  const assigned = accepted + pending + rejected;
  chosenValue.textContent = `${accepted}/${REQUIRED_ACCEPTED}`;
  acceptedCounter.textContent = `${accepted}/${REQUIRED_ACCEPTED}`;
  pendingCounter.textContent = `${pending}`;
  rejectedCounter.textContent = `${rejected}/${REQUIRED_REJECTED}`;

  const valid = assigned === TOTAL_RULES && accepted === REQUIRED_ACCEPTED && rejected === REQUIRED_REJECTED && pending === 0;
  finishBtn.disabled = !valid;

  if (valid) {
    setStatus('Regelauswahl vollständig: sechs verbindliche Regeln, neun aussortierte Regeln, keine offenen Regeln.', 'ready');
  } else if (accepted > REQUIRED_ACCEPTED) {
    setStatus('Zu viele Klassenregeln. Es dürfen genau sechs sein.', 'warning');
  } else if (assigned < TOTAL_RULES) {
    setStatus(`Noch ${TOTAL_RULES - assigned} Regel${TOTAL_RULES - assigned === 1 ? '' : 'n'} zuordnen.`, 'neutral');
  } else if (pending > 0) {
    setStatus('Die Liste „Später zuordnen“ muss am Ende leer sein.', 'warning');
  } else if (accepted < REQUIRED_ACCEPTED) {
    setStatus(`Es fehlen noch ${REQUIRED_ACCEPTED - accepted} verbindliche Klassenregel${REQUIRED_ACCEPTED - accepted === 1 ? '' : 'n'}.`, 'warning');
  } else if (rejected !== REQUIRED_REJECTED) {
    setStatus('In der Aussortiert-Liste müssen genau neun Regeln liegen.', 'warning');
  }
}

function setStatus(message, tone = 'neutral') {
  statusText.textContent = message;
  statusText.className = `rules-status ${tone}`;
}

function saveDraft() {
  try {
    localStorage.setItem('classroomGame.step2.rulesDraft', JSON.stringify({
      currentIndex: ruleState.currentIndex,
      currentRuleId: ruleState.currentRuleId,
      lists: ruleState.lists
    }));
  } catch (error) {
    console.warn('Regelentwurf konnte nicht gespeichert werden:', error);
  }
}

function finishRules() {
  const data = {
    version: 1,
    savedAt: new Date().toISOString(),
    acceptedRules: ruleState.lists.accepted.map(getRule),
    rejectedRules: ruleState.lists.rejected.map(getRule),
    pendingRules: ruleState.lists.pending.map(getRule),
    acceptedRuleIds: ruleState.lists.accepted,
    rejectedRuleIds: ruleState.lists.rejected,
    pendingRuleIds: ruleState.lists.pending,
    step1: step1Data
  };
  try {
    localStorage.setItem('classroomGame.step2.rules', JSON.stringify(data));
    setStatus('Regelauswahl gespeichert. Schritt 3 wird geöffnet.', 'ready');
    finishBtn.textContent = 'Weiter zu Schritt 3';
    window.location.href = 'scenarios.html';
  } catch (error) {
    setStatus('Speichern fehlgeschlagen. Bitte prüfe den lokalen Speicher des Browsers.', 'warning');
  }
}

init();
