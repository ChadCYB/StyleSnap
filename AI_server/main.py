from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
import requests
import base64
from io import BytesIO
from PIL import Image
import os
import numpy as np
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
from fastapi import FastAPI, Form, Request
from pydantic import BaseModel


app = FastAPI()

# Generate a random filename with a given length of ASCII letters.
def save_image(type_of_image, content):
    # decoded_image = response.content
    
    UPLOAD_DIR = '/images'
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    filename = f"{type_of_image}_img.jpeg"
    file_location = os.path.join(UPLOAD_DIR, filename)

    # Save the image to the local filesystem
    with open(filename, "wb") as image_file:
        image_file.write(content)


def transfer_style(content_image, style_image, model_path):

    """
    :param content_image: content image as numpy array
    :param style_image: style image as numpy array
    :param model_path: path to the downloaded pre-trained model.

    :return: A Styled image as 3D numpy array.
    """

    #--------------------------------------------------------------

    # resize the images to (1000,1000) if greater than (2000 x 2000)

    size_threshold = 2000
    resizing_shape = (1000,1000)
    content_shape = content_image.shape
    style_shape = style_image.shape
    
    print("content_shape: ", content_shape)
    print("style_shape: ", style_shape)

    # Convert to float32 numpy array, add batch dimension, and normalize to range [0, 1]. Example using numpy:
    content_image = content_image.astype(np.float32)[np.newaxis, ...] / 255.
    style_image = style_image.astype(np.float32)[np.newaxis, ...] / 255.

    # Optionally resize the images. It is recommended that the style image is about
    # 256 pixels (this size was used when training the style transfer network).
    # The content image can be any size.
    style_image = tf.image.resize(style_image, (256, 256))
    
    print()
    print("content_shape: ", content_shape)
    print("style_shape: ", style_shape)

    print("Loading pre-trained model...")
    # The hub.load() loads any TF Hub model
    hub_module = hub.load(model_path)
        

    # Stylize image.
    outputs = hub_module(tf.constant(content_image), tf.constant(style_image))
    stylized_image = outputs[0]

    # reshape the stylized image
    stylized_image = np.array(stylized_image)
    stylized_image = stylized_image.reshape(
    stylized_image.shape[1], stylized_image.shape[2], stylized_image.shape[3])
    
    # stylized_image = tf.image.resize(stylized_image, (256, 256))

    return stylized_image

class ImageData(BaseModel):
    content_image: str
    style_image: str


"""
:param content_img: 
:param style_img: 
"""
@app.post("/ai/")
async def get_image_base64(data: ImageData):
    try:
        content_image = data.content_image
        style_image = data.style_image
                
        print("content_image TYPE:", type(content_image))
        print("style_image TYPE:", type(style_image))
        print("content_image:", content_image)
        print("style_image:", style_image)

        # Fetch original/content image 
        original_image_response = requests.get(f"http://image-server:8001/img/{content_image}")
        # Fetch style image 
        style_image_response = requests.get(f"http://image-server:8001/img/{style_image}")

        # Check if the requests were successful
        if style_image_response.status_code == 200 and original_image_response.status_code == 200:

            # Convert the image to base64: 
            """
            str:base64 content_img_b64
            str:base64 style_img_b64
            
            (old-below)
            bytes response.content
            BytesIO image_data
            str:base64 base64_image
            """
            
            print("original_image_response TYPE:", type(original_image_response.content))
            print("style_image_response TYPE:", type(style_image_response.content))

            style_image_data = BytesIO(style_image_response.content)
            style_base64_image = base64.b64encode(style_image_data.read()).decode('utf-8')
            style_image_final = f"data:image/jpeg;base64,{style_base64_image}"
            
            original_image_data = BytesIO(original_image_response.content)
            original_base64_image = base64.b64encode(original_image_data.read()).decode('utf-8')
            original_image_final = f"data:image/jpeg;base64,{original_base64_image}"
            
            
            # convert images to numpy array
            original_arr = np.array(Image.open(BytesIO(original_image_response.content))) 
            style_arr = np.array(Image.open(BytesIO(style_image_response.content))) 
            
            # path to model
            model_path = "/tmp/"
            os.chdir(model_path)
            
            #============================================================
            # transfer the style using model and arr
            output_image = transfer_style(original_arr, style_arr, model_path)
            # output_image = output_image.astype(np.uint8)
            output_image = (output_image * 255).astype(np.uint8)
            output_image_final_Uh = f"data:image/jpeg;base64,{output_image}" #numpy_arr


            print("type of styled_image", type(output_image))
            output_bytes_data = output_image.tobytes()
            print("shape of styled_image", output_image.shape)
            
            # convert output_arr to bytes to base64 str
            output_bytes_io_data = BytesIO(output_image.tobytes())
            output_base64_image = base64.b64encode(output_bytes_io_data.read()).decode('utf-8')
            output_image_final = f"data:image/jpeg;base64,{output_base64_image}"
            
            # print("output_base64_image: \t\t", output_base64_image[:15])
            
            # convert arr to base64 str
            # output_base64_image_wo = base64.b64encode(output_image)
            # output_base64_image_w = base64.b64encode(output_image).decode('utf-8')
            # output_image_final = f"data:image/jpeg;base64,{output_base64_image}"
            
            # print("output_base64_image_wo: \t", output_base64_image_wo[:15])
            # print("output_base64_image_w: \t", output_base64_image_w[:15])
            # im = Image.fromarray(output_image)
            
            model_path = "/code"
            os.chdir(model_path)
            im = Image.fromarray(output_image)
            im.save("final_output.jpeg")
            
            # Return the base64 image
            #send final_img to image server, get link, return link to API server
            # return JSONResponse(content={"output_image": output_base64_image})


            # Path to the image you want to upload
            image_path = "/code/final_output.jpeg"

            # URL of the API endpoint
            url = "http://image-server:8001/upload/"

            # Open the image file in binary mode
            with open(image_path, "rb") as img_file:
                files = {'file': img_file}
                
                # Send POST request to the API endpoint
                response = requests.post(url, files=files)

                image_content = response.json()
                image_url = image_content['filename']
                print("output_image:" + image_url)

                # Check the response status and print the result
                if response.status_code == 200:
                    return JSONResponse(content={"output_image": image_url})
                else:
                    return JSONResponse(content={"Failed"})
        # ================================ ERROR: ==========================================
        else:
            return JSONResponse(content={"error": "Failed to retrieve image"}, status_code=style_image_response.status_code)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

