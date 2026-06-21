const ROWS = 9;
const COLS = 10;

const students = [
  { id: 'julius', name: 'Julius', age: 12, note: 'verträgt sich schlecht mit anderen Jungs', hidden: { gender: 'm', risk: 3, conflictWithBoys: true, needsMonitoring: true } },
  { id: 'petra', name: 'Petra', age: 15, note: 'lenkt häufig Sitznachbar*innen ab', hidden: { gender: 'f', risk: 3, distractor: true, needsMonitoring: true } },
  { id: 'mehmet', name: 'Mehmet', age: 13, note: 'arbeitet ruhig und stabilisiert Gruppen', hidden: { gender: 'm', risk: 1, stabilizer: true } },
  { id: 'lina', name: 'Lina', age: 12, note: 'reagiert empfindlich auf Kritik und Spott', hidden: { gender: 'f', risk: 2, sensitive: true, needsSafety: true } },
  { id: 'ben', name: 'Ben', age: 14, note: 'testet gerne Grenzen aus', hidden: { gender: 'm', risk: 3, boundaryTesting: true, needsMonitoring: true } },
  { id: 'sara', name: 'Sara', age: 13, note: 'arbeitet zuverlässig und hilft anderen', hidden: { gender: 'f', risk: 1, stabilizer: true } },
  { id: 'tom', name: 'Tom', age: 12, note: 'sucht Aufmerksamkeit durch Zwischenrufe', hidden: { gender: 'm', risk: 3, callsOut: true, needsMonitoring: true } },
  { id: 'emily', name: 'Emily', age: 13, note: 'braucht klare Orientierung bei Übergängen', hidden: { gender: 'f', risk: 2, needsStructure: true } },
  { id: 'niklas', name: 'Niklas', age: 14, note: 'versteckt gern das Handy unter dem Tisch', hidden: { gender: 'm', risk: 3, phoneRisk: true, needsMonitoring: true } },
  { id: 'amira', name: 'Amira', age: 12, note: 'vermittelt oft zwischen Mitschüler*innen', hidden: { gender: 'f', risk: 1, mediator: true, stabilizer: true } }
];

const layouts = {
  rows: {
    label: 'Reihensitzordnung',
    deskPositions: [[2,1], [2,3], [2,6], [2,8], [4,1], [4,3], [4,6], [4,8], [6,3], [6,6]],
    teacher: { row: 0, col: 4, dir: 'down' }
  },
  uform: {
    label: 'U-Form',
    deskPositions: [[1,1], [2,1], [3,1], [4,1], [5,2], [6,3], [6,5], [5,7], [4,8], [3,8]],
    teacher: { row: 1, col: 4, dir: 'down' }
  },
  groups: {
    label: 'Gruppentische',
    deskPositions: [[2,2], [2,3], [3,2], [3,3], [2,6], [2,7], [3,6], [3,7], [6,4], [6,5]],
    teacher: { row: 0, col: 4, dir: 'down' }
  },
  pairs: {
    label: 'Partnerinseln',
    deskPositions: [[1,2], [1,3], [3,1], [3,2], [3,7], [3,8], [6,2], [6,3], [6,6], [6,7]],
    teacher: { row: 0, col: 4, dir: 'down' }
  }
};

const state = {
  layout: 'rows',
  desks: [],
  assignments: {},
  teacher: { row: 0, col: 4, dir: 'down', mode: 'frontStanding' },
  selectedStudentId: null,
  placingTeacher: false,
  score: null,
  feedback: [],
  metrics: {}
};

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
const resultsPanel = document.getElementById('resultsPanel');
const feedbackList = document.getElementById('feedbackList');
const meterFill = document.getElementById('meterFill');
const stateOutput = document.getElementById('stateOutput');

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

  state.teacher = { ...layout.teacher, mode: teacherModeSelect.value || 'frontStanding' };
  state.placingTeacher = false;
  setDirectionActive(state.teacher.dir);
  updateTeacherPlacementButton();
  clearResults();
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

      if (state.placingTeacher) cell.classList.add('teacher-placement-active');

      const desk = getDeskAt(row, col);
      if (desk) cell.appendChild(createDeskElement(desk));

      if (state.teacher.row === row && state.teacher.col === col) cell.appendChild(createTeacherInRoom());

      bindCellDnD(cell);
      cell.addEventListener('click', () => handleCellClick(row, col));
      gridEl.appendChild(cell);
    }
  }
}

function createDeskElement(desk) {
  const deskEl = document.createElement('div');
  deskEl.className = 'desk';
  deskEl.draggable = true;
  deskEl.dataset.deskId = desk.id;

  const label = document.createElement('div');
  label.className = 'desk-label';
  label.innerHTML = `<span>${desk.id.replace('desk-', 'Tisch ')}</span><span>↕</span>`;

  const assignedStudentId = state.assignments[desk.id];
  const seat = document.createElement('div');
  if (assignedStudentId) {
    const student = getStudent(assignedStudentId);
    seat.className = 'student-chip';
    seat.draggable = true;
    seat.dataset.studentId = student.id;
    seat.textContent = student.name;
    seat.title = `${student.name} (${student.age}) · ${student.note}`;
    seat.addEventListener('dragstart', event => {
      event.stopPropagation();
      event.dataTransfer.setData('type', 'student');
      event.dataTransfer.setData('studentId', student.id);
      event.dataTransfer.effectAllowed = 'move';
    });
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
    if (event.target.classList.contains('student-chip')) return;
    event.stopPropagation();
    event.dataTransfer.setData('type', 'desk');
    event.dataTransfer.setData('deskId', desk.id);
    event.dataTransfer.effectAllowed = 'move';
  });

  deskEl.addEventListener('dragover', event => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  });

  deskEl.addEventListener('drop', event => {
    const type = event.dataTransfer.getData('type');
    if (type === 'student') {
      event.preventDefault();
      event.stopPropagation();
      assignStudentToDesk(event.dataTransfer.getData('studentId'), desk.id);
    }
  });

  deskEl.addEventListener('click', event => {
    event.stopPropagation();
    if (state.selectedStudentId) assignStudentToDesk(state.selectedStudentId, desk.id);
  });

  return deskEl;
}

function createTeacherInRoom() {
  const el = document.createElement('div');
  el.className = 'teacher-in-room';
  el.draggable = true;
  el.textContent = directionLabel(state.teacher.dir);
  el.title = 'Lehrkraft bewegen';
  el.addEventListener('dragstart', event => {
    event.stopPropagation();
    event.dataTransfer.setData('type', 'teacher');
    event.dataTransfer.effectAllowed = 'move';
  });
  el.addEventListener('click', event => {
    event.stopPropagation();
    state.placingTeacher = !state.placingTeacher;
    updateTeacherPlacementButton();
    renderGrid();
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
    card.innerHTML = `<div class="student-name">${student.name} (${student.age})</div><div class="student-note">${student.note}</div>`;
    card.addEventListener('dragstart', event => {
      event.dataTransfer.setData('type', 'student');
      event.dataTransfer.setData('studentId', student.id);
      event.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('click', () => selectStudent(student.id));
    paletteEl.appendChild(card);
  });
}

function bindCellDnD(cell) {
  cell.addEventListener('dragover', event => {
    const type = event.dataTransfer.getData('type');
    if (!type) return;
    event.preventDefault();
    cell.classList.add('drop-hover');
  });

  cell.addEventListener('dragleave', () => cell.classList.remove('drop-hover'));

  cell.addEventListener('drop', event => {
    event.preventDefault();
    cell.classList.remove('drop-hover');
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const type = event.dataTransfer.getData('type');

    if (type === 'desk') moveDesk(event.dataTransfer.getData('deskId'), row, col);
    if (type === 'teacher') placeTeacher(row, col);
    if (type === 'student') {
      const desk = getDeskAt(row, col);
      if (desk) assignStudentToDesk(event.dataTransfer.getData('studentId'), desk.id);
    }
  });
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
  render();
}

function moveDesk(deskId, row, col) {
  if (!deskId || getDeskAt(row, col)) return;
  if (state.teacher.row === row && state.teacher.col === col) return;
  const desk = state.desks.find(item => item.id === deskId);
  if (!desk) return;
  desk.row = row;
  desk.col = col;
  clearResults();
  renderGrid();
}

function placeTeacher(row, col) {
  if (getDeskAt(row, col)) return;
  state.teacher.row = row;
  state.teacher.col = col;
  state.placingTeacher = false;
  updateTeacherPlacementButton();
  clearResults();
  renderGrid();
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

function directionLabel(dir) {
  return ({ up: 'Lehrkraft ↑', down: 'Lehrkraft ↓', left: 'Lehrkraft ←', right: 'Lehrkraft →' })[dir] || 'Lehrkraft';
}

function setDirectionActive(dir) {
  document.querySelectorAll('.dir-btn').forEach(button => button.classList.toggle('active', button.dataset.dir === dir));
}

function updateTeacherPlacementButton() {
  teacherToken.classList.toggle('selected', state.placingTeacher);
  teacherToken.textContent = state.placingTeacher ? 'Ziel wählen' : 'Lehrkraft';
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
    // Bewegend im Raum: eher linearer Präsenzkorridor. Die Wirkung fällt nach außen schnell ab.
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
    const blockers = countDeskBlockersBefore(candidate);
    // Jeder Tisch auf dem gedachten Sichtstrahl schwächt die dahinterliegenden Felder deutlich ab.
    const strength = Math.max(0, candidate.baseStrength - blockers * 2);
    if (strength <= 0) return;
    const level = Math.max(1, Math.min(5, 6 - strength)); // level 1 = dunkel/stark, level 5 = sehr schwach
    const key = cellKey(candidate.row, candidate.col);
    const existing = map.get(key);
    if (!existing || strength > existing.strength) map.set(key, { ...candidate, blockers, strength, level });
  });
  return map;
}

function countDeskBlockersBefore(candidate) {
  let blockers = 0;
  const { row, col, dir } = state.teacher;
  for (let step = 1; step < candidate.step; step++) {
    const scaledOffset = Math.round(candidate.offset * (step / candidate.step));
    const pos = offsetCell(row, col, dir, step, scaledOffset);
    if (insideGrid(pos.row, pos.col) && getDeskAt(pos.row, pos.col)) blockers += 1;
  }
  return blockers;
}

function getVisionStrengthAt(row, col) {
  return getVisionMap().get(cellKey(row, col))?.strength || 0;
}

function isDeskEffectivelyInVision(desk) {
  return getVisionStrengthAt(desk.row, desk.col) >= 2;
}

function manhattan(a, b) { return Math.abs(a.row - b.row) + Math.abs(a.col - b.col); }
function isNear(a, b) { return manhattan(a, b) <= 2; }

function getStudentDesk(studentId) {
  const deskId = Object.entries(state.assignments).find(([, sid]) => sid === studentId)?.[0];
  return deskId ? state.desks.find(desk => desk.id === deskId) || null : null;
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
    visionModel: 'fan-or-linear-with-desk-attenuation',
    visibleRiskStudents: [],
    weaklyVisibleRiskStudents: [],
    blindRiskStudents: [],
    riskyPairs: [],
    stabilizingPairs: [],
    backRowRisks: [],
    futureScenarioHooks: []
  };

  let score = 5;
  const placedCount = Object.keys(state.assignments).length;
  if (placedCount === students.length) {
    score += 1;
    feedback.push({ type: 'good', text: 'Alle Schüler*innen sind platziert. Das erhöht die Planbarkeit der Stunde.' });
  } else {
    score -= 1;
    feedback.push({ type: 'warning', text: `${students.length - placedCount} Schüler*innen sind noch nicht platziert. Das würde später keine saubere Szenario-Auswahl erlauben.` });
  }

  const layoutEffect = evaluateLayoutBase();
  score += layoutEffect.delta;
  feedback.push(layoutEffect.feedback);

  const visibleRiskStudents = [];
  const weaklyVisibleRiskStudents = [];
  const blindRiskStudents = [];

  students.forEach(student => {
    const desk = getStudentDesk(student.id);
    if (!desk || student.hidden.risk < 3) return;
    const strength = getVisionStrengthAt(desk.row, desk.col);
    if (strength >= 3) visibleRiskStudents.push(student);
    else if (strength >= 1) weaklyVisibleRiskStudents.push(student);
    else blindRiskStudents.push(student);
  });

  metrics.visibleRiskStudents = visibleRiskStudents.map(s => s.id);
  metrics.weaklyVisibleRiskStudents = weaklyVisibleRiskStudents.map(s => s.id);
  metrics.blindRiskStudents = blindRiskStudents.map(s => s.id);

  if (visibleRiskStudents.length >= 3) {
    score += 2;
    feedback.push({ type: 'good', text: 'Mehrere störanfällige Schüler*innen liegen in einem wirksamen Sichtbereich der Lehrkraft.' });
  } else if (visibleRiskStudents.length >= 1) {
    score += 1;
    feedback.push({ type: 'good', text: 'Mindestens ein störanfälliger Schüler liegt in einem wirksamen Sichtbereich der Lehrkraft.' });
  }

  if (weaklyVisibleRiskStudents.length >= 1) {
    metrics.futureScenarioHooks.push('weak-vision-through-desk-blocking');
    feedback.push({ type: 'warning', text: 'Einige störanfällige Schüler*innen liegen nur schwach im Sichtfeld, weil Tische davor das Sichtfeld brechen.' });
  }

  if (blindRiskStudents.length >= 2) {
    score -= 2;
    metrics.futureScenarioHooks.push('blindspot-disruption');
    feedback.push({ type: 'bad', text: 'Mehrere störanfällige Schüler*innen sitzen außerhalb eines wirksamen Sichtbereichs. Das kann später Blind-Spot-Störungen auslösen.' });
  } else if (blindRiskStudents.length === 1) {
    score -= 1;
    metrics.futureScenarioHooks.push('minor-blindspot');
    feedback.push({ type: 'warning', text: 'Ein störanfälliger Schüler sitzt außerhalb eines wirksamen Sichtbereichs.' });
  }

  const pairResult = evaluatePairs();
  score += pairResult.delta;
  feedback.push(...pairResult.feedback);
  metrics.riskyPairs = pairResult.riskyPairs;
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

  score = Math.max(0, Math.min(10, Math.round(score)));
  state.score = score;
  state.feedback = feedback;
  state.metrics = metrics;
  showResults(score, feedback, metrics);
}

function evaluateLayoutBase() {
  if (state.layout === 'rows') return { delta: 1, feedback: { type: 'good', text: 'Reihensitzordnung: gute Steuerbarkeit und Übersicht, aber weniger kooperative Interaktion.' } };
  if (state.layout === 'uform') return { delta: 1, feedback: { type: 'good', text: 'U-Form: gute Sichtbarkeit und klare Gesprächsausrichtung, sofern die Lehrkraft passend positioniert ist.' } };
  if (state.layout === 'groups') return { delta: -1, feedback: { type: 'warning', text: 'Gruppentische: kooperativ geeignet, aber ohne klare Steuerung höheres Ablenkungs- und Lautstärkerisiko.' } };
  return { delta: 0, feedback: { type: 'warning', text: 'Partnerinseln: ausgewogen, aber die Wirkung hängt stark von den Sitznachbar*innen ab.' } };
}

function evaluatePairs() {
  const result = { delta: 0, feedback: [], riskyPairs: [], stabilizingPairs: [], hooks: [] };
  const placed = students.filter(student => getStudentDesk(student.id));

  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      const a = placed[i], b = placed[j];
      const deskA = getStudentDesk(a.id), deskB = getStudentDesk(b.id);
      if (!deskA || !deskB || !isNear(deskA, deskB)) continue;
      const conflict =
        (a.hidden.conflictWithBoys && b.hidden.gender === 'm') ||
        (b.hidden.conflictWithBoys && a.hidden.gender === 'm') ||
        (a.hidden.distractor && b.hidden.risk >= 2) ||
        (b.hidden.distractor && a.hidden.risk >= 2) ||
        (a.hidden.boundaryTesting && b.hidden.callsOut) ||
        (b.hidden.boundaryTesting && a.hidden.callsOut);
      const stabilizing =
        (a.hidden.stabilizer && b.hidden.risk >= 3) ||
        (b.hidden.stabilizer && a.hidden.risk >= 3) ||
        (a.hidden.mediator && b.hidden.conflictWithBoys) ||
        (b.hidden.mediator && a.hidden.conflictWithBoys);
      if (conflict) result.riskyPairs.push([a.id, b.id]);
      if (stabilizing) result.stabilizingPairs.push([a.id, b.id]);
    }
  }

  if (result.riskyPairs.length >= 3) {
    result.delta -= 2;
    result.hooks.push('peer-conflict-high');
    result.feedback.push({ type: 'bad', text: 'Mehrere riskante Sitznachbarschaften wurden erzeugt. Das erhöht die Wahrscheinlichkeit für Nebengespräche, Provokationen oder Konflikte.' });
  } else if (result.riskyPairs.length >= 1) {
    result.delta -= 1;
    result.hooks.push('peer-conflict-medium');
    result.feedback.push({ type: 'warning', text: 'Mindestens eine riskante Sitznachbarschaft ist vorhanden.' });
  } else {
    result.delta += 1;
    result.feedback.push({ type: 'good', text: 'Es wurden keine deutlich riskanten Sitznachbarschaften erkannt.' });
  }

  if (result.stabilizingPairs.length >= 2) {
    result.delta += 1;
    result.feedback.push({ type: 'good', text: 'Stabilisierende Sitznachbarschaften können einzelne Störpotenziale abfedern.' });
  }

  return result;
}

function evaluateBackRowRisks() {
  const result = { delta: 0, feedback: [], backRowRisks: [], hooks: [] };
  const backRows = [6, 7, 8];
  students.forEach(student => {
    const desk = getStudentDesk(student.id);
    if (!desk) return;
    const weakVision = !isDeskEffectivelyInVision(desk);
    if (backRows.includes(desk.row) && weakVision && (student.hidden.phoneRisk || student.hidden.needsMonitoring || student.hidden.distractor)) {
      result.backRowRisks.push(student.id);
    }
  });

  if (result.backRowRisks.length >= 2) {
    result.delta -= 2;
    result.hooks.push('backrow-phone-or-offtask');
    result.feedback.push({ type: 'bad', text: 'Mehrere kontrollbedürftige Schüler*innen sitzen weit hinten und nicht wirksam im Sichtbereich. Das kann später Handy- oder Off-Task-Szenarien begünstigen.' });
  } else if (result.backRowRisks.length === 1) {
    result.delta -= 1;
    result.hooks.push('single-backrow-risk');
    result.feedback.push({ type: 'warning', text: 'Ein kontrollbedürftiger Schüler sitzt weit hinten und nicht wirksam im Sichtbereich.' });
  }
  return result;
}

function evaluateTeacherMode() {
  if (state.teacher.mode === 'moving') return { delta: 1, hooks: ['teacher-moving-presence'], feedback: { type: 'good', text: 'Bewegung im Raum erzeugt eine lineare Präsenzzone und kann verdeckte Störungen früh sichtbar machen.' } };
  if (state.teacher.mode === 'deskSitting') return { delta: -1, hooks: ['teacher-desk-blindspots'], feedback: { type: 'warning', text: 'Sitzend am Pult ist der Sicht- und Handlungsradius auf zwei Reihen eingeschränkt.' } };
  return { delta: 0, hooks: ['teacher-front-led'], feedback: { type: 'good', text: 'Vorne stehend entsteht ein breiter Leitungsfächer. Entscheidend ist, ob risikorelevante Plätze darin liegen.' } };
}

function showResults(score, feedback, metrics) {
  scoreValue.textContent = score;
  meterFill.style.width = `${score * 10}%`;
  feedbackList.innerHTML = '';
  feedback.forEach(item => {
    const li = document.createElement('li');
    li.className = item.type;
    li.textContent = item.text;
    feedbackList.appendChild(li);
  });
  const visionByDesk = state.desks.map(desk => ({
    deskId: desk.id,
    row: desk.row,
    col: desk.col,
    strength: getVisionStrengthAt(desk.row, desk.col),
    studentId: state.assignments[desk.id] || null
  }));
  const exportData = {
    preparationScore: score,
    chosenLayout: { key: state.layout, label: layouts[state.layout].label },
    teacher: state.teacher,
    desks: state.desks,
    assignments: state.assignments,
    visionByDesk,
    metrics,
    suggestedScenarioHooks: [...new Set(metrics.futureScenarioHooks)]
  };
  stateOutput.textContent = JSON.stringify(exportData, null, 2);
  resultsPanel.hidden = false;
}

function clearResults() {
  state.score = null;
  state.feedback = [];
  state.metrics = {};
  scoreValue.textContent = '–';
  resultsPanel.hidden = true;
}

function bindGlobalEvents() {
  layoutSelect.addEventListener('change', () => initLayout(layoutSelect.value, false));
  teacherModeSelect.addEventListener('change', () => {
    state.teacher.mode = teacherModeSelect.value;
    clearResults();
    renderGrid();
  });
  teacherToken.addEventListener('dragstart', event => {
    event.stopPropagation();
    event.dataTransfer.setData('type', 'teacher');
    event.dataTransfer.effectAllowed = 'move';
  });
  teacherToken.addEventListener('click', () => {
    state.placingTeacher = !state.placingTeacher;
    state.selectedStudentId = null;
    updateTeacherPlacementButton();
    renderPalette();
    renderGrid();
  });
  document.querySelectorAll('.dir-btn').forEach(button => {
    button.addEventListener('click', () => {
      state.teacher.dir = button.dataset.dir;
      setDirectionActive(state.teacher.dir);
      clearResults();
      renderGrid();
    });
  });
  paletteEl.addEventListener('dragover', event => {
    if (event.dataTransfer.getData('type') === 'student') {
      event.preventDefault();
      paletteEl.classList.add('drop-hover');
    }
  });
  paletteEl.addEventListener('dragleave', () => paletteEl.classList.remove('drop-hover'));
  paletteEl.addEventListener('drop', event => {
    event.preventDefault();
    paletteEl.classList.remove('drop-hover');
    const type = event.dataTransfer.getData('type');
    const studentId = event.dataTransfer.getData('studentId');
    if (type === 'student' && studentId) {
      Object.keys(state.assignments).forEach(deskId => {
        if (state.assignments[deskId] === studentId) delete state.assignments[deskId];
      });
      clearResults();
      render();
    }
  });
  evaluateBtn.addEventListener('click', evaluatePreparation);
  resetBtn.addEventListener('click', () => initLayout(state.layout, false));
}

bindGlobalEvents();
initLayout('rows');
