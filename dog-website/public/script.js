let userInput = null;

//dog data variables
let bred_nameGlobal = null;
let bred_forGlobal = null;
let breed_groupGlobal = null;
let height_ImperialGlobal = null;
let height_MetricGlobal = null;
let weight_ImperialGlobal = null;
let weight_MetricGlobal = null;
let life_spanGlobal = null;
let temperamentGlobal = null;
let idImageGlobal = null;

async function handleButtonClick() {
  const inputText = document
    .getElementById("input-text")
    .value.trim()
    .toLowerCase();
  console.log(`User input: "${inputText}"`);

  if (inputText) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/dog-breed?breed=${inputText}`
      );
      displayText();
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const breed = await response.json();
      console.log("Breed found:", breed);

      bred_forGlobal = breed.bred_for;
      bred_nameGlobal = breed.name;
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
      console.error("Fetch error:", error);
      document.getElementById("display-area").innerText =
        "An error occurred. Please try again later.";
    }
  } else {
    console.log("Please enter a breed name.");
    document.getElementById("display-area").innerText =
      "Please enter a breed name.";
  }
}

function displayDogFacts() {
  const extraInfo = document.getElementById("extra-info");
  extraInfo.innerHTML = `
        Bred Name: ${bred_nameGlobal}<br>
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
    console.error("No image ID set. Please search for a breed first.");
    document.getElementById("image-box").textContent =
      "No image ID set. Please search for a breed first.";
    return;
  }

  try {
    const response = await fetch(
      `https://api.thedogapi.com/v1/images/${idImageGlobal}`,
      {}
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const imageUrl = data.url;
    const imageBox = document.getElementById("image-box");
    const extraInfoBox = document.getElementById("extra-info");
    const displayAreaBox = document.getElementById("display-area");
    imageBox.innerHTML = `<img src="${imageUrl}" alt="Dog Image" style="max-width: 100%; height: auto;">`;

    //shows content
    imageBox.classList.remove("hidden"); // Remove the hidden class to show the image box
    extraInfoBox.classList.remove("hidden");
    // displayAreaBox.classList.remove("hidden");

    // Adjust margins when image is displayed
    adjustMargins();

    if (data.breeds && data.breeds.length > 0) {
      const dogName = data.breeds[0].name;
      console.log("Dog name:", dogName);
    } else {
      console.log("No breed information available for this image.");
    }
  } catch (error) {
    console.error("Error fetching dog image:", error);
    document.getElementById("image-box").textContent = "Failed to load image.";
  }
}

function adjustMargins() {
  const inputText = document.getElementById("input-text");
  const inputContainer = document.getElementById("input-container");

  inputText.style.marginTop = "0"; // Remove margin-top from input-text
  inputContainer.style.marginTop = "2rem"; // Change margin-top of input-container
}

// Global variable to indicate if the API key is connected
let testConnected = 0;
let verifyPromise = null; // Global promise for API key verification

// Function to verify the API key with the server
function verifyAPIKey() {
  if (!verifyPromise) {
    verifyPromise = fetch("http://localhost:3000/api/verifykey", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          console.log("API key verification successful.");
          testConnected = 1; // Mark as connected
          return true;
        } else {
          console.error("API Key is missing or invalid.");
          alert("API Key is missing or invalid. Please contact support.");
          return false;
        }
      })
      .catch((error) => {
        console.error("Error verifying API key:", error);
        alert(
          "Error verifying API key. Please check the console for more details."
        );
        return false;
      });
  }
  return verifyPromise;
}

// Function to capture form data and send it to the server for API interaction

function displayText() {
  const text = document.getElementById("input-text").value;
  document.getElementById("input-text").value = ""; // Clear the text area upon inputting the form data
}
// New function for openapi send and receive the response from the SERVER

document
  .getElementById("dog-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    try {
      const response = await fetch("http://localhost:3000/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      displayResponseData(responseData);
    } catch (error) {
      console.error("Fetch error:", error);
      document.getElementById("form-display-area").innerText =
        "An error occurred. Please try again later.";
    }
  });

function displayResponseData(data) {
  //   const displayArea = document.getElementById("form-display-area");
  //   displayArea.innerHTML = `${data.choices[0].message.content}`;

  const displayArea = document.getElementById("form-display-area");
  displayArea.innerHTML = `${data.choices[0].message.content}`;
  displayArea.style.display = "block"; // Show the form display area
}

//this is the comlete version
