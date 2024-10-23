import pandas as pd
import requests

BASE_URL = 'https://vischange.k8s.glimworks.se/data/query/v1'

# Helper function to query data for a specific station by coordinates and year
def fetch_data_for_coordinates(coordinates, year, data_types):
    query_url = f"{BASE_URL}?position={coordinates[0]},{coordinates[1]}&radius=30&date={year}0101-{year}1231&types={','.join(data_types)}"
    response = requests.get(query_url)

    if response.status_code == 200:
        data = response.json()
        df = pd.DataFrame(data)
        if not df.empty:
            df['date'] = pd.to_datetime(df['date'])
        return df
    else:
        return None

# Define the statistics that can be calculated
def calculate_available_statistics(df):
    available_stats = {}

    # Check for each statistic if it can be calculated based on the data
    if 'avg_temperature' in df.columns and not df['avg_temperature'].isnull().all():
        available_stats['avg_temperature'] = True
    if 'precipitation' in df.columns and not df['precipitation'].isnull().all():
        available_stats['precipitation'] = True
    if 'min_temperature' in df.columns and not df['min_temperature'].isnull().all():
        available_stats['min_temperature'] = True
    if 'max_temperature' in df.columns and not df['max_temperature'].isnull().all():
        available_stats['max_temperature'] = True
    if 'snowdepth_meter' in df.columns and not df['snowdepth_meter'].isnull().all():
        available_stats['snowdepth_meter'] = True
    if 'co2_weekly' in df.columns and not df['co2_weekly'].isnull().all():
        available_stats['co2_weekly'] = True
    if 'freezeup' in df.columns and not df['freezeup'].isnull().all():
        available_stats['freezeup'] = True
    if 'breakup' in df.columns and not df['breakup'].isnull().all():
        available_stats['breakup'] = True

    return available_stats

# Main function to get available statistics for a specific station at given coordinates and year
def get_weather_stats_for_station(coordinates, year, data_types):
    # Fetch data for the specific station at given coordinates
    station_data = fetch_data_for_coordinates(coordinates, year, data_types)

    if station_data is not None and not station_data.empty:
        # Calculate available statistics based on the fetched data
        available_statistics = calculate_available_statistics(station_data)
        return {
            "coordinates": coordinates,
            "available_statistics": available_statistics
        }
    else:
        return {
            "coordinates": coordinates,
            "available_statistics": "No data available for this year"
        }

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
        "KnKod": None,
        'KnNamn': None,
        'LnKod' : None,
        'LnNamn' : None,
    }
    for _, row in kommuner_gdf.iterrows():
        if row['geometry'].contains(point):
            geolocation['KnKod'] = int(row['ref:se:kommun:kod'])
            geolocation['KnNamn'] = row['name']
            break
    for _, row in landskap_gdf.iterrows():
        if row['geometry'].contains(point):
            geolocation['LnKod'] = row['landskapskod']
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

        return stations
    except requests.exceptions.RequestException as e:
        print(f"Error fetching stations: {e}")
        return None
