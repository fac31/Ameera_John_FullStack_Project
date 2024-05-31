import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from "cors";

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
                { role: "user", content: "Write facts about Dogs only no other animal. if other animal was enetered say to re enter Dog breed.  for example is  " + userInput + "  a Dog breed? if it is talk about it. if it is not  Dog tell em to enter a Dog. "+"Must answer all 4 questions fully. correct punctuations. spcifically about the "+ userInput +"1. type of breed_group. 2.common life_span. 3.temperament,  4.origin ." }
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

/////////////////////////////////dog

// Route to fetch dog image by breed name
app.get('/api/dog/image/:breed', async (req, res) => {
    const breed = req.params.breed;
    const apiKeyDog = process.env.API_KEY_DOG; // Access Dog API key from environment variable

    try {
        // Fetch breed information
        const response = await fetch(`https://api.thedogapi.com/v1/breeds/search?q=${breed}`, {
            headers: {
                'x-api-key': apiKeyDog // Include Dog API key in the request headers
            }
        });
        const breedData = await response.json();

        if (breedData.length > 0) {
            // Fetch image URL using reference_image_id
            const referenceImageId = breedData[0].reference_image_id;
            const imageResponse = await fetch(`https://api.thedogapi.com/v1/images/${referenceImageId}`, {
                headers: {
                    'x-api-key': apiKeyDog // Include Dog API key in the request headers
                }
            });
            const imageData = await imageResponse.json();

            // Return image URL
            res.json({ imageUrl: imageData.url });
        } else {
            res.status(404).json({ error: 'Breed not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dog image: ' + error.message });
    }
});







// Define the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});