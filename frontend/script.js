/**
 * script.js — Shared utilities for Resume Skill Analyzer
 * Available on every page via <script src="script.js"></script>
 */

/**
 * Show an alert banner.
 * @param {HTMLElement} el  - the .alert div
 * @param {string}      msg - message text
 * @param {'error'|'success'} type
 */
function showAlert(el, msg, type = 'error') {
  el.textContent = msg;
  el.className   = 'alert show alert-' + type;
}

/**
 * Hide and clear an alert banner.
 * @param {HTMLElement} el
 */
function clearAlert(el) {
  el.textContent = '';
  el.className   = 'alert';
}

/**
 * Lightweight JWT expiry check.
 * Returns true if the stored token appears valid (not expired).
 */
function isTokenValid() {
  const token = localStorage.getItem('rsa_token');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}
