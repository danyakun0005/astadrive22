const ADMIN_PASSWORD = 'astadrive22';

const TG_BOT_TOKEN = '8817192999:AAHxIrdbfTjy-AdVtW3BrrGopvSVeRsHK_o';
const TG_CHAT_IDS = ['6872767733', '1343934856'];

const STORAGE_KEY = 'astadrive22_data';
const DATA_VERSION = 4;

const defaultBikes = [
  { id: 1, name: "Maikolin H10", inStock: true, image: '',
    specs: { "Мощность": "240W (1500W)", "Скорость": "до 70 км/ч", "Нагрузка": "до 120 кг", "Ёмкость АКБ": "70Ah (15ч+)" },
    pricing: { day: 1000, week: 4000, month: 14500 }, earnings: [] },
  { id: 2, name: "Wenbox U3 Pro 1", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "110 кг", "Ёмкость АКБ": "45Ah (10-12ч)" },
    pricing: { day: 900, week: 3500, month: 12500 }, earnings: [] },
  { id: 3, name: "Wenbox U3 Pro 2", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "110 кг", "Ёмкость АКБ": "45Ah (10-12ч)" },
    pricing: { day: 900, week: 3500, month: 12500 }, earnings: [] },
  { id: 4, name: "Wenbox U3 Pro 3", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "110 кг", "Ёмкость АКБ": "45Ah (10-12ч)" },
    pricing: { day: 900, week: 3500, month: 12500 }, earnings: [] },
  { id: 5, name: "Wenbox U3 Pro 4", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "110 кг", "Ёмкость АКБ": "45Ah (10-12ч)" },
    pricing: { day: 900, week: 3500, month: 12500 }, earnings: [] },
  { id: 6, name: "Wenbox U3 Pro 5", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "110 кг", "Ёмкость АКБ": "45Ah (10-12ч)" },
    pricing: { day: 900, week: 3500, month: 12500 }, earnings: [] },
  { id: 7, name: "Wenbox U3 Pro 6", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "110 кг", "Ёмкость АКБ": "45Ah (10-12ч)" },
    pricing: { day: 900, week: 3500, month: 12500 }, earnings: [] },
  { id: 8, name: "Wenbox U3 Pro 7", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "110 кг", "Ёмкость АКБ": "45Ah (10-12ч)" },
    pricing: { day: 900, week: 3500, month: 12500 }, earnings: [] },
  { id: 9, name: "Wenbox U1 1", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "110 кг", "Ёмкость АКБ": "45Ah (10-12ч)" },
    pricing: { day: 900, week: 3500, month: 12500 }, earnings: [] },
  { id: 10, name: "Wenbox U1 2", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "110 кг", "Ёмкость АКБ": "45Ah (10-12ч)" },
    pricing: { day: 900, week: 3500, month: 12500 }, earnings: [] },
  { id: 11, name: "Kugoo V3 Pro Plus", inStock: true, image: '',
    specs: { "Мощность": "240W (1200W)", "Скорость": "до 70 км/ч", "Нагрузка": "100 кг", "Ёмкость АКБ": "28.6Ah + 21Ah" },
    pricing: { day: 750, week: 2800, month: 10500 }, earnings: [] }
];

/* ========== LOCAL STORAGE (always works) ========== */
function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && typeof data === 'object') return data;
    }
  } catch (e) {}
  return null;
}

function saveStore(store) {
  try {
    store.version = DATA_VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch(e) {}
}

function _mergeStore(updates) {
  try {
    const store = getStore() || {};
    Object.assign(store, updates);
    saveStore(store);
  } catch(e) {}
}

/* ========== BIKES ========== */
function getBikes() {
  try {
    const store = getStore();
    if (store && store.bikes && store.bikes.length) return store.bikes;
  } catch(e) {}
  return defaultBikes;
}

function saveBikes(bikes) {
  _mergeStore({ bikes: bikes });
}

function getBikeById(id) { return getBikes().find(b => b.id === id); }

function addBike(bike) {
  const bikes = getBikes();
  bike.id = (bikes.reduce((m, b) => Math.max(m, b.id), 0)) + 1;
  bike.earnings = bike.earnings || [];
  bike.image = bike.image || '';
  bike.pricing = bike.pricing || { day: 0, week: 0, month: 0 };
  bikes.push(bike);
  saveBikes(bikes);
  return bike;
}

function updateBike(id, updates) {
  const bikes = getBikes();
  const idx = bikes.findIndex(b => b.id === id);
  if (idx === -1) return null;
  bikes[idx] = { ...bikes[idx], ...updates };
  saveBikes(bikes);
  return bikes[idx];
}

function deleteBike(id) {
  let bikes = getBikes();
  saveBikes(bikes.filter(b => b.id !== id));
}

function addEarning(bikeId, amount, note) {
  const bikes = getBikes();
  const bike = bikes.find(b => b.id === bikeId);
  if (!bike) return null;
  bike.earnings.push({ amount: Number(amount), date: new Date().toLocaleDateString('ru-RU'), note: note || '' });
  saveBikes(bikes);
  return bike;
}

function resetEarnings(bikeId) {
  const bikes = getBikes();
  const bike = bikes.find(b => b.id === bikeId);
  if (!bike) return null;
  bike.earnings = [];
  saveBikes(bikes);
  return bike;
}

function totalEarnings(bike) {
  return (bike.earnings || []).reduce((sum, e) => sum + Number(e.amount), 0);
}

function monthlyEarnings(bike) {
  const now = new Date();
  const month = now.getMonth(), year = now.getFullYear();
  return (bike.earnings || []).filter(e => {
    const d = parseDate(e.date);
    return d && d.getMonth() === month && d.getFullYear() === year;
  }).reduce((sum, e) => sum + Number(e.amount), 0);
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split('.');
  if (parts.length === 3) return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  return null;
}

function formatCurrency(amount) {
  return Number(amount).toLocaleString('ru-RU') + ' ₽';
}

/* ========== SHOP ITEMS ========== */
function getShopItems() {
  try {
    const store = getStore();
    if (store && store.shopItems) return store.shopItems;
  } catch(e) {}
  return [];
}

function saveShopItems(items) {
  _mergeStore({ shopItems: items });
}

function getShopItemById(id) { return getShopItems().find(s => s.id === id); }

function addShopItem(item) {
  const items = getShopItems();
  item.id = (items.reduce((m, i) => Math.max(m, i.id), 0)) + 1;
  item.inStock = true;
  item.image = item.image || '';
  item.description = item.description || '';
  item.price = item.price || 0;
  items.push(item);
  saveShopItems(items);
  return item;
}

function updateShopItem(id, updates) {
  const items = getShopItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  saveShopItems(items);
  return items[idx];
}

function deleteShopItem(id) {
  saveShopItems(getShopItems().filter(i => i.id !== id));
}

/* ========== ORDERS ========== */
function getOrders() {
  try {
    const store = getStore();
    if (store && store.orders) return store.orders;
  } catch(e) {}
  return [];
}

function saveOrders(orders) {
  _mergeStore({ orders: orders });
}

function addOrder(order) {
  const orders = getOrders();
  order.id = (orders.reduce((m, o) => Math.max(m, o.id), 0)) + 1;
  order.date = new Date().toLocaleString('ru-RU');
  order.type = order.type || '';
  order.tg = order.tg || '';
  order.vk = order.vk || '';
  order.wa = order.wa || '';
  orders.push(order);
  saveOrders(orders);
  return order;
}

function deleteOrder(id) {
  saveOrders(getOrders().filter(o => o.id !== id));
}

/* ========== GITHUB CLOUD SYNC ========== */
// Token stored in localStorage (set once in admin settings)
function _ghToken() { try { return localStorage.getItem('astadrive22_gh_token') || ''; } catch(e) { return ''; } }

const _GH_OWNER = 'danyakun0005';
const _GH_REPO = 'astadrive22';
const _GH_PATH = 'db.json';
const _GH_RAW = 'https://raw.githubusercontent.com/' + _GH_OWNER + '/' + _GH_REPO + '/main/' + _GH_PATH;
const _GH_API = 'https://api.github.com';

let _ghReady = false;
let _ghSha = null;
const _renderFns = [];
function onDataChange(fn) { _renderFns.push(fn); }
function _notify() { _renderFns.forEach(function(fn) { try { fn(); } catch(e) {} }); }

// Read from raw.githubusercontent.com — no token needed (works on all devices)
function _ghGet() {
  if (typeof fetch !== 'undefined') {
    return fetch(_GH_RAW + '?_=' + Date.now()).then(function(r) {
      if (!r.ok) return null;
      return r.json().catch(function(){return null});
    }).catch(function(){return null});
  }
  return new Promise(function(resolve) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', _GH_RAW + '?_=' + Date.now(), true);
      xhr.onload = function() {
        if (xhr.status === 200) { try { resolve(JSON.parse(xhr.responseText)); } catch(e) { resolve(null); } }
        else resolve(null);
      };
      xhr.onerror = function() { resolve(null); };
      xhr.send();
    } catch(e) { resolve(null); }
  });
}

// Write via API — needs token from localStorage (admin only)
function _ghPut(data) {
  var token = _ghToken();
  if (!token) return;
  var url = _GH_API + '/repos/' + _GH_OWNER + '/' + _GH_REPO + '/contents/' + _GH_PATH;
  // Get SHA then write
  var promise = _ghSha ? Promise.resolve(_ghSha) : _ghGetSha(token).then(function(sha){ _ghSha = sha; return sha; });
  return promise.then(function(sha) {
    var content = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    var body = JSON.stringify({ message: 'sync update', content: content, sha: sha || undefined });
    return _ghFetch(url, 'PUT', body, token).then(function(r) {
      if (r && r.content) _ghSha = r.content.sha;
    }).catch(function(){});
  });
}

function _ghGetSha(token) {
  var url = _GH_API + '/repos/' + _GH_OWNER + '/' + _GH_REPO + '/contents/' + _GH_PATH;
  return _ghFetch(url, 'GET', null, token).then(function(r) {
    if (r && r.sha) return r.sha;
    return null;
  });
}

function _ghFetch(url, method, body, token) {
  var headers = { 'Accept': 'application/vnd.github+json' };
  if (token) headers['Authorization'] = 'token ' + token;
  if (typeof fetch !== 'undefined') {
    return fetch(url, {
      method: method || 'GET',
      headers: headers,
      body: body || undefined
    }).then(function(r) {
      if (!r.ok) { console.warn('GH fail:', r.status); return null; }
      return r.json().catch(function(){return null});
    }).catch(function(e){ console.warn('GH err:', e); return null; });
  }
  return new Promise(function(resolve) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open(method || 'GET', url, true);
      if (token) xhr.setRequestHeader('Authorization', 'token ' + token);
      xhr.setRequestHeader('Accept', 'application/vnd.github+json');
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { resolve(JSON.parse(xhr.responseText)); } catch(e) { resolve(null); }
        } else { resolve(null); }
      };
      xhr.onerror = function() { resolve(null); };
      xhr.send(body || null);
    } catch(e) { resolve(null); }
  });
}

// Override saves — push to GitHub on every change
var _origSaveBikes = saveBikes;
saveBikes = function(b) { _origSaveBikes(b); try { _ghPut({ bikes: b, shopItems: getShopItems(), orders: getOrders() }); } catch(e){} };
var _origSaveShop = saveShopItems;
saveShopItems = function(s) { _origSaveShop(s); try { _ghPut({ bikes: getBikes(), shopItems: s, orders: getOrders() }); } catch(e){} };
var _origSaveOrders = saveOrders;
saveOrders = function(o) { _origSaveOrders(o); try { _ghPut({ bikes: getBikes(), shopItems: getShopItems(), orders: o }); } catch(e){} };

// Pull cloud data into localStorage (no token needed)
_ghGet().then(function(data) {
  if (!data) return;
  if (data.bikes && data.bikes.length) { _origSaveBikes(data.bikes); }
  if (data.shopItems && data.shopItems.length) { _origSaveShop(data.shopItems); }
  if (data.orders && data.orders.length) { _origSaveOrders(data.orders); }
  _ghReady = true;
  _notify();
});

/* ========== UTILITIES ========== */
function maskPhone(input) {
  let digits = input.value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = digits.slice(1);
  if (digits.startsWith('7')) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  let res = '+7';
  if (digits.length > 0) res += ' (' + digits.slice(0, 3);
  if (digits.length > 3) res += ') ' + digits.slice(3, 6);
  if (digits.length > 6) res += '-' + digits.slice(6, 8);
  if (digits.length > 8) res += '-' + digits.slice(8, 10);
  input.value = res;
}

function validateRussianPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('7');
}

function isTgConfigured() {
  return TG_BOT_TOKEN && TG_BOT_TOKEN !== 'YOUR_BOT_TOKEN';
}

function sendToTelegram(text) {
  if (!isTgConfigured()) return;
  TG_CHAT_IDS.forEach(function(id) {
    var fullUrl = 'https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage?chat_id=' + id + '&text=' + encodeURIComponent(text) + '&parse_mode=HTML';
    if (typeof fetch !== 'undefined') {
      fetch(fullUrl, { method: 'GET', mode: 'no-cors' }).catch(function(){});
    }
    var img = new Image();
    img.src = fullUrl;
  });
}

// Track sent orders to avoid duplicates
var _sentOrderIds = {};

function trySendPendingNotifications() {
  var orders = getOrders();
  var token = _ghToken();
  if (!token || !orders.length) return;
  orders.forEach(function(o) {
    if (_sentOrderIds[o.id]) return;
    if (!o.phone && o.type !== 'callback') return;
    var msg = '<b>⚡ Новая заявка</b>\n\n';
    msg += '<b>Товар:</b> ' + (o.itemName || '—') + '\n';
    msg += '<b>Тип:</b> ' + ({rent:'Аренда',shop:'Покупка',callback:'Звонок'}[o.type] || o.type) + '\n';
    if (o.name && o.name !== o.phone) msg += '<b>Имя:</b> ' + o.name + '\n';
    msg += '<b>Телефон:</b> ' + o.phone + '\n';
    if (o.tg) msg += '<b>TG:</b> ' + o.tg + '\n';
    if (o.vk) msg += '<b>VK:</b> ' + o.vk + '\n';
    if (o.wa) msg += '<b>WA:</b> ' + o.wa + '\n';
    msg += '\n📅 ' + o.date;
    TG_CHAT_IDS.forEach(function(chatId) {
      var url = 'https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage?chat_id=' + chatId + '&text=' + encodeURIComponent(msg) + '&parse_mode=HTML';
      if (typeof fetch !== 'undefined') { fetch(url, { method: 'GET', mode: 'no-cors' }).catch(function(){}); }
      try { var img = new Image(); img.src = url; } catch(e) {}
    });
    _sentOrderIds[o.id] = true;
  });
}

// Retry pending notifications every time cloud data syncs
var _origNotify = _notify;
_notify = function() { _origNotify(); trySendPendingNotifications(); };
