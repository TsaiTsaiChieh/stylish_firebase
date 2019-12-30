const modules = require('../../util/modules');
const dbName = require('../../util/dbName');
function addProduct(args) {
  return new Promise(async function(resolve, reject) {
    try {
      args.createTime = modules.admin.firestore.Timestamp.now();
      let result = await modules.firestore
        .collection(dbName.productFirestoreName)
        .add(args);
      resolve({ productId: result._path.segments[1] });
    } catch (err) {
      console.log('err happend...', err);
      reject({ code: 500, error: err });
    }
  });
}

module.exports = addProduct;
