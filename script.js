const ROWS = 9;
const COLS = 10;

const blockedCells = [
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

const roomObjectConfig = {
  trashCount: 5,
  broomPreferred: { row: 8, col: 9 }
};

const students = [
  { id: 'julius', name: 'Julius', age: 12, avatar: 'assets/students/julius.png', note: 'verträgt sich schlecht mit anderen Jungs', hidden: { gender: 'm', risk: 3, conflictWithBoys: true, needsMonitoring: true } },
  { id: 'petra', name: 'Petra', age: 15, avatar: 'assets/students/petra.png', note: 'lenkt häufig Sitznachbar*innen ab', hidden: { gender: 'f', risk: 3, distractor: true, needsMonitoring: true } },
  { id: 'mehmet', name: 'Mehmet', age: 13, avatar: 'assets/students/mehmet.png', note: 'arbeitet ruhig und stabilisiert Gruppen', hidden: { gender: 'm', risk: 1, stabilizer: true } },
  { id: 'lina', name: 'Lina', age: 12, avatar: 'assets/students/lina.png', note: 'reagiert empfindlich auf Kritik und Spott', hidden: { gender: 'f', risk: 2, sensitive: true, needsSafety: true } },
  { id: 'ben', name: 'Ben', age: 14, avatar: 'assets/students/ben.png', note: 'testet gerne Grenzen aus', hidden: { gender: 'm', risk: 3, boundaryTesting: true, needsMonitoring: true } },
  { id: 'sara', name: 'Sara', age: 13, avatar: 'assets/students/sara.png', note: 'arbeitet zuverlässig und hilft anderen', hidden: { gender: 'f', risk: 1, stabilizer: true } },
  { id: 'tom', name: 'Tom', age: 12, avatar: 'assets/students/tom.png', note: 'sucht Aufmerksamkeit durch Zwischenrufe', hidden: { gender: 'm', risk: 3, callsOut: true, needsMonitoring: true } },
  { id: 'emily', name: 'Emily', age: 13, avatar: 'assets/students/emily.png', note: 'braucht klare Orientierung bei Übergängen', hidden: { gender: 'f', risk: 2, needsStructure: true } },
  { id: 'niklas', name: 'Niklas', age: 14, avatar: 'assets/students/niklas.png', note: 'versteckt gern das Handy unter dem Tisch', hidden: { gender: 'm', risk: 3, phoneRisk: true, needsMonitoring: true } },
  { id: 'amira', name: 'Amira', age: 12, avatar: 'assets/students/amira.png', note: 'vermittelt oft zwischen Mitschüler*innen', hidden: { gender: 'f', risk: 1, mediator: true, stabilizer: true } }
];

const layouts = {
  rows: {
    label: 'Reihensitzordnung',
    deskPositions: [[2,1], [2,3], [2,6], [2,8], [4,1], [4,3], [4,6], [4,8], [6,3], [6,6]],
    teacher: { row: 1, col: 4, dir: 'down' }
  },
  uform: {
    label: 'U-Form',
    deskPositions: [[1,1], [3,1], [5,1], [7,2], [7,4], [7,6], [7,8], [5,9], [3,9], [1,9]],
    teacher: { row: 1, col: 5, dir: 'down' }
  },
  groups: {
    label: 'Gruppentische',
    deskPositions: [[1,1], [1,2], [1,6], [1,7], [4,1], [4,2], [4,6], [4,7], [7,4], [7,5]],
    teacher: { row: 1, col: 4, dir: 'down' }
  },
  pairs: {
    label: 'Partnerinseln',
    deskPositions: [[1,2], [1,3], [3,1], [3,2], [3,7], [3,8], [6,2], [6,3], [6,6], [6,7]],
    teacher: { row: 1, col: 4, dir: 'down' }
  }
};

const state = {
  layout: 'rows',
  desks: [],
  assignments: {},
  teacher: { row: 1, col: 4, dir: 'down', mode: 'frontStanding' },
  objects: { trash: [], broom: null },
  cleaningMode: false,
  selectedStudentId: null,
  placingTeacher: false,
  score: null,
  rawScore: null,
  feedback: [],
  metrics: {}
};

const dragState = {
  type: null,
  studentId: null,
  deskId: null
};

function studentAvatarSrc(student) {
  return student?.avatar || (student?.id ? `assets/students/${student.id}.png` : '');
}

function studentAvatarMarkup(student, className = 'student-avatar', altSuffix = '') {
  const src = studentAvatarSrc(student);
  const alt = `${student?.name || 'Schüler*in'}${altSuffix}`;
  return src ? `<img class="${className}" src="${src}" alt="${alt}" />` : `<span class="${className} avatar-fallback">${(student?.name || '?').charAt(0)}</span>`;
}


const blockedGroups = buildBlockedGroups();

function buildBlockedGroups() {
  const groups = [];
  const visited = new Set();
  blockedCells.forEach(cell => {
    const key = `${cell.row},${cell.col},${cell.type}`;
    if (visited.has(key)) return;
    const horizontal = blockedCells.filter(c => c.type === cell.type && c.row === cell.row).sort((a,b)=>a.col-b.col);
    const vertical = blockedCells.filter(c => c.type === cell.type && c.col === cell.col).sort((a,b)=>a.row-b.row);

    const hRun = [cell];
    let c = cell.col - 1;
    while (horizontal.some(x => x.col === c)) { hRun.unshift(horizontal.find(x => x.col === c)); c--; }
    c = cell.col + 1;
    while (horizontal.some(x => x.col === c)) { hRun.push(horizontal.find(x => x.col === c)); c++; }

    const vRun = [cell];
    let r = cell.row - 1;
    while (vertical.some(x => x.row === r)) { vRun.unshift(vertical.find(x => x.row === r)); r--; }
    r = cell.row + 1;
    while (vertical.some(x => x.row === r)) { vRun.push(vertical.find(x => x.row === r)); r++; }

    const groupCells = hRun.length >= vRun.length ? hRun : vRun;
    groupCells.forEach(gc => visited.add(`${gc.row},${gc.col},${gc.type}`));
    const rows = groupCells.map(gc => gc.row);
    const cols = groupCells.map(gc => gc.col);
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
  return blockedGroups.find(group => group.cells.some(cell => cell.row === row && cell.col === col)) || null;
}

function isBlockedGroupAnchor(group, row, col) {
  return Boolean(group) && group.minRow === row && group.minCol === col;
}

function getBlockedJoinClasses(group, row, col) {
  if (!group) return [];
  const has = (r, c) => group.cells.some(cell => cell.row === r && cell.col === c);
  const classes = [];
  if (has(row, col - 1)) classes.push('join-left');
  if (has(row, col + 1)) classes.push('join-right');
  if (has(row - 1, col)) classes.push('join-up');
  if (has(row + 1, col)) classes.push('join-down');
  return classes;
}

const gridEl = document.getElementById('classroomGrid');
const paletteEl = document.getElementById('studentPalette');
const layoutSelect = document.getElementById('layoutSelect');
const teacherModeSelect = document.getElementById('teacherMode');
const teacherToken = document.getElementById('teacherToken');
const placedCounter = document.getElementById('placedCounter');
const evaluateBtn = document.getElementById('evaluateBtn');
const evalHint = document.getElementById('evalHint');
const resetBtn = document.getElementById('resetBtn');
const scoreValue = document.getElementById('scoreValue');
const prepTimerValue = document.getElementById('prepTimerValue');
const resultsPanel = document.getElementById('resultsPanel');
const feedbackList = document.getElementById('feedbackList');
const meterFill = document.getElementById('meterFill');
const stateOutput = document.getElementById('stateOutput');
const evaluationOverlay = document.getElementById('evaluationOverlay');
const overlayCloseBtn = document.getElementById('overlayCloseBtn');
const evaluationTitle = document.getElementById('evaluationTitle');
const evaluationStepCounter = document.getElementById('evaluationStepCounter');
const evaluationStepDelta = document.getElementById('evaluationStepDelta');
const evaluationSlide = document.getElementById('evaluationSlide');
const evaluationNextBtn = document.getElementById('evaluationNextBtn');
const evaluationCurrentText = document.getElementById('evaluationCurrentText');
const evaluationCurrentDetail = document.getElementById('evaluationCurrentDetail');
const lifeSegments = document.getElementById('lifeSegments');
const animatedCurrentScore = document.getElementById('animatedCurrentScore');
const animatedFinalScore = document.getElementById('animatedFinalScore');
const evaluationActionArea = document.getElementById('evaluationActionArea');
const evaluationOutcomeTitle = document.getElementById('evaluationOutcomeTitle');
const evaluationOutcomeMessage = document.getElementById('evaluationOutcomeMessage');
const step2Btn = document.getElementById('step2Btn');
const newAttemptBtn = document.getElementById('newAttemptBtn');
const teacherDirectionPopover = document.getElementById('teacherDirectionPopover');
const studentHoverCard = document.getElementById('studentHoverCard');
const showTutorialBtn = document.getElementById('showTutorialBtn');
const tutorialOverlay = document.getElementById('tutorialOverlay');
const tutorialSlide = document.getElementById('tutorialSlide');
const tutorialVisual = document.getElementById('tutorialVisual');
const tutorialTitle = document.getElementById('tutorialTitle');
const tutorialText = document.getElementById('tutorialText');
const tutorialList = document.getElementById('tutorialList');
const tutorialProgress = document.getElementById('tutorialProgress');
const tutorialDots = document.getElementById('tutorialDots');
const tutorialPrevBtn = document.getElementById('tutorialPrevBtn');
const tutorialNextBtn = document.getElementById('tutorialNextBtn');
const tutorialSkipBtn = document.getElementById('tutorialSkipBtn');
const startGateOverlay = document.getElementById('startGateOverlay');
const startGameBtn = document.getElementById('startGameBtn');
let tutorialIndex = 0;
let gameStarted = false;
let preparationTimerId = null;
let preparationTimeLeft = 300;
let evaluationTimers = [];
let evaluationSession = null;

function initLayout(layoutKey, keepAssignments = false) {
  const layout = layouts[layoutKey];
  state.layout = layoutKey;
  state.desks = layout.deskPositions.map((pos, index) => ({ id: `desk-${index + 1}`, row: pos[0], col: pos[1] }));

  if (!keepAssignments) {
    state.assignments = {};
    state.selectedStudentId = null;
  } else {
    Object.keys(state.assignments).forEach(deskId => {
      if (!state.desks.some(desk => desk.id === deskId)) delete state.assignments[deskId];
    });
  }

  state.teacher = { ...layout.teacher, mode: 'frontStanding' };
  state.objects = generateRoomObjects();
  state.cleaningMode = false;
  state.placingTeacher = false;
  setDirectionActive(state.teacher.dir);
  updateTeacherPlacementButton();
  clearResults();
  stopPreparationTimer();
  preparationTimeLeft = 300;
  updatePreparationTimerDisplay();
  render();
}

function render() {
  renderGrid();
  renderPalette();
  updateCounter();
  updateEvaluateButton();
}

function renderGrid() {
  gridEl.innerHTML = '';
  const visionMap = getVisionMap();
  const influenceMap = getCombinedInfluenceMap(visionMap);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.row = row;
      cell.dataset.col = col;

      const vision = visionMap.get(cellKey(row, col));
      if (vision) {
        cell.classList.add('vision', `vision-${vision.level}`);
        cell.dataset.visionStrength = String(vision.strength);
      }

      const influence = influenceMap.get(cellKey(row, col));
      if (influence) applyInfluenceClasses(cell, influence);

      const block = getBlockedCell(row, col);
      const blockGroup = block ? getBlockedGroupAt(row, col) : null;
      if (block) {
        cell.classList.add('blocked-cell', `blocked-${block.type}`);
        if (blockGroup) cell.classList.add(...getBlockedJoinClasses(blockGroup, row, col));
        cell.dataset.blockedType = block.type;
        if (blockGroup && isBlockedGroupAnchor(blockGroup, row, col)) {
          cell.appendChild(createBlockedElement(blockGroup));
        }
      }

      if (state.placingTeacher && !block) cell.classList.add('teacher-placement-active');

      const desk = getDeskAt(row, col);
      if (desk) cell.appendChild(createDeskElement(desk, influence));

      const object = getRoomObjectAt(row, col);
      if (object) cell.appendChild(createRoomObjectElement(object));

      if (state.teacher.row === row && state.teacher.col === col) cell.appendChild(createTeacherInRoom());

      bindCellDnD(cell);
      cell.addEventListener('click', () => handleCellClick(row, col));
      gridEl.appendChild(cell);
    }
  }
}

function applyInfluenceClasses(el, influence) {
  el.dataset.influenceNet = String(influence.net);
  el.dataset.influenceGreen = String(influence.green);
  el.dataset.influenceRed = String(influence.red);
  if (influence.kind === 'good') el.classList.add(`influence-good-${influence.level}`);
  if (influence.kind === 'risk') el.classList.add(`influence-risk-${influence.level}`);
  if (influence.kind === 'neutral') el.classList.add(`influence-neutral-${influence.level}`);
}


function formatBlockedLabel(group) {
  if (group.type === 'sink') return 'Wasch-<br>becken';
  if (group.type === 'exit') return 'Notaus-<br>gang';
  return group.label;
}

function createBlockedElement(group) {
  const el = document.createElement('div');
  const sideLabel = ['window', 'door', 'exit'].includes(group.type);
  el.className = `blocked-marker blocked-${group.type}${sideLabel ? ' side-label' : ''}`;
  el.style.setProperty('--span-cols', String(group.colSpan));
  el.style.setProperty('--span-rows', String(group.rowSpan));
  el.innerHTML = `<span>${formatBlockedLabel(group)}</span>`;
  el.title = `${group.label}: Dieses Feld ist nicht nutzbar.`;
  return el;
}

function createRoomObjectElement(object) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `room-object room-object-${object.type}${state.cleaningMode && object.type === 'broom' ? ' active' : ''}`;
  el.dataset.objectId = object.id;
  el.textContent = object.type === 'broom' ? '🧹' : '🗑️';
  el.title = object.type === 'broom'
    ? 'Besen anklicken, dann Müll anklicken, um ihn zu entfernen.'
    : 'Müll: erzeugt Störrisiko. Mit dem Besen entfernen.';
  el.addEventListener('click', event => {
    event.stopPropagation();
    if (object.type === 'broom') {
      state.cleaningMode = !state.cleaningMode;
      showTemporaryHint(state.cleaningMode ? 'Besen ausgewählt: Klicke Müll an, um ihn zu entfernen.' : 'Besen abgewählt.');
      renderGrid();
      return;
    }
    if (object.type === 'trash') {
      if (!state.cleaningMode) {
        showTemporaryHint('Klicke zuerst den Besen an, um Müll entfernen zu können.');
        return;
      }
      object.removed = true;
      state.cleaningMode = false;
      clearResults();
      showTemporaryHint('Müll entfernt: Der Störreiz im Raum wurde reduziert.');
      renderGrid();
    }
  });
  return el;
}

function createDeskElement(desk, influence = null) {
  const deskEl = document.createElement('div');
  deskEl.className = 'desk';
  if (influence) applyInfluenceClasses(deskEl, influence);
  deskEl.draggable = true;
  deskEl.dataset.deskId = desk.id;
  deskEl.title = 'Tisch ziehen und in ein anderes Rasterfeld ablegen';

  const label = document.createElement('div');
  label.className = 'desk-label';
  label.innerHTML = `<span>Tisch</span><span>↕</span>`;

  const assignedStudentId = state.assignments[desk.id];
  const seat = document.createElement('div');
  if (assignedStudentId) {
    const student = getStudent(assignedStudentId);
    seat.className = 'student-chip student-chip-photo';
    seat.draggable = true;
    seat.dataset.studentId = student.id;
    seat.title = `${student.name} (${student.age}) · ${student.note}`;

    const avatarWrap = document.createElement('div');
    avatarWrap.className = 'student-chip-avatar-wrap';
    avatarWrap.innerHTML = studentAvatarMarkup(student, 'student-chip-avatar', ' am Tisch');

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-student-btn';
    removeBtn.setAttribute('aria-label', `${student.name} vom Tisch entfernen`);
    removeBtn.title = `${student.name} zurück in die Auswahlliste`;
    removeBtn.textContent = '×';
    removeBtn.draggable = false;
    removeBtn.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      removeStudentFromDesk(desk.id);
    });
    removeBtn.addEventListener('dragstart', event => event.preventDefault());

    seat.appendChild(avatarWrap);
    seat.appendChild(removeBtn);
    seat.addEventListener('dragstart', event => {
      event.stopPropagation();
      startDrag(event, { type: 'student', studentId: student.id });
    });
    seat.addEventListener('dragend', clearDragState);
    seat.addEventListener('click', event => {
      event.stopPropagation();
      selectStudent(student.id);
    });
  } else {
    seat.className = 'empty-seat';
    seat.textContent = 'freier Platz';
  }

  deskEl.appendChild(label);
  deskEl.appendChild(seat);

  deskEl.addEventListener('dragstart', event => {
    if (event.target.closest('.student-chip, .remove-student-btn')) return;
    event.stopPropagation();
    startDrag(event, { type: 'desk', deskId: desk.id });
    deskEl.classList.add('dragging');
  });
  deskEl.addEventListener('dragend', () => {
    deskEl.classList.remove('dragging');
    clearDragState();
  });

  deskEl.addEventListener('dragover', event => {
    if (dragState.type !== 'student') return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  });

  deskEl.addEventListener('drop', event => {
    const data = getDropData(event);
    if (data.type === 'student') {
      event.preventDefault();
      event.stopPropagation();
      assignStudentToDesk(data.studentId, desk.id);
      clearDragState();
    }
  });

  deskEl.addEventListener('click', event => {
    event.stopPropagation();
    if (state.selectedStudentId) assignStudentToDesk(state.selectedStudentId, desk.id);
  });

  if (assignedStudentId) {
    const student = getStudent(assignedStudentId);
    deskEl.addEventListener('mouseenter', event => showStudentHoverCard(student, event));
    deskEl.addEventListener('mousemove', event => moveStudentHoverCard(event));
    deskEl.addEventListener('mouseleave', hideStudentHoverCard);
  }

  return deskEl;
}

function createTeacherInRoom() {
  const el = document.createElement('div');
  el.className = 'teacher-in-room';
  el.draggable = true;
  el.textContent = directionLabel(state.teacher.dir);
  el.title = 'Lehrkraft ziehen und in ein anderes Rasterfeld ablegen';
  el.addEventListener('dragstart', event => {
    event.stopPropagation();
    startDrag(event, { type: 'teacher' });
    el.classList.add('dragging');
  });
  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
    clearDragState();
  });
  el.addEventListener('click', event => {
    event.stopPropagation();
    openTeacherDirectionPopover(event.currentTarget);
  });
  return el;
}

function renderPalette() {
  paletteEl.innerHTML = '';
  students.forEach(student => {
    if (isStudentAssigned(student.id)) return;
    const card = document.createElement('div');
    card.className = 'student-card';
    if (state.selectedStudentId === student.id) card.classList.add('selected');
    card.draggable = true;
    card.dataset.studentId = student.id;
    card.innerHTML = `
      <div class="student-card-avatar-wrap">${studentAvatarMarkup(student, 'student-card-avatar')}</div>
      <div class="student-card-copy">
        <div class="student-name">${student.name} (${student.age})</div>
        <div class="student-note">${student.note}</div>
      </div>`;
    card.addEventListener('dragstart', event => {
      startDrag(event, { type: 'student', studentId: student.id });
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      clearDragState();
    });
    card.addEventListener('click', () => selectStudent(student.id));
    paletteEl.appendChild(card);
  });
}

function bindCellDnD(cell) {
  cell.addEventListener('dragover', event => {
    if (!dragState.type) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    cell.classList.add('drop-hover');
  });

  cell.addEventListener('dragleave', () => cell.classList.remove('drop-hover'));

  cell.addEventListener('drop', event => {
    event.preventDefault();
    cell.classList.remove('drop-hover');
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const data = getDropData(event);

    if (data.type === 'desk') moveDesk(data.deskId, row, col);
    if (data.type === 'teacher') placeTeacher(row, col);
    if (data.type === 'student') {
      const desk = getDeskAt(row, col);
      if (desk) assignStudentToDesk(data.studentId, desk.id);
    }
    clearDragState();
  });
}

function startDrag(event, payload) {
  dragState.type = payload.type || null;
  dragState.studentId = payload.studentId || null;
  dragState.deskId = payload.deskId || null;

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('type', dragState.type || '');
    if (dragState.studentId) event.dataTransfer.setData('studentId', dragState.studentId);
    if (dragState.deskId) event.dataTransfer.setData('deskId', dragState.deskId);
  }
}

function getDropData(event) {
  return {
    type: event.dataTransfer?.getData('type') || dragState.type,
    studentId: event.dataTransfer?.getData('studentId') || dragState.studentId,
    deskId: event.dataTransfer?.getData('deskId') || dragState.deskId
  };
}

function clearDragState() {
  dragState.type = null;
  dragState.studentId = null;
  dragState.deskId = null;
}

function handleCellClick(row, col) {
  if (state.placingTeacher) {
    placeTeacher(row, col);
    return;
  }
  const desk = getDeskAt(row, col);
  if (state.selectedStudentId && desk) assignStudentToDesk(state.selectedStudentId, desk.id);
}

function selectStudent(studentId) {
  state.selectedStudentId = state.selectedStudentId === studentId ? null : studentId;
  if (state.selectedStudentId) state.placingTeacher = false;
  updateTeacherPlacementButton();
  renderPalette();
  renderGrid();
}

function removeStudentFromDesk(deskId) {
  if (!deskId || !state.assignments[deskId]) return;
  delete state.assignments[deskId];
  state.selectedStudentId = null;
  clearResults();
  stopPreparationTimer();
  preparationTimeLeft = 300;
  updatePreparationTimerDisplay();
  render();
}

function assignStudentToDesk(studentId, deskId) {
  if (!studentId || !deskId) return;

  const sourceDeskId = Object.entries(state.assignments).find(([, sid]) => sid === studentId)?.[0] || null;
  const displacedStudentId = state.assignments[deskId] || null;

  if (sourceDeskId === deskId) {
    state.selectedStudentId = null;
    render();
    return;
  }

  if (sourceDeskId) delete state.assignments[sourceDeskId];

  if (displacedStudentId && displacedStudentId !== studentId) {
    if (sourceDeskId) state.assignments[sourceDeskId] = displacedStudentId;
    else delete state.assignments[deskId];
  }

  state.assignments[deskId] = studentId;
  state.selectedStudentId = null;
  clearResults();
  stopPreparationTimer();
  preparationTimeLeft = 300;
  updatePreparationTimerDisplay();
  render();
}

function moveDesk(deskId, row, col) {
  if (!deskId) return;
  const desk = state.desks.find(item => item.id === deskId);
  if (!desk) return;
  const validation = canPlaceDeskAt(deskId, row, col);
  if (!validation.ok) {
    flashCell(row, col, 'invalid');
    showTemporaryHint(validation.reason);
    return;
  }
  desk.row = row;
  desk.col = col;
  clearResults();
  renderGrid();
}

function canPlaceDeskAt(deskId, row, col) {
  if (!insideGrid(row, col)) return { ok: false, reason: 'Das Ziel liegt außerhalb des Rasters.' };
  const block = getBlockedCell(row, col);
  if (block) return { ok: false, reason: `${block.label}: Dieses Feld ist blockiert.` };
  const targetObject = getRoomObjectAt(row, col);
  if (targetObject) return { ok: false, reason: targetObject.type === 'trash' ? 'Hier liegt Müll. Entferne ihn zuerst mit dem Besen.' : 'Hier liegt der Besen.' };
  const targetDesk = getDeskAt(row, col);
  if (targetDesk && targetDesk.id !== deskId) return { ok: false, reason: 'Hier steht bereits ein Tisch.' };
  if (state.teacher.row === row && state.teacher.col === col) return { ok: false, reason: 'Hier steht die Lehrkraft.' };
  return { ok: true, reason: '' };
}

function placeTeacher(row, col) {
  const block = getBlockedCell(row, col);
  if (block) {
    flashCell(row, col, 'invalid');
    showTemporaryHint(`${block.label}: Die Lehrkraft kann hier nicht stehen.`);
    return;
  }
  const object = getRoomObjectAt(row, col);
  if (object) {
    flashCell(row, col, 'invalid');
    showTemporaryHint(object.type === 'trash' ? 'Die Lehrkraft kann nicht auf Müll stehen.' : 'Die Lehrkraft kann nicht auf dem Besenfeld stehen.');
    return;
  }
  if (getDeskAt(row, col)) {
    flashCell(row, col, 'invalid');
    showTemporaryHint('Die Lehrkraft kann nicht auf einem Tischfeld stehen.');
    return;
  }
  state.teacher.row = row;
  state.teacher.col = col;
  state.placingTeacher = false;
  updateTeacherPlacementButton();
  clearResults();
  renderGrid();
}

function flashCell(row, col, type = 'invalid') {
  const cell = gridEl.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (!cell) return;
  cell.classList.add(type === 'invalid' ? 'invalid-target' : 'drop-hover');
  window.setTimeout(() => cell.classList.remove('invalid-target', 'drop-hover'), 700);
}

function showTemporaryHint(message) {
  if (!evalHint) return;
  const previous = evalHint.textContent;
  const wasReady = evalHint.classList.contains('ready');
  evalHint.classList.remove('ready');
  evalHint.textContent = message;
  window.setTimeout(() => {
    updateEvaluateButton();
    if (!evalHint.textContent) evalHint.textContent = previous;
    evalHint.classList.toggle('ready', wasReady && allStudentsPlaced());
  }, 1500);
}

function getDeskAt(row, col) { return state.desks.find(desk => desk.row === row && desk.col === col); }
function getStudent(id) { return students.find(student => student.id === id); }
function isStudentAssigned(studentId) { return Object.values(state.assignments).includes(studentId); }
function allStudentsPlaced() { return Object.keys(state.assignments).length === students.length; }
function updateCounter() {
  const placed = Object.keys(state.assignments).length;
  placedCounter.textContent = `${placed}/${students.length} platziert`;
}
function updateEvaluateButton() {
  const missing = students.length - Object.keys(state.assignments).length;
  evaluateBtn.disabled = missing > 0;
  if (evalHint) {
    evalHint.textContent = missing > 0
      ? `Noch ${missing} Schüler*in${missing === 1 ? '' : 'nen'} platzieren, bevor ausgewertet werden kann.`
      : 'Alle Schüler*innen sind platziert. Die Vorbereitung kann ausgewertet werden.';
    evalHint.classList.toggle('ready', missing === 0);
  }
}
function cellKey(row, col) { return `${row},${col}`; }
function getBlockedCell(row, col) { return blockedCells.find(item => item.row === row && item.col === col) || null; }
function isBlockedCell(row, col) { return Boolean(getBlockedCell(row, col)); }
function getRoomObjectAt(row, col) {
  if (state.objects?.broom && state.objects.broom.row === row && state.objects.broom.col === col) return state.objects.broom;
  return (state.objects?.trash || []).find(item => !item.removed && item.row === row && item.col === col) || null;
}
function getActiveTrash() { return (state.objects?.trash || []).filter(item => !item.removed); }
function isCellOccupiedForObjects(row, col) {
  return isBlockedCell(row, col) || getDeskAt(row, col) || (state.teacher.row === row && state.teacher.col === col) || getRoomObjectAt(row, col);
}
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function generateRoomObjects() {
  const broom = { id: 'broom-1', type: 'broom', row: roomObjectConfig.broomPreferred.row, col: roomObjectConfig.broomPreferred.col, removed: false };
  if (isBlockedCell(broom.row, broom.col) || getDeskAt(broom.row, broom.col) || (state.teacher.row === broom.row && state.teacher.col === broom.col)) {
    for (let row = ROWS - 1; row >= 0; row--) {
      for (let col = COLS - 1; col >= 0; col--) {
        if (!isBlockedCell(row, col) && !getDeskAt(row, col) && !(state.teacher.row === row && state.teacher.col === col)) {
          broom.row = row; broom.col = col; row = -1; break;
        }
      }
    }
  }
  const candidates = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (isBlockedCell(row, col)) continue;
      if (getDeskAt(row, col)) continue;
      if (state.teacher.row === row && state.teacher.col === col) continue;
      if (broom.row === row && broom.col === col) continue;
      candidates.push({ row, col });
    }
  }
  const trash = shuffle(candidates).slice(0, roomObjectConfig.trashCount).map((pos, index) => ({ id: `trash-${index + 1}`, type: 'trash', row: pos.row, col: pos.col, removed: false }));
  return { broom, trash };
}

function directionLabel(dir) {
  return ({ up: 'Lehrkraft ↑', down: 'Lehrkraft ↓', left: 'Lehrkraft ←', right: 'Lehrkraft →' })[dir] || 'Lehrkraft';
}

function setDirectionActive(dir) {
  document.querySelectorAll('.dir-btn').forEach(button => button.classList.toggle('active', button.dataset.dir === dir));
}

function updateTeacherPlacementButton() {
  if (!teacherToken) return;
  teacherToken.classList.toggle('selected', state.placingTeacher);
  teacherToken.textContent = state.placingTeacher ? 'Ziel wählen' : 'Lehrkraft';
}

function closeTeacherDirectionPopover() {
  if (!teacherDirectionPopover) return;
  teacherDirectionPopover.hidden = true;
}

function openTeacherDirectionPopover(anchorEl) {
  if (!teacherDirectionPopover || !anchorEl) return;
  setDirectionActive(state.teacher.dir);
  const anchorRect = anchorEl.getBoundingClientRect();
  const wrapRect = document.querySelector('.room-wrap')?.getBoundingClientRect() || { left: 0, top: 0 };
  teacherDirectionPopover.style.left = `${Math.max(10, anchorRect.left - wrapRect.left + anchorRect.width / 2 - 90)}px`;
  teacherDirectionPopover.style.top = `${Math.max(10, anchorRect.top - wrapRect.top + anchorRect.height + 8)}px`;
  teacherDirectionPopover.hidden = false;
}

function studentProfileTags(student) {
  const h = student?.hidden || {};
  const tags = [];
  if (h.needsMonitoring) tags.push('braucht Blickkontakt/Präsenz');
  if (h.distractor) tags.push('Ablenkungsrisiko');
  if (h.phoneRisk) tags.push('Handy-/Off-Task-Risiko');
  if (h.callsOut) tags.push('Zwischenrufe möglich');
  if (h.boundaryTesting) tags.push('testet Grenzen');
  if (h.conflictWithBoys) tags.push('Konfliktrisiko mit Jungen');
  if (h.needsStructure) tags.push('braucht Struktur');
  if (h.stabilizer) tags.push('stabilisierend');
  if (h.mediator) tags.push('vermittelnd');
  return tags;
}

function showStudentHoverCard(student, event) {
  if (!studentHoverCard || !student) return;
  const tags = studentProfileTags(student).map(tag => `<span>${tag}</span>`).join('');
  studentHoverCard.innerHTML = `
    <strong>${student.name} (${student.age})</strong>
    <p>${student.note}</p>
    <div class="student-hover-tags">${tags}</div>
  `;
  studentHoverCard.hidden = false;
  moveStudentHoverCard(event);
}

function moveStudentHoverCard(event) {
  if (!studentHoverCard || studentHoverCard.hidden) return;
  const wrapRect = document.querySelector('.room-wrap')?.getBoundingClientRect() || { left: 0, top: 0 };
  studentHoverCard.style.left = `${Math.max(12, event.clientX - wrapRect.left + 16)}px`;
  studentHoverCard.style.top = `${Math.max(12, event.clientY - wrapRect.top + 16)}px`;
}

function hideStudentHoverCard() {
  if (!studentHoverCard) return;
  studentHoverCard.hidden = true;
}

function getVectorForDirection(dir) {
  if (dir === 'up') return { dr: -1, dc: 0 };
  if (dir === 'down') return { dr: 1, dc: 0 };
  if (dir === 'left') return { dr: 0, dc: -1 };
  return { dr: 0, dc: 1 };
}

function getCandidateVisionCells() {
  const { row, col, dir, mode } = state.teacher;
  const cells = [];

  if (mode === 'moving') {
    // Bewegend im Raum: linearer Präsenzkorridor mit schnellem Abfall nach außen.
    const depth = 5;
    for (let step = 1; step <= depth; step++) {
      for (let offset = -1; offset <= 1; offset++) {
        const baseStrength = offset === 0
          ? Math.max(1, 5 - step)
          : Math.max(1, 3 - step);
        if (baseStrength < 1) continue;
        const pos = offsetCell(row, col, dir, step, offset);
        if (insideGrid(pos.row, pos.col)) cells.push({ ...pos, step, offset, baseStrength });
      }
    }
    return cells;
  }

  const depth = mode === 'deskSitting' ? 2 : 4;
  for (let step = 1; step <= depth; step++) {
    const spread = mode === 'deskSitting' ? Math.max(0, step - 1) : step;
    for (let offset = -spread; offset <= spread; offset++) {
      const distanceLoss = mode === 'deskSitting' ? step - 1 : Math.floor((step - 1) / 1.25);
      const sideLoss = Math.floor(Math.abs(offset) / 2);
      const baseStrength = Math.max(1, 5 - distanceLoss - sideLoss);
      const pos = offsetCell(row, col, dir, step, offset);
      if (insideGrid(pos.row, pos.col)) cells.push({ ...pos, step, offset, baseStrength });
    }
  }
  return cells;
}

function offsetCell(row, col, dir, step, offset) {
  if (dir === 'up') return { row: row - step, col: col + offset };
  if (dir === 'down') return { row: row + step, col: col + offset };
  if (dir === 'left') return { row: row + offset, col: col - step };
  return { row: row + offset, col: col + step };
}

function insideGrid(row, col) {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

function getVisionMap() {
  const map = new Map();
  const candidates = getCandidateVisionCells();
  candidates.forEach(candidate => {
    const obstacleInfo = countVisionObstaclesBefore(candidate);
    // Tische schwächen den Sichtstrahl ab. Müll hebt das Sichtfeld an dieser Stelle und dahinter komplett auf.
    if (obstacleInfo.trashBlocked) return;
    const strength = Math.max(0, candidate.baseStrength - obstacleInfo.deskBlockers * 2);
    if (strength <= 0) return;
    const level = Math.max(1, Math.min(5, 6 - strength)); // level 1 = dunkel/stark, level 5 = sehr schwach
    const key = cellKey(candidate.row, candidate.col);
    const existing = map.get(key);
    if (!existing || strength > existing.strength) {
      map.set(key, { ...candidate, blockers: obstacleInfo.deskBlockers, strength, level });
    }
  });
  return map;
}

function countVisionObstaclesBefore(candidate) {
  let deskBlockers = 0;
  let trashBlocked = false;
  const { row, col, dir } = state.teacher;
  for (let step = 1; step <= candidate.step; step++) {
    const scaledOffset = Math.round(candidate.offset * (step / candidate.step));
    const pos = offsetCell(row, col, dir, step, scaledOffset);
    if (!insideGrid(pos.row, pos.col)) continue;

    const object = getRoomObjectAt(pos.row, pos.col);
    if (object?.type === 'trash') {
      trashBlocked = true;
      break;
    }

    if (step < candidate.step && getDeskAt(pos.row, pos.col)) {
      deskBlockers += 1;
    }
  }
  return { deskBlockers, trashBlocked };
}

function getVisionStrengthAt(row, col) {
  return getVisionMap().get(cellKey(row, col))?.strength || 0;
}

function isDeskEffectivelyInVision(desk) {
  return getVisionStrengthAt(desk.row, desk.col) >= 3;
}

function visionGreenLevel(strength) {
  if (strength >= 5) return 4;
  if (strength >= 4) return 3;
  if (strength >= 3) return 2;
  if (strength >= 1) return 1;
  return 0;
}

function getCombinedInfluenceMap(visionMap = getVisionMap()) {
  const raw = new Map();
  const add = (row, col, type, value, source = '') => {
    if (!insideGrid(row, col) || value <= 0) return;
    const key = cellKey(row, col);
    const current = raw.get(key) || { green: 0, red: 0, sources: [] };
    current[type] = Math.min(12, current[type] + value);
    current.sources.push(source);
    raw.set(key, current);
  };

  visionMap.forEach((vision, key) => {
    const [row, col] = key.split(',').map(Number);
    add(row, col, 'green', visionGreenLevel(vision.strength), `Sichtfeld Stufe ${vision.strength}`);
  });

  Object.entries(state.assignments).forEach(([deskId, studentId]) => {
    const desk = state.desks.find(item => item.id === deskId);
    const student = getStudent(studentId);
    if (!desk || !student) return;
    const h = student.hidden;

    if (h.distractor) {
      add(desk.row, desk.col - 1, 'red', 4, `${student.name}: lenkt links ab`);
      add(desk.row, desk.col + 1, 'red', 4, `${student.name}: lenkt rechts ab`);
      add(desk.row, desk.col, 'red', 2, `${student.name}: Störpotenzial`);
    }
    if (h.callsOut) {
      add(desk.row, desk.col, 'red', 3, `${student.name}: Zwischenrufe`);
      forEachNeighbor(desk, pos => add(pos.row, pos.col, 'red', 2, `${student.name}: Aufmerksamkeitssuche`));
    }
    if (h.boundaryTesting) {
      add(desk.row, desk.col, 'red', 3, `${student.name}: testet Grenzen`);
      forEachNeighbor(desk, pos => add(pos.row, pos.col, 'red', 3, `${student.name}: provoziert Umfeld`));
    }
    if (h.conflictWithBoys) {
      add(desk.row, desk.col, 'red', 2, `${student.name}: Konfliktrisiko`);
      forEachNeighbor(desk, pos => add(pos.row, pos.col, 'red', 2, `${student.name}: Konfliktrisiko Umfeld`));
    }
    if (h.phoneRisk) {
      add(desk.row, desk.col, 'red', 3, `${student.name}: verdecktes Off-Task-Risiko`);
    }

    if (h.stabilizer) {
      add(desk.row, desk.col, 'green', 2, `${student.name}: stabilisiert`);
      add(desk.row, desk.col - 1, 'green', 4, `${student.name}: hilft links`);
      add(desk.row, desk.col + 1, 'green', 4, `${student.name}: hilft rechts`);
    }
    if (h.mediator) {
      add(desk.row, desk.col, 'green', 3, `${student.name}: vermittelt`);
      forEachNeighbor(desk, pos => add(pos.row, pos.col, 'green', 3, `${student.name}: vermittelt im Umfeld`));
    }
  });

  getActiveTrash().forEach(trash => {
    add(trash.row, trash.col, 'red', 3, 'Müll: unruhige Lernumgebung');
    add(trash.row - 1, trash.col, 'red', 4, 'Müll: Störreiz oben');
    add(trash.row + 1, trash.col, 'red', 4, 'Müll: Störreiz unten');
    add(trash.row, trash.col - 1, 'red', 4, 'Müll: Störreiz links');
    add(trash.row, trash.col + 1, 'red', 4, 'Müll: Störreiz rechts');
  });

  const combined = new Map();
  raw.forEach((value, key) => {
    const green = value.green || 0;
    const red = value.red || 0;
    if (!green && !red) return;
    const net = green - red;
    const maxValue = Math.max(green, red);
    let kind = 'neutral';
    let level = Math.max(1, Math.min(4, Math.ceil(maxValue / 3)));
    if (green && red && Math.abs(net) <= 1) {
      kind = 'neutral';
    } else if (net > 0) {
      kind = 'good';
      level = Math.max(1, Math.min(4, Math.ceil(net / 2)));
    } else if (net < 0) {
      kind = 'risk';
      level = Math.max(1, Math.min(4, Math.ceil(Math.abs(net) / 2)));
    }
    combined.set(key, { green, red, net, kind, level, sources: value.sources });
  });
  return combined;
}

function forEachNeighbor(desk, callback) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const row = desk.row + dr;
      const col = desk.col + dc;
      if (insideGrid(row, col)) callback({ row, col });
    }
  }
}

function manhattan(a, b) { return Math.abs(a.row - b.row) + Math.abs(a.col - b.col); }
function chebyshev(a, b) { return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col)); }
function isNear(a, b) { return chebyshev(a, b) <= 1 && !(a.row === b.row && a.col === b.col); }

function getStudentDesk(studentId) {
  const deskId = Object.entries(state.assignments).find(([, sid]) => sid === studentId)?.[0];
  return deskId ? state.desks.find(desk => desk.id === deskId) || null : null;
}

function namesFromIds(ids) {
  return ids.map(id => getStudent(id)?.name || id).join(', ');
}

function addFeedback(feedback, type, delta, text, detail = '') {
  feedback.push({ type, delta, text, detail });
}

function evaluatePreparation() {
  if (!allStudentsPlaced()) {
    clearResults();
    const missing = students.length - Object.keys(state.assignments).length;
    resultsPanel.hidden = false;
    feedbackList.innerHTML = `<li class="warning">Die Vorbereitung kann erst ausgewertet werden, wenn alle 10 Schüler*innen platziert sind. Es fehlen noch ${missing}.</li>`;
    meterFill.style.width = '0%';
    stateOutput.textContent = '';
    return;
  }

  const feedback = [];
  const metrics = {
    layout: state.layout,
    layoutLabel: layouts[state.layout].label,
    placedStudents: Object.keys(state.assignments).length,
    teacherMode: state.teacher.mode,
    teacherDirection: state.teacher.dir,
    visionModel: 'fan-or-linear-with-desk-attenuation-and-student-influence',
    visionRiskStudents: [],
    weaklyVisibleRiskStudents: [],
    blindRiskStudents: [],
    riskyPairs: [],
    neutralizedRiskPairs: [],
    stabilizingPairs: [],
    spacing: evaluateDeskSpacing(),
    roomObjects: evaluateRoomObjects(),
    blockedCells,
    backRowRisks: [],
    futureScenarioHooks: []
  };

  let score = 0;
  addFeedback(feedback, 'good', +1, 'Alle Schüler*innen sind platziert.', 'Das erhöht die Planbarkeit der Stunde, weil spätere Szenarien eindeutig auf Sitzplätze und Personen zugreifen können.');
  score += 1;

  const layoutEffect = evaluateLayoutBase();
  score += layoutEffect.delta;
  feedback.push(layoutEffect.feedback);

  const spacingResult = metrics.spacing;
  if (spacingResult.invalidPairs.length === 0) {
    score += 1;
    addFeedback(feedback, 'good', +1, 'Laufwege zwischen Tischreihen sind frei.', 'Vor und hinter Tischen bleibt ein Gang; die Lehrkraft kann sich besser bewegen und Hilfe leisten.');
  } else {
    score -= spacingResult.invalidPairs.length;
    addFeedback(feedback, 'bad', -spacingResult.invalidPairs.length, `${spacingResult.invalidPairs.length} blockierte Laufwege erkannt.`, 'Jeder direkt hintereinander gesetzte Tisch erschwert Wege, Präsenz und schnelle Unterstützung. Jeder blockierte Gang zählt einzeln.');
  }

  const roomObjectResult = metrics.roomObjects;
  score += roomObjectResult.delta;
  feedback.push(...roomObjectResult.feedback);
  metrics.futureScenarioHooks.push(...roomObjectResult.hooks);

  const visionResult = evaluateRiskStudentVision();
  score += visionResult.delta;
  feedback.push(...visionResult.feedback);
  metrics.visionRiskStudents = visionResult.visionRiskStudents;
  metrics.weaklyVisibleRiskStudents = visionResult.weaklyVisibleRiskStudents;
  metrics.blindRiskStudents = visionResult.blindRiskStudents;
  metrics.futureScenarioHooks.push(...visionResult.hooks);

  const pairResult = evaluatePairs();
  score += pairResult.delta;
  feedback.push(...pairResult.feedback);
  metrics.riskyPairs = pairResult.riskyPairs;
  metrics.neutralizedRiskPairs = pairResult.neutralizedRiskPairs;
  metrics.stabilizingPairs = pairResult.stabilizingPairs;
  metrics.futureScenarioHooks.push(...pairResult.hooks);

  const backRowResult = evaluateBackRowRisks();
  score += backRowResult.delta;
  feedback.push(...backRowResult.feedback);
  metrics.backRowRisks = backRowResult.backRowRisks;
  metrics.futureScenarioHooks.push(...backRowResult.hooks);

  const teacherResult = evaluateTeacherMode();
  score += teacherResult.delta;
  feedback.push(teacherResult.feedback);
  metrics.futureScenarioHooks.push(...teacherResult.hooks);

  const rawScore = Math.round(score);
  const displayScore = Math.max(0, Math.min(10, rawScore));
  metrics.rawPreparationScore = rawScore;
  metrics.clampedPreparationScore = displayScore;
  state.score = displayScore;
  state.rawScore = rawScore;
  state.feedback = feedback;
  state.metrics = metrics;
  showResults(displayScore, rawScore, feedback, metrics);
}

function evaluateLayoutBase() {
  if (state.layout === 'rows') return { delta: 1, feedback: { type: 'good', delta: +1, text: 'Reihensitzordnung: gute Steuerbarkeit und Übersicht.', detail: 'Sie unterstützt eine klare Plenumssteuerung, bietet aber weniger kooperative Interaktion.' } };
  if (state.layout === 'uform') return { delta: 1, feedback: { type: 'good', delta: +1, text: 'U-Form: gute Sichtbarkeit und Gesprächsausrichtung.', detail: 'Die Form ist günstig, wenn die Lehrkraft passend positioniert ist und keine blinden Außenbereiche entstehen.' } };
  if (state.layout === 'groups') return { delta: -1, feedback: { type: 'warning', delta: -1, text: 'Gruppentische: kooperativ geeignet, aber störanfälliger.', detail: 'Ohne sehr klare Steuerung steigt das Risiko für Ablenkung, Lautstärke und informelle Nebengespräche.' } };
  return { delta: 0, feedback: { type: 'warning', delta: 0, text: 'Partnerinseln: grundsätzlich ausgewogen.', detail: 'Die Bewertung hängt hier besonders stark von den konkreten Sitznachbarschaften ab.' } };
}

function evaluateDeskSpacing() {
  const invalidPairs = [];
  for (let i = 0; i < state.desks.length; i++) {
    for (let j = i + 1; j < state.desks.length; j++) {
      const a = state.desks[i];
      const b = state.desks[j];
      if (a.col === b.col && Math.abs(a.row - b.row) === 1) invalidPairs.push([a.id, b.id]);
    }
  }
  return { invalidPairs };
}


function evaluateRoomObjects() {
  const active = getActiveTrash();
  const result = { delta: 0, feedback: [], activeTrash: active.map(item => ({ id: item.id, row: item.row, col: item.col })), hooks: [] };
  if (active.length === 0) {
    result.delta += 1;
    addFeedback(result.feedback, 'good', +1, 'Der Klassenraum wurde von Müll befreit.', 'Störreize im Raum sind reduziert; das unterstützt eine geordnete Lernumgebung.');
  } else {
    result.delta -= active.length;
    result.hooks.push('room-trash-distraction');
    addFeedback(result.feedback, 'bad', -active.length, `${active.length} Müllfeld(er) liegen noch im Raum.`, 'Müll erzeugt rote Störfelder auf angrenzenden Plätzen und kann Aufmerksamkeit, Wege und Lernklima beeinträchtigen.');
  }
  return result;
}

function evaluateRiskStudentVision() {
  const result = { delta: 0, feedback: [], visionRiskStudents: [], weaklyVisibleRiskStudents: [], blindRiskStudents: [], hooks: [] };
  students.forEach(student => {
    const desk = getStudentDesk(student.id);
    if (!desk || student.hidden.risk < 3) return;
    const strength = getVisionStrengthAt(desk.row, desk.col);
    const record = { studentId: student.id, name: student.name, row: desk.row, col: desk.col, visionStrength: strength };

    if (strength >= 4) {
      result.delta += 2;
      result.visionRiskStudents.push(record);
      addFeedback(result.feedback, 'good', +2, `${student.name} sitzt im stärksten Sichtbereich der Lehrkraft.`, 'Ein störanfälliger Schüler wird direkt und früh wahrgenommen; die präventive Steuerung ist hier hoch.');
    } else if (strength === 3) {
      result.delta += 1;
      result.visionRiskStudents.push(record);
      addFeedback(result.feedback, 'good', +1, `${student.name} sitzt noch in einem wirksamen Sichtbereich.`, 'Die Sicht ist nicht maximal, aber ausreichend für frühe Präsenzsignale.');
    } else if (strength === 2) {
      result.weaklyVisibleRiskStudents.push(record);
      result.hooks.push('weak-vision-through-desk-blocking');
      addFeedback(result.feedback, 'warning', 0, `${student.name} sitzt nur in einer schwachen Sichtzone.`, 'Die Lehrkraft sieht den Platz noch, aber Tische und Distanz schwächen die Präventionswirkung.');
    } else if (strength === 1) {
      result.delta -= 1;
      result.weaklyVisibleRiskStudents.push(record);
      result.hooks.push('weak-vision-through-desk-blocking');
      addFeedback(result.feedback, 'warning', -1, `${student.name} sitzt in einer sehr schwachen Sichtzone.`, 'Bei verdeckten Störungen wäre hier spätere Nachsteuerung wahrscheinlich.');
    } else {
      result.delta -= 2;
      result.blindRiskStudents.push(record);
      result.hooks.push('blindspot-disruption');
      addFeedback(result.feedback, 'bad', -2, `${student.name} sitzt außerhalb des wirksamen Sichtfelds.`, 'Bei störanfälligen Schüler*innen ist das ein deutliches Risiko für verdeckte Störungen.');
    }
  });
  return result;
}

function evaluatePairs() {
  const result = { delta: 0, feedback: [], riskyPairs: [], neutralizedRiskPairs: [], stabilizingPairs: [], hooks: [] };
  const placed = students.filter(student => getStudentDesk(student.id));

  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      const a = placed[i], b = placed[j];
      const deskA = getStudentDesk(a.id), deskB = getStudentDesk(b.id);
      if (!deskA || !deskB || !isNear(deskA, deskB)) continue;

      const conflictReason = getConflictReason(a, b);
      const stabilizingReason = getStabilizingReason(a, b);

      if (conflictReason) {
        const neutralized = isRiskPairNeutralized(a, b);
        const pairRecord = { pair: [a.id, b.id], names: [a.name, b.name], reason: conflictReason, neutralized };
        if (neutralized) {
          result.neutralizedRiskPairs.push(pairRecord);
          addFeedback(result.feedback, 'warning', 0, `Riskante Nähe neutralisiert: ${a.name} und ${b.name}.`, `${conflictReason} Die Nähe wird durch starken Sichtbereich oder stabilisierende Mitschüler*innen abgefedert.`);
        } else {
          result.delta -= 1;
          result.riskyPairs.push(pairRecord);
          result.hooks.push('peer-conflict-medium');
          addFeedback(result.feedback, 'bad', -1, `Riskante Sitznachbarschaft: ${a.name} und ${b.name}.`, `${conflictReason} Diagonale Nähe zählt ebenfalls als Sitznachbarschaft.`);
        }
      }

      if (stabilizingReason) {
        result.delta += 1;
        result.stabilizingPairs.push({ pair: [a.id, b.id], names: [a.name, b.name], reason: stabilizingReason });
        addFeedback(result.feedback, 'good', +1, `Stabilisierende Sitznachbarschaft: ${a.name} und ${b.name}.`, stabilizingReason);
      }
    }
  }

  if (result.riskyPairs.length === 0 && result.neutralizedRiskPairs.length === 0) {
    result.delta += 1;
    addFeedback(result.feedback, 'good', +1, 'Keine riskanten direkten oder diagonalen Sitznachbarschaften erkannt.', 'Die Sitzordnung reduziert Konflikt- und Ablenkungswahrscheinlichkeit.');
  }
  if (result.riskyPairs.length >= 3) result.hooks.push('peer-conflict-high');
  return result;
}

function getConflictReason(a, b) {
  if (a.hidden.conflictWithBoys && b.hidden.gender === 'm') return `${a.name} verträgt sich schlecht mit anderen Jungs.`;
  if (b.hidden.conflictWithBoys && a.hidden.gender === 'm') return `${b.name} verträgt sich schlecht mit anderen Jungs.`;
  if (a.hidden.distractor && b.hidden.risk >= 2) return `${a.name} lenkt Sitznachbar*innen ab; ${b.name} ist dafür anfällig.`;
  if (b.hidden.distractor && a.hidden.risk >= 2) return `${b.name} lenkt Sitznachbar*innen ab; ${a.name} ist dafür anfällig.`;
  if (a.hidden.boundaryTesting && (b.hidden.callsOut || b.hidden.sensitive)) return `${a.name} testet Grenzen; ${b.name} reagiert darauf wahrscheinlich ungünstig.`;
  if (b.hidden.boundaryTesting && (a.hidden.callsOut || a.hidden.sensitive)) return `${b.name} testet Grenzen; ${a.name} reagiert darauf wahrscheinlich ungünstig.`;
  if (a.hidden.phoneRisk && b.hidden.distractor) return `${a.name} hat verdecktes Off-Task-Risiko; ${b.name} kann Ablenkung verstärken.`;
  if (b.hidden.phoneRisk && a.hidden.distractor) return `${b.name} hat verdecktes Off-Task-Risiko; ${a.name} kann Ablenkung verstärken.`;
  return '';
}

function getStabilizingReason(a, b) {
  if (a.hidden.stabilizer && b.hidden.risk >= 3) return `${a.name} arbeitet stabil und kann ${b.name} in Arbeitsphasen positiv mittragen.`;
  if (b.hidden.stabilizer && a.hidden.risk >= 3) return `${b.name} arbeitet stabil und kann ${a.name} in Arbeitsphasen positiv mittragen.`;
  if (a.hidden.mediator && (b.hidden.conflictWithBoys || b.hidden.sensitive || b.hidden.risk >= 2)) return `${a.name} vermittelt häufig und kann soziale Spannungen um ${b.name} abfedern.`;
  if (b.hidden.mediator && (a.hidden.conflictWithBoys || a.hidden.sensitive || a.hidden.risk >= 2)) return `${b.name} vermittelt häufig und kann soziale Spannungen um ${a.name} abfedern.`;
  return '';
}

function isRiskPairNeutralized(a, b) {
  const deskA = getStudentDesk(a.id);
  const deskB = getStudentDesk(b.id);
  const strongVision = Math.max(getVisionStrengthAt(deskA.row, deskA.col), getVisionStrengthAt(deskB.row, deskB.col)) >= 4;
  return strongVision || hasSupportNear(a.id) || hasSupportNear(b.id);
}

function hasSupportNear(studentId) {
  const desk = getStudentDesk(studentId);
  if (!desk) return false;
  return students.some(other => {
    if (other.id === studentId || !(other.hidden.stabilizer || other.hidden.mediator)) return false;
    const otherDesk = getStudentDesk(other.id);
    return otherDesk && isNear(desk, otherDesk);
  });
}

function evaluateBackRowRisks() {
  const result = { delta: 0, feedback: [], backRowRisks: [], hooks: [] };
  const backRows = [6, 7, 8];
  students.forEach(student => {
    const desk = getStudentDesk(student.id);
    if (!desk) return;
    const weakVision = !isDeskEffectivelyInVision(desk);
    if (backRows.includes(desk.row) && weakVision && (student.hidden.phoneRisk || student.hidden.needsMonitoring || student.hidden.distractor)) {
      result.delta -= 1;
      result.backRowRisks.push({ studentId: student.id, name: student.name, row: desk.row, col: desk.col });
      result.hooks.push(student.hidden.phoneRisk ? 'backrow-phone-or-offtask' : 'backrow-offtask-risk');
      addFeedback(result.feedback, 'bad', -1, `${student.name} sitzt weit hinten und nicht wirksam im Sichtbereich.`, 'Das erhöht das Risiko für Handy-, Neben- oder Off-Task-Verhalten.');
    }
  });
  return result;
}

function evaluateTeacherMode() {
  return { delta: 0, hooks: ['teacher-front-led'], feedback: { type: 'good', delta: 0, text: 'Lehrkraftpositionierung wurde berücksichtigt.', detail: 'Entscheidend ist hier vor allem die Blickrichtung: Der grüne Sichtfächer zeigt, welche Plätze schnell wahrgenommen werden.' } };
}


function buildStepState() {
  const visionByDesk = state.desks.map(desk => ({
    deskId: desk.id,
    row: desk.row,
    col: desk.col,
    strength: getVisionStrengthAt(desk.row, desk.col),
    studentId: state.assignments[desk.id] || null
  }));
  const influenceByCell = [...getCombinedInfluenceMap().entries()].map(([key, value]) => ({ cell: key, ...value }));
  return {
    version: 2,
    savedAt: new Date().toISOString(),
    rows: ROWS,
    cols: COLS,
    students,
    preparationScore: state.score,
    rawPreparationScore: state.rawScore,
    chosenLayout: { key: state.layout, label: layouts[state.layout].label },
    teacher: state.teacher,
    desks: state.desks,
    assignments: state.assignments,
    blockedCells,
    objects: state.objects,
    visionByDesk,
    influenceByCell,
    metrics: state.metrics,
    suggestedScenarioHooks: [...new Set(state.metrics?.futureScenarioHooks || [])]
  };
}

function saveStepStateForNextPage() {
  try {
    localStorage.setItem('classroomGame.step1', JSON.stringify(buildStepState()));
    return true;
  } catch (error) {
    console.error('Speichern der Schritt-1-Daten fehlgeschlagen:', error);
    window.alert('Die Vorbereitung konnte nicht gespeichert werden. Bitte prüfe, ob der Browser lokalen Speicher erlaubt.');
    return false;
  }
}

function showResults(score, rawScore, feedback, metrics) {
  scoreValue.textContent = score;
  meterFill.style.width = `${score * 10}%`;
  renderFeedbackList(feedbackList, feedback);

  const visionByDesk = state.desks.map(desk => ({
    deskId: desk.id,
    row: desk.row,
    col: desk.col,
    strength: getVisionStrengthAt(desk.row, desk.col),
    studentId: state.assignments[desk.id] || null
  }));
  const influenceByCell = [...getCombinedInfluenceMap().entries()].map(([key, value]) => ({ cell: key, ...value }));
  const exportData = {
    preparationScore: score,
    rawPreparationScore: rawScore,
    chosenLayout: { key: state.layout, label: layouts[state.layout].label },
    teacher: state.teacher,
    desks: state.desks,
    assignments: state.assignments,
    blockedCells,
    objects: state.objects,
    visionByDesk,
    influenceByCell,
    metrics,
    suggestedScenarioHooks: [...new Set(metrics.futureScenarioHooks)]
  };
  stateOutput.textContent = JSON.stringify(exportData, null, 2);
  resultsPanel.hidden = false;
  evaluationOverlay.hidden = false;
  startEvaluationAnimation(feedback, rawScore);
}

function clearEvaluationTimers() {
  evaluationTimers.forEach(timer => window.clearTimeout(timer));
  evaluationTimers = [];
}

function initLifeSegments() {
  if (!lifeSegments) return;
  lifeSegments.innerHTML = '';
  lifeSegments.classList.remove('life-low', 'life-mid', 'life-high');
  for (let i = 1; i <= 10; i++) {
    const segment = document.createElement('span');
    segment.className = 'life-segment';
    segment.dataset.index = String(i);
    lifeSegments.appendChild(segment);
  }
}

function getLifeTone(clamped) {
  if (clamped <= 3) return 'life-low';
  if (clamped <= 6) return 'life-mid';
  return 'life-high';
}

function updateLifeBar(rawValue) {
  const clamped = Math.max(0, Math.min(10, Math.round(rawValue)));
  if (lifeSegments) {
    const tone = getLifeTone(clamped);
    lifeSegments.classList.remove('life-low', 'life-mid', 'life-high');
    lifeSegments.classList.add(tone);
    const segments = [...lifeSegments.querySelectorAll('.life-segment')];
    segments.forEach((segment, index) => segment.classList.toggle('active', index < clamped));
    lifeSegments.setAttribute('aria-label', `${clamped} von 10 Stabilitätsbalken, rechnerischer Punktestand ${rawValue}`);
  }
  if (animatedCurrentScore) animatedCurrentScore.textContent = `Punkte aktuell: ${rawValue} · Balken: ${clamped}/10`;
}

function setStepDelta(delta) {
  if (!evaluationStepDelta) return;
  evaluationStepDelta.classList.remove('positive', 'negative', 'neutral');
  evaluationStepDelta.classList.add(delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral');
  evaluationStepDelta.textContent = delta > 0 ? `+${delta}` : String(delta ?? 0);
}

function renderEvaluationStep(item, index, total) {
  const delta = Number(item?.delta || 0);
  if (evaluationStepCounter) evaluationStepCounter.textContent = `Schritt ${index + 1}/${total}`;
  setStepDelta(delta);
  if (evaluationCurrentText) evaluationCurrentText.textContent = item?.text || 'Bewertungsschritt';
  if (evaluationCurrentDetail) evaluationCurrentDetail.textContent = item?.detail || 'Keine Zusatzbegründung vorhanden.';
  if (evaluationNextBtn) {
    evaluationNextBtn.hidden = false;
    evaluationNextBtn.disabled = false;
    evaluationNextBtn.textContent = index + 1 >= total ? 'Auswertung abschließen' : 'Weiter';
  }
}

function showSlideTransition(renderCallback) {
  if (!evaluationSlide) {
    renderCallback();
    return;
  }
  evaluationSlide.classList.remove('slide-in-right', 'slide-out-left');
  evaluationSlide.classList.add('slide-out-left');
  window.setTimeout(() => {
    renderCallback();
    evaluationSlide.classList.remove('slide-out-left');
    evaluationSlide.classList.add('slide-in-right');
    window.setTimeout(() => {
      evaluationSlide.classList.remove('slide-in-right');
    }, 360);
  }, 300);
}

function advanceEvaluationStep(useAnimation = true) {
  if (!evaluationSession || evaluationSession.finalShown) return;

  if (evaluationSession.index >= evaluationSession.steps.length - 1) {
    evaluationSession.finalShown = true;
    updateLifeBar(evaluationSession.rawScore);
    const clamped = Math.max(0, Math.min(10, Math.round(evaluationSession.rawScore)));
    if (evaluationTitle) evaluationTitle.textContent = `Auswertung abgeschlossen: ${clamped}/10 Balken`;
    if (animatedFinalScore) animatedFinalScore.textContent = `Endwert: ${evaluationSession.rawScore} Punkte`;
    if (evaluationStepCounter) evaluationStepCounter.textContent = `Fertig · ${evaluationSession.steps.length}/${evaluationSession.steps.length}`;
    setStepDelta(0);
    if (evaluationNextBtn) evaluationNextBtn.hidden = true;
    showEvaluationOutcome(evaluationSession.rawScore);
    return;
  }

  const nextIndex = evaluationSession.index + 1;
  const item = evaluationSession.steps[nextIndex];
  evaluationSession.index = nextIndex;
  evaluationSession.currentRaw += Number(item.delta || 0);

  const render = () => {
    renderEvaluationStep(item, nextIndex, evaluationSession.steps.length);
    updateLifeBar(evaluationSession.currentRaw);
  };

  if (useAnimation) showSlideTransition(render);
  else render();
}

function startEvaluationAnimation(feedback, rawScore) {
  clearEvaluationTimers();
  initLifeSegments();
  const steps = feedback.length ? feedback : [{ delta: 0, text: 'Keine Bewertungspunkte vorhanden.', detail: 'Für diese Vorbereitung wurde kein Bewertungsereignis erzeugt.' }];
  evaluationSession = {
    steps,
    rawScore,
    index: -1,
    currentRaw: 0,
    finalShown: false
  };

  updateLifeBar(0);
  if (evaluationTitle) evaluationTitle.textContent = 'Startstabilität wird berechnet';
  if (evaluationStepCounter) evaluationStepCounter.textContent = `Schritt 0/${steps.length}`;
  setStepDelta(0);
  if (evaluationCurrentText) evaluationCurrentText.textContent = 'Berechnung startet …';
  if (evaluationCurrentDetail) evaluationCurrentDetail.textContent = 'Klicke auf „Weiter“, um die Bewertung Schritt für Schritt durchzugehen.';
  if (animatedFinalScore) animatedFinalScore.textContent = 'Endwert: –';
  if (overlayCloseBtn) overlayCloseBtn.hidden = false;
  if (evaluationActionArea) evaluationActionArea.hidden = true;
  if (evaluationNextBtn) {
    evaluationNextBtn.hidden = false;
    evaluationNextBtn.disabled = false;
    evaluationNextBtn.textContent = 'Weiter';
  }

  advanceEvaluationStep(false);
}

function showEvaluationOutcome(rawScore) {
  if (!evaluationActionArea) return;
  evaluationActionArea.hidden = false;
  if (rawScore < 1) {
    evaluationActionArea.classList.add('game-over');
    if (evaluationOutcomeTitle) evaluationOutcomeTitle.textContent = 'Game Over: Die Stunde ist vorbelastet';
    if (evaluationOutcomeMessage) evaluationOutcomeMessage.textContent = 'Die Vorbereitung erzeugt zu viele Risiken. Für das Spiel bedeutet das: Die Unterrichtsphase würde bereits mit einer Eskalationslage starten.';
    if (step2Btn) {
      step2Btn.hidden = true;
      step2Btn.disabled = true;
    }
    if (newAttemptBtn) {
      newAttemptBtn.hidden = false;
      newAttemptBtn.disabled = false;
    }
  } else {
    evaluationActionArea.classList.remove('game-over');
    if (evaluationOutcomeTitle) evaluationOutcomeTitle.textContent = 'Vorbereitung tragfähig';
    if (evaluationOutcomeMessage) evaluationOutcomeMessage.textContent = 'Die Klasse kann in den nächsten Vorbereitungsschritt übergehen: Klassenregeln auswählen und für spätere Szenarien als Variablen speichern.';
    if (step2Btn) {
      step2Btn.hidden = false;
      step2Btn.disabled = false;
    }
    if (newAttemptBtn) {
      newAttemptBtn.hidden = true;
      newAttemptBtn.disabled = true;
    }
  }
}

function renderFeedbackList(listEl, feedback) {
  listEl.innerHTML = '';
  feedback.forEach(item => {
    const li = document.createElement('li');
    li.className = item.type;
    const delta = document.createElement('span');
    delta.className = `feedback-delta ${item.delta > 0 ? 'positive' : item.delta < 0 ? 'negative' : 'neutral'}`;
    delta.textContent = item.delta > 0 ? `+${item.delta}` : String(item.delta ?? 0);
    const body = document.createElement('div');
    body.className = 'feedback-body';
    const text = document.createElement('strong');
    text.textContent = item.text;
    body.appendChild(text);
    if (item.detail) {
      const detail = document.createElement('p');
      detail.textContent = item.detail;
      body.appendChild(detail);
    }
    li.appendChild(delta);
    li.appendChild(body);
    listEl.appendChild(li);
  });
}

function clearResults() {
  clearEvaluationTimers();
  state.score = null;
  state.rawScore = null;
  state.feedback = [];
  state.metrics = {};
  scoreValue.textContent = '–';
  resultsPanel.hidden = true;
  if (evaluationOverlay) evaluationOverlay.hidden = true;
  if (overlayCloseBtn) overlayCloseBtn.hidden = false;
  if (evaluationActionArea) evaluationActionArea.hidden = true;
}

const tutorialSlides = [
  {
    title: 'Ziel des Rasterspiels',
    text: 'Du gestaltest den Klassenraum, bevor die Stunde beginnt. Gute Prävention erhöht die Startstabilität für die nächste Spielphase.',
    bullets: ['Tische sinnvoll platzieren', 'Schüler*innen passend verteilen', 'Lehrkraft so stellen, dass wichtige Plätze gut sichtbar sind', 'Am Ende wird die Vorbereitung streng bewertet'],
    visual: 'goal'
  },
  {
    title: 'Lehrkraft und Sichtbereich',
    text: 'Die Lehrkraft kann frei im Raum platziert werden. Der Sichtbereich fächert sich in Blickrichtung nach vorne auf.',
    bullets: ['Dunkles Grün bedeutet starke Sicht- und Präsenzwirkung', 'Tische schwächen dahinterliegende Felder ab', 'Lehrkraft anklicken: Blickrichtung ändern', 'Störanfällige Schüler*innen sollten möglichst im wirksamen Sichtfeld sitzen'],
    visual: 'teacher'
  },
  {
    title: 'Rote Risikofelder',
    text: 'Einige Schülerprofile erzeugen im Umfeld Störrisiken. Diese Profile wirken im Spiel verdeckt im Hintergrund weiter.',
    bullets: ['Ablenkung wirkt häufig links und rechts', 'Konflikte zählen auch diagonal', 'Verdecktes Off-Task-Verhalten ist in blinden Bereichen riskanter', 'Rot bedeutet: erhöhte Störanfälligkeit'],
    visual: 'risk'
  },
  {
    title: 'Grüne Stabilisierung',
    text: 'Stabilisierende Schüler*innen und gute Sichtbereiche können Risiken abschwächen.',
    bullets: ['Grün steht für Übersicht, Unterstützung oder Vermittlung', 'Je dunkler das Grün, desto stärker der Schutzfaktor', 'Stabile Sitznachbarschaften können riskante Nähe abfedern'],
    visual: 'support'
  },
  {
    title: 'Neutralisierung: Rot trifft Grün',
    text: 'Wenn ein Risiko durch Sichtbereich oder unterstützende Nachbarschaft abgefedert wird, entsteht eine neutrale gelb-orange Zone.',
    bullets: ['Gelb/Orange bedeutet: Risiko ist nicht weg, aber abgefedert', 'So kann ein gefährdeter Platz geschützt werden', 'Die Auswertung rechnet Rot und Grün gegeneinander auf'],
    visual: 'neutralize'
  },
  {
    title: 'Gänge und Laufwege',
    text: 'Achte darauf, dass Tischreihen nach vorne und hinten nicht zu eng gestellt werden.',
    bullets: ['Zwischen Tischreihen sollte möglichst ein Gang frei bleiben', 'So kann sich die Lehrkraft besser im Raum bewegen', 'Blockierte Laufwege geben später Punktabzug'],
    visual: 'spacing'
  },
  {
    title: 'Raumsauberkeit und Störreize',
    text: 'Müll im Klassenraum erzeugt starke rote Störfelder. Mit dem Besen kannst du Müll entfernen.',
    bullets: ['Besen anklicken, danach Müll anklicken', 'Müll wirkt nach oben, unten, links und rechts als Störreiz', 'Ein aufgeräumter Raum reduziert Ablenkung'],
    visual: 'trash'
  },
  {
    title: 'Worauf du achten solltest',
    text: 'Die Vorbereitung wird streng bewertet. Einzelne riskante Nachbarschaften geben jeweils Abzug, gute Sichtbarkeit und stabile Nachbarschaften geben Punkte.',
    bullets: ['Alle 10 Schüler*innen müssen platziert sein', 'Müll möglichst entfernen', 'Störanfällige Schüler*innen sichtbar setzen', 'Riskante Paare trennen oder stabilisieren', 'Danach folgt Schritt 2: Klassenregeln auswählen'],
    visual: 'checklist'
  }
];

function tutorialVisualMarkup(type) {
  if (type === 'goal') return `
    <div class="tutorial-mini-board goal-board">
      <div class="mini-card mini-desk">Tisch</div><div class="mini-card mini-student">Schüler*in</div><div class="mini-card mini-teacher">LK</div>
      <div class="mini-arrow">→</div><div class="mini-score"><span></span><span></span><span></span><span></span><span></span></div>
    </div>`;
  if (type === 'teacher') return `
    <div class="tutorial-viz-grid viz-teacher">
      <span class="viz-cell"></span><span class="viz-cell"></span><span class="viz-cell teacher-mini">Lehrkraft<br>↓</span><span class="viz-cell"></span><span class="viz-cell"></span>
      <span class="viz-cell"></span><span class="viz-cell green-3"></span><span class="viz-cell green-4"></span><span class="viz-cell green-3"></span><span class="viz-cell"></span>
      <span class="viz-cell green-2"></span><span class="viz-cell green-2"></span><span class="viz-cell desk-mini">Tisch 7<br><small>freier Platz</small></span><span class="viz-cell green-2"></span><span class="viz-cell green-2"></span>
      <span class="viz-cell green-1"></span><span class="viz-cell green-1"></span><span class="viz-cell green-1"></span><span class="viz-cell green-1"></span><span class="viz-cell green-1"></span>
    </div>`;
  if (type === 'risk') return `
    <div class="tutorial-mini-grid risk-demo">
      <span></span><span class="r2"></span><span></span>
      <span class="r1"></span><span class="student-risk">Petra</span><span class="r1"></span>
      <span></span><span class="r2"></span><span></span>
    </div>`;
  if (type === 'support') return `
    <div class="tutorial-mini-grid risk-demo support-demo">
      <span class="g2"></span><span class="g2"></span><span class="g2"></span>
      <span class="g1"></span><span class="student-support">Amira</span><span class="g1"></span>
      <span class="g2"></span><span class="g2"></span><span class="g2"></span>
    </div>`;
  if (type === 'neutralize') return `
    <div class="tutorial-viz-grid viz-neutralize">
      <span class="viz-cell red-2"></span><span class="viz-cell red-2"></span><span class="viz-cell red-2"></span><span class="viz-cell"></span><span class="viz-cell"></span>
      <span class="viz-cell red-2"></span><span class="viz-cell desk-mini">Tisch 1<span class="remove-x">×</span><br><strong>Ben</strong></span><span class="viz-cell neutral-1"></span><span class="viz-cell desk-mini">Tisch 4<span class="remove-x">×</span><br><strong>Sara</strong></span><span class="viz-cell green-2"></span>
      <span class="viz-cell red-2"></span><span class="viz-cell red-2"></span><span class="viz-cell red-2"></span><span class="viz-cell"></span><span class="viz-cell"></span>
    </div>`;
  if (type === 'spacing') return `
    <div class="tutorial-viz-grid viz-spacing">
      <span class="viz-cell"></span><span class="viz-cell"></span><span class="viz-cell teacher-mini">Lehrkraft<br>↓</span><span class="viz-cell"></span><span class="viz-cell"></span>
      <span class="viz-cell desk-mini">Tisch 2<br><small>freier Platz</small></span><span class="viz-cell desk-mini">Tisch 1<br><small>freier Platz</small></span><span class="viz-cell green-2"></span><span class="viz-cell desk-mini">Tisch 4<br><small>freier Platz</small></span><span class="viz-cell desk-mini">Tisch 9<br><small>freier Platz</small></span>
      <span class="viz-cell green-1"></span><span class="viz-cell green-1"></span><span class="viz-cell green-1"></span><span class="viz-cell green-1"></span><span class="viz-cell green-1"></span>
      <span class="viz-cell desk-mini">Tisch 6<br><small>freier Platz</small></span><span class="viz-cell desk-mini">Tisch 5<br><small>freier Platz</small></span><span class="viz-cell green-2"></span><span class="viz-cell desk-mini">Tisch 7<br><small>freier Platz</small></span><span class="viz-cell desk-mini">Tisch 8<br><small>freier Platz</small></span>
    </div>`;
  if (type === 'trash') return `
    <div class="tutorial-viz-grid viz-trash">
      <span class="viz-cell red-2 trash-home">🗑️</span><span class="viz-cell red-2"></span><span class="viz-cell"></span>
      <span class="viz-cell red-2"></span><span class="viz-cell"></span><span class="viz-cell"></span>
      <span class="viz-cell"></span><span class="viz-cell"></span><span class="viz-cell broom-home">🧹</span>
    </div>`;
  return `
    <div class="tutorial-check-demo">
      <div><strong>✓</strong><span>alle platziert</span></div>
      <div><strong>✓</strong><span>Sichtfeld genutzt</span></div>
      <div><strong>!</strong><span>riskante Nähe prüfen</span></div>
      <div><strong>✓</strong><span>Stabilisierung einsetzen</span></div>
    </div>`;
}

function openTutorial() {
  if (!tutorialOverlay) return;
  tutorialIndex = 0;
  tutorialOverlay.hidden = false;
  document.body.classList.add('tutorial-open');
  renderTutorial(false);
}

function closeTutorial(showGate = !gameStarted) {
  if (!tutorialOverlay) return;
  tutorialOverlay.hidden = true;
  if (showGate) openStartGate();
  else document.body.classList.remove('tutorial-open');
}

function renderTutorial(animated = true, direction = 'next') {
  if (!tutorialSlide) return;
  const render = () => {
    const slide = tutorialSlides[tutorialIndex];
    if (tutorialProgress) tutorialProgress.textContent = `${tutorialIndex + 1}/${tutorialSlides.length}`;
    if (tutorialTitle) tutorialTitle.textContent = slide.title;
    if (tutorialText) tutorialText.textContent = slide.text;
    if (tutorialVisual) tutorialVisual.innerHTML = tutorialVisualMarkup(slide.visual);
    if (tutorialList) tutorialList.innerHTML = slide.bullets.map(item => `<li>${item}</li>`).join('');
    if (tutorialPrevBtn) tutorialPrevBtn.disabled = tutorialIndex === 0;
    if (tutorialNextBtn) tutorialNextBtn.textContent = tutorialIndex === tutorialSlides.length - 1 ? 'Fertig' : 'Weiter';
    renderTutorialDots();
  };

  if (!animated) {
    render();
    return;
  }
  tutorialSlide.classList.remove('tutorial-enter-left', 'tutorial-enter-right', 'tutorial-exit-left', 'tutorial-exit-right');
  tutorialSlide.classList.add(direction === 'prev' ? 'tutorial-exit-right' : 'tutorial-exit-left');
  window.setTimeout(() => {
    render();
    tutorialSlide.classList.remove('tutorial-exit-left', 'tutorial-exit-right');
    tutorialSlide.classList.add(direction === 'prev' ? 'tutorial-enter-left' : 'tutorial-enter-right');
    window.setTimeout(() => tutorialSlide.classList.remove('tutorial-enter-left', 'tutorial-enter-right'), 360);
  }, 260);
}

function renderTutorialDots() {
  if (!tutorialDots) return;
  tutorialDots.innerHTML = '';
  tutorialSlides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = index === tutorialIndex ? 'active' : '';
    dot.setAttribute('aria-label', `Erklärungskarte ${index + 1} anzeigen`);
    dot.addEventListener('click', () => {
      if (index === tutorialIndex) return;
      const direction = index < tutorialIndex ? 'prev' : 'next';
      tutorialIndex = index;
      renderTutorial(true, direction);
    });
    tutorialDots.appendChild(dot);
  });
}

function nextTutorialSlide() {
  if (tutorialIndex >= tutorialSlides.length - 1) {
    closeTutorial(true);
    return;
  }
  tutorialIndex += 1;
  renderTutorial(true, 'next');
}

function prevTutorialSlide() {
  if (tutorialIndex <= 0) return;
  tutorialIndex -= 1;
  renderTutorial(true, 'prev');
}

function updatePreparationTimerDisplay() {
  if (!prepTimerValue) return;
  const safe = Math.max(0, preparationTimeLeft);
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
  const seconds = String(safe % 60).padStart(2, '0');
  prepTimerValue.textContent = `${minutes}:${seconds}`;
}

function stopPreparationTimer() {
  if (preparationTimerId) {
    window.clearInterval(preparationTimerId);
    preparationTimerId = null;
  }
}

function showTimeUpState() {
  stopPreparationTimer();
  evaluationSession = null;
  if (!evaluationOverlay) return;
  evaluationOverlay.hidden = false;
  if (overlayCloseBtn) overlayCloseBtn.hidden = true;
  if (evaluationTitle) evaluationTitle.textContent = 'Zeit abgelaufen';
  if (evaluationStepCounter) evaluationStepCounter.textContent = 'Zeitlimit erreicht';
  if (evaluationStepDelta) {
    evaluationStepDelta.textContent = '0';
    evaluationStepDelta.className = 'step-delta neutral';
  }
  if (evaluationCurrentText) evaluationCurrentText.textContent = 'Die fünf Minuten für die Vorbereitung sind vorbei.';
  if (evaluationCurrentDetail) evaluationCurrentDetail.textContent = 'Die Stunde beginnt jetzt. Für diese Runde ist die Vorbereitungsphase beendet.';
  if (evaluationNextBtn) evaluationNextBtn.hidden = true;
  if (evaluationActionArea) evaluationActionArea.hidden = false;
  if (evaluationOutcomeTitle) evaluationOutcomeTitle.textContent = 'Zeit ist um';
  if (evaluationOutcomeMessage) evaluationOutcomeMessage.textContent = 'Du kannst einen neuen Versuch starten und den Klassenraum noch einmal vorbereiten.';
  if (step2Btn) step2Btn.hidden = true;
  if (newAttemptBtn) newAttemptBtn.hidden = false;
}

function startPreparationTimer() {
  stopPreparationTimer();
  preparationTimeLeft = 300;
  updatePreparationTimerDisplay();
  preparationTimerId = window.setInterval(() => {
    preparationTimeLeft -= 1;
    updatePreparationTimerDisplay();
    if (preparationTimeLeft <= 0) {
      preparationTimeLeft = 0;
      updatePreparationTimerDisplay();
      showTimeUpState();
    }
  }, 1000);
}

function openStartGate() {
  if (!startGateOverlay) return;
  startGateOverlay.hidden = false;
  document.body.classList.add('tutorial-open');
}

function closeStartGate() {
  if (!startGateOverlay) return;
  startGateOverlay.hidden = true;
  gameStarted = true;
  document.body.classList.remove('tutorial-open');
  startPreparationTimer();
}

function bindTutorialEvents() {
  if (showTutorialBtn) showTutorialBtn.addEventListener('click', () => { if (startGateOverlay && !startGateOverlay.hidden) closeStartGate(); openTutorial(); });
  if (tutorialSkipBtn) tutorialSkipBtn.addEventListener('click', () => closeTutorial(true));
  if (tutorialNextBtn) tutorialNextBtn.addEventListener('click', nextTutorialSlide);
  if (tutorialPrevBtn) tutorialPrevBtn.addEventListener('click', prevTutorialSlide);
  if (startGameBtn) startGameBtn.addEventListener('click', closeStartGate);
  if (tutorialOverlay) {
    tutorialOverlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeTutorial();
      if (event.key === 'ArrowRight') nextTutorialSlide();
      if (event.key === 'ArrowLeft') prevTutorialSlide();
    });
  }
}

function bindGlobalEvents() {
  if (layoutSelect) layoutSelect.addEventListener('change', () => initLayout(layoutSelect.value, false));
  if (teacherModeSelect) teacherModeSelect.addEventListener('change', () => {
    state.teacher.mode = teacherModeSelect.value;
    clearResults();
    renderGrid();
  });
  if (teacherToken) {
    teacherToken.addEventListener('dragstart', event => {
      event.stopPropagation();
      startDrag(event, { type: 'teacher' });
    });
    teacherToken.addEventListener('dragend', clearDragState);
    teacherToken.addEventListener('click', () => {
      state.placingTeacher = !state.placingTeacher;
      state.selectedStudentId = null;
      updateTeacherPlacementButton();
      renderPalette();
      renderGrid();
    });
  }
  document.querySelectorAll('.dir-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      state.teacher.dir = button.dataset.dir;
      setDirectionActive(state.teacher.dir);
      clearResults();
      renderGrid();
      closeTeacherDirectionPopover();
    });
  });
  paletteEl.addEventListener('dragover', event => {
    if (dragState.type === 'student') {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      paletteEl.classList.add('drop-hover');
    }
  });
  paletteEl.addEventListener('dragleave', () => paletteEl.classList.remove('drop-hover'));
  paletteEl.addEventListener('drop', event => {
    event.preventDefault();
    paletteEl.classList.remove('drop-hover');
    const data = getDropData(event);
    if (data.type === 'student' && data.studentId) {
      Object.keys(state.assignments).forEach(deskId => {
        if (state.assignments[deskId] === data.studentId) delete state.assignments[deskId];
      });
      clearResults();
      render();
    }
    clearDragState();
  });
  if (overlayCloseBtn) overlayCloseBtn.addEventListener('click', () => { evaluationOverlay.hidden = true; evaluationSession = null; });
  if (evaluationNextBtn) evaluationNextBtn.addEventListener('click', () => advanceEvaluationStep(true));
  if (step2Btn) step2Btn.addEventListener('click', () => {
    stopPreparationTimer();
    if (saveStepStateForNextPage()) window.location.href = 'rules.html';
  });
  if (newAttemptBtn) newAttemptBtn.addEventListener('click', () => {
    stopPreparationTimer();
    gameStarted = false;
    try {
      localStorage.removeItem('classroomGame.step1');
      localStorage.removeItem('classroomGame.step2.rulesDraft');
      localStorage.removeItem('classroomGame.step2.rules');
    } catch (error) {
      console.warn('LocalStorage konnte nicht geleert werden.', error);
    }
    if (evaluationOverlay) evaluationOverlay.hidden = true;
    if (evaluationNextBtn) evaluationNextBtn.hidden = false;
    if (step2Btn) step2Btn.hidden = false;
    evaluationSession = null;
    initLayout('rows', false);
    openStartGate();
  });
  document.addEventListener('click', event => {
    if (teacherDirectionPopover && !teacherDirectionPopover.hidden && !event.target.closest('.teacher-direction-popover') && !event.target.closest('.teacher-in-room')) {
      closeTeacherDirectionPopover();
    }
  });
  evaluateBtn.addEventListener('click', evaluatePreparation);
  resetBtn.addEventListener('click', () => {
    const wasStarted = gameStarted;
    initLayout(state.layout, false);
    gameStarted = wasStarted;
    if (wasStarted) startPreparationTimer();
  });
  document.addEventListener('dragend', clearDragState);
  document.addEventListener('drop', () => clearDragState());
}

bindGlobalEvents();
bindTutorialEvents();
initLayout('rows');
if (startGateOverlay) startGateOverlay.hidden = true;
openTutorial();
