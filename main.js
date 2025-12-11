// main.js
(function(){
  const defaultLang = 'en';
  const langSelects = document.querySelectorAll('#langSelect');
  const themeToggleButtons = document.querySelectorAll('#themeToggle');
  const yearSpans = [...document.querySelectorAll('#year, #year2, #year3, #year4, #year5')];

  // set years
  yearSpans.forEach(el => el.textContent = new Date().getFullYear());

  // initialize language
  function setLanguage(lang){
    if(!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) lang = defaultLang;
    document.documentElement.lang = lang;
    // find elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const txt = window.TRANSLATIONS[lang][key];
      if(txt) {
        if(el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
          el.placeholder = txt;
        } else {
          el.textContent = txt;
        }
      }
    });
    // update selects
    langSelects.forEach(s => s.value = lang);
    localStorage.setItem('site_lang', lang);
  }

  // wire language selectors
  langSelects.forEach(s => {
    s.addEventListener('change', (e) => setLanguage(e.target.value));
  });

  // load saved language
  const storedLang = localStorage.getItem('site_lang') || defaultLang;
  setLanguage(storedLang);

  // Theme toggle
  function setTheme(theme){
    document.body.classList.remove('theme-dark','theme-light');
    document.body.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
    localStorage.setItem('site_theme', theme);
  }

  themeToggleButtons.forEach(b => {
    b.addEventListener('click', () => {
      const current = document.body.classList.contains('theme-light') ? 'light' : 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  });

  const storedTheme = localStorage.getItem('site_theme') || 'dark';
  setTheme(storedTheme);

  // Accordion behavior
  document.querySelectorAll('.accordion-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      const panel = toggle.nextElementSibling;
      if(panel){
        if(!expanded){
          panel.style.display = 'block';
        } else {
          panel.style.display = 'none';
        }
      }
    });
  });

  // Smooth internal link scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if(target) target.scrollIntoView({behavior:'smooth'});
    });
  });

  // Contact form (local simulation)
  const contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('#name').value.trim();
      const email = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();
      const status = document.getElementById('formStatus');

      if(!name || !email || !message){
        status.textContent = (window.TRANSLATIONS[document.documentElement.lang] || {}).contact_info_note || 'Please complete all fields.';
        status.style.color = '#f6bfbc';
        return;
      }

      // Simulate send
      status.textContent = 'Sending…';
      status.style.color = '#9aa4a6';
      setTimeout(() => {
        status.textContent = 'Message sent locally (simulation). Thank you.';
        status.style.color = '#c9a84a';
        contactForm.reset();
      }, 900);
    });
  }

  // Make nav links highlight current
  document.querySelectorAll('.top-nav .nav-link').forEach(a => {
    if(window.location.pathname.endsWith(a.getAttribute('href'))) {
      a.style.fontWeight = '700';
    }
  });

  // Small accessibility: focus outlines
  document.addEventListener('keydown', e => {
    if(e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
  });

})();
