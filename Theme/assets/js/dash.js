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

  let clients = JSON.parse(localStorage.getItem("sc-clients")) || [
    {
      id: 1,
      name: "Sample Client",
      email: "hello@Saas-core.com",
      status: "Active",
      type: "premium",
      revenue: "$12,400",
      joined: "2 days ago",
      online: true,
      avatar: "assets/images/251.png",
    },
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

  function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `
        <i class="${
          type === "success"
            ? "ri-checkbox-circle-line"
            : "ri-error-warning-line"
        }"></i>

        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  // 2. دالة حفظ العميل الجديد
  let activities = JSON.parse(localStorage.getItem("sc-activities")) || [];
  function saveClient() {
    // جلب القيم من الـ IDs اللي في الـ HTML بتاعك
    const name = document.getElementById("clientName").value;
    const email = document.getElementById("clientEmail").value; // ضفنا ده
    const status = document.getElementById("clientStatus").value;
    const type = document.getElementById("clientType").value;
    const avatar = document.getElementById("clientAvatar").value;

    // التحقق إن الاسم والإيميل مش فاضيين
    if (!name.trim() || !email.trim()) {
      showToast("Name and Email are required!", "error");
      return;
    }

    const newClient = {
      id: Date.now(),
      name: name,
      email: email, // حفظ الإيميل في بيانات العميل
      status: status || "Active Client",
      type: type,
      avatar: avatar || "assets/images/251.png",
      revenue: "$0",
      joined: "Just now",
      online: true,
    };

    clients.unshift(newClient); // إضافة في أول القائمة
    // ✅ الحفظ الحقيقي
    localStorage.setItem("sc-clients", JSON.stringify(clients));
    showToast("Client Added Successfully");
    addActivity(`${name} added as new client`);
    renderClients(); // إعادة رسم الكروت عشان يظهر الجديد
    closeModal(); // قفل المودال وتنظيف الخانات
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
        // ✅ تحديث التخزين
        localStorage.setItem("sc-clients", JSON.stringify(clients));
        showToast("Client Deleted", "error");
        addActivity("Client deleted", "delete");
        renderClients();
        renderActivities();
      });
    });
  }

function renderClients(data = clients) {

    const grid = document.querySelector(".clients-grid");

    if (!grid) return;

    grid.innerHTML = "";

    data.forEach((client) => {

        grid.innerHTML += `

        <div class="client-card ${client.type}" data-id="${client.id}">

            <div class="client-header">

                <div class="client-avatar-wrapper">

                    <img
                      src="${client.avatar}"
                      class="avatar"
                      onerror="this.src='assets/images/251.png'"
                    />

                    <span class="online-status ${
                      client.online ? "active" : ""
                    }"></span>

                </div>

                <div class="client-actions">

                    <i class="ri-more-2-fill"></i>

                </div>

            </div>

            <div class="client-info">

                <h4>${client.name}</h4>

                <p>${client.email}</p>

            </div>

            <div class="client-stats">

                <div>
                    <span>Revenue</span>
                    <strong>${client.revenue}</strong>
                </div>

                <div>
                    <span>Status</span>
                    <strong>${client.status}</strong>
                </div>

            </div>

            <div class="client-footer">

                <span class="badge ${client.type}">
                    ${client.type}
                </span>

                <small>${client.joined}</small>

            </div>

            <button class="delete-btn delete-client">
                <i class="ri-delete-bin-line"></i>
            </button>

        </div>
        `;
    });

    attachDeleteEvents();
}

  // استدعاء الدالة لأول مرة عشان تعرض البيانات التجريبية
  renderClients();
  const searchInput = document.querySelector(".search-box input");


  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();

     const filtered = clients.filter((client) =>
  client.name.toLowerCase().includes(value)
);

      renderClients(filtered);
    });
  }
  const skeleton = document.getElementById("clientsSkeleton");

if (skeleton) {
    skeleton.style.display = "grid";
}

  function addActivity(text, type = "add") {
    const activity = {
      id: Date.now(),
      text,
      type,
      time: "Just now",
    };

    activities.unshift(activity);

    localStorage.setItem("sc-activities", JSON.stringify(activities));

    renderActivities();
  }

  function renderActivities() {
    const feed = document.getElementById("activityFeed");

    if (!feed) return;

    feed.innerHTML = "";

    activities.slice(0, 8).forEach((activity) => {
      feed.innerHTML += `
            <div class="timeline-item">

                <div class="dot ${activity.type}"></div>

                <div class="content">
                    <p>${activity.text}</p>
                    <span>${activity.time}</span>
                </div>

            </div>
        `;
    });

    if (data.length === 0) {
    grid.innerHTML = `
        <div class="empty-state">
            <i class="ri-user-search-line"></i>
            <h3>No Clients Found</h3>
            <p>Try adding a new client.</p>
        </div>
    `;
    return;
}
  }
  
  if (skeleton) {
    skeleton.style.display = "none";
}
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
