const express = require("express");
const mongoose = require("mongoose");
const { Book } = require("./models/book-model");
const { Student } = require("./models/student-model");
const ISBNConverter = require("simple-isbn").isbn;
const ISBNValidator = require("./utils/ISBNValidate");
const PORT = process.env.PORT || 5001;
const app = express();
const cors = require("cors");
/*
const path = require('path');

const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath + '/index.html'));
});
*/
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

/*   Mongoose Connection to MongoDB   */
mongoose
  .connect(
    "mongodb+srv://jmkemp20:jajabinks@classroomlibdb.rpwpl.mongodb.net/ClassroomLibDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .catch((e) => {
    console.error("Connection Error", e.message);
  });

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MONGODB");
});

db.on("error", console.error.bind(console, "connection error:"));

/*   API BACKEND via Express APP   */

app.post("/students", (req, res) => {
  const parentId = req.body.userId;
  Student.find({ parent_id: parentId }, (err, result) => {
    res.json(result);
  });
});

// Used for populating the "Check In list" for each student
app.post("/studentsBooks", (req, res) => {
  const { parentId, studentId } = req.body;
  const returnData = [];
  Student.findOne({ _id: studentId, parent_id: parentId }, (err, result) => {
    if (err) return res.sendStatus(500);
    if (result) {
      for (let i = 0; i < result.book_list.length; i++) {
        bookId = mongoose.Types.ObjectId(result.book_list[i]);
        Book.findOne({ _id: bookId }, (err, book) => {
          if (err) throw err;
          returnData.push({ book, checkout_time: result.checkout_list[i] });
          if (result.book_list.length === Object.keys(returnData).length) {
            res.json(returnData);
          }
        });
      }
    } else {
        // No student found
        res.sendStatus(500);
    }
  });
});

app.post("/library", (req, res) => {
  const parentId = req.body.userId;
  Book.find({ parent_id: parentId }, (error, result) => {
    res.json(result);
  });
});

app.post("/checkin", (req, res) => {
  const { userId, studentId, bookId } = req.body;
  Student.findOne({ _id: studentId, parent_id: userId }, (err, foundStudent) => {
      if (err) return res.sendStatus(500);
      if (foundStudent) {
        if (foundStudent.book_list.includes(bookId)) {
            const book_pos = foundStudent.book_list.indexOf(bookId);
            foundStudent.book_list.splice(book_pos, 1);
            foundStudent.checkout_list.splice(book_pos, 1);
            foundStudent.save((studentSaveErr) => {
              if (studentSaveErr) return res.sendStatus(500);
              console.log(`${foundStudent.name} checked in ${bookId}`);
              res.send({ message: "Successful Checkin" });
            });
        } else {
          // Book not in students book list
          res.sendStatus(500);
        }
      } else {
        // Student Not Found (should never happen)
        res.sendStatus(500);
      }
  });
});

app.post("/checkout", (req, res) => {
  const { userId, studentId, isbn } = req.body;
  if (ISBNValidator.isValidISBN(isbn)) {
    Student.findOne({ _id: studentId, parent_id: userId }, (err, foundStudent) => {
      if (err) return res.sendStatus(500);
      if (foundStudent) {
        const myQuery = isbn.length == 10 ? { isbn10: isbn } : { isbn13: isbn };
        Book.findOne(myQuery, (newErr, foundBook) => {
          if (newErr) return res.sendStatus(500);
          if (foundBook) { // Found book with given ISBN
            if (!foundStudent.book_list.includes(foundBook._id)) {
                foundStudent.num_books += 1; // Add to lifetime books checked out (will never decrement)
                foundStudent.book_list.push(foundBook._id);
                foundStudent.checkout_list.push(Math.floor(Date.now() / 1000));
                foundStudent.save((studentSaveErr) => {
                    if (studentSaveErr) return res.sendStatus(500);
                    console.log(`${foundStudent.name} checked out ${foundBook._id}`);
                    res.send({ message: "Successful Checkout" });
                });
            } else {
                res.send({ message: "You already have this book checked out!"});
            }
          } else {
            // Did not find book with given ISBN maybe check alt ISBN?
            const secondQuery =
              isbn.length == 10 ? { isbn13: ISBNConverter.toIsbn13(isbn) } : { isbn10: ISBNConverter.toIsbn10(isbn) };
              Book.findOne(secondQuery, (secErr, foundAltBook) => {
                if (secErr) return res.sendStatus(500);
                if (foundAltBook) {
                  // Found book with given ISBN
                  if (!foundStudent.book_list.includes(foundAltBook._id)) {
                    foundStudent.num_books += 1; // Add to lifetime books checked out (will never decrement)
                    foundStudent.book_list.push(foundAltBook._id);
                    foundStudent.checkout_list.push(
                      Math.floor(Date.now() / 1000)
                    );
                    foundStudent.save((studentSaveErr) => {
                      if (studentSaveErr) return res.sendStatus(500);
                      console.log(
                        `${foundStudent.name} checked out ${foundAltBook._id}`
                      );
                      res.send({ message: "Successful Checkout" });
                    });
                  } else {
                    res.send({
                      message: "You already have this book checked out!",
                    });
                  }
                } else {
                  res.send({ message: "ISBN Not In Library" });
                }
              });
          }
        });
      } else {
        // No student found
        res.sendStatus(500);
      }
    });
  } else {
    // Not a valid ISBN 10 or 13
    res.send({ message: "Invalid ISBN" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
