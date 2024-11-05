import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini AI
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)
model_gemini = genai.GenerativeModel('gemini-pro')

prompt = "Provide detailed medical information about Melanoma."
response = model_gemini.generate_content(prompt)
print(response.text)
