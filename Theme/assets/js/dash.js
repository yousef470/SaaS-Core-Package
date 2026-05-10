document.addEventListener("DOMContentLoaded", () => {
  console.log("SaaS-Core Dashboard Logic Loaded"); // ===============================
  // 🌐 1. LANGUAGE SYSTEM
  // ===============================

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
  } // ===============================
  // 📊 2. BACKEND-READY DATA (DASHBOARD STATS)
  // ===============================

 let clients = [
    { id: 1, name: "Sample Client", email: "hello@nexora.com", status: "Active", type: "premium", avatar: "assets/images/251.png" }
];
const modal = document.getElementById("clientModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const saveBtn = document.getElementById("saveClientBtn");

// 1. دالة إغلاق المودال (عشان تستخدمها في كذا مكان)
function closeModal() {
    if (modal) {
        modal.classList.remove("active");
        // تنظيف كل المدخلات بما فيها الإيميل
        document.getElementById("clientName").value = "";
        document.getElementById("clientEmail").value = ""; // ضفنا ده
        document.getElementById("clientStatus").value = "";
        document.getElementById("clientAvatar").value = "";
    }
}

// 2. دالة حفظ العميل الجديد

function saveClient() {
    // جلب القيم من الـ IDs اللي في الـ HTML بتاعك
    const name = document.getElementById("clientName").value;
    const email = document.getElementById("clientEmail").value; // ضفنا ده
    const status = document.getElementById("clientStatus").value;
    const type = document.getElementById("clientType").value;
    const avatar = document.getElementById("clientAvatar").value;

    // التحقق إن الاسم والإيميل مش فاضيين
    if (!name.trim() || !email.trim()) {
        alert("Name and Email are required!");
        return;
    }

    const newClient = {
        id: Date.now(),
        name: name,
        email: email, // حفظ الإيميل في بيانات العميل
        status: status || "Active Client",
        type: type,
        avatar: avatar || "assets/images/251.png", 
    };

    clients.unshift(newClient); // إضافة في أول القائمة
    renderClients(); // إعادة رسم الكروت عشان يظهر الجديد
    closeModal();    // قفل المودال وتنظيف الخانات
}
// 3. مستمعي الأحداث (Event Listeners)
if (openBtn) {
    openBtn.addEventListener("click", () => modal.classList.add("active"));
}

if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
}

// قفل المودال لما تضغط بره الصندوق الأسود
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
}

// ربط زرار الحفظ بالدالة
if (saveBtn) {
    saveBtn.addEventListener("click", saveClient);
}

// 4. دالة حذف العميل (تأكد إنها موجودة عشان زرار المسح يشتغل)
function attachDeleteEvents() {
    document.querySelectorAll(".delete-client").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const card = e.target.closest(".client-card");
            const id = parseInt(card.dataset.id);
            clients = clients.filter((c) => c.id !== id);
            renderClients();
        });
    });
}

function renderClients() {
    const grid = document.querySelector(".clients-grid");
    if (!grid) return; // تأكد إن الكلاس ده موجود في الـ HTML بتاعك

    grid.innerHTML = ""; // مسح الكروت القديمة

    clients.forEach((client) => {
        grid.innerHTML += `
            <div class="client-card" data-id="${client.id}">
                <div class="client-top">
                    <img src="${client.avatar}" class="avatar" onerror="this.src='assets/images/251.png'" />
                    <div class="client-text">
                        <h4>${client.name}</h4>
                        <p>${client.status}</p>
                    </div>
                </div>
                <div class="client-bottom">
                    <span class="badge ${client.type}">${client.type}</span>
                    <div class="actions">
                        <i class="ri-delete-bin-line delete-client" style="cursor:pointer; color: #ef4444;"></i>
                    </div>
                </div>
            </div>
        `;
    });

    // تشغيل دالة الحذف عشان الزراير الجديدة تشتغل
    attachDeleteEvents();
}

// استدعاء الدالة لأول مرة عشان تعرض البيانات التجريبية
renderClients();
  // ===============================
  // 📈 3. CHARTS (UNCHANGED BUT CLEAN)
  // ===============================

  const perfCtx = document.getElementById("scPerformanceChart");
  if (perfCtx) {
    new Chart(perfCtx.getContext("2d"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue",
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
          y: {
            beginAtZero: true,
            grid: { color: "rgba(200, 200, 200, 0.1)" },
          },
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
        plugins: { legend: { display: false } },
      },
    });
  } // ===============================
  // 🎨 4. THEME SYSTEM
  // ===============================

  const themeBtn = document.getElementById("themeToggle");

  const updateThemeIcon = (isDark) => {
    if (themeBtn) {
      themeBtn.innerHTML = isDark
        ? '<i class="ri-sun-line"></i>'
        : '<i class="ri-moon-line"></i>';
    }
  };

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
    });
  } // ===============================
  // 🔔 5. NOTIFICATIONS
  // ===============================

  const notifBtn = document.getElementById("notif-btn");
  const notifDropdown = document.getElementById("notif-dropdown");

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle("active");

      const dot = notifBtn.querySelector(".notification-dot");
      if (dot) {
        dot.style.opacity = "0";
        dot.style.pointerEvents = "none";
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (notifDropdown && notifDropdown.classList.contains("active")) {
      if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
        notifDropdown.classList.remove("active");
      }
    }
  }); // ===============================
  // 📱 6. SIDEBAR (MOBILE READY)
  // ===============================

  const menuBtn = document.getElementById("toggleSidebar");
  const sidebar = document.querySelector(".sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
});

