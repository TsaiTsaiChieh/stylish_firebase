const models = require('../../util/modules');
const addProductModel = require('../../models/product/addProductModel');
async function addProduct(req, res) {
  try {
    const schema = {
      type: 'object',
      required: ['title', 'price'],
      properties: {
        title: {
          type: 'string'
        },
        price: {
          type: 'integer'
        }
      }
    };

    const valid = models.ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json(models.ajv.errors);
    }
    res.json(await addProductModel(req.body));
  } catch (err) {
    res.json(err);
  }
}

// function addProduct(req, res) {

//   addProductModel(req.body)
//     .then(function(body) {
//       res.json(body);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// }

module.exports = addProduct;
