const fs = require('fs');
const { create } = require('ipfs-http-client');

const config = require('../config');
const Nft = require('../models/nft');
const { fileUpload } = require('../utils/file');
const Query = require('../utils/query');

const ipfs = create({
  host: config.IPFS_HOST,
  port: 5001,
  protocol: 'http',
});

exports.create = async (req, res, next) => {
  try {
    if (req.files.file) {
      if (!req.body.afenPrice && !req.body.bnbPrice)
        return res.status(422).send({
          message:
            'Afen Price and BNB price are empty. Please fill in either one.',
        });

      const file = req.files.file;
      const fileName = file.name;
      const filePath = __dirname + fileName;

      const uploadedData = await fileUpload(file);

      if (uploadedData.status === 'success') {
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
              path: uploadedData.path,
              name: fileName,
              nftId: req.body.nftId,
              title: req.body.title,
              description: req.body.description,
              royalty: req.body.royalty,
              isAction: req.body.isAction,
              wallet: req.body.wallet,
              afenPrice: req.body.afenPrice ?? 0,
              bnbPrice: req.body.bnbPrice ?? 0,
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
        res.status(500).json(uploadedData.error);
      }
    } else {
      res.status(400).json({ message: 'No files were uploaded.' });
    }
  } catch (e) {}
};

exports.update = async (req, res, next) => {
  try {
    const nft = req.body;

    if (!nft.id) return res.status(400).send({ message: 'Nft Id is missed.' });

    const filter = { _id: Query.getQueryByField(Query.OPERATORS.EQ, nft.id) };

    await Nft.findOneAndUpdate(filter, nft);

    const newNft = await Nft.findOne(filter);

    res.json(newNft);
  } catch (e) {
    next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;

    const nft = await Nft.findOne({ _id: id }).exec();

    if (!nft) res.status(401).json({ message: 'Nft not found' });

    res.json({ nft });
  } catch (e) {
    next(e);
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
      afenPrice: Query.getQueryByField(Query.OPERATORS.EQ, filter.afenPrice),
    };
  }

  if (filter.bnbPrice) {
    query = {
      ...query,
      bnbPrice: Query.getQueryByField(Query.OPERATORS.EQ, filter.bnbPrice),
    };
  }

  if (filter.wallet) {
    query = {
      ...query,
      wallet: Query.getQueryByField(Query.OPERATORS.EQ, filter.wallet),
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
