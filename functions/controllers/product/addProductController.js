const modules = require('../../util/modules');
const addProductModel = require('../../models/product/addProductModel');
const variantRandom = 10;

async function addProduct(req, res) {
  req.body.price = Number.parseInt(req.body.price);
  /* colors, size, variants 2 array */
  colors = modules.splitString2Array(req.body.colors);
  colorNames = modules.splitString2Array(req.body.colorNames);
  req.body.colors = [];
  for (let i = 0; i < colors.length; i++) {
    obj = {
      code: colors[i],
      name: colorNames[i]
    };
    req.body.colors.push(obj);
  }
  delete req.body.colorNames;
  req.body.sizes = modules.splitString2Array(req.body.sizes);
  req.body.variants = [];
  for (let i = 0; i < colors.length * req.body.sizes.length; i++) {
    obj = {
      colorCode: colors[Math.floor(i / req.body.sizes.length)],
      size: req.body.sizes[i % req.body.sizes.length],
      stock: Math.floor(Math.random() * variantRandom) + 1
    };
    req.body.variants.push(obj);
  }
  req.body.mainImage = req.urls[0];
  req.body.images = [];
  for (let i = 0; i < 1; i++) {
    req.body.images.push(req.urls[i + 1]);
  }
  req.body.images = req.urls;
  const schema = {
    type: 'object',
    required: [
      'title',
      'description',
      'price',
      'texture',
      'wash',
      'place',
      'note',
      'story',
      'colors',
      'sizes',
      'variants',
      'mainImage',
      'images'
    ],
    properties: {
      title: {
        type: 'string'
      },
      description: {
        type: 'string'
      },
      price: {
        type: 'integer'
      },
      texture: {
        type: 'string'
      },
      wash: {
        type: 'string'
      },
      place: {
        type: 'string'
      },
      note: {
        type: 'string'
      },
      story: {
        type: 'string'
      },
      colors: {
        type: 'array',
        items: {
          type: 'object',
          required: ['code', 'name'],
          properties: {
            code: {
              type: 'string',
              maxLength: 6,
              minLength: 6
            },
            name: {
              type: 'string',
              maxLength: 3
            }
          }
        }
      },
      sizes: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['S', 'M', 'L']
        }
      },
      variants: {
        type: 'array',
        items: {
          type: 'object',
          required: ['colorCode', 'size', 'stock'],
          properties: {
            color_code: {
              type: 'string',
              minLength: 6
            },
            size: {
              type: 'string',
              enum: ['S', 'M', 'L']
            },
            stock: {
              type: 'integer',
              minimum: 0
            }
          }
        }
      },
      mainImage: {
        type: 'string',
        format: 'url'
      },
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'url'
        }
      }
    }
  };
  const valid = modules.ajv.validate(schema, req.body);
  if (!valid) {
    res.status(400).json(modules.ajv.errors);
    return;
  }
  try {
    res.json(await addProductModel(req.body));
  } catch (err) {
    res.status(err.code).json(err);
  }
}

module.exports = addProduct;
