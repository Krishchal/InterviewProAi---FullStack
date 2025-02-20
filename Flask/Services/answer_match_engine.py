import json
import nltk
import pandas as pd
import numpy as np
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.data import path
from collections import Counter
import string
import math

# Add the NLTK data path explicitly
# path.append(r"C:\\Users\\User\\AppData\\Roaming\\nltk_data")
# nltk.download('punkt')
# nltk.download('punkt_tab')


# Function to preprocess the text
def preprocess_text(text):
    # Tokenize text
    tokens = word_tokenize(text.lower())
    # Remove punctuation and stop words
    stop_words = set(stopwords.words('english'))
    tokens = [
        word for word in tokens if word not in stop_words and word not in string.punctuation]
    return tokens

# Function to calculate term frequency (TF)


def compute_tf(document, vocabulary):
    word_count = Counter(document)
    total_words = len(document)
    return np.array([word_count[word] / total_words if total_words > 0 else 0 for word in vocabulary])

# Function to calculate inverse document frequency (IDF)


def compute_idf(corpus, vocabulary):
    num_documents = len(corpus)
    return np.array([
        math.log((1 + num_documents) /
                 (1 + sum(1 for doc in corpus if word in doc))) + 1
        for word in vocabulary
    ])

# Function to calculate TF-IDF vectors


def compute_tfidf(corpus):
    # Build vocabulary
    vocabulary = list(set(word for document in corpus for word in document))

    # Compute IDF values
    idf_values = compute_idf(corpus, vocabulary)

    # Compute TF-IDF for each document
    tfidf_vectors = np.array(
        [compute_tf(document, vocabulary) * idf_values for document in corpus])

    return tfidf_vectors, vocabulary

# Function to calculate cosine similarity


def calculate_cosine_similarity(vector1, vector2):
    dot_product = np.dot(vector1, vector2)
    norm1 = np.linalg.norm(vector1)
    norm2 = np.linalg.norm(vector2)
    return dot_product / (norm1 * norm2) if norm1 > 0 and norm2 > 0 else 0

# Function to generate comparison report


def generate_report(predefined_text, input_text):
    # Preprocess texts
    preprocessed_predefined = preprocess_text(predefined_text)
    preprocessed_input = preprocess_text(input_text)
    print(
        f'\n----- Prepared Predefined Text: {preprocessed_predefined}-------\n')
    print(f'\n----- preprocessed_input Text: {preprocessed_input}-------\n')

    # Compute TF-IDF vectors
    corpus = [preprocessed_predefined, preprocessed_input]
    tfidf_matrix, vocabulary = compute_tfidf(corpus)
    print(f'\n------ tfidf_matrix[0]:: {tfidf_matrix[0]} -----\n\n')
    print(f'\n------ tfidf_matrix[1]:: {tfidf_matrix[1]} -----\n\n')

    # Calculate cosine similarity
    cosine_sim = calculate_cosine_similarity(tfidf_matrix[0], tfidf_matrix[1])

    # Calculate technical word concurrency (assuming technical words are predefined)
    technical_words = set(['javascript', 'virtual dom', 'component', 'reusable',
                           'serverloading', 'single page application', 'architecture'])
    predefined_technical_count = len(
        [word for word in preprocessed_predefined if word in technical_words])
    input_technical_count = len(
        [word for word in preprocessed_input if word in technical_words])
    technical_word_concurrency = len(
        set(preprocessed_predefined).intersection(set(preprocessed_input)))

    # Calculate repeated words in input
    input_word_counts = Counter(preprocessed_input)
    repeated_words = sum(
        [count for word, count in input_word_counts.items() if count > 1])

    # Calculate precision
    matching_words = len(
        set(preprocessed_predefined).intersection(set(preprocessed_input)))
    precision = matching_words / \
        len(preprocessed_input) if len(preprocessed_input) > 0 else 0

    # Calculate accuracy (for simplicity, consider cosine similarity as accuracy)
    accuracy = cosine_sim * 100  # Convert to percentage

    # Create report
    report = {
        'CosineSimilarity': cosine_sim,
        'TechnicalWordConcurrency': technical_word_concurrency,
        'RepeatedWords': repeated_words,
        'Precision': precision,
        'PredefinedTechnicalWordsCount': predefined_technical_count,
        'InputTechnicalWordsCount': input_technical_count,
        'Accuracy': accuracy,
        'tfidf_matrix': preprocessed_input
    }

    return report

# Function to determine if the examiner is selected or not


def determine_selection(report, thresholds):
    if report['Cosine Similarity'] >= thresholds['cosine_similarity'] and \
       report['Precision'] >= thresholds['precision']:
        return 'Selected'
    else:
        return 'Not Selected'

# Main function


# Function to search for an answer by ID


def find_answer_by_id(data, question_id):
    for entry in data:
        if int(entry["id"]) == int(question_id):
            return entry["answer"]
    return False  # Return a default message if ID is not found


def answer_match(question_id, transcribed_text):
    with open("AnswerSet.json", "r") as file:
        data = json.load(file)  # Parse JSON into a Python list of dictionaries
        predefined_text = find_answer_by_id(data, question_id)
    if predefined_text:
        # Generate comparison report
        report = generate_report(predefined_text, transcribed_text)
        # print("Comparison Report:")
        # for key, value in report.items():
        #     print(f"{key:30}: {value}")

        # Define thresholds for selection
        # thresholds = {
        #     'cosine_similarity': 0.6,     # Adjust based on requirements
        #     'precision': 0.5
        # }

        # Determine if the examiner is selected or not
        # selection_result = determine_selection(report, thresholds)
        # print(f"\nResult: {selection_result}")

        return report
    else:
        return False


if __name__ == "__main__":
    answer_match()
