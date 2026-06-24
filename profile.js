(() => {
  const PREFIX = 'classroomGame.';
  const KEEP_ON_RESET = new Set([
    'classroomGame.playerName',
    'classroomGame.deviceId',
    'classroomGame.highscoreEntries',
    'classroomGame.tutorial.step1.seen',
    'classroomGame.rulesTutorialSeen',
    'classroomGame.phase3TutorialSeen'
  ]);
  function uuid() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
  function getDeviceId() {
    let id = localStorage.getItem(`${PREFIX}deviceId`);
    if (!id) { id = uuid(); localStorage.setItem(`${PREFIX}deviceId`, id); }
    return id;
  }
  function getPlayerName() {
    return (localStorage.getItem(`${PREFIX}playerName`) || '').trim();
  }
  function ensurePlayerName() {
    getDeviceId();
    let name = getPlayerName();
    while (!name) {
      const input = window.prompt('Bitte gib einen Benutzernamen für die Highscore-Liste ein:');
      if (input === null) name = 'Spieler*in';
      else name = input.trim();
      if (!name) window.alert('Bitte gib einen Namen ein.');
    }
    localStorage.setItem(`${PREFIX}playerName`, name);
    return name;
  }
  function readEntries() {
    try { return JSON.parse(localStorage.getItem(`${PREFIX}highscoreEntries`) || '[]'); } catch { return []; }
  }
  function saveFinalHighscore(score, result = '') {
    const finalScore = Number(score) || 0;
    const entry = {
      id: uuid(),
      deviceId: getDeviceId(),
      playerName: ensurePlayerName(),
      score: finalScore,
      result,
      at: new Date().toISOString()
    };
    const entries = readEntries();
    entries.push(entry);
    entries.sort((a,b) => (Number(b.score)||0) - (Number(a.score)||0));
    localStorage.setItem(`${PREFIX}highscoreEntries`, JSON.stringify(entries.slice(0, 100)));
    return entry;
  }
  function markAllTutorialsSeen() {
    localStorage.setItem(`${PREFIX}tutorial.step1.seen`, '1');
    localStorage.setItem(`${PREFIX}rulesTutorialSeen`, '1');
    localStorage.setItem(`${PREFIX}phase3TutorialSeen`, '1');
    sessionStorage.setItem(`${PREFIX}rulesTutorialSeen`, '1');
    sessionStorage.setItem(`${PREFIX}phase3TutorialSeen`, '1');
  }
  function clearProgress() {
    const keys=[];
    for (let i=0;i<localStorage.length;i+=1) {
      const k=localStorage.key(i);
      if (k && k.startsWith(PREFIX) && !KEEP_ON_RESET.has(k)) keys.push(k);
    }
    keys.forEach(k => localStorage.removeItem(k));
    try { sessionStorage.clear(); } catch {}
    markAllTutorialsSeen();
  }
  function confirmFullReset() {
    return window.confirm('Damit wird das gesamte laufende Spiel zurückgesetzt. Du beginnst wieder bei Schritt 1. Fortfahren?');
  }
  function resetToFirstStep(confirm = true) {
    if (confirm && !confirmFullReset()) return false;
    clearProgress();
    window.location.href = 'step1.html?skipIntro=1';
    return true;
  }
  function shouldSkipStep1Intro() {
    const params = new URLSearchParams(window.location.search);
    return params.get('skipIntro') === '1' || localStorage.getItem(`${PREFIX}tutorial.step1.seen`) === '1';
  }
  window.ClassroomGameSession = { getDeviceId, getPlayerName, ensurePlayerName, saveFinalHighscore, readEntries, markAllTutorialsSeen, clearProgress, resetToFirstStep, shouldSkipStep1Intro };
})();
