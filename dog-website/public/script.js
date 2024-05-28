document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchButton').addEventListener('click', async () => {
        const breedName = document.getElementById('breedName').value.trim();

        if (breedName) {
            try {
                const response = await fetch('/api/breed-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ breedName })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('API response received:', data);
                    updateBreedInfo(data.breed);
                    if (data.image) {
                        displayImage(data.image);
                    } else {
                        console.error('Image URL not found in breed data:', data);
                    }
                    if (data.story) {
                        displayStory(data.story);
                    } else {
                        console.error('Story not found in breed data:', data);
                    }
                } else if (response.status === 404) {
                    document.getElementById('breedInfoContainer').innerHTML = '<p>Breed not found</p>';
                    document.getElementById('breedImageContainer').innerHTML = '';
                } else {
                    const errorData = await response.json();
                    console.error('Error fetching breed information:', errorData.error);
                }
            } catch (error) {
                console.error('Error fetching breed information:', error);
            }
        }
    });
});

function updateBreedInfo(data) {
    const breedInfoDiv = document.getElementById('breedInfoContainer');
    breedInfoDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.temperament}</p>
        <p><strong>Bred for:</strong> ${data.bred_for}</p>
    `;
}

function displayImage(url) {
    const imageContainer = document.getElementById('breedImageContainer');
    imageContainer.innerHTML = `<img src="${url}" alt="Dog Image" style="width:300px;">`;
}

function displayStory(story) {
    const storyContainer = document.getElementById('storyContainer');
    storyContainer.innerHTML = `<p>${story}</p>`;
}


// Add console logs for OpenAI response
function handleOpenAIResponse(data) {
    if (data.story) {
        console.log('Received story from OpenAI:', data.story);
    } else {
        console.log('No story received from OpenAI');
    }
}
