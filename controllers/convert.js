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
    if (!req.file) {
        req.flash('errors', { msg: 'You did not select a file.' });
    } else {
        req.flash('success', { msg: 'File was uploaded successfully.' });
    }
    res.redirect('/convert');
    // res.send(req.file);
};