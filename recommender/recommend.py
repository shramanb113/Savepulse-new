import sys
import pandas as pd
import psycopg2
import numpy as np
import os

from .features import (
    get_osrm_distances,
    compute_availability,
    compute_rating,
    compute_facility,
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


def get_request(request_id):
    conn = get_connection()
    try:
        query = """
        SELECT *
        FROM my_schema.requests
        WHERE request_id = %s
        """
        result = pd.read_sql(query, conn, params=(request_id,))
    finally:
        conn.close()

    if result.empty:
        raise ValueError(f"No request found for request_id: {request_id}")

    return result.iloc[0]


def get_hospitals():
    conn = get_connection()
    try:
        result = pd.read_sql("SELECT * FROM my_schema.hospitals", conn)
    finally:
        conn.close()
    return result


def build_feature_matrix(hospitals, req):
    emergency = req["emergency_type"]

    # OSRM first, Haversine as fallback (handled inside get_osrm_distances)
    distances = get_osrm_distances(req["latitude"], req["longitude"], hospitals)

    features = []
    for i, (_, row) in enumerate(hospitals.iterrows()):
        distance_score = 1 / (1 + distances[i])
        availability = compute_availability(row)
        rating = compute_rating(row)
        facility = compute_facility(row, emergency)

        features.append([distance_score, availability, rating, facility])

    return np.array(features)


def recommend(request_id):
    req = get_request(request_id)
    hospitals = get_hospitals()

    if hospitals.empty:
        return pd.DataFrame()

    feature_matrix = build_feature_matrix(hospitals, req)
    weights = compute_weights(feature_matrix)
    scores = compute_scores(feature_matrix, weights)

    hospitals = hospitals.copy()
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