import math

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance in meters between two GPS coordinates
    using the Haversine formula.
    """
    R = 6371000  # Earth radius in meters

    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2) ** 2 +
         math.cos(phi1) * math.cos(phi2) *
         math.sin(delta_lambda / 2) ** 2)

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    distance = R * c
    return round(distance, 2)


def is_within_radius(student_lat, student_lon, session_lat, session_lon, radius_meters):
    """
    Returns True if student is within allowed radius of session location.
    """
    distance = haversine_distance(student_lat, student_lon, session_lat, session_lon)
    return distance <= radius_meters, distance