document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
       1️⃣ DARK MODE
    ========================================= */
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") body.classList.add("dark");

  if (themeToggle) {
    const updateThemeIcon = () => {
      themeToggle.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
    };

    updateThemeIcon();

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      const isDark = body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateThemeIcon();
    });
  } /* =========================================
       2️⃣ LANGUAGE
    ========================================= */

  const langToggle = document.getElementById("langToggle");
  let currentLang = localStorage.getItem("lang") || "en";

  function applyLanguage(lang) {
    const isArabic = lang === "ar";
    body.dir = isArabic ? "rtl" : "ltr";

    document.querySelectorAll("[data-en][data-ar]").forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (el.childNodes.length <= 1) el.textContent = text;
    });

    localStorage.setItem("lang", lang);
  }

  applyLanguage(currentLang);

  if (langToggle) {
    langToggle.textContent = currentLang.toUpperCase();

    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "ar" : "en";
      langToggle.textContent = currentLang.toUpperCase();
      applyLanguage(currentLang);
    });
  } /* ========================================= 
  3️⃣ SIDEBAR
   ========================================= */
  const toggleSidebar = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".overlay");
  const openSidebar = () => {
    sidebar?.classList.add("open");
    overlay?.classList.add("active");
    body.style.overflow = "hidden";
  };
  const closeSidebar = () => {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("active");
    body.style.overflow = "";
  };
  toggleSidebar?.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });
  overlay?.addEventListener("click", closeSidebar);
  document.querySelectorAll(".sidebar nav a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
  }); /* =========================================
   4️⃣ SCROLL EFFECTS
   ========================================= */
  const reveals = document.querySelectorAll(".reveal");
  const handleScrollEffects = () => {
    const triggerBottom = window.innerHeight * 0.85;
    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < triggerBottom) {
        el.classList.add("active");
      }
    });
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScrollEffects);
  handleScrollEffects();

  /* =========================================
   6️⃣ AUTH SYSTEM (SaaS-Core) - FINAL VERSION
========================================= */
  const authBtn = document.getElementById("authBtn");

  function updateAuthUI() {
    if (!authBtn) return; // التأكد من استخدام Keys براند saas-core الموحدة
    const user = localStorage.getItem("userSaasCoreName");
    const currentLang = localStorage.getItem("lang") || "en";

    if (user) {
      // حالة المستخدم مسجل دخول (عرض زرار تسجيل الخروج)
      authBtn.setAttribute("data-en", "Logout");
      authBtn.setAttribute("data-ar", "تسجيل الخروج");
      authBtn.classList.add("logged");
    } else {
      // حالة المستخدم زائر (عرض زرار تسجيل الدخول)
      authBtn.setAttribute("data-en", "Login");
      authBtn.setAttribute("data-ar", "تسجيل الدخول");
      authBtn.classList.remove("logged");
    } // تحديث النص فوراً بناءً على اللغة الحالية

    if (typeof applyLanguage === "function") {
      applyLanguage(currentLang);
    }
  }

  // تشغيل التحديث فور تحميل الصفحة
  updateAuthUI();

  if (authBtn) {
    authBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const user = localStorage.getItem("userSaasCoreName");

      if (user) {
        // --- إجراء تسجيل الخروج (Logout) ---
        // 1. مسح البيانات الموحدة
        localStorage.removeItem("userSaasCoreName");
        localStorage.removeItem("userSaasCoreEmail"); // 2. توجيه فوري لصفحة اللوجن بضغطة واحدة
        window.location.href = "login.html";
      } else {
        // --- إجراء تسجيل الدخول (Login) ---
        window.location.href = "login.html";
      }
    });
  }
});
