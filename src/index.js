import { makeGalleryMarkup } from './js/image-card';
import { PixabayAPI } from './js/pixabay-api';
import { makeGalleryMarkup } from './js/image-card';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchFormEl = document.querySelector('.js-search-form');
const galleryListEl = document.querySelector('.js-gallery');
const loadMoreBtnEl = document.querySelector('.js-load-more');

const pixabayAPI = new PixabayAPI();

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

async function onSearchFormSubmit(e) {
  e.preventDefault();
  resetMarkup();
  pixabayAPI.page === 1;

  const inputValue = e.currentTarget.elements['searchQuery'].value.trim();
  // console.log(inputValue);
  pixabayAPI.q = inputValue;
  


  if (inputValue === '') {
    resetMarkup();
    
    return;
  }

  try {
    const {data} = await pixabayAPI.fetchPhotos()

    if (!data.hits.length) {
        throw new Error();
      }

      galleryListEl.innerHTML = makeGalleryMarkup(data.hits);
      showSuccessNotification(data.totalHits);
      const numberOfPages = Math.ceil(data.totalHits / 40);
      if (pixabayAPI.page < numberOfPages) {
      loadMoreBtnEl.classList.remove('is-hidden');
      
  }
  } catch (e) {
    loadMoreBtnEl.classList.add('is-hidden');
      showFailureNotification();
  }
   }

async function onLoadMoreBtnClick() {
  pixabayAPI.page += 1;

  try {
    const {data} = await pixabayAPI.fetchPhotos()

    const numberOfPages = Math.ceil(data.totalHits / 40);

    if (pixabayAPI.page === numberOfPages) {
      loadMoreBtnEl.classList.add('is-hidden');
      showInfoNotification();
    }

    galleryListEl.insertAdjacentHTML('beforeend', makeGalleryMarkup(data.hits));
  } catch (e) {
    console.log(e);
  }
}

function resetMarkup() {
  galleryListEl.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');
}

function showFailureNotification() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
};

function showSuccessNotification(hitsNumber) {
    Notify.success(
      `Hooray! We found ${hitsNumber} images.`
    );
  }

function showInfoNotification() {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
}

let gallery = new SimpleLightbox('.gallery a');

gallery.refresh();