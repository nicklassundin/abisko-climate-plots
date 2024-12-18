import pandas as pd
import requests

BASE_URL = 'https://vischange.k8s.glimworks.se/data/query/v1'
from generate import generate_random_weather_data
from cache import get_cached, set_cache, clear_cache
import json
from ratelimit import limits, sleep_and_retry
from requests.exceptions import HTTPError, Timeout, RequestException

import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()
wz_logger = logging.getLogger('werkzeug')
wz_logger.setLevel(logging.ERROR)
import pandas as pd
import requests
import json
import time
from requests.exceptions import HTTPError, Timeout, RequestException
# import DATA_TYPES_TO_TYPE
from datatypes import DATA_TYPES_TO_TYPE, STATISTICS_TO_DATA_TYPES, ALL_DATA_TYPES

# Helper function for date conversion
def convert_to_datetime(df, column_name='date'):
    if column_name in df.columns:
        df[column_name] = pd.to_datetime(df[column_name], errors='coerce')
    return df


CALLS = 15
PERIOD = 10

@sleep_and_retry
@limits(calls=CALLS, period=PERIOD)
def requestAPI(url):
    response = requests.get(url)
    response.raise_for_status()
    return response.json()
def getAPI(url):
    """
    Get data from the API using the provided URL.
    Caches the response for 5 minutes.
    """
    response = get_cached({'url': url}, None, True)
    if response is not None:
        logging.info(f"Data fetched from cache for {url}")
        return response
    logging.info(f"Fetching data from API: {url}")
    response = requestAPI(url)
    set_cache({'url': url}, response, None, True)
    return response

def fetch_data(params, required_data_types, slump=False, calculate=False, timeout=(60, 90), retries=3):
    """
    Fetch the raw weather data from the API based on the specified parameters.
    Handles both single and multiple coordinates.
    """
    start_year = params.get('start_year')
    end_year = params.get('end_year')
    coordinates = params.get('coordinates')
    data_types = required_data_types
    weather_data = None
    try:
        # check if array of coordinates {lat: x, lng: y} or [lat, lng]
        if isinstance(coordinates, list):
            # Remove duplicates in coordinates list
            coordinates = [dict(t) for t in {tuple(d.items()) for d in coordinates}]

            for point in coordinates:
                sub_params = params.copy()
                sub_params['coordinates'] = point
                try:
                    sub_data = fetch_data(sub_params, required_data_types, slump, calculate)
                    if sub_data is not None and not sub_data.empty:
                        weather_data = pd.concat([weather_data, sub_data], ignore_index=True) if weather_data is not None else sub_data
                except Exception as e:
                    logging.error(f"Error fetching data for {sub_params}: {e}", exc_info=True)
            return weather_data

        coordinates_str = coordinates if isinstance(coordinates, str) else f"{coordinates['lat']},{coordinates['lng']}"
        data_types_str = ','.join(data_types) if isinstance(data_types, list) else data_types
        query_url = (
            f"{BASE_URL}?position={coordinates_str}"
            f"&radius=30&date={start_year}0101-{end_year}1231&types={data_types_str}"
        )
        if calculate:
            query_url += "&calculate=true&sort=year"
        # Check cache
        try:
            cache_results = get_cached(params, None, True)
            if cache_results:
                logging.info("Using cached results")
                df = pd.DataFrame(json.loads(cache_results))
                if 'date' in df.columns:
                    df['date'] = pd.to_datetime(df['date'], errors='coerce')
                return df
        except Exception as e:
            logging.warning(f"Cache retrieval error: {e}", exc_info=True)

        # Handle slump case
        if slump == 'true':
            df = generate_random_weather_data(start_year, end_year)
            if 'date' in df.columns:
                df['date'] = pd.to_datetime(df['date'], errors='coerce')
            return df

        # Fetch data with retries
        for attempt in range(retries):
            try:
                data = getAPI(query_url)
                try:
                    df = pd.DataFrame(data)
                except json.JSONDecodeError as e:
                    logging.error(f"Failed to decode JSON response: {e}", exc_info=True)
                    return pd.DataFrame()

                if 'date' in df.columns:
                    df['date'] = pd.to_datetime(df['date'], errors='coerce')

                for data_type in data_types:
                    if data_type in df.columns:
                        if DATA_TYPES_TO_TYPE.get(data_type) == 'date':
                            df[data_type] = pd.to_datetime(df[data_type], errors='coerce').dt.dayofyear
                        else:
                            df[data_type] = pd.to_numeric(df[data_type], errors='coerce')

                return df
            except (HTTPError, Timeout, ConnectionError, TooManyRedirects) as err:
                logging.warning(f"Attempt {attempt + 1} - Network Error: {err}")
                logging.warning(f"URL: {query_url}")
                time.sleep(2 ** attempt)  # Exponential backoff
            except RequestException as err:
                logging.error(f"Request failed: {err}", exc_info=True)
                break

    except Exception as e:
        logging.critical(f"Unexpected error in fetch_data: {e}", exc_info=True)

    logging.error(f"Failed to fetch data after {retries} attempts.")
    return pd.DataFrame()


# Define the statistics that can be calculated
def calculate_available_statistics(df, types):
    available_stats = {}
    for data_type in types:
        available_stats[data_type] = data_type in df.columns and not df[data_type].isnull().all()
    return available_stats

from server import STATISTICS_TO_DATA_TYPES
# Main function to get available statistics for a specific station at given coordinates and year
def get_weather_stats_for_station(lat, long, data_types, slump = False):
    coordinates = {
        "lat": lat,
        "lng": long
    }
    params = {'start_year': 1985, 'end_year': 1990, 'data_types': data_types, 'coordinates': coordinates, 'slump': slump, 'type': 'weather_stats'}
    cache_results = get_cached(params, 'weather_stats')
    if cache_results:
        return cache_results
    # Fetch data for the specific station at given coordinates
    result = None
    station_data = fetch_data(params, data_types)
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
    set_cache(params, result, 'weather_stats')
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

from tqdm import tqdm
import time
# Helper function to fetch all SMHI stations
def fetch_all_stations():
    # Check if the data is cached
    try:
        url = SMHI_STATION_NAME_URLS[0]
        data = getAPI(url)
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

        logger.disabled = True  # Disable logging while fetching weather stats
        for station in tqdm(stations):
            url = 'http://localhost:5000/station?' + f'lat={station["latitude"]}&lng={station["longitude"]}'
            station['available_statistics'] = getAPI(url)
            #station['available_statistics'] = get_weather_stats_for_station(station['latitude'], station['longitude'], ALL_DATA_TYPES)
            yield station
        logger.disabled = False # Re-enable logging

    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching stations: {e}")
        yield None
