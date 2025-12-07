let events = [];
let myRegistrations = JSON.parse(localStorage.getItem('myRegistrations')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginform');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username === 'admin' && password === 'password123') {
                localStorage.setItem('loggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                document.getElementById('errorMsg').textContent = 'Invalid credentials!';
            }
        });
    }

    if (window.location.pathname.includes('dashboard.html')) {
        if (localStorage.getItem('loggedIn') !== 'true') {
            window.location.href = 'index.html';
            return;
        }

        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });

        fetch('data/events.json')
            .then(res => res.json())
            .then(data => {
                events = data;
                displayEvents();
                displayMyRegistrations();
            });
    }
});

function displayEvents() {
    const container = document.getElementById('eventsList');
    container.innerHTML = '';
    events.forEach(event => {
        const remaining = event.capacity - event.registered;
        const isFull = remaining <= 0;
        const alreadyRegistered = myRegistrations.includes(event.id);

        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <h3>${event.name}</h3>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p>${event.description}</p>
            <p><strong>Seats left:</strong> ${isFull ? '0 (Event Full)' : remaining + '/' + event.capacity}</p>
            <button class="register-btn ${isFull || alreadyRegistered ? 'registered' : ''}" 
                    data-id="${event.id}" ${isFull || alreadyRegistered ? 'disabled' : ''}>
                ${alreadyRegistered ? 'Already Registered' : isFull ? 'Event Full' : 'Register'}
            </button>
        `;
        container.appendChild(card);
    });

    // Registration handler
    document.querySelectorAll('.register-btn:not(.registered)').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventId = btn.dataset.id;
            const event = events.find(e => e.id === eventId);

            // Success banner (CR-001)
            const banner = document.createElement('div');
            banner.className = 'success-banner';
            banner.textContent = `Successfully registered for "${event.name}"!`;
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 5000);

            event.registered++;
            myRegistrations.push(eventId);
            localStorage.setItem('myRegistrations', JSON.stringify(myRegistrations));

    
            displayEvents();
            displayMyRegistrations();
        });
    });
}

function displayMyRegistrations() {
    const section = document.getElementById('myRegistrationsList');
    section.innerHTML = '';
    if (myRegistrations.length === 0) {
        section.innerHTML = '<p>You have not registered for any events yet.</p>';
        return;
    }
    myRegistrations.forEach(id => {
        const event = events.find(e => e.id === id);
        if (event) {
            const item = document.createElement('div');
            item.className = 'event-card';
            item.innerHTML = `<h4>${event.name}</h4><p>${event.date} – ${event.location}</p>`;
            section.appendChild(item);
        }
    });
}