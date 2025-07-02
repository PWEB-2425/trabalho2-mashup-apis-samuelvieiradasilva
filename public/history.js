document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/history');
        const data = await res.json();

        const container = document.getElementById('history');
        if (res.ok) {
            if (data.length === 0) {
                container.innerHTML = '<p>Sem histórico por enquanto.</p>';
            } else {
                const list = data.map(item => `
                    <li>
                        <strong>${item.city}</strong> — ${item.country} — ${item.weather}°C — ${item.currency}
                    </li>
                `).join('');
                container.innerHTML = `<ul>${list}</ul>`;
            }
        } else {
            container.innerHTML = `<p>Erro: ${data.message || 'Não autenticado'}</p>`;
        }
    } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        document.getElementById('history').innerHTML = '<p>Erro ao buscar histórico.</p>';
    }
});
