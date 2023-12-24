import pandas as pd
import json

# transform it into json
df = pd.read_csv('GSPC.csv')
# rename columns
df = df.rename(columns={'Date': 'date', 'Open': 'open', 'High': 'high', 'Low': 'low', 'Close': 'close', 'Adj Close': 'adjClose', 'Volume': 'volume'})
df = df.to_dict(orient='records')
# save json string to file
with open('GSPC.json', 'w') as f:
    json.dump(df, f)