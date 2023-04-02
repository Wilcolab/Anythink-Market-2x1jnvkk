const axiosLib = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1/images"

const axios = axiosLib.create({
    baseURL: baseURL,
    headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + OPENAI_API_KEY,
    },
});

async function generateImage(title) {
    const imgDef = {
        prompt: title,
        n: 1,
        size: "256x256"
    };
    try {
        const result = await axios.post(`/generations`, imgDef);
        return result.data;
    } catch (error) {
        console.error(`failed to generate image from ${title}: ${error.message}`)
    }
}

function setImage(item) {
    return new Promise((resolve, reject) => {
      if (!item.image) {
        generateImage(item.title)
          .then((result) => {
            item.image = result.data[0].url;
            resolve(item);
          })
          .catch((error) => reject(error));
      } else {
        resolve(item);
      }
    });
  }

  module.exports = {
    setImage,
}