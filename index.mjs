#!/usr/bin/env node

'use strict'
// Firebase module 
import firebase from 'firebase'

// DNS Connection module  
import { 
  connectionEmitter, 
  startConnectionChecking,
  isInternetAvailable
} from './connection.mjs'

// Device Id 
const deviceId = process.env['DEVICE_SERIAL'] || ''

// Load ENV VARS for Firebase
const fireConf = JSON.parse(process.env['FIREBASE_CONF'])
const email = process.env['FIREBASE_EMAIL'] || ''
const passw = process.env['FIREBASE_PSW'] || ''
const interval = parseInt(process.env['HEART_BEAT'])
 
// Firebase Init 
const app = firebase.initializeApp(fireConf)
const auth = app.auth()
const db = app.database()
let fireUser = undefined

// Firebase References 
const heartRef = db.ref(`/devices/${deviceId}/heart`)

connectionEmitter.on('connected', (data) => {
  // Timing + Connection OK 
  // console.log(`@SCHEDULED (Online): ${data.interval}sec`)

  fireLogin(email, passw)

  // check Firebase Auth and PubSub 
  if(fireUser !== undefined) {
  // logged
  console.log(`@SCHEDULED (Online): ${data.interval}sec`)
  console.log(`@TIMESTAMP ${Date.now()}`)
  heartRef.set(firebase.database.ServerValue.TIMESTAMP)

  } 

})
connectionEmitter.on('disconnected', (data) => {
  // Timing but NOT Online 
  console.log(`@SCHEDULED (Offline): ${data.interval}sec`)
})

/**
 * Firebase signin - Try to login to Firebase Cloud Infrastructure 
 * 
 */
const fireLogin = (email, passw) => {

  // check auth 
  if(fireUser !== undefined) return 

  // auth in firebase 
  auth.signInWithEmailAndPassword(email, passw)
  .catch(err => {
    // ERROR in LOGIN - CONSOLE 
    console.log(`@ERROR (Firebase_Auth): ${err.message}`, 1)
  })
}

/**
 *  Listening for Firebase Auth
 * 
 */ 
auth.onAuthStateChanged(user => {
  if(user) {
    // LOGGED - CONSOLE 
    fireUser = user.uid
    console.log(`@USER (Logged): ${ user.uid }`)

  } else {
    fireUser = undefined
  }
})


// start timing connection check 
startConnectionChecking(interval)