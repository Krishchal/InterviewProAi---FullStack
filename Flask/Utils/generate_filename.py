import string
import random
import time
import os


def generate_timestamp_based_filename(original_filename):
    """
    Generate a filename based on the current timestamp and a random suffix.
    This keeps the filename short while still being unique.
    """
    # Current timestamp (seconds since epoch)
    timestamp = int(time.time())

    # Generate a random 6-character string
    random_suffix = ''.join(random.choices(
        string.ascii_letters + string.digits, k=6))

    # Get the file extension
    file_extension = os.path.splitext(original_filename)[1]

    # Combine timestamp and random string to create a short filename
    unique_filename = f"{timestamp}_{random_suffix}{file_extension}"

    return unique_filename
