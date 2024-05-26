document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('randomButton').addEventListener('click', async () => {
      try {
          const response = await fetch('/api/random');
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.image) {
              displayImage(data.image);
              console.log('found image');
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
              const response = await fetch(`/api/breed/${breedName}`);
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              const data = await response.json();
              if (data.image) {
                  displayImage(data.image);
              } else {
                  console.error('Image URL not found in breed data:', data);
              }
          } catch (error) {
              console.error('Error fetching breed information:', error);
          }
      }
  });
});

function displayImage(url) {
  const imageContainer = document.getElementById('breedImageContainer');
  imageContainer.innerHTML = `<img src="${url}" alt="Dog Image" style="width:300px;">`;
}
