
// Function to fetch a random dog image and display it in the image box
function randomDogImage() {
    fetch('https://api.thedogapi.com/v1/images/search')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const imageUrl = data[0].url;
                const imageBox = document.getElementById('image-box');
                imageBox.innerHTML = `<img src="${imageUrl}" alt="Random Dog Image" style="max-width: 100%; height: auto;">`;
            } else {
                document.getElementById('image-box').textContent = "No image found.";
            }
        })
        .catch(error => {
            console.error('Error fetching dog image:', error);
            document.getElementById('image-box').textContent = "Failed to load image.";
        });
}



// Function to capture form data and send it to the server for API interaction
function displayText() {
    var text = document.getElementById('input-text').value;
    document.getElementById('input-text').value = ""; // Clear the text area upon inputting the form data

    verifyAPIKey().then(verified => {
        if (verified && testConnected) {
            sendRequest(text);
        } else {
            alert("API Key is missing. Please verify the API Key first.");
        }
    });
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
        var generatedText = data.choices[0].message.content;
        var displayArea = document.getElementById('display-area');
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
    var text = document.getElementById('input-text').value;
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
    var requestData = {
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