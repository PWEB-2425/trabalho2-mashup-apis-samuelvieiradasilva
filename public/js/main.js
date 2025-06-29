document.getElementById('search-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const city = document.getElementById('city').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Carregando...';

  try {
    const res = await fetch(`/api/search?city=${encodeURIComponent(city)}`);
    const data = await res.json();

    resultDiv.innerHTML = `
      <h2>${data.city}</h2>
      <p><strong>Temperatura:</strong> ${data.weather}°C</p>
      <p><strong>País:</strong> ${data.country.name}</p>
      <p><strong>Moeda:</strong> ${data.country.currency}</p>
      <h3>Notícias:</h3>
      <ul>
        ${data.news.map(n => `<li><a href="${n.url}" target="_blank">${n.title}</a></li>`).join('')}
      </ul>
    `;
  } catch (err) {
    resultDiv.innerHTML = 'Erro ao buscar dados.';
  }
});
