/* ============================================
   VERITY — Shared Utilities (Django Backend)
   ============================================ */

const Verity = {
  // --- Navigation with View Transitions ---
  navigate(url) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.href = url;
      });
    } else {
      window.location.href = url;
    }
  },

  // --- Toast Notifications ---
  toast(message, type = "info") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(40px)";
      toast.style.transition = "0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // --- Session / Auth ---
  // User data is injected by Django template into VERITY_USER global
  getUser() {
    if (typeof VERITY_USER !== 'undefined' && VERITY_USER) {
      return VERITY_USER;
    }
    const raw = localStorage.getItem("verity_user");
    return raw ? JSON.parse(raw) : null;
  },
  setUser(user) {
    localStorage.setItem("verity_user", JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem("verity_user");
    window.location.href = "/api/logout/";
  },
  requireAuth() {
    const user = Verity.getUser();
    if (!user) {
      window.location.href = "/";
      return false;
    }
    return true;
  },

  // --- Test Results ---
  getResults() {
    const raw = localStorage.getItem("verity_results");
    return raw ? JSON.parse(raw) : [];
  },
  saveResult(result) {
    const results = Verity.getResults();
    results.push({
      ...result,
      date: new Date().toISOString(),
      id: crypto.randomUUID(),
    });
    localStorage.setItem("verity_results", JSON.stringify(results));
  },

  // --- Timer persistence ---
  saveTimer(testId, remaining) {
    localStorage.setItem(
      `verity_timer_${testId}`,
      JSON.stringify({ remaining, savedAt: Date.now() }),
    );
  },
  getTimer(testId) {
    const raw = localStorage.getItem(`verity_timer_${testId}`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const elapsed = Math.floor((Date.now() - data.savedAt) / 1000);
    return Math.max(0, data.remaining - elapsed);
  },
  clearTimer(testId) {
    localStorage.removeItem(`verity_timer_${testId}`);
  },

  // --- Test State persistence ---
  saveTestState(testId, state) {
    localStorage.setItem(`verity_state_${testId}`, JSON.stringify(state));
  },
  getTestState(testId) {
    const raw = localStorage.getItem(`verity_state_${testId}`);
    return raw ? JSON.parse(raw) : null;
  },
  clearTestState(testId) {
    localStorage.removeItem(`verity_state_${testId}`);
  },

  // --- Custom Tests ---
  getCustomTests() {
    const raw = localStorage.getItem("verity_custom_tests");
    return raw ? JSON.parse(raw) : [];
  },
  addCustomTest(test) {
    const tests = Verity.getCustomTests();
    tests.push(test);
    localStorage.setItem("verity_custom_tests", JSON.stringify(tests));
  },

  // --- Render user navbar avatar ---
  renderUserNav(container) {
    const user = Verity.getUser();
    if (!user) return;
    container.innerHTML = `
      <div class="flex items-center gap-sm" style="position:relative">
        <span style="font-size:0.9rem;font-weight:500;color:var(--text-secondary)">${user.name || user.email}</span>
        <button onclick="Verity.logout()" class="btn btn-ghost btn-sm">Sign Out</button>
      </div>`;
  },

  // --- Format time ---
  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  },

  // --- Skeleton loader ---
  showSkeleton(container, count = 3) {
    container.innerHTML = Array(count)
      .fill(0)
      .map(
        () =>
          `<div class="skeleton skeleton-card" style="height:${80 + Math.random() * 60}px;margin-bottom:12px"></div>`,
      )
      .join("");
  },
};
