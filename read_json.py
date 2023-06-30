import json
from collections import defaultdict

# Open the file and read its content
with open('markets.json', 'r') as f:
    json_string = f.read()

# Load the JSON
decoded_json = json.loads(json_string)

# Transform the data
nested_data = defaultdict(list)
for item in decoded_json:
    market = item["Market"]
    branch = item["Branch"]
    nested_data[market].append(branch)

# Write the nested data back to another file, with UTF-8 encoding
with open('output_file_by_markets.json', 'w', encoding='utf-8') as f:
    json.dump(nested_data, f, ensure_ascii=False, indent=4)
