/*
 * Lumina core: shared helpers for every page (no framework, no build step).
 * Exposes one global: window.Lumina
 */
(function () {
  'use strict';
  var CFG = window.LUMINA_CONFIG;
  document.documentElement.classList.add('js');

  /* ---------------- Icons (trusted constant markup only) ---------------- */
  var S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
  var ICONS = {
    sparkles: '<svg ' + S + '><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/></svg>',
    shield: '<svg ' + S + '><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
    sun: '<svg ' + S + '><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
    activity: '<svg ' + S + '><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    smile: '<svg ' + S + '><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>',
    anchor: '<svg ' + S + '><circle cx="12" cy="5" r="3"/><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/></svg>',
    calendarCheck: '<svg ' + S + '><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg>',
    calendar: '<svg ' + S + '><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    calendarPlus: '<svg ' + S + '><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4"/></svg>',
    bell: '<svg ' + S + '><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
    wallet: '<svg ' + S + '><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>',
    clock: '<svg ' + S + '><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    mapPin: '<svg ' + S + '><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    chevronDown: '<svg ' + S + '><path d="m6 9 6 6 6-6"/></svg>',
    menu: '<svg ' + S + '><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    x: '<svg ' + S + '><path d="M18 6 6 18M6 6l12 12"/></svg>',
    arrowRight: '<svg ' + S + '><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    arrowLeft: '<svg ' + S + '><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    check: '<svg ' + S + '><path d="M20 6 9 17l-5-5"/></svg>',
    checkCircle: '<svg ' + S + '><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    loader: '<svg class="spin" ' + S + '><path d="M21 12a9 9 0 1 1-6.22-8.56"/></svg>',
    user: '<svg ' + S + '><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    stethoscope: '<svg ' + S + '><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>',
    home: '<svg ' + S + '><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2zm5.8 14.03c-.25.69-1.45 1.33-2.01 1.38-.52.05-1.01.25-3.4-.71-2.88-1.15-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.37.26-.28.57-.35.76-.35l.55.01c.18.01.42-.07.65.5.25.59.84 2.04.91 2.19.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.65-.14.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.7-.18 1.39z"/></svg>',
    tooth: '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><rect width="64" height="64" rx="16" fill="#0F766E"/><path d="M22 14c-6 0-9 5-9 11 0 7 3 10 4 16 1 5 2 11 6 11 3 0 3-5 4-9 1-3 2-5 5-5s4 2 5 5c1 4 1 9 4 9 4 0 5-6 6-11 1-6 4-9 4-16 0-6-3-11-9-11-4 0-6 2-10 2s-6-2-10-2z" fill="#fff"/></svg>',
  };
  function icon(name) { return ICONS[name] || ''; }

  /* ---------------- Safe DOM builder (user data always goes in as text) ---------------- */
  function el(tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'icon') node.insertAdjacentHTML('afterbegin', icon(v)); // constants only
      else if (k.indexOf('on') === 0 && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : String(v));
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c === null || c === undefined || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) node.append(x); });
      else node.append(c);
    }
    return node;
  }

  /* ---------------- Dates (clinic-local, time-zone safe) ---------------- */
  var pad = function (n) { return String(n).padStart(2, '0'); };
  function parseYmd(ymd) { var p = ymd.split('-').map(Number); return [p[0] || 1970, p[1] || 1, p[2] || 1]; }
  function clinicNow(now) {
    var parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: CFG.schedule.timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(now || new Date());
    var get = function (t) { var f = parts.find(function (p) { return p.type === t; }); return f ? f.value : '0'; };
    return { ymd: get('year') + '-' + get('month') + '-' + get('day'), minutes: Number(get('hour')) * 60 + Number(get('minute')) };
  }
  function addDays(ymd, days) {
    var p = parseYmd(ymd); var d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + days));
    return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate());
  }
  function weekdayOf(ymd) { var p = parseYmd(ymd); return new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay(); }
  function diffDays(a, b) {
    var x = parseYmd(a), y = parseYmd(b);
    return Math.round((Date.UTC(y[0], y[1] - 1, y[2]) - Date.UTC(x[0], x[1] - 1, x[2])) / 86400000);
  }
  function isValidYmd(s) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    var p = parseYmd(s); var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
    return d.getUTCFullYear() === p[0] && d.getUTCMonth() === p[1] - 1 && d.getUTCDate() === p[2];
  }
  function utcDate(ymd) { var p = parseYmd(ymd); return new Date(Date.UTC(p[0], p[1] - 1, p[2])); }
  var fmtDay = new Intl.DateTimeFormat('ar', { weekday: 'long', timeZone: 'UTC' });
  var fmtDM = new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  var fmtFull = new Intl.DateTimeFormat('ar', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  function minutesToHhmm(m) { return pad(Math.floor(m / 60)) + ':' + pad(m % 60); }
  function hhmmToMinutes(s) { var m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(s || ''); return m ? Number(m[1]) * 60 + Number(m[2]) : null; }
  function formatTime12(s) {
    var m = hhmmToMinutes(s); if (m === null) return s;
    var h = Math.floor(m / 60); var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + pad(m % 60) + ' ' + (h < 12 ? 'ص' : 'م');
  }

  /* ---------------- Data lookups ---------------- */
  function getService(id) { return CFG.services.find(function (s) { return s.id === id; }); }
  function getDoctor(id) { return CFG.doctors.find(function (d) { return d.id === id; }); }
  function doctorsForService(sid) { return CFG.doctors.filter(function (d) { return d.serviceIds.indexOf(sid) !== -1; }); }
  function isOpenDay(ymd) { return CFG.schedule.openDays.indexOf(weekdayOf(ymd)) !== -1; }

  /* ---------------- Slots ---------------- */
  // FNV-1a: deterministic demo "already booked" cells (~30%). Replace with a real calendar for a client.
  function hash(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return h >>> 0;
  }
  function isSimulatedBooked(date, doctorId, minutes) { return hash(date + '|' + doctorId + '|' + minutes) % 100 < 30; }
  function upcomingDays() {
    var today = clinicNow().ymd; var out = [];
    for (var i = 0; i < CFG.schedule.bookingWindowDays; i++) { var d = addDays(today, i); out.push({ ymd: d, open: isOpenDay(d) }); }
    return out;
  }
  function doctorFree(doc, date, start, duration) {
    if (doc.workingDays.indexOf(weekdayOf(date)) === -1) return false;
    for (var t = start; t < start + duration; t += CFG.schedule.slotMinutes) if (isSimulatedBooked(date, doc.id, t)) return false;
    return true;
  }
  function slotsFor(date, serviceId, doctorId) {
    var service = getService(serviceId); if (!service || !isOpenDay(date)) return [];
    var now = clinicNow(); var sc = CFG.schedule;
    var candidates = doctorId === 'any' ? doctorsForService(serviceId) : [getDoctor(doctorId)].filter(Boolean);
    var out = [];
    for (var start = sc.startMinutes; start + service.durationMin <= sc.endMinutes; start += sc.slotMinutes) {
      if (date === now.ymd && start <= now.minutes + 15) continue;
      var free = candidates.find(function (d) { return d.serviceIds.indexOf(serviceId) !== -1 && doctorFree(d, date, start, service.durationMin); });
      out.push({ time: minutesToHhmm(start), available: !!free, doctorId: free ? free.id : undefined });
    }
    return out;
  }

  /* ---------------- Validation (same rules the Vercel API version enforces) ---------------- */
  function normalizeJordanMobile(input) {
    var arabic = '٠١٢٣٤٥٦٧٨٩';
    var s = String(input || '').replace(/[٠-٩]/g, function (c) { return String(arabic.indexOf(c)); });
    s = s.replace(/[\s\-().]/g, '');
    if (s.indexOf('+') === 0) s = s.slice(1);
    if (s.indexOf('00') === 0) s = s.slice(2);
    if (/^07[789]\d{7}$/.test(s)) s = '962' + s.slice(1);
    if (/^7[789]\d{7}$/.test(s)) s = '962' + s;
    return /^9627[789]\d{7}$/.test(s) ? s : null;
  }
  var NAME_RE = /^[\p{Script=Arabic}A-Za-z ]+$/u;
  // eslint-disable-next-line no-control-regex
  var CONTROL = /[\u0000-\u001F\u007F]/g;

  function validateDetails(d) {
    var errors = {}; var clean = {};
    var name = String(d.name || '').replace(/\s+/g, ' ').trim();
    if (name.length < 2) errors.name = name ? 'الاسم قصير جداً.' : 'الاسم مطلوب.';
    else if (name.length > 60) errors.name = 'الاسم طويل جداً.';
    else if (!NAME_RE.test(name)) errors.name = 'الاسم يجب أن يحتوي على حروف ومسافات فقط.';
    clean.name = name;
    var phone = normalizeJordanMobile(d.phone);
    if (!phone) errors.phone = 'أدخل رقم جوال أردني صحيح، مثل 0791234567.';
    clean.phone = phone;
    var notes = String(d.notes || '');
    if (notes.length > 300) errors.notes = 'الملاحظات يجب ألا تتجاوز 300 حرف.';
    clean.notes = notes.replace(CONTROL, ' ').trim();
    if (d.consent !== true) errors.consent = 'يجب الموافقة على التواصل لتأكيد الموعد.';
    return { ok: Object.keys(errors).length === 0, errors: errors, data: clean };
  }

  function validateSlot(b) {
    var service = getService(b.serviceId); if (!service) return 'الخدمة غير موجودة.';
    var doctor = getDoctor(b.doctorId); if (!doctor) return 'الطبيب غير موجود.';
    if (doctor.serviceIds.indexOf(service.id) === -1) return 'الطبيب المختار لا يقدّم هذه الخدمة.';
    if (!isValidYmd(b.date)) return 'التاريخ غير صحيح.';
    var offset = diffDays(clinicNow().ymd, b.date);
    if (offset < 0 || offset >= CFG.schedule.bookingWindowDays) return 'الحجز متاح خلال الأيام الـ 14 القادمة فقط.';
    if (!isOpenDay(b.date)) return 'العيادة مغلقة في هذا اليوم.';
    var start = hhmmToMinutes(b.time);
    if (start === null || (start - CFG.schedule.startMinutes) % CFG.schedule.slotMinutes !== 0) return 'الوقت غير صحيح.';
    if (start < CFG.schedule.startMinutes || start + service.durationMin > CFG.schedule.endMinutes) return 'الوقت خارج ساعات الدوام.';
    var slot = slotsFor(b.date, service.id, doctor.id).find(function (s) { return s.time === b.time; });
    if (!slot || !slot.available) return 'هذا الموعد لم يعد متاحاً، اختر وقتاً آخر.';
    return null;
  }

  function newReference() {
    var alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    var bytes = crypto.getRandomValues(new Uint8Array(5)); var out = '';
    for (var i = 0; i < bytes.length; i++) out += alphabet[bytes[i] % alphabet.length];
    return 'LMN-' + out;
  }

  /* ---------------- Misc helpers ---------------- */
  function whatsappLink(text) {
    return 'https://wa.me/' + CFG.clinic.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  }
  var store = {
    get: function (k) { try { var v = sessionStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del: function (k) { try { sessionStorage.removeItem(k); } catch (e) { /* ignore */ } },
  };

  function downloadIcs(o) {
    var esc = function (s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); };
    var stamp = function (date, m) { return date.replace(/-/g, '') + 'T' + pad(Math.floor(m / 60)) + pad(m % 60) + '00'; };
    var now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Lumina Dental Demo//AR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT', 'UID:' + o.reference + '@lumina-demo', 'DTSTAMP:' + now,
      'DTSTART;TZID=Asia/Amman:' + stamp(o.date, o.start), 'DTEND;TZID=Asia/Amman:' + stamp(o.date, o.start + o.duration),
      'SUMMARY:' + esc(o.title), 'DESCRIPTION:' + esc(o.description), 'LOCATION:' + esc(CFG.clinic.address),
      'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(o.title), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    var url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    var a = el('a', { href: url, download: 'lumina-' + o.reference + '.ics' });
    document.body.append(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  /* ---------------- Shared page chrome ---------------- */
  function initChrome() {
    var btn = document.getElementById('menu-btn');
    var nav = document.getElementById('mobile-nav');
    if (btn && nav) {
      btn.addEventListener('click', function () {
        var open = nav.hidden;
        nav.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
        btn.innerHTML = icon(open ? 'x' : 'menu');
      });
      nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.innerHTML = icon('menu'); } });
    }
    document.querySelectorAll('[data-icon]').forEach(function (n) { n.insertAdjacentHTML('afterbegin', icon(n.getAttribute('data-icon'))); });
    document.querySelectorAll('[data-wa]').forEach(function (n) { n.setAttribute('href', whatsappLink(n.getAttribute('data-wa'))); });
    document.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = String(new Date().getFullYear()); });
    initReveal();
  }

  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal:not(.is-visible)'));
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  window.Lumina = {
    cfg: CFG, icon: icon, el: el, store: store,
    clinicNow: clinicNow, weekdayOf: weekdayOf, hhmmToMinutes: hhmmToMinutes, formatTime12: formatTime12,
    formatDayName: function (y) { return fmtDay.format(utcDate(y)); },
    formatDayMonth: function (y) { return fmtDM.format(utcDate(y)); },
    formatFullDate: function (y) { return fmtFull.format(utcDate(y)); },
    getService: getService, getDoctor: getDoctor, doctorsForService: doctorsForService,
    upcomingDays: upcomingDays, slotsFor: slotsFor, validateSlot: validateSlot, validateDetails: validateDetails,
    newReference: newReference, whatsappLink: whatsappLink, downloadIcs: downloadIcs, initChrome: initChrome, initReveal: initReveal,
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initChrome);
  else initChrome();
})();
