// ========== متغيرات PocketBase ==========
let pb;
try {
    pb = new PocketBase('http://127.0.0.1:8090');
    pb.health.check().then(() => {
        console.log('✅ PocketBase connected');
    }).catch(err => {
        console.log('❌ PocketBase error:', err);
    });
} catch(e) {
    console.log('⚠️ PocketBase not loaded yet');
}

let sliderItems = [
    { type: 'image', url: 'https://picsum.photos/id/1015/300/200' },
    { type: 'image', url: 'https://picsum.photos/id/104/300/200' },
    { type: 'image', url: 'https://picsum.photos/id/106/300/200' },
    { type: 'image', url: 'https://picsum.photos/id/107/300/200' },
    { type: 'image', url: 'https://picsum.photos/id/116/300/200' },
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
];

let discoverData = [
    { type: 'big', contentUrl: 'https://picsum.photos/id/15/600/300', labelAr: 'منتجع الجبل', labelEn: 'Mountain Resort' },
    { type: 'small', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', labelAr: 'فيديو استكشافي 1', labelEn: 'Exploration Video 1' },
    { type: 'small', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', labelAr: 'فيديو استكشافي 2', labelEn: 'Exploration Video 2' },
    { type: 'big', contentUrl: 'https://picsum.photos/id/96/600/300', labelAr: 'شلالات بونشاك', labelEn: 'Puncak Waterfalls' },
    { type: 'small', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', labelAr: 'فيديو 3', labelEn: 'Video 3' },
    { type: 'small', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', labelAr: 'فيديو 4', labelEn: 'Video 4' },
    { type: 'big', contentUrl: 'https://picsum.photos/id/29/600/300', labelAr: 'مزارع الشاي', labelEn: 'Tea Plantations' },
    { type: 'small', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', labelAr: 'فيديو 5', labelEn: 'Video 5' },
    { type: 'small', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', labelAr: 'فيديو 6', labelEn: 'Video 6' }
];

let bookings = [];
const ADMIN_PASSWORD = "admin123";
let isArabic = true;
let isAdminLoggedIn = false;

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function loadSavedData() {
    let savedSlider = localStorage.getItem('sliderItems');
    if(savedSlider) sliderItems = JSON.parse(savedSlider);
    let savedDiscover = localStorage.getItem('discoverData');
    if(savedDiscover) discoverData = JSON.parse(savedDiscover);
    let savedBookings = localStorage.getItem('bookings');
    if(savedBookings) bookings = JSON.parse(savedBookings);
    let savedAdmin = localStorage.getItem('isAdminLoggedIn');
    if(savedAdmin === 'true') isAdminLoggedIn = true;
}

function saveData() {
    localStorage.setItem('sliderItems', JSON.stringify(sliderItems));
    localStorage.setItem('discoverData', JSON.stringify(discoverData));
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function changeLanguage() {
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        if (isArabic) el.innerText = el.getAttribute('data-ar');
        else el.innerText = el.getAttribute('data-en');
    });
    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach(el => {
        if (isArabic) el.placeholder = el.getAttribute('data-ar-placeholder');
        else el.placeholder = el.getAttribute('data-en-placeholder');
    });
    document.querySelectorAll('select option').forEach(option => {
        if (option.hasAttribute('data-ar')) {
            if (isArabic) option.text = option.getAttribute('data-ar');
            else option.text = option.getAttribute('data-en');
        }
    });
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.innerText = isArabic ? 'English' : 'العربية';
    document.body.style.direction = isArabic ? 'rtl' : 'ltr';
    const promoText = document.querySelector('.promo-marquee span');
    if (promoText) promoText.innerText = isArabic ? promoText.getAttribute('data-ar') : promoText.getAttribute('data-en');
    document.querySelectorAll('#currencyType option').forEach(option => {
        if (isArabic) option.text = option.getAttribute('data-ar');
        else option.text = option.getAttribute('data-en');
    });
    renderDiscover();
    if (bookings.length === 0) {
        const bookingsDiv = document.getElementById('bookingsList');
        if (bookingsDiv) bookingsDiv.innerHTML = isArabic ? 'لا توجد حجوزات بعد' : 'No bookings yet';
    } else {
        renderBookings();
    }
    renderProfileBookings();
    loadFavorites();
    const profileName = document.getElementById('profileName');
    if (profileName) {
        let savedName = localStorage.getItem('userFullName');
        profileName.innerText = savedName || (isArabic ? 'أحمد محمد' : 'Ahmed Mohamed');
    }
}

function renderSlider() {
    let html = '';
    sliderItems.forEach((item) => {
        if (item.type === 'image') {
            html += `<div class="slider-item"><img src="${item.url}"></div>`;
        } else {
            html += `<div class="slider-item"><video src="${item.url}" muted></video></div>`;
        }
    });
    document.getElementById('slider').innerHTML = html;
    document.querySelectorAll('.slider-item').forEach(el => el.addEventListener('click', () => openOrderModal()));
}

async function updateSliderItem(index, type, file) {
    if (index >= 1 && index <= sliderItems.length) {
        let url = await fileToBase64(file);
        sliderItems[index - 1] = { type: type, url: url };
        saveData();
        renderSlider();
        alert(isArabic ? 'تم التحديث' : 'Updated');
    } else {
        alert(isArabic ? 'رقم غير صحيح (1-10)' : 'Invalid number (1-10)');
    }
}

function renderDiscover() {
    let container = document.getElementById('discover-container');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < discoverData.length; i += 3) {
        let row = document.createElement('div');
        row.className = 'discover-row';
        if (discoverData[i]) row.appendChild(createDiscoverItem(discoverData[i]));
        let smallDiv = document.createElement('div');
        smallDiv.className = 'small-cards';
        if (discoverData[i+1]) smallDiv.appendChild(createDiscoverItem(discoverData[i+1]));
        if (discoverData[i+2]) smallDiv.appendChild(createDiscoverItem(discoverData[i+2]));
        row.appendChild(smallDiv);
        container.appendChild(row);
    }
}

function createDiscoverItem(item) {
    let div = document.createElement('div');
    if (item.type === 'big') {
        div.className = 'big-card';
        div.style.backgroundImage = `url('${item.contentUrl}')`;
    } else {
        div.className = 'small-card';
        if (item.contentUrl.includes('.mp4')) {
            div.innerHTML = `<video src="${item.contentUrl}" style="width:100%; height:100%; object-fit:cover;" muted></video>`;
        } else {
            div.style.backgroundImage = `url('${item.contentUrl}')`;
        }
    }
    let label = document.createElement('span');
    label.className = 'card-label';
    label.innerText = isArabic ? item.labelAr : item.labelEn;
    div.appendChild(label);
    div.addEventListener('click', () => openOrderModal());
    return div;
}

async function updateDiscoverItem(index, type, file, label) {
    if (index >= 1 && index <= discoverData.length) {
        let url = await fileToBase64(file);
        discoverData[index - 1] = { type: type, contentUrl: url, labelAr: label, labelEn: label };
        saveData();
        renderDiscover();
        alert(isArabic ? 'تم التحديث' : 'Updated');
    } else {
        alert(isArabic ? 'رقم غير صحيح (1-9)' : 'Invalid number (1-9)');
    }
}

function openOrderModal() {
    document.getElementById('orderModal').style.display = 'flex';
}

document.getElementById('submitOrder')?.addEventListener('click', () => {
    let name = document.getElementById('orderName').value;
    let phone = document.getElementById('orderPhone').value;
    let notes = document.getElementById('orderNotes').value;
    if (name && phone) {
        bookings.push({ name, phone, notes, date: new Date().toLocaleString() });
        saveData();
        alert(isArabic ? 'تم إرسال طلبك' : 'Order sent');
        document.getElementById('orderModal').style.display = 'none';
        document.getElementById('orderName').value = '';
        document.getElementById('orderPhone').value = '';
        document.getElementById('orderNotes').value = '';
        renderBookings();
        renderProfileBookings();
    } else {
        alert(isArabic ? 'املأ الاسم والرقم' : 'Fill name and phone');
    }
});

document.getElementById('closeModal')?.addEventListener('click', () => {
    document.getElementById('orderModal').style.display = 'none';
});

document.getElementById('currencyBtn')?.addEventListener('click', () => {
    document.getElementById('currencyModal').style.display = 'flex';
});

document.getElementById('closeCurrencyModal')?.addEventListener('click', () => {
    document.getElementById('currencyModal').style.display = 'none';
});

function calculateCurrency() {
    let amount = document.getElementById('currencyAmount').value;
    let type = document.getElementById('currencyType').value;
    if (amount && !isNaN(amount)) {
        let rate = type === 'SAR' ? 3800 : 15000;
        document.getElementById('resultValue').innerText = (amount * rate).toLocaleString();
    } else {
        document.getElementById('resultValue').innerText = '0';
    }
}

document.getElementById('currencyAmount')?.addEventListener('input', calculateCurrency);
document.getElementById('currencyType')?.addEventListener('change', calculateCurrency);

function renderBookings() {
    let div = document.getElementById('bookingsList');
    if (!div) return;
    if (bookings.length === 0) {
        div.innerHTML = isArabic ? 'لا توجد حجوزات بعد' : 'No bookings yet';
    } else {
        let html = '<ul>';
        bookings.forEach(b => {
            html += `<li><strong>${b.name}</strong> - ${b.phone}<br><small>${b.date}</small></li><hr>`;
        });
        html += '</ul>';
        div.innerHTML = html;
    }
}

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        let nav = item.getAttribute('data-nav');
        document.getElementById('home-page').classList.remove('active-page');
        document.getElementById('bookings-page').classList.remove('active-page');
        document.getElementById('profile-page').classList.remove('active-page');
        if (nav === 'home') document.getElementById('home-page').classList.add('active-page');
        if (nav === 'bookings') document.getElementById('bookings-page').classList.add('active-page');
        if (nav === 'profile') document.getElementById('profile-page').classList.add('active-page');
    });
});

document.getElementById('langBtn')?.addEventListener('click', () => {
    isArabic = !isArabic;
    changeLanguage();
});

function setupCollapsibleCards() {
    document.querySelectorAll('.card-header').forEach(header => {
        header.addEventListener('click', () => {
            let target = document.getElementById(header.getAttribute('data-target'));
            let icon = header.querySelector('.toggle-icon');
            if (target) {
                target.classList.toggle('active');
                if (icon) icon.style.transform = target.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    });
}

function loadUserData() {
    let savedName = localStorage.getItem('userFullName');
    let savedPhone = localStorage.getItem('userPhone');
    let savedAvatar = localStorage.getItem('userAvatar');
    if (savedName) document.getElementById('userFullName').value = savedName;
    if (savedPhone) document.getElementById('userPhone').value = savedPhone;
    if (savedAvatar) document.getElementById('avatarImg').src = savedAvatar;
    document.getElementById('profileName').innerText = savedName || (isArabic ? 'أحمد محمد' : 'Ahmed Mohamed');
}

document.getElementById('saveProfileBtn')?.addEventListener('click', () => {
    let name = document.getElementById('userFullName').value;
    let phone = document.getElementById('userPhone').value;
    localStorage.setItem('userFullName', name);
    localStorage.setItem('userPhone', phone);
    document.getElementById('profileName').innerText = name;
    alert(isArabic ? 'تم الحفظ' : 'Saved');
});

document.getElementById('deleteAccountBtn')?.addEventListener('click', () => {
    if (confirm(isArabic ? 'حذف الحساب؟' : 'Delete account?')) {
        localStorage.clear();
        alert(isArabic ? 'تم الحذف' : 'Deleted');
        location.reload();
    }
});

document.getElementById('editAvatarBtn')?.addEventListener('click', () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        if (e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('avatarImg').src = ev.target.result;
                localStorage.setItem('userAvatar', ev.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    input.click();
});

document.getElementById('settingsLanguage')?.addEventListener('change', (e) => {
    if ((e.target.value === 'en' && isArabic) || (e.target.value === 'ar' && !isArabic)) {
        document.getElementById('langBtn').click();
    }
});

document.getElementById('settingsCurrency')?.addEventListener('change', (e) => {
    localStorage.setItem('preferredCurrency', e.target.value);
    alert(isArabic ? 'تم تغيير العملة' : 'Currency changed');
});

document.getElementById('showQrBtn')?.addEventListener('click', () => {
    let modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `<div class="modal-content"><h3>📱 ${isArabic ? 'تحميل التطبيق' : 'Download App'}</h3><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://puncakgo.com" style="width:200px;margin:15px"><p>https://puncakgo.com</p><button id="closeQrModal" class="cancel-btn">${isArabic ? 'إغلاق' : 'Close'}</button></div>`;
    document.body.appendChild(modal);
    document.getElementById('closeQrModal').addEventListener('click', () => modal.remove());
});

document.getElementById('inviteFriendsBtn')?.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({ title: 'PuncakGO', text: isArabic ? 'انضم إلينا' : 'Join us', url: 'https://puncakgo.com' });
    } else {
        prompt(isArabic ? 'انسخ الرابط:' : 'Copy link:', 'https://puncakgo.com');
    }
});

document.getElementById('listPropertyBtn')?.addEventListener('click', () => {
    let type = prompt(isArabic ? 'نوع المنتج (فيلا/خدمة):' : 'Product type (villa/service):');
    let desc = prompt(isArabic ? 'وصف المنتج:' : 'Product description:');
    if (type && desc) window.open(`https://wa.me/6281234567890?text=${isArabic ? 'طلب عرض منتج:' : 'Product request:'} ${type} - ${desc}`, '_blank');
});

document.getElementById('aboutUsBtn')?.addEventListener('click', () => {
    let modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `<div class="modal-content" style="max-width:500px;"><h3>🏔️ PuncakGO</h3><p>${isArabic ? 'نحن في PuncakGO نؤمن بأن السفر تجربة تستحق التميز. نقدم لكم أفضل الفلل والجولات وخدمات الفيزا.' : 'At PuncakGO, we believe travel is an experience worth excellence. We offer the best villas, tours, and visa services.'}</p><p style="margin-top:15px;">${isArabic ? '© 2025 جميع الحقوق محفوظة' : '© 2025 All rights reserved'}</p><button id="closeAboutModal" class="cancel-btn">${isArabic ? 'إغلاق' : 'Close'}</button></div>`;
    document.body.appendChild(modal);
    document.getElementById('closeAboutModal').addEventListener('click', () => modal.remove());
});

document.getElementById('contactManagerBtn')?.addEventListener('click', () => {
    let msg = prompt(isArabic ? 'رسالتك للمدير:' : 'Your message to manager:');
    if (msg) window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
});

function renderProfileBookings() {
    let container = document.getElementById('profileBookingsList');
    if (!container) return;
    if (bookings.length === 0) {
        container.innerHTML = isArabic ? 'لا توجد حجوزات بعد' : 'No bookings yet';
    } else {
        let html = '<ul style="list-style:none;">';
        bookings.slice(-5).reverse().forEach(b => {
            html += `<li style="margin-bottom:10px; padding:10px; background:#f9f9f9; border-radius:15px;"><strong>${b.name}</strong> - ${b.phone}<br><small>${b.date}</small></li>`;
        });
        html += '</ul>';
        container.innerHTML = html;
    }
}

function loadFavorites() {
    let container = document.getElementById('favoritesList');
    if (!container) return;
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.length === 0) {
        container.innerHTML = `<p>${isArabic ? 'لا توجد مفضلات' : 'No favorites'}</p>`;
    } else {
        let html = '<div style="display:flex;flex-wrap:wrap;gap:10px;">';
        favorites.forEach(item => {
            html += `<div style="background:#f9f9f9;padding:10px;border-radius:15px;width:calc(50% - 5px);text-align:center;"><strong>${item.name}</strong><br><button class="remove-fav" data-id="${item.id}" style="background:#8B0000;color:white;border:none;padding:5px;border-radius:15px;margin-top:5px;">${isArabic ? 'إزالة' : 'Remove'}</button></div>`;
        });
        html += '</div>';
        container.innerHTML = html;
        document.querySelectorAll('.remove-fav').forEach(btn => {
            btn.addEventListener('click', () => {
                let id = btn.getAttribute('data-id');
                let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
                favs = favs.filter(f => f.id != id);
                localStorage.setItem('favorites', JSON.stringify(favs));
                loadFavorites();
            });
        });
    }
}

document.getElementById('adminLoginBtn')?.addEventListener('click', () => {
    let password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        localStorage.setItem('isAdminLoggedIn', 'true');
        document.getElementById('adminLoginDiv').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        alert(isArabic ? 'تم الدخول كأدمن' : 'Admin login');
    } else {
        alert(isArabic ? 'كلمة سر خطأ' : 'Wrong password');
    }
});

document.getElementById('logoutAdminBtn')?.addEventListener('click', () => {
    isAdminLoggedIn = false;
    localStorage.setItem('isAdminLoggedIn', 'false');
    document.getElementById('adminLoginDiv').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    alert(isArabic ? 'تم الخروج' : 'Logged out');
});

let selectedSliderFile = null;
let selectedDiscoverFile = null;

document.getElementById('sliderUploadBtn')?.addEventListener('click', () => {
    document.getElementById('sliderFileInput').click();
});
document.getElementById('sliderFileInput')?.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        selectedSliderFile = e.target.files[0];
        document.getElementById('sliderFileName').innerText = selectedSliderFile.name;
    }
});
document.getElementById('updateSliderItem')?.addEventListener('click', async () => {
    let index = parseInt(document.getElementById('sliderIndex').value);
    let type = document.getElementById('sliderMediaType').value;
    if (index && selectedSliderFile) {
        await updateSliderItem(index, type, selectedSliderFile);
        document.getElementById('sliderIndex').value = '';
        document.getElementById('sliderFileName').innerText = '';
        selectedSliderFile = null;
    } else {
        alert(isArabic ? 'أدخل رقم واختر ملف' : 'Enter number and select file');
    }
});

document.getElementById('discoverUploadBtn')?.addEventListener('click', () => {
    document.getElementById('discoverFileInput').click();
});
document.getElementById('discoverFileInput')?.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        selectedDiscoverFile = e.target.files[0];
        document.getElementById('discoverFileName').innerText = selectedDiscoverFile.name;
    }
});
document.getElementById('updateDiscoverItem')?.addEventListener('click', async () => {
    let index = parseInt(document.getElementById('discoverIndex').value);
    let label = document.getElementById('newDiscoverLabel').value;
    let type = document.getElementById('discoverMediaType').value;
    if (index && selectedDiscoverFile && label) {
        await updateDiscoverItem(index, type, selectedDiscoverFile, label);
        document.getElementById('discoverIndex').value = '';
        document.getElementById('discoverFileName').innerText = '';
        document.getElementById('newDiscoverLabel').value = '';
        selectedDiscoverFile = null;
    } else {
        alert(isArabic ? 'أدخل رقم واختر ملف ونص' : 'Enter number, select file, and label');
    }
});

let savedAvatar = localStorage.getItem('userAvatar');
if (savedAvatar) document.getElementById('avatarImg').src = savedAvatar;
let savedName2 = localStorage.getItem('userFullName');
if (savedName2) {
    document.getElementById('userFullName').value = savedName2;
    document.getElementById('profileName').innerText = savedName2;
}
let savedAdmin2 = localStorage.getItem('isAdminLoggedIn');
if (savedAdmin2 === 'true') {
    setTimeout(() => {
        if (document.getElementById('adminLoginDiv')) {
            document.getElementById('adminLoginDiv').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
        }
    }, 100);
}

// ========== دوال PocketBase ==========
async function saveBookingToPocketBase(bookingData) {
    if (!pb) {
        console.error('❌ PocketBase not initialized');
        alert('PocketBase not connected');
        return null;
    }
    try {
        const record = await pb.collection('bookings').create({
            type: bookingData.type,
            itemId: bookingData.itemId,
            name: bookingData.name,
            phone: bookingData.phone,
            date: bookingData.date,
            notes: bookingData.notes
        });
        console.log('✅ Booking saved:', record);
        alert('تم حفظ الحجز بنجاح');
        return record;
    } catch (error) {
        console.error('❌ Booking error:', error);
        alert('حدث خطأ في حفظ الحجز: ' + error.message);
        return null;
    }
}

// ========== تحميل الصفحة ==========
loadSavedData();
renderSlider();
renderDiscover();
renderBookings();
changeLanguage();
setupCollapsibleCards();
loadUserData();
renderProfileBookings();
loadFavorites();
