const fetch = require('node-fetch');

// await fetch(url, { headers, method: 'POST', params });

function Rapi(baseUrl = '') {

  this.json = async (...args) => {
    try {
      let res = await new ApiRequest(baseUrl)
        .fetch(...args);
      return await res.json();
    } catch (e) {
      console.error(e.message);
      return null;
    }
  };
  
}

function ApiRequest(baseUrl, retries = 3) {

  let res;

  const fetchNow = async (url, ...args) => {

    let res = await fetch(baseUrl + url, ...args);

    if (res.ok) {
      return res;
    }

    let errorBody = await res.text();

    throw `${url} ${res.status} ${errorBody.substring(0, 100)}`;
  };

  const fetchRetry = async (...args) => {
    return new Promise(resolve =>
      setTimeout(() => this.fetch(...args).then(resolve), 1000)
    );
  };

  this.fetch = async (url, ...args) => {
    if (retries === 0) {
      throw new FailedApiRequest(url, res);
    }

    try {
      return await fetchNow(url, ...args);
    } catch (e) {
      res = e;
      retries--;
      return await fetchRetry(url, ...args);
    }
  };
}

class FailedApiRequest extends Error {
  constructor(url, response) {
    super(`Failed Api Request ${url} ${response}`);
    this.url = url;
    this.response = response;
  }
}

module.exports = Rapi;
