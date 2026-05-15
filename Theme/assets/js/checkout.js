// ==========================
// THEME TOGGLE
// ==========================
const themeBtn = document.getElementById("themeToggle");

themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  
  // توحيد الاسم ليكون "theme"
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
};

// LOAD THEME
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// ==========================
// LANGUAGE SYSTEM
// ==========================
const langBtn = document.getElementById("langToggle");
// تأكد من استخدام اسم موحد "language"
let currentLang = localStorage.getItem("language") || "en";

function applyLanguage(lang) {
  document.documentElement.lang = lang;

  if (lang === "ar") {
    document.body.style.direction = "rtl";
    langBtn.innerText = "AR";
  } else {
    document.body.style.direction = "ltr";
    langBtn.innerText = "EN";
  }

  document.querySelectorAll("[data-en]").forEach((element) => {
    const text = element.getAttribute(`data-${lang}`);
    if (text) element.innerText = text;
  });

  // حفظ اللغة باسم موحد
  localStorage.setItem("language", lang);
}

applyLanguage(currentLang);

langBtn.onclick = () => {
  currentLang = currentLang === "en" ? "ar" : "en";
  applyLanguage(currentLang);
};
// ==========================
// GET PLAN FROM URL
// ==========================
const params = new URLSearchParams(window.location.search);

const plan = params.get("plan");

const planName = document.getElementById("planName");
const planPrice = document.getElementById("planPrice");
const totalPrice = document.getElementById("totalPrice");

// STARTER
if (plan === "starter") {

  if(currentLang === "ar"){
    planName.innerText = "الخطة الأساسية";
  }else{
    planName.innerText = "Starter Plan";
  }

  planPrice.innerText = "$19";
  totalPrice.innerText = "$19";
}

// PRO
if (plan === "pro") {

  if(currentLang === "ar"){
    planName.innerText = "الخطة الاحترافية";
  }else{
    planName.innerText = "Pro Plan";
  }

  planPrice.innerText = "$49";
  totalPrice.innerText = "$49";
}

// ENTERPRISE
if (plan === "enterprise") {

  if(currentLang === "ar"){
    planName.innerText = "خطة الشركات";
    totalPrice.innerText = "تواصل معنا";
  }else{
    planName.innerText = "Enterprise";
    totalPrice.innerText = "Contact Us";
  }

  planPrice.innerText = "Custom";
}

// ==========================
// PAYMENT MODAL
// ==========================
const checkoutBtn = document.querySelector(".checkout-btn");

const paymentModal =
  document.getElementById("paymentModal");

const closeModal =
  document.getElementById("closeModal");

const payNowBtn =
  document.getElementById("payNowBtn");

// OPEN
checkoutBtn.onclick = () => {

  paymentModal.classList.add("active");

};

// CLOSE
closeModal.onclick = () => {

  paymentModal.classList.remove("active");

};


// PAY
payNowBtn.onclick = () => {
  // بنجيب اسم الخطة المعروض حالياً في الصفحة
  const selectedPlanName = document.getElementById("planName").innerText;
  const selectedPlanPrice = document.getElementById("planPrice").innerText;

  // بنسيفهم في المتصفح عشان صفحة النجاح تشوفهم
  localStorage.setItem("finalPlanName", selectedPlanName);
  localStorage.setItem("finalPlanPrice", selectedPlanPrice);

  window.location.href = "success.html";
};

// ==========================
// AUTO-FILL USER DATA
// ==========================
function fillUserData() {
    // جلب البيانات بالظبط زي ما هي متخزنة في الـ Settings
    const name = localStorage.getItem("userNexoraName");
    const email = localStorage.getItem("userNexoraEmail");
    const company = localStorage.getItem("companyName");

    // الحصول على عناصر الـ Input في صفحة الـ Checkout
    const nameField = document.getElementById("checkoutName");
    const emailField = document.getElementById("checkoutEmail");
    const companyField = document.getElementById("checkoutCompany");

    // وضع القيم في الحقول لو كانت موجودة في الـ Storage
    if (name && nameField) {
        nameField.value = name;
    }
    
    if (email && emailField) {
        emailField.value = email;
    }
    
    if (company && companyField) {
        companyField.value = company;
    }
}

// تشغيل الدالة بمجرد تحميل الصفحة
document.addEventListener("DOMContentLoaded", fillUserData);

// ==========================
// PAYMENT METHOD TOGGLE
// ==========================
const paymentMethods = document.querySelectorAll('.payment');
const checkoutMainBtn = document.querySelector(".checkout-btn");
let selectedMethod = 'card'; // الافتراضي هو البطاقة

paymentMethods.forEach(method => {
    method.onclick = () => {
        // تغيير الشكل النشط
        paymentMethods.forEach(m => m.classList.remove('active'));
        method.classList.add('active');

        // تحديد الطريقة المختارة
        if (method.innerText.includes('PayPal') || method.innerText.includes('بايبال')) {
            selectedMethod = 'paypal';
            // تغيير نص الزرار الرئيسي ليعكس الاختيار
            checkoutMainBtn.innerText = currentLang === 'ar' ? "الدفع عبر PayPal" : "Pay with PayPal";
        } else {
            selectedMethod = 'card';
            checkoutMainBtn.innerText = currentLang === 'ar' ? "إتمام الدفع" : "Complete Checkout";
        }
    };
});

// تعديل وظيفة الزرار الرئيسي عند الضغط
checkoutMainBtn.onclick = () => {
    if (selectedMethod === 'card') {
        // لو اختار بطاقة يفتح المودال اللي إنت عامله
        paymentModal.classList.add("active");
    } else {
        // لو اختار بايبال يحوله لصفحة باي بال (أو يفتح نافذة بايبال)
        // هنا ممكن تحطه لينك صفحة تانية أو تشغل الـ Smart Buttons
        window.location.href = "https://www.paypal.com/checkoutnow"; 
        // نصيحة: يفضل هنا تربط الـ SDK اللي اتكلمنا عنه قبل كدة
    }
};

