let userInput = null;

//dog data variables
let bred_forGlobal =null;
let breed_groupGlobal =null;
let height_ImperialGlobal =null;
let height_MetricGlobal =null;
let weight_ImperialGlobal =null;
let weight_MetricGlobal =null;
let life_spanGlobal =null;
let temperamentGlobal =null;
let idImageGlobal =null;

/*
// Function to handle button click
function handleButtonClick() {
    userInput = null; 
    idImageGlobal = null;
    const inputText = document.getElementById('input-text').value.trim().toLowerCase(); // Convert to lowercase here
    console.log(`User input: "${inputText}"`);
    userInput = inputText;

    if (inputText) {
        displayText();
        dogData();
    } else {
        console.log("Please enter a breed name.");
        document.getElementById('display-area').innerText = "Please enter a breed name.";
    }
}


async function dogData() {
    try {
        const response = await fetch('https://api.thedogapi.com/v1/breeds', {
            method: 'GET',
            headers: {
                'x-api-key': 'live_GWFeyCofOyIX0GjthdJVRwPHEma0GAkx2yU0mtkC2AViwRCFlNWXUvVkXXSgbR6J' // Replace with your actual Dog API key
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        let matchingBreed = null;
        let foundImageID = null;

        console.log(`user input test: "${userInput}"`);

        // Loop through the data to find a matching breed
        for (const breed of data) {
            if (breed.name.toLowerCase().includes(userInput)) {
                matchingBreed = breed;
                foundImageID = breed.image.id;
                idImageGlobal = foundImageID;

                 bred_for =breed.bred_for;
                 breed_group =breed.breed_group;
                 height_Imperial=breed.height.imperial;
                 height_Metric=breed.height.metric;
                 weight_Imperial=breed.weight.imperial;
                 weight_Metric =breed.weight.metric;;
                 life_span=breed.life_span;
                 temperament=breed.temperament;


                 bred_forGlobal =bred_for;
                 breed_groupGlobal =breed_group;
                 height_ImperialGlobal =height_Imperial;
                 height_MetricGlobal =height_Metric;
                 weight_ImperialGlobal =weight_Imperial;
                 weight_MetricGlobal =weight_Metric;
                 life_spanGlobal =life_span;
                 temperamentGlobal =temperament;


                break; // Exit the loop once a match is found
            }
        }

        if (matchingBreed) {
            console.log("Breed foundconfimation :");
            console.log(`user input: "${userInput}"`);
            console.log("Breed:", matchingBreed);
            console.log("Image ID:", foundImageID);

            displayDogFacts();
            randomDogImage();
        } else {
            console.log(`No breed found matching "${userInput}"`);
            document.getElementById('display-area').userInput = "No breed found matching ";
        }

    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('display-area').userInput = "An error occurred. Please try again later.";
    }
}

// Function to fetch a specific dog image using idImageGlobal and display it in the image box
function randomDogImage() {
    if (!idImageGlobal) {
        console.error('No image ID set. Please search for a breed first.');
        document.getElementById('image-box').textContent = "No image ID set. Please search for a breed first.";
        return;
    }

    fetch(`https://api.thedogapi.com/v1/images/${idImageGlobal}`, {
        headers: {
            'x-api-key': 'live_GWFeyCofOyIX0GjthdJVRwPHEma0GAkx2yU0mtkC2AViwRCFlNWXUvVkXXSgbR6J' // Replace with your actual Dog API key
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Log the full JSON data
        console.log('Fetched JSON data:', JSON.stringify(data, null, 2));

        const imageUrl = data.url;
        const imageBox = document.getElementById('image-box');
        imageBox.innerHTML = `<img src="${imageUrl}" alt="Dog Image" style="max-width: 100%; height: auto;">`;

        // Check if the breed information is available and log the dog's name
        if (data.breeds && data.breeds.length > 0) {
            const dogName = data.breeds[0].name;
            console.log('Dog name:', dogName);
        } else {
            console.log('No breed information available for this image.');
        }
    })
    .catch(error => {
        console.error('Error fetching dog image:', error);
        document.getElementById('image-box').textContent = "Failed to load image.";
    });
}

function displayDogFacts() {

   
    const extraInfo = document.getElementById('extra-info');
    
    extraInfo.innerHTML = ""; // Clear existing content
    
    const facts = 
        "Bred for: " + bred_forGlobal + "<br>" +
        "Breed Group: " + breed_groupGlobal + "<br>" +
        "Height Imperial: " + height_ImperialGlobal + "<br>" +
        "Height Metric: " + height_MetricGlobal + "<br>" +
        "Weight Imperial: " + weight_ImperialGlobal + "<br>" +
        "Weight Metric: " + weight_MetricGlobal + "<br>" +
        "Life Span: " + life_spanGlobal + "<br>" +
        "Temperament: " + temperamentGlobal;

    extraInfo.innerHTML = facts;
}

*/

async function handleButtonClick() {
    const inputText = document.getElementById('input-text').value.trim().toLowerCase();
    console.log(`User input: "${inputText}"`);

    if (inputText) {
        try {
            const response = await fetch(`http://localhost:3000/api/dog-breed?breed=${inputText}`);
            displayText();
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const breed = await response.json();
            console.log("Breed found:", breed);

            bred_forGlobal = breed.bred_for;
            breed_groupGlobal = breed.breed_group;
            height_ImperialGlobal = breed.height.imperial;
            height_MetricGlobal = breed.height.metric;
            weight_ImperialGlobal = breed.weight.imperial;
            weight_MetricGlobal = breed.weight.metric;
            life_spanGlobal = breed.life_span;
            temperamentGlobal = breed.temperament;
            idImageGlobal = breed.image.id;

            displayDogFacts();
            randomDogImage();
        } catch (error) {
            console.error('Fetch error:', error);
            document.getElementById('display-area').innerText = "An error occurred. Please try again later.";
        }
    } else {
        console.log("Please enter a breed name.");
        document.getElementById('display-area').innerText = "Please enter a breed name.";
    }
}

function displayDogFacts() {
    const extraInfo = document.getElementById('extra-info');
    extraInfo.innerHTML = `
        Bred for: ${bred_forGlobal}<br>
        Breed Group: ${breed_groupGlobal}<br>
        Height Imperial: ${height_ImperialGlobal}<br>
        Height Metric: ${height_MetricGlobal}<br>
        Weight Imperial: ${weight_ImperialGlobal}<br>
        Weight Metric: ${weight_MetricGlobal}<br>
        Life Span: ${life_spanGlobal}<br>
        Temperament: ${temperamentGlobal}
    `;
}

async function randomDogImage() {
    if (!idImageGlobal) {
        console.error('No image ID set. Please search for a breed first.');
        document.getElementById('image-box').textContent = "No image ID set. Please search for a breed first.";
        return;
    }

    try {
        const response = await fetch(`https://api.thedogapi.com/v1/images/${idImageGlobal}`, {
            headers: {
                'x-api-key': 'YOUR_API_KEY_HERE'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const imageUrl = data.url;
        const imageBox = document.getElementById('image-box');
        imageBox.innerHTML = `<img src="${imageUrl}" alt="Dog Image" style="max-width: 100%; height: auto;">`;

        if (data.breeds && data.breeds.length > 0) {
            const dogName = data.breeds[0].name;
            console.log('Dog name:', dogName);
        } else {
            console.log('No breed information available for this image.');
        }
    } catch (error) {
        console.error('Error fetching dog image:', error);
        document.getElementById('image-box').textContent = "Failed to load image.";
    }
}






// Global variable to indicate if the API key is connected
let testConnected = 0;
let verifyPromise = null; // Global promise for API key verification

// Function to verify the API key with the server
function verifyAPIKey() {
    if (!verifyPromise) {
        verifyPromise = fetch('http://localhost:3000/api/verifykey', { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('API key verification successful.');
                    testConnected = 1; // Mark as connected
                    return true;
                } else {
                    console.error("API Key is missing or invalid.");
                    alert("API Key is missing or invalid. Please contact support.");
                    return false;
                }
            })
            .catch(error => {
                console.error('Error verifying API key:', error);
                alert("Error verifying API key. Please check the console for more details.");
                return false;
            });
    }
    return verifyPromise;
}

// Function to handle response from fetch call
function handleResponse(response) {
    if (!response.ok) {
        response.json().then(json => {
            console.error('Response Error:', json);  // Log or handle JSON error message from the server
        });
        throw new Error('Network response was not ok', response.status);
    }
    return response.json();
}

// Function to process API response data
function processData(data) {
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const generatedText = data.choices[0].message.content;
        const displayArea = document.getElementById('display-area');
        displayArea.textContent = generatedText; // Displaying the response directly
    } else {
        document.getElementById('display-area').textContent = "No response or unexpected response structure.";
    }
    console.log('API key successfully connected.');
    testConnected = 1; // Mark as connected.
}

// Function to handle errors during fetch operation
function handleError(error) {
    console.error('There was a problem with the fetch operation:', error);
    document.getElementById('display-area').textContent = error.message;
}

// Function to capture form data and send it to the server for API interaction
function displayText() {
    const text = document.getElementById('input-text').value;
    document.getElementById('input-text').value = ""; // Clear the text area upon inputting the form data

    verifyAPIKey().then(verified => {
        if (verified && testConnected) {
            sendRequest(text);
        } else {
            alert("API Key is missing. Please verify the API Key first.");
        }
    });
}

// Function to send request to the OpenAI API via server
function sendRequest(text) {
    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: text }]
        })
    };

    fetch('http://localhost:3000/api/send', requestData) // this is the second to send the information to the openAI API 
        .then(handleResponse)
        .then(processData)
        .catch(handleError);
}