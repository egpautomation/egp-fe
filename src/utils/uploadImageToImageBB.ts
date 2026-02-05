// @ts-nocheck

const uploadImageToImgBB = async (imageFile) => {
    if (!imageFile) {
      return;
    }
  
    const apiKeys = [
      "8fa196d92c7d1bee69255516ffcf9d00",
    ];
  
    const formData = new FormData();
    formData.append("image", imageFile);
  
    for (const apiKey of apiKeys) {
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
          console.error("Image upload failed for API key:", apiKey);
        }
      } catch (error) {
        console.error("Error uploading image with API key:", apiKey, error);
      }
    }
  
    // If all API keys fail
    console.error("All API keys failed. Could not upload the image.");
    return null;
  };
  
  export { uploadImageToImgBB };
  
  
  