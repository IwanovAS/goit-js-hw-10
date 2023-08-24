import { fetchBreeds, fetchCatByBreed } from './cat-api';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

let httpRequestCounter = 0;

const initializeApp = async () => {
  populateBreedsSelect();

  document.addEventListener('httpRequestStarted', () => {
    httpRequestCounter++;
    if (httpRequestCounter === 1) {
      showLoader('Loading data, please wait...');
    }
  });

  document.addEventListener('httpRequestFinished', () => {
    httpRequestCounter--;
    if (httpRequestCounter === 0) {
      hideLoader();
    }
  });
};

const populateBreedsSelect = async () => {
  const breeds = await fetchBreeds();

  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });

  breedSelect.addEventListener('change', async () => {
    const selectedBreedId = breedSelect.value;
    document.dispatchEvent(new Event('httpRequestStarted'));

    catInfo.style.display = 'none';
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
      catInfo.style.display = 'block';
    }

    document.dispatchEvent(new Event('httpRequestFinished'));
  });
};

const showLoader = (message = '') => {
  loader.style.display = 'block';
  error.style.display = 'none';
  loader.textContent = message;
};

const hideLoader = () => {
  loader.style.display = 'none';
};

const showError = () => {
  error.style.display = 'block';
  loader.style.display = 'none';
  error.textContent = 'Oops! Something went wrong! Try reloading the page!';
};

document.addEventListener('DOMContentLoaded', initializeApp);
