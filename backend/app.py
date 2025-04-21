from dotenv import load_dotenv
import os

from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

load_dotenv()

HUGGINGFACE_API_TOKEN = os.getenv('HUGGINGFACE_API_TOKEN')


app = Flask(__name__)
CORS(app)

def analyze_sentiment(text):
    api_url = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "inputs": text
    }

    response = requests.post(api_url, headers=headers, json=payload)

    print("Huggingface response status:", response.status_code)
    print("Huggingface response body:", response.text)

    if response.status_code == 200:
        result = response.json()
        label = result[0][0]["label"]
        score = result[0][0]["score"]
        return label, score
    else:
        return "Error", 0


# Route that frontend will hit
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    journal_text = data.get('text', '')

    if not journal_text:
        return jsonify({"error": "No text provided"}), 400

    label, score = analyze_sentiment(journal_text)

    return jsonify({
        "mood": label,
        "confidence": score
    })

if __name__ == '__main__':
    app.run(debug=True)
