import json
import numpy as np
from operator import itemgetter

FILE_LOC = "./graph.json"
NUM = 10000


def get_constraints():
    try:
        with open(FILE_LOC) as f:
            data = json.load(f)
    except IOError:
        print("Error loading the file ! Aborting...")
    try:
        min_lat = min(map(lambda x: x["la"], data))
        max_lat = max(map(lambda x: x["la"], data))
        min_lon = min(map(lambda x: x["lo"], data))
        max_lon = max(map(lambda x: x["lo"], data))
        # print(min_lat, max_lat, min_lon, max_lon)
    except KeyError:
        print(
            "File structure is incorrect! Kindly comply with the format given in `graph.json`"
        )
    return {
        "min_lat": min_lat,
        "max_lat": max_lat,
        "min_lon": min_lon,
        "max_lon": max_lon,
    }


def generate_points(num=10):
    constraints = get_constraints()
    min_lat, max_lat, min_lon, max_lon = itemgetter(
        "min_lat", "max_lat", "min_lon", "max_lon"
    )(constraints)
    latitudes = np.random.uniform(low=min_lat, high=max_lat, size=(num,))
    longitudes = np.random.uniform(low=min_lon, high=max_lon, size=(num,))
    coordinates = np.stack((latitudes, longitudes), axis=1)
    print(coordinates)
    return coordinates


if __name__ == "__main__":
    get_loc = generate_points(NUM)
    data = [{"la": la, "lo": lo} for la, lo in get_loc]
    try:
        with open("./infected.json", "w") as f:
            json.dump(data, f, ensure_ascii=True, indent=4)
    except IOError:
        print("Error while writing to json file! Aborting...")
