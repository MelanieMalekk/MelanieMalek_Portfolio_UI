(function () {
  var header = document.querySelector('.site-header');
  if (header) {
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
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

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();

(function () {
  var translations = {
    'meta.title': { en: 'Melanie Malek | Software Engineer', fr: 'Melanie Malek | Ingénieure logicielle' },
    'skip.link': { en: 'Skip to main content', fr: 'Passer au contenu principal' },
    'nav.about': { en: 'About', fr: 'À propos' },
    'nav.experience': { en: 'Experience', fr: 'Expérience' },
    'nav.projects': { en: 'Projects', fr: 'Projets' },
    'nav.skills': { en: 'Skills', fr: 'Compétences' },
    'nav.contact': { en: 'Contact', fr: 'Contact' },
    'hero.eyebrow': { en: 'Software Engineer', fr: 'Ingénieure logicielle' },
    'hero.subtitle': { en: 'Building thoughtful, user-centered digital experiences.', fr: 'Concevante des expériences numériques réfléchies et centrées sur l’utilisateur.' },
    'hero.bio': {
      en: 'I’m a 4th-year software engineering student at the University of Ottawa with a strong interest in software design, automation, and creating polished user experiences. My work blends technical rigor with human-centered thinking, whether I’m developing applications, building internal tools, improving workflows, or designing interfaces that feel intuitive and modern.',
      fr: 'Je suis étudiante en 4e année de génie logiciel à l’Université d’Ottawa, passionnée par la conception logicielle, l’automatisation et la création d’expériences utilisateur soignées. Mon travail allie rigueur technique et approche centrée sur l’humain, que ce soit pour développer des applications, créer des outils internes, améliorer des flux de travail ou concevoir des interfaces intuitives et modernes.'
    },
    'hero.resumeBtn': { en: 'Download Resume', fr: 'Téléchargez mon CV' },
    'hero.projectsBtn': { en: 'View Projects', fr: 'Voir les projets' },
    'hero.statCoop': { en: 'Co-op roles', fr: 'Stages coop' },
    'hero.statStacks': { en: 'Technical stacks', fr: 'Piles technologiques' },
    'hero.statGpa': { en: 'GPA', fr: 'Moyenne' },
    'hero.eduDegree': { en: 'B.A.Sc. Software Engineering', fr: 'B.Sc.A. en génie logiciel' },
    'hero.eduSchool': { en: 'University of Ottawa', fr: 'Université d’Ottawa' },
    'experience.heading': { en: 'Experience', fr: 'Expérience' },
    'experience.intro': { en: 'Recent roles spanning software engineering, automation, AI-enabled workflow design, and systems support.', fr: 'Postes récents en génie logiciel, en automatisation, en conception de flux de travail assistée par l’IA et en soutien aux systèmes.' },
    'exp1.title': { en: 'Project Engineering Student – Electronic Warfare (Co-op)', fr: 'Étudiante en génie de projets – Guerre électronique (stage coop)' },
    'exp1.desc': { en: 'Engineered an AI-powered supplier-sourcing agent with Copilot, automating workflows and improving resource efficiency.', fr: 'Conception d’un agent d’approvisionnement alimenté par l’IA avec Copilot, automatisant les flux de travail et améliorant l’efficacité des ressources.' },
    'exp1.period': { en: 'May 2025 – Aug 2025', fr: 'Mai 2025 – Août 2025' },
    'exp2.title': { en: 'Tools & Automation Software Developer (Co-op)', fr: 'Développeuse de logiciels d’outils et d’automatisation (stage coop)' },
    'exp2.desc': { en: 'Developed and deployed web applications, dashboards, and internal tools to streamline operations and support cross-functional teams.', fr: 'Développement et déploiement d’applications Web, de tableaux de bord et d’outils internes pour optimiser les opérations et soutenir les équipes transversales.' },
    'exp2.period': { en: 'Sep 2025 – Dec 2025', fr: 'Sept. 2025 – Déc. 2025' },
    'exp3.title': { en: 'QA Automation Tester (Co-op)', fr: 'Testeuse en automatisation de l’assurance qualité (stage coop)' },
    'exp3.desc': { en: 'Built and maintained Selenium Java automation scripts, performed manual testing, and tracked defects in Agile release cycles.', fr: 'Création et maintenance de scripts d’automatisation Selenium Java, exécution de tests manuels et suivi des anomalies dans des cycles Agile.' },
    'exp3.period': { en: 'Jan 2025 – Apr 2025', fr: 'Janv. 2025 – Avr. 2025' },
    'exp4.title': { en: 'Software Engineering Student (Co-op)', fr: 'Étudiante en génie logiciel (stage coop)' },
    'exp4.desc': { en: 'Maintained SAP-based systems, scheduled batch jobs, and developed ABAP reports to improve reliability and support business operations.', fr: 'Maintenance de systèmes basés sur SAP, planification de traitements par lots et développement de rapports ABAP pour améliorer la fiabilité et soutenir les opérations.' },
    'exp4.period': { en: 'May 2024 – Dec 2024', fr: 'Mai 2024 – Déc. 2024' },
    'projects.heading': { en: 'Projects', fr: 'Projets' },
    'projects.intro': { en: 'A few examples of design-driven, user-focused projects I’ve built across web development, UI design, and interactive experiences.', fr: 'Quelques exemples de projets axés sur la conception et l’utilisateur, réalisés en développement Web, en design UI et en expériences interactives.' },
    'projects.openLink': { en: 'Open project →', fr: 'Voir le projet →' },
    'proj.ai.title': { en: 'AI Supplier-Sourcing Agent', fr: 'Agent d’approvisionnement IA' },
    'proj.ai.desc': {
      en: 'An AI agent that takes a parts list for submarine electronic warfare systems, conducts thorough research to identify candidate suppliers, and ranks them against a user-defined configuration — surfacing lead time, price, stock, and other supplier details in a generated Excel workbook. Designed and built independently, applying software design and requirements-engineering principles to produce the documentation that serves as the agent’s knowledge base.',
      fr: 'Un agent IA qui prend une liste de pièces pour des systèmes de guerre électronique sous-marins, mène une recherche approfondie pour trouver des fournisseurs candidats et les classe selon une configuration définie par l’utilisateur — présentant délais de livraison, prix, stock et autres détails dans un classeur Excel généré. Conçu et développé de façon autonome, en appliquant des principes de conception logicielle et d’ingénierie des exigences pour produire la documentation qui sert de base de connaissances à l’agent.'
    },
    'proj.dental.title': { en: 'Dental Clinic Website', fr: 'Clinique dentaire' },
    'proj.dental.desc': { en: 'A professional clinic website featuring online booking, service pages, provider profiles, testimonials, and clear patient-focused navigation.', fr: 'Un site Web professionnel offrant la prise de rendez-vous en ligne, des pages de services, des profils de praticiens, des témoignages et une navigation claire axée sur le patient.' },
    'proj.word.title': { en: 'Word Flash Memory Game', fr: 'Jeu de mémoire' },
    'proj.word.desc': { en: 'A fun browser-based memory challenge where players view and recall a set of words under time pressure, building a quick and engaging gameplay loop.', fr: 'Un jeu de mémoire amusant dans le navigateur où les joueurs visualisent et mémorisent des mots sous pression de temps, pour une boucle de jeu rapide et captivante.' },
    'proj.ecom.title': { en: 'E-Commerce Shop', fr: 'Commerce électronique' },
    'proj.ecom.desc': { en: 'A modern storefront experience with categories, account flow, shopping cart logic, product filtering, and a user-friendly checkout concept.', fr: 'Une expérience de boutique moderne avec catégories, parcours de compte, logique de panier, filtrage de produits et un concept de paiement convivial.' },
    'proj.sports.title': { en: 'Sports Data Dashboard', fr: 'Application de données sportives' },
    'proj.sports.desc': { en: 'An interactive data dashboard that visualizes player and team statistics by league, season, and performance category for clear comparisons.', fr: 'Un tableau de bord interactif qui visualise les statistiques des joueurs et des équipes par ligue, saison et catégorie de performance pour des comparaisons claires.' },
    'skills.heading': { en: 'Skills', fr: 'Compétences' },
    'skills.intro': { en: 'A mix of software engineering fundamentals, testing expertise, and modern web development tools.', fr: 'Un mélange de fondamentaux du génie logiciel, d’expertise en test et d’outils modernes de développement Web.' },
    'skills.catProgramming': { en: 'Programming & Engineering', fr: 'Programmation et génie' },
    'skills.catTesting': { en: 'Testing & Quality', fr: 'Test et qualité' },
    'skills.catWeb': { en: 'Web & Cloud', fr: 'Web et infonuagique' },
    'skills.catWorkflow': { en: 'Workflow & Collaboration', fr: 'Flux de travail et collaboration' },
    'skill.english': { en: 'English', fr: 'Anglais' },
    'skill.french': { en: 'French', fr: 'Français' },
    'skill.arabic': { en: 'Arabic', fr: 'Arabe' },
    'bring.heading': { en: 'What I bring', fr: 'Ce que j’apporte' },
    'bring.se.title': { en: 'Software Engineering', fr: 'Génie logiciel' },
    'bring.se.desc': { en: 'Designing maintainable systems, writing robust code, and solving real-world problems in collaborative environments.', fr: 'Conception de systèmes maintenables, rédaction de code robuste et résolution de problèmes concrets en environnement collaboratif.' },
    'bring.ai.title': { en: 'AI Agents', fr: 'Agents IA' },
    'bring.ai.desc': { en: 'Designing and implementing AI-powered solutions to automate tasks and improve decision-making processes.', fr: 'Conception et mise en œuvre de solutions alimentées par l’IA pour automatiser des tâches et améliorer la prise de décision.' },
    'bring.qa.title': { en: 'Automation & QA', fr: 'Automatisation et assurance qualité' },
    'bring.qa.desc': { en: 'Building automated test frameworks, validating product quality, and improving reliability across development cycles.', fr: 'Création de cadres de test automatisés, validation de la qualité des produits et amélioration de la fiabilité au fil des cycles de développement.' },
    'bring.ux.title': { en: 'UI/UX Thinking', fr: 'Réflexion UI/UX' },
    'bring.ux.desc': { en: 'Creating clean, intuitive interfaces that prioritize clarity, accessibility, and a polished user experience.', fr: 'Création d’interfaces claires et intuitives qui privilégient la clarté, l’accessibilité et une expérience utilisateur soignée.' },
    'contact.heading': { en: 'Let’s Connect!', fr: 'Contactez moi!' },
    'contact.intro': { en: 'I’m open to software engineering opportunities, internships, and collaborations that create meaningful impact.', fr: 'Je suis ouverte aux occasions en génie logiciel, aux stages et aux collaborations qui ont un impact significatif.' },
    'contact.emailBtn': { en: 'Email Me', fr: 'Envoyez-moi un courriel' },
    'contact.linkedinBtn': { en: 'Connect on LinkedIn', fr: 'Connectez avec moi sur LinkedIn' },
    'contact.emailLabel': { en: 'Email', fr: 'Courriel' },
    'contact.phoneLabel': { en: 'Phone', fr: 'Téléphone' },
    'footer.copyright': { en: '© 2026 Melanie Malek. All rights reserved.', fr: '© 2026 Melanie Malek. Tous droits réservés.' }
  };

  var toggle = document.getElementById('lang-toggle');
  if (!toggle) return;

  var elements = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var titleEl = document.querySelector('title[data-i18n]');

  var applyLanguage = function (lang) {
    document.documentElement.lang = lang;

    elements.forEach(function (el) {
      var entry = translations[el.getAttribute('data-i18n')];
      if (entry && entry[lang]) {
        el.textContent = entry[lang];
      }
    });

    if (titleEl) {
      var titleEntry = translations[titleEl.getAttribute('data-i18n')];
      if (titleEntry && titleEntry[lang]) {
        document.title = titleEntry[lang];
      }
    }

    toggle.textContent = lang === 'en' ? 'FR' : 'EN';
    toggle.setAttribute('aria-label', lang === 'en' ? 'Switch to French' : 'Switch to English');

    try {
      localStorage.setItem('lang', lang);
    } catch (e) {}
  };

  var storedLang;
  try {
    storedLang = localStorage.getItem('lang');
  } catch (e) {}

  applyLanguage(storedLang === 'fr' ? 'fr' : 'en');

  toggle.addEventListener('click', function () {
    applyLanguage(document.documentElement.lang === 'fr' ? 'en' : 'fr');
  });
})();
