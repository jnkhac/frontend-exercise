import axios from 'axios';

const baseUrl = 'http://jsonplaceholder.typicode.com/';

const getPhotos = async ({page, fetchLimit}) => {
  const response = await axios.get(
      baseUrl + '/photos' + `?page=${page}` + `&_limit=${fetchLimit}`);
  return response.data;
};

export default {
  getPhotos,
};
