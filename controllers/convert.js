/**
 * GET /
 * Convert page.
 */
exports.index = (req, res) => {
  res.render('convert', {
    title: 'Convert'
  });
};
