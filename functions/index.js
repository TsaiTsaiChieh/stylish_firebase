const modules = require('./util/modules');
// const functions = modules.functions;
const app = modules.express();
const Busboy = require('busboy');
const multer = require('multer');
app.use(modules.bodyParser.json());
// create application/x-www-form-urlencoded parser
app.use(modules.bodyParser.urlencoded({ extended: true }));

app.use('/products', require('./routers/products'));

app.post('/test', function(req, res) {
  console.log(req.file);
  res.send(req.files);
});

exports.api = modules.functions.https.onRequest(app);
