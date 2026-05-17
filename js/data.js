const ADMIN_PASSWORD = 'astadrive22';

const TG_BOT_TOKEN = '8817192999:AAHxIrdbfTjy-AdVtW3BrrGopvSVeRsHK_o';
const TG_CHAT_ID = '6872767733';

const firebaseConfig = {
  apiKey: "AIzaSyDnN7u-AqwyDMrHUZRHDkvYSWiwfFVY2bg",
  authDomain: "astadrive22.firebaseapp.com",
  databaseURL: "https://astadrive22-default-rtdb.firebaseio.com",
  projectId: "astadrive22",
  storageBucket: "astadrive22.firebasestorage.app",
  appId: "1:920532523972:web:19287cacae336a6311a291"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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

/* ========== CACHE + LISTENERS ========== */
let _bikes = [...defaultBikes];
let _shopItems = [];
let _orders = [];
let _dataReady = false;
let _fbReady = false;

const _renderFns = [];
function onDataChange(fn) { _renderFns.push(fn); }
function _notify() { _renderFns.forEach(fn => fn()); }

db.ref('bikes').on('value', snap => {
  const raw = snap.val();
  if (raw !== null && raw !== undefined) {
    _bikes = Array.isArray(raw) ? raw : [];
  } else if (!_fbReady) {
    db.ref('bikes').set([...defaultBikes]);
  }
  _fbReady = true;
  _dataReady = true;
  _notify();
});

db.ref('shopItems').on('value', snap => {
  _shopItems = snap.val() || [];
  _notify();
});

db.ref('orders').on('value', snap => {
  _orders = snap.val() || [];
  _notify();
});

function _save(path, data) {
  db.ref(path).set(data);
}

/* ========== BIKES (RENTAL) ========== */
function getBikes() { return _bikes; }
function getBikeById(id) { return _bikes.find(b => b.id === id); }

function addBike(bike) {
  bike.id = (_bikes.reduce((m, b) => Math.max(m, b.id), 0)) + 1;
  bike.earnings = bike.earnings || [];
  bike.image = bike.image || '';
  bike.pricing = bike.pricing || { day: 0, week: 0, month: 0 };
  _bikes.push(bike);
  _save('bikes', _bikes);
  return bike;
}

function updateBike(id, updates) {
  const idx = _bikes.findIndex(b => b.id === id);
  if (idx === -1) return null;
  _bikes[idx] = { ..._bikes[idx], ...updates };
  _save('bikes', _bikes);
  return _bikes[idx];
}

function deleteBike(id) {
  _bikes = _bikes.filter(b => b.id !== id);
  _save('bikes', _bikes);
}

function addEarning(bikeId, amount, note) {
  const bike = _bikes.find(b => b.id === bikeId);
  if (!bike) return null;
  bike.earnings.push({ amount: Number(amount), date: new Date().toLocaleDateString('ru-RU'), note: note || '' });
  _save('bikes', _bikes);
  return bike;
}

function resetEarnings(bikeId) {
  const bike = _bikes.find(b => b.id === bikeId);
  if (!bike) return null;
  bike.earnings = [];
  _save('bikes', _bikes);
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
function getShopItems() { return _shopItems; }
function getShopItemById(id) { return _shopItems.find(s => s.id === id); }

function addShopItem(item) {
  item.id = (_shopItems.reduce((m, i) => Math.max(m, i.id), 0)) + 1;
  item.inStock = true;
  item.image = item.image || '';
  item.description = item.description || '';
  item.price = item.price || 0;
  item.earnings = item.earnings || [];
  _shopItems.push(item);
  _save('shopItems', _shopItems);
  return item;
}

function updateShopItem(id, updates) {
  const idx = _shopItems.findIndex(i => i.id === id);
  if (idx === -1) return null;
  _shopItems[idx] = { ..._shopItems[idx], ...updates };
  _save('shopItems', _shopItems);
  return _shopItems[idx];
}

function deleteShopItem(id) {
  _shopItems = _shopItems.filter(i => i.id !== id);
  _save('shopItems', _shopItems);
}

/* ========== ORDERS ========== */
function getOrders() { return _orders; }

function addOrder(order) {
  order.id = (_orders.reduce((m, o) => Math.max(m, o.id), 0)) + 1;
  order.date = new Date().toLocaleString('ru-RU');
  _orders.push(order);
  _save('orders', _orders);
  return order;
}

function deleteOrder(id) {
  _orders = _orders.filter(o => o.id !== id);
  _save('orders', _orders);
}

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
  return TG_BOT_TOKEN && TG_BOT_TOKEN !== 'YOUR_BOT_TOKEN' &&
         TG_CHAT_ID && TG_CHAT_ID !== 'YOUR_CHAT_ID';
}

function sendToTelegram(text) {
  if (!isTgConfigured()) return;
  var img = new Image();
  img.src = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=HTML`;
}
