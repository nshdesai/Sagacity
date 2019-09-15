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
    var fs = require('fs');
    if (!req.file) {
        req.flash('errors', { msg: 'You did not select a file.' });
    } else {
        var img = fs.readFileSync(req.file.path);
        var encode_image = img.toString('base64');

        User.findById(req.user.id, (err, user) => {
            if (err) { return next(err); }
            user.notes.images.push({ contentType: req.file.mimetype, image: new Buffer(encode_image, 'base64') });
            user.save((err) => {
                req.flash('info', { msg: 'Your image has been saved' });
                // done(err, user);
            });
        })
        req.flash('success', { msg: 'File was uploaded successfully.' });
    }
    res.redirect('/convert');
    // res.send(req.file);
};