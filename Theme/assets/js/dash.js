document.addEventListener("DOMContentLoaded", () => {
  console.log("SaaS-Core JS Loaded"); // === 1. إعدادات اللغة (Language Setup) ===

  const langToggle = document.getElementById("langToggle");

  const applyLanguage = (lang) => {
    const isArabic = lang === "ar";
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";

    document.querySelectorAll("[data-en]").forEach((el) => {
      el.innerText = isArabic ? el.dataset.ar : el.dataset.en;
    });

    document.querySelectorAll("[data-en-placeholder]").forEach((el) => {
      el.placeholder = isArabic
        ? el.dataset.arPlaceholder
        : el.dataset.enPlaceholder;
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
  } // === 2. الرسوم البيانية (Charts) ===

  const perfCtx = document.getElementById("scPerformanceChart");
  if (perfCtx) {
    new Chart(perfCtx.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue Growth",
            data: [12000, 19000, 15000, 25000, 22000, 42850],
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { display: false } },
          x: { grid: { display: false } },
        },
      },
    });
  }

  const usageCtx = document.getElementById("usageChart");
  if (usageCtx) {
    new Chart(usageCtx.getContext("2d"), {
      type: "bar",
      data: {
        labels: ["AI", "Web", "App", "API"],
        datasets: [
          {
            label: "Usage",
            data: [400, 600, 300, 500],
            backgroundColor: "#a855f7",
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  } // === 3. تبديل الثيم (Theme Toggle) ===

  const themeBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("sc-theme") || "light";

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (themeBtn) {
      themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      themeBtn.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
      localStorage.setItem("sc-theme", isDark ? "dark" : "light");
    });
  }
}); // نهاية قوس الـ DOMContentLoaded بشكل صحيح
