/**
 * GET /
 * Notes page.
 */
exports.index = (req, res) => {
    res.render('notes', {
        title: 'Notes',
        notes: req.user.notes
    });
};