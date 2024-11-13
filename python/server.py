from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS library
import requests
import pandas as pd
import numpy as np

import stations
from stations import fetch_data
from cache import get_cached, set_cache, clear_cache, clear_all_cache, get_cached_result, set_cache_result
from weatherstats import weather_yearly, calculate_time_interval_stats, period_month_snowdepth, calculate_difference_from_baseline, calculate_baseline
from generate import generate_random_weather_data
from datatypes import STATISTICS_TO_DATA_TYPES, ALL_STATISTICS

import logging

# Configure logging
logging.basicConfig(
    filename='server_error.log',  # Log file name
    level=logging.ERROR,  # Only log errors and above (e.g., ERROR, CRITICAL)
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',  # Log format
    datefmt='%Y-%m-%d %H:%M:%S'  # Date format
)


app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

import json
import pandas as pd

def process_and_calculate_differences(stats, baseline_range):
    # Convert 'annual' data to a DataFrame
    baseline_stats = stats.get('annual')
    baseline_stats = pd.DataFrame(baseline_stats)

    # Parse baseline range
    baseline = baseline_range.split(',')
    baseline_start = int(baseline[0])
    baseline_end = int(baseline[1])

    # Filter columns within the specified year range
    baseline_stats = baseline_stats.loc[:, [col for col in baseline_stats.columns if baseline_start <= int(col) <= baseline_end]]

    # Remove specified rows if present
    if 'error' in baseline_stats.head():
        baseline_stats = baseline_stats.drop('error', axis=0)
    if 'station' in baseline_stats.head():
        baseline_stats = baseline_stats.drop('station', axis=0)

    # Convert data to numeric and calculate the mean of each row
    baseline_stats = baseline_stats.apply(pd.to_numeric, errors='coerce')
    baseline_stats_mean = baseline_stats.mean(axis=1)

    # Calculate differences from the baseline for each year
    for year, year_stats in stats.items():
        differences = calculate_difference_from_baseline(year_stats, baseline_stats_mean)
        stats[year].update(differences)

    return stats


@app.route('/', methods=['GET'])
def status():
    return jsonify({'status': 'ok'})


@app.route('/data', methods=['GET'])
def weather_stats():
    # Retrieve the query parameters for year range, coordinates, and filtering options
    start_year = request.args.get('start_year')
    end_year = request.args.get('end_year')
    requested_stats = request.args.getlist('types')  # List of requested statistics (e.g., coldest_day, growing_season_days)
    baseline = request.args.get('baseline', '1961,1990')  # Default to 1961-1990 baseline
    radius = request.args.get('radius', 30)  # Default to 30 km radius (for future use)
    station = request.args.get('station', 'all')
    coordinates = request.args.get('coordinates')  # Coordinates in the format "lat,lng"
    # check coordinates validity
    if coordinates is not None:
        coordinates = coordinates.split(',')
        if len(coordinates) != 2:
            coordinates = None
    KnKod = request.args.get('KnKod')
    LnKod = request.args.get('LnKod')
    #print(coordinates, KnKod, LnKod)
    slump = request.args.get('random')
    # Parse baseline interval
    baseline_start, baseline_end = map(int, baseline.split(','))

        # Combine the request parameters into a dict for caching
    params_in = {
             'start_year': start_year,
             'end_year': end_year,
             'requested_stats': requested_stats,
           #  'baseline': baseline,
             'radius': radius,
             'station': station,
             'slump': slump,
             'LnKod': LnKod,
             'KnKod': KnKod
    }
    params_baseline = {
        'start_year': start_year,
        'end_year': end_year,
        'requested_stats': requested_stats,
        'baseline': baseline,
        'LnKod': LnKod,
        'KnKod': KnKod,
        'slump': slump
    }
    if coordinates is not None:
        params_in['coordinates'] = ','.join(coordinates)
        params_baseline['coordinates'] = ','.join(coordinates)

    params = params_in.copy()
    # Reset
    reset = request.args.get('reset')
    if reset is not None:
        if reset.lower() == 'true':
            clear_cache(params)
    # flush
    flush = request.args.get('flush')
    if flush is not None:
        if flush.lower() == 'true':
            clear_cache(params)
            clear_all_cache()
    cached_combind, cached_result, cached_baseline = get_cached_result(params_in, params_baseline)
    if cached_combind:
        print('retrieve cache - exactly the same')
        return jsonify(cached_combind)

    if cached_result and isinstance(cached_result['annual'], str):
        print('retrieve cache - loads if string')
        cached_result = json.loads(cached_result)
    if cached_result:
        print('retrieve cache - result is cached')
        # If cached, check if the baseline matches
        # print cached_results
        if not cached_baseline:
            # todo sort out so calculate_difference_from_baseline always get data frames
            print('retrieve cache - baseline is not cached')
            tmp_result = pd.DataFrame(cached_result['annual'][0])
            baseline_stats = calculate_baseline(tmp_result, baseline)
            # Update cache with new baseline result
            cached_result['annual'] = calculate_difference_from_baseline(tmp_result, baseline_stats)
            cached_result['annual'] = serializablation(cached_result['annual'])

        return jsonify(cached_result)

    # Validate input parameters
    print(not start_year, not end_year, not coordinates, not KnKod, not LnKod, not requested_stats, not baseline)
    if not start_year or not end_year or (not coordinates and not KnKod and not LnKod) or not requested_stats or not baseline:
        logging.error('Mossing required parameters: start_year, end_year, coordinates, baseline, or types')
        return jsonify({'error': 'Missing required parameters: start_year, end_year, coordinates, types or baseline'}), 400

    # Check if 'all' is requested
    if 'all' in requested_stats:
        requested_stats = ALL_STATISTICS  # Calculate all statistics

    # Determine which raw data types are needed based on requested statistics
    array_required_data_types = set()
    for stat in requested_stats:
        if stat in STATISTICS_TO_DATA_TYPES:
            array_required_data_types.update(STATISTICS_TO_DATA_TYPES[stat])
        else:
            logging.error(f"Unknown statistic type: {stat}")
            return jsonify({'error': f"Unknown statistic type: {stat}"}), 400

    required_data_types = ','.join(array_required_data_types)  # Prepare data types for the query

    # TODO fetch stations
    stations = []
    if coordinates is None:
        coords = []
        allstations = get_stations()
        allstations = np.array(allstations)
        # filter out same coordinates
        #allstations = allstations[~pd.DataFrame(allstations).duplicated(subset=['latitude', 'longitude'])]
        code = False
        for point in allstations:
            if not KnKod or KnKod != 'NaN':
                code = str(point['geodata']['knkod']) == KnKod
            else:
                if not LnKod or LnKod != 'NaN':
                    code = str(point['geodata']['lnkod']) == LnKod
            if code:
                stations.append(point)
                coord = {
                    'lat': point['latitude'],
                    'lng': point['longitude']
                }
                coords.append(coord)
        # map latitude and longitude into a object
        params['coordinates'] = coords
    # Fetch the data from the given URL
    weather_data = fetch_data(params.copy(), required_data_types, slump)
    #print(weather_data)
    # Calculate baseline statistics from the resulting statistics over the baseline period
    #baseline_stats = calculate_baseline_stats(weather_data, baseline_start, baseline_end, requested_stats)
    if weather_data.empty:
        return jsonify({'error': 'No data available for the given parameters.'}), 404
    else:
        # Convert relevant columns to numeric
        for data_type in array_required_data_types:
            if data_type in weather_data.columns:
                weather_data[data_type] = pd.to_numeric(weather_data[data_type], errors='coerce')

    weather_data['station'] = weather_data['station'].str.lower()
    if station != 'all':
        weather_data = weather_data[weather_data['station'] == station]
    # Perform necessary calculations based on the requested statistics
    results = {}
    # Ensure 'date' column is in datetime format, with invalid values coerced to NaT
    if 'date' in weather_data.columns:
         weather_data['date'] = pd.to_datetime(weather_data['date'], errors='coerce')
    # print rows where date is None
    #if 'date' in weather_data.columns:
    #    weather_data['date'] = pd.to_datetime(weather_data['date'])
    results, baseline_stats = weather_yearly(weather_data, start_year, end_year, requested_stats, baseline)
    # Calculate stats for decades
    decade_start = 1961
    decade_results = calculate_time_interval_stats(weather_data, decade_start, end_year, 10, requested_stats, 'period_snowdepth', period_month_snowdepth)
    # Calculate stats for periods (e.g., 30-year intervals)
    period_start = 1931
    period_results = calculate_time_interval_stats(weather_data, period_start, end_year, 30, requested_stats, 'period_snowdepth', period_month_snowdepth)

    # raw
    raw_stats = {}
    if 'weekly_co2' in requested_stats:
        # Create a list of dictionaries with weekly_co2 and corresponding date
        raw_stats['weekly_co2'] = [
            {'weekly_co2': co2, 'date': int(pd.Timestamp(date).timestamp() * 1000)}
            for co2, date in zip(weather_data['co2_weekly'].astype(float), weather_data['date'])
        ]
    # Now embed the results into the final results dictionary
    # TODO temporarly use [0] but expand so multiple type requests can be made
    results_sanatized = {
        'annual': serializablation(results)[0],
        'decades': serializablation(decade_results)[0],
        'periods': serializablation(period_results)[0],
        'raw': {
                stat_type: [
                    {k: convert_np_types(v) for k, v in stat_item.items()}
                    for stat_item in stat_list
                ]
                for stat_type, stat_list in raw_stats.items()
        },
        'meta': {
            'baseline': baseline,
            'start_year': start_year,
            'end_year': end_year,
            'coordinates': coordinates,
            'requested_stats': requested_stats,
            'radius': radius,
            'station': station,
            'slump': slump,
            'LnKod': LnKod,
            'KnKod': KnKod
        }
    }
#    stats = process_and_calculate_differences(results_sanatized['annual'], baseline)
    # serielized
    baseline_sanatized = {k: convert_np_types(v) for k, v in baseline_stats.items()}
    set_cache_result(params, params_baseline, results_sanatized, baseline_sanatized)
    return jsonify(results_sanatized)

def convert_np_types(obj):
    # Check for NaN-like values safely
    if isinstance(obj, (int, float)) and np.isnan(obj):
        return None
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, pd.Timestamp):
        return str(obj)
    elif isinstance(obj, str):
        return obj  # Return as-is if it's a string
    elif pd.isna(obj):  # Handles pandas' NaT, None, and np.nan
        return None
    else:
        return obj
def serializablation(result):
    return {time: {k: convert_np_types(v) for k, v in stats.items()} for time, stats in result.items()},

def get_stations(flush=False):
    # check if cached
    params = {
        'stations': 'all'
    }
    if flush:
        clear_cache(params)
    allstations = get_cached(params)
    if allstations:
        logging.info('Retrieved all stations from cache')
        return allstations

    allstations = stations.fetch_all_stations()
    # Cache the result
    set_cache(params, allstations)
    logging.info('Fetched all stations from SMHI API')
    return allstations
# Flask route to serve all SMHI stations
@app.route('/stations', methods=['GET'])
def get_all_stations():
    flush = request.args.get('flush') == 'true'
    allstations = get_stations(flush)
    if allstations is not None:
        return jsonify({"stations": allstations})
    else:
        return jsonify({"error": "Could not fetch stations"}), 500


DATA_TYPES = ['avg_temperature', 'precipitation', 'min_temperature', 'max_temperature', 'snowdepth_single', 'snowdepth_meter', 'co2_weekly', 'freezeup', 'breakup', 'perma', 'icetime']
@app.route('/station', methods=['GET'])
def station_stats():
    # print time it takes to run
    year = request.args.get('year')
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    KnKod = request.args.get('KnKod')
    LnKod = request.args.get('LnKod')
    slump = request.args.get('random')
    flush = request.args.get('flush')
    reset = request.args.get('reset')
    data_types = request.args.get('types')
    if data_types is None:
        data_types = DATA_TYPES

    # Validate the parameters
    if (not lat or not lng) and (not KnKod and not LnKod):
        logging.error('Missing required parameters: lat, lng, or KnKod/LnKod')
        return jsonify({'error': 'Missing required parameters: lat, lng, or KnKod/LnKod'}), 400


    # List of all possible data types to check for

    params = {
        'lat': lat,
        'lng': lng,
        'knkod': KnKod,
        'lnkod': LnKod,
    }
    if flush is not None:
        if flush.lower() == 'true':
            clear_all_cache()
    if reset is not None:
        if reset.lower() == 'true':
            logging.info('Resetting cache')
            clear_cache(params)

    cached_result = get_cached(params)
    if cached_result:
        return jsonify(cached_result)
    # Get available statistics for the station at the provided coordinates
    if lat is not None and lng is not None:
        station_stats = stations.get_weather_stats_for_station(lat, lng, DATA_TYPES, slump == 'true')
        set_cache(params, station_stats)
        return jsonify(station_stats)
    kod = None
    if KnKod is not None:
        kod = 'knkod'
    else:
        if LnKod is not None:
            kod = 'lnkod'
    data_types = None
    allstations = get_stations()
    i = 0
    # allstations filter by KnKod or LnKod
    filtered_stations = [point for point in allstations if str(point['geodata'][kod]) == KnKod or str(point['geodata'][kod]) == LnKod]
    for point in filtered_stations:
        i = i + 1
        data_stats = stations.get_weather_stats_for_station(point['latitude'], point['longitude'], DATA_TYPES)
        if isinstance(data_stats['available_statistics'], str):
           continue
        if data_types is None:
           # check if data_stats is string
           data_types = data_stats['available_statistics']
        else:
           # only for loop for data_types when False
           for key, value in data_stats.items():
                data_types[key] = value or data_types[key]
    print('Done')
    set_cache(params, data_types)
    return jsonify(data_types)

    return jsonify(data_types)
if __name__ == '__main__':
    app.run(debug=False)
