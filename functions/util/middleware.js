const modules = require('./modules');
const dbName = require('./dbName');

// ref: https://cloud.google.com/functions/docs/writing/http#writing_http_files-nodejs
function busboyProcessor(req, res, next) {
  const busboy = new modules.Busboy({
    headers: req.headers,
    limits: {
      // Cloud functions impose this restriction anyway
      fileSize: 10 * 1024 * 1024
    }
  });
  const fields = {};
  // This code will process each non-file field in the form.
  busboy.on('field', function(key, val) {
    fields[key] = val;
  });
  const fileWrites = [];
  const uploads = {};
  const tmpdir = modules.os.tmpdir();
  // This code will process each file uploaded.
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    // console.log(`Busboy file ${fieldname}: ${filename}`);
    const filepath = modules.path.join(tmpdir, filename);
    // uploads[`${fieldname}_${Date.now()}`] = filepath;

    uploads[fieldname] = filepath;
    const writeStream = modules.fs.createWriteStream(filepath);
    file.pipe(writeStream);

    // File was processed by Busboy; wait for it to be written to disk.
    const promise = new Promise(function(resolve, reject) {
      file.on('end', function() {
        writeStream.end();
      });
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    fileWrites.push(promise);
  });
  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  busboy.on('finish', async function() {
    await Promise.all(fileWrites);
    // console.log(req.body);
    // console.log('Busboy finish');
    req.body = fields;
    req.filePath = uploads;

    // rm file in memory
    // for (const key in uploads) {
    //   console.log(uploads[key]);
    //   modules.fs.unlinkSync(uploads[key]);
    // }

    // return res.send({
    //   status: 'Success',
    //   text: 'Great job???'
    // });
    next();
  });
  busboy.end(req.rawBody);
}
async function upload2bucket(req, res, next) {
  let gcpResponses = [];
  let uuids = [];
  for (const key in req.filePath) {
    let uuid = modules.uuidv1();
    uuids.push(uuid);
    gcpResponses.push(
      await modules.bucket.upload(req.filePath[key], {
        destination: `${dbName.productFolderName}/${key}`,
        public: true,
        // metadata: {
        // cacheControl: 'public, max-age=31536000'
        // contentType: modules.mimeType.lookup(req.filePath[key]),
        metadata: {
          firebaseStorageDownloadTokens: uuid
        }
        // }
      })
    );
  }
  let urls = [];
  // console.log(gcpResponses[0]);
  // console.log('.....', gcpResponses[1]);
  for (let i = 0; i < gcpResponses.length; i++) {
    let file = gcpResponses[i][0];
    urls.push(
      'https://firebasestorage.googleapis.com/v0/b/' +
        file.bucket.id +
        '/o/' +
        encodeURIComponent(file.name) +
        '?alt=media&token=' +
        uuids[i]
    );
  }
  req.urls = urls;
  console.log(urls);

  // console.log(gcpResponse.length);
  // let a = gcpResponse[0][0];
  // let b = gcpResponse[1][0];
  // console.log(b.name, gcpResponse[1][1].size);

  // console.log(a.name, gcpResponse[0][1].size, gcpResponse[0].length);

  // for (let i = 0; i < a.length; i++) {
  //   console.log(i, a[i].name, a[i].size);

  //   // let file = gcpResponse[0][i];
  //   // console.log(file);
  // }

  // req.fileUrl =
  next();
}
module.exports = { busboyProcessor, upload2bucket };
