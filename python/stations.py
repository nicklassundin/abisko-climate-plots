import pandas as pd
import requests

BASE_URL = 'https://vischange.k8s.glimworks.se/data/query/v1'
from generate import generate_random_weather_data
from cache import get_cached, set_cache, clear_cache
import json
from ratelimit import limits, sleep_and_retry

from requests.exceptions import HTTPError, Timeout, RequestException

@sleep_and_retry
@limits(calls=10, period=60)
def fetch_data_for_coordinates(long, lat, start_year, end_year, data_types, slump=False):
    coordinates = f"{long},{lat}"
    params = {
        'data_types': data_types,
        'coordinates': coordinates,
        'slump': slump,
        'type': 'rawdata'
    }
    # Check cache first
    cache_results = get_cached(params)
    if cache_results:
        print("Using cached results")
        return pd.DataFrame(json.loads(cache_results))

    query_url = (
        f"{BASE_URL}?position={long},{lat}"
        f"&radius=30&date={start_year}0101-{end_year}1231&sort=year&types={','.join(data_types)}"
    )
    print(query_url)

    if slump:
        return generate_random_weather_data(start_year, end_year)

    # Fetch data with error handling
    try:
        # timeout=(10, 60) means 10 seconds to connect and 60 seconds to read the response
        response = requests.get(query_url, timeout=(60, 90))
        response.raise_for_status()  # Will raise HTTPError for bad responses (4xx or 5xx)
        data = response.json()
        df = pd.DataFrame(data)

        if not df.empty:
            df['date'] = pd.to_datetime(df['date'])
            set_cache(params, df.to_json(orient="records"))

        return df

    except HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except Timeout:
        print("The request timed out.")
    except RequestException as err:
        print('premature end of file')
        print(f"An error occurred: {err}")

    # Return empty DataFrame or None as a fallback
    return pd.DataFrame()

# Define the statistics that can be calculated
def calculate_available_statistics(df, types):
    available_stats = {}
    for data_type in types:
        available_stats[data_type] = data_type in df.columns and not df[data_type].isnull().all()
    return available_stats

from server import STATISTICS_TO_DATA_TYPES
# Main function to get available statistics for a specific station at given coordinates and year
def get_weather_stats_for_station(long, lat, data_types, slump = False):
    coordinates = f"{long},{lat}"
    params = {'data_types': data_types, 'coordinates': coordinates, 'slump': slump, 'type': 'weather_stats'}
    cache_results = get_cached(params)
    if cache_results:
        return cache_results
    # Fetch data for the specific station at given coordinates
    station_data = fetch_data_for_coordinates(long, lat, 1900, 2025, data_types, slump)
    result = None
    if station_data is not None and not station_data.empty:
        # Calculate available statistics based on the fetched data
        available_statistics = calculate_available_statistics(station_data, data_types)
        available_statistics_data_types = {
        }
        for stat, data_types in STATISTICS_TO_DATA_TYPES.items():
            # set to true if all available statistics and check if available_statistics contains
            available_statistics_data_types[stat] = all([available_statistics.get(data_type, False) for data_type in data_types])
        result = {
            "coordinates": coordinates,
            "available_statistics": available_statistics,
            "available_statistics_data_types": available_statistics_data_types,
        }
    else:
        result ={
            "coordinates": coordinates,
            "available_statistics": "No data available for this year"
        }
    set_cache(params, result)
    return result
# Load GeoJSON data using GeoPandas
import geopandas as gpd
from shapely.geometry import Point
kommuner_geojson = './res/geojson/kommuner.json'
landskap_geojson = './res/geojson/landskap.json'
kommuner_gdf = gpd.read_file(kommuner_geojson)
landskap_gdf = gpd.read_file(landskap_geojson)
def reverse_geocode(lat, lon):
    point = Point(lon, lat)
    geolocation = {
        "knkod": None,
        'KsnNamn': None,
        'lnkod' : None,
        'LnNamn' : None,
    }
    for _, row in kommuner_gdf.iterrows():
        if row['geometry'].contains(point):
            geolocation['knkod'] = int(row['ref:se:kommun:kod'])
            geolocation['KnNamn'] = row['name']
            break
    for _, row in landskap_gdf.iterrows():
        if row['geometry'].contains(point):
            geolocation['lnkod'] = row['landskapskod']
            geolocation['LnNamn'] = row['landskap']
            break
    return geolocation

# Constants
SMHI_STATION_NAME_URLS = [
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1.json", # air temp
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/2.json", # air temp
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/3.json", # wind direction
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/4.json", # wind speed
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/5.json", # precipitation
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/6.json", # precipitation
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/7.json", # relative humidity
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/8.json", # snow depth
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/9.json", # air presure
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/10.json", # sun time
      "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/11.json", # global irredians
      ]

# Helper function to fetch all SMHI stations
def fetch_all_stations():
    # Check if the data is cached
    try:
        response = requests.get(SMHI_STATION_NAME_URLS[0])
        response.raise_for_status()  # Raise an error for bad responses (e.g., 4xx, 5xx)
        data = response.json()
        stations = data.get('station', [])
        for station in stations:
            geodata = reverse_geocode(station['latitude'], station['longitude'])
            station['geodata'] = geodata
        # read ../static/stations.json and merge list with list from SMHI

        with open('./static/stations.json', 'r') as f:
            existing_stations = json.load(f)
        for key in existing_stations:
            station = {
                "name": key,
                "latitude": existing_stations[key]['position']['lat'],
                "longitude": existing_stations[key]['position']['long'],
                "geodata": reverse_geocode(existing_stations[key]['position']['lat'], existing_stations[key]['position']['long'])
            }
            stations.append(station)

        return stations
    except requests.exceptions.RequestException as e:
        print(f"Error fetching stations: {e}")
        return None
