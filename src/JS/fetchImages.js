import axios from 'axios';

async function fetchImages(name, page, perPage) {
  const API_KEY = '29162454-addc068f3f814e0a3a02d912a';
  const URL = 'https://pixabay.com/api/';

  try {
    const response = await axios.get(
      `${URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response.data;
  } catch (error) {
    console.log('ERROR: ' + error);
  }
}
export { fetchImages };
