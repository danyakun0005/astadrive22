/* ========== RENTAL CATALOG ========== */
function renderCatalog() {
  const grid = document.getElementById('bikeGrid');
  const bikes = getBikes();
  grid.innerHTML = bikes.map((bike, i) => {
    const cls = bike.inStock ? '' : 'bike-card__status--out';
    const txt = bike.inStock ? 'В наличии' : 'В аренде';
    return `
      <div class="bike-card" onclick="showBikeDetail(${bike.id})" style="animation-delay:${i * 0.06}s">
        <div class="bike-card__inner">
          ${bike.image ? `<img src="${bike.image}" alt="${bike.name}" class="bike-card__img">` : `<div class="bike-card__img-placeholder">🚲</div>`}
          <div class="bike-card__body">
            <div class="bike-card__name">${bike.name}</div>
            <div class="bike-card__specs">
              <span>⚡ ${bike.specs["Мощность"]}</span>
              <span>🚀 ${bike.specs["Скорость"]}</span>
              <span>🏋️ ${bike.specs["Нагрузка"]}</span>
              <span>🔋 ${bike.specs["Ёмкость АКБ"]}</span>
            </div>
            <div class="bike-card__pricing">
              <span>📅 ${formatCurrency(bike.pricing.day)}/день</span>
              <span>📅 ${formatCurrency(bike.pricing.week)}/нед</span>
            </div>
            <span class="bike-card__status ${cls}">${txt}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function showBikeDetail(id) {
  const bike = getBikeById(id);
  if (!bike) return;
  const container = document.getElementById('bikeDetailContent');
  renderBikeDetail(container, bike, 'rent');
  showSection('bike-detail');
}

/* ========== SHOP CATALOG ========== */
function renderShop() {
  const grid = document.getElementById('shopGrid');
  const items = getShopItems();
  grid.innerHTML = (items.length ? items : [{ id: 0, name: '', inStock: false, specs: {}, image: '', description: '', price: 0, placeholder: true }]).map((item, i) => {
    if (item.placeholder) return `<div class="shop-empty">Товаров пока нет — скоро добавим</div>`;
    const cls = item.inStock ? '' : 'bike-card__status--out';
    const txt = item.inStock ? 'В наличии' : 'Продано';
    return `
      <div class="bike-card" onclick="showShopDetail(${item.id})" style="animation-delay:${i * 0.06}s">
        <div class="bike-card__inner">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" class="bike-card__img">` : `<div class="bike-card__img-placeholder">🚲</div>`}
          <div class="bike-card__body">
            <div class="bike-card__name">${item.name}</div>
            <div class="bike-card__specs">
              <span>⚡ ${item.specs["Мощность"] || '—'}</span>
              <span>🚀 ${item.specs["Скорость"] || '—'}</span>
              <span>🏋️ ${item.specs["Нагрузка"] || '—'}</span>
              <span>🔋 ${item.specs["Ёмкость АКБ"] || '—'}</span>
            </div>
            <div class="bike-card__pricing"><span>💰 ${formatCurrency(item.price)}</span></div>
            <span class="bike-card__status ${cls}">${txt}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function showShopDetail(id) {
  const item = getShopItemById(id);
  if (!item) return;
  const container = document.getElementById('shopDetailContent');
  renderBikeDetail(container, item, 'shop');
  showSection('shop-detail');
}

/* ========== SHARED DETAIL RENDERER ========== */
function renderBikeDetail(container, item, mode) {
  const isRent = mode === 'rent';
  const statusClass = item.inStock ? '' : 'bike-detail__status--out';
  const statusText = isRent ? (item.inStock ? 'В НАЛИЧИИ НА ДАННЫЙ МОМЕНТ' : 'В аренде') : (item.inStock ? 'В наличии' : 'Продано');

  const emojiMap = { "Мощность":"⚡", "Скорость":"🚀", "Нагрузка":"🏋️", "Ёмкость АКБ":"🔋" };
  const specsHtml = Object.entries(item.specs || {}).map(([label, value]) =>
    `<div class="bike-detail__spec">
      <span class="bike-detail__spec-label">${emojiMap[label]||''} ${label}</span>
      <span class="bike-detail__spec-value">${value}</span>
    </div>`
  ).join('');

  const pricingHtml = isRent && item.pricing ? `
    <div class="bike-detail__pricing">
      <div class="bike-detail__pricing-title">💰 Прайс аренды</div>
      <div class="bike-detail__pricing-grid">
        <div class="bike-detail__price-item">
          <span class="bike-detail__price-label">📅 День</span>
          <span class="bike-detail__price-value">${formatCurrency(item.pricing.day)}</span>
        </div>
        <div class="bike-detail__price-item">
          <span class="bike-detail__price-label">📅 Неделя</span>
          <span class="bike-detail__price-value">${formatCurrency(item.pricing.week)}</span>
        </div>
        <div class="bike-detail__price-item">
          <span class="bike-detail__price-label">📅 Месяц</span>
          <span class="bike-detail__price-value">${formatCurrency(item.pricing.month)}</span>
        </div>
      </div>
    </div>` : '';

  const shopPricing = !isRent ? `
    <div class="bike-detail__pricing">
      <div class="bike-detail__pricing-title">🏷️ Цена</div>
      <div class="bike-detail__pricing-grid single">
        <div class="bike-detail__price-item">
          <span class="bike-detail__price-label">💵 Продажа</span>
          <span class="bike-detail__price-value">${formatCurrency(item.price)}</span>
        </div>
      </div>
    </div>` : '';

  const descHtml = item.description ? `<div class="bike-detail__desc"><span class="bike-detail__desc-label">📝 Описание</span><p>${item.description}</p></div>` : '';

  container.innerHTML = `
    <div class="bike-detail">
      <div>
        ${item.image ? `<img src="${item.image}" alt="${item.name}" class="bike-detail__img">` : `<div class="bike-detail__img-placeholder">🚲</div>`}
      </div>
      <div>
        <h2 class="bike-detail__name">${item.name}</h2>
        <div class="bike-detail__specs">${specsHtml}</div>
        ${pricingHtml}
        ${shopPricing}
        ${descHtml}
        <div class="bike-detail__status ${statusClass}">${statusText}</div>
        <div class="bike-detail__actions">
          <button class="btn btn--primary" onclick="openBookingModal('${isRent ? 'rent' : 'shop'}', '${item.name.replace(/'/g, "\\'")}')">
            📩 Связаться
          </button>
          <a href="tel:+79132561226" class="btn btn--primary btn--green" style="text-align:center">
            📞 +7 (913) 256-12-26
          </a>
        </div>
      </div>
    </div>
  `;
}

/* ========== BOOKING MODAL ========== */
function openBookingModal(type, itemName) {
  document.getElementById('modalOverlay').classList.add('show');
  document.getElementById('modalTitle').textContent = type === 'rent' ? 'Хочу арендовать' : 'Хочу купить';
  document.getElementById('modalSubtitle').textContent = itemName;
  document.getElementById('modalPhone').value = '';
  document.getElementById('modalTg').value = '';
  document.getElementById('modalVk').value = '';
  document.getElementById('modalWa').value = '';
  document.getElementById('modalSuccess').classList.remove('show');
  document.getElementById('bookingForm').style.display = 'block';
  document.querySelector('.modal__btn').style.display = 'block';
  document.getElementById('modalOverlay').dataset.itemName = itemName;
  document.getElementById('modalOverlay').dataset.type = type;

  // store for admin
  window._bookingContext = { type, itemName };
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

function submitBooking(e) {
  e.preventDefault();
  const phone = document.getElementById('modalPhone').value.trim();
  if (!validateRussianPhone(phone)) { alert('Введите корректный номер РФ: +7 (___) ___-__-__'); return; }
  const tg = document.getElementById('modalTg').value.trim();
  const vk = document.getElementById('modalVk').value.trim();
  const wa = document.getElementById('modalWa').value.trim();
  const ctx = window._bookingContext || {};
  const itemName = ctx.itemName || '';
  const type = ctx.type || '';

  addOrder({ itemId: 0, itemName, name: phone, phone,
    tg, vk, wa, type,
    date: new Date().toLocaleString('ru-RU')
  });

  let tgMsg = `<b>⚡ ASTADRIVE22 — Новая заявка</b>\n\n`;
  tgMsg += `<b>Тип:</b> ${type === 'rent' ? 'Аренда' : 'Покупка'}\n`;
  tgMsg += `<b>Товар:</b> ${itemName}\n`;
  tgMsg += `<b>Телефон:</b> ${phone}\n`;
  if (tg) tgMsg += `<b>Telegram:</b> ${tg}\n`;
  if (vk) tgMsg += `<b>VK:</b> ${vk}\n`;
  if (wa) tgMsg += `<b>WhatsApp:</b> ${wa}\n`;
  tgMsg += `\n📅 ${new Date().toLocaleString('ru-RU')}`;
  sendToTelegram(tgMsg);

  document.getElementById('bookingForm').style.display = 'none';
  document.querySelector('.modal__btn').style.display = 'none';
  document.getElementById('modalSuccess').classList.add('show');
  document.querySelector('.modal__success p').textContent = 'Заявка отправлена! Мы свяжемся с вами.';
}

/* ========== NAVIGATION ========== */
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('section--active'));
  const section = document.getElementById(id);
  if (section) section.classList.add('section--active');

  document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
  const navMap = { catalog: 0, shop: 1, contacts: 2, terms: 3 };
  const links = document.querySelectorAll('.nav__link');
  if (navMap[id] !== undefined) links[navMap[id]]?.classList.add('active');

  document.getElementById('nav')?.classList.remove('open');
  document.querySelector('.burger')?.classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMenu() {
  document.getElementById('nav').classList.toggle('open');
  document.querySelector('.burger').classList.toggle('active');
}

function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let raf = null;
  document.addEventListener('mousemove', (e) => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  renderShop();
  initCursorGlow();

  onDataChange(() => {
    const section = document.querySelector('.section--active');
    if (section) {
      const id = section.id;
      if (id === 'catalog') renderCatalog();
      else if (id === 'shop') renderShop();
    }
  });

  document.querySelectorAll('.phone-mask').forEach(el => {
    el.addEventListener('input', () => maskPhone(el));
  });

  document.getElementById('callbackForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const phone = input.value.trim();
    if (!validateRussianPhone(phone)) { alert('Введите корректный номер РФ: +7 (___) ___-__-__'); return; }
    const msg = `<b>⚡ ASTADRIVE22 — Обратный звонок</b>\n\n<b>Телефон:</b> ${phone}\n\n📅 ${new Date().toLocaleString('ru-RU')}`;
    sendToTelegram(msg);

    addOrder({ itemId: 0, itemName: 'Обратный звонок', name: '', phone,
      tg: '', vk: '', wa: '', type: 'callback',
      date: new Date().toLocaleString('ru-RU')
    });

    document.getElementById('formSuccess').classList.add('show');
    input.value = '';
  });
});
