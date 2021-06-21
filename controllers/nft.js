const fs = require('fs');
const { create } = require('ipfs-http-client');

const Nft = require('../models/nft');
const config = require('../config');

const ipfs = create({
  host: config.IPFS_HOST,
  port: 5001,
  protocol: 'http',
});

exports.create = async (req, res, next) => {
  if (req.files.file) {
    const file = req.files.file;
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
          title: req.body.title,
          description: req.body.description,
          isAction: req.body.isAction,
          userId: req.body.userId,
          price: req.body.price,
          minimumBid: req.body.price,
          width: req.body.width,
          height: req.body.height,
          depth: req.body.depth,
        });
        nft.save(err => {
          if (err) next(err);

          res.json({ nft, message: 'NFT successfully created' });
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
