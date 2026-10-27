/**
 * Theme toggle manager for CampusBites, AI Office, and AI Team Studio.
 * Synchronizes light/dark theme across all pages, tabs, and embedded iframes.
 */
export function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') ||
      localStorage.getItem('campusbites-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function updateButton(theme) {
    if (!toggleBtn) return;
    const isDark = theme === 'dark';
    const icon = toggleBtn.querySelector('.theme-icon');
    const label = toggleBtn.querySelector('.theme-label');
    if (icon) icon.textContent = isDark ? '☀️' : '🌙';
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
    toggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('campusbites-theme', theme);
    } catch (e) {}
    updateButton(theme);

    // Notify any embedded iframe preview (like site-preview or app-frame)
    const iframes = document.querySelectorAll('iframe');
    for (const frame of iframes) {
      try {
        frame.contentWindow?.postMessage({ type: 'campusbites-theme-change', theme }, '*');
      } catch (e) {}
    }
  }

  const initial = getTheme();
  applyTheme(initial);

  toggleBtn?.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  // Sync when changed in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === 'campusbites-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
      applyTheme(e.newValue);
    }
  });

  // Listen for postMessage from parent or iframe
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'campusbites-theme-change' && (e.data.theme === 'light' || e.data.theme === 'dark')) {
      applyTheme(e.data.theme);
    }
  });
}
