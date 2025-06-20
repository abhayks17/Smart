import os
import sys
import pandas as pd
import numpy as np
from datetime import datetime
import json
from sklearn.linear_model import LinearRegression
import warnings

# Suppress sklearn warnings
warnings.filterwarnings("ignore", category=UserWarning)

# Debug to stderr
print("Current working directory:", os.getcwd(), file=sys.stderr)
csv_path = '/home/abhay/smart-home/server/Scripts/lighting_times.csv'
try:
    df = pd.read_csv(csv_path, parse_dates=['date'])
    print("CSV loaded successfully. First few rows:", file=sys.stderr)
    print(df.head(), file=sys.stderr)
except FileNotFoundError:
    print(f"Error: {csv_path} not found", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"Error loading CSV: {e}", file=sys.stderr)
    sys.exit(1)

def time_to_minutes(t):
    try:
        dt = datetime.strptime(t, '%I:%M %p')
        return dt.hour * 60 + dt.minute
    except ValueError as e:
        print(f"Error parsing time {t}: {e}", file=sys.stderr)
        raise

try:
    df['on_minutes'] = df['on_time'].apply(time_to_minutes)
    df['off_minutes'] = df['off_time'].apply(time_to_minutes)
except Exception as e:
    print(f"Error converting times: {e}", file=sys.stderr)
    sys.exit(1)

df['day_of_year'] = df['date'].dt.dayofyear
df['sin_day'] = np.sin(2 * np.pi * df['day_of_year'] / 365)
df['cos_day'] = np.cos(2 * np.pi * df['day_of_year'] / 365)

X = df[['sin_day', 'cos_day']]

model_on = LinearRegression().fit(X, df['on_minutes'])
model_off = LinearRegression().fit(X, df['off_minutes'])

def predict_lighting_times(date_str):
    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
    day = date_obj.timetuple().tm_yday
    sin_day = np.sin(2 * np.pi * day / 365)
    cos_day = np.cos(2 * np.pi * day / 365)
    X_pred = pd.DataFrame([[sin_day, cos_day]], columns=['sin_day', 'cos_day'])

    pred_on = model_on.predict(X_pred)[0]
    pred_off = model_off.predict(X_pred)[0]

    def minutes_to_time(m):
        h = int(m // 60)
        mm = int(m % 60)
        suffix = 'AM'
        if h == 0:
            h = 12
        elif h >= 12:
            suffix = 'PM'
            if h > 12:
                h -= 12
        return f"{h}:{mm:02d} {suffix}"

    return {
        "onTime": minutes_to_time(pred_on),
        "offTime": minutes_to_time(pred_off)
    }

if __name__ == "__main__":
    today_str = datetime.now().strftime('%Y-%m-%d')
    try:
        result = predict_lighting_times(today_str)
        print(json.dumps(result, indent=2), flush=True)
    except Exception as e:
        print(f"Error in prediction: {e}", file=sys.stderr)
        sys.exit(1)