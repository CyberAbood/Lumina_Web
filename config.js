/*
 * All clinic data lives here — edit this one file to re-brand the site for a real client.
 * Everything below is FICTIONAL (portfolio demo).
 */
window.LUMINA_CONFIG = {
  clinic: {
    name: 'عيادة لومينا لطب الأسنان',
    shortName: 'لومينا',
    tagline: 'ابتسامتك تبدأ من هنا',
    city: 'عمّان',
    address: 'عمّان – شارع تجريبي، مجمّع رقم 10، الطابق الثاني',
    whatsapp: '962700000000', // international format, no "+" (placeholder)
    whatsappDisplay: '+962 7 0000 0000',
    hoursText: 'السبت – الخميس: 10:00 صباحاً – 6:00 مساءً · الجمعة: مغلق',
    developer: 'عبد الرحمن الحوراني',
  },

  schedule: {
    openDays: [0, 1, 2, 3, 4, 6], // 0 = Sunday … 6 = Saturday. Friday (5) closed.
    startMinutes: 10 * 60,
    endMinutes: 18 * 60,
    slotMinutes: 30,
    bookingWindowDays: 14,
    timeZone: 'Asia/Amman',
  },

  /*
   * Optional: send bookings to an automation webhook (e.g. n8n).
   * SECURITY: on a static site this URL is visible to anyone who opens the page source.
   * Treat the webhook as public — validate every field again inside n8n, rate-limit it,
   * and never put a secret or API key here. Leave empty for the pure demo.
   */
  webhookUrl: '',

  services: [
    { id: 'cleaning', name: 'تنظيف وتلميع الأسنان', description: 'إزالة الجير والتصبغات وتلميع لطيف يعيد لأسنانك نظافتها ولمعانها.', durationMin: 30, priceFromJod: 25, icon: 'sparkles' },
    { id: 'fillings', name: 'حشوات تجميلية', description: 'حشوات بلون السن الطبيعي، متينة وغير ملحوظة.', durationMin: 45, priceFromJod: 35, icon: 'shield' },
    { id: 'whitening', name: 'تبييض الأسنان', description: 'تبييض آمن داخل العيادة بنتيجة ملحوظة من الجلسة الأولى.', durationMin: 60, priceFromJod: 120, icon: 'sun' },
    { id: 'root-canal', name: 'علاج العصب', description: 'علاج دقيق ومريح للعصب باستخدام أجهزة حديثة وتخدير موضعي.', durationMin: 60, priceFromJod: 90, icon: 'activity' },
    { id: 'ortho-consult', name: 'تقويم الأسنان – استشارة', description: 'تقييم شامل وخطة علاج واضحة مع خيارات التقويم الشفاف والتقليدي.', durationMin: 30, priceFromJod: 15, icon: 'smile' },
    { id: 'implant-consult', name: 'زراعة الأسنان – استشارة', description: 'فحص وتصوير وتقدير للتكلفة والمدة قبل البدء بالزراعة.', durationMin: 30, priceFromJod: 15, icon: 'anchor' },
  ],

  doctors: [
    { id: 'dr-sara', name: 'د. سارة المصري', initials: 'س م', specialty: 'طب أسنان تجميلي', serviceIds: ['cleaning', 'fillings', 'whitening'], workingDays: [0, 1, 2, 3, 6] },
    { id: 'dr-omar', name: 'د. عمر الخطيب', initials: 'ع خ', specialty: 'علاج العصب والجذور', serviceIds: ['cleaning', 'fillings', 'root-canal'], workingDays: [0, 2, 3, 4, 6] },
    { id: 'dr-lina', name: 'د. لينا حدّاد', initials: 'ل ح', specialty: 'تقويم الأسنان', serviceIds: ['ortho-consult', 'cleaning'], workingDays: [1, 2, 4, 6] },
    { id: 'dr-yazan', name: 'د. يزن العلي', initials: 'ي ع', specialty: 'زراعة وجراحة الفم', serviceIds: ['implant-consult', 'root-canal'], workingDays: [0, 1, 3, 4] },
  ],

  faqs: [
    { q: 'كم تكلفة الزيارة الأولى؟', a: 'تبدأ الاستشارة من 15 ديناراً، وتشمل الفحص وخطة علاج واضحة بالأسعار قبل أي إجراء.' },
    { q: 'هل تتعاملون مع التأمين الصحي؟', a: 'نتعامل مع أغلب شركات التأمين. أرسل لنا اسم شركتك على واتساب لنؤكد لك التغطية.' },
    { q: 'ماذا أحضر معي في أول زيارة؟', a: 'الهوية، بطاقة التأمين إن وجدت، وأي صور أشعة أو تقارير سابقة.' },
    { q: 'كيف ألغي موعدي أو أغيّره؟', a: 'أرسل لنا رسالة على واتساب برقم الحجز قبل الموعد بـ 24 ساعة على الأقل، وسنرتب لك موعداً بديلاً.' },
    { q: 'أين تقع العيادة؟ وهل يوجد موقف سيارات؟', a: 'في عمّان (عنوان تجريبي)، ويتوفر موقف مجاني للمراجعين أسفل المجمّع.' },
  ],

  sampleReviews: [
    { name: 'مراجِعة (نموذج)', text: 'حجزت من الجوال بأقل من دقيقة، ووصلني التأكيد مباشرة. التجربة كانت مريحة جداً.' },
    { name: 'مراجِع (نموذج)', text: 'شرح واضح للخطة والأسعار قبل البدء، وما في أي مفاجآت.' },
    { name: 'مراجِعة (نموذج)', text: 'المواعيد دقيقة وما انتظرت تقريباً. العيادة نظيفة والطاقم لطيف.' },
  ],
};
