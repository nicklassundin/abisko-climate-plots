from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS library
import requests
import pandas as pd
import numpy as np
import calendar

import stations

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

import redis
import json
import hashlib

# Initialize Redis connection
cache = redis.StrictRedis(host='localhost', port=6379, db=0)

def generate_cache_key(params):
    """Generate a unique cache key based on the request parameters."""
    key_string = json.dumps(params, sort_keys=True)  # Sorting to ensure key uniqueness
    return hashlib.md5(key_string.encode('utf-8')).hexdigest()

def get_weather_stats_cached(params):
    """Fetch cached weather stats from Redis if available."""
    cache_key = generate_cache_key(params)
    cached_data = cache.get(cache_key)
    if cached_data:
        return json.loads(cached_data)  # Return the cached data if available
    return None

def set_weather_stats_cache(params, data):
    """Cache the weather stats result in Redis."""
    cache_key = generate_cache_key(params)
    cache.set(cache_key, json.dumps(data), ex=3600)  # Cache for 1 hour

def clear_weather_stats_cache(params):
    """Clear the cache for a specific set of parameters."""
    cache_key = generate_cache_key(params)
    cache.delete(cache_key)

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

def growing_season_weeks(df):
    if df.empty:
        return None
    df = df.sort_values(by='date')  # Ensure data is sorted by date
    df['above_zero'] = df['min_temperature'] > 0
    df['week'] = pd.to_datetime(df['date']).dt.isocalendar().week
    weekly_avg = df.groupby('week')['above_zero'].mean()
    return weekly_avg.max()

def growing_season_days(df):
    if df.empty:
        return None
    df = df.sort_values(by='date')  # Ensure data is sorted by date
    df['above_zero'] = df['min_temperature'] > 0
    return df['above_zero'].astype(int).groupby((df['above_zero'] != df['above_zero'].shift()).cumsum()).sum().max()

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

def annual_spring_precipitation(df):
    """Calculate the annual average precipitation during spring (March to May)."""
    spring_df = annual_spring(df)
    if spring_df.empty:
        return None
    return spring_df['precipitation'].sum()
def snow_annual_spring_precipitation(df):
    """Calculate the annual average snowfall during spring (March to May)."""
    snowfall_spring_df = annual_spring(df)
    if snowfall_spring_df.empty:
        return None
    return snowfall_spring_df[snowfall_spring_df['avg_temperature'] <= 0]['precipitation'].sum()
def rain_annual_spring_precipitation(df):
    """Calculate the annual average rainfall during spring (March to May)."""
    rainfall_spring_df = annual_spring(df)
    if rainfall_spring_df.empty:
        return None
    return rainfall_spring_df[rainfall_spring_df['avg_temperature'] > 0]['precipitation'].sum()
def annual_summer_precipitation(df):
    """Calculate the annual average precipitation during summer (June to August)."""
    summer_df = annual_summer(df)
    if summer_df.empty:
        return None
    return summer_df['precipitation'].sum()
def snow_annual_summer_precipitation(df):
    """Calculate the annual average snowfall during summer (June to August)."""
    snowfall_summer_df = annual_summer(df)
    if snowfall_summer_df.empty:
        return None
    return snowfall_summer_df[snowfall_summer_df['avg_temperature'] <= 0]['precipitation'].sum()
def rain_annual_summer_precipitation(df):
    """Calculate the annual average rainfall during summer (June to August)."""
    rainfall_summer_df = annual_summer(df)
    if rainfall_summer_df.empty:
        return None
    return rainfall_summer_df[rainfall_summer_df['avg_temperature'] > 0]['precipitation'].sum()
def annual_autumn_precipitation(df):
    """Calculate the annual average precipitation during autumn (September to November)."""
    autumn_df = annual_autumn(df)
    if autumn_df.empty:
        return None
    return autumn_df['precipitation'].sum()
def snow_annual_autumn_precipitation(df):
    """Calculate the annual average snowfall during autumn (September to November)."""
    snowfall_autumn_df = annual_autumn(df)
    if snowfall_autumn_df.empty:
        return None
    return snowfall_autumn_df[snowfall_autumn_df['precipitation'] > 0]['precipitation'].sum()
def rain_annual_autumn_precipitation(df):
    """Calculate the annual average rainfall during autumn (September to November)."""
    rainfall_autumn_df = annual_autumn(df)
    if rainfall_autumn_df.empty:
        return None
    return rainfall_autumn_df[rainfall_autumn_df['avg_temperature'] > 0]['precipitation'].sum()
def annual_winter_precipitation(df):
    """Calculate the annual average precipitation during winter (December to February)."""
    winter_df = annual_winter(df)
    if winter_df.empty:
        return None
    return winter_df['precipitation'].sum()
def snow_annual_winter_precipitation(df):
    """Calculate the annual average snowfall during winter (December to February)."""
    snowfall_winter_df = annual_winter(df)
    if snowfall_winter_df.empty:
        return None
    return snowfall_winter_df[snowfall_winter_df['avg_temperature'] <= 0]['precipitation'].sum()
def rain_annual_winter_precipitation(df):
    """Calculate the annual average rainfall during winter (December to February)."""
    rainfall_winter_df = annual_winter(df)
    if rainfall_winter_df.empty:
        return None
    return rainfall_winter_df[rainfall_winter_df['avg_temperature'] > 0]['precipitation'].sum()

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
    'growing_season_days': ['min_temperature'],
    'growing_season_weeks': ['min_temperature'],
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
    'co2_weekly': ['co2_weekly'],
    'snowdepth_meter': ['snowdepth_meter'],
    'period_snowdepth': ['snowdepth_single'],
    'snowdepth_single': ['snowdepth_single'],
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

def calculate_baseline_stats(weather_data, baseline_start, baseline_end, requested_stats):
    """Calculate baseline statistics from the resulting statistics over a baseline period."""
    baseline_data = weather_data[
        (weather_data['date'].dt.year >= baseline_start) &
        (weather_data['date'].dt.year <= baseline_end)
    ]

    baseline_stats = {}

    # Compute baseline values for each requested statistic
    for stat in requested_stats:
        for month in range(1, 13):
            month_name = calendar.month_abbr[month].lower()
            if stat == f'annual_{month_name}_precipitation':
                baseline_stats[f'annual_{month_name}_precipitation'] = annual_month_precipitation(baseline_data, month) / (baseline_end - baseline_start + 1)
                baseline_stats[f'snow_annual_{month_name}_precipitation'] = snow_annual_month_precipitation(baseline_data, month) / (baseline_end - baseline_start + 1)
                baseline_stats[f'rain_annual_{month_name}_precipitation'] = rain_annual_month_precipitation(baseline_data, month) / (baseline_end - baseline_start + 1)
            elif stat == f'annual_{month_name}_temperature':
                baseline_stats[f'annual_{month_name}_temperature'] = annual_month_temperature(baseline_data, month)
                baseline_stats[f'max_annual_{month_name}_temperature'] = max_annual_month_temperature(baseline_data, month)
                baseline_stats[f'min_annual_{month_name}_temperature'] = min_annual_month_temperature(baseline_data, month)
        if stat == 'growing_season_weeks':
            baseline_stats['growing_season_weeks'] = int(growing_season_weeks(baseline_data))
        elif stat == 'annual_temperature':
            baseline_stats['annual_temperature'] = annual_temperature(baseline_data)
        elif stat == 'global_temperature':
            baseline_stats['global_temperature'] = baseline_data['glob_temp'].mean()
        elif stat == 'northern_hemisphere_temperature':
            baseline_stats['northern_hemisphere_temperature'] = baseline_data['nhem_temp'].mean()
        elif stat == '64n90n_temperature':
            baseline_stats['64n90n_temperature'] = baseline_data['64n-90n_temp'].mean()
        elif stat == 'annual_spring_temperature':
            baseline_stats['annual_spring_temperature'] = annual_spring_temperature(baseline_data)
        elif stat == 'annual_summer_temperature':
            baseline_stats['annual_summer_temperature'] = annual_summer_temperature(baseline_data)
        elif stat == 'annual_autumn_temperature':
            baseline_stats['annual_autumn_temperature'] = annual_autumn_temperature(baseline_data)
        elif stat == 'annual_winter_temperature':
            baseline_stats['annual_winter_temperature'] = annual_winter_temperature(baseline_data)
        elif stat == 'annual_spring_precipitation':
            baseline_stats['annual_spring_precipitation'] = annual_spring_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
            baseline_stats['snow_annual_spring_precipitation'] = snow_annual_spring_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
            baseline_stats['rain_annual_spring_precipitation'] = rain_annual_spring_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
        elif stat == 'annual_summer_precipitation':
            baseline_stats['annual_summer_precipitation'] = annual_summer_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
            baseline_stats['snow_annual_summer_precipitation'] = snow_annual_summer_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
            baseline_stats['rain_annual_summer_precipitation'] = rain_annual_summer_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
        elif stat == 'annual_autumn_precipitation':
            baseline_stats['annual_autumn_precipitation'] = annual_autumn_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
            baseline_stats['snow_annual_autumn_precipitation'] = snow_annual_autumn_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
            baseline_stats['rain_annual_autumn_precipitation'] = rain_annual_autumn_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
        elif stat == 'annual_winter_precipitation':
            baseline_stats['annual_winter_precipitation'] = annual_winter_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
            baseline_stats['snow_annual_winter_precipitation'] = snow_annual_winter_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
            baseline_stats['rain_annual_winter_precipitation'] = rain_annual_winter_precipitation(baseline_data)/ (baseline_end - baseline_start + 1)
        elif stat == 'growing_season_days':
            baseline_stats['growing_season_days'] = int(growing_season_days(baseline_data))
        elif stat == 'coldest_day':
            baseline_stats['coldest_day'] = int(coldest_day(baseline_data))
        elif stat == 'warmest_day':
            baseline_stats['warmest_day'] = int(warmest_day(baseline_data))
        elif stat == 'coldest_month':
            baseline_stats['coldest_month'] = int(coldest_month(baseline_data))
        elif stat == 'warmest_month':
            baseline_stats['warmest_month'] = int(warmest_month(baseline_data))
        elif stat == 'coldest_week':
            baseline_stats['coldest_week'] = int(coldest_week(baseline_data))
        elif stat == 'warmest_week':
            baseline_stats['warmest_week'] = int(warmest_week(baseline_data))
        elif stat == 'annual_precipitation':
            baseline_stats['annual_precipitation'] = baseline_data['precipitation'].sum() / (baseline_end - baseline_start + 1)
            baseline_stats['snow_annual_precipitation'] = baseline_data[baseline_data['avg_temperature'] <= 0]['precipitation'].sum() / (baseline_end - baseline_start + 1)
            baseline_stats['rain_annual_precipitation'] = baseline_data[baseline_data['avg_temperature'] > 0]['precipitation'].sum() / (baseline_end - baseline_start + 1)
        elif stat == 'first_frost_autumn':
            baseline_stats['first_frost_autumn'] = first_frost_autumn(baseline_data)
        elif stat == 'last_frost_spring':
            baseline_stats['last_frost_spring'] = last_frost_spring(baseline_data, baseline_end)
        elif stat == 'annual_ice_time':
            baseline_stats['annual_ice_time'] = icetime_annual(baseline_data)
        elif stat == 'annual_freezeup':
            baseline_stats['annual_freezeup'] = annual_freezeup(baseline_data)
        elif stat == 'annual_breakup':
            baseline_stats['annual_breakup'] = annual_breakup(baseline_data)
        elif stat == 'annual_ice_thickness':
            baseline_stats['annual_ice_thickness'] = annual_ice_thickness(baseline_data)

    return baseline_stats

def calculate_difference_from_baseline(year_stats, baseline_stats):
    """Calculate the difference between the yearly statistics and the baseline statistics."""
    differences = {}

    for stat in year_stats:
        if stat in baseline_stats and isinstance(baseline_stats[stat], (int, float)):
            # For numeric values, calculate the difference
            differences['diff_' + stat] = year_stats[stat] - baseline_stats[stat]
        else:
            differences['diff_' + stat] = None  # Handle non-numeric or unavailable data

    return differences

@app.route('/', methods=['GET'])
def status():
    return jsonify({'status': 'ok'})

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

    # Parse baseline interval
    baseline_start, baseline_end = map(int, baseline.split(','))

        # Combine the request parameters into a dict for caching
    params = {
             'start_year': start_year,
             'end_year': end_year,
             'coordinates': coordinates,
             'requested_stats': requested_stats,
             'baseline': baseline,
             'radius': radius,
             'station': station
    }
    # Reset
    reset = request.args.get('reset')
    if reset is not None:
        if reset.lower() == 'true':
            clear_weather_stats_cache(params)
    # flush
    flush = request.args.get('flush')
    if flush is not None:
        if flush.lower() == 'true':
            cache.flushdb()

    # Check the cache for an existing result
    cached_result = get_weather_stats_cached(params)
    if cached_result:
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

    # Build the URL dynamically based on the required raw data types
    base_url = 'https://vischange.k8s.glimworks.se/data/query/v1'
    query_url = f"{base_url}?position={coordinates}&radius={radius}&date={start_year}0101-{end_year}1231&types={required_data_types}"

    # Debugging - Print the final URL to check its format
    print(f"Final URL: {query_url}")

    # Fetch the data from the given URL
    response = requests.get(query_url)
    if response.status_code != 200:
        print(f"Error fetching data: {response.status_code}, {response.text}")
        return jsonify({'error': 'Failed to fetch data from URL'}), 400

    # Assuming the data is in JSON format and contains the necessary raw data types
    try:
        data = response.json()
        if not data:  # Handle cases where no data is returned
            return jsonify({'error': 'No data available for the requested range.'}), 400

        weather_data = pd.DataFrame(data)
        weather_data['date'] = pd.to_datetime(weather_data['date'])

        # Filter out times that are not midnight (00:00:00)
        # TODO does this need to be here?
        # disabled for annomaly data in breakup 2022
        # weather_data = weather_data[weather_data['date'].dt.time == pd.Timestamp("00:00:00").time()]

        # Ensure necessary columns are in numeric format
        for data_type in required_data_types.split(','):
            if data_type in weather_data.columns:
                if data_type in DATA_TYPES_TO_TYPE:
                    if DATA_TYPES_TO_TYPE[data_type] == 'date':
                        weather_data[data_type] = pd.to_datetime(weather_data[data_type], errors='coerce')
                        weather_data[data_type] = weather_data[data_type].dt.dayofyear
                    weather_data[data_type] = pd.to_numeric(weather_data[data_type], errors='coerce')
    except Exception as e:
        return jsonify({'error': 'Failed to parse JSON data'}), 400

    # Calculate baseline statistics from the resulting statistics over the baseline period
    baseline_stats = calculate_baseline_stats(weather_data, baseline_start, baseline_end, requested_stats)
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
            year_stats['annual_spring_precipitation'] = annual_spring_precipitation(yearly_data)
            year_stats['snow_annual_spring_precipitation'] = snow_annual_spring_precipitation(yearly_data)
            year_stats['rain_annual_spring_precipitation'] = rain_annual_spring_precipitation(yearly_data)
        if 'annual_summer_precipitation' in requested_stats:
            year_stats['annual_summer_precipitation'] = annual_summer_precipitation(yearly_data)
            year_stats['snow_annual_summer_precipitation'] = snow_annual_summer_precipitation(yearly_data)
            year_stats['rain_annual_summer_precipitation'] = rain_annual_summer_precipitation(yearly_data)
        if 'annual_autumn_precipitation' in requested_stats:
            year_stats['annual_autumn_precipitation'] = annual_autumn_precipitation(yearly_data)
            year_stats['snow_annual_autumn_precipitation'] = snow_annual_autumn_precipitation(yearly_data)
            year_stats['rain_annual_autumn_precipitation'] = rain_annual_autumn_precipitation(yearly_data)
        if 'annual_winter_precipitation' in requested_stats:
            year_stats['annual_winter_precipitation'] = annual_winter_precipitation(yearly_data)
            year_stats['snow_annual_winter_precipitation'] = snow_annual_winter_precipitation(yearly_data)
            year_stats['rain_annual_winter_precipitation'] = rain_annual_winter_precipitation(yearly_data)
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
            year_stats['snow_annual_precipitation'] = yearly_data[yearly_data['avg_temperature'] <= 0]['precipitation'].sum()
            year_stats['rain_annual_precipitation'] = yearly_data[yearly_data['avg_temperature'] > 0]['precipitation'].sum()
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


        if weather_data['station'].nunique() == 1:
            year_stats['station'] = weather_data['station'].iloc[0]

        if year_stats:  # Only add stats if any calculations were made
            results[year] = year_stats
        # Calculate the difference from the baseline statistics
        differences = calculate_difference_from_baseline(year_stats, baseline_stats)
        year_stats.update(differences)

    # TODO built into single function

    # Calculate stats for decades
    decade_start = 1961
    decade_results = calculate_time_interval_stats(weather_data, decade_start, end_year, 10, requested_stats, 'period_snowdepth', period_month_snowdepth)

    # Calculate stats for periods (e.g., 30-year intervals)
    period_start = 1931
    period_results = calculate_time_interval_stats(weather_data, period_start, end_year, 30, requested_stats, 'period_snowdepth', period_month_snowdepth)
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
        'decades': {decade: {k: convert_np_types(v) for k, v in stats.items()} for decade, stats in decade_results.items()},
        'periods': {period: {k: convert_np_types(v) for k, v in stats.items()} for period, stats in period_results.items()}
    }

    # Cache the result
    set_weather_stats_cache(params, results)
    return jsonify(results)

@app.route('/station', methods=['GET'])
def station_stats():
    year = request.args.get('year')
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    # Validate the parameters
    if not year or not lat or not lng:
        return jsonify({"error": "Missing 'year', 'lat', or 'lng' parameter"}), 400

    coordinates = (float(lat), float(lng))

    # List of all possible data types to check for
    data_types = ['avg_temperature', 'precipitation', 'min_temperature', 'max_temperature', 'snowdepth_meter', 'co2_weekly', 'freezeup', 'breakup', 'perma', 'icetime']

    # Get available statistics for the station at the provided coordinates
    station_stats = stations.get_weather_stats_for_station(coordinates, year, data_types)

    return jsonify(station_stats)

if __name__ == '__main__':
    app.run(debug=False)
