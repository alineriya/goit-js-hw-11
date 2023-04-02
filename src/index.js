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

function onSearchFormSubmit(e) {
  e.preventDefault();
  resetMarkup();
  

  const inputValue = e.currentTarget.elements['searchQuery'].value.trim();
  // console.log(inputValue);
  pixabayAPI.q = inputValue;
  pixabayAPI.page === 1;


  if (inputValue === '') {
    resetMarkup();
    
    return;
  }

  pixabayAPI
    .fetchPhotos()
    .then(({data}) => {
      console.log(data);
      if (!data.hits.length) {
        throw new Error();
      }

      galleryListEl.innerHTML = makeGalleryMarkup(data.hits);

      const numberOfPages = Math.ceil(data.totalHits / 40);
      if (pixabayAPI.page < numberOfPages) {
      loadMoreBtnEl.classList.remove('is-hidden');
      showSuccessNotification(data.totalHits);
    }
    })
    .catch(() => {
      loadMoreBtnEl.classList.add('is-hidden');
      showFailureNotification();
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
  pixabayAPI.fetchPhotos().then(({data}) => {
    const numberOfPages = Math.ceil(data.totalHits / 40);

    if (pixabayAPI.page === numberOfPages) {
      loadMoreBtnEl.classList.add('is-hidden');
    }

    galleryListEl.insertAdjacentHTML('beforeend', makeGalleryMarkup(data.hits));
  });
}

function resetMarkup() {
  galleryListEl.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');
}

let gallery = new SimpleLightbox('.js-gallery a', {
  captionsDelay: 250,
});

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
