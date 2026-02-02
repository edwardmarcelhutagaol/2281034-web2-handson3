function setCookie(name, value, options = {}) {
    let cookieString =
        `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // Max-Age
    if (options.maxAge !== undefined && options.maxAge !== null) {
        cookieString += `; max-age=${options.maxAge}`;
    }

    // Path
    cookieString += `; path=${options.path || '/'}`;

    // Secure flag
    if (options.secure) {
        cookieString += '; secure';
    }

    document.cookie = cookieString;
    console.log('Cookie dibuat:', cookieString);
}

function getCookie(name) {
    if (!document.cookie) return null;

    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const index = cookie.indexOf('=');
        const cookieName = cookie.substring(0, index);
        const cookieValue = cookie.substring(index + 1);

        if (decodeURIComponent(cookieName) === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
}

function deleteCookie(name) {
    document.cookie =
        `${encodeURIComponent(name)}=; max-age=0; path=/`;
    console.log('Cookie dihapus:', name);
}

function getAllCookies() {
    const cookies = {};

    if (!document.cookie) return cookies;

    document.cookie.split('; ').forEach(cookie => {
        const index = cookie.indexOf('=');
        const name = cookie.substring(0, index);
        const value = cookie.substring(index + 1);

        cookies[decodeURIComponent(name)] =
            decodeURIComponent(value);
    });

    return cookies;
}



function initVisitCounter() {
    let visitCount = getCookie('visitCount');

    if (visitCount === null) {
        visitCount = 1;
    } else {
        visitCount = parseInt(visitCount, 10) || 0;
        visitCount += 1;
    }

    setCookie('visitCount', visitCount, {
        maxAge: 604800 // 7 hari
    });

    updateCounterDisplay(visitCount);
}

function updateCounterDisplay(count) {
    document.getElementById('visitCount').textContent = count;
    document.getElementById('visitText').textContent = count;
}

function resetCounter() {
    deleteCookie('visitCount');
    updateCounterDisplay(0);
    updateCookieInspector();

    alert('Counter direset! Refresh halaman untuk mulai dari 1.');
}



function updateCookieInspector() {
    const cookieList = document.getElementById('cookieList');
    const cookies = getAllCookies();
    const names = Object.keys(cookies);

    if (names.length === 0) {
        cookieList.innerHTML =
            '<p class="placeholder">Belum ada cookie...</p>';
        return;
    }

    let html = '';

    names.forEach(name => {
        html += `
            <div class="cookie-item">
                <span class="cookie-name">${name}</span>:
                <span class="cookie-value">${cookies[name]}</span>
                <button onclick="removeCookie('${name}')"
                    style="float:right;padding:2px 8px;cursor:pointer;">
                    x
                </button>
            </div>
        `;
    });

    cookieList.innerHTML = html;
}

function removeCookie(name) {
    deleteCookie(name);
    updateCookieInspector();
}



function handleCookieForm(event) {
    event.preventDefault();

    const name = document.getElementById('cookieName').value.trim();
    const value = document.getElementById('cookieValue').value.trim();
    const maxAgeInput = document.getElementById('maxAge').value;
    const path = document.getElementById('path').value || '/';
    const secure = document.getElementById('secureFlag').checked;

    if (!name || !value) {
        alert('Nama dan nilai cookie wajib diisi.');
        return;
    }

    const options = { path };

    if (maxAgeInput !== '') {
        const parsed = parseInt(maxAgeInput, 10);
        if (!isNaN(parsed)) {
            options.maxAge = parsed;
        }
    }

    if (secure) options.secure = true;

    setCookie(name, value, options);
    updateCookieInspector();

    event.target.reset();
    document.getElementById('path').value = '/';

    alert(`Cookie "${name}" berhasil dibuat!`);
}


document.addEventListener('DOMContentLoaded', () => {
    initVisitCounter();
    updateCookieInspector();

    document
        .getElementById('resetBtn')
        .addEventListener('click', resetCounter);

    document
        .getElementById('cookieForm')
        .addEventListener('submit', handleCookieForm);

    // Update inspector otomatis
    setInterval(updateCookieInspector, 2000);
});
