/* Home page: renders services, doctors, sample reviews and FAQ from config.js */
(function () {
  'use strict';
  var L = window.Lumina, el = L.el, cfg = L.cfg;

  var services = document.getElementById('services-grid');
  cfg.services.forEach(function (s) {
    services.append(
      el('article', { class: 'card service-card reveal' },
        el('span', { class: 'icon-box', icon: s.icon }),
        el('h3', { text: s.name }),
        el('p', { class: 'card-text', text: s.description }),
        el('div', { class: 'card-meta' },
          el('span', { class: 'dur', text: s.durationMin + ' دقيقة' }),
          el('span', { class: 'price', text: 'يبدأ من ' + s.priceFromJod + ' دينار' })),
        el('a', { class: 'btn btn-outline', href: 'book.html?service=' + encodeURIComponent(s.id), text: 'احجز هذه الخدمة' })));
  });

  var doctors = document.getElementById('doctors-grid');
  cfg.doctors.forEach(function (d) {
    doctors.append(
      el('article', { class: 'card doctor-card reveal' },
        el('div', { class: 'avatar', text: d.initials, 'aria-hidden': 'true' }),
        el('h3', { text: d.name }),
        el('p', { text: d.specialty }),
        el('a', { class: 'btn btn-outline btn-block', href: 'book.html?doctor=' + encodeURIComponent(d.id), text: 'احجز مع الطبيب' })));
  });

  var reviews = document.getElementById('reviews-grid');
  cfg.sampleReviews.forEach(function (r) {
    var stars = el('div', { class: 'stars', 'aria-hidden': 'true' });
    for (var i = 0; i < 5; i++) stars.insertAdjacentHTML('beforeend', L.icon('star'));
    reviews.append(
      el('figure', { class: 'card review reveal' }, stars,
        el('blockquote', { text: '«' + r.text + '»' }),
        el('figcaption', { text: r.name })));
  });

  var faq = document.getElementById('faq-list');
  cfg.faqs.forEach(function (f, i) {
    var btnId = 'faq-btn-' + i, panelId = 'faq-panel-' + i, open = i === 0;
    var panel = el('div', { class: 'faq-panel', id: panelId, role: 'region', 'aria-labelledby': btnId, hidden: !open, text: f.a });
    var btn = el('button', { class: 'faq-btn', id: btnId, type: 'button', 'aria-expanded': String(open), 'aria-controls': panelId });
    btn.append(f.q);
    btn.insertAdjacentHTML('beforeend', L.icon('chevronDown'));
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
    faq.append(el('div', { class: 'faq-item' }, el('h3', null, btn), panel));
  });
})();
