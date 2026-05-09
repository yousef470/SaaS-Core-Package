document.addEventListener("DOMContentLoaded", () => {
    console.log("SaaS-Core Dashboard Logic Loaded");

    // === 1. إعدادات اللغة (Language Setup) ===
    // ملحوظة: لو الكود ده موجود في app.js، ممكن تمسحه من هنا عشان ما يحصلش تكرار
    const langToggle = document.getElementById("langToggle");
    const applyLanguage = (lang) => {
        const isArabic = lang === "ar";
        document.documentElement.lang = lang;
        document.documentElement.dir = isArabic ? "rtl" : "ltr";

        document.querySelectorAll("[data-en]").forEach((el) => {
            el.innerText = isArabic ? el.dataset.ar : el.dataset.en;
        });

        document.querySelectorAll("[data-en-placeholder]").forEach((el) => {
            el.placeholder = isArabic ? el.dataset.arPlaceholder : el.dataset.enPlaceholder;
        });

        if (langToggle) {
            langToggle.innerText = isArabic ? "EN" : "AR";
        }
        localStorage.setItem("sc-lang", lang);
    };

    const savedLang = localStorage.getItem("sc-lang") || "en";
    applyLanguage(savedLang);

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            const newLang = document.documentElement.lang === "ar" ? "en" : "ar";
            applyLanguage(newLang);
        });
    }

    // === 2. الرسوم البيانية (Charts) ===
    // Chart 1: Performance/Revenue
    const perfCtx = document.getElementById("scPerformanceChart");
    if (perfCtx) {
        new Chart(perfCtx.getContext("2d"), {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [{
                    label: "Revenue",
                    data: [12000, 19000, 15000, 25000, 22000, 42850],
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: "rgba(200, 200, 200, 0.1)" } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // Chart 2: Usage Stats
    const usageCtx = document.getElementById("usageChart");
    if (usageCtx) {
        new Chart(usageCtx.getContext("2d"), {
            type: "bar",
            data: {
                labels: ["AI", "Web", "App", "API"],
                datasets: [{
                    label: "Usage",
                    data: [400, 600, 300, 500],
                    backgroundColor: "#a855f7",
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

   // === 3. تبديل الثيم (Theme Toggle) ===
    const themeBtn = document.getElementById("themeToggle");
    
    // دالة لتحديث الأيقونة بناءً على الوضع الحالي
    const updateThemeIcon = (isDark) => {
        if (themeBtn) {
            // بنستخدم Remix Icons عشان مشروعك Premium
            themeBtn.innerHTML = isDark 
                ? '<i class="ri-sun-line"></i>' 
                : '<i class="ri-moon-line"></i>';
        }
    };

    // التأكد من الثيم المحفوظ عند تحميل الصفحة
    const savedTheme = localStorage.getItem("sc-theme") || "light";
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        updateThemeIcon(true);
    } else {
        updateThemeIcon(false);
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDark = document.body.classList.contains("dark");
            updateThemeIcon(isDark);
            localStorage.setItem("sc-theme", isDark ? "dark" : "light");
            console.log("Theme switched to:", isDark ? "dark" : "light");
        });
    }

    // === 4. نظام التنبيهات (Notifications) ===
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');

    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // تبديل ظهور القائمة
            notifDropdown.classList.toggle('active');
            
            // إخفاء النقطة الحمراء (Dot) بمجرد فتح القائمة
            const dot = notifBtn.querySelector('.notification-dot');
            if (dot) {
                dot.style.opacity = '0'; // بنستخدم opacity عشان متهزش التصميم
                dot.style.pointerEvents = 'none';
            }
        });
    }

    // إغلاق الدروب داون عند الضغط في أي مكان خارجي
    document.addEventListener('click', (e) => {
        if (notifDropdown && notifDropdown.classList.contains('active')) {
            if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
                notifDropdown.classList.remove('active');
            }
        }
    });

    // === 5. Sidebar Toggle (للموبايل) ===
    const menuBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
});