import numpy as np
import pandas as pd
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from textblob import TextBlob
import nltk

# Download NLTK data (only needed the first time)
nltk.download('punkt')
nltk.download('stopwords')

# Initialize sentiment analysis tools
sia = SentimentIntensityAnalyzer()
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    """Preprocesses text by tokenizing, removing stopwords, and lowercasing."""
    tokens = word_tokenize(text)
    tokens = [word.lower() for word in tokens if word.isalnum()]
    filtered_tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(filtered_tokens)

def analyze_sentiment(text):
    """Analyzes sentiment using both NLTK's VADER and TextBlob."""
    # VADER sentiment analysis
    vader_scores = sia.polarity_scores(text)
    # TextBlob sentiment analysis
    text_blob = TextBlob(text)
    blob_sentiment = text_blob.sentiment.polarity
    
    # Aggregate results
    sentiment = {
        'vader': vader_scores,
        'text_blob': blob_sentiment
    }
    return sentiment

def generate_recommendations(sentiments, feedback_data):
    """Generates recommendations based on sentiment analysis results."""
    # Example feedback data
    df = pd.DataFrame(feedback_data)
    
    # Analyze overall sentiment
    avg_sentiment_vader = np.mean([s['vader']['compound'] for s in sentiments])
    avg_sentiment_blob = np.mean([s['text_blob'] for s in sentiments])
    
    # Create recommendations based on sentiment analysis
    recommendations = []
    
    if avg_sentiment_vader < -0.5 or avg_sentiment_blob < -0.5:
        recommendations.append("Address negative sentiment issues: Focus on customer complaints and improve service quality.")
    
    if avg_sentiment_vader > 0.5 or avg_sentiment_blob > 0.5:
        recommendations.append("Leverage positive feedback: Highlight positive aspects in marketing and maintain high standards.")
    
    # Analyze feedback data for additional insights
    feedback_summary = df.describe()
    high_complaints = df[df['complaints'] > df['complaints'].mean()]
    
    if not high_complaints.empty:
        recommendations.append("Investigate high-complaint areas: Address specific issues raised frequently in feedback.")
    
    return recommendations

def main():
    # Sample feedback data
    feedback_data = [
        {'text': 'Great service, very satisfied!', 'complaints': 2},
        {'text': 'Terrible experience, had to wait too long!', 'complaints': 15},
        {'text': 'Okay service, could be better.', 'complaints': 5}
    ]
    
    # Preprocess feedback data
    processed_feedback = [preprocess_text(f['text']) for f in feedback_data]
    
    # Analyze sentiment
    sentiments = [analyze_sentiment(text) for text in processed_feedback]
    
    # Generate recommendations
    recommendations = generate_recommendations(sentiments, feedback_data)
    
    print("Recommendations:")
    for rec in recommendations:
        print(f"- {rec}")

if __name__ == "__main__":
    main()
