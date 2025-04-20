from flask import Flask, request, jsonify
from textblob import TextBlob
from flask_cors import CORS  # important for mobile apps hitting your local server

app = Flask(__name__)
CORS(app)  # Allow requests from React Native

@app.route("/analyze/bulk", methods=["POST"])
def analyze_bulk():
    data = request.get_json()
    entries = data.get("entries", [])

    if not entries:
        return jsonify({"error": "No entries provided"}), 400

    moods = []
    confidences = []

    for entry in entries:
        text = entry.get("text", "")
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity

        if polarity > 0.2:
            moods.append("POSITIVE")
        elif polarity < -0.2:
            moods.append("NEGATIVE")
        else:
            moods.append("NEUTRAL")

        confidences.append(abs(polarity))

    from collections import Counter
    mood_counts = Counter(moods)
    overall_mood = mood_counts.most_common(1)[0][0]
    avg_confidence = sum(confidences) / len(confidences)

    return jsonify({
        "overallMood": overall_mood,
        "confidence": avg_confidence
    })

if __name__ == "__main__":
    app.run(debug=True)
