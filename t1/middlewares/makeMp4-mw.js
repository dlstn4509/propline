const path = require('path');
const shell = require('shelljs');

module.exports = () => {
  return async (req, res, next) => {
    try {
      if (req.files.length) {
        for (let [key, val] of Object.entries(req.files)) {
          if (key.includes('video')) {
            for (let videos of val) {
              const ext = path.extname(videos.filename).toLowerCase(); //.jpg
              const fileNameArr = videos.path.split('.');
              fileNameArr.pop();
              const fileName = fileNameArr.join();
              const oriFile = videos.path;
              let makeMp4Type = fileName + '.mp4';
              if (ext !== 'mp4') {
                shell.exec(`ffmpeg -i ${oriFile} -c:v copy -c:a copy -y ${makeMp4Type}`, () => {
                  videos.filename = path.basename(videos.filename, ext) + '.mp4';
                  videos.path = makeMp4Type;
                  console.log('makeMp4 done');
                  next();
                });
              } else {
                next();
              }
            }
          }
        }
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
};
