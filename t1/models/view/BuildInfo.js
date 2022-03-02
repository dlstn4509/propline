const axios = require('axios');
const { BUILDINGINFO_KEY } = process.env;

const makeBunJi = (_type) => {
  let type = _type.toString();
  if (type.length < 4) {
    for (let i = 0; type.length < 4; i++) {
      type = '0' + type;
    }
  }
  return type;
};

const buildingInfo = async (bcode, _bun, _ji, infotype) => {
  try {
    let bun = makeBunJi(_bun);
    let ji = _ji === 'undefined' ? '0000' : makeBunJi(_ji);
    let sigunguCd = bcode.substring(0, 5);
    let bjdongCd = bcode.substring(5, 10);

    const data = await axios.get(
      `http://apis.data.go.kr/1613000/BldRgstService_v2/${infotype}?ServiceKey=${BUILDINGINFO_KEY}&sigunguCd=${sigunguCd}&bjdongCd=${bjdongCd}&bun=${bun}&ji=${ji}&numOfRows=10000`
    );
    return data.data.response.body.items.item;
  } catch (err) {
    throw new Error(err);
  }
};

const junyubu = async (bcode, _bun, _ji, infotype, bldNm, dongNm) => {
  try {
    let allArr = []; // 전체 데이터
    let set = new Set(); // arrAll[0]
    let arr = []; // arrAll[1]
    let bun = makeBunJi(_bun);
    let ji = _ji === 'undefined' ? '0000' : makeBunJi(_ji);
    let sigunguCd = bcode.substring(0, 5);
    let bjdongCd = bcode.substring(5, 10);

    const data = await axios.get(
      `http://apis.data.go.kr/1613000/BldRgstService_v2/${infotype}?ServiceKey=${BUILDINGINFO_KEY}&sigunguCd=${sigunguCd}&bjdongCd=${bjdongCd}&bun=${bun}&ji=${ji}&dongNm=${encodeURI(
        dongNm
      )}&numOfRows=10000`
    );
    let lists = data.data.response.body.items.item;

    for (let v of lists) {
      if (v.bldNm === bldNm) {
        set.add(v.hoNm);
        arr.push(v);
      }
    }
    allArr.push(Array.from(set));
    allArr[0].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    allArr[0].sort((a, b) => (a.length < b.length ? -1 : a.length > b.length ? 1 : 0));

    allArr.push(arr);
    allArr[1].sort((a, b) => (a.hoNm < b.hoNm ? -1 : a.hoNm > b.hoNm ? 1 : 0));
    allArr[1].sort((a, b) => (a.hoNm.length < b.hoNm.length ? -1 : a.hoNm.length > b.hoNm.length ? 1 : 0));

    return allArr;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { buildingInfo, junyubu };
