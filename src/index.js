import axios from "axios";

axios.defaults.headers.common["x-api-key"] = "live_wXcVlAUIAsTAdVBquBwSKfwgIp1x6jStv3rq9WSnCqC82bY4nSDpliFBAxxHAnBe";

const breedSelect = document.querySelector(".breed-select");
const loader = document.querySelector(".loader");
const error = document.querySelector(".error");
const catInfo = document.querySelector(".cat-info");

const fetchBreeds = async () => {
  try {
    showLoader("Loading data, please wait...");
    const response = await axios.get("https://api.thecatapi.com/v1/breeds");
    return response.data;
  } catch (error) {
    showError();
    return [];
  }
};

const fetchCatByBreed = async (breedId) => {
  try {
    showLoader("Loading cat information...");
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    return response.data[0];
  } catch (error) {
    showError();
    return null;
  }
};

const populateBreedsSelect = async () => {
  const breeds = await fetchBreeds();

  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });

  breedSelect.addEventListener("change", async () => {
    const selectedBreedId = breedSelect.value;
    showLoader("Loading cat information...");
    catInfo.style.display = "none";

    const catData = await fetchCatByBreed(selectedBreedId);

    if (catData) {
      const { name, description, temperament, url } = catData.breeds[0];
      const image = catData.url;
      catInfo.innerHTML = `
        <h2>${name}</h2>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Temperament:</strong> ${temperament}</p>
        <img src="${image}" alt="${name}" />
      `;
      catInfo.style.display = "block";
    }

    hideLoader();
  });
};

const showLoader = (message = "") => {
  loader.style.display = "block";
  error.style.display = "none";
  loader.textContent = message;
};

const hideLoader = () => {
  loader.style.display = "none";
};

const showError = () => {
  error.style.display = "block";
  loader.style.display = "none";
  error.textContent = "Oops! Something went wrong! Try reloading the page!";
};

document.addEventListener("DOMContentLoaded", () => {
  showLoader(); 
  populateBreedsSelect();
});
