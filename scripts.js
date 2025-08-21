// Clock functionality
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear().toString().slice(-2);
    const suffix = (date) => {
        if (date > 3 && date < 21) return 'th';
        switch (date % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    document.getElementById('date').textContent = `${day}, ${date}${suffix(date)} ${month}, '${year}`;
}
setInterval(updateClock, 60000);
updateClock();

// Background functionality
function getRandomBackground() {
    const videoBackgroundsDir = 'videobackgrounds/small/';
    const videos = [];
    fetch(videoBackgroundsDir)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            doc.querySelectorAll('a').forEach(link => {
                const href = link.getAttribute('href');
                // Remove leading slash if present
                const cleanHref = href.startsWith('/') ? href.slice(1) : href;
                videos.push(`${videoBackgroundsDir}${cleanHref}`);
            });
            const randomVideo = videos[Math.floor(Math.random() * videos.length)];
            const videoElement = document.createElement('video');
            videoElement.src = randomVideo;
            videoElement.autoplay = true;
            videoElement.loop = true;
            videoElement.muted = true;
            videoElement.style.position = 'fixed';
            videoElement.style.top = '0';
            videoElement.style.left = '0';
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            videoElement.style.zIndex = '-1';
            document.body.appendChild(videoElement);
        });
}
getRandomBackground();

// Search and overlay functionality
const overlay = document.getElementById('overlay');
const searchInput = document.getElementById('searchInput');
const links = document.getElementById('links');
let typingStarted = false;

// Adjust textarea height dynamically based on content
searchInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;
});

// Only show overlay when user types
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        overlay.classList.remove('active');
        searchInput.value = '';
        typingStarted = false;
    } else if (event.key.length === 1 && !overlay.classList.contains('active')) {
        overlay.classList.add('active');
        searchInput.focus();
        searchInput.value = '';
        typingStarted = true;
    } else if (event.key.length === 1) {
        typingStarted = true;
    }
});

searchInput.addEventListener('input', function(event) {
    if (!overlay.classList.contains('active')) {
        overlay.classList.add('active');
    }
    typingStarted = true;
});

document.getElementById('searchForm').addEventListener('submit', function(event) {
    const query = searchInput.value.trim();
    if (!query) {
        event.preventDefault();
        overlay.classList.remove('active');
        typingStarted = false;
    }
});

// Ensure pressing Enter in the textarea submits the form
searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.getElementById('searchForm').submit();
    }
});

window.onload = function() {
    searchInput.focus();
};

// Swap icon image on hover
document.querySelectorAll('.icon-img').forEach(img => {
    const originalSrc = img.src;
    const hoverSrc = img.getAttribute('data-hover');
    img.addEventListener('mouseenter', () => {
        img.src = hoverSrc;
    });
    img.addEventListener('mouseleave', () => {
        img.src = originalSrc;
    });
});
