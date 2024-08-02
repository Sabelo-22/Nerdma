from transformers import pipeline

# Load the sentiment-analysis pipeline
sentiment_pipeline = pipeline('sentiment-analysis')

# Example texts
texts = [
    "I love this product!",
    "I hate the service.",
    "This is okay."
]

# Analyze sentiment
results = sentiment_pipeline(texts)

# Print results
for text, result in zip(texts, results):
    print(f"Text: {text}")
    print(f"Sentiment: {result}")
