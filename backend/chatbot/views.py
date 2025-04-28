# --- Imports ---
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status # Import status for HTTP status codes
import logging # Added for logging

# --- Setup Logging ---
# Configure logging (optional but recommended)
# You might configure this globally in your Django settings.py
logger = logging.getLogger(__name__)

# --- Configuration Section ---
# TODO: Customize this section for your specific recommendation needs.
# This dictionary holds the core data. The keys are the keywords the chatbot
# will look for in the user's message. The values are the lists of items
# to recommend for that category/keyword.
# This data could eventually be loaded from a database, a configuration file (JSON/YAML),
# or an external API for more dynamic recommendations.

RECOMMENDATION_DATA = {
    # == Example 1: Pokémon (Original Use Case) ==
    # "fire": ["Charizard", "Arcanine", "Blaziken"],
    # "water": ["Blastoise", "Gyarados", "Vaporeon"],
    # "grass": ["Venusaur", "Leafeon", "Sceptile"],
    # "electric": ["Pikachu", "Raichu", "Zapdos"],
    # "psychic": ["Mewtwo", "Espeon", "Gardevoir"],
    # "dragon": ["Rayquaza", "Dragonite"],
    # "ice": ["Lapras", "Glaceon"],
    # "dark": ["Umbreon", "Darkrai"],

    # == Example 2: Movie Genres ==
    "action": ["Die Hard", "Mad Max: Fury Road", "John Wick", "The Dark Knight"],
    "comedy": ["Airplane!", "The Big Lebowski", "Monty Python and the Holy Grail", "Superbad"],
    "sci-fi": ["Blade Runner 2049", "Arrival", "The Matrix", "Interstellar"],
    "thriller": ["Parasite", "Seven", "The Silence of the Lambs", "Get Out"],
    "fantasy": ["The Lord of the Rings", "Harry Potter", "Pan's Labyrinth", "Spirited Away"],

    # == Example 3: Book Genres ==
    # "fantasy": ["The Hobbit", "A Song of Ice and Fire", "Mistborn: The Final Empire"],
    # "mystery": ["The Da Vinci Code", "Gone Girl", "The Girl with the Dragon Tattoo"],
    # "science fiction": ["Dune", "Foundation", "Neuromancer"], # Note: multi-word keyword
    # "historical fiction": ["Wolf Hall", "The Nightingale", "Pillars of the Earth"],

    # Add more categories and items relevant to your application here
}

# --- Message Templates ---
# TODO: Customize these messages to fit your application's tone and context.
# Use {category_name} as a placeholder for the matched category.
SUCCESS_MESSAGE_TEMPLATE = "Okay, based on your interest in {category_name}, here are some suggestions: "
NO_MATCH_MESSAGE = "I can provide recommendations! Tell me what category or type you're interested in (e.g., 'action', 'sci-fi', 'fantasy')."
ERROR_MESSAGE = "Sorry, something went wrong on my end. Please try again later."
INVALID_INPUT_MESSAGE = "Please provide a message describing what you're looking for."
# --- End Configuration ---


# --- API View ---
@api_view(['POST']) # Only allow POST requests
@permission_classes([AllowAny]) # Allow access without authentication (adjust if needed)
def generalized_chatbot_recommender(request):
    """
    A simple chatbot API endpoint that provides recommendations based on
    keywords found in the user's message.
    It matches keywords defined in RECOMMENDATION_DATA.
    """
    try:
        # 1. Get and preprocess user input
        user_message = request.data.get('message', '').strip().lower()
        logger.info(f"Received request data: {request.data}")
        logger.info(f"Processed user message: '{user_message}'")

        if not user_message:
            logger.warning("Received empty message.")
            return Response(
                {"message": INVALID_INPUT_MESSAGE},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Find matching category and suggestions
        matched_category = None
        suggestions = []

        # Simple keyword matching (first match wins).
        # For more complex scenarios, consider:
        # - More robust NLP techniques (like spaCy or NLTK) for intent/entity recognition.
        # - Allowing multiple matches.
        # - Using fuzzy matching if keywords might be misspelled.
        # - Using regex for more precise word boundary matching (e.g., r'\b' + keyword + r'\b').
        for category_keyword, items in RECOMMENDATION_DATA.items():
            # Check if the keyword (lowercase) is present in the user message (lowercase)
            if category_keyword.lower() in user_message:
                matched_category = category_keyword
                suggestions = items
                logger.info(f"Matched category '{matched_category}' with suggestions: {suggestions}")
                break # Stop searching after the first match

        # 3. Format the response
        if matched_category and suggestions:
            response_message = SUCCESS_MESSAGE_TEMPLATE.format(category_name=matched_category.capitalize())
            response_data = {
                "matched_category": matched_category,
                "suggestions": suggestions,
                "message": response_message
            }
            status_code = status.HTTP_200_OK
            logger.info(f"Sending successful response for category '{matched_category}'.")
        else:
            # No matching category found
            response_data = {
                "matched_category": None,
                "suggestions": [],
                "message": NO_MATCH_MESSAGE
            }
            status_code = status.HTTP_200_OK # Or 404 if you prefer to indicate "not found"
            logger.info("No matching category found for the user message.")

        return Response(response_data, status=status_code)

    except Exception as e:
        # Log the exception for debugging purposes
        logger.error(f"An error occurred processing the request: {e}", exc_info=True) # Log stack trace
        # Return a generic error response to the user
        return Response(
            {"message": ERROR_MESSAGE},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# --- Example urls.py entry (in your Django app's urls.py) ---
# from django.urls import path
# from .views import generalized_chatbot_recommender
#
# urlpatterns = [
#     path('chatbot/recommend/', generalized_chatbot_recommender, name='chatbot_recommend'),
# ]