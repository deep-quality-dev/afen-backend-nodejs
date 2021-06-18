const fs = require('fs');
const { create } = require('ipfs-http-client');

const Nft = require('../models/nft');
const config = require('../config');

const ipfs = create({
  host: '3.239.161.29',
  port: 5001,
  protocol: 'http',
});

exports.create = async (req, res) => {
  if (req.files.inputFile) {
    const file = req.files.inputFile;
    const fileName = file.name;
    const filePath = __dirname + fileName;
    file.mv(filePath, async err => {
      try {
        if (err) {
          console.log('Error: failed to download file');
          return res.status(500).send(err);
        }

        const fileHash = await addFile(fileName, filePath);
        console.log('File Hash received __>', fileHash);
        fs.unlink(filePath, err => {
          if (err) {
            console.log('Error: Unable to delete file.', err);
          }
        });
        const nft = new Nft({
          fileHash,
          name: fileName,
          userId: req.body.userId,
        });
        nft.save(err => {
          if (err) next(err);

          res.json(nft);
        });
      } catch (e) {
        next(e);
      }
    });
  } else {
    res.status(400).json({ message: 'No files were uploaded.' });
  }
};

const addFile = async (fileName, filePath) => {
  const file = fs.readFileSync(filePath);
  const filesAdded = await ipfs.add(
    {
      path: fileName,
      content: file,
    },
    {
      progress: len => console.log('Uploading file ... ' + len),
    },
  );
  console.log('File is added to NFT', filesAdded);
  return filesAdded.cid.toString();
};
