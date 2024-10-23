from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import base64
from io import BytesIO
import logging

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)

# CORS middleware (optional)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Log request details
    logging.info(f"Request path: {request.url.path}")
    logging.info(f"Request method: {request.method}")
    logging.info(f"Request headers: {request.headers}")

    # Read request body
    body = await request.body()
    logging.info(f"Request body: {body.decode('utf-8')}")

    # Call the next middleware or endpoint
    response = await call_next(request)

    # Optionally log response details
    logging.info(f"Response status: {response.status_code}")

    return response

@app.post("/")
async def get_image_base64(width: int = Query(500, ge=1), height: int = Query(500, ge=1)):
    try:
        # Fetch the image from Picsum with specified width and height
        response = requests.get(f"https://picsum.photos/{width}/{height}")

        # Check if the request was successful
        if response.status_code == 200:
            # Convert the image to base64
            image_data = BytesIO(response.content)
            base64_image = base64.b64encode(image_data.read()).decode('utf-8')

            # Return the base64 image
            return JSONResponse(content={"image": f"data:image/jpeg;base64,{base64_image}"})
        else:
            return JSONResponse(content={"error": "Failed to retrieve image"}, status_code=response.status_code)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8002)
