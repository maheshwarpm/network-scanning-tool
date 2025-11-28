// ------------------------------
// Helper function
// ------------------------------
function $(id) {
    return document.querySelector(id);
}

// =====================================================
//  DARK MODE TOGGLE
// =====================================================
const themeToggle = $("#themeToggle");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        // Save theme
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
}

// =====================================================
// SHOW / HIDE PASSWORD (LOGIN PAGE)
// =====================================================
const togglePassword = $("#togglePassword");
const passwordField = $("#password");

if (togglePassword && passwordField) {
    togglePassword.addEventListener("click", () => {
        passwordField.type = passwordField.type === "password" ? "text" : "password";
    });
}

// =====================================================
// SIGNUP PAGE LOGIC
// =====================================================
const signupForm = $("#signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = $("#name").value.trim();
        const email = $("#email").value.trim();
        const mobile = $("#mobile").value.trim();
        const password = $("#regPass").value.trim();

        if (!/^[0-9]{10}$/.test(mobile)) {
            alert("Mobile number must be 10 digits.");
            return;
        }

        // Save user data
        const userData = { name, email, mobile, password };
        localStorage.setItem("nsd_user", JSON.stringify(userData));

        alert("Account created successfully!");
        window.location.href = "login.html";
    });
}

// =====================================================
// LOGIN PAGE LOGIC
// =====================================================
const loginForm = $("#loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const identifier = $("#identifier").value.trim();
        const password = $("#password").value.trim();

        if (!identifier || !password) {
            alert("Enter all fields.");
            return;
        }

        const isEmail = identifier.includes("@");
        const isMobile = /^[0-9]{10}$/.test(identifier);

        if (!isEmail && !isMobile) {
            alert("Enter valid Email or 10-digit Mobile.");
            return;
        }

        // Load registered user
        const saved = JSON.parse(localStorage.getItem("nsd_user"));

        if (!saved) {
            alert("No account found. Please sign up first.");
            return;
        }

        if ((saved.email === identifier || saved.mobile === identifier) && saved.password === password) {
            localStorage.setItem("nsd_isLoggedIn", "true");
            localStorage.setItem("nsd_identifier", identifier);
            localStorage.setItem("nsd_name", saved.name);

            window.location.href = "dashboard.html";
        } else {
            alert("Incorrect login details.");
        }
    });
}

// =====================================================
// FORGOT PASSWORD PAGE (DEMO)
// =====================================================
const forgotForm = $("#forgotForm");

if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = $("#forgotId").value.trim();

        alert("A password reset link (demo) has been sent to: " + id);
        window.location.href = "login.html";
    });
}

// =====================================================
// OTP LOGIN PAGE
// =====================================================
const sendOtpBtn = $("#sendOtpBtn");
const verifyOtpBtn = $("#verifyOtpBtn");

if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", () => {
        const mobile = $("#otpMobile").value.trim();

        if (!/^[0-9]{10}$/.test(mobile)) {
            alert("Enter a valid 10-digit mobile number.");
            return;
        }

        // Demo OTP
        alert("OTP Sent (demo): 123456");
        localStorage.setItem("otp_mobile", mobile);
    });
}

if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener("click", () => {
        const otp = $("#otpCode").value.trim();

        if (otp === "123456") {
            localStorage.setItem("nsd_isLoggedIn", "true");
            localStorage.setItem("nsd_identifier", localStorage.getItem("otp_mobile"));
            localStorage.setItem("nsd_name", "User");

            alert("OTP Verified!");
            window.location.href = "dashboard.html";
        } else {
            alert("Incorrect OTP");
        }
    });
}

// =====================================================
// DASHBOARD PAGE
// =====================================================
const userNameDom = $("#userName");

if (userNameDom) {
    const name = localStorage.getItem("nsd_name") || "User";
    userNameDom.textContent = name;
}

// Logout Button
const logoutBtn = $("#logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("nsd_isLoggedIn");
        localStorage.removeItem("nsd_identifier");
        localStorage.removeItem("nsd_name");

        window.location.href = "login.html";
    });
}

// =====================================================
// SCANNER PAGE LOGIC
// =====================================================

const scannerUser = $("#scannerUser");

if (scannerUser) {
    scannerUser.textContent = localStorage.getItem("nsd_identifier") || "User";
}

const startScanBtn = $("#startScanBtn");
const resultsBox = $("#results");
const statusBar = $("#statusBar");

if (startScanBtn) {
    startScanBtn.addEventListener("click", async () => {

        const targetIp = $("#targetIp").value.trim();
        const portsInput = $("#ports").value.trim();

        if (!targetIp) {
            alert("Enter target IP or domain.");
            return;
        }

        if (!portsInput) {
            alert("Enter port(s).");
            return;
        }

        const ports = portsInput.split(",").map(p => p.trim()).filter(p => p.length);

        resultsBox.value = "";
        statusBar.textContent = "Scanning... (simulation)";

        for (const port of ports) {
            await new Promise(res => setTimeout(res, 600));

            const open = Math.random() > 0.4;
            const vuln = open ? getVuln(port) : "";

            resultsBox.value += `[${new Date().toLocaleTimeString()}] Port ${port} - ${open ? "OPEN" : "CLOSED"} ${vuln}\n`;
            resultsBox.scrollTop = resultsBox.scrollHeight;
        }

        statusBar.textContent = "Scan complete (simulated).";
    });
}

// Generate simple vulnerability hints
function getVuln(port) {
    switch (parseInt(port)) {
        case 21: return "- FTP open: Use SFTP.";
        case 22: return "- SSH open: Enable key authentication.";
        case 80: return "- HTTP open: Use HTTPS.";
        case 443: return "- HTTPS: Keep TLS updated.";
        case 3389: return "- RDP: Enable MFA.";
        default: return "- Review this service.";
    }
}
