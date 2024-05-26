const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const DOG_API_KEY = process.env.DOG_API_KEY;

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/api/breeds', async (req, res) => {
    try {
        const response = await axios.get('https://api.thedogapi.com/v1/breeds', {
            headers: { 'x-api-key': DOG_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.get('/api/breed/:name', async (req, res) => {
    const breedName = req.params.name.toLowerCase();
    try {
        const response = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${breedName}`, {
            headers: { 'x-api-key': DOG_API_KEY }
        });
        const breed = response.data.find(b => b.name.toLowerCase() === breedName);
        if (breed) {
            const imageResponse = await axios.get(`https://api.thedogapi.com/v1/images/${breed.reference_image_id}`, {
                headers: { 'x-api-key': DOG_API_KEY }
            });
            breed.image = imageResponse.data.url;
            res.json(breed);
        } else {
            res.status(404).send('Breed not found');
        }
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.get('/api/random', async (req, res) => {
    try {
        const response = await axios.get('https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1', {
            headers: { 'x-api-key': DOG_API_KEY }
        });
        const image = response.data[0];
        res.json({
            url: image.url,
            breed: image.breeds[0]
        });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
