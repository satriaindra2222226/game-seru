// ---------- Screen 1: dodge logic ----------
const noBtn = document.getElementById('noBtn');
const area = document.getElementById('buttonArea');
const hint = document.getElementById('hintText');
let dodgeCount = 0;

const hints = [
  'Coba klik tombol "No" itu... kalau bisa 😏',
  "Yakin mau klik No? 👀",
  "Hmm, kok susah ya... 🤔",
  "Udah dicoba berapa kali tuh? 😂",
  "Nyerah aja deh, pencet Yes~ 💕",
  "Tombol No-nya emang gak niat dipencet 🙈"
];

function dodge(e) {
  if (e) e.preventDefault();
  dodgeCount++;
  const maxLeft = area.clientWidth - noBtn.clientWidth;
  const maxTop = area.clientHeight - noBtn.clientHeight;
  const newLeft = Math.random() * Math.max(maxLeft, 0);
  const newTop = Math.random() * Math.max(maxTop, 0);
  noBtn.style.left = newLeft + 'px';
  noBtn.style.top = newTop + 'px';
  noBtn.style.transform = 'none';
  hint.textContent = hints[Math.min(dodgeCount, hints.length - 1)];
}

function launchConfetti() {
  const emojis = ['🎉','💖','💌','😍','✨','💐'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (2 + Math.random() * 2) + 's';
    el.style.fontSize = (16 + Math.random() * 16) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ---------- Screen switching ----------
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ---------- Screen 3: schedule (time picker) ----------
const hourSelect = document.getElementById('hourSelect');
const minuteSelect = document.getElementById('minuteSelect');
const ampmSelect = document.getElementById('ampmSelect');
const timePreview = document.getElementById('timePreview');

// isi opsi jam 1-12
for (let h = 1; h <= 12; h++) {
  const opt = document.createElement('option');
  opt.value = h;
  opt.textContent = h;
  hourSelect.appendChild(opt);
}

// isi opsi menit 00, 05, 10 ... 55
for (let m = 0; m < 60; m += 5) {
  const opt = document.createElement('option');
  const val = m.toString().padStart(2, '0');
  opt.value = val;
  opt.textContent = val;
  minuteSelect.appendChild(opt);
}

// default: 6:00 PM
hourSelect.value = 6;
minuteSelect.value = '00';
ampmSelect.value = 'PM';

function updateTimePreview() {
  const h = hourSelect.value;
  const m = minuteSelect.value;
  const ap = ampmSelect.value;
  timePreview.textContent = `🕒 ${h}:${m} ${ap}`;
}

[hourSelect, minuteSelect, ampmSelect].forEach(sel => {
  sel.addEventListener('change', updateTimePreview);
});

updateTimePreview();

function getSelectedTime() {
  return `${hourSelect.value}:${minuteSelect.value} ${ampmSelect.value}`;
}

// default date = today
const dateInput = document.getElementById('dateInput');
const today = new Date();
dateInput.value = today.toISOString().split('T')[0];

function goToFood() {
  goTo('screen4');
}

// ---------- Screen 4: food ----------
function goToSummary() {
  const dateVal = new Date(dateInput.value + 'T00:00:00');
  const dateStr = dateVal.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
 
  // Ambil teks dari textarea
  const foodInputValue = document.getElementById('foodInput').value.trim();
  
  // Jika diisi pake isiannya, kalo kosong otomatis jadi fallback
  const finalFood = foodInputValue !== '' ? foodInputValue : 'Surprise me! 🍽️';

  document.getElementById('sumWhen').textContent = dateStr + ' at ' + getSelectedTime();
  document.getElementById('sumFood').textContent = finalFood;
 
  goTo('screen5');
  launchConfetti();
}

// ---------- Screen 5: copy & send via WhatsApp ----------
const WHATSAPP_NUMBER = '6285158826039'; // format internasional, tanpa + atau spasi

function copyAndText() {
  const when = document.getElementById('sumWhen').textContent;
  const food = document.getElementById('sumFood').textContent;
  const message = `it's a date! 💌\n\nWhen: ${when}\nFood: ${food}\n\nsee you there 🥰`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).catch(() => {});
  }

  // Buka WhatsApp ke nomor tujuan dengan pesan plan sudah terisi otomatis
  const waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  window.location.href = waUrl;
}