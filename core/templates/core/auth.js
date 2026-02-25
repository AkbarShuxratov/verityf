/* ============================================
   VERITY — Auth Logic (Django Backend)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Tab Switching ---
  const tabs = document.querySelectorAll('.auth-tab');
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      if (tab.dataset.tab === 'signin') {
        signinForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
      } else {
        signinForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
      }
    });
  });

  // --- Sign In ---
  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;

    if (!email || !password) {
      Verity.toast('Please fill in all fields', 'error');
      return;
    }

    try {
      const res = await fetch('/api/signin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRF_TOKEN,
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.ok) {
        // Store user in localStorage for JS access
        localStorage.setItem('verity_user', JSON.stringify(data.user));
        Verity.toast('Welcome back!', 'success');
        setTimeout(() => window.location.href = '/dashboard/', 500);
      } else {
        Verity.toast(data.error || 'Sign in failed', 'error');
      }
    } catch (err) {
      Verity.toast('Connection error. Please try again.', 'error');
    }
  });

  // --- Sign Up ---
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (!name || !email || !password) {
      Verity.toast('Please fill in all fields', 'error');
      return;
    }

    try {
      const res = await fetch('/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': CSRF_TOKEN,
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (data.ok) {
        localStorage.setItem('verity_user', JSON.stringify(data.user));
        Verity.toast('Account created! Redirecting...', 'success');
        setTimeout(() => window.location.href = '/dashboard/', 600);
      } else {
        Verity.toast(data.error || 'Sign up failed', 'error');
      }
    } catch (err) {
      Verity.toast('Connection error. Please try again.', 'error');
    }
  });

  // --- Animated particles ---
  createParticles();
});

// --- Background particles ---
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div');
    const size = 2 + Math.random() * 4;
    dot.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      background:rgba(147,197,253,${0.15 + Math.random() * 0.2});
      border-radius:50%;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation: floatParticle ${8 + Math.random() * 12}s ease-in-out infinite;
      animation-delay: ${Math.random() * -10}s;
    `;
    container.appendChild(dot);
  }

  if (!document.getElementById('particleStyle')) {
    const style = document.createElement('style');
    style.id = 'particleStyle';
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
        25% { transform: translate(${30}px, -${40}px) scale(1.2); opacity: 0.7; }
        50% { transform: translate(-${20}px, -${60}px) scale(0.8); opacity: 0.5; }
        75% { transform: translate(${40}px, -${20}px) scale(1.1); opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
  }
}
