document.addEventListener('DOMContentLoaded', ()=>{
    const loginform=document.getElementById('loginform')
    if(loginform){
        loginform.addEventListener('submit',(e)=>{
            e.preventDefault();
            const username=document.getElementById('username').value;
            const password=document.getElementById('password').value;
            if(username==='admin' && password==='123'){
                localStorage.setItem('loggedIn','true');
                window.location.href='dashboard.html';
            }else{
                document.getElementById('errorMsg').textContent='Invalid credentials';
            }
        })
    }
    if(window.location.pathname.includes('dashboard.html')){
        if(localStorage.getItem('loggedIn')!=='true'){
            window.location.href='index.html';
            return;
        }
        document.getElementById('logoutBtn').addEventListener('click',()=>{
            localStorage.removeItem('loggedIn');
            window.location.href='index.html';
        }
    )
    fetch('events.json')
    .then(res=>res.json())
    .then(data=>{
        const continer=document.getElementById('eventsList');
        data.forEach(event=>{
            const card=document.createElement('div');
            card.className='event-card';
            card.innerHTML=`
                <h3>${event.name}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p>${event.description}</p>
                <button class="register-btn" data-id="${event.id}">Register</button>
            `;
            continer.appendChild(card);
        })
    document.querySelectorAll('.register-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
            const eventId=btn.dataset.id;
            fetch('registration.json')
            .then(res=>res.json())
            .then(data=>{
                if(!data.registrations.includes(eventId)){
                    data.registrations.push(eventId);
                    const banner = document.createElement('div');
                    banner.className = 'success-banner';
                    banner.textContent = 'Successfully registered for the event!';
                    document.body.appendChild(banner);
                    setTimeout(() => banner.remove(), 5000);
                    btn.textContent='Registered';
                    btn.classList.add('registered');
                    btn.disabled=true;
                }
            })
        })
    })
    })
    }
})