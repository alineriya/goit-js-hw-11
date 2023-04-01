import { makeGalleryMarkup } from "./js/image-card";
import { PixabayAPI } from "./js/pixabay-api";
import { makeGalleryMarkup } from "./js/image-card";

const searchFormEl = document.querySelector('.js-search-form');
const galleryListEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');

const pixabayAPI = new PixabayAPI();

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

// fetch(`https://pixabay.com/api/?key=34923774-d7ce091dd5f122f30c7093f5d&q="dog"`).then(response => 
//     console.log(response.json()));

function onSearchFormSubmit(e) {
    e.preventDefault();
    resetMarkup();

    const inputValue = e.currentTarget.elements['searchQuery'].value.trim();
    console.log(inputValue);
    pixabayAPI.q = inputValue;

    pixabayAPI.fetchPhotos()
        .then(data => {
            console.log(data);
            if (!data.hits.length) {
                throw new Error();
            }
            // galleryListEl.insertAdjacentHTML('beforeend', makeGalleryMarkup(data.hits));
            galleryListEl.innerHTML = makeGalleryMarkup(data.hits);

            if (data.totalHits === pixabayAPI.page) {
                return;
            }

            loadMoreBtnEl.classList.remove('is-hidden');
        })
        .catch(() => {
            loadMoreBtnEl.classList.add('is-hidden');
            galleryListEl.textContent = 'Images not found';
        });

    // try {
    //     const {data} = pixabayAPI.fetchPhotos();

    //     if (!data.results.length) {
    //         console.log('Images not found');
    //         return;
    //     }

    //     galleryListEl.innerHTML = makeGalleryMarkup(data.results);
    //     loadMoreBtnEl.classList.remove('is-hidden');
    // } catch (err) {
    //     console.log(err);
    // }
}

function onLoadMoreBtnClick() {
    pixabayAPI.page += 1;
    // const numberOfPages = Math.round(data.totalHits / data.hits);
    pixabayAPI.fetchPhotos().then(data => {
        if (pixabayAPI.page === Math.round(data.totalHits / data.hits)) {
            loadMoreBtnEl.classList.add('is=hidden');
        }

        galleryListEl.insertAdjacentHTML('beforeend', makeGalleryMarkup(data.hits));
    });
}

function resetMarkup() {
    galleryListEl.innerHTML = '';
}