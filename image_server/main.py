import os
import random
import string
import base64
import io
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import logging

# from pydantic import BaseModel


app = FastAPI()

# # Set up logging
# logging.basicConfig(level=logging.INFO)

# # CORS middleware (optional)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Adjust as needed
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.middleware("http")
# async def log_requests(request: Request, call_next):
#     # Log request details
#     logging.info(f"Request path: {request.url.path}")
#     logging.info(f"Request method: {request.method}")
#     logging.info(f"Request headers: {request.headers}")

#     # Read request body
#     body = await request.body()
#     logging.info(f"Request body: {body.decode('utf-8')}")

#     # Call the next middleware or endpoint
#     response = await call_next(request)

#     # Optionally log response details
#     logging.info(f"Response status: {response.status_code}")

#     return response

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
@app.post("/upload/")
async def upload_image(file: bytes = File(...)):
    #if not file.content_type.startswith('image/'):
    #    raise HTTPException(status_code=400, detail="File type not supported.")

    filename = generate_random_filename()
    file_location = os.path.join(UPLOAD_DIR, filename)

    image_file = Image.open(io.BytesIO(file))
    image_file.save(file_location)

    # print(base64.b64encode(file))
    # with open(file_location, "wb") as image_file:
    #     content = await file.read()
    #     image_file.write(content)

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
