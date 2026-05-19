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
  } else if (tab === 'settings') {
    document.getElementById('adminSettings').style.display = 'block';
    document.getElementById('tabSettings').classList.add('active');
    loadSettings();
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
  try {
  var isRent = mode === 'rent';
  var earnings = totalEarnings(item);
  var monthEarn = monthlyEarnings(item);
  var p = item.pricing || {};
  var statusClass = item.inStock ? 'available' : 'rented';
  var statusText = item.inStock ? 'В наличии' : 'В аренде';
  var bikeImg = item.image || '';
  var name = item.name || 'Без названия';
  var id = item.id || 0;

  var adminEmoji = { "Мощность":"⚡", "Скорость":"🚀", "Нагрузка":"🏋️", "Ёмкость АКБ":"🔋" };
  var specs = item.specs || {};
  var specsRows = Object.keys(specs).map(function(k) {
    var emoji = adminEmoji[k] || '';
    var val = specs[k] || '—';
    return '<div class="admin-bike__spec"><span class="admin-bike__spec-label">'+emoji+' '+k+'</span><span class="admin-bike__spec-value">'+val+'</span></div>';
  }).join('');

  var earningsArr = item.earnings || [];
  var historyHtml = earningsArr.slice().reverse().map(function(e) {
    return '<div class="admin-bike__history-item"><span>💵 +'+formatCurrency(e.amount)+'</span><span>📅 '+(e.date||'')+'</span></div>';
  }).join('');
  if (!historyHtml) historyHtml = '<div class="admin-bike__history-empty">Нет записей</div>';

  var pricingHtml = '';
  if (isRent) {
    pricingHtml = '<div class="admin-bike__pricing"><div class="admin-bike__pricing-title">💰 Прайс аренды</div><div class="admin-bike__pricing-grid">' +
      '<div class="admin-bike__price-item"><span class="admin-bike__price-label">📅 День</span><span class="admin-bike__price-value">'+formatCurrency(p.day||0)+'</span></div>' +
      '<div class="admin-bike__price-item"><span class="admin-bike__price-label">📅 Неделя</span><span class="admin-bike__price-value">'+formatCurrency(p.week||0)+'</span></div>' +
      '<div class="admin-bike__price-item"><span class="admin-bike__price-label">📅 Месяц</span><span class="admin-bike__price-value">'+formatCurrency(p.month||0)+'</span></div>' +
      '</div></div>';
  }

  var shopPricing = '';
  if (!isRent) {
    shopPricing = '<div class="admin-bike__pricing"><div class="admin-bike__pricing-title">🏷️ Цена продажи</div><div class="admin-bike__pricing-grid" style="grid-template-columns:1fr;max-width:160px">' +
      '<div class="admin-bike__price-item"><span class="admin-bike__price-label">💵 Цена</span><span class="admin-bike__price-value">'+formatCurrency(item.price||0)+'</span></div>' +
      '</div></div>';
  }

  var descHtml = '';
  if (!isRent && item.description) descHtml = '<div class="admin-bike__desc">📝 '+item.description+'</div>';

  var toggleOnclick = isRent ? "toggleStatus("+id+")" : "toggleShopStatus("+id+")";
  var photoOnclick = "setBikePhoto("+id+",'"+mode+"')";
  var resetOnclick = isRent ? "resetEarningsHandler("+id+")" : "";
  var deleteOnclick = isRent ? "deleteBikeHandler("+id+")" : "deleteShopHandler("+id+")";
  var addEarnOnclick = "addEarningHandler("+id+")";
  var resetStyle = isRent ? "" : ' style="opacity:0.3;pointer-events:none"';
  var photoHtml = bikeImg ? '<img src="'+bikeImg+'" alt="'+name+'">' : '<span class="admin-bike__photo-placeholder">+ фото</span>';
  var earnSection = '';
  if (isRent) {
    earnSection = '<div class="admin-bike__earnings"><div class="admin-bike__earnings-title">📊 Прибыль</div>' +
      '<div class="admin-bike__earnings-month">📅 За месяц: <strong>'+formatCurrency(monthEarn)+'</strong></div>' +
      '<div class="admin-bike__earnings-total">'+formatCurrency(earnings)+'</div>' +
      '<div class="admin-bike__earnings-add"><input type="number" id="earnInput'+id+'" placeholder="Сумма" min="0"><button onclick="'+addEarnOnclick+'">+ Добавить</button></div>' +
      '<div class="admin-bike__history">'+historyHtml+'</div></div>';
  }

  return '<div class="admin-bike">' +
    '<div class="admin-bike__header"><span class="admin-bike__name">'+name+'</span>' +
    '<button class="admin-bike__status-toggle '+statusClass+'" onclick="'+toggleOnclick+'">'+statusText+'</button></div>' +
    '<div class="admin-bike__body"><div class="admin-bike__left">' +
    '<div class="admin-bike__photo" onclick="'+photoOnclick+'">'+photoHtml+'</div>' +
    '<div class="admin-bike__specs">'+specsRows+'</div>'+descHtml+'</div><div>' +
    pricingHtml+shopPricing+earnSection+'</div></div>' +
    '<div class="admin-bike__actions">' +
    '<button class="admin-bike__reset" onclick="'+resetOnclick+'"'+resetStyle+'>🔄 Сбросить прибыль</button>' +
    '<button class="admin-bike__delete" onclick="'+deleteOnclick+'">🗑 Удалить</button></div></div>';
  } catch(e) { console.error('renderBikeCard err', e); return '<div style="color:red;padding:10px">Ошибка: '+e.message+'</div>'; }
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

/* ========== SETTINGS ========== */
function checkApiStatus() {
  var el = document.getElementById('syncStatus');
  if (!el) return;
  el.innerHTML = '⏳ Проверка...';
  fetch(_API_URL).then(function(r) {
    el.innerHTML = r.ok ? '✅ Сервер работает, данные синхронизируются' : '❌ Сервер ответил ' + r.status;
  }).catch(function() {
    el.innerHTML = '❌ Нет соединения с сервером';
  });
}

function loadSettings() {
  checkApiStatus();
}

/* ========== EXPORT / IMPORT ========== */
function exportData() {
  var d = getStore();
  if (!d) { alert('Нет данных для экспорта'); return; }
  var blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'astadrive22_backup.json';
  a.click();
}

function importData(e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    try {
      var data = JSON.parse(ev.target.result);
      if (!data || typeof data !== 'object') { alert('Неверный формат файла'); return; }
      // Save to localStorage
      var store = getStore() || {};
      if (data.bikes) store.bikes = data.bikes;
      if (data.shopItems) store.shopItems = data.shopItems;
      if (data.orders) store.orders = data.orders;
      if (data.version) store.version = data.version;
      saveStore(store);
      if (data.bikes || data.shopItems || data.orders) try { _apiWrite(data); } catch(ex) {}
      renderAll();
      alert('✅ Данные импортированы!');
    } catch(err) { alert('Ошибка импорта: ' + err.message); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
  renderAll();
  onDataChange(renderAll);
  onSync(function(ok) {
    var el = document.getElementById('adminSyncStatus');
    if (!el) return;
    el.textContent = ok ? '✅' : '❌';
    el.title = ok ? 'Синхронизация OK' : 'Ошибка синхронизации GitHub';
    setTimeout(function() { el.textContent = '⏳'; }, 4000);
  });
});
