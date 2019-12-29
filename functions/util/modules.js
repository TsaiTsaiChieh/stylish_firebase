const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');
const express = require('express');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, useDefaults: true });
const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
// const mimeType = require('mime-types');
const uuidv1 = require('uuid/v1'); // for unique id generation

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://stylish-eec22.firebaseio.com',
  storageBucket: 'stylish-eec22.appspot.com'
});
const bucket = admin.storage().bucket('stylish-eec22.appspot.com');
function splitString2Array(string) {
  return String(string)
    .replace(/\s+/g, '')
    .split(',');
}
const firestore = admin.firestore();
module.exports = {
  admin,
  express,
  bodyParser,
  functions,
  firestore,
  ajv,
  splitString2Array,
  bucket,
  path,
  os,
  fs,
  Busboy,

  uuidv1
};
