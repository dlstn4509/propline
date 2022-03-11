const sharp = require('sharp');
const path = require('path');
const { ensureDir } = require('fs-extra');
const sizeOf = require('image-size');

module.exports = () => {
  return async (req, res, next) => {
    try {
      if (req.files) {
        for (let [key, val] of Object.entries(req.files)) {
          if (key.includes('image')) {
            for (let image of val) {
              let loc = path.join(image.destination, './thumb');
              const dimensions = sizeOf(image.path);
              await ensureDir(loc);
              image.thumb = await sharp(image.path)
                .composite([
                  {
                    input: './t1/storages/image/thumb.png',
                    gravity: 'southeast', // center
                  },
                ])
                .resize(500)
                .jpeg({ mozjpeg: true })
                .toFile(path.join(loc, image.filename));
            }
          } else {
            for (let video of val) {
              let loc = path.join(video.destination, './thumb');
              await ensureDir(loc);
            }
          }
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
