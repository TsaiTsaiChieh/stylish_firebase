const modules = require('../../util/modules');

function addProduct(args) {
  return new Promise(async function(resolve, reject) {
    try {
      let result = await modules.firestore.collection('products').add(args);
      console.log(args);

      console.log(result);
      resolve(args);
    } catch (err) {
      console.log('err happend...', err);
      reject({ code: 500, error: err });
    }
  });
}

module.exports = addProduct;
