from flask import Flask, request, jsonify
from flask_cors import CORS  
import spacy
from textblob import TextBlob

app = Flask(__name__)
CORS(app)  
nlp = spacy.load("en_core_web_md")
@app.route('/analyze', methods=['POST'])
def analyze_journal_entry():
    data = request.json
    entry = data.get('entry', '')
    doc = nlp(entry)
    named_entities = [(ent.text, ent.label_) for ent in doc.ents]
    blob = TextBlob(entry)
    sentiment_score = blob.sentiment.polarity
    sentiment_category = 'Neutral'
    if sentiment_score > 0:
        sentiment_category = 'Positive'
    elif sentiment_score < 0:
        sentiment_category = 'Negative'
    overall_score = abs(sentiment_score)
    result = {
        'Named Entities': named_entities,
        'Sentiment Category': sentiment_category,
        'Positive Score': max(0, sentiment_score),
        'Negative Score': max(0, -sentiment_score),
        'Neutral Score': 1 - abs(sentiment_score),
        'Overall Score': overall_score,
    }
    return jsonify(result)
if __name__ == '__main__':
    app.run(debug=True, port=8000)
