const fs = require('fs');
const { create } = require('ipfs-http-client');
const _ = require('lodash');

const config = require('../config');
const Nft = require('../models/nft');
const User = require('../models/user');
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
            'Both Afen Price and BNB price are empty. Please fill in either one.',
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
              user: req.body.userId,
              afenPrice: req.body.afenPrice ?? 0,
              bnbPrice: req.body.bnbPrice ?? 0,
              minimumBid: req.body.price,
              width: req.body.width,
              height: req.body.height,
              depth: req.body.depth,
              isVerified: req.body.isVerified,
            });
            nft.save(async err => {
              if (err) next(err);

              const newNft = await Nft.findOne({ _id: nft._id }).populate({
                path: 'user',
                model: 'User',
                select:
                  '_id name email portfolio instagram twitter discription avatar banner wallet',
              });
              res.json({ nft: newNft, message: 'NFT successfully created' });
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

    if (!nft._id) return res.status(400).send({ message: 'Nft Id is missed.' });

    const filter = { _id: Query.getQueryByField(Query.OPERATORS.EQ, nft._id) };

    await Nft.findOneAndUpdate(filter, nft);

    const newNft = await Nft.findOne(filter).populate({
      path: 'user',
      model: 'User',
      select:
        '_id name email portfolio instagram twitter discription avatar banner wallet',
    });

    res.json({ message: 'Nft updated successfully', nft: newNft });
  } catch (e) {
    next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;

    const nft = await Nft.findOne({ _id: id }).populate({
      path: 'user',
      model: 'User',
      select:
        '_id name email portfolio instagram twitter discription avatar banner wallet',
    });

    if (!nft) res.status(422).json({ message: 'Nft not found' });

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

exports.list = async (req, res, next) => {
  try {
    const { pageNo, numPerPage, filter, sort } = req.body;
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

    const nftList = await Nft.find(query)
      .populate({
        path: 'user',
        model: 'User',
        select:
          '_id name email portfolio instagram twitter discription avatar banner wallet',
      })
      .sort(_.isEmpty(sort) ? { createAt: -1 } : sort)
      .limit(numPerPage)
      .skip((pageNo - 1) * numPerPage)
      .exec();

    const total = await Nft.count(query);

    return res.json({
      total,
      numPerPage,
      pageNo,
      list: nftList,
    });
  } catch (e) {
    next(e);
  }
};
