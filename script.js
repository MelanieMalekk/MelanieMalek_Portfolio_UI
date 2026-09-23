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
    'hero.eyebrow': 'Ingénieure logicielle',
    'hero.subtitle': 'Transformer des problèmes complexes en expériences simples.',
    'hero.bio': 'Je suis étudiant en 4e année en génie logiciel à l’Université d’Ottawa et je me passionne pour la création de logiciels à la fois efficaces, intuitifs et agréables à utiliser. Je m’intéresse particulièrement à la croisée de l’ingénierie et du design, où la technologie, l’automatisation et une conception réfléchie permettent de créer des expériences simples et intuitives.',
    'hero.resumeBtn': 'Téléchargez mon CV',
    'hero.projectsBtn': 'Voir les projets',
    'hero.statCoop': 'Stages coop',
    'hero.statStacks': 'Piles technologiques',
    'hero.statGpa': 'Moyenne',
    'hero.eduDegree': 'B.Sc.A. en génie logiciel',
    'hero.eduSchool': 'Université d’Ottawa',
    'experience.heading': 'Expérience',
    'experience.intro': 'Postes récents en génie logiciel, en automatisation, en conception de flux de travail assistée par l’IA et en soutien aux systèmes.',
    'exp1.title': 'Étudiante en génie de projets – Guerre électronique (stage coop)',
    'exp1.desc': 'Conception d’un agent d’approvisionnement alimenté par l’IA avec Copilot, automatisant les flux de travail et améliorant l’efficacité des ressources.',
    'exp1.period': 'Mai 2025 – Août 2025',
    'exp2.title': 'Développeuse de logiciels d’outils et d’automatisation (stage coop)',
    'exp2.desc': 'Développement et déploiement d’applications Web, de tableaux de bord et d’outils internes pour optimiser les opérations et soutenir les équipes transversales.',
    'exp2.period': 'Sept. 2025 – Déc. 2025',
    'exp3.title': 'Testeuse en automatisation de l’assurance qualité (stage coop)',
    'exp3.desc': 'Création et maintenance de scripts d’automatisation Selenium Java, exécution de tests manuels et suivi des anomalies dans des cycles Agile.',
    'exp3.period': 'Janv. 2025 – Avr. 2025',
    'exp4.title': 'Étudiante en génie logiciel (stage coop)',
    'exp4.desc': 'Maintenance de systèmes basés sur SAP, planification de traitements par lots et développement de rapports ABAP pour améliorer la fiabilité et soutenir les opérations.',
    'exp4.period': 'Mai 2024 – Déc. 2024',
    'projects.heading': 'Projets',
    'projects.intro': 'Quelques exemples de projets axés sur la conception et l’utilisateur, réalisés en développement Web, en design UI et en expériences interactives.',
    'projects.openLink': 'Voir le projet →',
    'proj.ai.title': 'Agent d’approvisionnement IA',
    'proj.ai.desc': 'Un agent IA qui prend une liste de pièces pour des systèmes de guerre électronique sous-marins, mène une recherche approfondie pour trouver des fournisseurs candidats et les classe selon une configuration définie par l’utilisateur — présentant délais de livraison, prix, stock et autres détails dans un classeur Excel généré. Conçu et développé de façon autonome, en appliquant des principes de conception logicielle et d’ingénierie des exigences pour produire la documentation qui sert de base de connaissances à l’agent.',
    'proj.dental.title': 'Clinique dentaire',
    'proj.dental.desc': 'Un site Web professionnel offrant la prise de rendez-vous en ligne, des pages de services, des profils de praticiens, des témoignages et une navigation claire axée sur le patient.',
    'proj.word.title': 'Jeu de mémoire',
    'proj.word.desc': 'Un jeu de mémoire amusant dans le navigateur où les joueurs visualisent et mémorisent des mots sous pression de temps, pour une boucle de jeu rapide et captivante.',
    'proj.ecom.title': 'Commerce électronique',
    'proj.ecom.desc': 'Une expérience de boutique moderne avec catégories, parcours de compte, logique de panier, filtrage de produits et un concept de paiement convivial.',
    'proj.sports.title': 'Application de données sportives',
    'proj.sports.desc': 'Un tableau de bord interactif qui visualise les statistiques des joueurs et des équipes par ligue, saison et catégorie de performance pour des comparaisons claires.',
    'skills.heading': 'Compétences',
    'skills.intro': 'Un mélange de fondamentaux du génie logiciel, d’expertise en test et d’outils modernes de développement Web.',
    'skills.catProgramming': 'Programmation et génie',
    'skills.catTesting': 'Test et qualité',
    'skills.catWeb': 'Web et infonuagique',
    'skills.catWorkflow': 'Flux de travail et collaboration',
    'skill.english': 'Anglais',
    'skill.french': 'Français',
    'skill.arabic': 'Arabe',
    'bring.heading': 'Ce que j’apporte',
    'bring.se.title': 'Génie logiciel',
    'bring.se.desc': 'Conception de systèmes maintenables, rédaction de code robuste et résolution de problèmes concrets en environnement collaboratif.',
    'bring.ai.title': 'Agents IA',
    'bring.ai.desc': 'Conception et mise en œuvre de solutions alimentées par l’IA pour automatiser des tâches et améliorer la prise de décision.',
    'bring.qa.title': 'Automatisation et assurance qualité',
    'bring.qa.desc': 'Création de cadres de test automatisés, validation de la qualité des produits et amélioration de la fiabilité au fil des cycles de développement.',
    'bring.ux.title': 'Réflexion UI/UX',
    'bring.ux.desc': 'Création d’interfaces claires et intuitives qui privilégient la clarté, l’accessibilité et une expérience utilisateur soignée.',
    'contact.heading': 'Contactez moi!',
    'contact.intro': 'Je suis ouverte aux occasions en génie logiciel, aux stages et aux collaborations qui ont un impact significatif.',
    'contact.emailBtn': 'Envoyez-moi un courriel',
    'contact.linkedinBtn': 'Connectez avec moi sur LinkedIn',
    'contact.emailLabel': 'Courriel',
    'contact.phoneLabel': 'Téléphone',
    'footer.copyright': '© 2026 Melanie Malek. Tous droits réservés.'
  };

  var toggle = document.getElementById('lang-toggle');
  if (!toggle) return;

  var elements = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var titleEl = document.querySelector('title[data-i18n]');

  // Snapshot the current (English) DOM text before anything gets swapped,
  // so toggling back to English always restores exactly what's in the HTML.
  var enText = {};
  elements.forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (!(key in enText)) {
      enText[key] = el.textContent;
    }
  });
  var enTitle = document.title;

  var applyLanguage = function (lang) {
    document.documentElement.lang = lang;

    elements.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text = lang === 'fr' ? frTranslations[key] : enText[key];
      if (text) {
        el.textContent = text;
      }
    });

    if (titleEl) {
      var key = titleEl.getAttribute('data-i18n');
      document.title = lang === 'fr' ? (frTranslations[key] || enTitle) : enTitle;
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
