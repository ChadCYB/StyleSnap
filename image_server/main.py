import os
import random
import string
import base64
# from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse, JSONResponse
# from pydantic import BaseModel


app = FastAPI()

# Directory to save uploaded images
UPLOAD_DIR = 'images'
os.makedirs(UPLOAD_DIR, exist_ok=True)

# class ImageInput(BaseModel):
#     image: str  # base64 encoded string

# Generate a random filename with a given length of ASCII letters.
def generate_random_filename(length=10, ext='.jpeg'):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(length)) + ext

@app.post("/upload-image/")
async def upload_image(image: str = Form(...)):
    try:
        # image = input.image
        # Check if the image is in base64 format
        if image.startswith("data:image/"):
            # Split the base64 string to get the actual data
            header, encoded = image.split(",", 1)
            # Decode the image
            decoded_image = base64.b64decode(encoded)

            # Create a unique filename
            filename = generate_random_filename()
            file_location = os.path.join(UPLOAD_DIR, filename)

            # Save the image to the local filesystem
            with open(file_location, "wb") as image_file:
                image_file.write(decoded_image)

            return JSONResponse(content={"message": "Image saved successfully", "filename": filename})
        else:
            return JSONResponse(content={"error": "Invalid base64 image format"}, status_code=400)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Endpoint to upload an image.
@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File type not supported.")

    filename = generate_random_filename()
    file_location = os.path.join(UPLOAD_DIR, filename)

    with open(file_location, "wb") as image_file:
        content = await file.read()
        image_file.write(content)

    return {"filename": filename}

# Endpoint to get an image.
@app.get("/img/{filename}")
async def get_image(filename: str):
    file_location = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="Image not found.")
    
    return FileResponse(file_location)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8001)
