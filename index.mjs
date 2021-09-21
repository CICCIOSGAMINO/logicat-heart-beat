#!/usr/bin/env node

'use strict'
// https://firebase.google.com/docs/reference/js (v9 in use)
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { getDatabase, ref, set, serverTimestamp } from 'firebase/database'

// DNS Connection module
import {
  connectionEmitter,
  startConnectionChecking
} from './connection.mjs'

// Device Id
const deviceId = process.env.DEVICE_SERIAL || ''

// Load ENV VARS for Firebase
const fireConf = JSON.parse(process.env.FIREBASE_CONF)
const email = process.env.FIREBASE_EMAIL || ''
const passw = process.env.FIREBASE_PSW || ''
// min updated interval 600 (10min)
const interval = parseInt(process.env.HEART_BEAT)

// Firebase Init
initializeApp(fireConf)
// const auth = app.auth()
const auth = getAuth()
const db = getDatabase()
let fireUser

// https://firebase.google.com/docs/database/web/read-and-write
const heartRef = ref(db, `/devices/${deviceId}/heart`)

connectionEmitter.on('connected', (data) => {
  // DEBUG - Timing + Connection OK
  // console.log(`@SCHEDULED (Online): ${data.interval}sec`)
  fireLogin(email, passw)

  // check Firebase Auth and PubSub
  if (fireUser !== undefined) {
    // logged
    console.log(`@SCHEDULED (Online): ${data.interval}sec`)
    console.log(`@TIMESTAMP ${Date.now()}`)
    set(heartRef, serverTimestamp())
  }
})

connectionEmitter.on('disconnected', (data) => {
  // Timing but NOT Online
  console.log(`@SCHEDULED (Offline): ${data.interval}sec`)
})

connectionEmitter.on('error', err => {
  console.log(`@WARNING >> ${err}`)
})

// https://firebase.google.com/docs/auth/web/start
const fireLogin = (email, passw) => {
  // check auth
  if (fireUser !== undefined) return

  // auth in firebase
  signInWithEmailAndPassword(auth, email, passw)
    .catch(err => {
      // ERROR in LOGIN - CONSOLE
      console.log(`@ERROR (Firebase_Auth): ${err.message}`, 1)
    })
}

// Listening for Firebase Auth
onAuthStateChanged(auth, user => {
  if (user) {
    // LOGGED - CONSOLE
    fireUser = user.uid
    console.log(`@USER (Logged): ${user.uid}`)
  } else {
    fireUser = undefined
  }
})

// start timing connection check
startConnectionChecking(interval)
