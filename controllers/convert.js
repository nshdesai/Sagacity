const vision = require('@google-cloud/vision');
const fs = require('fs');
const User = require('../models/User');

/**
 * GET /
 * Convert page.
 */
exports.index = (req, res) => {
  res.render('convert', {
    title: 'Convert'
  });
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('convert', {
    title: 'File Upload'
  });
};

async function quickstart(imagePath) {
  // Imports the Google Cloud client librar

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  console.log(`Image path :${imagePath}`);
  const [result] = await client.labelDetection(imagePath);
  console.log(`Result :${result}`);
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach((label) => console.log(label.description));

  return labels;
}

exports.postFileUpload = (req, res) => {
  if (!req.file) {
    req.flash('errors', { msg: 'You did not select a file.' });
  } else {
    const img = fs.readFileSync(req.file.path);
    const encodeImage = img.toString('base64');

    User.findById(req.user.id, (err, user, next) => {
      if (err) { return next(err); }
      user.notes.images.push({
        contentType: req.file.mimetype,
        image: Buffer.alloc(encodeImage, 'base64'),
        filename: req.file.filename
      });

      user.notes.processed.push({
        desc: quickstart(req.file.path)
      });

      user.save((err, done) => {
        req.flash('info', { msg: 'Your image has been saved' });
        done(err, user);
      });
    });
    req.flash('success', { msg: 'File was uploaded successfully.' });
  }

  res.redirect('/notes');
  // res.send(req.file);
};
