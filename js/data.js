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

/* ========== FIREBASE CLOUD SYNC (REST API — no SDK needed) ========== */
const _FB_URL = 'https://astadrive22-default-rtdb.firebaseio.com';

let _fbBikes = [];
let _fbReady = false;
const _renderFns = [];
function onDataChange(fn) { _renderFns.push(fn); }
function _notify() { _renderFns.forEach(function(fn) { try { fn(); } catch(e) {} }); }

function _fbFetch(path, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', _FB_URL + '/' + path + '.json', true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      try { cb(JSON.parse(xhr.responseText)); } catch(e) { cb(null); }
    } else { cb(null); }
  };
  xhr.onerror = function() { cb(null); };
  xhr.send();
}

function _fbPut(path, data) {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', _FB_URL + '/' + path + '.json', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  } catch(e) {}
}

function _fbObjToArr(obj) {
  if (Array.isArray(obj)) return obj;
  if (obj && typeof obj === 'object') return Object.keys(obj).map(function(k) { return obj[k]; });
  return [];
}

function _fbPullAndSync(probeData) {
  var bikes = probeData ? _fbObjToArr(probeData.bikes) : [];
  var shop = probeData ? _fbObjToArr(probeData.shopItems) : [];
  var orders = probeData ? _fbObjToArr(probeData.orders) : [];
  var changed = false;
  if (bikes.length) { saveBikes(bikes); changed = true; }
  if (shop.length) { saveShopItems(shop); changed = true; }
  if (orders.length) { saveOrders(orders); changed = true; }
  if (changed) _notify();
  // Override saves to push to cloud
  var _origSaveBikes = saveBikes;
  saveBikes = function(b) { _origSaveBikes(b); _fbPut('bikes', b); };
  var _origSaveShop = saveShopItems;
  saveShopItems = function(s) { _origSaveShop(s); _fbPut('shopItems', s); };
  var _origSaveOrders = saveOrders;
  saveOrders = function(o) { _origSaveOrders(o); _fbPut('orders', o); };
}

// Probe Firebase connection
_fbFetch('.json', function(data) {
  if (data === null) return; // Firebase unreachable
  var hasCloud = (data.bikes && _fbObjToArr(data.bikes).length) ||
                 (data.shopItems && _fbObjToArr(data.shopItems).length);
  if (!hasCloud) {
    // No cloud data — push local to cloud first
    var store = getStore();
    if (store) {
      _fbPut('bikes', store.bikes || getBikes());
      _fbPut('shopItems', store.shopItems || getShopItems());
    } else {
      _fbPut('bikes', getBikes());
    }
  }
  _fbPullAndSync(data); // pull cloud data + override saves
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
    var img = new Image();
    img.src = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${id}&text=${encodeURIComponent(text)}&parse_mode=HTML`;
  });
}
