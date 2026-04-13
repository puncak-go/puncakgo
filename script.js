// Supabase Client
const supabaseClient = window.supabase.createClient(
    'https://nynusiouhgjmjpunfpod.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bnVzaW91aGdqbWpwdW5mcG9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5Nzc3OTYsImV4cCI6MjA5MTU1Mzc5Nn0.82pLG_PDqke5dxQCKZQL31X8c9D3ISQP3M8wQRcjOik'
);

console.log('🟡 Supabase Client initialized');

// ========== اختبار الاتصال بقاعدة البيانات ==========
(async function testSupabaseConnection() {
    console.log('🟡 جاري اختبار الاتصال بـ Supabase...');
    
    try {
        const { data: sliderData, error: sliderError } = await supabaseClient.from('slider_items').select('count');
        if (sliderError) throw sliderError;
        console.log('✅ الاتصال بقاعدة البيانات ناجح!');
        
        const { data: discoverData, error: discoverError } = await supabaseClient.from('discover_items').select('count');
        if (discoverError) throw discoverError;
        console.log('📊 جدول discover_items موجود');
        
        const { data: bookingsData, error: bookingsError } = await supabaseClient.from('bookings').select('count');
        if (bookingsError) throw bookingsError;
        console.log('📊 جدول bookings موجود');
        
        console.log('🎉 Supabase يعمل بشكل طبيعي!');
        
    } catch (error) {
        console.error('❌ فشل الاتصال بـ Supabase:', error.message);
    }
})();

// بيانات السلايدر (10 حقول)
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

// بيانات الديسكفر (9 حقول)
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

// ========== دوال Supabase للجداول ==========

async function loadSliderFromSupabase() {
    try {
        console.log('🟡 جاري تحميل بيانات السلايدر من Supabase...');
        const { data, error } = await supabaseClient.from('slider_items').select('*').order('id', { ascending: true });
        if (error) throw error;
        if (data && data.length === 10) {
            sliderItems = data.map(item => ({ type: item.type, url: item.url }));
            localStorage.setItem('sliderItems', JSON.stringify(sliderItems));
            console.log('✅ تم تحميل 10 حقول للسلايدر');
        }
    } catch(e) { console.error('❌ Error loading slider:', e); }
}

async function saveSliderToSupabase() {
    console.log('🟡 جاري حفظ بيانات السلايدر في Supabase...');
    for (let i = 0; i < sliderItems.length; i++) {
        try {
            await supabaseClient.from('slider_items').upsert({
                id: i + 1,
                type: sliderItems[i].type,
                url: sliderItems[i].url
            });
        } catch(e) { console.error('❌ Error saving slider item', i, e); }
    }
    console.log('✅ تم حفظ السلايدر');
}

async function loadDiscoverFromSupabase() {
    try {
        console.log('🟡 جاري تحميل بيانات الديسكفر من Supabase...');
        const { data, error } = await supabaseClient.from('discover_items').select('*').order('id', { ascending: true });
        if (error) throw error;
        if (data && data.length === 9) {
            discoverData = data.map(item => ({ 
                type: item.type, 
                contentUrl: item.content_url, 
                labelAr: item.label_ar, 
                labelEn: item.label_en 
            }));
            localStorage.setItem('discoverData', JSON.stringify(discoverData));
            console.log('✅ تم تحميل 9 حقول للديسكفر');
        }
    } catch(e) { console.error('❌ Error loading discover:', e); }
}

async function saveDiscoverToSupabase() {
    console.log('🟡 جاري حفظ بيانات الديسكفر في Supabase...');
    for (let i = 0; i < discoverData.length; i++) {
        try {
            await supabaseClient.from('discover_items').upsert({
                id: i + 1,
                type: discoverData[i].type,
                content_url: discoverData[i].contentUrl,
                label_ar: discoverData[i].labelAr,
                label_en: discoverData[i].labelEn
            });
        } catch(e) { console.error('❌ Error saving discover item', i, e); }
    }
    console.log('✅ تم حفظ الديسكفر');
}

async function loadBookingsFromSupabase() {
    try {
        console.log('🟡 جاري تحميل الحجوزات من Supabase...');
        const { data, error } = await supabaseClient.from('bookings').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) {
            bookings = data;
            localStorage.setItem('bookings', JSON.stringify(bookings));
            console.log('✅ تم تحميل', bookings.length, 'حجز');
        }
    } catch(e) { console.error('❌ Error loading bookings:', e); }
}

async function saveBookingToSupabase(booking) {
    try {
        console.log('🟡 جاري حفظ حجز جديد:', booking.name);
        const { error } = await supabaseClient.from('bookings').insert({
            name: booking.name,
            phone: booking.phone,
            notes: booking.notes,
            created_at: booking.date
        });
        if (error) throw error;
        console.log('✅ تم حفظ الحجز');
    } catch(e) { console.error('❌ Error saving booking:', e); }
}

async function loadUserProfileFromSupabase() {
    try {
        console.log('🟡 جاري تحميل بيانات المستخدم من Supabase...');
        const { data, error } = await supabaseClient.from('user_profiles').select('*').limit(1);
        if (error) throw error;
        if (data && data[0]) {
            localStorage.setItem('userFullName', data[0].full_name);
            localStorage.setItem('userPhone', data[0].phone);
            if (data[0].avatar) localStorage.setItem('userAvatar', data[0].avatar);
            console.log('✅ تم تحميل بيانات المستخدم');
        }
    } catch(e) { console.error('❌ Error loading user profile:', e); }
}

async function saveUserProfileToSupabase(name, phone, avatar) {
    try {
        console.log('🟡 جاري حفظ بيانات المستخدم...');
        const { error } = await supabaseClient.from('user_profiles').upsert({
            id: 1,
            full_name: name,
            phone: phone,
            avatar: avatar || null,
            updated_at: new Date().toISOString()
        });
        if (error) throw error;
        console.log('✅ تم حفظ بيانات المستخدم');
    } catch(e) { console.error('❌ Error saving user profile:', e); }
}

async function loadFavoritesFromSupabase() {
    try {
        console.log('🟡 جاري تحميل المفضلات من Supabase...');
        const { data, error } = await supabaseClient.from('favorites').select('*');
        if (error) throw error;
        if (data) {
            localStorage.setItem('favorites', JSON.stringify(data));
            console.log('✅ تم تحميل', data.length, 'مفضلة');
        }
    } catch(e) { console.error('❌ Error loading favorites:', e); }
}

async function deleteFavoriteFromSupabase(id) {
    try {
        console.log('🟡 جاري حذف مفضلة:', id);
        const { error } = await supabaseClient.from('favorites').delete().eq('id', id);
        if (error) throw error;
        console.log('✅ تم حذف المفضلة');
    } catch(e) { console.error('❌ Error deleting favorite:', e); }
}

// ========== الدوال الأساسية ==========

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

async function loadAllDataFromSupabase() {
    await loadSliderFromSupabase();
    await loadDiscoverFromSupabase();
    await loadBookingsFromSupabase();
    await loadUserProfileFromSupabase();
    await loadFavoritesFromSupabase();
    renderSlider();
    renderDiscover();
    renderBookings();
    renderProfileBookings();
    loadFavorites();
}

function saveData() {
    localStorage.setItem('sliderItems', JSON.stringify(sliderItems));
    localStorage.setItem('discoverData', JSON.stringify(discoverData));
    localStorage.setItem('bookings', JSON.stringify(bookings));
    saveSliderToSupabase();
    saveDiscoverToSupabase();
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
    const sliderContainer = document.getElementById('slider');
    if (!sliderContainer) return;
    sliderContainer.innerHTML = '';
    
    for (let i = 0; i < sliderItems.length; i++) {
        const item = sliderItems[i];
        let div = document.createElement('div');
        div.className = 'slider-item';
        
        if (item.type === 'image') {
            div.style.backgroundImage = `url('${item.url}')`;
            div.style.backgroundSize = 'cover';
            div.style.backgroundPosition = 'center';
            div.style.backgroundRepeat = 'no-repeat';
        } else {
            const video = document.createElement('video');
            video.src = item.url;
            video.muted = true;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            div.appendChild(video);
        }
        
        div.addEventListener('click', () => openOrderModal());
        sliderContainer.appendChild(div);
    }
}

async function updateSliderItem(index, type, file) {
    console.log('🟡 جاري تحديث الحقل رقم', index, 'نوعه:', type);
    console.log('📁 اسم الملف:', file.name);
    console.log('📏 حجم الملف:', (file.size / 1024).toFixed(2), 'KB');
    
    if (index >= 1 && index <= sliderItems.length) {
        let url;
        
        if (type === 'image') {
            const fileExt = file.name.split('.').pop();
            const fileName = `slider_${Date.now()}.${fileExt}`;
            const filePath = `slider/${fileName}`;
            
            console.log('🚀 جاري الرفع إلى:', filePath);
            
            const { data, error } = await supabaseClient.storage
                .from('puncakgo-media')
                .upload(filePath, file);
            
            if (error) {
                console.error('❌ خطأ في الرفع:', error);
                alert('فشل الرفع: ' + error.message);
                return;
            }
            
            console.log('✅ تم الرفع بنجاح');
            
            const { data: urlData } = supabaseClient.storage
                .from('puncakgo-media')
                .getPublicUrl(filePath);
            
            url = urlData.publicUrl;
            console.log('🔗 الرابط:', url);
            
        } else {
            url = URL.createObjectURL(file);
        }
        
        if (url) {
            sliderItems[index - 1] = { type: type, url: url };
            saveData();
            renderSlider();
            console.log('✅ تم تحديث الحقل', index);
            alert(isArabic ? 'تم التحديث بنجاح' : 'Updated successfully');
        } else {
            console.error('❌ لا يوجد رابط للملف');
            alert(isArabic ? 'فشل رفع الملف' : 'File upload failed');
        }
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
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center';
        div.style.backgroundRepeat = 'no-repeat';
    } else {
        div.className = 'small-card';
        if (item.contentUrl && (item.contentUrl.includes('.mp4') || item.contentUrl.includes('blob:'))) {
            const video = document.createElement('video');
            video.src = item.contentUrl;
            video.muted = true;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            div.appendChild(video);
        } else if (item.contentUrl) {
            div.style.backgroundImage = `url('${item.contentUrl}')`;
            div.style.backgroundSize = 'cover';
            div.style.backgroundPosition = 'center';
            div.style.backgroundRepeat = 'no-repeat';
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
    console.log('🟡 جاري تحديث حقل الديسكفر رقم', index, 'نوعه:', type);
    
    if (index >= 1 && index <= discoverData.length) {
        let url;
        
        if (type === 'big') {
            const fileExt = file.name.split('.').pop();
            const fileName = `discover_${Date.now()}.${fileExt}`;
            const filePath = `discover/${fileName}`;
            
            console.log('🚀 جاري الرفع إلى:', filePath);
            
            const { data, error } = await supabaseClient.storage
                .from('puncakgo-media')
                .upload(filePath, file);
            
            if (error) {
                console.error('❌ خطأ في الرفع:', error);
                alert('فشل الرفع: ' + error.message);
                return;
            }
            
            console.log('✅ تم الرفع بنجاح');
            
            const { data: urlData } = supabaseClient.storage
                .from('puncakgo-media')
                .getPublicUrl(filePath);
            
            url = urlData.publicUrl;
            console.log('🔗 الرابط:', url);
            
        } else {
            url = URL.createObjectURL(file);
        }
        
        if (url) {
            discoverData[index - 1] = { type: type, contentUrl: url, labelAr: label, labelEn: label };
            saveData();
            renderDiscover();
            console.log('✅ تم تحديث حقل الديسكفر', index);
            alert(isArabic ? 'تم التحديث بنجاح' : 'Updated successfully');
        } else {
            console.error('❌ لا يوجد رابط للملف');
            alert(isArabic ? 'فشل رفع الملف' : 'File upload failed');
        }
    } else {
        alert(isArabic ? 'رقم غير صحيح (1-9)' : 'Invalid number (1-9)');
    }
}

function openOrderModal() {
    document.getElementById('orderModal').style.display = 'flex';
}

document.getElementById('submitOrder')?.addEventListener('click', async () => {
    let name = document.getElementById('orderName').value;
    let phone = document.getElementById('orderPhone').value;
    let notes = document.getElementById('orderNotes').value;
    if (name && phone) {
        let newBooking = { name, phone, notes, date: new Date().toLocaleString() };
        bookings.push(newBooking);
        saveData();
        await saveBookingToSupabase(newBooking);
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

document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
    let name = document.getElementById('userFullName').value;
    let phone = document.getElementById('userPhone').value;
    let avatar = document.getElementById('avatarImg').src;
    localStorage.setItem('userFullName', name);
    localStorage.setItem('userPhone', phone);
    document.getElementById('profileName').innerText = name;
    await saveUserProfileToSupabase(name, phone, avatar);
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
    input.onchange = async (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `avatar_${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;
            
            const { data, error } = await supabaseClient.storage
                .from('puncakgo-media')
                .upload(filePath, file);
            
            if (error) {
                alert('فشل رفع الصورة: ' + error.message);
                return;
            }
            
            const { data: urlData } = supabaseClient.storage
                .from('puncakgo-media')
                .getPublicUrl(filePath);
            
            const avatarUrl = urlData.publicUrl;
            document.getElementById('avatarImg').src = avatarUrl;
            localStorage.setItem('userAvatar', avatarUrl);
            let name = document.getElementById('userFullName').value;
            let phone = document.getElementById('userPhone').value;
            await saveUserProfileToSupabase(name, phone, avatarUrl);
            alert(isArabic ? 'تم تحديث الصورة' : 'Avatar updated');
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
            btn.addEventListener('click', async () => {
                let id = btn.getAttribute('data-id');
                let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
                favs = favs.filter(f => f.id != id);
                localStorage.setItem('favorites', JSON.stringify(favs));
                await deleteFavoriteFromSupabase(id);
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
        console.log('📁 تم اختيار ملف للسلايدر:', selectedSliderFile.name);
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
        console.log('📁 تم اختيار ملف للديسكفر:', selectedDiscoverFile.name);
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

// ========== التهيئة النهائية ==========
let savedAvatar = localStorage.getItem('userAvatar');
if (savedAvatar && document.getElementById('avatarImg')) document.getElementById('avatarImg').src = savedAvatar;
let savedName2 = localStorage.getItem('userFullName');
if (savedName2 && document.getElementById('userFullName')) {
    document.getElementById('userFullName').value = savedName2;
    if (document.getElementById('profileName')) document.getElementById('profileName').innerText = savedName2;
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

loadSavedData();
loadAllDataFromSupabase().then(() => {
    renderSlider();
    renderDiscover();
    renderBookings();
    changeLanguage();
    setupCollapsibleCards();
    loadUserData();
    renderProfileBookings();
    loadFavorites();
    console.log('🎉 تم تحميل جميع البيانات بنجاح!');
});
