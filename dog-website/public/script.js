document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('randomButton').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/random');
            const data = await response.json();
            console.log('Random dog data:', data); // Log response data
            if (data.url) {
                displayImage(data.url);
                if (data.breed) {
                    updateBreedInfo(data.breed);
                }
            } else {
                console.error('Image URL not found in response:', data);
            }
        } catch (error) {
            console.error('Error fetching random dog:', error);
        }
    });

    document.getElementById('searchButton').addEventListener('click', async () => {
        const breedName = document.getElementById('breedName').value.trim();
        if (breedName) {
            try {
                const response = await fetch(`/api/breed/${breedName}`);// update the end point 
                if (response.status === 404) {
                    document.getElementById('breedInfoContainer').innerHTML = '<p>Breed not found</p>';
                    document.getElementById('breedImageContainer').innerHTML = '';
                } else {
                    const data = await response.json();
                    updateBreedInfo(data);
                    if (data.image) {
                        displayImage(data.image);
                    } else {
                        console.error('Image URL not found in breed data:', data);
                    }
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
        <p><strong>Life span:</strong> ${data.life_span}</p>
        <p><strong>Weight:</strong> ${data.weight.metric} kg</p>
        <p><strong>Height:</strong> ${data.height.metric} cm</p>
    `;
}


function displayImage(url) {
    const imageContainer = document.getElementById('breedImageContainer');
    imageContainer.innerHTML = `<img src="${url}" alt="Dog Image" style="width:300px;">`;
}
