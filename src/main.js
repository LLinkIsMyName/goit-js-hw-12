import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios'



const input = document.querySelector("input");
const form = document.querySelector(".form")

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

let currentPage = 1;
const perPage = 15;

const config = {
    apiKey: '42337135-3774c2f446ec3f71c1b4c916a',
    baseUrl: 'https://pixabay.com/api/',
};

function buildPixabayUrl(searchInput, page = 1) {
    return `${config.baseUrl}?key=${config.apiKey}&q=${searchInput}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
}

async function fetchDataAndUpdateGallery() {
    const searchInput = input.value.trim();
    const url = buildPixabayUrl(searchInput, currentPage);

    try {
        const response = await axios.get(url);
        const data = response.data;
        updateGallery(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        hideLoader();
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while fetching data. Please try again later.',
            position: 'center',
        });
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
});


const loadMoreButton = document.querySelector('.btn-load');

loadMoreButton.addEventListener('click', async function () {
    currentPage++;
    showLoader();
    await fetchDataAndUpdateGallery();
});

function handleApiResponse(response) {
    hideLoader();


    if (!response || !response.hits) {
        iziToast.error({
            title: 'Error',
            message: 'Invalid response format. Please try again later.',
            position: 'center',
        });
        return;
    }

    if (response.hits.length === 0) {
        iziToast.info({
            title: 'Info',
            message: 'Sorry, there are no images matching your search query. Please try again!',
            position: 'center',
            transitionIn: "fadeInLeft",
        });
        return;
    }


    updateGallery(response);
}

function updateGallery(data) {
    const galleryContainer = document.querySelector(".gallery");

    const lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionType: 'attr',
        captionsData: 'alt',
        captionPosition: 'bottom',
        fadeSpeed: 150,
        captionSelector: 'img',
        captionDelay: 250,
    });

    const galleryItem = document.querySelector('.gallery-item');

    if (galleryItem) {
        const cardHeight = galleryItem.getBoundingClientRect().height;
        window.scrollBy(0, cardHeight * perPage);
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

    // Append the new markup to the existing content
    galleryContainer.innerHTML += markup;
    lightbox.refresh();

    // Hide the loader after updating the gallery
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

