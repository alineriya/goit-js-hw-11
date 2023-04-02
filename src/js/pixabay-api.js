import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com';
  #API_KEY = '34923774-d7ce091dd5f122f30c7093f5d';
  #BASE_SEARCH_PARAMS = {
    key: this.#API_KEY,
    per_page: 40,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
  };

  page = 1;
  q = null;

  fetchPhotos() {
    
    return axios.get(`${this.#BASE_URL}/api/`, {
      params: {
        ...this.#BASE_SEARCH_PARAMS,
      q: this.q,
      page: this.page,
      }
    });
    
    

    // return fetch(
    //   `${this.#BASE_URL}/api/?${searchParams}`
    // ).then(res => {
    //   if (!res.ok) {
    //     throw new Error(res.status);
    //   }
    //   // console.log(res.json());
    //   return res.json();
    // }
    // );
    
  };
  // fetchPhotos().then(({data}) => console.log(data);
}
