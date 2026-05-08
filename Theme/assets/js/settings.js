/* ==========================================
   SELECTORS
========================================== */
const darkToggle = document.getElementById("darkModeToggle");
const rtlToggle = document.getElementById("rtlToggle");
const saveBtn = document.getElementById("saveSettings");

const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const profileInput = document.getElementById("profileImage");
const previewImage = document.getElementById("previewImage");

const toast = document.getElementById("toast");

/* ==========================================
   INITIALIZE & LOAD DATA
========================================== */
document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  loadUserInfo();
});

function loadSettings() {
  // Theme
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    darkToggle.checked = true;
  } // Language

  const savedLang = localStorage.getItem("lang") || "en";
  document.body.dir = savedLang === "ar" ? "rtl" : "ltr";
  rtlToggle.checked = savedLang === "ar"; // User Data

  usernameInput.value = localStorage.getItem("userSaasName") || "";
  emailInput.value = localStorage.getItem("userSaasEmail") || ""; // Profile Image

  const savedImage = localStorage.getItem("profileImage");
  previewImage.src = savedImage
    ? savedImage
    : "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff";
}

/* ==========================================
   SAVE SETTINGS
========================================== */
saveBtn.addEventListener("click", () => {
  const originalContent = saveBtn.innerHTML;

  saveBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...`;
  saveBtn.style.opacity = "0.7";
  saveBtn.style.pointerEvents = "none";

  setTimeout(() => {
    // Theme
    if (darkToggle.checked) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } // Language

    if (rtlToggle.checked) {
      document.body.dir = "rtl";
      localStorage.setItem("lang", "ar");
    } else {
      document.body.dir = "ltr";
      localStorage.setItem("lang", "en");
    } // Save user data (🔥 FIXED)

    localStorage.setItem("userSaasName", usernameInput.value);
    localStorage.setItem("userSaasEmail", emailInput.value);

    saveBtn.innerHTML = `Saved <i class="fa-solid fa-check"></i>`;
    saveBtn.style.background = "#10b981";

    showToast("Settings updated successfully ✨");

    setTimeout(() => {
      saveBtn.innerHTML = originalContent;
      saveBtn.style.opacity = "1";
      saveBtn.style.pointerEvents = "all";
      saveBtn.style.background = "";
    }, 2000);
  }, 800);
});

/* ==========================================
   PROFILE IMAGE
========================================== */
profileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showToast("Max size 2MB ❌");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const base64 = event.target.result;
    previewImage.src = base64;
    localStorage.setItem("profileImage", base64);
    showToast("Image updated 📸");
  };

  reader.readAsDataURL(file);
});

/* ==========================================
   USER INFO DISPLAY (🔥 مهم)
========================================== */
function loadUserInfo() {
  const username = localStorage.getItem("userSaasName");
  const email = localStorage.getItem("userSaasEmail");

  const userNameEl = document.getElementById("settings-username");
  const userEmailEl = document.getElementById("settings-email");

  if (username && userNameEl) userNameEl.innerText = username;
  if (email && userEmailEl) userEmailEl.innerText = email;
}

/* ==========================================
   CHANGE PASSWORD
========================================== */
document.getElementById("changePasswordBtn").addEventListener("click", () => {
  const current = document.getElementById("currentPassword").value;
  const newPass = document.getElementById("newPassword").value;
  const confirm = document.getElementById("confirmNewPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const username = localStorage.getItem("userSaasName");

  const userIndex = users.findIndex((u) => u.username === username);

  if (userIndex === -1) return alert("User not found ❌");

  if (users[userIndex].password !== current) return alert("Wrong password ❌");

  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!pattern.test(newPass)) return alert("Weak password ❌");

  if (newPass !== confirm) return alert("Passwords not match ❌");

  users[userIndex].password = newPass;
  localStorage.setItem("users", JSON.stringify(users));

  alert("Password updated ✅");
});

/* ==========================================
   NOTIFICATIONS
========================================== */
const notificationsToggle = document.getElementById("notificationsToggle");

if (localStorage.getItem("notifications") === "true") {
  notificationsToggle.checked = true;
}

notificationsToggle.addEventListener("change", () => {
  localStorage.setItem("notifications", notificationsToggle.checked);
});

/* ==========================================
   TOAST
========================================== */
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* ==========================================
   PASSWORD TOGGLE
========================================== */
document.querySelectorAll(".toggle-password").forEach((item) => {
  item.addEventListener("click", function () {
    const input = this.parentElement.querySelector(".password-input");

    if (input.type === "password") {
      input.type = "text";
      this.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      this.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
});
