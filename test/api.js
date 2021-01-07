let Rapi = require('../reliableapi');

let rapi = new Rapi('https://lichess.org/');

module.exports = async () => {

  let headers = {
    'Accept': 'application/json'
  };

  let res = await rapi.json('api/users/status?ids=heroku', {
    headers
  });
  console.log(res);

  res = await rapi.json('api/users/status/bad', {
    headers
  });
  console.log(res);
  
};
