const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const router = express.Router();
const Search = require('../models/Search');

// Middleware para proteger a rota
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Não autenticado' });
}

// Rota de busca com mashup de APIs
router.get('/search', ensureAuthenticated, async (req, res) => {
    const city = req.query.city;
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    const NEWSAPI_KEY = process.env.NEWSAPI_KEY;

    try {
        // OpenWeather
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`);
        const weatherData = await weatherRes.json();
        if (!weatherData.sys) throw new Error('Cidade não encontrada');
        const countryCode = weatherData.sys.country;

        // RestCountries
        const countryRes = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const countryData = await countryRes.json();
        const countryInfo = countryData[0];

        // NewsAPI
        const newsRes = await fetch(`https://newsapi.org/v2/everything?q=${city}&language=pt&sortBy=publishedAt&pageSize=5&apiKey=${NEWSAPI_KEY}`);
        if (!newsRes.ok) {
            const errText = await newsRes.text();
            throw new Error(`Erro NewsAPI: ${newsRes.status} - ${errText}`);
        }
        const newsData = await newsRes.json();


        // salvar no histórico
        await Search.create({
            user: req.user._id,
            city: weatherData.name,
            weather: weatherData.main.temp,
            country: countryInfo.translations.por.common || countryInfo.name.common,
            currency: Object.values(countryInfo.currencies)[0].name
        });

        res.json({
            city: weatherData.name,
            weather: weatherData.main.temp,
            country: {
                name: countryInfo.translations.por.common || countryInfo.name.common,
                currency: Object.values(countryInfo.currencies)[0].name
            },
            news: newsData.articles.map(a => ({
                title: a.title,
                url: a.url
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar informações.' });
    }
});

// Rota para obter histórico de pesquisas do utilizador logado
router.get('/history', ensureAuthenticated, async (req, res) => {
    try {
        const historico = await Search.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(historico);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao obter histórico.' });
    }
});

module.exports = router;
