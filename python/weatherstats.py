import pandas as pd
import numpy as np
import calendar
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

def calculate_period(df, period_function, stats_function, column='avg_temperature'):
    """
    Generalized function to calculate statistics for a specific period.

    Parameters:
    - df: DataFrame with temperature data.
    - period_function: Function to filter the DataFrame to the desired period (e.g., annual_spring).
    - stats_function: Function to calculate the desired statistic (e.g., max, min, mean).
    - column: Column on which to apply the statistics (default is 'avg_temperature').

    Returns:
    - The calculated statistic or None if the DataFrame is empty.
    """
    df = period_function(df)
    if df.empty:
        return None
    return stats_function(df[column])

# Generalized functions for mean, max, min calculations
def mean_temperature(df, period_func):
    return calculate_period(df, period_func, lambda x: x.mean())

def max_temperature(df, period_func):
    return calculate_period(df, period_func, lambda x: x.max())

def min_temperature(df, period_func):
    return calculate_period(df, period_func, lambda x: x.min())

def annual_spring(df):
    """Filter data for spring (March to May)."""
    if df.empty:
        return df  # Return as-is if DataFrame is empty
    return df[(df['date'].dt.month >= 3) & (df['date'].dt.month <= 5)]

def annual_summer(df):
    """Filter data for summer (June to August)."""
    if df.empty:
        return df
    return df[(df['date'].dt.month >= 6) & (df['date'].dt.month <= 8)]

def annual_autumn(df):
    """Filter data for autumn (September to November)."""
    if df.empty:
        return df
    return df[(df['date'].dt.month >= 9) & (df['date'].dt.month <= 11)]

def annual_winter(df):
    """Filter data for winter (December to February)."""
    if df.empty:
        return df
    return df[(df['date'].dt.month >= 12) | (df['date'].dt.month <= 2)]

def annual_month(df, month):
    """Filter data for the specified month."""
    if df.empty:
        return df
    return df[df['date'].dt.month == month].copy()

# Seasonal functions using the generalized calculate_period
def annual_spring_temperature(df):
    return mean_temperature(df, annual_spring)

def max_annual_spring_temperature(df):
    return max_temperature(df, annual_spring)

def min_annual_spring_temperature(df):
    return min_temperature(df, annual_spring)

def annual_summer_temperature(df):
    return mean_temperature(df, annual_summer)

def max_annual_summer_temperature(df):
    return max_temperature(df, annual_summer)

def min_annual_summer_temperature(df):
    return min_temperature(df, annual_summer)

def annual_autumn_temperature(df):
    return mean_temperature(df, annual_autumn)

def max_annual_autumn_temperature(df):
    return max_temperature(df, annual_autumn)

def min_annual_autumn_temperature(df):
    return min_temperature(df, annual_autumn)

def annual_winter_temperature(df):
    return mean_temperature(df, annual_winter)

def max_annual_winter_temperature(df):
    return max_temperature(df, annual_winter)

def min_annual_winter_temperature(df):
    return min_temperature(df, annual_winter)

# Month-based calculations using the generalized approach
def annual_month_temperature(df, month):
    return calculate_period(df, lambda df: annual_month(df, month), lambda x: x.mean())

def max_annual_month_temperature(df, month):
    return calculate_period(df, lambda df: annual_month(df, month), lambda x: x.max())

def min_annual_month_temperature(df, month):
    return calculate_period(df, lambda df: annual_month(df, month), lambda x: x.min())

def annual_month_precipitation(df, month):
    return calculate_period(df, lambda df: annual_month(df, month), lambda x: x.sum(), column='precipitation')

def rain_annual_month_precipitation(df, month):
    return calculate_period(
        df,
        lambda df: annual_month(df, month),
        lambda x: x.sum(),
        column='precipitation'
    )[df['avg_temperature'] > 0]

def snow_annual_month_precipitation(df, month):
    return calculate_period(
        df,
        lambda df: annual_month(df, month),
        lambda x: x.sum(),
        column='precipitation'
    )[df['avg_temperature'] <= 0]

# Generalized function for calculating annual temperature statistics
def calculate_annual_stat(df, stat_func):
    """
    Generalized function to calculate an annual statistic using a given function.

    Parameters:
    - df: DataFrame with temperature data.
    - stat_func: Function to calculate a statistic (e.g., max, min).

    Returns:
    - The calculated statistic or None if the DataFrame is empty.
    """
    if df.empty:
        return None
    return stat_func(df.groupby(df['date'].dt.year)['avg_temperature'])

def annual_temperature(df):
    return df['avg_temperature'].mean() if not df.empty else None

def max_annual_temperature(df):
    return calculate_annual_stat(df, lambda x: x.max().mean())

def min_annual_temperature(df):
    return calculate_annual_stat(df, lambda x: x.min().mean())

# Generalized function for finding warmest/coldest periods
def find_extreme_period(df, period_func, stat_func):
    """
    Generalized function to find the period (e.g., month, day, week) with the max/min average temperature.

    Parameters:
    - df: DataFrame with temperature data.
    - period_func: Function to extract the period for grouping (e.g., month, week).
    - stat_func: Function to calculate a statistic (e.g., idxmax, idxmin).

    Returns:
    - The period with the extreme value or None if the DataFrame is empty.
    """
    if df.empty:
        return None
    return df.groupby(period_func(df))['avg_temperature'].mean().agg(stat_func)

def warmest(df, period):
    return find_extreme_period(df, lambda df: df['date'].dt.to_period(period), 'idxmax')

def coldest(df, period):
    return find_extreme_period(df, lambda df: df['date'].dt.to_period(period), 'idxmin')

def warmest_day(df):
    return find_extreme_period(df, lambda df: df['date'].dt.isocalendar().day, 'idxmax')

def coldest_day(df):
    return find_extreme_period(df, lambda df: df['date'].dt.isocalendar().day, 'idxmin')

def warmest_month(df):
    return find_extreme_period(df, lambda df: df['date'].dt.month, 'idxmax')

def coldest_month(df):
    return find_extreme_period(df, lambda df: df['date'].dt.month, 'idxmin')

def warmest_week(df):
    return find_extreme_period(df, lambda df: df['date'].dt.isocalendar().week, 'idxmax')

def coldest_week(df):
    return find_extreme_period(df, lambda df: df['date'].dt.isocalendar().week, 'idxmin')

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
def calculate_baseline(weather_stats, baseline):
    baseline_stats = pd.DataFrame(weather_stats)
    baseline = baseline.split(',')
    # drop if existing name in row
    if 'station' in baseline_stats.index:
        baseline_stats = baseline_stats.drop(['station'])
    baseline_start = int(baseline[0])
    baseline_end = int(baseline[1])
    baseline_stats = baseline_stats.loc[:, [col for col in baseline_stats.columns if baseline_start <= int(col) <= baseline_end]]
    return baseline_stats.mean(axis=1)
def weather_yearly(weather_data, start_year, end_year, requested_stats, baseline):
    """Calculate yearly weather statistics for a given range of years."""
    # result now dataframe
    # Initialize the results dictionary

    # TODO make it more readable by implementing dataframe groupby function
    #weather_data['year'] = weather_data['date'].dt.year
    #weather_group_year = weather_data.groupby('year')
    #yearly_stats = None
    #if 'annual_temperature' in requested_stats:
    #    yearly_stats = weather_group_year.agg({'avg_temperature': [annual_temperature, max_annual_temperature, min_annual_temperature]})

    results = {}
    for year in range(int(start_year), int(end_year)):
        # Filter data for the current year
        yearly_data = weather_data[weather_data['date'].dt.year == year]
        if 'date' in weather_data.columns and pd.api.types.is_datetime64_any_dtype(weather_data['date']):
            yearly_data = weather_data[weather_data['date'].dt.year == year]
        else:
            results[year] = {'error': 'No valid date data available.'}
            continue
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

        # Calculate the differences
    results = pd.DataFrame(results)
    if 'error' in results.index:
        results = results.drop(index=['error'])
    baseline_stats = calculate_baseline(results, baseline)
    results = calculate_difference_from_baseline(results, baseline_stats)
    return results, baseline_stats

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

def calculate_difference_from_baseline(stats, baseline_stats):
    """Calculate the difference between the yearly statistics and the baseline statistics."""
    if 'station' in stats.index:
        stats = stats.drop(index=['station'])
    # take difference in axis=0 beteween stats and baseline_stats
    differences = stats.sub(baseline_stats, axis=0)
    # rename row names on difference to diff_row_name
    differences = differences.rename(index=lambda x: 'diff_' + x)
    # stack stats and difference
    stats = pd.concat([stats, differences])
    return stats