import axios from "axios";

const url = "http://localhost:3001/persons";

const getAll = () => {
  return axios.get(url).then((response) => response.data);
};

const create = (newContact) => {
  return axios.post(url, newContact).then((response) => response.data);
};

export default { getAll, create };
