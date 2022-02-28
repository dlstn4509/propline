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
    // let ji = makeBunJi(_ji);
    let sigunguCd = bcode.substring(0, 5);
    let bjdongCd = bcode.substring(5, 10);
    console.log(_ji);

    const data = await axios.get(
      `http://apis.data.go.kr/1613000/BldRgstService_v2/${infotype}?ServiceKey=${BUILDINGINFO_KEY}&sigunguCd=${sigunguCd}&bjdongCd=${bjdongCd}&bun=${bun}&ji=${ji}&numOfRows=1000`
    );
    console.log(
      `http://apis.data.go.kr/1613000/BldRgstService_v2/${infotype}?ServiceKey=${BUILDINGINFO_KEY}&sigunguCd=${sigunguCd}&bjdongCd=${bjdongCd}&bun=${bun}&ji=${ji}&numOfRows=1000`
    );
    return data.data.response.body.items.item;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { buildingInfo };
