(() => {
  const STORAGE_KEY = 'classroomGame.fullscreenPromptDismissed';
  const isProbablyIPad = () => {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const touchMac = platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    const tabletWidth = window.innerWidth >= 760 && window.innerWidth <= 1366 && navigator.maxTouchPoints > 1;
    return /iPad/.test(ua) || touchMac || tabletWidth;
  };

  const isFullscreen = () => Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );

  const requestFullscreen = async () => {
    const el = document.documentElement;
    if (el.requestFullscreen) return el.requestFullscreen();
    if (el.webkitRequestFullscreen) return el.webkitRequestFullscreen();
    if (el.msRequestFullscreen) return el.msRequestFullscreen();
    return Promise.reject(new Error('Fullscreen API unavailable'));
  };

  const exitFullscreen = async () => {
    if (document.exitFullscreen) return document.exitFullscreen();
    if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
    if (document.msExitFullscreen) return document.msExitFullscreen();
    return Promise.resolve();
  };

  function pageLabel() {
    if (document.body.classList.contains('step1-page')) return 'Klassenraum vorbereiten';
    if (document.body.classList.contains('rules-page')) return 'Klassenregeln aufstellen';
    if (document.body.classList.contains('scenarios-page')) return 'Unterrichtsstunde steuern';
    return 'Klassenverwaltungsspiel';
  }

  function applyGameMode(active) {
    document.documentElement.classList.toggle('ipad-game-mode', active);
    document.body.classList.toggle('ipad-game-mode', active);
    const exitBtn = document.getElementById('fullscreenExitBtn');
    if (exitBtn) exitBtn.hidden = !active;
    window.dispatchEvent(new Event('resize'));
  }

  function closePrompt() {
    const prompt = document.getElementById('fullscreenPrompt');
    if (prompt) prompt.remove();
  }

  function createExitButton() {
    if (document.getElementById('fullscreenExitBtn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'fullscreenExitBtn';
    btn.className = 'fullscreen-exit-btn';
    btn.textContent = 'Vollbildmodus verlassen';
    btn.hidden = true;
    btn.addEventListener('click', async () => {
      try {
        if (isFullscreen()) await exitFullscreen();
      } catch (error) {}
      applyGameMode(false);
    });
    document.body.appendChild(btn);
  }

  function createPrompt() {
    if (document.getElementById('fullscreenPrompt')) return;
    const overlay = document.createElement('section');
    overlay.id = 'fullscreenPrompt';
    overlay.className = 'fullscreen-prompt-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'fullscreenPromptTitle');
    overlay.innerHTML = `
      <article class="fullscreen-prompt-card">
        <p class="eyebrow">iPad-Spielmodus</p>
        <h2 id="fullscreenPromptTitle">${pageLabel()} im Vollbild öffnen?</h2>
        <p>Im Vollbildmodus wird das Layout als feste Spielfläche dargestellt: Klassenraum, Profile und Aktionen bleiben direkt sichtbar.</p>
        <div class="fullscreen-prompt-actions">
          <button type="button" id="fullscreenStartBtn" class="primary-btn">Vollbildmodus starten</button>
          <button type="button" id="fullscreenSkipBtn" class="ghost-btn">Ohne Vollbild fortfahren</button>
        </div>
      </article>`;
    document.body.appendChild(overlay);

    const startBtn = overlay.querySelector('#fullscreenStartBtn');
    const skipBtn = overlay.querySelector('#fullscreenSkipBtn');
    startBtn?.addEventListener('click', async () => {
      try {
        await requestFullscreen();
      } catch (error) {
        // Safari/iPad kann je nach Umgebung echte Fullscreen-API verweigern.
        // Dann wird zumindest der interne Spielmodus aktiviert.
      }
      closePrompt();
      applyGameMode(true);
    });
    skipBtn?.addEventListener('click', () => {
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (error) {}
      closePrompt();
      applyGameMode(false);
    });
  }

  function shouldPrompt() {
    if (!isProbablyIPad()) return false;
    if (document.body.classList.contains('landing-page')) return true;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return false;
    } catch (error) {}
    return true;
  }

  document.addEventListener('fullscreenchange', () => applyGameMode(isFullscreen() || document.body.classList.contains('ipad-game-mode')));
  document.addEventListener('webkitfullscreenchange', () => applyGameMode(isFullscreen() || document.body.classList.contains('ipad-game-mode')));

  document.addEventListener('DOMContentLoaded', () => {
    createExitButton();
    if (shouldPrompt()) window.setTimeout(createPrompt, 250);
  });
})();
