/**
 * Theme toggle manager for CampusBites, AI Office, and AI Team Studio.
 * Synchronizes light/dark theme across all pages, tabs, and embedded iframes.
 */
export function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') ||
      document.body?.getAttribute('data-theme') ||
      localStorage.getItem('campusbites-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function updateButton(theme) {
    if (!toggleBtn) return;
    const isDark = theme === 'dark';
    const label = toggleBtn.querySelector('.theme-label');
    if (label) label.textContent = isDark ? 'Dark' : 'Light';
    toggleBtn.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    toggleBtn.setAttribute('aria-checked', isDark ? 'true' : 'false');
  }

  function broadcastToFrames(theme) {
    const iframes = document.querySelectorAll('iframe');
    for (const frame of iframes) {
      try {
        frame.contentWindow?.postMessage({ type: 'campusbites-theme-change', theme }, '*');
      } catch (e) {}
    }
  }

  function applyTheme(theme) {
    const valid = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', valid);
    document.documentElement.classList.toggle('dark', valid === 'dark');
    if (document.body) {
      document.body.setAttribute('data-theme', valid);
      document.body.classList.toggle('dark', valid === 'dark');
    }
    try {
      localStorage.setItem('campusbites-theme', valid);
    } catch (e) {}
    updateButton(valid);
    broadcastToFrames(valid);
  }

  const initial = getTheme();
  applyTheme(initial);

  toggleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });

  // Keep iframes synchronized as soon as they finish loading
  const iframes = document.querySelectorAll('iframe');
  for (const frame of iframes) {
    frame.addEventListener('load', () => {
      try {
        frame.contentWindow?.postMessage({ type: 'campusbites-theme-change', theme: getTheme() }, '*');
      } catch (e) {}
    });
  }

  // Cross-tab synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === 'campusbites-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
      applyTheme(e.newValue);
    }
  });

  // Cross-frame messaging
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'campusbites-theme-change' && (e.data.theme === 'light' || e.data.theme === 'dark')) {
      applyTheme(e.data.theme);
    } else if (e.data?.type === 'campusbites-request-theme') {
      try {
        e.source?.postMessage({ type: 'campusbites-theme-change', theme: getTheme() }, '*');
      } catch (err) {}
    }
  });

  // If inside an iframe, request the current theme from parent
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage({ type: 'campusbites-request-theme' }, '*');
    } catch (e) {}
  }
}
