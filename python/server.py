from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS library
import requests
import pandas as pd
import numpy as np
import calendar

import stations
from stations import fetch_data_for_coordinates
from cache import get_cached, set_cache, clear_cache, clear_all_cache
from generate import generate_random_weather_data

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

import json

# Helper functions to calculate the frost and temperature statistics
def first_frost_autumn(df):
    """Find the first frost in autumn (from September onwards)."""
    if df.empty:
        return None
    autumn_df = df[df['date'].dt.month >= 9]  # Filter dates from September onwards
    frosts = autumn_df[autumn_df['avg_temperature'] <= 0]
    if not frosts.empty:
        return int(frosts.iloc[0]['date'].dayofyear)
    return None

def last_frost_spring(df, year):
    """Find the last frost in spring (up until March of the next year)."""
    if df.empty:
        return None
    spring_df = annual_spring(df)
    frosts = spring_df[spring_df['avg_temperature'] <= 0]
    if not frosts.empty:
        return int(frosts.iloc[-1]['date'].dayofyear)
    return None

import pandas as pd

def growing_season_weeks(df):
    # Check if the DataFrame is empty
    if df.empty:
        return None
    df = df.copy()
    df['above_zero'] = (df['min_temperature'] > 0) | (df['avg_temperature'] > 0)
    weeks_above_zero = df.groupby(df['date'].dt.isocalendar().week)['above_zero'].max()
    return int(weeks_above_zero.sum())

def growing_season_days(df):
    if df.empty:
        return 0  # Return 0 for an empty DataFrame
    # Ensure data is sorted by date
    df = df.copy()
    df = df.sort_values(by='date')
    # Create a new column 'above_zero' indicating if the day was frost-free
    df['above_zero'] = (df['min_temperature'] > 0) | (df['avg_temperature'] > 0)
    # Group by each day (ignoring multiple records within a day) and take the maximum of 'above_zero'
    days_above_zero = df.groupby(df['date'].dt.date)['above_zero'].max()
    # Count the frost-free days by summing the True values (1 for frost-free, 0 for frosty)
    frost_free_days = int(days_above_zero.sum())
    return frost_free_days


def warmest(df, period):
    if df.empty:
        return None
    return df.groupby(df['date'].dt.to_period(period))['avg_temperature'].mean().idxmax()

def coldest(df, period):
    if df.empty:
        return None
    return df.groupby(df['date'].dt.to_period(period))['avg_temperature'].mean().idxmin()

def warmest_day(df):
    if df.empty:
        return None
    return df.groupby(df['date'].dt.isocalendar().day)['avg_temperature'].mean().idxmax()
def coldest_day(df):
    if df.empty:
        return None
    return df.groupby(df['date'].dt.isocalendar().day)['avg_temperature'].mean().idxmin()

# New helper functions to calculate coldest/warmest months and weeks
def coldest_month(df):
    if df.empty:
        return None
    return df.groupby(df['date'].dt.month)['avg_temperature'].mean().idxmin()

def warmest_month(df):
    if df.empty:
        return None
    return df.groupby(df['date'].dt.month)['avg_temperature'].mean().idxmax()

def coldest_week(df):
    if df.empty:
        return None
    return df.groupby(df['date'].dt.isocalendar().week)['avg_temperature'].mean().idxmin()

def warmest_week(df):
    if df.empty:
        return None
    return df.groupby(df['date'].dt.isocalendar().week)['avg_temperature'].mean().idxmax()

def annual_spring(df):
    """Calculate the annual average temperature during spring (March to May)."""
    if df.empty:
        return None
    return df[(df['date'].dt.month >= 3) & (df['date'].dt.month <= 5)]  # Filter March to May

def annual_summer(df):
    """Calculate the annual average temperature during summer (June to August)."""
    if df.empty:
        return None
    return df[(df['date'].dt.month >= 6) & (df['date'].dt.month <= 8)]  # Filter June to August

def annual_autumn(df):
    """Calculate the annual average temperature during autumn (September to November)."""
    if df.empty:
        return None
    return df[(df['date'].dt.month >= 9) & (df['date'].dt.month <= 11)]  # Filter September to November

def annual_winter(df):
    """Calculate the annual average temperature during winter (December to February)."""
    if df.empty:
        return None
    return df[(df['date'].dt.month >= 12) | (df['date'].dt.month <= 2)]  # Filter December to February

def annual_temperature(df):
    """Calculate the annual average temperature."""
    if df.empty:
        return None
    return df['avg_temperature'].mean()
def max_annual_temperature(df):
    """Calculate the annual average temperature."""
    if df.empty:
        return None
    return df.groupby(df['date'].dt.year)['avg_temperature'].max().mean()

def min_annual_temperature(df):
    """Calculate the annual average temperature."""
    if df.empty:
        return None
    return df.groupby(df['date'].dt.year)['avg_temperature'].min().mean()

def annual_spring_temperature(df):
    """Calculate the annual average temperature during spring (March to May)."""
    spring_df = annual_spring(df)
    if spring_df.empty:
        return None
    return spring_df['avg_temperature'].mean()
def max_annual_spring_temperature(df):
    """Calculate the annual average temperature during spring (March to May)."""
    spring_df = annual_spring(df)
    if spring_df.empty:
        return None
    return spring_df['avg_temperature'].max()
def min_annual_spring_temperature(df):
    """Calculate the annual average temperature during spring (March to May)."""
    spring_df = annual_spring(df)
    if spring_df.empty:
        return None
    return spring_df['avg_temperature'].min()

def annual_summer_temperature(df):
    """Calculate the annual average temperature during summer (June to August)."""
    summer_df = annual_summer(df)
    if summer_df.empty:
        return None
    return summer_df['avg_temperature'].mean()
def min_annual_summer_temperature(df):
    """Calculate the annual average temperature during summer (June to August)."""
    summer_df = annual_summer(df)
    if summer_df.empty:
        return None
    return summer_df['avg_temperature'].min()
def max_annual_summer_temperature(df):
    """Calculate the annual average temperature during summer (June to August)."""
    summer_df = annual_summer(df)
    if summer_df.empty:
        return None
    return summer_df['avg_temperature'].max()
def annual_autumn_temperature(df):
    """Calculate the annual average temperature during autumn (September to November)."""
    autumn_df = annual_autumn(df)
    if autumn_df.empty:
        return None
    return autumn_df['avg_temperature'].mean()
def min_annual_autumn_temperature(df):
    """Calculate the annual average temperature during autumn (September to November)."""
    autumn_df = annual_autumn(df)
    if autumn_df.empty:
        return None
    return autumn_df['avg_temperature'].min()
def max_annual_autumn_temperature(df):
    """Calculate the annual average temperature during autumn (September to November)."""
    autumn_df = annual_autumn(df)
    if autumn_df.empty:
        return None
    return autumn_df['avg_temperature'].max()
def annual_winter_temperature(df):
    """Calculate the annual average temperature during winter (December to February)."""
    winter_df = annual_winter(df)
    if winter_df.empty:
        return None
    return winter_df['avg_temperature'].mean()
def max_annual_winter_temperature(df):
    """Calculate the annual average temperature during winter (December to February)."""
    winter_df = annual_winter(df)
    if winter_df.empty:
        return None
    return winter_df['avg_temperature'].max()
def min_annual_winter_temperature(df):
    """Calculate the annual average temperature during winter (December to February)."""
    winter_df = annual_winter(df)
    if winter_df.empty:
        return None
    return winter_df['avg_temperature'].min()
def annual_month(df, month):
    """Return the monthly data for the specified month."""
    return df[df['date'].dt.month == month].copy()
def annual_month_temperature(df, month):
    """Calculate the annual average temperature for the specified month."""
    month_df = annual_month(df, month)
    if month_df.empty:
        return None
    return month_df['avg_temperature'].mean()
def max_annual_month_temperature(df, month):
    """Calculate the annual maximum temperature for the specified month."""
    month_df = annual_month(df, month)
    if month_df.empty:
        return None
    return month_df['avg_temperature'].max()
def min_annual_month_temperature(df, month):
    """Calculate the annual minimum temperature for the specified month."""
    month_df = annual_month(df, month)
    if month_df.empty:
        return None
    return month_df['avg_temperature'].min()
def annual_month_precipitation(df, month):
    """Calculate the annual average precipitation for the specified month."""
    month_df = annual_month(df, month)
    if month_df.empty:
        return None
    return month_df['precipitation'].sum()
def rain_annual_month_precipitation(df, month):
    """Calculate the annual average rainfall for the specified month."""
    rainfall_month_df = annual_month(df, month)
    if rainfall_month_df.empty:
        return None
    return rainfall_month_df[rainfall_month_df['avg_temperature'] > 0]['precipitation'].sum()
def snow_annual_month_precipitation(df, month):
    """Calculate the annual average snowfall for the specified month."""
    snowfall_month_df = annual_month(df, month)
    if snowfall_month_df.empty:
        return None
    return snowfall_month_df[snowfall_month_df['avg_temperature'] <= 0]['precipitation'].sum()

def precipitation_stats(df):
    """Calculate the sum and average precipitation across stations for the year."""
    if df.empty:
        return {'rain': 0, 'snow': 0, 'total': 0}
    df = df.copy()
    # Ensure 'precipitation' and 'avg_temperature' columns are numeric
    df['precipitation'] = pd.to_numeric(df['precipitation'], errors='coerce')
    df['avg_temperature'] = pd.to_numeric(df['avg_temperature'], errors='coerce')

    # Drop rows with NaN values in 'precipitation', 'avg_temperature', or 'station'
    df = df.dropna(subset=['precipitation', 'avg_temperature', 'station'])

    # Separate snow and rain data based on avg_temperature
    snow_df = df[df['avg_temperature'] <= 0]
    rain_df = df[df['avg_temperature'] > 0]

    # Group by station to calculate precipitation sums for snow, rain, and total
    snow_precipitation = snow_df.groupby('station')['precipitation'].sum()
    rain_precipitation = rain_df.groupby('station')['precipitation'].sum()
    total_precipitation = df.groupby('station')['precipitation'].sum()

    # Calculate mean values across stations, handling empty groups by filling NaN with 0
    return {
        'rain': rain_precipitation.mean() if not rain_precipitation.empty else 0,
        'snow': snow_precipitation.mean() if not snow_precipitation.empty else 0,
        'total': total_precipitation.mean() if not total_precipitation.empty else 0
    }


def icetime_annual(df):
    """Calculate the annual average ice time."""
    if df.empty:
        return None
    return df['icetime'].mean()
def annual_freezeup(df):
    """Calculate the annual average freezeup date."""
    if df.empty:
        return None
    threshold = 90  # You can adjust this threshold based on your use case
    days_in_previous_year = 365  # You can adjust this for leap years if needed
    # and number of days of previous year to the freezeup number
    df['adjusted_freezeup'] = df['freezeup'].apply(lambda x: x + days_in_previous_year if x <= threshold else x)
    return df['adjusted_freezeup'].mean()
def annual_breakup(df):
    """Calculate the annual average breakup date."""
    if df.empty:
        return None
    return df['breakup'].mean()
def annual_ice_thickness(df):
    """Calculate the annual average ice thickness."""
    if df.empty:
        return None
    return df['complete_ice_cover'].max()

def period_month_snowdepth(df, month):
    """Calculate the annual average snow depth."""
    month_df = annual_month(df, month)
    if month_df.empty:
        return None
    return month_df['snowdepth_single'].mean()

def calculate_time_interval_stats(weather_data, start_year, end_year, step, requested_stats, stat_name, stat_function):
    """Calculate statistics over a specified time interval (e.g., decades or periods)."""
    time_interval_results = {}

    # Loop over the time intervals
    for start in range(int(start_year), int(end_year), step):
        # Filter the data for the current time interval
        time_interval_data = weather_data[(weather_data['date'].dt.year >= start) &
                                          (weather_data['date'].dt.year < start + step)]

        if time_interval_data.empty:
            time_interval_results[start] = {'error': f'No data available for this interval.'}
            continue

        # Initialize the stats for this time interval
        interval_stats = {}

        # Loop through each month to calculate stats if required
        for month in range(1, 13):
            if stat_name in requested_stats:
                interval_stats[month] = {}
                interval_stats[month][stat_name] = stat_function(time_interval_data, month)
        # Store the stats for this time interval
        if interval_stats:
            time_interval_results[start] = interval_stats
    time_interval_results['allTime'] = {}
    time_allTime_data = weather_data[(weather_data['date'].dt.year >= int(start_year)) & (weather_data['date'].dt.year <= int(end_year))]
    for month in range(1, 13):
        if stat_name in requested_stats:
            time_interval_results['allTime'][month] = {}
            time_interval_results['allTime'][month][stat_name] = stat_function(time_allTime_data, month)
    return time_interval_results



# Map statistic types to required raw data types based on the available database types
STATISTICS_TO_DATA_TYPES = {
    'annual_temperature': ['avg_temperature'],
    'global_temperature': ['glob_temp'],
    'northern_hemisphere_temperature': ['nhem_temp'],
    '64n90n_temperature': ['64n-90n_temp'],
    'annual_spring_temperature': ['avg_temperature'],
    'annual_summer_temperature': ['avg_temperature'],
    'annual_autumn_temperature': ['avg_temperature'],
    'annual_winter_temperature': ['avg_temperature'],
    'annual_winter_temperature': ['avg_temperature'],
    'annual_jan_temperature': ['avg_temperature'],
    'annual_feb_temperature': ['avg_temperature'],
    'annual_mar_temperature': ['avg_temperature'],
    'annual_apr_temperature': ['avg_temperature'],
    'annual_may_temperature': ['avg_temperature'],
    'annual_jun_temperature': ['avg_temperature'],
    'annual_jul_temperature': ['avg_temperature'],
    'annual_aug_temperature': ['avg_temperature'],
    'annual_sep_temperature': ['avg_temperature'],
    'annual_oct_temperature': ['avg_temperature'],
    'annual_nov_temperature': ['avg_temperature'],
    'annual_dec_temperature': ['avg_temperature'],
    'first_frost_autumn': ['avg_temperature'],
    'last_frost_spring': ['avg_temperature'],
    'growing_season_days': ['min_temperature', 'avg_temperature'],
    'growing_season_weeks': ['min_temperature', 'avg_temperature'],
    'coldest_day': ['min_temperature'],
    'warmest_day': ['max_temperature'],
    'coldest_month': ['avg_temperature'],
    'warmest_month': ['avg_temperature'],
    'coldest_week': ['avg_temperature'],
    'warmest_week': ['avg_temperature'],
    'annual_precipitation': ['avg_temperature', 'precipitation'],
    'annual_spring_precipitation': ['avg_temperature','precipitation'],
    'annual_summer_precipitation': ['avg_temperature','precipitation'],
    'annual_autumn_precipitation': ['avg_temperature','precipitation'],
    'annual_winter_precipitation': ['avg_temperature','precipitation'],
    'annual_jan_precipitation': ['avg_temperature','precipitation'],
    'annual_feb_precipitation': ['avg_temperature','precipitation'],
    'annual_mar_precipitation': ['avg_temperature','precipitation'],
    'annual_apr_precipitation': ['avg_temperature','precipitation'],
    'annual_may_precipitation': ['avg_temperature','precipitation'],
    'annual_jun_precipitation': ['avg_temperature','precipitation'],
    'annual_jul_precipitation': ['avg_temperature','precipitation'],
    'annual_aug_precipitation': ['avg_temperature','precipitation'],
    'annual_sep_precipitation': ['avg_temperature','precipitation'],
    'annual_oct_precipitation': ['avg_temperature','precipitation'],
    'annual_nov_precipitation': ['avg_temperature','precipitation'],
    'annual_dec_precipitation': ['avg_temperature','precipitation'],
    'annual_freezeup': ['freezeup'],
    'annual_breakup': ['breakup'],
    'annual_ice_time': ['icetime'],
    'annual_ice_thickness': ['complete_ice_cover'],
    'weekly_co2': ['co2_weekly'],
    'annual_snowdepth_meter': ['snowdepth_meter'],
    'annual_snowdepth_single': ['snowdepth_single'],
    'period_snowdepth': ['snowdepth_single'],
    'glob_temp': ['glob_temp'],
    'nhem_temp': ['nhem_temp'],
    'perma': ['perma'],
}
DATA_TYPES_TO_TYPE = {
    'avg_temperature': 'numeric',
    'glob_temp': 'numeric',
    'nhem_temp': 'numeric',
    '64n-90n_temp': 'numeric',
    'avg_temperature': 'numeric',
    'precipitation': 'numeric',
    'freezeup': 'date',
    'breakup': 'date',
    'icetime': 'numeric',
    'snowdepth_single': 'numeric',
    'snowdepth_meter': 'numeric',
}

# List of all available statistics
ALL_STATISTICS = list(STATISTICS_TO_DATA_TYPES.keys())

def calculate_difference_from_baseline(year_stats, baseline_stats):
    """Calculate the difference between the yearly statistics and the baseline statistics."""
    differences = {}

    for stat in year_stats:
        if  'diff' in stat.split('_'):
            continue
        if stat in baseline_stats and isinstance(baseline_stats[stat], (int, float)):
            # For numeric values, calculate the difference
            differences['diff_' + stat] = year_stats[stat] - baseline_stats[stat]
        else:
            differences['diff_' + stat] = None  # Handle non-numeric or unavailable data

    return differences

@app.route('/', methods=['GET'])
def status():
    return jsonify({'status': 'ok'})


def fetch_data(params, required_data_types, slump):
    """Fetch the raw weather data from the API based on the specified parameters."""
    coordinates = params['coordinates']
    start_year = params['start_year']
    end_year = params['end_year']
    # if coordinates is array
    weather_data = None
    if isinstance(coordinates, list):
        coordinates = [f"{point['lat']},{point['lng']}" for point in coordinates]
        # fetch data for each point and combine them
        for point in coordinates:
            params_sub = params.copy()
            params_sub['coordinates'] = point
            sub_data = fetch_data(params_sub.copy(), required_data_types, slump)

            # combinde sub_data to weather_data
            if weather_data is None:
                weather_data = sub_data
            else:
                # check if sub_data is empty
                if not sub_data is None and len(sub_data) != 0:
                    weather_data = pd.concat([weather_data, sub_data], ignore_index=True)
        return weather_data

    response = None
    if slump == 'true':
        response = generate_random_weather_data(start_year, end_year)
        weather_data = response
    else:
        coordinates = coordinates.split(',')
        long = coordinates[0]
        lat = coordinates[1]
        data_types = required_data_types.split(',')
        weather_data = fetch_data_for_coordinates(long, lat, start_year, end_year, data_types)

        # Assuming the data is in JSON format and contains the necessary raw data types
        try:
            weather_data['date'] = pd.to_datetime(weather_data['date'])
            # Ensure necessary columns are in numeric format
            for data_type in required_data_types.split(','):
                if data_type in weather_data.columns:
                    if data_type in DATA_TYPES_TO_TYPE:
                        if DATA_TYPES_TO_TYPE[data_type] == 'date':
                            weather_data[data_type] = pd.to_datetime(weather_data[data_type], errors='coerce')
                            weather_data[data_type] = weather_data[data_type].dt.dayofyear
                    weather_data[data_type] = pd.to_numeric(weather_data[data_type], errors='coerce')
        except Exception as e:
            return None


    # Fetch the data from the given URL
    return weather_data
@app.route('/data', methods=['GET'])
def weather_stats():
    # Retrieve the query parameters for year range, coordinates, and filtering options
    start_year = request.args.get('start_year')
    end_year = request.args.get('end_year')
    coordinates = request.args.get('coordinates')  # Coordinates in the format "lat,lng"
    requested_stats = request.args.getlist('types')  # List of requested statistics (e.g., coldest_day, growing_season_days)
    baseline = request.args.get('baseline', '1961,1990')  # Default to 1961-1990 baseline
    radius = request.args.get('radius', 30)  # Default to 30 km radius (for future use)
    station = request.args.get('station', 'all')
    KnKod = request.args.get('KnKod')
    LnKod = request.args.get('LnKod')
    slump = request.args.get('random')

    # Parse baseline interval
    baseline_start, baseline_end = map(int, baseline.split(','))

        # Combine the request parameters into a dict for caching
    params_in = {
             'start_year': start_year,
             'end_year': end_year,
             'coordinates': coordinates,
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
        'coordinates': coordinates,
        'requested_stats': requested_stats,
        'baseline': baseline,
        'LnKod': LnKod,
        'KnKod': KnKod,
        'slump': slump

    }
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



    # Check the cache for an existing result
    # TODO return cache exist still reevaluate baseline cache seperately
    #cached_result = get_cached(params)
    #if cached_result:
    #    return jsonify(cached_result)
    cached_result = get_cached(params)
    if cached_result:
        # If cached, check if the baseline matches
        cached_baseline = cached_result.get('baseline')
        if cached_baseline != baseline:
            # If baseline differs, calculate the new baseline stats and update the results
            baseline_stats = cached_result.get('annual')
            # data frame to
            baseline_stats = pd.DataFrame(baseline_stats)
            baseline = baseline.split(',')
            baseline_start = int(baseline[0])
            baseline_end = int(baseline[1])
            # get columns from start to end year where column name is year string
            baseline_stats = baseline_stats.loc[:, [col for col in baseline_stats.columns if baseline_start <= int(col) <= baseline_end]]
            # mean of each row
            baseline_stats = baseline_stats.mean(axis=1)
            # baseline_stats = calculate_baseline_stats(cached_result['annual'], baseline_start, baseline_end, requested_stats)
            for year, year_stats in cached_result['annual'].items():
                differences = calculate_difference_from_baseline(year_stats, baseline_stats)
                year_stats.update(differences)

            # Update cache with new baseline result
            cached_result['baseline'] = baseline
            set_cache(params_in, cached_result)

        return jsonify(cached_result)

    # Validate input parameters
    if not start_year or not end_year or not coordinates or not requested_stats:
        return jsonify({'error': 'Missing required parameters: start_year, end_year, coordinates, or types'}), 400

    # Check if 'all' is requested
    if 'all' in requested_stats:
        requested_stats = ALL_STATISTICS  # Calculate all statistics

    # Determine which raw data types are needed based on requested statistics
    required_data_types = set()
    for stat in requested_stats:
        if stat in STATISTICS_TO_DATA_TYPES:
            required_data_types.update(STATISTICS_TO_DATA_TYPES[stat])
        else:
            return jsonify({'error': f"Unknown statistic type: {stat}"}), 400

    required_data_types = ','.join(required_data_types)  # Prepare data types for the query

    # TODO fetch stations
    stations = []
    if KnKod is not None or LnKod is not None:
        coords = []
        allstations = get_stations()
        allstations = np.array(allstations)
        # Filter the stations based on the given KnKod and LnKod
        # convert to dataframe
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
    # Calculate baseline statistics from the resulting statistics over the baseline period
    #print(weather_data)
    #print(requested_stats)
    #baseline_stats = calculate_baseline_stats(weather_data, baseline_start, baseline_end, requested_stats)
    weather_data['station'] = weather_data['station'].str.lower()
    if station != 'all':
        weather_data = weather_data[weather_data['station'] == station]
    # Perform necessary calculations based on the requested statistics
    results = {}
    for year in range(int(start_year), int(end_year)):
        # Filter data for the current year
        yearly_data = weather_data[weather_data['date'].dt.year == year]
        if yearly_data.empty:
            results[year] = {'error': 'No data available for this year.'}
            continue

        year_stats = {}

        # Compute requested statistics
        if 'annual_temperature' in requested_stats:
            year_stats['annual_temperature'] = annual_temperature(yearly_data)
            year_stats['max_annual_temperature'] = max_annual_temperature(yearly_data)
            year_stats['min_annual_temperature'] = min_annual_temperature(yearly_data)
        if 'global_temperature' in requested_stats:
            year_stats['global_temperature'] = yearly_data['glob_temp'].mean()
        if 'northern_hemisphere_temperature' in requested_stats:
            year_stats['northern_hemisphere_temperature'] = yearly_data['nhem_temp'].mean()
        if '64n90n_temperature' in requested_stats:
            year_stats['64n90n_temperature'] = yearly_data['64n-90n_temp'].mean()
        # create winter data for year covering spring to winther month
        winter_year_data = weather_data[((weather_data['date'].dt.year == year) & (weather_data['date'].dt.month <= 3)) | ((weather_data['date'].dt.year == year+1) & (weather_data['date'].dt.month <= 2))]
        if 'annual_spring_temperature' in requested_stats:
            year_stats['annual_spring_temperature'] = annual_spring_temperature(winter_year_data)
            year_stats['max_annual_spring_temperature'] = max_annual_spring_temperature(winter_year_data)
            year_stats['min_annual_spring_temperature'] = min_annual_spring_temperature(winter_year_data)
        if 'annual_summer_temperature' in requested_stats:
            year_stats['annual_summer_temperature'] = annual_summer_temperature(yearly_data)
            year_stats['max_annual_summer_temperature'] = max_annual_summer_temperature(yearly_data)
            year_stats['min_annual_summer_temperature'] = min_annual_summer_temperature(yearly_data)
        if 'annual_autumn_temperature' in requested_stats:
            year_stats['annual_autumn_temperature'] = annual_autumn_temperature(yearly_data)
            year_stats['max_annual_autumn_temperature'] = max_annual_autumn_temperature(yearly_data)
            year_stats['min_annual_autumn_temperature'] = min_annual_autumn_temperature(yearly_data)
        if 'annual_winter_temperature' in requested_stats:
            year_stats['annual_winter_temperature'] = annual_winter_temperature(yearly_data)
            year_stats['max_annual_winter_temperature'] = max_annual_winter_temperature(yearly_data)
            year_stats['min_annual_winter_temperature'] = min_annual_winter_temperature(yearly_data)
        if 'annual_spring_precipitation' in requested_stats:
            spring_stats = annual_spring(yearly_data)
            spring_stats = precipitation_stats(spring_stats)
            year_stats['annual_spring_precipitation'] = spring_stats['total']
            year_stats['snow_annual_spring_precipitation'] = spring_stats['snow']
            year_stats['rain_annual_spring_precipitation'] = spring_stats['rain']
        if 'annual_summer_precipitation' in requested_stats:
            summer_stats = annual_summer(yearly_data)
            summer_stats = precipitation_stats(summer_stats)
            year_stats['annual_summer_precipitation'] = summer_stats['total']
            year_stats['snow_annual_summer_precipitation'] = summer_stats['snow']
            year_stats['rain_annual_summer_precipitation'] = summer_stats['rain']
        if 'annual_autumn_precipitation' in requested_stats:
            autumn_stats = annual_autumn(yearly_data)
            autumn_stats = precipitation_stats(autumn_stats)
            year_stats['annual_autumn_precipitation'] = autumn_stats['total']
            year_stats['snow_annual_autumn_precipitation'] = autumn_stats['snow']
            year_stats['rain_annual_autumn_precipitation'] = autumn_stats['rain']
        if 'annual_winter_precipitation' in requested_stats:
            winter_stats = annual_winter(yearly_data)
            winter_stats = precipitation_stats(winter_stats)
            year_stats['annual_winter_precipitation'] = winter_stats['total']
            year_stats['snow_annual_winter_precipitation'] = winter_stats['snow']
            year_stats['rain_annual_winter_precipitation'] = winter_stats['rain']
        if 'perma' in requested_stats:
            year_stats['perma'] = yearly_data['perma'].mean()
        for month in range(1, 13):
            month_name = calendar.month_abbr[month].lower()
            if f'annual_{month_name}_temperature' in requested_stats:
                year_stats[f'annual_{month_name}_temperature'] = annual_month_temperature(yearly_data, month)
                year_stats[f'max_annual_{month_name}_temperature'] = max_annual_month_temperature(yearly_data, month)
                year_stats[f'min_annual_{month_name}_temperature'] = min_annual_month_temperature(yearly_data, month)
            if f'annual_{month_name}_precipitation' in requested_stats:
                year_stats[f'annual_{month_name}_precipitation'] = annual_month_precipitation(yearly_data, month)
                year_stats[f'snow_annual_{month_name}_precipitation'] = snow_annual_month_precipitation(yearly_data, month)
                year_stats[f'rain_annual_{month_name}_precipitation'] = rain_annual_month_precipitation(yearly_data, month)

        if 'first_frost_autumn' in requested_stats:
            year_stats['first_frost_autumn'] = int(first_frost_autumn(yearly_data)) if first_frost_autumn(yearly_data) else None

        if 'last_frost_spring' in requested_stats:
            last_frost = last_frost_spring(yearly_data, year)
            year_stats['last_frost_spring'] = int(last_frost) if last_frost else None

        if 'growing_season_weeks' in requested_stats:
            year_stats['growing_season_weeks'] = int(growing_season_weeks(yearly_data)) if growing_season_weeks(yearly_data) else None

        if 'growing_season_days' in requested_stats:
            year_stats['growing_season_days'] = int(growing_season_days(yearly_data)) if growing_season_days(yearly_data) else None

        if 'coldest_day' in requested_stats:
            year_stats['coldest_day'] = int(coldest_day(yearly_data)) if coldest_day(yearly_data) else None

        if 'warmest_day' in requested_stats:
            year_stats['warmest_day'] = int(warmest_day(yearly_data)) if warmest_day(yearly_data) else None

        if 'coldest_month' in requested_stats:
            year_stats['coldest_month'] = coldest_month(yearly_data) if coldest_month(yearly_data) else None

        if 'warmest_month' in requested_stats:
            year_stats['warmest_month'] = warmest_month(yearly_data) if warmest_month(yearly_data) else None

        if 'coldest_week' in requested_stats:
            year_stats['coldest_week'] = int(coldest_week(yearly_data)) if coldest_week(yearly_data) else None

        if 'warmest_week' in requested_stats:
            year_stats['warmest_week'] = int(warmest_week(yearly_data)) if warmest_week(yearly_data) else None

        if 'annual_precipitation' in requested_stats:
            station_precipitation_stats = precipitation_stats(yearly_data)
            year_stats['snow_annual_precipitation'] = station_precipitation_stats['snow']
            year_stats['rain_annual_precipitation'] = station_precipitation_stats['rain']
            year_stats['annual_precipitation'] = yearly_data['precipitation'].sum()

        if 'annual_spring_precipitation' in requested_stats:
            year_stats['annual_spring_precipitation'] = winter_year_data['precipitation'].sum()
        if 'annual_ice_time' in requested_stats:
            year_stats['annual_ice_time'] = icetime_annual(yearly_data)

        if 'annual_freezeup' in requested_stats:
            year_stats['annual_freezeup'] = annual_freezeup(yearly_data)
        if 'annual_breakup' in requested_stats:
            year_stats['annual_breakup'] = annual_breakup(yearly_data)
        if 'annual_ice_thickness' in requested_stats:
            year_stats['annual_ice_thickness'] = int(annual_ice_thickness(yearly_data))
        if 'annual_snowdepth_meter' in requested_stats:
            year_stats['annual_snowdepth_meter'] = yearly_data['snowdepth_meter'].mean()
        if 'annual_snowdepth_single' in requested_stats:
            year_stats['annual_snowdepth_single'] = yearly_data['snowdepth_single'].mean()

        if weather_data['station'].nunique() == 1:
            year_stats['station'] = weather_data['station'].iloc[0]

        if year_stats:  # Only add stats if any calculations were made
            results[year] = year_stats
        # Calculate the difference from the baseline statistics
        #differences = calculate_difference_from_baseline(year_stats, baseline_stats)
        #year_stats.update(differences)

    # TODO built into single function

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
    def convert_np_types(obj):
        """Helper function to convert numpy types to native Python types."""
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, pd.Timestamp):
            return str(obj)
        else:
            return obj

    results = {
        'annual': {year: {k: convert_np_types(v) for k, v in stats.items()} for year, stats in results.items()},
        'decades': {str(decade): {k: convert_np_types(v) for k, v in stats.items()} for decade, stats in decade_results.items()},
        'periods': {str(period): {k: convert_np_types(v) for k, v in stats.items()} for period, stats in period_results.items()},
        'raw': {
                stat_type: [
                    {k: convert_np_types(v) for k, v in stat_item.items()}
                    for stat_item in stat_list
                ]
                for stat_type, stat_list in raw_stats.items()
        },
        'baslines': baseline
    }
    # get columns from start to end year where column name is year string
    baseline_stats = results.get('annual')
    baseline_stats = pd.DataFrame(baseline_stats)
    baseline = baseline.split(',')
    baseline_start = int(baseline[0])
    baseline_end = int(baseline[1])
    baseline_stats = baseline_stats.loc[:, [col for col in baseline_stats.columns if baseline_start <= int(col) <= baseline_end]]
    # mean of each row
    baseline_stats = baseline_stats.mean(axis=1)
    for year, year_stats in results['annual'].items():
          differences = calculate_difference_from_baseline(year_stats, baseline_stats)
          year_stats.update(differences)

    # Cache the result
    set_cache(params_in, results)
    return jsonify(results)



def get_stations(flush=False):
    if flush:
        clear_cache('stations')
    # check if cached
    allstations = get_cached('stations')
    if allstations:
        return allstations

    allstations = stations.fetch_all_stations()
    # Cache the result
    set_cache('stations', allstations)
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
    year = request.args.get('year')
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    KnKod = request.args.get('KnKod')
    LnKod = request.args.get('LnKod')
    slump = request.args.get('random')
    flush = request.args.get('flush')
    reset = request.args.get('reset')

    # Validate the parameters
    if (not lat or not lng) and (not KnKod and not LnKod):
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
            clear_cache(params)

    cached_result = get_cached(params)
    if cached_result:
        return jsonify(cached_result)
    # Get available statistics for the station at the provided coordinates
    kod = None
    if KnKod is not None:
        kod = 'knkod'
    else:
        if LnKod is not None:
            kod = 'lnkod'
    if kod is None:
        coordinates = (float(lat), float(lng))
        station_stats = stations.get_weather_stats_for_station(coordinates, DATA_TYPES, slump == 'true')
        set_cache(params, station_stats)
        return jsonify(station_stats)
    else:
        data_types = None
        allstations = get_stations()
        i = 0
        # allstations filter by KnKod or LnKod
        filtered_stations = [
            point for point in allstations
            if str(point['geodata'][kod]) == KnKod or str(point['geodata'][kod]) == LnKod
        ]
        print('Fetching data for stations...', len(filtered_stations))
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
