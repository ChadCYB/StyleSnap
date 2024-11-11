import os
import random
import string
import io
from PIL import Image
from fastapi import FastAPI, File, HTTPException
from fastapi.responses import FileResponse

app = FastAPI()

# Directory to save uploaded images
UPLOAD_DIR = 'images'
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Generate a random filename with a given length of ASCII letters.
def generate_random_filename(length=10, ext='.jpeg'):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(length)) + ext

# Endpoint to upload an image.
@app.post("/upload/")
async def upload_image(file: bytes = File(...)):
    filename = generate_random_filename()
    file_location = os.path.join(UPLOAD_DIR, filename)

    # if image_file.format != 'JPEG':
    #     raise HTTPException(status_code=400, detail="Uploaded file is not a JPEG image.")
    
    image_file = Image.open(io.BytesIO(file))
    image_file.save(file_location)

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
