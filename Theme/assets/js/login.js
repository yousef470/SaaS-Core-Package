// 1️⃣ Fake DB - Ensure fresh data
let users = JSON.parse(localStorage.getItem("users")) || [];

const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
const loginForm = document.querySelector(".form-box.login form");
const registerForm = document.querySelector(".form-box.register form");

// Switch Forms
registerBtn?.addEventListener("click", () => container.classList.add("active"));
loginBtn?.addEventListener("click", () => container.classList.remove("active"));

// 2️⃣ TOGGLE PASSWORD
document.querySelectorAll(".fa-eye, .fa-eye-slash").forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", function () {
    const passwordInput = this.closest(
      ".input-field, .input-box",
    )?.querySelector("input");
    if (!passwordInput) return;
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      this.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      passwordInput.type = "password";
      this.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
});

// 3️⃣ REGISTER SYSTEM
registerForm?.addEventListener("submit", (e) => {
  e.preventDefault(); // إعادة قراءة المستخدمين لضمان عدم التضارب
  users = JSON.parse(localStorage.getItem("users")) || [];

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (users.find((u) => u.email === email)) {
    alert("Account already exists!");
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users)); // ✅ التخزين بالـ Key الموحد لبراند SaaS-Core

  localStorage.setItem("userSaasCoreName", username);
  localStorage.setItem("userSaasCoreEmail", email);

  alert("Account created successfully!");
  window.location.href = "index.html";
});

// 4️⃣ LOGIN SYSTEM
loginForm?.addEventListener("submit", (e) => {
  e.preventDefault(); // إعادة قراءة المستخدمين من الـ storage
  users = JSON.parse(localStorage.getItem("users")) || [];

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const userFound = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!userFound) {
    alert("Invalid username or password");
    return;
  } // ✅ التخزين بالـ Key الموحد لبراند SaaS-Core

  localStorage.setItem("userSaasCoreName", userFound.username);
  localStorage.setItem("userSaasCoreEmail", userFound.email);

  window.location.href = "index.html";
});

// 5️⃣ PASSWORD STRENGTH
const passwordInput = document.getElementById("registerPassword");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

if (passwordInput && strengthBar && strengthText) {
  passwordInput.addEventListener("input", () => {
    const val = passwordInput.value;
    let strength = 0;
    if (val.length > 6) strength++;
    if (val.match(/[A-Z]/) && val.match(/[0-9]/)) strength++;
    if (val.match(/[^A-Za-z0-9]/)) strength++;

    strengthBar.className = "strength-bar";
    if (val === "") {
      strengthText.innerText = "";
    } else if (strength === 1) {
      strengthBar.classList.add("weak");
      strengthText.innerText = "Weak";
    } else if (strength === 2) {
      strengthBar.classList.add("medium");
      strengthText.innerText = "Medium";
    } else if (strength === 3) {
      strengthBar.classList.add("strong");
      strengthText.innerText = "Strong";
    }
  });
}
