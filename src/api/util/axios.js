const axios = require("axios");
const Fetch = async (url, method, body = null, lang) => {
  try {
    return await axios({
      method,
      url,
      body: JSON.stringify(body),
      headers: {
        "Accept-Language": lang,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};
const fetchPost = async (url, body) => {
  const fetch = await axios.post(url, body);
  return fetch.data;
};
module.exports = { Fetch, fetchPost };
