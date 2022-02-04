const ffmpeg = require('ffmpeg');
const path = require('path');

const targetMP4File = path.join(
  __dirname,
  '/t1/storages/video/220203/220203_60e37804-015a-4017-9e44-83dfd14c29fa.mp4'
); //영상 파일
const to_img_file = './t1/public/img';
const to_mp4_with_water_mark = path.join(
  __dirname,
  '/t1/storages/video/220203/220203_60e37804-015a-4017-9e44-83dfd14c29f.mp4'
); //영상 파일
const water_mark_img = path.join(__dirname, '/t1/storages/image/thumb.png'); //이미지 파일

new ffmpeg(targetMP4File, (err, video) => {
  if (!err) {
    let water_option = {
      position: 'SE', //south east (남동쪽)
      margin_east: video.metadata.video.resolution.w * 0.1,
      margin_sud: video.metadata.video.resolution.h * 0.1,
    };

    //#4. 동영상에 워터마크 추가하기 (비동기 방식)
    video.fnAddWatermark(water_mark_img, to_mp4_with_water_mark, water_option, (error, file) => {
      if (!error) console.log('finish watermark!');
    });
  }
});
