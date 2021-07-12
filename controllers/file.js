const { fileUpload } = require('../utils/file');

exports.upload = async (req, res, next) => {
  try {
    if (!req.files.file) {
      return res.status(400).json({ message: 'File is missing' });
    }

    const fileRes = await fileUpload(req.files.file);

    if (fileRes.status === 'success') {
      res.json({ path: fileRes.path });
    } else {
      res.status(500).json(fileRes.error);
    }
  } catch (e) {
    next(e);
  }
};
