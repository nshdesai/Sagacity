const vision = require('@google-cloud/vision');
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

exports.postFileUpload = (req, res) => {
  const User = require('../models/User');
  const fs = require('fs');
  if (!req.file) {
    req.flash('errors', { msg: 'You did not select a file.' });
  } else {
    async function quickstart(image_path) {
      // Imports the Google Cloud client librar

      // Creates a client
      const client = new vision.ImageAnnotatorClient();

      // Performs label detection on the image file
      console.log(`Image path :${image_path}`);
      const [result] = await client.labelDetection(image_path);
      console.log(`Result :${result}`);
      const labels = result.labelAnnotations;
      console.log('Labels:');
      labels.forEach((label) => console.log(label.description));

      return labels;
    }

    const img = fs.readFileSync(req.file.path);
    const encode_image = img.toString('base64');

    User.findById(req.user.id, (err, user) => {
      if (err) { return next(err); }
      user.notes.images.push({
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64'),
        filename: req.file.filename
      });

      user.notes.processed.push({
        desc: quickstart(req.file.path)
      });

      user.save((err) => {
        req.flash('info', { msg: 'Your image has been saved' });
        // done(err, user);
      });
    });
    req.flash('success', { msg: 'File was uploaded successfully.' });
  }

  res.redirect('/notes');
  // res.send(req.file);
};
