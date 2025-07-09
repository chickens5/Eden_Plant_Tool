document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ React + Flask scripts.js loaded");

    // 🌿 Register User
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                document.getElementById("register-status").innerText = data.message;

                if (response.ok) {
                    alert("✅ Registered successfully! Redirecting...");
                    window.location.href = "/";
                } else {
                    alert(`⚠️ Error: ${data.error}`);
                }
            } catch (error) {
                console.error("❌ Error during registration:", error);
                alert("⚠️ Could not connect to the server.");
            }
        });
    }
});
