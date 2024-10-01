from flask import Flask, request, jsonify
import requests
import pandas as pd
import numpy as np

app = Flask(__name__)

# Helper functions to calculate the frost and temperature statistics
def first_frost_autumn(df):
    """Find the first frost in autumn (from September onwards)."""
    autumn_df = df[df['date'].dt.month >= 9]  # Filter dates from September onwards
    frosts = autumn_df[autumn_df['avg_temperature'] <= 0]
    if not frosts.empty:
        return int(frosts.iloc[0]['date'].dayofyear)
    return None

def last_frost_spring(df, year):
    """Find the last frost in spring (up until March of the next year)."""
    spring_df = df[(df['date'].dt.year == year) & (df['date'].dt.month <= 3)]  # Filter January to March of the following year
    frosts = spring_df[spring_df['avg_temperature'] <= 0]
    if not frosts.empty:
        return int(frosts.iloc[-1]['date'].dayofyear)
    return None

def growing_season_weeks(df):
    df = df.sort_values(by='date')  # Ensure data is sorted by date
    df['above_zero'] = df['avg_temperature'] > 0
    df['week'] = pd.to_datetime(df['date']).dt.isocalendar().week
    weekly_avg = df.groupby('week')['above_zero'].mean()
    return weekly_avg.max()

def growing_season_days(df):
    df = df.sort_values(by='date')  # Ensure data is sorted by date
    df['above_zero'] = df['avg_temperature'] > 0
    return df['above_zero'].astype(int).groupby((df['above_zero'] != df['above_zero'].shift()).cumsum()).sum().max()

def warmest(df, period):
    return df.groupby(df['date'].dt.to_period(period))['avg_temperature'].mean().idxmax()

def coldest(df, period):
    return df.groupby(df['date'].dt.to_period(period))['avg_temperature'].mean().idxmin()

def warmest_day(df):
    return df.groupby(df['date'].dt.isocalendar().day)['avg_temperature'].mean().idxmax()
def coldest_day(df):
    return df.groupby(df['date'].dt.isocalendar().day)['avg_temperature'].mean().idxmin()

# New helper functions to calculate coldest/warmest months and weeks
def coldest_month(df):
    return df.groupby(df['date'].dt.month)['avg_temperature'].mean().idxmin()

def warmest_month(df):
    return df.groupby(df['date'].dt.month)['avg_temperature'].mean().idxmax()

def coldest_week(df):
    return df.groupby(df['date'].dt.isocalendar().week)['avg_temperature'].mean().idxmin()

def warmest_week(df):
    return df.groupby(df['date'].dt.isocalendar().week)['avg_temperature'].mean().idxmax()

# SMHI definition of seasons
def find_spring(df):
    """Find the spring period based on SMHI's rules: 7 consecutive days with avg temp between 0°C and 10°C."""
    df = df.sort_values(by='date')  # Ensure data is sorted by date
    df['is_spring'] = df['avg_temperature'].between(0.0, 10.0)
    df['spring_period'] = df['is_spring'].rolling(window=7).sum() >= 7
    spring_start = df[df['spring_period']].iloc[0]['date'] if df['spring_period'].any() else None
    return spring_start

def filter_spring_data(df):
    """Filter data for spring season using SMHI's definition."""
    spring_start = find_spring(df)
    if spring_start is not None:
        # Filter out data from the start of spring onwards
        spring_df = df[df['date'] >= spring_start]
        spring_df = spring_df[spring_df['avg_temperature'].between(0.0, 10.0)]
        return spring_df
    return pd.DataFrame()  # Return empty DataFrame if no spring is found

# Map statistic types to required raw data types based on the available database types
STATISTICS_TO_DATA_TYPES = {
    'first_frost_autumn': ['avg_temperature'],
    'last_frost_spring': ['avg_temperature'],
    'growing_season_days': ['avg_temperature'],
    'growing_season_weeks': ['avg_temperature'],
    'coldest_day': ['min_temperature'],
    'warmest_day': ['max_temperature'],
    'coldest_month': ['avg_temperature'],
    'warmest_month': ['avg_temperature'],
    'coldest_week': ['avg_temperature'],
    'warmest_week': ['avg_temperature'],
    'snow_sum': ['avg_temperature', 'precipitation'],
    'rain_sum': ['avg_temperature', 'precipitation'],
    'precipitation': ['precipitation'],  # Total precipitation for the year
    'freezeup': ['freezeup'],
    'breakup': ['breakup'],
    'co2_weekly': ['co2_weekly'],
    'snowdepth_meter': ['snowdepth_meter'],
    'snowdepth_single': ['snowdepth_single'],
    'complete_ice_cover': ['complete_ice_cover'],
    'glob_temp': ['glob_temp'],
    'nhem_temp': ['nhem_temp'],
    'icetime': ['icetime']
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
        if stat == 'growing_season_weeks':
            baseline_stats['growing_season_weeks'] = int(growing_season_weeks(baseline_data))
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
        elif stat == 'snow_sum':
            baseline_stats['snow_sum'] = baseline_data[baseline_data['avg_temperature'] <= 0]['precipitation'].sum() / (baseline_end - baseline_start + 1)
        elif stat == 'rain_sum':
            baseline_stats['rain_sum'] = baseline_data[baseline_data['avg_temperature'] > 0]['precipitation'].sum() / (baseline_end - baseline_start + 1)
        elif stat == 'precipitation':
            baseline_stats['precipitation'] = baseline_data['precipitation'].sum() / (baseline_end - baseline_start + 1)
        elif stat == 'first_frost_autumn':
            baseline_stats['first_frost_autumn'] = first_frost_autumn(baseline_data)
        elif stat == 'last_frost_spring':
            baseline_stats['last_frost_spring'] = last_frost_spring(baseline_data, baseline_end)

    return baseline_stats

def calculate_difference_from_baseline(year_stats, baseline_stats):
    """Calculate the difference between the yearly statistics and the baseline statistics."""
    differences = {}

    for stat in year_stats:
        if stat in baseline_stats and isinstance(baseline_stats[stat], (int, float)):
            # For numeric values, calculate the difference
            differences[stat + '_difference'] = year_stats[stat] - baseline_stats[stat]
        else:
            differences[stat + '_difference'] = None  # Handle non-numeric or unavailable data

    return differences

@app.route('/weather_stats', methods=['GET'])
def weather_stats():
    # Retrieve the query parameters for year range, coordinates, and filtering options
    start_year = request.args.get('start_year')
    end_year = request.args.get('end_year')
    coordinates = request.args.get('coordinates')  # Coordinates in the format "lat,lng"
    requested_stats = request.args.getlist('types')  # List of requested statistics (e.g., coldest_day, growing_season_days)
    baseline = request.args.get('baseline', '1961,1990')  # Default to 1961-1990 baseline

    # Parse baseline interval
    baseline_start, baseline_end = map(int, baseline.split(','))

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
    query_url = f"{base_url}?position={coordinates}&radius=30&date={start_year}0101-{end_year}1231&types={required_data_types}"

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
        # Convert the JSON data into a DataFrame
        weather_data = pd.DataFrame(data)
        weather_data['date'] = pd.to_datetime(weather_data['date'])

        # Filter out times that are not midnight (00:00:00)
        weather_data = weather_data[weather_data['date'].dt.time == pd.Timestamp("00:00:00").time()]

        # Ensure necessary columns are in numeric format
        for data_type in required_data_types.split(','):
            if data_type in weather_data.columns:
                weather_data[data_type] = pd.to_numeric(weather_data[data_type], errors='coerce')

    except Exception as e:
        return jsonify({'error': 'Failed to parse JSON data'}), 400

    # Calculate baseline statistics from the resulting statistics over the baseline period
    baseline_stats = calculate_baseline_stats(weather_data, baseline_start, baseline_end, requested_stats)

    # Perform necessary calculations based on the requested statistics
    results = {}
    for year in range(int(start_year), int(end_year)):
        # Filter data for the current year
        yearly_data = weather_data[weather_data['date'].dt.year == year]
        if yearly_data.empty:
            continue

        year_stats = {}

        # Compute requested statistics
        if 'first_frost_autumn' in requested_stats:
            year_stats['first_frost_autumn'] = int(first_frost_autumn(yearly_data))

        if 'last_frost_spring' in requested_stats:
            last_frost = last_frost_spring(yearly_data, year)
            year_stats['last_frost_spring'] = int(last_frost) if last_frost else None

        if 'growing_season_weeks' in requested_stats:
            year_stats['growing_season_weeks'] = int(growing_season_weeks(yearly_data)) if not pd.isna(growing_season_weeks(yearly_data)) else None

        if 'growing_season_days' in requested_stats:
            year_stats['growing_season_days'] = int(growing_season_days(yearly_data)) if not pd.isna(growing_season_days(yearly_data)) else None

        if 'coldest_day' in requested_stats:
            year_stats['coldest_day'] = int(coldest_day(yearly_data))

        if 'warmest_day' in requested_stats:
            year_stats['warmest_day'] = int(warmest_day(yearly_data))

        if 'coldest_month' in requested_stats:
            year_stats['coldest_month'] = coldest_month(yearly_data)  # Return abbreviation

        if 'warmest_month' in requested_stats:
            year_stats['warmest_month'] = warmest_month(yearly_data)  # Return abbreviation

        if 'coldest_week' in requested_stats:
            year_stats['coldest_week'] = int(coldest_week(yearly_data))

        if 'warmest_week' in requested_stats:
            year_stats['warmest_week'] = int(warmest_week(yearly_data))

        if 'snow_sum' in requested_stats:
            year_stats['snow_sum'] = yearly_data[yearly_data['avg_temperature'] <= 0]['precipitation'].sum()

        if 'rain_sum' in requested_stats:
            year_stats['rain_sum'] = yearly_data[yearly_data['avg_temperature'] > 0]['precipitation'].sum()

        if 'precipitation' in requested_stats:
            # Total precipitation for the filtered month (if applicable) or year
            year_stats['precipitation'] = yearly_data['precipitation'].sum()

        if year_stats:  # Only add stats if any calculations were made
            results[year] = year_stats

        # Calculate the difference from the baseline statistics
        differences = calculate_difference_from_baseline(year_stats, baseline_stats)
        year_stats.update(differences)

    # Convert all numpy types (int64, float64) in the results to native Python types before returning JSON
    def convert_np_types(obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, pd.Timestamp):
            return str(obj)
        else:
            return obj

    results = {year: {k: convert_np_types(v) for k, v in stats.items()} for year, stats in results.items()}

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
