/* ==========================================================================
   SUMAYYA SIRAJ PORTFOLIO - CORE ENGINE & INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SOUND SYNTHESIS ENGINE (Web Audio API)
  let audioCtx = null;
  let isSoundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.05) {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio fallback
    }
  }

  window.playClickSound = () => playTone(880, 0.08, 'sine', 0.04);
  window.playTerminalSound = () => playTone(540, 0.06, 'triangle', 0.03);
  window.playSuccessChime = () => {
    if (!isSoundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, 'sine', 0.05), i * 90);
    });
  };

  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      soundToggleBtn.innerHTML = isSoundEnabled
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      showToast(isSoundEnabled ? 'Audio Effects: ON' : 'Audio Effects: OFF');
    });
  }

  // 2. HERO TYPEWRITER EFFECT
  const typewriterTarget = document.getElementById('typewriter-text');
  if (typewriterTarget) {
    const roles = [
      'Java Full Stack Developer',
      'Spring Framework & Hibernate Specialist',
      'React.js UI/UX Engineer',
      'OCR & WhatsApp Automation Architect',
      'Anna University CSE • CGPA 8.9'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function tickTypewriter() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typewriterTarget.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 40;
      } else {
        typewriterTarget.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 80;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typeSpeed = 1800; // Pause at end of text
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 400; // Pause before typing next
      }

      setTimeout(tickTypewriter, typeSpeed);
    }

    setTimeout(tickTypewriter, 500);
  }

  // 3. NAVIGATION SCROLL & ACTIVE LINK SPY
  const siteNav = document.getElementById('site-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      if (window.scrollY >= secTop) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile navigation drawer toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      siteNav.classList.toggle('mobile-expanded');
    });
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('mobile-expanded');
      });
    });
  }

  // 4. SKILLS FILTER TABS
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      window.playClickSound?.();
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. TOAST NOTIFICATION
  const toast = document.getElementById('toast-notice');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
  window.showToast = showToast;

  // 6. COPY EMAIL BUTTON
  const copyEmailBtns = document.querySelectorAll('.copy-email-trigger');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'sumayya2k4@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email copied: sumayya2k4@gmail.com');
        window.playClickSound?.();
      });
    });
  });

  // 7. PROJECT ARCHITECTURE DEEP-DIVE DATA & MODAL
  const projectDetails = {
    whatsapp: {
      title: 'Leads Management & WhatsApp Automation Software',
      stack: 'Core Java, Multi-threaded OOP, WhatsApp API, MySQL, JDBC',
      problem:
        'Managing sales leads across spreadsheets resulted in sluggish response times, scattered contact records, and missed follow-ups.',
      architecture: `
[Client / UI Layer]
       │ (Lead Ingestion & Filter Queries)
       ▼
[Lead Controller & Service Layer (Java OOP)]
       ├──────► [Validation & Duplicate Detection Module]
       ├──────► [MySQL DB Repository (Indexed by Phone & Priority)]
       └──────► [Thread-Pooled WhatsApp Message Dispatcher Engine]
                      │
                      ▼ (Automated Webhook & REST Payload)
               [WhatsApp Business Client]
      `,
      highlights: [
        'Modular Object-Oriented Architecture with clean separation of models, DAOs, and service controllers.',
        'Thread-pooled message queuing prevents rate-limiting issues and guarantees timely message delivery.',
        'Centralized lead tracking dashboard for status updates (New, Contacted, Converted, Archived).'
      ],
      codeSnippet: `// WhatsApp Automation Dispatcher Worker
public class LeadNotificationWorker implements Runnable {
    private final Lead lead;
    private final WhatsAppService whatsAppService;

    public LeadNotificationWorker(Lead lead, WhatsAppService whatsAppService) {
        this.lead = lead;
        this.whatsAppService = whatsAppService;
    }

    @Override
    public void run() {
        try {
            String message = MessageTemplate.formatWelcome(lead.getFullName());
            boolean dispatched = whatsAppService.sendTextMessage(lead.getPhone(), message);
            if (dispatched) {
                lead.setStatus(LeadStatus.CONTACTED);
                LeadDAO.updateStatus(lead.getId(), LeadStatus.CONTACTED);
            }
        } catch (Exception e) {
            Logger.logError("Failed to notify lead ID: " + lead.getId(), e);
        }
    }
}`
    },

    ocr: {
      title: 'OCR Bill Scanner with Zoho Books Automation',
      stack: 'Java, Optical Character Recognition (OCR), Zoho Books REST API, JSON, Jackson',
      problem:
        'Manual bookkeeping requires transcribing invoices, line items, GST numbers, and payment receipts by hand—a tedious process prone to human typo errors.',
      architecture: `
[Scanned Invoice / Bill PDF / Image]
       │
       ▼
[Image Preprocessing & Binarization]
       │
       ▼
[OCR Text Recognition Engine (Java)]
       │
       ▼
[Intelligent Regex & Semantic Entity Parser]
  (Extracts: Vendor Name, Tax ID, Invoice #, Line Items, GST, Total)
       │
       ▼
[Zoho Books REST API Connector]
  (OAuth2 Token Auth, Payload Serialization, Ledger Entry Creation)
       │
       ▼
[Zoho Books Cloud Accounting Ledger]
      `,
      highlights: [
        'Automated line item and total calculation parsing with regex boundary validations.',
        'Direct OAuth2 handshake and structured JSON payload transmission to Zoho Books APIs.',
        'Saved countless hours of manual data entry with verifiable audit logging.'
      ],
      codeSnippet: `// Java OCR Parsing and Zoho Books Sync Pipeline
public class InvoiceAutomationPipeline {
    public Invoice parseInvoice(File invoiceImage) throws OCRProcessingException {
        String rawText = OCREngine.extractText(invoiceImage);
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(RegexExtractor.findInvoiceNumber(rawText));
        invoice.setVendorName(RegexExtractor.findVendorName(rawText));
        invoice.setTotalAmount(RegexExtractor.findTotalAmount(rawText));
        invoice.setTaxRate(RegexExtractor.findTaxPercentage(rawText));
        return invoice;
    }

    public boolean syncToZohoBooks(Invoice invoice) {
        ZohoExpensePayload payload = ZohoPayloadMapper.fromInvoice(invoice);
        HttpResponse response = ZohoApiClient.postExpense(payload);
        return response.getStatusCode() == 201;
    }
}`
    },

    crm: {
      title: 'Company Management Enterprise CRM Application',
      stack: 'Java, OOP, Relational Database (MySQL), MVC Pattern, Authentication & RBAC',
      problem:
        'Modern businesses need a cohesive platform to organize customer histories, sales pipelines, account managers, and activity logs without departmental silos.',
      architecture: `
[Enterprise Staff / Admins]
       │
       ▼
[Presentation & Routing Layer (Java MVC)]
       │
       ├──────► [Authentication & Role-Based Access Control]
       │
[Business Logic & Service Layer]
       ├──────► [Customer Records & Account Hierarchy Service]
       ├──────► [Audit Trails & Transaction Log Engine]
       └──────► [Report Generation & Performance Metrics]
       │
       ▼
[Data Access Object (DAO) Pattern]
       │
       ▼
[MySQL Relational Database (Normalized 3NF)]
      `,
      highlights: [
        'Strict Object-Oriented Domain Driven Design with Encapsulation and Polymorphism.',
        'Role-Based Access Control ensuring secure segmentation between sales, management, and support teams.',
        'High-performance SQL query structuring with foreign key cascading and indexing.'
      ],
      codeSnippet: `// Company CRM Customer Management Controller
public class CustomerService {
    private final CustomerDAO customerDAO;
    private final AuditService auditService;

    public CustomerService(CustomerDAO customerDAO, AuditService auditService) {
        this.customerDAO = customerDAO;
        this.auditService = auditService;
    }

    public synchronized void registerNewAccount(Customer customer, User adminUser) throws ValidationException {
        customer.validateMandatoryFields();
        if (customerDAO.existsByTaxNumber(customer.getTaxId())) {
            throw new DuplicateEntityException("Tax entity already registered.");
        }
        customerDAO.save(customer);
        auditService.logAction(adminUser.getId(), "CREATED_CUSTOMER", customer.getId());
    }
}`
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalBody = document.getElementById('project-modal-body');
  const projectModalTitle = document.getElementById('project-modal-title');
  const inspectBtns = document.querySelectorAll('.project-inspect-btn');

  inspectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      const data = projectDetails[key];
      if (!data) return;

      window.playClickSound?.();
      projectModalTitle.textContent = data.title;
      projectModalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          <div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.2); padding:1rem 1.25rem; border-radius:12px;">
            <div style="font-size:0.75rem; text-transform:uppercase; color:var(--text-muted); font-family:var(--font-mono); margin-bottom:0.25rem;">Technology Stack</div>
            <div style="color:#ffffff; font-weight:600; font-size:0.95rem;">${data.stack}</div>
          </div>

          <div>
            <h4 style="color:#ffffff; font-size:1.1rem; margin-bottom:0.5rem;">The Challenge & Objective</h4>
            <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.6;">${data.problem}</p>
          </div>

          <div>
            <h4 style="color:#ffffff; font-size:1.1rem; margin-bottom:0.5rem;">Architectural System Flow</h4>
            <pre style="background:#090d16; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:1.25rem; font-family:var(--font-mono); font-size:0.82rem; color:#38bdf8; overflow-x:auto; line-height:1.4;">${data.architecture}</pre>
          </div>

          <div>
            <h4 style="color:#ffffff; font-size:1.1rem; margin-bottom:0.5rem;">Core Engineering Highlights</h4>
            <ul style="display:flex; flex-direction:column; gap:0.5rem; color:var(--text-secondary); font-size:0.92rem; list-style:none;">
              ${data.highlights.map((h) => `<li style="position:relative; padding-left:1.25rem;"><span style="position:absolute; left:0; color:var(--accent-cyan);">▹</span>${h}</li>`).join('')}
            </ul>
          </div>

          <div>
            <h4 style="color:#ffffff; font-size:1.1rem; margin-bottom:0.5rem;">Sample Source Implementation</h4>
            <pre style="background:#090d16; border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:1.25rem; font-family:var(--font-mono); font-size:0.8rem; color:#cbd5e1; overflow-x:auto; line-height:1.5;">${escapeHtml(data.codeSnippet)}</pre>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:1rem; margin-top:0.5rem;">
            <a href="https://github.com/sumayyasiraj" target="_blank" class="btn-primary" style="padding:0.6rem 1.4rem; font-size:0.88rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              View on GitHub
            </a>
          </div>
        </div>
      `;
      projectModal.classList.add('active');
    });
  });

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 8. RESUME PREVIEW MODAL
  const resumeModal = document.getElementById('resume-modal');
  const resumeTriggers = document.querySelectorAll('.open-resume-trigger');
  resumeTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.playClickSound?.();
      resumeModal.classList.add('active');
    });
  });

  // Modal close handlers
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  closeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.remove('active'));
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        backdrop.classList.remove('active');
      }
    });
  });

  // 9. EASTER EGG TRIBUTE MODAL
  const easterEggBtn = document.getElementById('easter-egg-btn');
  const easterEggModal = document.getElementById('easter-egg-modal');
  if (easterEggBtn && easterEggModal) {
    easterEggBtn.addEventListener('click', () => {
      window.playSuccessChime?.();
      triggerConfetti();
      easterEggModal.classList.add('active');
    });
  }

  // 10. CONTACT FORM SUBMIT HANDLER
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      window.playSuccessChime?.();
      showToast('Opening email client for dispatch...');

      const mailtoLink = `mailto:sumayya2k4@gmail.com?subject=${encodeURIComponent(
        `[Portfolio Inquiry] ${subject || 'Collaboration Inquiry'}`
      )}&body=${encodeURIComponent(
        `Hi Sumayya,\n\nMy name is ${name} (${email}).\n\n${message}\n\nBest regards,\n${name}`
      )}`;

      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 600);
    });
  }

  // 11. CONFETTI ANIMATION ENGINE (Lightweight canvas celebration)
  function triggerConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#34d399', '#fbbf24', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }

    let frames = 0;
    function renderConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      frames++;
      if (alive && frames < 140) {
        requestAnimationFrame(renderConfetti);
      } else {
        canvas.remove();
      }
    }
    renderConfetti();
  }
  window.triggerConfetti = triggerConfetti;
});
