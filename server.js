import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

const Book = mongoose.model('Book', bookSchema)

// RESET_DB=true npm run dev
if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Book.deleteMany()
    booksData.forEach((item) => {
      new Book(item).save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API Book reviews')
})

app.get('/books', async (req, res) => {
  const allBooks = await Book.find()
  res.json(allBooks)
})

app.get('/books/id/:bookID', async (req, res) => {
  const findID = await Book.findOne({ bookID: req.params.bookID })
  if (findID) {
    res.json(findID)
  } else {
    res.status(404).json({ error: 'Sorry, no book found with that ID' })
  }
})

app.get('/books/isbn/:isbn', async (req, res) => {
  const findIsbn = await Book.findOne({ isbn: req.params.isbn })
  if (findIsbn) {
    res.json(findIsbn)
  } else {
    res.status(404).json({ error: 'Sorry, no book with that isbn' })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
