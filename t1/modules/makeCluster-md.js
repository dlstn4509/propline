const makeCluster = (rs, top, bottom, left, right, cnt) => {
  let height = (top - bottom) / cnt;
  let width = (right - left) / cnt;
  let data = [];

  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      let latSum = 0;
      let lngSum = 0;
      let arr = rs.filter((v) => {
        return (
          v.lng > left + width * (i - 1) &&
          v.lng < left + width * i &&
          v.lat < top - height * (j - 1) &&
          v.lat > top - height * j
        );
      });
      if (arr.length !== 0) {
        for (let k = 0; k < arr.length; k++) {
          latSum += arr[k].lat;
          lngSum += arr[k].lng;
        }
        data.push([latSum / arr.length, lngSum / arr.length, arr.length, arr]);
      }
    }
  }
  return data;
};

module.exports = { makeCluster };
