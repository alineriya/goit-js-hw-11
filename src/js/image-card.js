export const makeGalleryMarkup = images =>
  images
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" width=280 height=200 loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes </b><br>${likes}</br>
      </p>
      <p class="info-item">
        <b>Views </b><br>${views}</br>
      </p>
      <p class="info-item">
        <b>Comments </b><br>${comments}</br>
      </p>
      <p class="info-item">
        <b>Downloads </b><br>${downloads}</br>
      </p>
    </div>
  </div>
    `
    )
    .join('');
