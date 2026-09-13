const wert = document.getElementById('wert');
const prozent = document.getElementById('prozent');
const ergebnis = document.getElementById('ergebnis');
const button = document.getElementById('berechnen');

function berechnen() {
  const grundwert = Number(wert.value);
  const prozentsatz = Number(prozent.value);

  if (wert.value === '' || prozent.value === '' || !Number.isFinite(grundwert) || !Number.isFinite(prozentsatz)) {
    ergebnis.textContent = 'Bitte beide Felder mit gültigen Zahlen ausfüllen.';
    return;
  }

  const result = grundwert * prozentsatz / 100;
  ergebnis.textContent = `Ergebnis: ${result.toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

button.addEventListener('click', berechnen);

[wert, prozent].forEach(input => {
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') berechnen();
  });
});
