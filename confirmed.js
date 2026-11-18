/* Confirmation page: reads the booking saved by book.js (sessionStorage) and renders it safely. */
(function () {
  'use strict';
  var L = window.Lumina, el = L.el, cfg = L.cfg;
  var view = document.getElementById('confirm-view');
  var b = L.store.get('lumina:confirmed');
  var valid = b && ['reference', 'serviceId', 'doctorId', 'date', 'time', 'name'].every(function (k) { return typeof b[k] === 'string'; });
  var service = valid && L.getService(b.serviceId);
  var doctor = valid && L.getDoctor(b.doctorId);

  if (!valid || !service || !doctor) {
    view.append(el('div', { class: 'center-page' },
      el('h1', { text: 'لا يوجد حجز لعرضه' }),
      el('p', { class: 'page-sub', text: 'ابدأ حجزاً جديداً من صفحة الحجز.' }),
      el('a', { class: 'btn btn-primary', href: 'book.html', text: 'احجز موعدك' })));
    return;
  }

  var when = L.formatFullDate(b.date) + ' · ' + L.formatTime12(b.time);
  var message = [
    'مرحباً ' + cfg.clinic.name + '،', 'أرغب بتأكيد حجزي:',
    '• رقم الحجز: ' + b.reference, '• الاسم: ' + b.name, '• الخدمة: ' + service.name,
    '• الطبيب: ' + doctor.name, '• الموعد: ' + when,
  ].join('\n');

  var rows = [['رقم الحجز', b.reference], ['الاسم', b.name], ['الخدمة', service.name], ['الطبيب', doctor.name], ['الموعد', when], ['المدة', service.durationMin + ' دقيقة']];
  var dl = el('dl', { class: 'confirm-list' });
  rows.forEach(function (r) { dl.append(el('div', null, el('dt', { text: r[0] }), el('dd', { text: r[1], dir: r[0] === 'رقم الحجز' ? 'ltr' : null }))); });

  var head = el('div', { class: 'confirm-head' });
  head.insertAdjacentHTML('afterbegin', L.icon('checkCircle'));
  head.append(el('h1', { text: 'تم استلام حجزك!' }), el('p', { class: 'page-sub', text: 'أكّد الحجز على واتساب ليصلك تذكير قبل الموعد.' }));

  view.append(
    head,
    el('div', { class: 'card' }, dl),
    el('div', { class: 'confirm-actions' },
      el('a', { class: 'btn btn-wa', href: L.whatsappLink(message), target: '_blank', rel: 'noopener noreferrer', icon: 'whatsapp' }, ' تأكيد الحجز على واتساب'),
      el('button', {
        class: 'btn btn-outline', type: 'button', icon: 'calendarPlus',
        onclick: function () {
          L.downloadIcs({ reference: b.reference, date: b.date, start: L.hhmmToMinutes(b.time) || 0, duration: service.durationMin, title: 'موعد أسنان – ' + service.name, description: doctor.name + '\nرقم الحجز: ' + b.reference });
        },
      }, ' إضافة للتقويم'),
      el('a', { class: 'btn btn-outline', href: 'index.html', icon: 'home' }, ' العودة للرئيسية')),
    el('p', { class: 'small-note', text: 'هذا موقع تجريبي، ولن يتم حجز موعد حقيقي.' }));
})();
