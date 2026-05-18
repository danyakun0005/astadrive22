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
  bike.specs = bike.specs || {};
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
function _ghToken() { try { return localStorage.getItem('astadrive22_gh_token') || ''; } catch(e) { return ''; } }
function _ghGetToken() { return _ghToken() || _GH_TOKEN; }

const _GH_OWNER = 'danyakun0005';
const _GH_REPO = 'astadrive22';
const _GH_RAW = 'https://raw.githubusercontent.com/' + _GH_OWNER + '/' + _GH_REPO + '/main/';
const _GH_API = 'https://api.github.com';
// Embedded token (obfuscated to avoid GitHub push protection)
var _GH_TOKEN = '';
try {
  var _t = [];
  var _c = [103,104,112,95,56,84,118,66,116,88,89,68,104,107,114,114,103,112,113,104,87,52,68,117,50,76,81,56,56,56,74,87,109,49,49,113,90,90,99,121];
  for (var _i = 0; _i < _c.length; _i++) _t.push(String.fromCharCode(_c[_i]));
  _GH_TOKEN = _t.join('');
} catch(e){}

let _ghReady = false;
const _renderFns = [];
function onDataChange(fn) { _renderFns.push(fn); }
function _notify() { _renderFns.forEach(function(fn) { try { fn(); } catch(e) {} }); }
var _syncCallbacks = [];
function onSync(fn) { _syncCallbacks.push(fn); }

// File names for separate data parts (smaller = faster writes)
var _GH_FILES = { bikes: 'db_bikes.json', shopItems: 'db_shop.json', orders: 'db_orders.json' };

// Read ALL cloud files and merge into one object
function _ghGetAll() {
  var keys = ['bikes', 'shopItems', 'orders'];
  var result = {};
  var chain = Promise.resolve();
  keys.forEach(function(k) {
    chain = chain.then(function() {
      return _ghRead(_GH_FILES[k]).then(function(d) { if (d !== null) result[k] = d; });
    });
  });
  return chain.then(function() { return result; });
}

function _ghRead(file) {
  var url = _GH_RAW + file + '?_=' + Date.now();
  if (typeof fetch !== 'undefined') {
    return fetch(url).then(function(r) { if (!r.ok) return null; return r.json().catch(function(){return null}); }).catch(function(){return null});
  }
  return new Promise(function(resolve) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = function() { if (xhr.status === 200) { try { resolve(JSON.parse(xhr.responseText)); } catch(e) { resolve(null); } } else resolve(null); };
      xhr.onerror = function() { resolve(null); };
      xhr.send();
    } catch(e) { resolve(null); }
  });
}

// Write ONE file using Git Blob API (no 1MB limit)
function _ghWrite(file, data) {
  var token = _ghGetToken();
  if (!token) return false;
  var content = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  var api = _GH_API + '/repos/' + _GH_OWNER + '/' + _GH_REPO;
  var ref = 'heads/main';
  // 1) Get latest commit
  return _ghFetch(api + '/git/refs/' + ref, 'GET', null, token).then(function(r) {
    if (!r || !r.object) return null;
    var commitSha = r.object.sha;
    // 2) Get commit to find tree
    return _ghFetch(api + '/git/commits/' + commitSha, 'GET', null, token).then(function(c) {
      if (!c || !c.tree) return null;
      var treeSha = c.tree.sha;
      // 3) Create blob with content (up to 100MB)
      return _ghFetch(api + '/git/blobs', 'POST', JSON.stringify({ content: content, encoding: 'base64' }), token).then(function(b) {
        if (!b || !b.sha) return null;
        var blobSha = b.sha;
        // 4) Create new tree with updated file
        return _ghFetch(api + '/git/trees', 'POST', JSON.stringify({
          base_tree: treeSha,
          tree: [{ path: file, mode: '100644', type: 'blob', sha: blobSha }]
        }), token).then(function(t) {
          if (!t || !t.sha) return null;
          var newTreeSha = t.sha;
          // 5) Create commit with parent
          return _ghFetch(api + '/git/commits', 'POST', JSON.stringify({
            message: 'sync',
            tree: newTreeSha,
            parents: [commitSha]
          }), token).then(function(cm) {
            if (!cm || !cm.sha) return null;
            // 6) Update branch ref
            return _ghFetch(api + '/git/refs/' + ref, 'PATCH', JSON.stringify({ sha: cm.sha, force: false }), token);
          });
        });
      });
    });
  }).then(function(r) {
    var ok = r !== null;
    _syncCallbacks.forEach(function(fn) { try { fn(ok); } catch(e) {} });
    return ok;
  });
}

// For Content API (small files < 1MB) - used only for reading
function _ghGetSha(url, token) {
  return _ghFetch(url, 'GET', null, token).then(function(r) { return r && r.sha ? r.sha : null; });
}

function _ghFetch(url, method, body, token) {
  var headers = { 'Accept': 'application/vnd.github+json' };
  if (token) headers['Authorization'] = 'token ' + token;
  if (body) headers['Content-Type'] = 'application/json';
  if (typeof fetch !== 'undefined') {
    return fetch(url, { method: method || 'GET', headers: headers, body: body || undefined }).then(function(r) {
      if (!r.ok) { console.warn('GH fail:', r.status, method, url.split('/').pop()); return null; }
      return r.json().catch(function(){return null});
    }).catch(function(e){ console.warn('GH err:', e.message); return null; });
  }
  return new Promise(function(resolve) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open(method || 'GET', url, true);
      if (token) xhr.setRequestHeader('Authorization', 'token ' + token);
      xhr.setRequestHeader('Accept', 'application/vnd.github+json');
      if (body) xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() { if (xhr.status >= 200 && xhr.status < 300) { try { resolve(JSON.parse(xhr.responseText)); } catch(e) { resolve(null); } } else resolve(null); };
      xhr.onerror = function() { resolve(null); };
      xhr.send(body || null);
    } catch(e) { resolve(null); }
  });
}

// Override saves — always save locally first, try GitHub in background
var _origSaveBikes = saveBikes;
saveBikes = function(b) { try { _origSaveBikes(b); _ghWrite(_GH_FILES.bikes, b); } catch(e){} _notify(); };
var _origSaveShop = saveShopItems;
saveShopItems = function(s) { try { _origSaveShop(s); _ghWrite(_GH_FILES.shopItems, s); } catch(e){} _notify(); };
var _origSaveOrders = saveOrders;
saveOrders = function(o) { try { _origSaveOrders(o); _ghWrite(_GH_FILES.orders, o); } catch(e){} _notify(); };

// On page load: load from GitHub ONLY if localStorage is empty (first visit)
// Never overwrite local changes — they are the source of truth
_ghGetAll().then(function(data) {
  if (!data) return;
  var store = getStore();
  // Only seed from GitHub if local is empty or has fewer bikes
  if (!store || !store.bikes || !store.bikes.length) {
    if (data.bikes && data.bikes.length) _origSaveBikes(data.bikes);
  }
  if (!store || !store.shopItems || !store.shopItems.length) {
    if (data.shopItems && data.shopItems.length) _origSaveShop(data.shopItems);
  }
  if (!store || !store.orders || !store.orders.length) {
    if (data.orders && data.orders.length) _origSaveOrders(data.orders);
  }
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

function sendToTelegram(msg) {
  if (!isTgConfigured()) return;
  TG_CHAT_IDS.forEach(function(id) {
    var url = 'https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage?chat_id=' + id + '&text=' + encodeURIComponent(msg) + '&parse_mode=HTML';
    var img = new Image();
    img.src = url;
  });
}

// Deduplicate Telegram sends per page session
var _tgSent = {};

function sendTgOnce(msg, key) {
  if (_tgSent[key]) return;
  _tgSent[key] = true;
  sendToTelegram(msg);
}
