const makeFileName = async (files) => {
  try {
    let fileObj = {};
    for (let [key, [val]] of Object.entries(files)) {
      if (key === 'registration_no_file') {
        fileObj.registration_no_file = val.filename;
      } else if (key === 'company_no_file') {
        fileObj.company_no_file = val.filename;
      }
    }
    return fileObj;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { makeFileName };
