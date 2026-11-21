/* ==========================================================================
   INTERACTIVE RECRUITER & DEVELOPER TERMINAL
   Allows tech leads & hiring managers to query Sumayya's skills via CLI
   ========================================================================== */

(function () {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const chips = document.querySelectorAll('.terminal-cmd-btn');

  if (!terminalInput || !terminalBody) return;

  const history = [];
  let historyIndex = -1;

  const commands = {
    help: `
<span class="terminal-prompt-sym">Available Commands:</span>
  <span style="color:#38bdf8;">about</span>          - Developer profile & engineering philosophy
  <span style="color:#38bdf8;">skills</span>         - Complete breakdown of technical proficiencies
  <span style="color:#38bdf8;">projects</span>       - Production projects, architectures & impacts
  <span style="color:#38bdf8;">education</span>      - Degree, Anna University, CGPA & academic achievements
  <span style="color:#38bdf8;">certs</span>          - Verified industry certifications (Oracle OCI, IIT Madras, NPTEL)
  <span style="color:#38bdf8;">contact</span>        - Instant email, WhatsApp, GitHub & LinkedIn channels
  <span style="color:#34d399;">sudo hire</span>      - Initiate interview / offer sequence 🚀
  <span style="color:#94a3b8;">clear</span>          - Clear terminal console
    `,

    about: `
<span class="terminal-prompt-sym">[SYSTEM PROFILE]</span>
<b style="color:#fff;">Name:</b> Sumayya Siraj (Sumayya S)
<b style="color:#fff;">Role:</b> Java Full Stack Developer & Software Engineer
<b style="color:#fff;">Location:</b> Palakkad, Kerala & Coimbatore / Bangalore, India
<b style="color:#fff;">Status:</b> Final Year B.E. CSE (Graduating 2026) | <span style="color:#34d399;">Ready for Full-Time / Internship</span>
<b style="color:#fff;">Philosophy:</b> "Writing clean, maintainable, object-oriented Java backends paired with snappy, responsive React frontends. Passionate about automating repetitive manual workflows through OCR and API integrations."
    `,

    skills: `
<span class="terminal-prompt-sym">[TECHNICAL STACK MATRIX]</span>
<span style="color:#38bdf8; font-weight:700;">Backend & Core:</span>
  ▹ Java (Core & Advanced), Spring Framework, Spring Boot, Hibernate, Node.js, Express.js
<span style="color:#c084fc; font-weight:700;">Frontend:</span>
  ▹ React.js, Modern JavaScript (ES6+), HTML5, CSS3, Responsive Web UI
<span style="color:#34d399; font-weight:700;">Databases:</span>
  ▹ MySQL, PostgreSQL, MongoDB, SQL Optimization & Schema Design
<span style="color:#fbbf24; font-weight:700;">APIs & Tools:</span>
  ▹ REST APIs, Postman, Git, GitHub, Vercel, Render, Zoho Books API, OCR
<span style="color:#f43f5e; font-weight:700;">AI & Concepts:</span>
  ▹ OOP Principles, Test-driven debugging, Python, Oracle Cloud Infrastructure (OCI) AI
    `,

    projects: `
<span class="terminal-prompt-sym">[FLAGSHIP PROJECTS]</span>
1. <b style="color:#34d399;">Leads Management & WhatsApp Automation</b>
   ▹ Built with Core Java & modular OOP architecture.
   ▹ Centralized lead database with automated WhatsApp messaging dispatch.
   ▹ Eliminates manual follow-up overhead with 100% automated delivery.

2. <b style="color:#38bdf8;">OCR Smart Bill Scanner with Zoho Books Sync</b>
   ▹ Optical Character Recognition (OCR) pipeline in Java.
   ▹ Automatically extracts vendor, tax, and itemized totals from scanned invoices.
   ▹ Pushes directly into Zoho Books accounting ledger via REST API.

3. <b style="color:#c084fc;">Company Management Enterprise CRM</b>
   ▹ Comprehensive CRM solution for multi-department company operations.
   ▹ Robust relational data modeling in MySQL with role-based records handling.
    `,

    education: `
<span class="terminal-prompt-sym">[ACADEMIC CREDENTIALS]</span>
<b style="color:#fff;">Degree:</b> Bachelor of Engineering in Computer Science & Engineering
<b style="color:#fff;">Institution:</b> Easa College of Engineering and Technology, Coimbatore
<b style="color:#fff;">Affiliation:</b> Anna University, Chennai
<b style="color:#fff;">Timeline:</b> 2022 – 2026
<b style="color:#34d399; font-weight:700;">Cumulative GPA: 8.9 / 10.0 (Distinction Standing)</b>
    `,

    certs: `
<span class="terminal-prompt-sym">[VERIFIED CERTIFICATIONS]</span>
1. <b style="color:#fbbf24;">Oracle Cloud Infrastructure 2023 AI Certified Foundations Associate</b>
   ▹ Issued by: Oracle (Earned May 2024)
2. <b style="color:#38bdf8;">Python for Data Science</b>
   ▹ Issued by: NPTEL
3. <b style="color:#34d399;">Python Programming</b>
   ▹ Issued by: IIT Madras
4. <b style="color:#c084fc;">HTML, CSS & JavaScript: Building the Web</b>
   ▹ Issued by: LinkedIn Learning
    `,

    contact: `
<span class="terminal-prompt-sym">[DIRECT CHANNELS]</span>
  ✉️ Email:    <a href="mailto:sumayya2k4@gmail.com" style="color:#38bdf8;">sumayya2k4@gmail.com</a>
  📱 Phone:    <a href="tel:+919526051936" style="color:#38bdf8;">+91 9526051936</a>
  💬 WhatsApp: <a href="https://wa.me/919526051936" target="_blank" style="color:#34d399;">wa.me/919526051936</a>
  💼 LinkedIn: <a href="https://linkedin.com/in/sumayya-siraj" target="_blank" style="color:#38bdf8;">linkedin.com/in/sumayya-siraj</a>
  💻 GitHub:   <a href="https://github.com/sumayyasiraj" target="_blank" style="color:#c084fc;">github.com/sumayyasiraj</a>
    `,

    'sudo hire': `
<span style="color:#34d399; font-weight:700;">[STATUS 200 OK: CANDIDATE_ACCEPTED]</span>
🎉 Initializing fast-track onboarding sequence for Sumayya Siraj!
✅ Strong Java Core & Spring Architecture Verified.
✅ Clean React UI & Integration Skills Verified.
✅ High Academic Distinction (8.9 CGPA) Verified.
🚀 Next step: Click "Hire Sumayya" or WhatsApp directly at +91 9526051936 to schedule technical discussion!
    `
  };

  function printOutput(htmlContent) {
    const div = document.createElement('div');
    div.className = 'terminal-output';
    div.innerHTML = htmlContent;
    terminalBody.insertBefore(div, terminalInput.closest('.terminal-input-row'));
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function handleCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Echo command
    const echoDiv = document.createElement('div');
    echoDiv.className = 'terminal-line command-echo';
    echoDiv.innerHTML = `<span class="terminal-prompt-sym">sumayya@dev:~$</span> <span>${rawCmd}</span>`;
    terminalBody.insertBefore(echoDiv, terminalInput.closest('.terminal-input-row'));

    // Sound FX if available
    if (window.playTerminalSound) window.playTerminalSound();

    if (cmd === 'clear') {
      const echoes = terminalBody.querySelectorAll('.terminal-output, .command-echo');
      echoes.forEach((el) => el.remove());
      terminalBody.scrollTop = 0;
      return;
    }

    if (cmd === 'sudo hire' || cmd === 'hire') {
      printOutput(commands['sudo hire']);
      if (window.triggerConfetti) window.triggerConfetti();
      return;
    }

    if (commands[cmd]) {
      printOutput(commands[cmd]);
    } else {
      printOutput(`
        <span style="color:#ef4444;">zsh: command not found: ${rawCmd}</span>.
        Type <span style="color:#38bdf8;">help</span> to see available commands.
      `);
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      if (val.trim()) {
        history.push(val);
        historyIndex = history.length;
        handleCommand(val);
        terminalInput.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    }
  });

  // Support chip button clicks
  chips.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        terminalInput.value = cmd;
        handleCommand(cmd);
        terminalInput.value = '';
        terminalInput.focus();
      }
    });
  });

  // Initial welcome message
  printOutput(`
    <span style="color:#94a3b8;">Sumayya Siraj Interactive Engineering Console v2.4</span>
    Type <span style="color:#38bdf8; font-weight:600;">help</span> to explore available commands or click quick action chips below.
  `);
})();
