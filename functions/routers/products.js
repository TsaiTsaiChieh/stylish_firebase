const modules = require('../util/modules');
const router = modules.express.Router();

router.post('/', require('../controllers/product/addProductController'));
module.exports = router;
