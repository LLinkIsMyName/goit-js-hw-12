import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const input = document.querySelector("input");
const form = document.querySelector(".form");
const loadMoreButton = document.querySelector('.btn-load');
const galleryContainer = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector('.btn-load');

let currentPage = 1;
const perPage = 15;

const config = {
    apiKey: '42337135-3774c2f446ec3f71c1b4c916a',
    baseUrl: 'https://pixabay.com/api/',
};

const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionType: 'attr',
    captionsData: 'alt',
    captionPosition: 'bottom',
    fadeSpeed: 150,
    captionSelector: 'img',
    captionDelay: 250,
});

const showLoader = () => {
    const loader = document.createElement('span');
    loader.classList.add('loader');
    document.body.append(loader);
};

const hideLoader = () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.remove();
    }
};

function buildPixabayUrl(searchInput, page = 1) {
    return `${config.baseUrl}?key=${config.apiKey}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
}
async function fetchDataAndUpdateGallery() {
    const searchInput = input.value.trim();
    const url = buildPixabayUrl(searchInput, currentPage);

    try {
        const response = await axios.get(url);

        if (!response || !response.data || response.data.hits.length === 0) {
            iziToast.info({
                title: 'Info',
                message: 'No images found for the given search term.',
                position: 'center',
            });
            // Clear previous markup
            galleryContainer.innerHTML = '';
            hideLoader();
            return;
        }

        const data = response.data;
        updateGallery(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoader();
        // Clear previous markup
        galleryContainer.innerHTML = '';

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            iziToast.error({
                title: 'Error',
                message: `API Error: ${error.response.data.message}`,
                position: 'center',
            });
        } else if (error.request) {
            // The request was made but no response was received
            iziToast.error({
                title: 'Error',
                message: 'Network Error. Please check your internet connection.',
                position: 'center',
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            iziToast.error({
                title: 'Error',
                message: 'An unexpected error occurred. Please try again later.',
                position: 'center',
            });
        }
    }

}

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    currentPage = 1;
    const searchInput = input.value.trim();

    if (!searchInput) {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a valid search term',
        });
        return;
    }

    showLoader();
    await fetchDataAndUpdateGallery();

    e.target.reset();
    hideLoader();
});

loadMoreButton.addEventListener('click', async function () {
    currentPage++;
    showLoader();
    await fetchDataAndUpdateGallery();
});

function updateGallery(data) {


    const galleryItem = document.querySelector('.gallery-item');

    if (galleryItem) {
        const cardHeight = galleryItem.getBoundingClientRect().height;
        window.scrollBy(0, galleryContainer.clientHeight);
    }

    const markup = data.hits.map(data => `
        <li class="gallery-item">
            <a href="${data.largeImageURL}">
                <img class="gallery-image" src="${data.webformatURL}" alt="${data.tags}">
            </a>
            <p><b>Likes: </b>${data.likes}</p>
            <p><b>Views: </b>${data.views}</p>
            <p><b>Comments: </b>${data.comments}</p>
            <p><b>Downloads: </b>${data.downloads}</p>
        </li>`).join('');

    galleryContainer.innerHTML += markup;
    lightbox.refresh();

    hideLoader();

    const totalHits = data.totalHits || 0;

    if (totalHits <= currentPage * perPage) {
        loadMoreButton.style.display = 'none';
        iziToast.info({
            title: 'Info',
            message: "We're sorry, but you've reached the end of search results.",
            position: 'center',
            transitionIn: 'fadeInLeft',
        });
    } else {
        loadMoreButton.style.display = 'block';
    }
}
