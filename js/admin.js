/* ========== LOGIN / LOGOUT ========== */
function adminLogin() {
  const pass = document.getElementById('loginPass').value;
  if (pass === ADMIN_PASSWORD) {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('loginError').classList.remove('show');
    renderAll();
  } else {
    document.getElementById('loginError').classList.add('show');
  }
}

function adminLogout() {
  document.getElementById('adminLogin').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('loginPass').value = '';
  document.getElementById('loginError').classList.remove('show');
}

function renderAll() { renderRent(); renderShopAdmin(); renderOrders(); }

/* ========== TAB SWITCHING ========== */
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  if (tab === 'rent') {
    document.getElementById('adminRent').style.display = 'block';
    document.getElementById('tabRent').classList.add('active');
    renderRent();
  } else if (tab === 'shop') {
    document.getElementById('adminShop').style.display = 'block';
    document.getElementById('tabShop').classList.add('active');
    renderShopAdmin();
  } else if (tab === 'orders') {
    document.getElementById('adminOrders').style.display = 'block';
    document.getElementById('tabOrders').classList.add('active');
    renderOrders();
  }
}

/* ========== RENT ADMIN ========== */
function renderRent() {
  const bikes = getBikes();
  const available = bikes.filter(b => b.inStock).length;
  const rented = bikes.filter(b => !b.inStock).length;
  const total = bikes.reduce((s, b) => s + totalEarnings(b), 0);
  const monthTotal = bikes.reduce((s, b) => s + monthlyEarnings(b), 0);

  document.getElementById('rentStats').innerHTML = `
    <div class="admin-stat"><span class="admin-stat__value">🚲 ${bikes.length}</span><span class="admin-stat__label">Всего</span></div>
    <div class="admin-stat"><span class="admin-stat__value">✅ ${available}</span><span class="admin-stat__label">В наличии</span></div>
    <div class="admin-stat"><span class="admin-stat__value">🔒 ${rented}</span><span class="admin-stat__label">В аренде</span></div>
    <div class="admin-stat"><span class="admin-stat__value">📅 ${formatCurrency(monthTotal)}</span><span class="admin-stat__label">За месяц</span></div>
    <div class="admin-stat"><span class="admin-stat__value">💰 ${formatCurrency(total)}</span><span class="admin-stat__label">Всего прибыль</span></div>
  `;

  const list = document.getElementById('adminRentList');
  list.innerHTML = bikes.map(bike => renderBikeCard(bike, 'rent')).join('');
}

function renderBikeCard(item, mode) {
  const isRent = mode === 'rent';
  const earnings = totalEarnings(item);
  const monthEarn = monthlyEarnings(item);
  const p = item.pricing || {};
  const statusClass = item.inStock ? 'available' : 'rented';
  const statusText = item.inStock ? 'В наличии' : 'В аренде';
  const bikeImg = item.image || '';

  const adminEmoji = { "Мощность":"⚡", "Скорость":"🚀", "Нагрузка":"🏋️", "Ёмкость АКБ":"🔋" };
  const specsRows = Object.entries(item.specs).map(([label, value]) =>
    `<div class="admin-bike__spec"><span class="admin-bike__spec-label">${adminEmoji[label]||''} ${label}</span><span class="admin-bike__spec-value">${value}</span></div>`
  ).join('');

  const historyHtml = (item.earnings || []).slice().reverse().map(e =>
    `<div class="admin-bike__history-item"><span>💵 +${formatCurrency(e.amount)}</span><span>📅 ${e.date}</span></div>`
  ).join('') || '<div class="admin-bike__history-empty">Нет записей</div>';

  const pricingHtml = isRent ? `
    <div class="admin-bike__pricing">
      <div class="admin-bike__pricing-title">💰 Прайс аренды</div>
      <div class="admin-bike__pricing-grid">
        <div class="admin-bike__price-item"><span class="admin-bike__price-label">📅 День</span><span class="admin-bike__price-value">${formatCurrency(p.day || 0)}</span></div>
        <div class="admin-bike__price-item"><span class="admin-bike__price-label">📅 Неделя</span><span class="admin-bike__price-value">${formatCurrency(p.week || 0)}</span></div>
        <div class="admin-bike__price-item"><span class="admin-bike__price-label">📅 Месяц</span><span class="admin-bike__price-value">${formatCurrency(p.month || 0)}</span></div>
      </div>
    </div>` : '';

  const shopPricing = !isRent ? `
    <div class="admin-bike__pricing">
      <div class="admin-bike__pricing-title">🏷️ Цена продажи</div>
      <div class="admin-bike__pricing-grid" style="grid-template-columns:1fr;max-width:160px">
        <div class="admin-bike__price-item"><span class="admin-bike__price-label">💵 Цена</span><span class="admin-bike__price-value">${formatCurrency(item.price || 0)}</span></div>
      </div>
    </div>` : '';

  const descHtml = !isRent && item.description ? `<div class="admin-bike__desc">📝 ${item.description}</div>` : '';

  return `
    <div class="admin-bike">
      <div class="admin-bike__header">
        <span class="admin-bike__name">${item.name}</span>
        <button class="admin-bike__status-toggle ${statusClass}" onclick="${isRent ? `toggleStatus(${item.id})` : `toggleShopStatus(${item.id})`}">${statusText}</button>
      </div>
      <div class="admin-bike__body">
        <div class="admin-bike__left">
          <div class="admin-bike__photo" onclick="setBikePhoto(${item.id},'${mode}')">
            ${bikeImg ? `<img src="${bikeImg}" alt="${item.name}">` : '<span class="admin-bike__photo-placeholder">+ фото</span>'}
          </div>
          <div class="admin-bike__specs">${specsRows}</div>
          ${descHtml}
        </div>
        <div>
          ${pricingHtml}
          ${shopPricing}
          ${isRent ? `
          <div class="admin-bike__earnings">
            <div class="admin-bike__earnings-title">📊 Прибыль</div>
            <div class="admin-bike__earnings-month">📅 За месяц: <strong>${formatCurrency(monthEarn)}</strong></div>
            <div class="admin-bike__earnings-total">${formatCurrency(earnings)}</div>
            <div class="admin-bike__earnings-add">
              <input type="number" id="earnInput${item.id}" placeholder="Сумма" min="0">
              <button onclick="addEarningHandler(${item.id})">+ Добавить</button>
            </div>
            <div class="admin-bike__history">${historyHtml}</div>
          </div>` : ''}
        </div>
      </div>
      <div class="admin-bike__actions">
        <button class="admin-bike__reset" onclick="${isRent ? `resetEarningsHandler(${item.id})` : `''`}" ${isRent ? '' : 'style="opacity:0.3;pointer-events:none"'}>🔄 Сбросить прибыль</button>
        <button class="admin-bike__delete" onclick="${isRent ? `deleteBikeHandler(${item.id})` : `deleteShopHandler(${item.id})`}">🗑 Удалить</button>
      </div>
    </div>
  `;
}

function toggleStatus(id) { const b = getBikeById(id); if (b) { updateBike(id, { inStock: !b.inStock }); renderRent(); } }

/* ========== ADD BIKE (RENT) ========== */
function showAddForm(mode) {
  const id = mode === 'rent' ? 'rentAddForm' : 'shopAddForm';
  document.getElementById(id).style.display = 'block';
  document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideAddForm(mode) {
  const prefix = mode === 'rent' ? 'rent' : 'shop';
  document.getElementById(prefix + 'AddForm').style.display = 'none';
  document.getElementById(prefix + 'Name').value = '';
  document.getElementById(prefix + 'Power').value = '';
  document.getElementById(prefix + 'Speed').value = '';
  document.getElementById(prefix + 'Load').value = '';
  document.getElementById(prefix + 'Battery').value = '';
  const imgInput = document.getElementById(prefix + 'Image');
  if (imgInput) imgInput.value = '';
  const price = document.getElementById(prefix + 'Price');
  if (price) price.value = '';
  const pDay = document.getElementById(prefix + 'PriceDay');
  if (pDay) pDay.value = '';
  const pWeek = document.getElementById(prefix + 'PriceWeek');
  if (pWeek) pWeek.value = '';
  const pMonth = document.getElementById(prefix + 'PriceMonth');
  if (pMonth) pMonth.value = '';
  const desc = document.getElementById(prefix + 'Desc');
  if (desc) desc.value = '';
}

function saveNewBike() {
  const name = document.getElementById('rentName').value.trim();
  if (!name) { alert('Введите название'); return; }
  fileToDataUrl('rentImage', (image) => {
    addBike({
      name, inStock: true, image,
      specs: {
        "Мощность": document.getElementById('rentPower').value.trim() || '—',
        "Скорость": document.getElementById('rentSpeed').value.trim() || '—',
        "Нагрузка": document.getElementById('rentLoad').value.trim() || '—',
        "Ёмкость АКБ": document.getElementById('rentBattery').value.trim() || '—'
      },
      pricing: {
        day: Number(document.getElementById('rentPriceDay').value) || 0,
        week: Number(document.getElementById('rentPriceWeek').value) || 0,
        month: Number(document.getElementById('rentPriceMonth').value) || 0
      },
      earnings: []
    });
    hideAddForm('rent');
    renderRent();
  });
}

function addEarningHandler(id) {
  const input = document.getElementById('earnInput' + id);
  const amount = Number(input.value);
  if (!amount || amount <= 0) { alert('Введите сумму больше 0'); return; }
  addEarning(id, amount, '');
  input.value = '';
  renderRent();
}

function resetEarningsHandler(id) {
  if (!confirm('Сбросить всю прибыль?')) return;
  resetEarnings(id);
  renderRent();
}

function deleteBikeHandler(id) {
  const b = getBikeById(id);
  if (!confirm(`Удалить "${b.name}"?`)) return;
  deleteBike(id);
  renderRent();
}

function setBikePhoto(id, mode) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      if (mode === 'rent') { updateBike(id, { image: dataUrl }); renderRent(); }
      else { updateShopItem(id, { image: dataUrl }); renderShopAdmin(); }
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function fileToDataUrl(inputId, callback) {
  const input = document.getElementById(inputId);
  const file = input.files[0];
  if (!file) { callback(''); return; }
  const reader = new FileReader();
  reader.onload = (e) => callback(e.target.result);
  reader.readAsDataURL(file);
}

/* ========== SHOP ADMIN ========== */
function renderShopAdmin() {
  const items = getShopItems();
  const list = document.getElementById('adminShopList');
  list.innerHTML = items.length
    ? items.map(item => renderBikeCard(item, 'shop')).join('')
    : '<div style="text-align:center;padding:40px;color:var(--text-dim)">Товаров пока нет</div>';
}

function toggleShopStatus(id) {
  const item = getShopItemById(id);
  if (!item) return;
  updateShopItem(id, { inStock: !item.inStock });
  renderShopAdmin();
}

function saveNewShopItem() {
  const name = document.getElementById('shopName').value.trim();
  if (!name) { alert('Введите название'); return; }
  fileToDataUrl('shopImage', (image) => {
    addShopItem({
      name, inStock: true, image,
      specs: {
        "Мощность": document.getElementById('shopPower').value.trim() || '—',
        "Скорость": document.getElementById('shopSpeed').value.trim() || '—',
        "Нагрузка": document.getElementById('shopLoad').value.trim() || '—',
        "Ёмкость АКБ": document.getElementById('shopBattery').value.trim() || '—'
      },
      price: Number(document.getElementById('shopPrice').value) || 0,
      description: document.getElementById('shopDesc').value.trim() || '',
      earnings: []
    });
    hideAddForm('shop');
    renderShopAdmin();
  });
}

function deleteShopHandler(id) {
  const item = getShopItemById(id);
  if (!item) return;
  if (!confirm(`Удалить "${item.name}"?`)) return;
  deleteShopItem(id);
  renderShopAdmin();
}

/* ========== ORDERS ========== */
function renderOrders() {
  const orders = getOrders();
  const list = document.getElementById('adminOrdersList');
  if (!orders.length) {
    list.innerHTML = '<div class="admin-order-empty">Заявок пока нет</div>';
    return;
  }
  list.innerHTML = orders.slice().reverse().map(o => `
    <div class="admin-order">
      <div class="admin-order__info">
        <div class="admin-order__name">${o.itemName}</div>
        <div class="admin-order__meta">${o.name} · <span>${o.phone}</span></div>
        <div class="admin-order__date">${o.date}</div>
      </div>
      <button class="admin-order__delete" onclick="if(confirm('Удалить заявку?')){deleteOrder(${o.id});renderOrders();}">Готово</button>
    </div>
  `).join('');
}

onDataChange(renderAll);
document.addEventListener('DOMContentLoaded', renderAll);
