import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app = express();

//  Middleware

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

// route handler to verify openAI api key

app.get("/api/verifykey", (req, res) => {
  console.log("Received request for API key verification");
  if (process.env.API_KEY && process.env.API_KEY.trim() !== "") {
    console.log("API Key is set");
    res.json({ success: true });
  } else {
    console.log("API Key is missing");
    res.json({ success: false });
  }
});

// route handle for the openAI api
app.post("/api/send", async (req, res) => {
  const { friendliness, trainability, activity, independence, size } = req.body;

  const userInput = `I am looking for a dog that is ${friendliness}, has ${trainability} trainability, ${activity} activity level, ${independence} independence, and is ${size} in size.`;

  const apiKey = process.env.API_KEY;
  const requestData = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userInput },
      ],
      max_tokens: 100,
    }),
  };

  try {
    const apiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      requestData
    );
    const apiData = await apiResponse.json();
    res.json(apiData);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch from OpenAI API: " + err.message });
  }
});

// route handle for the dog api

app.get("/api/dog-breed", async (req, res) => {
  const breedName = req.query.breed;
  try {
    const response = await fetch("https://api.thedogapi.com/v1/breeds", {
      method: "GET",
      headers: {
        "x-api-key": process.env.DOG_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const matchingBreed = data.find((breed) =>
      breed.name.toLowerCase().includes(breedName.toLowerCase())
    );

    if (matchingBreed) {
      res.json(matchingBreed);
    } else {
      res.status(404).json({ error: "Breed not found" });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// define port for the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
