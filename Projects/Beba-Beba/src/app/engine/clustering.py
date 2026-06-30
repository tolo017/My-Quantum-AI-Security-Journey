import math
from typing import List, Tuple

class ClusteringEngine:
    """
    Prototype for the Beba Beba dynamic matching engine.
    Groups commuters into virtual stages based on geographic clusters.
    """

    @staticmethod
    def calculate_distance(p1: Tuple[float, float], p2: Tuple[float, float]) -> float:
        """Haversine distance between two points in kilometers."""
        lat1, lon1 = p1
        lat2, lon2 = p2
        radius = 6371  # Earth radius in km

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2) * math.sin(dlat / 2) + math.cos(math.radians(lat1)) \
            * math.cos(math.radians(lat2)) * math.sin(dlon / 2) * math.sin(dlon / 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return radius * c

    @classmethod
    def find_clusters(cls, commuters: List[dict], max_radius_km: float = 0.5) -> List[dict]:
        """
        Groups commuters into clusters.
        Each cluster represents a potential Virtual Stage.
        """
        clusters = []
        assigned_ids = set()

        for i, c1 in enumerate(commuters):
            if c1['id'] in assigned_ids:
                continue

            # Start a new cluster
            current_cluster = [c1]
            assigned_ids.add(c1['id'])

            for j, c2 in enumerate(commuters):
                if i == j or c2['id'] in assigned_ids:
                    continue

                dist = cls.calculate_distance(
                    (c1['lat'], c1['lon']),
                    (c2['lat'], c2['lon'])
                )

                if dist <= max_radius_km:
                    current_cluster.append(c2)
                    assigned_ids.add(c2['id'])

            # Calculate the centroid for the Virtual Stage
            avg_lat = sum(p['lat'] for p in current_cluster) / len(current_cluster)
            avg_lon = sum(p['lon'] for p in current_cluster) / len(current_cluster)

            clusters.append({
                "stage_name": f"Virtual Stage {len(clusters) + 1}",
                "location": (avg_lat, avg_lon),
                "passengers": [p['id'] for p in current_cluster],
                "count": len(current_cluster)
            })

        return clusters

# Example usage/test
if __name__ == "__main__":
    # Mock data: Nairobi coordinates
    commuters = [
        {"id": "U1", "lat": -1.2833, "lon": 36.8167}, # CBD
        {"id": "U2", "lat": -1.2835, "lon": 36.8170}, # CBD Near
        {"id": "U3", "lat": -1.4325, "lon": 36.9535}, # Athi River
        {"id": "U4", "lat": -1.4330, "lon": 36.9540}, # Athi River Near
    ]

    engine = ClusteringEngine()
    results = engine.find_clusters(commuters)
    for res in results:
        print(f"{res['stage_name']}: {res['count']} passengers at {res['location']}")
