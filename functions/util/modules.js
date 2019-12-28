const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');
const express = require('express');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');
const AJV = require('ajv');
const ajv = new AJV({ allErrors: true, useDefaults: true });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://stylish-eec22.firebaseio.com'
});
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
  splitString2Array
};
