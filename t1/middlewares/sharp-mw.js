const sharp = require('sharp');
const path = require('path');
const { ensureDir } = require('fs-extra');

module.exports = () => {
  return async (req, res, next) => {
    try {
      if (req.files) {
        for (let [key, val] of Object.entries(req.files)) {
          if (key.includes('image')) {
            for (let image of val) {
              let loc = path.join(image.destination, './thumb');
              await ensureDir(loc);
              image.thumb = await sharp(image.path)
                .resize(200)
                .jpeg({ mozjpeg: true })
                .composite([
                  {
                    input: './t1/storages/image/thumb.png',
                    gravity: 'center', // southeast
                  },
                ])
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
