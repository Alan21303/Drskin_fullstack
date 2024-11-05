from flask import Flask, request, jsonify, render_template
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini AI
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)
model_gemini = genai.GenerativeModel('gemini-pro')

# Load the model
MODEL_PATH = 'model/skin_dis.h5'
model = load_model(MODEL_PATH)

# Define class labels based on your training
DISEASE_CLASSES = {
    0: 'Actinic keratosis',
    1: 'Basal cell carcinoma',
    2: 'Benign keratosis-like lesions',
    3: 'Dermatofibroma',
    4: 'Melanocytic nevi',
    5: 'Melanoma',
    6: 'Vascular lesion'
}

def get_gemini_response(disease_name):
    """
    Get detailed disease information from Gemini AI
    """
    prompt = f"""
    Provide detailed medical information about {disease_name} in the following format:
    1. Brief Description
    2. Common Symptoms (list 5 key symptoms)
    3. Risk Factors
    4. Prevention Methods
    5. When to See a Doctor
    6. Treatment Options
    
    Please provide accurate medical information suitable for patient education.
    Focus on facts from reliable medical sources.
    """
    
    try:
        response = model_gemini.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return f"Error getting information from Gemini: {str(e)}"

def preprocess_image(img_bytes):
    try:
        # Read image from bytes
        img = Image.open(io.BytesIO(img_bytes))
        
        # Resize to 28x28 as per your model's requirements
        img = img.resize((28, 28))
        
        # Convert to array and preprocess
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalize to [0,1]
        
        return img_array
    except Exception as e:
        print(f"Image preprocessing error: {str(e)}")
        raise e

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        img_bytes = file.read()
        
        # Preprocess the image
        processed_image = preprocess_image(img_bytes)
        
        # Make prediction
        predictions = model.predict(processed_image)
        predicted_class_index = np.argmax(predictions[0])
        predicted_disease = DISEASE_CLASSES[predicted_class_index]
        
        # Get detailed information from Gemini
        gemini_info = get_gemini_response(predicted_disease)
        gemini_info=gemini_info.replace("*", "\n")
        response_data = {
            'disease': predicted_disease,
            'detailed_information': gemini_info,
            'confidence_score': float(predictions[0][predicted_class_index])
        }
        
        print("Response data:", response_data)  # Debug print
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error in predict route: {str(e)}")  # Debug print
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('user-dashboard.html')

@app.route('/disease_testing')
def disease_testing():
    return render_template('disease-test.html')

@app.route('/history')
def history():
    return render_template('disease-history.html')

@app.route('/doctor')
def doctor():
    return render_template('doctor.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/logout')
def logout():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)