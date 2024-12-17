from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_cosine_similarity(user_keywords, question_keywords):
    # Combine lists into text for vectorization
    combined_text = [" ".join(user_keywords), " ".join(question_keywords)]
    
    # Vectorize text data
    vectorizer = CountVectorizer().fit_transform(combined_text)
    vectors = vectorizer.toarray()
    
    # Calculate cosine similarity
    cosine_sim = cosine_similarity(vectors)
    return cosine_sim[0][1]  # Return the similarity score between the two vectors
