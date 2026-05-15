document.addEventListener('DOMContentLoaded', () => {
    // 1. تطبيق الثيم فوراً من الـ localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    // 2. تطبيق اللغة فوراً
    const savedLang = localStorage.getItem('language') || 'en';
    
    const translations = {
        en: {
            title: "Payment Successful",
            desc: "Thank you for purchasing SaaS Core. Your subscription is now active.",
            planLabel: "Selected Plan",
            orderLabel: "Order Number",
            amountLabel: "Amount Paid",
            btn: "Go to Dashboard",
            print: "Download Receipt",
            note: "A confirmation email has been sent to your inbox.",
            dir: "ltr"
        },
        ar: {
            title: "تم الدفع بنجاح",
            desc: "شكراً لشرائك SaaS Core. اشتراكك الآن نشط وجاهز للاستخدام.",
            planLabel: "الخطة المختارة",
            orderLabel: "رقم العملية",
            amountLabel: "المبلغ المدفوع",
            btn: "الانتقال للوحة التحكم",
            print: "تحميل الفاتورة",
            note: "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني.",
            dir: "rtl"
        }
    };

    const t = translations[savedLang];
    
    // تحديث النصوص في الصفحة
    document.getElementById('success-title').innerText = t.title;
    document.getElementById('success-description').innerText = t.desc;
    document.getElementById('label-plan').innerText = t.planLabel;
    document.getElementById('label-id').innerText = t.orderLabel;
    document.getElementById('label-amount').innerText = t.amountLabel;
    document.getElementById('success-btn').innerText = t.btn;
    document.getElementById('label-print').innerText = t.print;
    document.getElementById('success-note').innerText = t.note;
    
    // ضبط اتجاه الصفحة (RTL / LTR)
    document.body.style.direction = t.dir;
    if (t.dir === 'rtl') {
        document.body.classList.add('rtl-mode');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. تطبيق الثيم واللغة (زي ما عملنا قبل كدة)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark');

    const savedLang = localStorage.getItem('language') || 'en';
    
    // 2. جلب بيانات الخطة من الـ localStorage
    // لو ملقاش حاجة (دخل الصفحة دايركت) هيعرض قيم افتراضية
    const planName = localStorage.getItem("finalPlanName") || "Starter Plan";
    const planPrice = localStorage.getItem("finalPlanPrice") || "$19";

    const translations = {
        en: {
            title: "Payment Successful",
            desc: "Thank you for purchasing SaaS Core. Your subscription is now active.",
            planLabel: "Selected Plan",
            orderLabel: "Order Number",
            amountLabel: "Amount Paid",
            btn: "Go to Dashboard",
            print: "Download Receipt",
            note: "A confirmation email has been sent to your inbox.",
            dir: "ltr"
        },
        ar: {
            title: "تم الدفع بنجاح",
            desc: "شكراً لشرائك SaaS Core. اشتراكك الآن نشط وجاهز للاستخدام.",
            planLabel: "الخطة المختارة",
            orderLabel: "رقم العملية",
            amountLabel: "المبلغ المدفوع",
            btn: "الانتقال للوحة التحكم",
            print: "تحميل الفاتورة",
            note: "تم إرسال رسالة تأكيد إلى بريدك الإلكتروني.",
            dir: "rtl"
        }
    };

    const t = translations[savedLang];
    
    // 3. تحديث النصوص الديناميكية (الخطة والسعر)
    document.getElementById('val-plan').innerText = planName;
    document.getElementById('val-amount').innerText = planPrice;

    // 4. تحديث باقي نصوص الصفحة
    document.getElementById('success-title').innerText = t.title;
    document.getElementById('success-description').innerText = t.desc;
    document.getElementById('label-plan').innerText = t.planLabel;
    document.getElementById('label-id').innerText = t.orderLabel;
    document.getElementById('label-amount').innerText = t.amountLabel;
    document.getElementById('success-btn').innerText = t.btn;
    document.getElementById('label-print').innerText = t.print;
    document.getElementById('success-note').innerText = t.note;
    
    document.body.style.direction = t.dir;
});