import { uploadImages } from "./calls/images";

export const imageUpload = async (files) => {
  let convertedImages = [];
  let images = [];
  let count = 0;

  const blobToBase64 = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const base64 = await blobToBase64(file);
    convertedImages.push(base64);
  }

  for (let i = 0; i < convertedImages.length; i++) {
    const image = convertedImages[i];
    let final = image.replace(/^data:image\/[a-z]+;base64,/, "");
    const response = await uploadImages([final]);
    console.log(response);
    images.push(response.images[0]);
    count++;
  }

  if (count === convertedImages.length) {
    return images;
  }
};
