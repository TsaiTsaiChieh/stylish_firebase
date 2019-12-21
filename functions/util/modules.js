const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');
const express = require('express');
const functions = require('firebase-functions');
const AJV = require('ajv');
const ajv = new AJV({ allErrors: true, useDefaults: true });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://stylish-eec22.firebaseio.com'
});
const firestore = admin.firestore();
module.exports = { admin, express, functions, firestore, ajv };
