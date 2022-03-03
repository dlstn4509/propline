const path = require('path');
const shell = require('shelljs');

module.exports = () => {
  return async (req, res, next) => {
    try {
      if (req.files) {
        for (let [key, val] of Object.entries(req.files)) {
          if (key.includes('video')) {
            for (let videos of val) {
              const ext = path.extname(videos.filename).toLowerCase(); //.jpg
              const fileNameArr = videos.path.split('.');
              fileNameArr.pop();
              const fileName = fileNameArr.join();
              const oriFile = path.join(videos.destination, '/thumb', videos.filename);
              const mp4FileRootArr = oriFile.split('.');
              mp4FileRootArr.pop();
              const mp4FileRoot = mp4FileRootArr.join() + '.mp4';
              let makeMp4Type = fileName + '.mp4';

              if (ext !== 'mp4') {
                shell.exec(`ffmpeg -i ${oriFile} -c:v copy -c:a copy ${mp4FileRoot} -y`, () => {
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

// ffmpeg -i D:\NodeWebsite\propline\t1\storages\video\220303\thumb\220303_3174f109-670c-4f42-b029-79ff8cdbd246.avi -c:v copy -c:a copy D:\NodeWebsite\propline\t1\storages\video\220303\thumb\220303_3174f109-670c-4f42-b029-79ff8cdbd246.mp4

// ffmpeg -i D:\NodeWebsite\propline\t1\storages\video\220303\thumb\220303_c516b176-d0c5-4e1d-83a8-8083f2e55097.avi -c:v copy -c:a copy D:\NodeWebsite\propline\t1\storages\video\220303\thumb\220303_c516b176-d0c5-4e1d-83a8-8083f2e55097.mp4
