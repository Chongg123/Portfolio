/**
 * AURA & HOLOGRAPHIC CYBER-PORTFOLIO
 * Core Interactive Architecture & Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular components
  initSoundEngine();
  initCustomCursor();
  initHeroCanvas();
  initScrambleText();
  init3DTilt();
  initProjectsFilter();
  initCaseStudyModal();
  initCommandPalette();
  initThemeEngine();
  initContactTerminal();
  initSkillObserver();
  initNavigation();
});

/* ==========================================================================
   1. WEB AUDIO API SYNTHESIZER (Sci-Fi Sound Feedback)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initSoundEngine() {
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');

  // Load sound state from storage
  soundEnabled = localStorage.getItem('aura_sound_enabled') === 'true';
  updateSoundUI();

  function unlockAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function updateSoundUI() {
    if (!soundIcon) return;
    if (soundEnabled) {
      soundIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.08"></path></svg>`;
      soundToggleBtn?.classList.add('active');
    } else {
      soundIcon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      soundToggleBtn?.classList.remove('active');
    }
  }

  soundToggleBtn?.addEventListener('click', () => {
    unlockAudio();
    soundEnabled = !soundEnabled;
    localStorage.setItem('aura_sound_enabled', soundEnabled);
    updateSoundUI();
    if (soundEnabled) {
      playSound('blip');
      showToast('🔊 Audio Feedback Enabled');
    } else {
      showToast('🔇 Audio Feedback Muted');
    }
  });

  // Attach hover sounds to interactive elements
  document.querySelectorAll('a, button, .project-card, .direct-card, .mode-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (soundEnabled) playSound('hover');
    });
  });
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx && AudioContext) {
      audioCtx = new AudioContext();
    }
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.04);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'blip' || type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'modal') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.18);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'success') {
      // Harmonic chord
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + i * 0.06);
        g.gain.setValueAtTime(0.04, now + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(now + i * 0.06);
        o.stop(now + i * 0.06 + 0.25);
      });
    }
  } catch (e) {
    // Graceful fallback for audio restrictions
  }
}

/* ==========================================================================
   2. CUSTOM MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  if (!dot || !outline) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth lerp loop for outline
  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover states
  const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .direct-card, .mode-btn, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('cursor-hidden');
    outline.classList.add('cursor-hidden');
  });

  document.addEventListener('mouseenter', () => {
    dot.classList.remove('cursor-hidden');
    outline.classList.remove('cursor-hidden');
  });
}

/* ==========================================================================
   3. HERO 3D PARTICLE CONSTELLATION CANVAS
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 75;
  const CONNECTION_DIST = 140;

  let mouse = {
    x: null,
    y: null,
    radius: 160,
    targetX: 0,
    targetY: 0
  };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY <= rect.bottom && e.clientY >= rect.top) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * 400 - 200; // 3D depth
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.vz = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      if (this.z < -200 || this.z > 200) this.vz *= -1;

      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      // 3D Perspective calculation
      const fov = 300;
      const scale = fov / (fov + this.z);
      const projX = (this.x - width / 2) * scale + width / 2;
      const projY = (this.y - height / 2) * scale + height / 2;
      const projRadius = Math.max(0.5, this.radius * scale);

      const style = getComputedStyle(document.documentElement);
      const primaryRgb = style.getPropertyValue('--primary-rgb').trim() || '0, 240, 255';

      ctx.beginPath();
      ctx.arc(projX, projY, projRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${primaryRgb}, ${this.baseAlpha * scale})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const style = getComputedStyle(document.documentElement);
    const primaryRgb = style.getPropertyValue('--primary-rgb').trim() || '0, 240, 255';

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dz = particles[i].z - particles[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${primaryRgb}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   4. KINETIC SCRAMBLE TEXT DECODER
   ========================================================================== */
function initScrambleText() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_<>/-$#%';

  function scramble(element) {
    const originalText = element.getAttribute('data-original') || element.innerText;
    element.setAttribute('data-original', originalText);
    let iteration = 0;

    clearInterval(element.scrambleInterval);
    element.scrambleInterval = setInterval(() => {
      element.innerText = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(element.scrambleInterval);
      }
      iteration += 1 / 2.5;
    }, 28);
  }

  // Trigger on load
  document.querySelectorAll('.scramble-text').forEach(el => {
    scramble(el);
    el.addEventListener('mouseenter', () => scramble(el));
  });
}

/* ==========================================================================
   5. 3D PERSPECTIVE TILT PHYSICS
   ========================================================================== */
function init3DTilt() {
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables for spotlight effect
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D rotation math
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   6. PROJECT CATEGORY FILTER
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectContainers = document.querySelectorAll('.project-card-container');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playSound('click');

      const filter = btn.getAttribute('data-filter');

      projectContainers.forEach(container => {
        const category = container.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          container.style.display = 'block';
          container.style.opacity = '0';
          container.style.transform = 'scale(0.95)';
          setTimeout(() => {
            container.style.transition = 'all 0.4s ease';
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
          }, 40);
        } else {
          container.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. PROJECT CASE STUDY MODAL DRAWER
   ========================================================================== */
const projectData = {
  library: {
    title: 'UniLib — Smart Library Management System',
    subtitle: 'Book Cataloging, Circulation Telemetry & Member Records',
    image: './assets/project_library.jpg',
    metrics: [
      { val: '8,900+', lbl: 'Books Cataloged' },
      { val: '0.3s', lbl: 'Catalog Search Speed' },
      { val: '99.4%', lbl: 'Return Accuracy' }
    ],
    overview: 'UniLib is a comprehensive digital library management system designed to streamline book inventory, track student/faculty borrowing and returns, automate penalty calculations, and provide real-time circulation analytics.',
    challenge: 'Managing high-volume book transactions, multi-filter keyword catalog searches, and fast barcode scanning while maintaining real-time record synchronization across library terminals.',
    solution: 'Designed indexed relational database queries, virtualized book catalog card rendering, and automated return notification triggers to eliminate manual record-keeping errors.',
    stack: ['JavaScript', 'HTML5/CSS3', 'PHP / Node.js', 'MySQL Database', 'Barcode Scanner API', 'Chart.js']
  },
  electricity: {
    title: 'ApexGrid — Electricity Billing & Utility Management System',
    subtitle: 'Kilowatt-Hour Metering, Invoicing & Consumption Telemetry',
    image: './assets/project_electricity.jpg',
    metrics: [
      { val: '500+ kWh', lbl: 'Telemetry Monitored' },
      { val: '100%', lbl: 'Invoice Accuracy' },
      { val: 'Sub-Sec', lbl: 'Tariff Calculation' }
    ],
    overview: 'A smart electricity billing and utility management portal for tracking energy consumption, automated tiered rate calculation, automated invoice generation, and customer account self-service.',
    challenge: 'Calculating dynamic tiered electricity tariffs and rendering live consumption charts across numerous consumer accounts without latency or calculation discrepancies.',
    solution: 'Engineered an automated tariff computation engine with PDF invoice generation, payment status trackers, and interactive consumption graphs for monitoring energy efficiency.',
    stack: ['JavaScript', 'HTML5/CSS3', 'Node.js', 'PostgreSQL / MySQL', 'Chart.js', 'REST APIs', 'PDF Engine']
  },
  sklink: {
    title: 'SKLink — Youth Governance & Community Linkage Portal',
    subtitle: 'Youth Profiling, Program Tracking & Digital Request Forms',
    image: './assets/project_sklink.jpg',
    metrics: [
      { val: '1,200+', lbl: 'Youth Citizens Profiled' },
      { val: '95%', lbl: 'Faster Request Turnaround' },
      { val: '100%', lbl: 'Budget & Project Transparency' }
    ],
    overview: 'SKLink is a community portal developed for youth governance (Sangguniang Kabataan) to centralize community announcements, manage project funding proposals, track event registrations, and maintain transparent youth records.',
    challenge: 'Creating an intuitive, mobile-friendly interface for youth constituents to submit proposals, book equipment, and access community resources without bureaucratic delays.',
    solution: 'Built a responsive mobile-first dashboard with digital request form workflows, automated status tracking pipelines, and real-time announcement feeds.',
    stack: ['HTML5 / CSS3', 'JavaScript', 'Firebase / MySQL', 'UI/UX Design', 'REST APIs', 'Mobile Responsive']
  }
};

function initCaseStudyModal() {
  const modalBackdrop = document.getElementById('case-study-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const viewBtns = document.querySelectorAll('.view-case-study-btn');

  function openModal(projectId) {
    const data = projectData[projectId];
    if (!data || !modalBackdrop) return;

    document.getElementById('modal-img').src = data.image;
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-subtitle').innerText = data.subtitle;
    document.getElementById('modal-overview').innerText = data.overview;
    document.getElementById('modal-challenge').innerText = data.challenge;
    document.getElementById('modal-solution').innerText = data.solution;

    // Populate Metrics
    const metricsContainer = document.getElementById('modal-metrics');
    metricsContainer.innerHTML = data.metrics.map(m => `
      <div class="modal-metric-card">
        <div class="modal-metric-val">${m.val}</div>
        <div class="modal-metric-lbl">${m.lbl}</div>
      </div>
    `).join('');

    // Populate Tech stack
    const stackContainer = document.getElementById('modal-tech-stack');
    stackContainer.innerHTML = data.stack.map(tag => `
      <span class="tech-tag">${tag}</span>
    `).join('');

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSound('modal');
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    playSound('click');
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  modalCloseBtn?.addEventListener('click', closeModal);

  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. COMMAND PALETTE (CTRL+K / CMD+K)
   ========================================================================== */
function initCommandPalette() {
  const paletteBackdrop = document.getElementById('palette-modal');
  const paletteInput = document.getElementById('palette-search-input');
  const triggerBtns = document.querySelectorAll('.cmd-k-trigger');
  const paletteItems = document.querySelectorAll('.palette-item');

  function openPalette() {
    paletteBackdrop?.classList.add('active');
    paletteInput?.focus();
    playSound('modal');
    if (paletteInput) paletteInput.value = '';
    filterPalette('');
  }

  function closePalette() {
    paletteBackdrop?.classList.remove('active');
  }

  triggerBtns.forEach(btn => btn.addEventListener('click', openPalette));

  paletteBackdrop?.addEventListener('click', (e) => {
    if (e.target === paletteBackdrop) closePalette();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteBackdrop?.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    }
    if (e.key === 'Escape' && paletteBackdrop?.classList.contains('active')) {
      closePalette();
    }
  });

  // Filter commands
  function filterPalette(query) {
    const q = query.toLowerCase().trim();
    paletteItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  paletteInput?.addEventListener('input', (e) => {
    filterPalette(e.target.value);
  });

  // Handle item actions
  paletteItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closePalette();
      executeAction(action);
    });
  });

  function executeAction(action) {
    playSound('click');
    if (action.startsWith('goto-')) {
      const targetId = action.replace('goto-', '');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action.startsWith('theme-')) {
      const theme = action.replace('theme-', '');
      setTheme(theme);
      showToast(`🎨 Theme changed to ${theme.toUpperCase()}`);
    } else if (action === 'toggle-sound') {
      document.getElementById('sound-toggle-btn')?.click();
    } else if (action === 'download-cv') {
      showToast('📄 Downloading Resume / CV...');
      setTimeout(() => {
        alert('Resume download triggered. [Kurt Christian Espero - BSIT Resume]');
      }, 300);
    }
  }
}

/* ==========================================================================
   9. THEME ENGINE
   ========================================================================== */
function initThemeEngine() {
  const themeHudBtn = document.getElementById('theme-toggle-btn');
  const themes = ['cyber', 'matrix', 'sunset', 'indigo'];
  
  // Load saved theme
  const savedTheme = localStorage.getItem('aura_theme') || 'cyber';
  setTheme(savedTheme);

  themeHudBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'cyber';
    const nextIdx = (themes.indexOf(current) + 1) % themes.length;
    const nextTheme = themes[nextIdx];
    setTheme(nextTheme);
    playSound('click');
    showToast(`🎨 Active Theme: ${nextTheme.toUpperCase()}`);
  });
}

function setTheme(theme) {
  if (theme === 'cyber') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
  localStorage.setItem('aura_theme', theme);
}

/* ==========================================================================
   10. CONTACT TERMINAL & FORM HANDLER
   ========================================================================== */
function initContactTerminal() {
  const formModeBtn = document.getElementById('form-mode-btn');
  const cliModeBtn = document.getElementById('cli-mode-btn');
  const standardForm = document.getElementById('standard-contact-form');
  const cliTerminal = document.getElementById('cli-contact-terminal');
  const cliInput = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-output');

  formModeBtn?.addEventListener('click', () => {
    formModeBtn.classList.add('active');
    cliModeBtn?.classList.remove('active');
    standardForm.style.display = 'flex';
    cliTerminal?.classList.remove('active');
    playSound('click');
  });

  cliModeBtn?.addEventListener('click', () => {
    cliModeBtn.classList.add('active');
    formModeBtn?.classList.remove('active');
    standardForm.style.display = 'none';
    cliTerminal?.classList.add('active');
    cliInput?.focus();
    playSound('click');
  });

  // Standard Form Submit
  standardForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = standardForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `<span>Transmitting Signal...</span>`;
    submitBtn.disabled = true;

    setTimeout(() => {
      playSound('success');
      showToast('🚀 Transmission Received! I will contact you shortly.');
      createConfetti();
      submitBtn.innerHTML = `<span>✓ Message Sent!</span>`;
      standardForm.reset();

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3500);
    }, 1200);
  });

  // Copy Email Direct Card
  const copyEmailCard = document.getElementById('copy-email-card');
  copyEmailCard?.addEventListener('click', () => {
    navigator.clipboard.writeText('kurtchristianespero@gmail.com').then(() => {
      playSound('blip');
      showToast('📋 Email copied to clipboard: kurtchristianespero@gmail.com');
    });
  });

  // CLI Command Handling
  cliInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = cliInput.value.trim();
      cliInput.value = '';
      executeCliCommand(command);
    }
  });

  function executeCliCommand(cmd) {
    if (!cliOutput) return;
    const cleanCmd = cmd.toLowerCase();
    let response = '';

    playSound('hover');

    if (cleanCmd === 'help') {
      response = `Available commands:
  • help          : Display this command list
  • about         : Read my story, background & passion
  • skills        : List my core technical stack
  • projects      : View my flagship project highlights
  • hire          : Send a direct collaboration signal
  • clear         : Clear terminal console`;
    } else if (cleanCmd === 'about') {
      response = `Hi, I'm Kurt Christian Espero, a BSIT student who embraces the art of vibe coding.
For me, development isn't just about syntax—it's about focusing on the overall direction of a project and using natural language prompts to guide AI in generating the code.
I build across multiple platforms, from developing mobile applications to database-driven web dashboards.
Whether I'm setting up networks, designing intuitive UI layouts, or refining AI-generated solutions, I focus on building clean, functional tech without the stress.`;
    } else if (cleanCmd === 'skills') {
      response = `Vibe Coding | AI Prompt Architecture | Mobile Apps | Database Dashboards | Networking | UI/UX`;
    } else if (cleanCmd === 'projects') {
      response = `1. Library Management System (UniLib)
2. Electricity Billing & Utility System (ApexGrid)
3. SKLink (Youth Governance & Community Linkage Portal)`;
    } else if (cleanCmd === 'hire' || cleanCmd.startsWith('send ')) {
      response = `[UPLINK ESTABLISHED] Direct transmission channel opened. Forwarding query to kurtchristianespero@gmail.com... Status: SUCCESS!`;
      playSound('success');
      createConfetti();
    } else if (cleanCmd === 'clear') {
      cliOutput.innerHTML = '';
      return;
    } else {
      response = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
    }

    cliOutput.innerHTML += `\n<span style="color: var(--primary);">guest@alex-vance:~$</span> ${cmd}\n${response}\n`;
    cliOutput.scrollTop = cliOutput.scrollHeight;
  }
}

/* ==========================================================================
   11. CELEBRATION CONFETTI BURST
   ========================================================================== */
function createConfetti() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '3000';
  document.body.appendChild(container);

  const colors = ['#00f0ff', '#8b5cf6', '#ec4899', '#10b981', '#ffffff'];

  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = `${Math.random() * 8 + 4}px`;
    confetti.style.height = `${Math.random() * 12 + 6}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = '50%';
    confetti.style.top = '50%';
    confetti.style.borderRadius = '2px';
    confetti.style.opacity = '1';
    confetti.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 350 + 150;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity;

    container.appendChild(confetti);

    confetti.animate([
      { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random() * 400,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards'
    });
  }

  setTimeout(() => {
    container.remove();
  }, 2000);
}

/* ==========================================================================
   12. SKILL OBSERVER & PROGRESS ANIMATION
   ========================================================================== */
function initSkillObserver() {
  const skillBars = document.querySelectorAll('.skill-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = width;
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   13. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ==========================================================================
   14. NAVIGATION & SCROLL HIGHLIGHT
   ========================================================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    // Navbar glass effect
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // ScrollSpy active link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
    playSound('click');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
    });
  });

  // Back to top HUD button
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound('click');
  });
}
