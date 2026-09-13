function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

function formatEuro(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const form = document.getElementById('stromForm');

if (form) {
  const leistung = document.getElementById('leistung');
  const stunden = document.getElementById('stunden');
  const strompreis = document.getElementById('strompreis');
  const tage = document.getElementById('tage');

  function berechnen(event) {
    if (event) event.preventDefault();

    const watt = Number(leistung.value);
    const h = Number(stunden.value);
    const preis = Number(strompreis.value);
    const nutzungstage = Number(tage.value);

    if ([watt, h, preis, nutzungstage].some(v => Number.isNaN(v) || v < 0)) {
      return;
    }

    const verbrauchTag = (watt / 1000) * h;
    const kostenTag = verbrauchTag * preis;
    const kostenJahr = kostenTag * nutzungstage;
    const kostenMonat = kostenJahr / 12;

    document.getElementById('verbrauchTag').textContent = `${formatNumber(verbrauchTag)} kWh`;
    document.getElementById('kostenTag').textContent = formatEuro(kostenTag);
    document.getElementById('kostenMonat').textContent = formatEuro(kostenMonat);
    document.getElementById('kostenJahr').textContent = formatEuro(kostenJahr);
  }

  form.addEventListener('submit', berechnen);
  [leistung, stunden, strompreis, tage].forEach(input => input.addEventListener('input', berechnen));
  berechnen();
}
