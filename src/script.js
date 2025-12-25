let events = [];
const myRegistrationsKey = "myRegistrations";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginform");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      const users = getUsers();
      const matched = users.find(
        (u) => u.username === username && u.password === password
      );

      if ((username === "admin" && password === "123") || matched) {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", username);
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("errorMsg").textContent =
          "Invalid credentials!";
      }
    });
    return;
  }

  const signupForm = document.getElementById("signupform");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("su_username").value.trim();
      const password = document.getElementById("su_password").value;
      const confirm = document.getElementById("su_confirm").value;
      const errorEl = document.getElementById("signupError");

      if (!username || !password) {
        errorEl.textContent = "Please fill in all fields.";
        return;
      }
      if (password !== confirm) {
        errorEl.textContent = "Passwords do not match.";
        return;
      }

      const users = getUsers();
      if (
        users.some((u) => u.username.toLowerCase() === username.toLowerCase())
      ) {
        errorEl.textContent = "Username already exists.";
        return;
      }

      users.push({ username, password });
      localStorage.setItem("sersUsers", JSON.stringify(users));

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", username);
      window.location.href = "dashboard.html";
    });
    return;
  }

  if (!window.location.pathname.includes("dashboard.html")) return;

  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
    return;
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      localStorage.removeItem(myRegistrationsKey);
      window.location.href = "index.html";
    });
  }

  fetch("events.json")
    .then((res) => res.json())
    .then((data) => {
      events = data;
      displayEvents();
      displayMyRegistrations();
    })
    .catch((err) => console.error("Error loading events:", err));

  function displayEvents() {
    const container = document.getElementById("eventsList");
    if (!container) return;
    container.innerHTML = "";

    events.forEach((event) => {
      const remaining = event.capacity - event.registered;
      const isFull = remaining <= 0;

      const alreadyRegistered = getMyRegistrations().includes(event.id);

      const card = document.createElement("div");
      card.className = "event-card";
      card.innerHTML = `
                <h3>${event.name}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p>${event.description}</p>
                <p class="seats ${isFull ? "full" : ""}">
                <strong>Seats Available:</strong> ${
                  isFull ? "Full" : remaining + "/" + event.capacity
                }
                </p>
                <button class="register-btn ${
                  isFull || alreadyRegistered ? "registered" : ""
                }" 
                        data-id="${event.id}" ${
        isFull || alreadyRegistered ? "disabled" : ""
      }>
                    ${
                      alreadyRegistered
                        ? "Already Registered"
                        : isFull
                        ? "event full"
                        : "Register"
                    }
                </button>
            `;
      container.appendChild(card);
    });

    document
      .querySelectorAll(".register-btn:not(.registered)")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const eventId = btn.dataset.id;
          const event = events.find((e) => e.id === eventId);

          const banner = document.createElement("div");
          banner.className = "success-banner";
          banner.textContent = `Successfully registered for "${event.name}"!`;
          document.body.appendChild(banner);
          setTimeout(() => banner.remove(), 5000);
          event.registered += 1;
          const myRegs = getMyRegistrations();
          if (!myRegs.includes(eventId)) {
            myRegs.push(eventId);
            localStorage.setItem(myRegistrationsKey, JSON.stringify(myRegs));
          }

          btn.textContent = "Already Registered";
          btn.classList.add("registered");
          btn.disabled = true;

          displayEvents();
          displayMyRegistrations();
        });
      });
  }

  function displayMyRegistrations() {
    const container = document.getElementById("myRegistrationsList");
    if (!container) return;

    const myRegs = getMyRegistrations();

    if (myRegs.length === 0) {
      container.innerHTML =
        '<p style="color:white;">You have not registered for any events yet.</p>';
      return;
    }

    container.innerHTML = "";
    myRegs.forEach((id) => {
      const event = events.find((e) => e.id === id);
      if (event) {
        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
                    <h3>${event.name}</h3>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Location:</strong> ${event.location}</p>
                `;
        container.appendChild(card);
      }
    });
  }

  function getMyRegistrations() {
    return JSON.parse(localStorage.getItem(myRegistrationsKey) || "[]");
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem("sersUsers") || "[]");
  }
});
