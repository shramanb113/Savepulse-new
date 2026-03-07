import sys
import pandas as pd
import psycopg2
import numpy as np
import os

from .features import (
    compute_distance_score,
    compute_availability,
    compute_rating,
)

from .weights import compute_weights
from .scoring import compute_scores


def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        database=os.getenv("DB_NAME", "savepulse"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "password"),
        port=os.getenv("DB_PORT", 5432),
    )

conn = get_connection()

def get_request(request_id):
    query = """
    SELECT *
    FROM my_schema.requests
    WHERE request_id = %s
    """

    result = pd.read_sql(query, conn, params=(request_id,))
    
    if result.empty:
        raise ValueError(f"No request found for request_id: {request_id}")
    
    return result.iloc[0]

def get_hospitals():

    query = """
    SELECT *
    FROM my_schema.hospitals
    """

    return pd.read_sql(query, conn)


def filter_hospitals(hospitals, emergency):

    if emergency == "cardiac":
        hospitals = hospitals[hospitals["cardiac_center"] == True]

    elif emergency == "trauma":
        hospitals = hospitals[hospitals["trauma_center"] == True]

    return hospitals


def build_feature_matrix(hospitals, req):

    features = []

    for _, row in hospitals.iterrows():

        distance = compute_distance_score(
            req["latitude"],
            req["longitude"],
            row["latitude"],
            row["longitude"]
        )

        availability = compute_availability(row)

        rating = compute_rating(row)

        features.append([distance, availability, rating])

    return np.array(features)


def recommend(request_id):
    req = get_request(request_id)
    hospitals = get_hospitals()
    hospitals = filter_hospitals(hospitals, req["emergency_type"]).copy()
    
    if hospitals.empty:
        return pd.DataFrame()  # Return an empty DataFrame if no hospitals match

    feature_matrix = build_feature_matrix(hospitals, req)
    weights = compute_weights(feature_matrix)
    scores = compute_scores(feature_matrix, weights)

    hospitals["score"] = scores
    ranked = hospitals.sort_values("score", ascending=False)

    return ranked[["hospital_id", "hospital_name", "score"]].head(5)

if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("Usage: python -m recommender.recommend <request_id>")
        sys.exit(1)

    request_id = int(sys.argv[1])

    results = recommend(request_id)

    print(results.to_json(orient="records"))