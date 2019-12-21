const modules = require('./util/modules');
const functions = modules.functions;
const app = modules.express();

app.use(modules.express.json());
app.use('/products', require('./routers/products'));

exports.api = functions.https.onRequest(app);
