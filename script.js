// متغيرات عامة
let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isReading = false;

// وظيفة عرض الصفحات
function showPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active-page');
    });
    
    // إزالة التنشيط من جميع الروابط
    document.querySelectorAll('.nav-menu a').forEach(a => {
        a.classList.remove('active');
    });
    
    // عرض الصفحة المطلوبة
    document.getElementById(pageId).classList.add('active-page');
    
    // تنشيط الرابط
    event.currentTarget.classList.add('active');
    
    // التمرير إلى الأعلى
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // إيقاف القراءة عند تغيير الصفحة
    stopReading();
}

// وظيفة تبديل النمط (فاتح/داكن)
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    
    // حفظ التفضيل
    localStorage.setItem('theme', newTheme);
}

// تحميل النمط المحفوظ
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    // تحميل إعدادات إمكانية الوصول
    loadAccessibilitySettings();
});

// ===== وظائف إمكانية الوصول =====

// تبديل لوحة إمكانية الوصول
function toggleAccessibility() {
    const panel = document.getElementById('accessibility-panel');
    panel.classList.toggle('active');
}

// تغيير حجم الخط
function setFontSize(size) {
    const body = document.body;
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add('font-' + size);
    
    // تحديث الأزرار النشطة
    updateActiveButton('font-size', size);
    
    // حفظ الإعداد
    localStorage.setItem('fontSize', size);
}

// تغيير نمط الخط
function setFontStyle(style) {
    const body = document.body;
    if (style === 'readable') {
        body.classList.add('font-readable');
    } else {
        body.classList.remove('font-readable');
    }
    
    // تحديث الأزرار النشطة
    updateActiveButton('font-style', style);
    
    // حفظ الإعداد
    localStorage.setItem('fontStyle', style);
}

// تغيير التباين
function setContrast(level) {
    const body = document.body;
    if (level === 'high') {
        body.setAttribute('data-contrast', 'high');
    } else {
        body.removeAttribute('data-contrast');
    }
    
    // تحديث الأزرار النشطة
    updateActiveButton('contrast', level);
    
    // حفظ الإعداد
    localStorage.setItem('contrast', level);
}

// بدء قراءة النص
function startReading() {
    if (isReading) {
        stopReading();
        return;
    }
    
    // الحصول على الصفحة النشطة
    const activePage = document.querySelector('.page-content.active-page');
    if (!activePage) return;
    
    // استخراج النص
    let textToRead = '';
    
    // قراءة العناوين والفقرات
    const headings = activePage.querySelectorAll('h1, h2, h3, h4');
    const paragraphs = activePage.querySelectorAll('p');
    
    headings.forEach(heading => {
        textToRead += heading.textContent + '. ';
    });
    
    paragraphs.forEach(paragraph => {
        if (paragraph.textContent.trim() !== '') {
            textToRead += paragraph.textContent + '. ';
        }
    });
    
    if (textToRead.trim() === '') {
        alert('لا يوجد نص للقراءة في هذه الصفحة');
        return;
    }
    
    // إنشاء كائن القراءة
    currentUtterance = new SpeechSynthesisUtterance(textToRead);
    currentUtterance.lang = 'ar-SA'; // اللغة العربية
    currentUtterance.rate = 0.9; // سرعة القراءة
    currentUtterance.pitch = 1; // نبرة الصوت
    
    // عند انتهاء القراءة
    currentUtterance.onend = function() {
        isReading = false;
        updateReadButton();
    };
    
    // بدء القراءة
    speechSynthesis.speak(currentUtterance);
    isReading = true;
    updateReadButton();
}

// إيقاف القراءة
function stopReading() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    isReading = false;
    updateReadButton();
}

// تحديث زر القراءة
function updateReadButton() {
    const readBtn = document.getElementById('readBtn');
    const stopBtn = document.getElementById('stopBtn');
    
    if (isReading) {
        readBtn.style.opacity = '0.5';
        stopBtn.style.opacity = '1';
    } else {
        readBtn.style.opacity = '1';
        stopBtn.style.opacity = '0.5';
    }
}

// إعادة تعيين إمكانية الوصول
function resetAccessibility() {
    // إعادة تعيين حجم الخط
    setFontSize('medium');
    
    // إعادة تعيين نمط الخط
    setFontStyle('cairo');
    
    // إعادة تعيين التباين
    setContrast('normal');
    
    // إيقاف القراءة
    stopReading();
    
    // مسح الإعدادات المحفوظة
    localStorage.removeItem('fontSize');
    localStorage.removeItem('fontStyle');
    localStorage.removeItem('contrast');
    
    alert('تم إعادة تعيين إعدادات إمكانية الوصول');
}

// تحديث الزر النشط
function updateActiveButton(category, value) {
    const section = document.querySelector(`.accessibility-section:has(button[onclick*="${value}"])`);
    if (!section) return;
    
    const buttons = section.querySelectorAll('.btn-group button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(value)) {
            btn.classList.add('active');
        }
    });
}

// تحميل إعدادات إمكانية الوصول المحفوظة
function loadAccessibilitySettings() {
    const fontSize = localStorage.getItem('fontSize');
    const fontStyle = localStorage.getItem('fontStyle');
    const contrast = localStorage.getItem('contrast');
    
    if (fontSize) {
        setFontSize(fontSize);
    }
    
    if (fontStyle) {
        setFontStyle(fontStyle);
    }
    
    if (contrast) {
        setContrast(contrast);
    }
}

// ===== تأثيرات 3D للبطاقات =====

// إضافة تأثير 3D عند تحريك الماوس
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// ===== وظيفة البحث =====

const searchBar = document.querySelector('.search-bar');
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        if (searchTerm.length < 2) return;
        
        // البحث في المحتوى
        const allContent = document.querySelectorAll('.page-content');
        let found = false;
        
        allContent.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                found = true;
                // يمكن إضافة منطق لتمييز النتائج هنا
            }
        });
    });
}

// ===== تأثيرات التمرير =====

// إضافة تأثيرات عند التمرير
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // يمكن إضافة تأثيرات parallax هنا
    const heroImage = document.querySelector('.hero-image-container');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// ===== معالجة النماذج =====

// معالجة نموذج التواصل
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // جمع البيانات
        const formData = new FormData(contactForm);
        
        // هنا يمكن إرسال البيانات إلى الخادم
        // في الوقت الحالي، سنعرض رسالة تأكيد فقط
        
        alert('شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.');
        contactForm.reset();
    });
}

// ===== تحسين الأداء =====

// Lazy loading للصور (عند إضافة صور حقيقية)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // مراقبة جميع الصور التي تحتوي على data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== إغلاق لوحة إمكانية الوصول عند النقر خارجها =====

document.addEventListener('click', (e) => {
    const panel = document.getElementById('accessibility-panel');
    const toggle = document.querySelector('.accessibility-toggle');
    
    if (panel.classList.contains('active')) {
        if (!panel.contains(e.target) && e.target !== toggle) {
            panel.classList.remove('active');
        }
    }
});

// ===== اختصارات لوحة المفاتيح =====

document.addEventListener('keydown', (e) => {
    // Alt + A: فتح لوحة إمكانية الوصول
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        toggleAccessibility();
    }
    
    // Alt + R: بدء/إيقاف القراءة
    if (e.altKey && e.key === 'r') {
        e.preventDefault();
        if (isReading) {
            stopReading();
        } else {
            startReading();
        }
    }
    
    // Alt + T: تبديل النمط
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Escape: إغلاق لوحة إمكانية الوصول
    if (e.key === 'Escape') {
        const panel = document.getElementById('accessibility-panel');
        if (panel.classList.contains('active')) {
            panel.classList.remove('active');
        }
    }
});

// ===== رسالة الترحيب =====

window.addEventListener('load', () => {
    // يمكن إضافة رسالة ترحيب أو تعليمات هنا
    console.log('مرحباً بك في موقع AQABA EMERALD');
    console.log('اختصارات لوحة المفاتيح:');
    console.log('Alt + A: فتح لوحة إمكانية الوصول');
    console.log('Alt + R: بدء/إيقاف قراءة النص');
    console.log('Alt + T: تبديل النمط الفاتح/الداكن');
});

// ===== تحسينات إضافية =====

// منع السحب للصور (لحماية المحتوى)
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
    });
});

// تأثير سلس للانتقال بين الأقسام
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// تحديث السنة في الفوتر تلقائياً
const currentYear = new Date().getFullYear();
const yearElements = document.querySelectorAll('.current-year');
yearElements.forEach(el => {
    el.textContent = currentYear;
});

// ===== معالجة الأخطاء =====

window.addEventListener('error', (e) => {
    console.error('حدث خطأ:', e.error);
});

// ===== دعم PWA (Progressive Web App) =====

// التحقق من دعم Service Worker
if ('serviceWorker' in navigator) {
    // يمكن تفعيل Service Worker هنا للعمل دون اتصال
    // navigator.serviceWorker.register('/sw.js');
}

console.log('تم تحميل جميع السكريبتات بنجاح ✓');
const video = document.getElementById('myVideo');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const progress = document.getElementById('progress');
const timeDisplay = document.getElementById('timeDisplay');

// تشغيل وإيقاف
function togglePlay() {
    if (video.paused) {
        video.play();
        playBtn.innerHTML = '⏸ إيقاف';
    } else {
        video.pause();
        playBtn.innerHTML = '▶ تشغيل';
    }
}

// كتم الصوت
function toggleMute() {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted ? '🔇 مكتوم' : '🔊 صوت';
}

// مستوى الصوت
function setVolume(value) {
    video.volume = value / 100;
}

// تحديث شريط التقدم
video.addEventListener('timeupdate', function() {
    const percent = (video.currentTime / video.duration) * 100;
    progress.style.width = percent + '%';
    
    const current = formatTime(video.currentTime);
    const duration = formatTime(video.duration || 0);
    timeDisplay.innerHTML = current + ' / ' + duration;
});

// التقديم والتأخير
function seek(event) {
    const rect = event.target.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
}

// تنسيق الوقت
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// ملء الشاشة
function toggleFullscreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    }
}

// الترجمة
function toggleSubtitles() {
    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = tracks[i].mode === 'showing' ? 'hidden' : 'showing';
    }
}

// عند انتهاء الفيديو
video.addEventListener('ended', function() {
    playBtn.innerHTML = '▶ إعادة';
});
function searchSite() {
    // 1. الحصول على الكلمة المكتوبة وتحويلها لنص صغير
    let input = document.getElementById('searchInput').value.toLowerCase();
    
    // 2. تحديد جميع العناصر التي نريد البحث بداخلها (البطاقات، الأقسام، الميزات)
    // سنستهدف الكلاسات التي استخدمناها سابقاً مثل spa-card, facility-card, price-card
    let cards = document.querySelectorAll('.spa-card, .facility-card, .price-card, .feature-item');

    cards.forEach(card => {
        // الحصول على النص داخل كل بطاقة
        let text = card.innerText.toLowerCase();
        
        // 3. المقارنة: إذا كانت الكلمة موجودة أظهر البطاقة، وإذا لا أخفِها
        if (text.includes(input)) {
            card.style.display = ""; // إظهار
            card.style.animation = "fadeIn 0.5s"; // لمسة جمالية عند الظهور
        } else {
            card.style.display = "none"; // إخفاء
        }
    });
}
function executeSearch() {
    // 1. الحصول على نص البحث وتحويله لأحرف صغيرة (لضمان الدقة)
    let input = document.getElementById('siteSearch').value.toLowerCase();
    
    // 2. تحديد جميع العناصر التي تريدين البحث بداخلها
    // أضفت لكِ الكلاسات التي استخدمناها في الأقسام السابقة
    let items = document.querySelectorAll('.spa-card, .facility-card, .room-card, .feature-item, .service-item');

    items.forEach(item => {
        // الحصول على النص الموجود داخل كل بطاقة أو قسم
        let content = item.innerText.toLowerCase();
        
        // 3. التحقق: إذا كان النص موجوداً، أظهر العنصر، وإذا لا، أخفِه
        if (content.includes(input)) {
            item.style.display = ""; // إظهار
            item.style.animation = "fadeIn 0.4s ease"; // تأثير ظهور ناعم
        } else {
            item.style.display = "none"; // إخفاء
        }
    });
}
function executeSearch() {
    // 1. الحصول على كلمة البحث
    let input = document.getElementById('siteSearch').value.toLowerCase();
    
    // 2. تحديد جميع الصفحات (الأقسام) في موقعك
    let pages = document.querySelectorAll('.page-content');

    // إذا كان الحقل فارغاً، لا تفعل شيئاً أو أظهر الصفحة الرئيسية فقط
    if (input === "") return;

    pages.forEach(page => {
        // الحصول على كل النصوص داخل الصفحة
        let pageText = page.innerText.toLowerCase();

        // 3. إذا وجدت الكلمة داخل الصفحة
        if (pageText.includes(input)) {
            // إخفاء جميع الصفحات أولاً
            pages.forEach(p => p.classList.remove('active-page'));
            
            // إظهار الصفحة التي تحتوي على الكلمة
            page.classList.add('active-page');
            
            // التمرير للأعلى لرؤية الصفحة بوضوح
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}