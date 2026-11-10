(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header state, scroll progress, back-to-top ---------- */
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');
  var ticking = false;

  var onScroll = function () {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) {
      header.classList.toggle('is-scrolled', y > 8);
      header.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1) : 0);
    }
    if (toTop) {
      toTop.classList.toggle('is-visible', y > 700);
    }
    ticking = false;
  };

  onScroll();
  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      navLinks.forEach(function (link) {
        var isActive = link.getAttribute('href') === '#' + id;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  // Stagger siblings that share a parent (cards in a grid, timeline items).
  revealEls.forEach(function (el) {
    var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
      return c.classList.contains('reveal');
    });
    var index = siblings.indexOf(el);
    if (index > 0) el.style.setProperty('--delay', Math.min(index * 0.08, 0.4) + 's');
  });

  var finishReveal = function (el) {
    // Once revealed, drop the reveal class so each card's own hover transitions take over.
    var done = function () {
      el.classList.remove('reveal', 'is-visible');
      el.style.removeProperty('--delay');
    };
    el.addEventListener('transitionend', function handler(e) {
      if (e.target === el && e.propertyName === 'opacity') {
        el.removeEventListener('transitionend', handler);
        done();
      }
    });
    setTimeout(done, 1600);
  };

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          finishReveal(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.documentElement.classList.remove('js');
  }

  /* ---------- Laptop typing animation ---------- */
  var code = document.querySelector('.laptop .code');
  var toast = document.querySelector('.screen-toast');
  if (code) {
    var tokens = [];
    Array.prototype.forEach.call(code.querySelectorAll('.ln'), function (ln, lineIndex) {
      Array.prototype.forEach.call(ln.children, function (span) {
        tokens.push({ el: span, text: span.textContent, line: lineIndex });
      });
    });

    if (reduceMotion) {
      if (toast) toast.classList.add('is-shown');
    } else {
      var caret = document.createElement('span');
      caret.className = 'caret';
      var inView = true;
      var timer;

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          inView = entries[0].isIntersecting;
        }).observe(code);
      }

      var wait = function (fn, ms) {
        timer = setTimeout(function tick() {
          // Pause while off-screen or in a background tab.
          if (!inView || document.hidden) {
            timer = setTimeout(tick, 400);
            return;
          }
          fn();
        }, ms);
      };

      var run = function () {
        tokens.forEach(function (t) { t.el.textContent = ''; });
        if (toast) toast.classList.remove('is-shown');
        var ti = 0;
        var ci = 0;

        var typeNext = function () {
          if (ti >= tokens.length) {
            wait(function () { if (toast) toast.classList.add('is-shown'); }, 350);
            wait(run, 4200);
            return;
          }
          var t = tokens[ti];
          if (ci === 0) t.el.parentNode.appendChild(caret);
          ci += 1;
          t.el.textContent = t.text.slice(0, ci);
          var delay = 38 + Math.random() * 50;
          if (ci >= t.text.length) {
            var next = tokens[ti + 1];
            ti += 1;
            ci = 0;
            if (next && next.line !== t.line) delay = 320;
          }
          wait(typeNext, delay);
        };

        wait(typeNext, 600);
      };

      run();
    }
  }

  /* ---------- Count-up stats ---------- */
  if (!reduceMotion) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var duration = 1400;
      var start = null;
      var step = function (ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (t < 1) window.requestAnimationFrame(step);
      };
      el.textContent = (0).toFixed(decimals);
      setTimeout(function () { window.requestAnimationFrame(step); }, 500);
    });
  }
})();

(function () {
  // English text always comes from the HTML itself (captured below at load time).
  // Only French needs to be maintained here — editing index.html directly always
  // controls what English visitors see, even after this file was last touched.
  var frTranslations = {
    'meta.title': 'Melanie Malek | Ingénieure logicielle',
    'skip.link': 'Passer au contenu principal',
    'nav.about': 'À propos',
    'nav.experience': 'Expérience',
    'nav.projects': 'Projets',
    'nav.skills': 'Compétences',
    'nav.contact': 'Contact',
    'nav.hire': 'Discutons',
    'hero.toast': '✓ Tous les tests réussis',
    'hero.hello': 'bonjour, je suis',
    'hero.eyebrow': 'Ingénieure logicielle',
    'hero.subtitle': 'Transformer des problèmes complexes en expériences simples.',
    'hero.bio': 'Je suis étudiante en 4e année en génie logiciel à l’Université d’Ottawa et je me passionne pour la création de logiciels à la fois efficaces, intuitifs et agréables à utiliser. Je m’intéresse particulièrement à la croisée de l’ingénierie et du design, où la technologie, l’automatisation et une conception réfléchie permettent de créer des expériences simples et intuitives.',
    'hero.resumeBtn': 'Téléchargez mon CV',
    'hero.projectsBtn': 'Voir les projets',
    'hero.statCoop': 'Stages coop',
    'hero.statStacks': 'Piles technologiques',
    'hero.statGpa': 'Moyenne',
    'hero.eduDegree': 'B.Sc.A. en génie logiciel',
    'hero.eduSchool': 'Université d’Ottawa',
    'bring.kicker': 'pourquoi travailler avec moi',
    'bring.heading': 'Ce que j’apporte',
    'bring.se.title': 'Génie logiciel',
    'bring.se.desc': 'Conception de systèmes maintenables, rédaction de code robuste et résolution de problèmes concrets en environnement collaboratif.',
    'bring.ai.title': 'Agents IA',
    'bring.ai.desc': 'Conception et mise en œuvre de solutions alimentées par l’IA pour automatiser des tâches et améliorer la prise de décision.',
    'bring.qa.title': 'Automatisation et assurance qualité',
    'bring.qa.desc': 'Création de cadres de test automatisés, validation de la qualité des produits et amélioration de la fiabilité au fil des cycles de développement.',
    'bring.ux.title': 'Réflexion UI/UX',
    'bring.ux.desc': 'Création d’interfaces claires et intuitives qui privilégient la clarté, l’accessibilité et une expérience utilisateur soignée.',
    'experience.kicker': 'là où j’ai travaillé',
    'experience.heading': 'Expérience',
    'experience.intro': 'Postes récents en génie logiciel, en automatisation, en conception de flux de travail assistée par l’IA et en soutien aux systèmes.',
    'experience.resumeNote': 'Vous voulez tous les détails? Mon CV raconte toute l’histoire.',
    'experience.resumeBtn': 'Voir le CV',
    'exp1.title': 'Étudiante en génie de projets – Guerre électronique (stage coop)',
    'exp1.desc': 'Conception d’un agent d’approvisionnement alimenté par l’IA avec Copilot, automatisant les flux de travail et améliorant l’efficacité des ressources.',
    'exp1.period': 'Mai 2026 – Août 2026',
    'exp2.title': 'Développeuse de logiciels d’outils et d’automatisation (stage coop)',
    'exp2.desc': 'Développement et déploiement d’applications Web, de tableaux de bord et d’outils internes pour optimiser les opérations et soutenir les équipes transversales.',
    'exp2.period': 'Sept. 2025 – Déc. 2025',
    'exp3.title': 'Testeuse en automatisation de l’assurance qualité (stage coop)',
    'exp3.desc': 'Création et maintenance de scripts d’automatisation Selenium Java, exécution de tests manuels et suivi des anomalies dans des cycles Agile.',
    'exp3.period': 'Janv. 2025 – Avr. 2025',
    'exp4.title': 'Étudiante en génie logiciel (stage coop)',
    'exp4.desc': 'Maintenance de systèmes basés sur SAP, planification de traitements par lots et développement de rapports ABAP pour améliorer la fiabilité et soutenir les opérations.',
    'exp4.period': 'Mai 2024 – Déc. 2024',
    'projects.kicker': 'ce que j’ai créé',
    'projects.heading': 'Projets',
    'projects.intro': 'Un aperçu détaillé d’un projet que j’ai conçu et réalisé de bout en bout.',
    'proj.ai.title': 'Agent d’approvisionnement IA',
    'proj.ai.desc': 'Conception et développement d’un agent d’approvisionnement IA pour des systèmes de guerre électronique sous-marins, qui transforme une liste de plus de 100 pièces en une liste restreinte de fournisseurs classés. L’agent recherche des fournisseurs candidats pour chaque composant, les évalue selon des priorités définies par l’utilisateur et produit un classeur Excel comparant les délais de livraison, les prix, les stocks et d’autres détails clés, automatisant ce qui serait autrement un long processus d’approvisionnement manuel. J’ai pris en charge le projet de bout en bout, en appliquant des principes d’ingénierie des exigences et de conception logicielle pour rédiger la documentation qui sert de base de connaissances à l’agent.',
    'skills.kicker': 'ma boîte à outils',
    'skills.heading': 'Compétences',
    'skills.intro': 'Un mélange de fondamentaux du génie logiciel, d’expertise en test et d’outils modernes de développement Web.',
    'skills.catProgramming': 'Programmation et génie',
    'skills.catTesting': 'Test et qualité',
    'skills.catWeb': 'Web et infonuagique',
    'skills.catWorkflow': 'Flux de travail et collaboration',
    'skill.english': 'Anglais',
    'skill.french': 'Français',
    'skill.arabic': 'Arabe',
    'contact.kicker': 'dites bonjour',
    'contact.heading': 'Contactez-moi!',
    'contact.intro': 'Je suis ouverte aux occasions en génie logiciel, aux stages et aux collaborations qui ont un impact significatif.',
    'contact.emailBtn': 'Envoyez-moi un courriel',
    'contact.linkedinBtn': 'Connectez avec moi sur LinkedIn',
    'contact.emailLabel': 'Courriel',
    'contact.phoneLabel': 'Téléphone',
    'contact.copy': 'Copier',
    'footer.resume': 'CV',
    'footer.copyright': '© 2026 Melanie Malek. Tous droits réservés.',
    'footer.made': 'Conçu et développé avec ♡'
  };

  var copiedText = { en: 'Copied ✓', fr: 'Copié ✓' };

  var toggle = document.getElementById('lang-toggle');
  var elements = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var titleEl = document.querySelector('title[data-i18n]');

  // Snapshot the current (English) DOM text before anything gets swapped,
  // so toggling back to English always restores exactly what's in the HTML.
  var enText = {};
  elements.forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (!(key in enText)) enText[key] = el.textContent.trim().replace(/\s+/g, ' ');
  });
  var enTitle = document.title;

  var currentLang = function () {
    return document.documentElement.lang === 'fr' ? 'fr' : 'en';
  };

  /* ---------- Copy email ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.copy-btn'), function (btn) {
    var timer;
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      var key = btn.getAttribute('data-i18n');
      var reset = function () {
        btn.classList.remove('is-copied');
        btn.textContent = currentLang() === 'fr' ? frTranslations[key] : enText[key];
      };
      var done = function () {
        btn.classList.add('is-copied');
        btn.textContent = copiedText[currentLang()];
        clearTimeout(timer);
        timer = setTimeout(reset, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {
          window.location.href = 'mailto:' + value;
        });
      } else {
        window.location.href = 'mailto:' + value;
      }
    });
  });

  if (!toggle) return;

  var applyLanguage = function (lang) {
    document.documentElement.lang = lang;

    elements.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text = lang === 'fr' ? frTranslations[key] : enText[key];
      if (text) el.textContent = text;
    });

    if (titleEl) {
      var key = titleEl.getAttribute('data-i18n');
      document.title = lang === 'fr' ? (frTranslations[key] || enTitle) : enTitle;
    }

    toggle.textContent = lang === 'en' ? 'FR' : 'EN';
    toggle.setAttribute('aria-label', lang === 'en' ? 'Switch to French' : 'Switch to English');

    try { localStorage.setItem('lang', lang); } catch (e) {}
  };

  var storedLang;
  try { storedLang = localStorage.getItem('lang'); } catch (e) {}

  applyLanguage(storedLang === 'fr' ? 'fr' : 'en');

  toggle.addEventListener('click', function () {
    applyLanguage(currentLang() === 'fr' ? 'en' : 'fr');
  });
})();
