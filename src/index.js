require('dotenv').config()

import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'

import apiController from './controllers/api.controller'

const {
  HOST = '0.0.0.0',
  PORT = 1337,
  DB_URI,
  NODE_ENV = 'production'
} = process.env

if (!DB_URI || 'string' !== typeof DB_URI) {
  throw new Error(`Expected DB_URI to be string.`)
}

mongoose.connect(DB_URI)

const db = mongoose.connection
db.on('error', (err) => console.error(`connection error: ${err}`))
db.on('open', () => console.log(`MongoDB connected`))

const app = express()

app.use(morgan('dev'))

app.get('/', (req, res) => res.send({ msg: 'OK' }))

app.use('/api', apiController)

app.listen(+PORT, HOST, () =>
  console.log(`Server started in mode ${NODE_ENV} on ${HOST}:${PORT}...`))
