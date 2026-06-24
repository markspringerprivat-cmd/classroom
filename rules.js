const TOTAL_RULES = 15;
const REQUIRED_ACCEPTED = 5;
const REQUIRED_REJECTED = 10;

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

const rules = [
  { id: 'help-signal', text: 'Wenn wir Hilfe brauchen, nutzen wir zuerst das vereinbarte Hilfesignal.', hint: 'Strukturiert Hilfen im Unterricht.', tone: 'neutral' },
  { id: 'phone-away', text: 'Handys bleiben während des Unterrichts ausgeschaltet in der Tasche.', hint: 'Passt besonders zu Niklas.', tone: 'beneficial', targetStudent: 'niklas' },
  { id: 'free-walk', text: 'Wer fertig ist, darf ohne Rückfrage durch den Raum laufen.', hint: 'Fördert eher Unruhe und Ablenkung.', tone: 'harmful' },
  { id: 'focus-neighbours', text: 'Während Arbeitsphasen arbeiten wir leise und lenken unsere Sitznachbar*innen nicht ab.', hint: 'Passt besonders zu Petra.', tone: 'beneficial', targetStudent: 'petra' },
  { id: 'material-ready', text: 'Zu Beginn liegen Arbeitsmaterialien bereit und die Startaufgabe beginnt sofort.', hint: 'Unterstützt einen ruhigen Start.', tone: 'neutral' },
  { id: 'public-comments', text: 'Fehler oder Regelverstöße werden sofort vor der ganzen Klasse kommentiert.', hint: 'Belastet Beziehungen und Sicherheit.', tone: 'harmful' },
  { id: 'respect-no-mock', text: 'Wir sprechen respektvoll miteinander und machen uns nicht über Fehler oder Beiträge lustig.', hint: 'Passt besonders zu Lina.', tone: 'beneficial', targetStudent: 'lina' },
  { id: 'group-roles', text: 'Bei Gruppenarbeit hat jede Person eine klare Aufgabe.', hint: 'Stärkt kooperative Arbeitsphasen.', tone: 'neutral' },
  { id: 'phone-if-done', text: 'Wer fertig ist, darf kurz das Handy nutzen.', hint: 'Untergräbt klare Handygrenzen.', tone: 'harmful' },
  { id: 'first-instruction', text: 'Anweisungen der Lehrkraft werden beim ersten Signal umgesetzt.', hint: 'Passt besonders zu Ben.', tone: 'beneficial', targetStudent: 'ben' },
  { id: 'transition-signal', text: 'Beim Wechsel der Sozialform warten wir auf das Startsignal.', hint: 'Hilft besonders in Übergängen.', tone: 'neutral' },
  { id: 'call-out-open', text: 'Zwischenrufe sind in offenen Phasen grundsätzlich in Ordnung.', hint: 'Erhöht das Risiko für Reinrufen.', tone: 'harmful' },
  { id: 'raise-hand', text: 'Wir melden uns, bevor wir sprechen.', hint: 'Passt besonders zu Tom.', tone: 'beneficial', targetStudent: 'tom' },
  { id: 'walkway', text: 'Material wird nur nach dem vereinbarten Ablauf geholt.', hint: 'Reduziert unnötige Wege im Raum.', tone: 'neutral' },
  { id: 'seat-swap', text: 'Sitzplätze dürfen während der Stunde spontan getauscht werden, wenn es interessanter ist.', hint: 'Schwächt Verlässlichkeit und Struktur.', tone: 'harmful' }
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
const mobileStudentList = document.getElementById('mobileRulesStudentList');
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
const rulesHighscore = document.getElementById('rulesHighscore');
const rulesStabilityPreview = document.getElementById('rulesStabilityPreview');
const rulesStabilityDetails = document.getElementById('rulesStabilityDetails');
const rulesTutorialOverlay = document.getElementById('rulesTutorialOverlay');
const rulesTutorialSkipBtn = document.getElementById('rulesTutorialSkipBtn');
const rulesTutorialDoneBtn = document.getElementById('rulesTutorialDoneBtn');
const rulesEvaluationOverlay = document.getElementById('rulesEvaluationOverlay');
const rulesEvaluationStep = document.getElementById('rulesEvaluationStep');
const rulesEvaluationTitle = document.getElementById('rulesEvaluationTitle');
const rulesEvaluationIntro = document.getElementById('rulesEvaluationIntro');
const rulesEvaluationRuleText = document.getElementById('rulesEvaluationRuleText');
const rulesEvaluationStudentSlot = document.getElementById('rulesEvaluationStudentSlot');
const rulesEvaluationResult = document.getElementById('rulesEvaluationResult');
const rulesEvaluationDelta = document.getElementById('rulesEvaluationDelta');
const rulesEvaluationText = document.getElementById('rulesEvaluationText');
const rulesEvaluationSegments = document.getElementById('rulesEvaluationSegments');
const rulesEvaluationScoreText = document.getElementById('rulesEvaluationScoreText');
const rulesEvaluationNextBtn = document.getElementById('rulesEvaluationNextBtn');
const rulesEvaluationHighscore = document.getElementById('rulesEvaluationHighscore');
const rulesEvaluationHighscoreDelta = document.getElementById('rulesEvaluationHighscoreDelta');
const outcomeModal = document.getElementById('outcomeModal');
const outcomeImage = document.getElementById('outcomeImage');
const outcomeEyebrow = document.getElementById('outcomeEyebrow');
const outcomeTitle = document.getElementById('outcomeTitle');
const outcomeText = document.getElementById('outcomeText');
const outcomeAdvice = document.getElementById('outcomeAdvice');
const outcomeHighscore = document.getElementById('outcomeHighscore');
const outcomeBreakdown = document.getElementById('outcomeBreakdown');
const restartOutcomeBtn = document.getElementById('restartOutcomeBtn');

let pendingRulesData = null;
let rulesEvaluationIndex = 0;


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
  if (window.ClassroomGameSession?.resetToFirstStep) {
    window.ClassroomGameSession.resetToFirstStep(true);
    return;
  }
  clearAllClassroomData();
  window.location.href = 'step1.html?skipIntro=1';
}


function installPageUtilities() {
  let bar = document.querySelector('.page-utility-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'page-utility-bar';
    bar.innerHTML = `
      <button type="button" id="utilityResetBtn" class="utility-btn utility-btn-reset">Zurücksetzen</button>
    `;
    document.body.prepend(bar);
  }
  const resetUtilityBtn = bar.querySelector('#utilityResetBtn');
  if (resetUtilityBtn) resetUtilityBtn.onclick = resetAppAndReload;
  window.classroomReset = resetAppAndReload;
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

function studentAvatarSrc(student) {
  return student?.avatar || (student?.id ? `assets/students/${student.id}.png` : '');
}

function studentAvatarMarkup(student, className = 'student-avatar', altSuffix = '') {
  const src = studentAvatarSrc(student);
  const alt = `${student?.name || 'Schüler*in'}${altSuffix}`;
  return src ? `<img class="${className}" src="${src}" alt="${alt}" />` : `<span class="${className} avatar-fallback">${(student?.name || '?').charAt(0)}</span>`;
}

const DESK_DIRECTIONS = ['up', 'right', 'down', 'left'];
function normalizeDeskDirection(value = 'up') {
  return DESK_DIRECTIONS.includes(value) ? value : 'up';
}
function getDeskDirection(desk = {}) {
  if (desk.dir) return normalizeDeskDirection(desk.dir);
  if (typeof desk.rotation === 'number') {
    const index = ((Math.round(desk.rotation / 90) % 4) + 4) % 4;
    return DESK_DIRECTIONS[index];
  }
  if (desk.orientation === 'vertical') return 'right';
  return 'up';
}
function getDeskRotation(desk = {}) {
  return ({ up: 0, right: 90, down: 180, left: 270 })[getDeskDirection(desk)] || 0;
}
function frozenDeskMarkup(desk = {}, student = null) {
  const content = student
    ? `<div class="desk-student-wrap">${studentAvatarMarkup(student, 'frozen-student-avatar', ' am Tisch')}</div>`
    : '<div class="desk-free-label">frei</div>';
  return `<div class="desk-visual ${student ? 'desk-visual-occupied' : 'desk-visual-empty'}" style="--desk-rotation:${getDeskRotation(desk)}deg;"><span class="desk-direction-badge" aria-hidden="true">↑</span><div class="desk-content">${content}</div></div>`;
}

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

function loadStep1Data() {
  try {
    const raw = localStorage.getItem('classroomGame.step1');
    if (!raw) return { ...defaultStep1, objects: normalizeRoomObjects(defaultStep1.objects || {}) };
    const parsed = { ...defaultStep1, ...JSON.parse(raw) };
    parsed.objects = normalizeRoomObjects(parsed.objects || {});
    return parsed;
  } catch (error) {
    console.warn('Schritt-1-Daten konnten nicht gelesen werden:', error);
    return { ...defaultStep1, objects: normalizeRoomObjects(defaultStep1.objects || {}) };
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

function getFrozenBlockedJoinClasses(group, row, col) {
  if (!group) return [];
  const has = (r, c) => group.cells.some(cell => cell.row === r && cell.col === c);
  const classes = [];
  if (has(row, col - 1)) classes.push('join-left');
  if (has(row, col + 1)) classes.push('join-right');
  if (has(row - 1, col)) classes.push('join-up');
  if (has(row + 1, col)) classes.push('join-down');
  return classes;
}

function formatBlockedLabel(group) {
  if (group.type === 'sink') return 'Wasch-<br>becken';
  if (group.type === 'exit') return 'Notaus-<br>gang';
  return group.label;
}

function getRoomObjectAt(row, col) {
  const bin = step1Data.objects?.bin;
  if (bin && bin.row === row && bin.col === col) return bin;
  return (step1Data.objects?.trash || []).find(item => !item.removed && item.row === row && item.col === col) || null;
}

function init() {
  restoreRuleState();
  renderFrozenGrid();
  renderStudents();
  renderRules();
  bindEvents();
  openRulesTutorialOnce();
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
    prepScorePill.textContent = value === null || value === undefined ? '– Punkte' : `${value} Balken`;
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
        if (blockGroup) cell.classList.add(...getFrozenBlockedJoinClasses(blockGroup, row, col));
        if (blockGroup && isBlockedGroupAnchor(blockGroup, row, col)) {
          const blockEl = document.createElement('span');
          const sideLabel = ['window', 'door', 'exit'].includes(blockGroup.type);
          blockEl.className = `frozen-blocked-label frozen-${blockGroup.type}${sideLabel ? ' side-label' : ''}`;
          blockEl.style.setProperty('--frozen-span-cols', String(blockGroup.colSpan));
          blockEl.style.setProperty('--frozen-span-rows', String(blockGroup.rowSpan));
          blockEl.innerHTML = `<span>${formatBlockedLabel(blockGroup)}</span>`;
          cell.appendChild(blockEl);
        }
      }
      const desk = (step1Data.desks || []).find(item => item.row === row && item.col === col);
      if (desk) {
        const deskEl = document.createElement('div');
        const studentId = step1Data.assignments?.[desk.id];
        const student = studentId ? getStudent(studentId) : null;
        deskEl.className = `frozen-desk${student ? ' has-student' : ''}`;
        deskEl.innerHTML = frozenDeskMarkup(desk, student);
        cell.appendChild(deskEl);
      }
      const object = getRoomObjectAt(row, col);
      if (object) {
        const objectEl = document.createElement('span');
        objectEl.className = `frozen-object frozen-object-${object.type}`;
        objectEl.innerHTML = object.type === 'bin'
          ? '<span class="room-object-icon" aria-hidden="true">🗑️</span>'
          : trashImageMarkup(object, 'trash-visual-img frozen-trash-img', 'Müll im Klassenraum');
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
  const containers = [studentList, mobileStudentList].filter(Boolean);
  containers.forEach(container => { container.innerHTML = ''; });
  (step1Data.students || fallbackStudents).forEach(student => {
    const deskId = Object.entries(step1Data.assignments || {}).find(([, sid]) => sid === student.id)?.[0] || null;
    const desk = deskId ? (step1Data.desks || []).find(d => d.id === deskId) : null;
    const markup = `
      <div class="rules-student-avatar-wrap">${studentAvatarMarkup(student, 'rules-student-avatar')}</div>
      <div class="rules-student-copy">
        <strong>${student.name} (${student.age})</strong>
        <span>${student.note}</span>
        <small>${desk ? `Platz: Reihe ${desk.row + 1}, Feld ${desk.col + 1}` : 'nicht platziert'}</small>
      </div>`;
    containers.forEach(container => {
      const item = document.createElement('article');
      item.className = 'rules-student-card';
      item.innerHTML = markup;
      container.appendChild(item);
    });
  });
}

function renderRules() {
  renderCurrentRule();
  renderList('accepted', acceptedList);
  renderList('pending', pendingList);
  renderList('rejected', rejectedList);
  updateCountersAndStatus();
  updateRuleStabilityPreview();
  saveDraft();
}


function ruleDisplayHint(rule) {
  if (!rule) return 'Ziehe diese Regel in eine Liste.';
  if (rule.tone === 'beneficial') return 'Prüfe, welches Schülerverhalten diese Regel abdecken kann.';
  if (rule.tone === 'harmful') return 'Prüfe, ob diese Regel Unterrichtsstabilität schwächen könnte.';
  return 'Prüfe, ob diese Regel ein konkretes Schülerverhalten aus der Klasse abdeckt.';
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
    currentRuleHint.textContent = ruleDisplayHint(current);
  } else {
    currentRuleCard.hidden = false;
    currentRuleCard.removeAttribute('data-rule-id');
    currentRuleCard.draggable = false;
    progressText.textContent = 'Alle 15 Regeln zugeordnet';
    currentRuleText.textContent = 'Keine neue Regel mehr im Stapel.';
    currentRuleHint.textContent = 'Sortiere die Listen um, bis genau fünf Klassenregeln gewählt sind und „Später zuordnen“ leer ist.';
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


let activeRulePointerDrag = null;

function createRuleDragGhost(source) {
  const ghost = document.createElement('div');
  ghost.className = 'rule-touch-drag-ghost';
  const rect = source.getBoundingClientRect();
  ghost.style.width = `${Math.max(180, Math.min(320, rect.width))}px`;
  ghost.innerHTML = source.innerHTML;
  document.body.appendChild(ghost);
  return ghost;
}

function moveRuleDragGhost(ghost, x, y) {
  if (!ghost) return;
  ghost.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
}

function clearRuleDropHighlights() {
  document.querySelectorAll('.rule-touch-drop-target, .rule-dropzone.drop-hover').forEach(el => {
    el.classList.remove('rule-touch-drop-target', 'drop-hover');
  });
}

function elementFromPointWithoutRuleGhost(x, y) {
  const ghost = activeRulePointerDrag?.ghost;
  if (ghost) ghost.style.display = 'none';
  const el = document.elementFromPoint(x, y);
  if (ghost) ghost.style.display = '';
  return el;
}

function findNearbyRuleDropzone(x, y, radius = 42) {
  const zones = Array.from(document.querySelectorAll('.rule-dropzone, .rule-list-card[data-list]'));
  let best = null;
  let bestDistance = Infinity;
  zones.forEach(zone => {
    const rect = zone.getBoundingClientRect();
    const clampedX = Math.max(rect.left, Math.min(x, rect.right));
    const clampedY = Math.max(rect.top, Math.min(y, rect.bottom));
    const distance = Math.hypot(x - clampedX, y - clampedY);
    if (distance <= radius && distance < bestDistance) {
      best = zone;
      bestDistance = distance;
    }
  });
  return best;
}

function getRuleDropTarget(x, y) {
  const points = [[x, y], [x, y - 24], [x, y + 24], [x - 18, y], [x + 18, y]];
  let el = null;
  for (const [px, py] of points) {
    el = elementFromPointWithoutRuleGhost(px, py);
    if (el?.closest?.('.rule-dropzone, .rule-list-card[data-list]')) break;
  }
  const zone = el?.closest?.('.rule-dropzone') || findNearbyRuleDropzone(x, y);
  const listCard = el?.closest?.('.rule-list-card[data-list]') || zone?.closest?.('.rule-list-card[data-list]');
  const list = zone?.dataset?.list || listCard?.dataset?.list || null;
  return { el, zone: zone || listCard, list };
}

function highlightRuleDropTarget(x, y) {
  clearRuleDropHighlights();
  const target = getRuleDropTarget(x, y);
  if (target.zone && target.list) target.zone.classList.add('rule-touch-drop-target', 'drop-hover');
}

function isTouchPointerEvent(event) {
  return event?.pointerType === 'touch' || event?.pointerType === 'pen' || (!event?.pointerType && (navigator.maxTouchPoints || 0) > 0);
}

function bindRulePointerDrag(source, ruleIdOrGetter, sourceName = 'current') {
  if (!source || source.dataset.rulePointerBound === '1') return;
  source.dataset.rulePointerBound = '1';
  source.style.touchAction = 'none';

  source.addEventListener('pointerdown', event => {
    if (!isTouchPointerEvent(event)) return;
    if (event.button !== undefined && event.button !== 0) return;
    if (event.target.closest('button, a, input, textarea, select')) return;
    const ruleId = typeof ruleIdOrGetter === 'function' ? ruleIdOrGetter() : ruleIdOrGetter;
    if (!isValidRuleId(ruleId)) return;
    event.preventDefault();
    event.stopPropagation();

    ruleState.dragRuleId = ruleId;
    ruleState.dragSource = sourceName;
    activeRulePointerDrag = {
      pointerId: event.pointerId,
      source,
      ruleId,
      sourceName,
      started: true,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      ghost: createRuleDragGhost(source)
    };
    source.classList.add('touch-drag-source');
    document.body.classList.add('touch-drag-active');
    moveRuleDragGhost(activeRulePointerDrag.ghost, event.clientX, event.clientY);
    highlightRuleDropTarget(event.clientX, event.clientY);

    const moveRulePointer = moveEvent => {
      if (!activeRulePointerDrag || activeRulePointerDrag.pointerId !== moveEvent.pointerId) return;
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      activeRulePointerDrag.lastX = moveEvent.clientX;
      activeRulePointerDrag.lastY = moveEvent.clientY;
      moveRuleDragGhost(activeRulePointerDrag.ghost, moveEvent.clientX, moveEvent.clientY);
      highlightRuleDropTarget(moveEvent.clientX, moveEvent.clientY);
    };

    const endRulePointer = endEvent => {
      if (!activeRulePointerDrag || activeRulePointerDrag.pointerId !== endEvent.pointerId) return;
      endEvent.preventDefault();
      endEvent.stopPropagation();
      const target = getRuleDropTarget(activeRulePointerDrag.lastX, activeRulePointerDrag.lastY);
      if (target.list) moveRule(activeRulePointerDrag.ruleId, target.list);
      activeRulePointerDrag?.ghost?.remove();
      activeRulePointerDrag?.source?.classList.remove('touch-drag-source');
      document.body.classList.remove('touch-drag-active');
      clearRuleDropHighlights();
      clearRuleDrag();
      activeRulePointerDrag = null;
      document.removeEventListener('pointermove', moveRulePointer, true);
      document.removeEventListener('pointerup', endRulePointer, true);
      document.removeEventListener('pointercancel', cancelRulePointer, true);
    };

    const cancelRulePointer = cancelEvent => {
      if (!activeRulePointerDrag || activeRulePointerDrag.pointerId !== cancelEvent.pointerId) return;
      cancelEvent.preventDefault();
      cancelEvent.stopPropagation();
      activeRulePointerDrag?.ghost?.remove();
      activeRulePointerDrag?.source?.classList.remove('touch-drag-source');
      document.body.classList.remove('touch-drag-active');
      clearRuleDropHighlights();
      clearRuleDrag();
      activeRulePointerDrag = null;
      document.removeEventListener('pointermove', moveRulePointer, true);
      document.removeEventListener('pointerup', endRulePointer, true);
      document.removeEventListener('pointercancel', cancelRulePointer, true);
    };

    document.addEventListener('pointermove', moveRulePointer, { passive: false, capture: true });
    document.addEventListener('pointerup', endRulePointer, { passive: false, capture: true });
    document.addEventListener('pointercancel', cancelRulePointer, { passive: false, capture: true });
  }, { passive: false });
}


function renderList(listName, container) {
  container.innerHTML = '';
  ruleState.lists[listName].forEach(ruleId => {
    const rule = getRule(ruleId);
    if (!rule) return;
    const card = document.createElement('article');
    card.className = 'rule-item';
    card.draggable = true;
    card.dataset.ruleId = rule.id;
    card.dataset.source = listName;
    card.innerHTML = `<span class="rule-item-text">${rule.text}</span>`;
    card.title = 'Per Drag & Drop in eine andere Liste ziehen.';
    card.addEventListener('dragstart', event => startRuleDrag(event, rule.id, listName));
    card.addEventListener('dragend', clearRuleDrag);
    bindRulePointerDrag(card, rule.id, listName);
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
  bindRulePointerDrag(currentRuleCard, () => getCurrentRule()?.id || null, 'current');

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
  backBtn.addEventListener('click', () => { window.location.href = 'step1.html'; });
  if (rulesEvaluationNextBtn) rulesEvaluationNextBtn.addEventListener('click', advanceRulesEvaluation);
  if (restartOutcomeBtn) restartOutcomeBtn.addEventListener('click', restartRulesAttempt);
  if (rulesTutorialSkipBtn) {
    rulesTutorialSkipBtn.addEventListener('pointerdown', handleRulesTutorialDismiss, true);
    rulesTutorialSkipBtn.addEventListener('click', handleRulesTutorialDismiss, true);
    rulesTutorialSkipBtn.addEventListener('click', () => closeRulesTutorial());
  }
  if (rulesTutorialDoneBtn) {
    rulesTutorialDoneBtn.addEventListener('pointerdown', handleRulesTutorialDismiss, true);
    rulesTutorialDoneBtn.addEventListener('click', handleRulesTutorialDismiss, true);
    rulesTutorialDoneBtn.addEventListener('click', () => closeRulesTutorial());
  }
  document.addEventListener('pointerdown', handleRulesTutorialDismiss, true);
  document.addEventListener('click', handleRulesTutorialDismiss, true);
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
  if (chosenValue) chosenValue.textContent = `${accepted}/${REQUIRED_ACCEPTED}`;
  acceptedCounter.textContent = `${accepted}/${REQUIRED_ACCEPTED}`;
  pendingCounter.textContent = `${pending}`;
  rejectedCounter.textContent = `${rejected}/${REQUIRED_REJECTED}`;

  const valid = assigned === TOTAL_RULES && accepted === REQUIRED_ACCEPTED && rejected === REQUIRED_REJECTED && pending === 0;
  finishBtn.disabled = !valid;

  if (valid) {
    setStatus('Regelauswahl vollständig. Starte jetzt die Auswertung.', 'ready');
  } else if (accepted > REQUIRED_ACCEPTED) {
    setStatus('Zu viele Klassenregeln. Es dürfen genau fünf sein.', 'warning');
  } else if (assigned < TOTAL_RULES) {
    setStatus(`Noch ${TOTAL_RULES - assigned} Regel${TOTAL_RULES - assigned === 1 ? '' : 'n'} zuordnen.`, 'neutral');
  } else if (pending > 0) {
    setStatus('Die Liste „Später zuordnen“ muss am Ende leer sein.', 'warning');
  } else if (accepted < REQUIRED_ACCEPTED) {
    setStatus(`Es fehlen noch ${REQUIRED_ACCEPTED - accepted} verbindliche Klassenregel${REQUIRED_ACCEPTED - accepted === 1 ? '' : 'n'}.`, 'warning');
  } else if (rejected !== REQUIRED_REJECTED) {
    setStatus('In der Aussortiert-Liste müssen genau zehn Regeln liegen.', 'warning');
  }
}

function setStatus(message, tone = 'neutral') {
  if (!statusText) return;
  statusText.textContent = '';
  statusText.className = `rules-status ${tone}`;
  statusText.dataset.message = message || '';
}


function updateRuleStabilityPreview() {
  // Keine Vorabwertung anzeigen: Die gewählten Regeln werden erst in der Auswertung nach Abschluss bewertet.
  if (rulesStabilityPreview) rulesStabilityPreview.textContent = '';
  if (rulesStabilityDetails) rulesStabilityDetails.textContent = '';
}

function openRulesTutorialOnce() {
  if (!rulesTutorialOverlay) return;
  try {
    if (localStorage.getItem('classroomGame.rulesTutorialSeen') === '1' || sessionStorage.getItem('classroomGame.rulesTutorialSeen') === '1') {
      closeRulesTutorial(false);
      return;
    }
  } catch (error) {
    // ignore
  }
  rulesTutorialOverlay.hidden = false;
  rulesTutorialOverlay.removeAttribute('hidden');
  rulesTutorialOverlay.classList.remove('is-closed');
  rulesTutorialOverlay.style.display = '';
  rulesTutorialOverlay.style.visibility = '';
  rulesTutorialOverlay.style.pointerEvents = '';
  document.body.classList.add('tutorial-open');
}

function closeRulesTutorial(markSeen = true) {
  if (!rulesTutorialOverlay) return;
  rulesTutorialOverlay.hidden = true;
  rulesTutorialOverlay.setAttribute('hidden', '');
  rulesTutorialOverlay.classList.add('is-closed');
  rulesTutorialOverlay.style.display = 'none';
  rulesTutorialOverlay.style.visibility = 'hidden';
  rulesTutorialOverlay.style.pointerEvents = 'none';
  document.body.classList.remove('tutorial-open');
  if (markSeen) {
    try {
      sessionStorage.setItem('classroomGame.rulesTutorialSeen', '1');
      localStorage.setItem('classroomGame.rulesTutorialSeen', '1');
    } catch (error) {
      // ignore
    }
  }
}

window.closeRulesTutorial = closeRulesTutorial;

function pointInsideElement(event, element) {
  if (!event || !element) return false;
  const rect = element.getBoundingClientRect();
  return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
}

function handleRulesTutorialDismiss(event) {
  if (!rulesTutorialOverlay || rulesTutorialOverlay.hidden) return;
  const target = event.target;
  const clickedButton = target?.closest?.('#rulesTutorialSkipBtn, #rulesTutorialDoneBtn');
  const buttonAreaClicked = pointInsideElement(event, rulesTutorialSkipBtn) || pointInsideElement(event, rulesTutorialDoneBtn);
  if (!clickedButton && !buttonAreaClicked) return;
  event.preventDefault();
  event.stopPropagation();
  closeRulesTutorial();
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

function evaluateAcceptedRules() {
  const startLives = clampLives(Number(step1Data.rawPreparationScore ?? step1Data.preparationScore ?? 5));
  const startHighscore = readStoredHighscore();
  const acceptedRules = ruleState.lists.accepted.map(getRule).filter(Boolean);
  const acceptedRuleEvaluations = acceptedRules.map(rule => {
    const student = rule.targetStudent ? getStudent(rule.targetStudent) : null;
    const matched = Boolean(rule.tone === 'beneficial' && student);
    const delta = deltaForRuleEvaluation(rule, matched);
    const points = pointsForRuleEvaluation(rule, matched);
    const result = matched ? 'good' : rule.tone === 'harmful' ? 'bad' : 'neutral';
    return {
      ruleId: rule.id,
      text: rule.text,
      tone: rule.tone || 'neutral',
      delta,
      points,
      result,
      matched,
      harmful: rule.tone === 'harmful',
      neutral: !matched && rule.tone !== 'harmful',
      studentId: matched ? student.id : null,
      studentName: matched ? student.name : null,
      studentAge: matched ? student.age : null,
      studentNote: matched ? student.note : null,
      studentAvatar: matched ? student.avatar : null,
      reason: matched
        ? `Diese Regel passt zu ${student.name}, weil sie das konkrete Risikoverhalten „${student.note}“ präventiv begrenzt.`
        : rule.tone === 'harmful'
          ? 'Diese Regel schwächt die Unterrichtsstruktur und senkt die Unterrichtsstabilität.'
          : 'Diese Regel deckt kein konkretes Risikoverhalten der aktuellen Klasse ab.'
    };
  });
  const delta = acceptedRuleEvaluations.reduce((sum, item) => sum + item.delta, 0);
  const highscoreDelta = acceptedRuleEvaluations.reduce((sum, item) => sum + item.points, 0);
  return {
    startLives,
    delta,
    finalLives: clampLives(startLives + delta),
    startHighscore,
    highscoreDelta,
    finalHighscore: startHighscore + highscoreDelta,
    acceptedRuleEvaluations,
    matchedStudentRules: acceptedRuleEvaluations.filter(item => item.matched),
    harmfulSelectedRules: acceptedRuleEvaluations.filter(item => item.harmful),
    neutralSelectedRules: acceptedRuleEvaluations.filter(item => item.neutral),
    unmappedSelectedRules: acceptedRuleEvaluations.filter(item => !item.matched)
  };
}

function clampLives(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, Math.round(value)));
}

function readStoredHighscore() {
  const candidates = [step1Data?.highscore];
  try { candidates.push(localStorage.getItem('classroomGame.highscore')); } catch (error) {}
  const value = candidates.map(Number).find(Number.isFinite);
  return Number(value || 0);
}

function writeStoredHighscore(value) {
  const numeric = Number(value) || 0;
  try {
    localStorage.setItem('classroomGame.highscore', String(numeric));
  } catch (error) {
    console.warn('Highscore konnte nicht gespeichert werden:', error);
  }
  if (rulesHighscore) rulesHighscore.textContent = String(numeric);
}

function updateRulesHighscore(value = readStoredHighscore()) {
  if (rulesHighscore) rulesHighscore.textContent = String(Number(value) || 0);
}

function pointsForRuleEvaluation(rule, matched) {
  if (matched) return 500;
  if (rule?.tone === 'harmful') return -500;
  return 0;
}

function deltaForRuleEvaluation(rule, matched) {
  if (matched) return 1;
  if (rule?.tone === 'harmful') return -1;
  return 0;
}

function buildRulesData() {
  const evaluation = evaluateAcceptedRules();
  return {
    version: 3,
    savedAt: new Date().toISOString(),
    acceptedRules: ruleState.lists.accepted.map(getRule),
    rejectedRules: ruleState.lists.rejected.map(getRule),
    pendingRules: ruleState.lists.pending.map(getRule),
    acceptedRuleIds: ruleState.lists.accepted,
    rejectedRuleIds: ruleState.lists.rejected,
    pendingRuleIds: ruleState.lists.pending,
    evaluation,
    highscore: evaluation.finalHighscore,
    step1: { ...step1Data, highscore: evaluation.startHighscore }
  };
}


function showRulesGameOverModal(finalLives = 0, finalHighscore = readStoredHighscore()) {
  if (rulesEvaluationOverlay) {
    rulesEvaluationOverlay.hidden = true;
    rulesEvaluationOverlay.setAttribute('hidden', '');
  }
  document.body.classList.remove('tutorial-open');
  if (outcomeImage) {
    outcomeImage.src = 'assets/outcomes/lose.png';
    outcomeImage.alt = 'Game-over-Bild';
  }
  if (outcomeEyebrow) outcomeEyebrow.textContent = 'Game over';
  if (outcomeTitle) outcomeTitle.textContent = 'Die Unterrichtsstimmung ist gekippt.';
  if (outcomeText) outcomeText.textContent = 'Die Unterrichtsstabilität ist durch die Regelauswahl auf 0 gefallen.';
  if (outcomeAdvice) outcomeAdvice.textContent = 'Achte beim nächsten Mal darauf, Regeln mit konkreten Risikoprofilen der Klasse zu verbinden, riskante Regeln auszusortieren und neutrale Regeln nur dann zu wählen, wenn sie wirklich zur Situation passen.';
  if (outcomeHighscore) outcomeHighscore.textContent = String(Number(finalHighscore) || 0);
  if (outcomeBreakdown) outcomeBreakdown.textContent = `Regelauswertung beendet bei ${Math.max(0, finalLives)}/10 Unterrichtsstabilität.`;
  if (outcomeModal) {
    outcomeModal.hidden = false;
    outcomeModal.removeAttribute('hidden');
    outcomeModal.classList.add('is-visible');
    outcomeModal.setAttribute('data-result', 'lost');
  }
}

function restartRulesAttempt() {
  if (window.ClassroomGameSession?.resetToFirstStep) {
    window.ClassroomGameSession.resetToFirstStep(false);
    return;
  }
  window.location.href = 'step1.html?skipIntro=1';
}

function finishRules() {
  pendingRulesData = buildRulesData();
  rulesEvaluationIndex = 0;
  if (!rulesEvaluationOverlay || !pendingRulesData.evaluation.acceptedRuleEvaluations?.length) {
    completeRulesEvaluation();
    return;
  }
  openRulesEvaluationOverlay();
}

function openRulesEvaluationOverlay() {
  if (!rulesEvaluationOverlay) return;
  rulesEvaluationOverlay.hidden = false;
  rulesEvaluationOverlay.removeAttribute('hidden');
  document.body.classList.add('tutorial-open');
  renderRulesEvaluationStep();
}

function renderRulesEvaluationStep() {
  if (!pendingRulesData) return;
  const entries = pendingRulesData.evaluation.acceptedRuleEvaluations || [];
  const entry = entries[rulesEvaluationIndex];
  if (!entry) return completeRulesEvaluation();
  const count = entries.length;
  const cumulativeDelta = entries.slice(0, rulesEvaluationIndex + 1).reduce((sum, item) => sum + item.delta, 0);
  const cumulativePoints = entries.slice(0, rulesEvaluationIndex + 1).reduce((sum, item) => sum + item.points, 0);
  const currentLives = clampLives(pendingRulesData.evaluation.startLives + cumulativeDelta);
  const currentHighscore = Number(pendingRulesData.evaluation.startHighscore || 0) + cumulativePoints;

  if (rulesEvaluationStep) rulesEvaluationStep.textContent = '';
  if (rulesEvaluationTitle) rulesEvaluationTitle.textContent = '';
  if (rulesEvaluationIntro) rulesEvaluationIntro.textContent = '';
  if (rulesEvaluationRuleText) rulesEvaluationRuleText.textContent = entry.text;
  if (rulesEvaluationResult) {
    rulesEvaluationResult.className = `rules-evaluation-result ${entry.result || 'neutral'}`;
  }
  if (rulesEvaluationDelta) rulesEvaluationDelta.textContent = entry.delta > 0 ? '+1 Unterrichtsstabilität' : entry.delta < 0 ? '-1 Unterrichtsstabilität' : 'keine Veränderung';
  if (rulesEvaluationText) rulesEvaluationText.textContent = entry.reason;
  if (rulesEvaluationSegments) {
    rulesEvaluationSegments.classList.toggle('life-low', currentLives <= 3);
    rulesEvaluationSegments.classList.toggle('life-mid', currentLives > 3 && currentLives <= 6);
    rulesEvaluationSegments.classList.toggle('life-high', currentLives > 6);
    rulesEvaluationSegments.innerHTML = Array.from({ length: 10 }, (_, index) => `<span class="${index < currentLives ? 'filled' : ''}"></span>`).join('');
  }
  if (rulesEvaluationScoreText) rulesEvaluationScoreText.textContent = `${currentLives}/10`;
  if (rulesEvaluationHighscore) rulesEvaluationHighscore.textContent = String(currentHighscore);
  if (rulesEvaluationHighscoreDelta) {
    rulesEvaluationHighscoreDelta.textContent = entry.points > 0 ? `+${entry.points}` : String(entry.points || 0);
    rulesEvaluationHighscoreDelta.className = entry.points > 0 ? 'good' : entry.points < 0 ? 'bad' : 'neutral';
  }
  if (rulesEvaluationStudentSlot) {
    if (entry.matched) {
      rulesEvaluationStudentSlot.innerHTML = `
        <article class="rules-evaluation-student-card good">
          <div class="rules-student-avatar-wrap">${studentAvatarMarkup({ name: entry.studentName, avatar: entry.studentAvatar }, 'rules-student-avatar')}</div>
          <div>
            <span>Passende Schülerkarte</span>
            <strong>${escapeHtml(entry.studentName)}${entry.studentAge ? ` (${escapeHtml(entry.studentAge)})` : ''}</strong>
            <p>${escapeHtml(entry.studentNote || '')}</p>
            <small>+1 Stabilität · +500 Highscore</small>
          </div>
        </article>`;
    } else if (entry.harmful) {
      rulesEvaluationStudentSlot.innerHTML = `
        <article class="rules-evaluation-student-card unmapped bad">
          <div class="rules-evaluation-unmapped-icon">−</div>
          <div>
            <span>Riskante Regel</span>
            <strong>Unterrichtsstruktur geschwächt</strong>
            <p>Diese Regel begünstigt Unruhe oder unklare Grenzen.</p>
            <small>-1 Stabilität · -500 Highscore</small>
          </div>
        </article>`;
    } else {
      rulesEvaluationStudentSlot.innerHTML = `
        <article class="rules-evaluation-student-card unmapped neutral">
          <div class="rules-evaluation-unmapped-icon">0</div>
          <div>
            <span>Keine passende Schülerkarte</span>
            <strong>Kein konkretes Verhalten abgedeckt</strong>
            <p>Diese Regel deckt kein konkretes Risikoverhalten der aktuellen Klasse ab.</p>
            <small>keine Stabilitätsänderung · 0 Highscore</small>
          </div>
        </article>`;
    }
  }
  if (rulesEvaluationNextBtn) rulesEvaluationNextBtn.textContent = rulesEvaluationIndex === count - 1 ? 'Weiter zu Schritt 3' : 'Nächste Regel';
  if (currentLives <= 0) {
    window.setTimeout(() => showRulesGameOverModal(currentLives, currentHighscore), 450);
  }
}

function advanceRulesEvaluation() {
  if (!pendingRulesData) return;
  const entries = pendingRulesData.evaluation.acceptedRuleEvaluations || [];
  if (rulesEvaluationIndex >= entries.length - 1) {
    completeRulesEvaluation();
    return;
  }
  rulesEvaluationIndex += 1;
  renderRulesEvaluationStep();
}

function completeRulesEvaluation() {
  if (!pendingRulesData) pendingRulesData = buildRulesData();
  try {
    localStorage.setItem('classroomGame.step2.rules', JSON.stringify(pendingRulesData));
    writeStoredHighscore(pendingRulesData?.evaluation?.finalHighscore ?? readStoredHighscore());
    if ((pendingRulesData?.evaluation?.finalLives ?? 0) <= 0) {
      showRulesGameOverModal(pendingRulesData.evaluation.finalLives, pendingRulesData.evaluation.finalHighscore);
      return;
    }
    if (rulesEvaluationOverlay) {
      rulesEvaluationOverlay.hidden = true;
      rulesEvaluationOverlay.setAttribute('hidden', '');
    }
    document.body.classList.remove('tutorial-open');
    window.location.href = 'scenarios.html';
  } catch (error) {
    setStatus('Speichern fehlgeschlagen. Bitte prüfe den lokalen Speicher des Browsers.', 'warning');
  }
}

installPageUtilities();
init();
