console.log('Fetch Script Loaded');

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Helper function to handle fetch errors
function handleFetchErrors(response) {
    if (!response.ok) {
        throw Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response;
}

// Create the updateProgress function
function updateProgress(event) {
    if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        console.log('Progress Event:', event); // Log the ProgressEvent object
        progressBar.style.width = `${percentCompleted}%`; // Update the progress bar
    }
}

// Initial Load Function
async function initialLoad() {
    try {
        const response = await fetch('https://api.thedogapi.com/v1/breeds', {
            method: 'GET',
            headers: {
                'x-api-key': 'live_6HiXtSamxN00oLALLL87oob2tjx3yOUNsGybodWrsLO04T5XzHeJTlVYZFlx2sMx'
            }
        });
        handleFetchErrors(response);
        const breeds = await response.json();
        console.log('Breeds:', breeds); // Debugging line

        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id; // Set the value attribute to the breed id
            option.textContent = breed.name; // Set the text content to the breed name
            breedSelect.appendChild(option); // Append the option to the breedSelect element
        });

        // Call handleBreedSelection to load initial breed data
        handleBreedSelection();

    } catch (error) {
        console.error("Error fetching breeds: ", error);
    }
}

// Event handler for breedSelect
async function handleBreedSelection() {
    const selectedBreedId = breedSelect.value;

    try {
        // Fetch breed images and info from the Cat API using Fetch
        const response = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${selectedBreedId}&limit=5`, {
            method: 'GET',
            headers: {
                'x-api-key': 'live_6HiXtSamxN00oLALLL87oob2tjx3yOUNsGybodWrsLO04T5XzHeJTlVYZFlx2sMx'
            }
        });
        handleFetchErrors(response);
        const images = await response.json();
        console.log('Images:', images); // Debugging line

        // Clear the current carousel and info section
        const carouselInner = document.getElementById('carouselInner');
        carouselInner.innerHTML = ''; // Clear carousel
        infoDump.innerHTML = ''; // Clear info section

        // Populate carousel with new images
        images.forEach(imageData => {
            const carouselItemTemplate = document.getElementById('carouselItemTemplate');
            const carouselItem = carouselItemTemplate.content.cloneNode(true);
            const imgElement = carouselItem.querySelector('img');
            imgElement.src = imageData.url;
            carouselInner.appendChild(carouselItem);
        });

        // Set the first carousel item as active
        if (carouselInner.firstElementChild) {
            carouselInner.firstElementChild.classList.add('active');
        }

        // Populate the info section with breed details
        const breedInfo = images[0].breeds[0];
        const wikipediaUrl = breedInfo.wikipedia_url ? breedInfo.wikipedia_url : "#";
        const breedDetails = `
            <h3>${breedInfo.name}</h3>
            <p><strong>Origin:</strong> ${breedInfo.origin}</p>
            <p><strong>Description:</strong> ${breedInfo.description}</p>
            <p><strong>Temperament:</strong> ${breedInfo.temperament}</p>
            <p><strong>Life Span:</strong> ${breedInfo.life_span} years</p>
            <p><strong>Wikipedia:</strong> <a href="${wikipediaUrl}" target="_blank">${wikipediaUrl !== "#" ? wikipediaUrl : "Not available"}</a></p>
        `;
        infoDump.innerHTML = breedDetails;

    } catch (error) {
        console.error("Error fetching breed images: ", error);
    }
}

// Toggle favourite function
async function favourite(imgId) {
    try {
        const isFavourited = document.querySelector(`.favourite-button[data-img-id="${imgId}"]`).classList.contains("favourited");
        if (isFavourited) {
            // Delete the favourite
            await fetch(`https://api.thedogapi.com/v1/favourites/${imgId}`, {
                method: 'DELETE',
                headers: {
                    'x-api-key': 'live_6HiXtSamxN00oLALLL87oob2tjx3yOUNsGybodWrsLO04T5XzHeJTlVYZFlx2sMx'
                }
            });
        } else {
            // Add the favourite
            await fetch('https://api.thedogapi.com/v1/favourites', {
                method: 'POST',
                headers: {
                    'x-api-key': 'live_6HiXtSamxN00oLALLL87oob2tjx3yOUNsGybodWrsLO04T5XzHeJTlVYZFlx2sMx',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image_id: imgId })
            });
        }
    } catch (error) {
        console.error('Error toggling favourite:', error);
    }
}

// Get favourites function
async function getFavourites() {
    try {
        const response = await fetch('https://api.thedogapi.com/v1/favourites', {
            method: 'GET',
            headers: {
                'x-api-key': 'live_6HiXtSamxN00oLALLL87oob2tjx3yOUNsGybodWrsLO04T5XzHeJTlVYZFlx2sMx'
            }
        });
        handleFetchErrors(response);
        return await response.json();
    } catch (error) {
        console.error('Error fetching favourites:', error);
        return [];
    }
}

// Display favourites function
async function displayFavourites() {
    // Clear the current carousel and info section
    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = ''; // Clear carousel
    infoDump.innerHTML = ''; // Clear info section

    try {
        const favourites = await getFavourites();

        favourites.forEach(fav => {
            const carouselItemTemplate = document.getElementById('carouselItemTemplate');
            const carouselItem = carouselItemTemplate.content.cloneNode(true);
            const imgElement = carouselItem.querySelector('img');
            imgElement.src = fav.image.url; // Adjust according to API response
            carouselInner.appendChild(carouselItem);
        });

        // Set the first carousel item as active
        if (carouselInner.firstElementChild) {
            carouselInner.firstElementChild.classList.add('active');
        }

        // Additional info for favourites, if needed
        // You might want to display additional info about the favourites here

    } catch (error) {
        console.error('Error displaying favourites:', error);
    }
}

// Attach event handlers
breedSelect.addEventListener('change', handleBreedSelection);
getFavouritesBtn.addEventListener('click', displayFavourites);

// Call the initialLoad function to kick off the process
initialLoad();
