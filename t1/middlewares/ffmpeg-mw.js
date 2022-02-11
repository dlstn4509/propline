const ffmpeg = require('ffmpeg');
const path = require('path');
const shell = require('shelljs');

module.exports = () => {
  return async (req, res, next) => {
    try {
      if (req.files) {
        for (let [key, val] of Object.entries(req.files)) {
          if (key.includes('video')) {
            for (let videos of val) {
              const oriFile = videos.path;
              const waterMarkMP4File = path.join(
                videos.destination,
                '../beforethumb',
                videos.filename
              );
              const waterMarkImg = './t1/storages/image/thumb.png';

              new ffmpeg(oriFile, async (err, video) => {
                if (!err) {
                  let waterOption = {
                    position: 'SW', //south east (남동쪽)
                    margin_west: video.metadata.video.resolution.w * 0.1,
                    margin_sud: video.metadata.video.resolution.h * 0.1,
                  };
                  video.fnAddWatermark(
                    waterMarkImg,
                    waterMarkMP4File,
                    waterOption,
                    (error, file) => {
                      if (!error) {
                        shell.exec(
                          `ffmpeg -i ${file} -vf "scale=320:240" ${videos.destination}/thumb/${videos.filename} -y`,
                          () => {
                            console.log('done');
                            // next();
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          }
        }
      }
      // console.log('done');
      next();
    } catch (err) {
      next(err);
    }
  };
};
