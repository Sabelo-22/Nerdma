import pandas as pd
import numpy as np
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import re
import matplotlib.pyplot as plt
import seaborn as sns
from textblob import TextBlob

# Download NLTK data (only needed the first time)
nltk.download('punkt')
nltk.download('stopwords')

# Load data
def load_data(file_path):
    return pd.read_json(file_path)

# Preprocess text data
def preprocess_text(text):
    # Convert to lowercase
    text = text.lower()
    # Remove URLs
    text = re.sub(r"http\S+|www\S+|https\S+", "", text, flags=re.MULTILINE)
    # Remove mentions (@usernames)
    text = re.sub(r"@\w+", "", text)
    # Remove hashtags
    text = re.sub(r"#\w+", "", text)
    # Remove special characters and numbers
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\d+", "", text)
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words]
    return " ".join(tokens)

# Perform sentiment analysis using VADER
def analyze_sentiment_vader(text):
    sid = SentimentIntensityAnalyzer()
    return sid.polarity_scores(text)

# Perform sentiment analysis using TextBlob
def analyze_sentiment_textblob(text):
    analysis = TextBlob(text)
    return analysis.sentiment.polarity

# Analyze tweets
def analyze_tweets(df):
    df['clean_text'] = df['text'].apply(preprocess_text)
    df['vader_scores'] = df['clean_text'].apply(analyze_sentiment_vader)
    df['textblob_scores'] = df['clean_text'].apply(analyze_sentiment_textblob)

    # Extract VADER scores
    df['vader_pos'] = df['vader_scores'].apply(lambda x: x['pos'])
    df['vader_neu'] = df['vader_scores'].apply(lambda x: x['neu'])
    df['vader_neg'] = df['vader_scores'].apply(lambda x: x['neg'])
    df['vader_compound'] = df['vader_scores'].apply(lambda x: x['compound'])

    # Categorize sentiments based on compound score
    df['vader_sentiment'] = df['vader_compound'].apply(
        lambda x: 'positive' if x > 0.05 else ('negative' if x < -0.05 else 'neutral')
    )

    # Categorize sentiments based on TextBlob polarity
    df['textblob_sentiment'] = df['textblob_scores'].apply(
        lambda x: 'positive' if x > 0.05 else ('negative' if x < -0.05 else 'neutral')
    )

    return df

# Visualize sentiment analysis results
def visualize_sentiments(df):
    plt.figure(figsize=(12, 6))
    
    # VADER sentiment distribution
    plt.subplot(1, 2, 1)
    sns.countplot(data=df, x='vader_sentiment', palette='viridis')
    plt.title('VADER Sentiment Distribution')

    # TextBlob sentiment distribution
    plt.subplot(1, 2, 2)
    sns.countplot(data=df, x='textblob_sentiment', palette='viridis')
    plt.title('TextBlob Sentiment Distribution')

    plt.tight_layout()
    plt.show()

def main():
    file_path = 'path/to/your/tweets.json'  # Update this to your file path
    df = load_data(file_path)
    df = analyze_tweets(df)
    visualize_sentiments(df)

if __name__ == "__main__":
    main()
