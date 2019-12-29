const modules = require('./util/modules');
// const functions = modules.functions;
const app = modules.express();
// create application/x-www-form-urlencoded parser
app.use(modules.bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(modules.bodyParser.json());

app.use('/product', require('./routers/product'));

exports.api = modules.functions.https.onRequest(app);
