// Init AOS
AOS.init({
    duration: 1000,
    easing: 'ease-out-quart',
    once: false,
    mirror: true
});

// Welcome Screen & Audio Handling
const welcomeScreen = document.getElementById('welcome-screen');
const openBtn = document.getElementById('btn-open');
const audio = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
const musicIcon = musicBtn.querySelector('i');
let isPlaying = false;

openBtn.addEventListener('click', () => {
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        audio.play().catch(e => console.log("Audio play blocked", e));
        isPlaying = true;
    }, 800);
});

musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        musicIcon.classList.remove('fa-spin');
        musicIcon.classList.remove('fa-compact-disc');
        musicIcon.classList.add('fa-volume-xmark');
    } else {
        audio.play();
        musicIcon.classList.add('fa-spin');
        musicIcon.classList.add('fa-compact-disc');
        musicIcon.classList.remove('fa-volume-xmark');
    }
    isPlaying = !isPlaying;
});

// --- OPTIMIZED CURSOR LOGIC (Sangat Responsif & Ringan) ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Hanya aktifkan di layar besar (Desktop)
if (window.matchMedia("(min-width: 769px)").matches) {
    cursorDot.style.display = "block";
    cursorOutline.style.display = "block";

    window.addEventListener("mousemove", function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Gerakkan Dot (Instant)
        cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;
        
        // Gerakkan Outline (Sedikit delay animasi CSS, tapi posisi instant via JS biar tidak lag)
        cursorOutline.animate({
            transform: `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`
        }, { duration: 500, fill: "forwards" });
    });

    // Efek Hover pada Link/Button
    document.querySelectorAll('a, button, .timeline-item, .couple-card, .bank-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

// Countdown Timer
const weddingDate = new Date("Jan 09, 2027 08:00:00").getTime();

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? '0' + days : days;
    document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;

    if (distance < 0) {
        clearInterval(countdown);
        document.getElementById("countdown").innerHTML = "The Wedding has Started!";
    }
}, 1000);

// Copy to Clipboard
function copyText(text) {
    navigator.clipboard.writeText(text);
    alert("Nomor berhasil disalin: " + text);
}

// Nav Active State
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.glass-nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                let target = document.querySelector('.glass-nav a[href*=' + id + ']');
                if(target) target.classList.add('active');
            });
        }
    });
};

// RSVP Form (Google Sheets)
const scriptURL = 'https://script.google.com/macros/s/AKfycbxZHoDpQ-JJnpplwbDh5N8gJwJ60dp6ZRbXsvM8i0n4UQF0r7qPzdeYoLBStef8sRIR/exec'
const form = document.getElementById('rsvpForm')
const btn = document.getElementById('submitBtn')

form.addEventListener('submit', e => {
    e.preventDefault()
    
    const originalText = btn.innerHTML;
    btn.disabled = true
    btn.innerHTML = 'Mengirim <i class="fa-solid fa-spinner fa-spin"></i>'

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            btn.disabled = false
            btn.innerHTML = originalText
            alert('Terima kasih! Konfirmasi kehadiran Anda telah tersimpan.')
            form.reset()
        })
        .catch(error => {
            btn.disabled = false
            btn.innerHTML = originalText
            alert('Maaf, terjadi kesalahan saat mengirim data.')
            console.error('Error!', error.message)
        })
})