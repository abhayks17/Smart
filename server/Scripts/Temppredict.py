import sys
import pandas as pd
import json

def predict_temperatures(input_temp):
    try:
        # Load dataset
        df = pd.read_csv('/home/abhay/smart-home/server/Scripts/temp_dataset.csv')

        # Rename 'weather_temp' to 'atmos_temp' if necessary
        if 'weather_temp' in df.columns:
            df = df.rename(columns={'weather_temp': 'atmos_temp'})

        # Ensure the required columns are present
        if not {'atmos_temp', 'eco_temp', 'comfort_temp'}.issubset(df.columns):
            return {"error": "CSV file must have 'atmos_temp', 'eco_temp', and 'comfort_temp' columns."}

        # Convert input to float
        input_temp = float(input_temp)

        # Find the closest matching row
        closest_row = df.iloc[(df['atmos_temp'] - input_temp).abs().argsort()[:1]]

        eco = float(closest_row['eco_temp'].values[0])
        comfort = float(closest_row['comfort_temp'].values[0])

        return {"eco": eco, "comfort": comfort}
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing temperature input"}))
        sys.exit(1)

    temp_input = sys.argv[1]
    result = predict_temperatures(temp_input)
    print(json.dumps(result))
