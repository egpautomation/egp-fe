// @ts-nocheck

import { config } from "@/lib/config";

const uploadImageToImgBB = async (imageFile) => {
  if (!imageFile) {
    return;
  }

  const apiKey = config.imagebbApiKey;
  if (!apiKey) {
    console.error("VITE_IMAGEBB_API_KEY is not set in .env");
    return null;
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(
      "https://api.imgbb.com/1/upload?key=" + apiKey,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (data.status === 200) {
      const imageUrl = data.data.url;
      return imageUrl;
    } else {
      console.error("Image upload failed for API key");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }

  return null;
};

export { uploadImageToImgBB };
