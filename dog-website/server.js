import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

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

app.post("/api/send", async (req, res) => {
  console.log("User Input:", req.body.messages[0].content);

  const userInput = req.body.messages[0].content;
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
        {
          role: "user",
          content:
            "Always start with one fun and interesting fact about " +
            userInput +
            " dog breed.",
        },
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

app.get("/api/dog-breed", async (req, res) => {
  const breedName = req.query.breed;
  console.log("Breed name requested:", breedName);
  try {
    const response = await fetch("https://api.thedogapi.com/v1/breeds", {
      method: "GET",
      headers: {
        "x-api-key": process.env.DOG_API_KEY,
      },
      timeout: 10000, // 10 seconds timeout
    });

    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
