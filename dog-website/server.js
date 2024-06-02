import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from "cors";
import fetch from 'node-fetch';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());

// Route to verify the API key
app.get('/api/verifykey', (req, res) => {
    console.log('Received request for API key verification');
   if (process.env.API_KEY && process.env.API_KEY.trim() !== '') {
        console.log( 'API Key is set');
        res.json({ success: true });
    } else {
        console.log('API Key is missing');
        res.json({ success: false });
    }
});


// Route to send requests to the OpenAI API
app.post('/api/send', async (req, res) => { //constructs the request data object to be sent to the OpenAI API
    
     // Log the user's input
     console.log('User Input:', req.body.messages[0].content);

     const userInput = req.body.messages[0].content; //to het user input

     // Include API key in requests to OpenAI or other services
    const apiKey = process.env.API_KEY;
    const requestData = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({//how it should reposnd 
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Write one fun interesting facts"+ userInput +" dog breed." }
            ],
            max_tokens: 100
        })
    };


    // Send the request to the OpenAI API
    try {
        const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', requestData);
        const apiData = await apiResponse.json();
        res.json(apiData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch from OpenAI API: ' + err.message });
    }
});

////////////////////////dog 

//Here we add a route to the server to fetch dog breed information

app.get('/api/dog-breed', async (req, res) => {
    const breedName = req.query.breed;
    try {
        const response = await fetch('https://api.thedogapi.com/v1/breeds', {
            method: 'GET',
            headers: {
                'x-api-key': process.env.DOG_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const matchingBreed = data.find(breed => breed.name.toLowerCase().includes(breedName.toLowerCase()));

        if (matchingBreed) {
            res.json(matchingBreed);
        } else {
            res.status(404).json({ error: 'Breed not found' });
        }
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});












// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});