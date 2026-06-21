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
  setDirectionActive(state.teacher.dir);
  clearResults();
  render();
}

function render() {
  renderGrid();
  renderPalette();
  updateCounter();
}

function renderGrid() {
  gridEl.innerHTML = '';
  const visionCells = getVisionCells();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      const vision = visionCells.find(item => item.row === row && item.col === col);
      if (vision) cell.classList.add(`vision-${vision.level}`);

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
    event.dataTransfer.setData('type', 'desk');
    event.dataTransfer.setData('deskId', desk.id);
    event.dataTransfer.effectAllowed = 'move';
  });

  deskEl.addEventListener('dragover', event => {
    event.preventDefault();
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
    event.dataTransfer.setData('type', 'teacher');
    event.dataTransfer.effectAllowed = 'move';
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
  const desk = getDeskAt(row, col);
  if (state.selectedStudentId && desk) assignStudentToDesk(state.selectedStudentId, desk.id);
}

function selectStudent(studentId) {
  state.selectedStudentId = state.selectedStudentId === studentId ? null : studentId;
  renderPalette();
}

function assignStudentToDesk(studentId, deskId) {
  if (!studentId || !deskId) return;
  Object.keys(state.assignments).forEach(key => {
    if (state.assignments[key] === studentId) delete state.assignments[key];
  });
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
  clearResults();
  renderGrid();
}

function getDeskAt(row, col) { return state.desks.find(desk => desk.row === row && desk.col === col); }
function getStudent(id) { return students.find(student => student.id === id); }
function isStudentAssigned(studentId) { return Object.values(state.assignments).includes(studentId); }
function updateCounter() { placedCounter.textContent = `${Object.keys(state.assignments).length}/${students.length} platziert`; }

function directionLabel(dir) {
  return ({ up: 'Lehrkraft ↑', down: 'Lehrkraft ↓', left: 'Lehrkraft ←', right: 'Lehrkraft →' })[dir] || 'Lehrkraft';
}

function setDirectionActive(dir) {
  document.querySelectorAll('.dir-btn').forEach(button => button.classList.toggle('active', button.dataset.dir === dir));
}

function getVisionCells() {
  const { row, col, dir, mode } = state.teacher;
  const depth = mode === 'deskSitting' ? 2 : 3;
  const widthBoost = mode === 'moving' ? 1 : 0;
  const cells = [];
  for (let step = 1; step <= depth; step++) {
    const spread = step - 1 + widthBoost;
    for (let offset = -spread; offset <= spread; offset++) {
      let r = row, c = col;
      if (dir === 'up') { r = row - step; c = col + offset; }
      if (dir === 'down') { r = row + step; c = col + offset; }
      if (dir === 'left') { r = row + offset; c = col - step; }
      if (dir === 'right') { r = row + offset; c = col + step; }
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) cells.push({ row: r, col: c, level: step });
    }
  }
  return cells;
}

function isDeskInVision(desk) {
  return getVisionCells().some(cell => cell.row === desk.row && cell.col === desk.col);
}

function manhattan(a, b) { return Math.abs(a.row - b.row) + Math.abs(a.col - b.col); }
function isNear(a, b) { return manhattan(a, b) <= 2; }

function getStudentDesk(studentId) {
  const deskId = Object.entries(state.assignments).find(([, sid]) => sid === studentId)?.[0];
  return deskId ? state.desks.find(desk => desk.id === deskId) || null : null;
}

function evaluatePreparation() {
  const feedback = [];
  const metrics = {
    layout: state.layout,
    layoutLabel: layouts[state.layout].label,
    placedStudents: Object.keys(state.assignments).length,
    teacherMode: state.teacher.mode,
    teacherDirection: state.teacher.dir,
    visibleRiskStudents: [],
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

  const visibleRiskStudents = students.filter(student => {
    const desk = getStudentDesk(student.id);
    return desk && student.hidden.risk >= 3 && isDeskInVision(desk);
  });
  const blindRiskStudents = students.filter(student => {
    const desk = getStudentDesk(student.id);
    return desk && student.hidden.risk >= 3 && !isDeskInVision(desk);
  });
  metrics.visibleRiskStudents = visibleRiskStudents.map(s => s.id);
  metrics.blindRiskStudents = blindRiskStudents.map(s => s.id);

  if (visibleRiskStudents.length >= 3) {
    score += 2;
    feedback.push({ type: 'good', text: 'Mehrere störanfällige Schüler*innen liegen im Sichtbereich der Lehrkraft.' });
  } else if (visibleRiskStudents.length >= 1) {
    score += 1;
    feedback.push({ type: 'good', text: 'Mindestens ein störanfälliger Schüler liegt im Sichtbereich der Lehrkraft.' });
  }

  if (blindRiskStudents.length >= 2) {
    score -= 2;
    metrics.futureScenarioHooks.push('blindspot-disruption');
    feedback.push({ type: 'bad', text: 'Mehrere störanfällige Schüler*innen sitzen außerhalb des Sichtbereichs. Das kann später Blind-Spot-Störungen auslösen.' });
  } else if (blindRiskStudents.length === 1) {
    score -= 1;
    metrics.futureScenarioHooks.push('minor-blindspot');
    feedback.push({ type: 'warning', text: 'Ein störanfälliger Schüler sitzt außerhalb des Sichtbereichs.' });
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
    if (backRows.includes(desk.row) && (student.hidden.phoneRisk || student.hidden.needsMonitoring || student.hidden.distractor)) result.backRowRisks.push(student.id);
  });

  if (result.backRowRisks.length >= 2) {
    result.delta -= 2;
    result.hooks.push('backrow-phone-or-offtask');
    result.feedback.push({ type: 'bad', text: 'Mehrere kontrollbedürftige Schüler*innen sitzen weit hinten. Das kann später Handy- oder Off-Task-Szenarien begünstigen.' });
  } else if (result.backRowRisks.length === 1) {
    result.delta -= 1;
    result.hooks.push('single-backrow-risk');
    result.feedback.push({ type: 'warning', text: 'Ein kontrollbedürftiger Schüler sitzt weit hinten.' });
  }
  return result;
}

function evaluateTeacherMode() {
  if (state.teacher.mode === 'moving') return { delta: 1, hooks: ['teacher-moving-presence'], feedback: { type: 'good', text: 'Bewegung im Raum erhöht Präsenz und kann verdeckte Störungen früh sichtbar machen.' } };
  if (state.teacher.mode === 'deskSitting') return { delta: -1, hooks: ['teacher-desk-blindspots'], feedback: { type: 'warning', text: 'Sitzend am Pult ist der Sicht- und Handlungsradius eingeschränkt.' } };
  return { delta: 0, hooks: ['teacher-front-led'], feedback: { type: 'good', text: 'Vorne stehend entsteht eine klare Leitungsposition. Entscheidend ist, ob risikorelevante Plätze im Sichtbereich liegen.' } };
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
  const exportData = {
    preparationScore: score,
    chosenLayout: { key: state.layout, label: layouts[state.layout].label },
    teacher: state.teacher,
    desks: state.desks,
    assignments: state.assignments,
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
    event.dataTransfer.setData('type', 'teacher');
    event.dataTransfer.effectAllowed = 'move';
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
