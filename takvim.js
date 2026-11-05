"use strict";
const byId = id => document.getElementById(id);
const dayMs = 86400000;
const iso = date => date.toISOString().slice(0, 10);
const fromKey = key => new Date(key + "T00:00:00Z");
const format = (date, options) => date.toLocaleDateString("tr-TR", { ...options, timeZone: "UTC" });
const todayKey = new Intl.DateTimeFormat("sv-SE", {timeZone: "Europe/Istanbul"}).format(new Date());
let selected = fromKey(todayKey);
let events = [];
let failed = false;

function matches(start, end) {
  return events.filter(item => item.baslangic <= end && item.bitis >= start);
}
function list(element, items, empty) {
  element.replaceChildren();
  if (failed || !items.length) {
    element.textContent = failed ? "Etkinlik listesi yüklenemedi. Sayfayı yenileyebilirsin." : empty;
    return;
  }
  for (const item of items) {
    const row = document.createElement("article");
    row.className = "event";
    const date = document.createElement("small");
    const short = key => format(fromKey(key), {day:"numeric", month:"short"});
    date.textContent = short(item.baslangic) + (item.bitis !== item.baslangic ? " – " + short(item.bitis) : "");
    const title = document.createElement("h3");
    title.textContent = item.baslik;
    row.append(date, title);
    if (item.aciklama) {
      const note = document.createElement("p");
      note.textContent = item.aciklama;
      row.append(note);
    }
    element.append(row);
  }
}
function renderMonth() {
  const year = selected.getUTCFullYear(), month = selected.getUTCMonth();
  const first = new Date(Date.UTC(year, month, 1));
  const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  byId("month").textContent = format(first, {month:"long", year:"numeric"});
  const days = byId("days");
  days.replaceChildren();
  for (let i = 0; i < (first.getUTCDay() + 6) % 7; i++) days.append(document.createElement("span"));
  for (let day = 1; day <= count; day++) {
    const date = new Date(Date.UTC(year, month, day)), key = iso(date);
    const entries = matches(key, key);
    const button = document.createElement("button");
    button.className = entries.length ? "day has" : "day";
    button.textContent = day;
    button.setAttribute("aria-pressed", String(key === iso(selected)));
    button.setAttribute("aria-label", format(date, {dateStyle:"full"}) + (entries.length ? ", " + entries.length + " etkinlik" : ""));
    if (key === todayKey) button.setAttribute("aria-current","date");
    button.onclick = () => {
      selected = date;
      renderMonth();
      days.querySelector('[aria-pressed="true"]').focus();
    };
    days.append(button);
  }
  byId("chosen").textContent = format(selected, {day:"numeric",month:"long",weekday:"long"});
  list(byId("daily"), matches(iso(selected), iso(selected)), "Bu gün için kayıtlı etkinlik yok.");
}
function renderWeek() {
  const now = fromKey(todayKey);
  const monday = new Date(+now - ((now.getUTCDay() + 6) % 7) * dayMs);
  const sunday = new Date(+monday + 6 * dayMs);
  const short = date => format(date, {day:"numeric",month:"long"});
  byId("range").textContent = short(monday) + " – " + short(sunday);
  list(byId("weekly"), matches(iso(monday),iso(sunday)), "Bu hafta için kayıtlı etkinlik yok.");
}
function move(amount) {
  selected = new Date(Date.UTC(selected.getUTCFullYear(), selected.getUTCMonth()+amount, 1));
  renderMonth();
}
byId("prev").onclick = () => move(-1);
byId("next").onclick = () => move(1);
byId("today").onclick = () => { selected = fromKey(todayKey); renderMonth(); };
async function start() {
  try {
    const response = await fetch("etkinlikler.json");
    if (!response.ok) throw new Error("calendar");
    events = (await response.json()).sort((a,b) => a.baslangic.localeCompare(b.baslangic));
  } catch {
    events = [];
    failed = true;
  }
  renderWeek();
  renderMonth();
}
start();
