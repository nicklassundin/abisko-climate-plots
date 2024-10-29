import pandas as pd
import numpy as np
from datetime import datetime

def generate_random_weather_data(start_year, end_year):
    """Generate random weather data for each day between the start and end year."""

    # Define the date range
    dates = pd.date_range(start=f"{start_year}-01-01", end=f"{end_year}-12-31")

    # Generate random data
    data = {
        "date": dates,
        "avg_temperature": np.random.uniform(-30, 35, size=len(dates)),  # Temperature range
        "min_temperature": np.random.uniform(-40, 20, size=len(dates)),
        "max_temperature": np.random.uniform(0, 40, size=len(dates)),
        "precipitation": np.random.uniform(0, 100, size=len(dates)),     # Precipitation range in mm
        "snowdepth_single": np.random.uniform(0, 50, size=len(dates)),    # Snow depth in cm
        "snowdepth_meter": np.random.uniform(0, 1, size=len(dates)),      # Snow depth in meters
        "co2_weekly": np.random.uniform(300, 420, size=len(dates)),       # CO2 levels in ppm
        "freezeup": np.random.randint(1, 365, size=len(dates)),           # Freeze-up day of the year
        "breakup": np.random.randint(1, 365, size=len(dates)),            # Break-up day of the year
        "perma": np.random.choice([0, 1], size=len(dates)),               # Binary permafrost indicator
        "icetime": np.random.uniform(0, 100),                             # Ice time (arbitrary units)
        "complete_ice_cover": np.random.uniform(0, 2, size=len(dates)),    # Ice thickness in meters
        "station": np.random.choice(["Helsinki", "Stockholm", "Oslo", "Copenhagen", "Reykjavik"], size=len(dates))
    }

    # Convert to DataFrame
    random_data_df = pd.DataFrame(data)
    dataset_to_drop = np.random.choice(list(data.keys() - {"date"}))
    random_data_df = random_data_df.drop(columns=[dataset_to_drop])

    return random_data_df
