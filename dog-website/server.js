import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const DOG_API_KEY = process.env.DOG_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI(OPENAI_API_KEY);

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());





app.post('/api/breed-info', async (req, res) => { //https://api.thedogapi.com/v1/breeds
    const { breedName } = req.body;

    try {
        // Fetch breed information from the dog API
        const breedResponse = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${breedName}`, {
            headers: { 'x-api-key': DOG_API_KEY }
        });

        const breed = breedResponse.data.find(b => b.name.toLowerCase() === breedName.toLowerCase());

        if (breed) {
            // Fetch image by reference image ID
            const imageResponse = await axios.get(`https://api.thedogapi.com/v1/images/${breed.reference_image_id}`, {
                headers: { 'x-api-key': DOG_API_KEY }
            });

            const imageUrl = imageResponse.data.url;

////////////////////////

            // Generate description using OpenAI
            const openaiResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant providing information about dog breeds."
                    },
                    {
                        role: "user",
                        content: `Tell a infomation about the ${breed.name}. Include its temperament, typical location, and whether it is a mixed breed.`
                    }
                ],
                max_tokens: 150
            });

            if (openaiResponse.choices && openaiResponse.choices.length > 0) {
                const story = openaiResponse.choices[0].message.content;
                console.log('OpenAI response received:', story);

                res.json({
                    breed,
                    image: imageUrl,
                    story
                });
            } else {
                console.log('OpenAI did not send a response:', openaiResponse);
                res.json({
                    breed,
                    image: imageUrl,
                    story: "No story could be generated."
                });
            }
        } else {
            res.status(404).json({ error: 'Breed not found' });
        }
    } catch (error) {
        console.error('Error in /api/breed-info:', error);
        res.status(500).json({ error: error.toString() });
    }
});
 



//chat gtp post call 



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
