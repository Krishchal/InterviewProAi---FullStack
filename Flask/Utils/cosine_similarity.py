
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# import nltk
# from nltk.corpus import stopwords

# # Download the stopwords if not already downloaded
# nltk.download('stopwords')

# def preprocess_text(text):   
#     """
#     Preprocess the input text by removing stopwords and converting to lowercase.
#     """
#     stop_words = set(stopwords.words('english'))
#     words = text.lower().split()  # Convert to lowercase and split into words
#     filtered_words = [word for word in words if word not in stop_words]
#     return " ".join(filtered_words)

# def calculate_cosine_similarity(user_keywords, question_keywords): 
#     # Preprocess the input keywords to remove stopwords and lowercase the text
#     user_keywords_processed = preprocess_text(" ".join(user_keywords))
#     question_keywords_processed = preprocess_text(" ".join(question_keywords))
    
#     # Combine lists into text for vectorization
#     combined_text = [user_keywords_processed, question_keywords_processed]
    
#     # Use TF-IDF vectorizer to convert text data into feature vectors
#     vectorizer = TfidfVectorizer().fit_transform(combined_text)
#     vectors = vectorizer.toarray()
    
#     # Calculate cosine similarity
#     cosine_sim = cosine_similarity(vectors)
    
#     # Return the similarity score between the two vectors
#     return cosine_sim[0][1]

# def recommend_questions(user_keywords, user_level, questions_data):
#     """
#     Recommend the best questions based on user expertise and level.
#     """
#     # Filter questions by level
#     filtered_questions = [q for q in questions_data if q.get("level") == user_level]
    
#     if not filtered_questions:
#         return {"error": "No questions found for the given level."}, 400
    
#     # Calculate cosine similarity scores for each question
#     scored_questions = []
#     for question in filtered_questions:
#         question_keywords = question["keywords"]
#         similarity_score = calculate_cosine_similarity(user_keywords, question_keywords)
#         scored_questions.append((question["question"], similarity_score))
    
#     # Sort questions by similarity score in descending order and get top 5
#     top_questions = sorted(scored_questions, key=lambda x: x[1], reverse=True)[:5]
#     top_questions_list = [q[0] for q in top_questions]  # Extract only question text

#     # Return the top 5 questions
#     return {"recommended_questions": top_questions_list}, 200

#--------------------------------------------------------------------------------------------------
import math
import nltk
from nltk.corpus import stopwords

# Download the stopwords if not already downloaded
# nltk.download('stopwords')

def preprocess_text(text):
    """
    Preprocess the input text by removing stopwords and converting to lowercase.
    """
    stop_words = set(stopwords.words('english'))
    words = text.lower().split()
    filtered_words = [word for word in words if word not in stop_words]
    return filtered_words

def compute_tf(text):
    """
    Compute term frequency (TF) for each word in the text.
    """
    tf_dict = {}
    text_length = len(text)
    for word in text:
        tf_dict[word] = tf_dict.get(word, 0) + 1
    for word in tf_dict:
        tf_dict[word] /= text_length
    return tf_dict

def compute_idf(documents):
    """
    Compute inverse document frequency (IDF) for a list of documents.
    """
    idf_dict = {}
    total_docs = len(documents)
    all_words = set(word for doc in documents for word in doc)
    for word in all_words:
        containing_docs = sum(1 for doc in documents if word in doc)
        idf_dict[word] = math.log(total_docs / (1 + containing_docs))
    return idf_dict

def compute_tfidf(tf_dict, idf_dict):
    """
    Compute TF-IDF by multiplying TF and IDF values.
    """
    tfidf_dict = {}
    for word, tf_value in tf_dict.items():
        tfidf_dict[word] = tf_value * idf_dict.get(word, 0)
    return tfidf_dict

def cosine_similarity(vec1, vec2):
    """
    Compute cosine similarity between two vectors.
    """
    dot_product = sum(vec1.get(key, 0) * vec2.get(key, 0) for key in set(vec1) | set(vec2))
    magnitude_vec1 = math.sqrt(sum(value**2 for value in vec1.values()))
    magnitude_vec2 = math.sqrt(sum(value**2 for value in vec2.values()))
    if magnitude_vec1 == 0 or magnitude_vec2 == 0:
        return 0  # Avoid division by zero
    return dot_product / (magnitude_vec1 * magnitude_vec2)

def calculate_cosine_similarity(user_keywords, question_keywords):
    """
    Calculate cosine similarity between user keywords and question keywords.
    """
    # Preprocess text
    user_keywords_processed = preprocess_text(" ".join(user_keywords))
    question_keywords_processed = preprocess_text(" ".join(question_keywords))
    
    # Combine documents for IDF calculation
    all_documents = [user_keywords_processed, question_keywords_processed]
    
    # Compute TF-IDF for both user and question keywords
    idf_values = compute_idf(all_documents)
    user_tfidf = compute_tfidf(compute_tf(user_keywords_processed), idf_values)
    question_tfidf = compute_tfidf(compute_tf(question_keywords_processed), idf_values)
    
    # Compute cosine similarity
    return cosine_similarity(user_tfidf, question_tfidf)

def recommend_questions(user_keywords, user_level, questions_data):
    """
    Recommend the best questions based on user expertise and level.
    """
    # Filter questions by level
    filtered_questions = [q for q in questions_data if q.get("level") == user_level]
    
    if not filtered_questions:
        return {"error": "No questions found for the given level."}, 400
    
    # Calculate cosine similarity scores for each question
    scored_questions = []
    for question in filtered_questions:
        question_keywords = question["keywords"]
        similarity_score = calculate_cosine_similarity(user_keywords, question_keywords)
        scored_questions.append((question["question"], similarity_score))
    
    # Sort questions by similarity score in descending order and get top 5
    top_questions = sorted(scored_questions, key=lambda x: x[1], reverse=True)[:5]
    top_questions_list = [q[0] for q in top_questions]  # Extract only question text

    # Return the top 5 questions
    return {"recommended_questions": top_questions_list}, 200

