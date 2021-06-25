const fs = require('fs');
const { create } = require('ipfs-http-client');

const config = require('../config');
const Nft = require('../models/nft');
const Query = require('../utils/query');

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
          wallet: req.body.wallet,
          afenPrice: req.body.afenPrice,
          nftPrice: req.body.nftPrice,
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

exports.list = (req, res, next) => {
  const { pageNo, numPerPage, filter } = req.body;
  let query = {};

  if (filter.isAuction) {
    query = {
      ...query,
      isAuction: Query.getQueryByField(Query.OPERATORS.EQ, filter.isAuction),
    };
  }

  if (filter.afenPrice) {
    query = {
      ...query,
      price: Query.getQueryByField(Query.OPERATORS.EQ, filter.afenPrice),
    };
  }

  if (filter.nftPrice) {
    query = {
      ...query,
      price: Query.getQueryByField(Query.OPERATORS.EQ, filter.nftPrice),
    };
  }

  if (filter.wallet) {
    query = {
      ...query,
      price: Query.getQueryByField(Query.OPERATORS.EQ, filter.wallet),
    };
  }

  Nft.find(query, (err, nftList) => {
    if (err) return next(err);

    return res.json({
      total: nftList.length,
      numPerPage,
      pageNo,
      list: nftList.splice((pageNo - 1) * numPerPage, numPerPage),
    });
  });
};
