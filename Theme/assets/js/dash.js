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

  let performanceChart = null;
  let usageChart = null;


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
      toast.classList.add("hide");
    }, 2600);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  // 2. دالة حفظ العميل الجديد
  let activities = JSON.parse(localStorage.getItem("sc-activities")) || [];
  let editingClientId = null;
  function validateClient(name, email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.trim().length < 3) {
      showToast("Client name must be at least 3 characters", "error");

      return false;
    }

    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email", "error");

      return false;
    }
    const emailExists = clients.some((client) => {
      return (
        client.email.toLowerCase() === email.toLowerCase() &&
        client.id !== editingClientId
      );
    });

    if (emailExists) {
      showToast("This email already exists", "error");

      return false;
    }
    return true;
  }
  function saveClient() {
    // جلب القيم من الـ IDs اللي في الـ HTML بتاعك
    const name = document.getElementById("clientName").value;
    const email = document.getElementById("clientEmail").value; // ضفنا ده
    const status = document.getElementById("clientStatus").value;
    const type = document.getElementById("clientType").value;
    const avatar = document.getElementById("clientAvatar").value;

    // التحقق إن الاسم والإيميل مش فاضيين
    if (!validateClient(name, email)) return;

    if (editingClientId) {
      clients = clients.map((client) => {
        if (client.id === editingClientId) {
          return {
            ...client,
            name,
            email,
            status: status || "Active Client",
            type,
            avatar: avatar || "assets/images/251.png",
          };
        }

        return client;
      });

      localStorage.setItem("sc-clients", JSON.stringify(clients));

      showToast("Client Updated Successfully");

      addActivity(`${name} updated`);

      editingClientId = null;
    } else {
      const newClient = {
        id: Date.now(),
        name,
        email,
        status: status || "Active Client",
        type,
        avatar: avatar || "assets/images/251.png",
        revenue: "$0",
        joined: "Just now",
        online: true,
      };

      clients.unshift(newClient);

      localStorage.setItem("sc-clients", JSON.stringify(clients));

      showToast("Client Added Successfully");

      addActivity(`${name} added as new client`);
    }

 

    renderClients(); // إعادة رسم الكروت عشان يظهر الجديد
    closeModal(); // قفل المودال وتنظيف الخانات
    updateStats();
    renderActivities();
    updateCharts();
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
  let deleteClientId = null;

  const deleteModal = document.getElementById("deleteModal");

  const confirmDeleteBtn = document.getElementById("confirmDelete");
  

  const cancelDeleteBtn = document.getElementById("cancelDelete");
  

if (cancelDeleteBtn) {
  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.remove("active");
  });
}

if (deleteModal) {
  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) {
      deleteModal.classList.remove("active");
    }
      });
      }
  function attachDeleteEvents() {
    document.querySelectorAll(".delete-client").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".client-card");

        deleteClientId = parseInt(card.dataset.id);

        if (deleteModal) {
          deleteModal.classList.add("active");
        }
      });
    });
  }
  function attachMenuEvents() {
    document.querySelectorAll(".menu-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        const menu = btn.parentElement.querySelector(".client-menu");

        document.querySelectorAll(".client-menu").forEach((m) => {
          if (m !== menu) {
            m.classList.remove("active");
          }
        });

        menu.classList.toggle("active");
      });
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(".client-menu").forEach((menu) => {
        menu.classList.remove("active");
      });
    });
  }

  function renderClients(data = clients) {
    const grid = document.querySelector(".clients-grid");

    if (!grid) return;

    grid.innerHTML = "";
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

   const recentClients =
window.location.pathname.includes("clients.html")
? data
: data.slice(0, 3);

recentClients.forEach((client) => {
      grid.innerHTML += `

<div class="client-card ${client.type}" data-id="${client.id}">

    <div class="client-header">

        <div class="client-user">

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

            <div class="client-info">

                <h4>${client.name}</h4>

                <p>${client.email}</p>

            </div>

        </div>

        <div class="client-actions">

            <button class="menu-btn">
                <i class="ri-more-2-fill"></i>
            </button>

            <div class="client-menu">

                <button class="edit-client">
                    <i class="ri-edit-line"></i>
                    Edit
                </button>

                <button class="delete-client danger">
                    <i class="ri-delete-bin-line"></i>
                    Delete
                </button>

            </div>

        </div>

    </div>

    <div class="client-stats">

        <div class="stat-box">

            <span>Revenue</span>

           <div class="revenue-box">

    <strong>
        ${client.revenue}
    </strong>

    <button
        class="edit-revenue-btn"
        data-id="${client.id}"
    >
        <i class="ri-pencil-line"></i>
    </button>

</div>

        </div>

        <div class="stat-box">

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

</div>
`;
    });

setTimeout(() => {
  attachDeleteEvents();
  attachMenuEvents();
  attachEditEvents();
  setActiveLink();
}, 100);
  }

  function attachEditEvents() {
    document
    .querySelectorAll(".edit-client").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const button = e.currentTarget;

       const card = button.closest(".client-card");

        const id = parseInt(card.dataset.id);

        const client = clients.find((c) => c.id === id);

        if (!client) return;

        editingClientId = id;

        document.getElementById("clientName").value = client.name;

        document.getElementById("clientEmail").value = client.email;

        document.getElementById("clientStatus").value = client.status;

        document.getElementById("clientType").value = client.type;

        document.getElementById("clientAvatar").value = client.avatar;

        modal.classList.add("active");
      });
    });
  }



  // استدعاء الدالة لأول مرة عشان تعرض البيانات التجريبية
  renderClients();
  updateStats();
  updateCharts();
  renderActivities();

  // ===============================
// 💰 EDIT REVENUE
// ===============================
document.addEventListener("click", (e) => {

  const revenueBtn =
    e.target.closest(".edit-revenue-btn");

  if (!revenueBtn) return;

  e.preventDefault();

  const clientId =
    Number(revenueBtn.dataset.id);

  const client =
    clients.find(c => c.id === clientId);

  if (!client) return;

  const modal =
    document.getElementById("revenueModal");

  const input =
    document.getElementById("revenueInput");

  const saveBtn =
    document.getElementById("saveRevenueBtn");

  input.value =
    client.revenue.replace(/[^0-9]/g, "");

  modal.classList.add("active");

  saveBtn.onclick = () => {

    const revenueNumber =
      parseInt(input.value);

    if (isNaN(revenueNumber)) {

      showToast(
        "Please enter numbers only",
        "error"
      );

      return;
    }

    client.revenue =
      "$" + revenueNumber.toLocaleString();

    localStorage.setItem(
      "sc-clients",
      JSON.stringify(clients)
    );

    renderClients();

    updateStats();

    updateCharts();

    showToast("Revenue Updated");

    modal.classList.remove("active");

  };

  const closeRevenueModal =
  document.getElementById("closeRevenueModal");

if (closeRevenueModal) {

  closeRevenueModal.addEventListener(
    "click",
    () => {

      document
        .getElementById("revenueModal")
        .classList.remove("active");

    }
  );

}

});


  const searchInput = document.querySelector(".search-box input");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();

      const filtered = clients.filter((client) =>
        client.name.toLowerCase().includes(value),
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
    if (activities.length === 0) {
      feed.innerHTML = `

        <div class="empty-state activity-empty">

            <i class="ri-time-line"></i>

            <h3>No Activities Yet</h3>

            <p>
                Client actions will appear here
            </p>

        </div>

    `;

      return;
    }

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
  }

  if (skeleton) {
    skeleton.style.display = "none";
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      clients = clients.filter((client) => client.id !== deleteClientId);

      localStorage.setItem("sc-clients", JSON.stringify(clients));

      showToast("Client Deleted", "error");

      addActivity("Client deleted", "delete");

      renderClients();
      renderActivities();
      updateStats();
      updateCharts();

      

      if (deleteModal) {
        deleteModal.classList.remove("active");
      }
    });
  }

  

  // ===============================
  // 📈 3. CHARTS (UNCHANGED BUT CLEAN)
  // ===============================

  function updateCharts() {
    const revenues = clients.map((client) => {
      return parseInt(client.revenue.replace(/[^0-9]/g, "")) || 0;
    });

    const labels = clients.map((client) => client.name);

    if (performanceChart) {
      performanceChart.destroy();
    }

    if (usageChart) {
      usageChart.destroy();
    }

    const perfCtx = document.getElementById("scPerformanceChart");

    if (perfCtx) {
      performanceChart = new Chart(perfCtx.getContext("2d"), {
        type: "line",

        data: {
          labels,

          datasets: [
            {
              label: "Revenue",

              data: revenues,

              borderColor: "#6366f1",

              backgroundColor: "rgba(99,102,241,.1)",

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

          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    const usageCtx = document.getElementById("usageChart");

    if (usageCtx) {
      usageChart = new Chart(usageCtx.getContext("2d"), {
        type: "bar",

        data: {
          labels,

          datasets: [
            {
              label: "Revenue",

              data: revenues,

              backgroundColor: "#a855f7",

              borderRadius: 10,
            },
          ],
        },

        options: {
          responsive: true,

          maintainAspectRatio: false,

          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }

  function updateStats() {
    const totalClients = document.getElementById("totalClients");

    const activeClients = document.getElementById("activeClients");

    const totalRevenue = document.getElementById("totalRevenue");

    const premiumClients = document.getElementById("premiumClients");

    if (totalClients) {
      totalClients.innerText = clients.length;
    }

    const activeCount = clients.filter((client) => client.online).length;

    if (activeClients) {
      activeClients.innerText = activeCount;
    }

const premiumCount = clients.filter(
  (client) => client.type === "premium"
).length;

if (premiumClients) {
  premiumClients.innerText = premiumCount;
}




    const revenue = clients.reduce((total, client) => {
      return total + (parseInt(client.revenue.replace(/[^0-9]/g, "")) || 0);
    }, 0);

    if (totalRevenue) {
      totalRevenue.innerText = "$" + revenue.toLocaleString();
    }
  }
  // ===============================
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
  }); 
  
// ===============================
// 📱 6. SIDEBAR (STRICT ACTIVE LINK)
// ===============================
const setActiveLink = () => {

  const sidebarLinks =
    document.querySelectorAll(".sidebar a");

  const currentPage =
    window.location.pathname.split("/").pop();

  sidebarLinks.forEach((link) => {

    link.classList.remove("active");

    const href = link.getAttribute("href");

    if (href === currentPage) {
      link.classList.add("active");
    }

  });

};

setActiveLink();
});
