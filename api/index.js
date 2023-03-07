const express = require('express');
const multer = require('multer');

const app = express();

// Set up multer to handle file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, 'recording.webm');
    },
  }),
});

// Handle POST requests to /api/v1/chat
app.post('/api/v1/chat', upload.single('audio'), (req, res) => {
  console.log(req.file); // logs information about the uploaded file

  // Do something with the uploaded file, e.g. save it to a database or process it in some way

  // Set the Access-Control-Allow-Origin header to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.sendStatus(200); // send a response indicating success
});

// Start the server
app.listen(3005, () => {
  console.log('Server is running on port 3005');
});
