/* Booking wizard: service → doctor → date & time → details. State lives in the URL (?service=…&doctor=…). */
(function () {
  'use strict';
  var L = window.Lumina, el = L.el, cfg = L.cfg;
  var STEPS = ['الخدمة', 'الطبيب', 'الموعد', 'بياناتك'];
  var DETAILS_KEY = 'lumina:details';
  var CONFIRMED_KEY = 'lumina:confirmed';

  var days = L.upcomingDays();
  var details = Object.assign({ name: '', phone: '', notes: '', consent: false }, L.store.get(DETAILS_KEY) || {});
  details.website = ''; // honeypot never restored
  var errors = {};
  var serverError = '';
  var submitting = false;
  var lastStep = -1;

  function params() { return new URLSearchParams(location.search); }

  function update(changes, nextStep) {
    var p = params();
    Object.keys(changes).forEach(function (k) {
      var v = changes[k];
      if (v === null || v === '') p.delete(k); else p.set(k, v);
    });
    if (nextStep !== undefined) p.set('step', String(nextStep));
    history.pushState(null, '', location.pathname + '?' + p.toString());
    render();
  }
  window.addEventListener('popstate', render);

  function state() {
    var p = params();
    var serviceId = p.get('service') || '';
    var doctorId = p.get('doctor') || '';
    var date = p.get('date') || '';
    var time = p.get('time') || '';
    var service = L.getService(serviceId);
    var doc = L.getDoctor(doctorId);
    var doctorValid = doctorId === 'any' || (service && doc && doc.serviceIds.indexOf(serviceId) !== -1);
    var dateValid = days.some(function (d) { return d.ymd === date && d.open; });
    var slots = service && doctorValid && dateValid ? L.slotsFor(date, serviceId, doctorId) : [];
    var chosen = slots.find(function (s) { return s.time === time && s.available; });
    var maxStep = !service ? 0 : !doctorValid ? 1 : !chosen ? 2 : 3;
    var req = Number(p.get('step'));
    var step = p.has('step') && Number.isFinite(req) ? Math.min(Math.max(req, 0), maxStep) : maxStep;
    return { serviceId: serviceId, doctorId: doctorId, date: date, time: time, service: service, doctorValid: doctorValid, dateValid: dateValid, slots: slots, chosen: chosen, maxStep: maxStep, step: step };
  }

  function navButtons(back, next) {
    return el('div', { class: 'nav-row' }, back || el('span'), next || el('span'));
  }
  function backBtn(toStep, disabled) {
    return el('button', { class: 'btn btn-outline', type: 'button', disabled: disabled, icon: 'arrowRight', onclick: function () { update({}, toStep); } }, ' رجوع');
  }
  function nextBtn(toStep, enabled) {
    var b = el('button', { class: 'btn btn-primary', type: 'button', disabled: !enabled, onclick: function () { update({}, toStep); } }, 'التالي ');
    b.insertAdjacentHTML('beforeend', L.icon('arrowLeft'));
    return b;
  }

  function renderSteps(s) {
    var ol = document.getElementById('steps');
    ol.replaceChildren();
    STEPS.forEach(function (label, i) {
      var done = i < s.step, current = i === s.step;
      var lab = el('span', { class: 'step-label' });
      if (done) lab.insertAdjacentHTML('beforeend', L.icon('check'));
      lab.append((i + 1) + '. ' + label);
      ol.append(el('li', null, el('button', {
        type: 'button', class: 'step-btn' + (done ? ' done' : '') + (current ? ' current' : ''),
        disabled: i > s.maxStep, 'aria-current': current ? 'step' : null,
        onclick: function () { update({}, i); },
      }, el('span', { class: 'step-bar' }), lab)));
    });
  }

  function summaryRows(s) {
    var assigned = s.doctorId === 'any' ? L.getDoctor(s.chosen && s.chosen.doctorId) : L.getDoctor(s.doctorId);
    var doctorText = s.doctorId === 'any' ? (assigned ? assigned.name + ' (أي طبيب متاح)' : 'أي طبيب متاح') : assigned && assigned.name;
    var whenText = s.dateValid ? L.formatFullDate(s.date) + (s.chosen ? ' · ' + L.formatTime12(s.time) : '') : null;
    var rows = [['stethoscope', 'الخدمة', s.service && s.service.name], ['user', 'الطبيب', doctorText], ['calendar', 'الموعد', whenText]];
    var dl = el('dl', { class: 'summary' });
    rows.forEach(function (r) {
      dl.append(el('div', { class: 'sum-row' }, el('span', { class: 'icon-dot', icon: r[0] }),
        el('div', null, el('dt', { text: r[1] }), el('dd', { text: r[2] || '—' }))));
    });
    if (s.service) dl.append(el('p', { class: 'sum-foot', text: 'المدة: ' + s.service.durationMin + ' دقيقة · يبدأ من ' + s.service.priceFromJod + ' دينار' }));
    return dl;
  }

  function renderSummary(s) {
    var mob = document.getElementById('summary-mobile');
    mob.hidden = !s.service;
    document.getElementById('summary-m').replaceChildren(summaryRows(s));
    var d = document.getElementById('summary-d');
    d.replaceChildren(s.service ? summaryRows(s) : el('p', { class: 'hint', text: 'اختر خدمة لبدء الحجز.' }));
  }

  function stepService(s) {
    var presetDoctor = !s.service && s.doctorId && s.doctorId !== 'any' ? L.getDoctor(s.doctorId) : null;
    var list = presetDoctor ? cfg.services.filter(function (x) { return presetDoctor.serviceIds.indexOf(x.id) !== -1; }) : cfg.services;
    var grid = el('div', { class: 'choice-grid' });
    list.forEach(function (svc) {
      grid.append(el('button', {
        class: 'choice', type: 'button', 'aria-pressed': String(svc.id === s.serviceId),
        onclick: function () {
          var d = L.getDoctor(s.doctorId);
          var keep = s.doctorId === 'any' || (d && d.serviceIds.indexOf(svc.id) !== -1);
          update({ service: svc.id, doctor: keep ? s.doctorId : null, time: null }, 1);
        },
      }, el('span', { class: 'icon-box', icon: svc.icon }),
        el('span', null, el('strong', { text: svc.name }), el('small', { text: svc.durationMin + ' دقيقة · يبدأ من ' + svc.priceFromJod + ' دينار' }))));
    });
    return el('section', { 'aria-labelledby': 's1' },
      el('h2', { class: 'step-title', id: 's1', text: 'اختر الخدمة' + (presetDoctor ? ' (خدمات ' + presetDoctor.name + ')' : '') }),
      grid, navButtons(null, nextBtn(1, s.maxStep > 0)));
  }

  function stepDoctor(s) {
    var grid = el('div', { class: 'choice-grid' });
    var opts = [{ id: 'any', name: 'أي طبيب متاح', specialty: 'نختار لك أقرب موعد متاح', initials: '★' }].concat(L.doctorsForService(s.serviceId));
    opts.forEach(function (d) {
      grid.append(el('button', {
        class: 'choice', type: 'button', 'aria-pressed': String(d.id === s.doctorId),
        onclick: function () { update({ doctor: d.id, time: null }, 2); },
      }, el('span', { class: 'avatar sm', text: d.initials, 'aria-hidden': 'true' }),
        el('span', null, el('strong', { text: d.name }), el('small', { text: d.specialty }))));
    });
    return el('section', { 'aria-labelledby': 's2' },
      el('h2', { class: 'step-title', id: 's2', text: 'اختر الطبيب' }),
      grid, navButtons(backBtn(0), nextBtn(2, s.maxStep > 1)));
  }

  function stepTime(s) {
    var row = el('div', { class: 'days-row' });
    days.forEach(function (d) {
      row.append(el('button', {
        class: 'day', type: 'button', disabled: !d.open, 'aria-pressed': String(d.ymd === s.date),
        onclick: function () { update({ date: d.ymd, time: null }); },
      }, el('strong', { text: L.formatDayName(d.ymd) }), el('small', { text: d.open ? L.formatDayMonth(d.ymd) : 'مغلق' })));
    });
    var body;
    if (!s.dateValid) body = el('p', { class: 'hint', text: 'اختر يوماً لعرض الأوقات المتاحة.' });
    else if (!s.slots.length) body = el('p', { class: 'notice', text: 'لا توجد مواعيد متبقية في هذا اليوم. اختر يوماً آخر.' });
    else if (s.slots.every(function (x) { return !x.available; })) {
      body = el('p', { class: 'notice', text: (s.doctorId === 'any' ? 'كل المواعيد محجوزة في هذا اليوم.' : 'الطبيب غير متاح في هذا اليوم.') + ' اختر يوماً آخر.' });
    } else {
      body = el('div', { class: 'slots', role: 'group', 'aria-label': 'الأوقات المتاحة' });
      s.slots.forEach(function (x) {
        body.append(el('button', {
          class: 'slot', type: 'button', disabled: !x.available, 'aria-pressed': String(x.available && x.time === s.time),
          onclick: function () { serverError = ''; update({ time: x.time }); },
        }, el('span', { text: L.formatTime12(x.time) }), x.available ? null : el('small', { text: 'محجوز' })));
      });
    }
    return el('section', { 'aria-labelledby': 's3' },
      el('h2', { class: 'step-title', id: 's3', text: 'اختر اليوم والوقت' }),
      serverError ? el('p', { class: 'alert', role: 'alert', text: serverError }) : null,
      el('div', { class: 'days', role: 'group', 'aria-label': 'الأيام المتاحة' }, row),
      body, navButtons(backBtn(1), nextBtn(3, !!s.chosen)));
  }

  function field(id, label, input, hint) {
    input.setAttribute('aria-invalid', String(!!errors[id]));
    if (errors[id]) input.setAttribute('aria-describedby', id + '-error');
    else if (hint) input.setAttribute('aria-describedby', id + '-hint');
    return el('div', null,
      el('div', { class: 'field-head' }, el('label', { for: id, text: label }), hint ? el('span', { id: id + '-hint', text: hint }) : null),
      input,
      errors[id] ? el('p', { class: 'error', id: id + '-error', text: errors[id] }) : null);
  }

  function saveDetails() {
    L.store.set(DETAILS_KEY, { name: details.name, phone: details.phone, notes: details.notes, consent: details.consent });
  }

  function stepDetails(s) {
    var name = el('input', { id: 'name', class: 'input', autocomplete: 'name', maxlength: '60' });
    name.value = details.name;
    name.addEventListener('input', function () { details.name = name.value; saveDetails(); });
    var phone = el('input', { id: 'phone', class: 'input', type: 'tel', inputmode: 'tel', autocomplete: 'tel', dir: 'ltr', maxlength: '20' });
    phone.value = details.phone;
    phone.addEventListener('input', function () { details.phone = phone.value; saveDetails(); });
    var counter = el('span', { id: 'notes-hint', text: details.notes.length + '/300' });
    var notes = el('textarea', { id: 'notes', class: 'input', maxlength: '300' });
    notes.value = details.notes;
    notes.addEventListener('input', function () { details.notes = notes.value; counter.textContent = notes.value.length + '/300'; saveDetails(); });
    var notesField = field('notes', 'ملاحظات (اختياري)', notes, ' ');
    notesField.querySelector('.field-head span').replaceWith(counter);

    var consent = el('input', { type: 'checkbox', id: 'consent', 'aria-invalid': String(!!errors.consent), 'aria-describedby': errors.consent ? 'consent-error' : null });
    consent.checked = details.consent;
    consent.addEventListener('change', function () { details.consent = consent.checked; saveDetails(); });

    // Honeypot: hidden from people and screen readers; bots tend to fill it.
    var hp = el('input', { id: 'website', name: 'website', tabindex: '-1', autocomplete: 'off' });
    hp.addEventListener('input', function () { details.website = hp.value; });

    var submitBtn = el('button', { class: 'btn btn-primary', type: 'submit', disabled: submitting });
    if (submitting) { submitBtn.insertAdjacentHTML('beforeend', L.icon('loader')); submitBtn.append(' جارٍ التأكيد…'); }
    else submitBtn.append('تأكيد الحجز');

    var form = el('form', { class: 'form', novalidate: true },
      field('name', 'الاسم الكامل', name),
      field('phone', 'رقم الجوال', phone, 'مثال: 0791234567'),
      notesField,
      el('div', { class: 'honeypot', 'aria-hidden': 'true' }, el('label', { for: 'website', text: 'Website' }), hp),
      el('div', null,
        el('label', { class: 'check' }, consent, el('span', { text: 'أوافق على التواصل معي لتأكيد الموعد' })),
        errors.consent ? el('p', { class: 'error', id: 'consent-error', text: errors.consent }) : null),
      serverError ? el('p', { class: 'alert', role: 'alert', text: serverError }) : null,
      el('div', { class: 'nav-row' }, backBtn(2, submitting), submitBtn));
    form.addEventListener('submit', function (e) { e.preventDefault(); submit(s); });
    return el('section', { 'aria-labelledby': 's4' }, el('h2', { class: 'step-title', id: 's4', text: 'بياناتك' }), form);
  }

  function submit(s) {
    if (submitting || !s.service || !s.chosen) return;
    serverError = '';
    var v = L.validateDetails(details);
    errors = v.errors;
    if (!v.ok) {
      render();
      var first = document.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
      return;
    }
    var doctorId = s.doctorId === 'any' ? s.chosen.doctorId : s.doctorId;
    var booking = { serviceId: s.serviceId, doctorId: doctorId, date: s.date, time: s.time, name: v.data.name, phone: v.data.phone, notes: v.data.notes };

    submitting = true;
    render();
    setTimeout(function () {
      // Same business rules as the server version, re-checked at submit time.
      var slotError = details.website ? null : L.validateSlot(booking);
      submitting = false;
      if (slotError) {
        serverError = slotError;
        update({ time: null }, 2);
        return;
      }
      var reference = L.newReference();
      if (!details.website) forward(Object.assign({ reference: reference, createdAt: new Date().toISOString(), source: 'website' }, booking));
      L.store.set(CONFIRMED_KEY, { reference: reference, serviceId: booking.serviceId, doctorId: doctorId, date: booking.date, time: booking.time, name: booking.name });
      L.store.del(DETAILS_KEY);
      location.replace('confirmed.html');
    }, 600);
  }

  // Optional: fire-and-forget to an automation webhook (see config.js security note).
  function forward(payload) {
    var url = cfg.webhookUrl;
    if (!url || !/^https:\/\//.test(url)) return;
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }));
      else fetch(url, { method: 'POST', body: body, keepalive: true, mode: 'no-cors' });
    } catch (e) { /* the booking confirmation must not depend on the webhook */ }
  }

  function render() {
    var s = state();
    renderSteps(s);
    renderSummary(s);
    var view = document.getElementById('step-view');
    var builders = [stepService, stepDoctor, stepTime, stepDetails];
    view.replaceChildren(builders[s.step](s));
    if (s.step !== 3) { errors = {}; }
    if (s.step !== lastStep) {
      if (lastStep !== -1) { window.scrollTo(0, 0); document.getElementById('page-title').focus({ preventScroll: true }); }
      document.getElementById('live').textContent = 'الخطوة ' + (s.step + 1) + ' من 4: ' + STEPS[s.step];
      lastStep = s.step;
    }
  }

  render();
})();
