import axios from "axios";

const URL = 'https://pixabay.com/api/';
const KEY = '29341553-4d62c8252f38dd5e4df787fdd';
const IMAGE_TYPE = 'photo';
const ORIENTATION = 'horizontal';
const SAFESEARCH = 'true';
const PER_PAGE = 40;

async function imagesApiService(searchQuery, page) {
    const REQUEST_URL = `${URL}?key=${KEY}&q=${searchQuery}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION}&safesearch=${SAFESEARCH}&page=${page}&per_page=${PER_PAGE}`;

    const fetchRequest = await axios.get(REQUEST_URL);
    const response = fetchRequest.data;
    return response;
}
export { imagesApiService, PER_PAGE };
