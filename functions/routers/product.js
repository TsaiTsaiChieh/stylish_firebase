const modules = require('../util/modules');
const router = modules.express.Router();
const middleware = require('../util/middleware');
router.post(
  '/',
  middleware.busboyProcessor,
  middleware.upload2bucket,
  require('../controllers/product/addProductController')
);
module.exports = router;
