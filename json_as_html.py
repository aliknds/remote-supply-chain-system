import json
from collections import defaultdict

# Open the file and read its content
with open('output_file_by_markets.json', 'r') as f:
    json_string = f.read()

# Load the JSON
decoded_json = json.loads(json_string)

# Transform the data
nested_data = defaultdict(list)
for item in decoded_json:
    market = item["Market"]
    branch = item["Branch"]
    nested_data[market].append(branch)

# Start the HTML output
html_output = '<html>\n<body>\n<table border="1">\n'

# Create a row for each market and its branches
for market, branches in nested_data.items():
    html_output += '<tr>\n'
    html_output += '<td>{}</td>\n'.format(market)
    html_output += '<td>\n<ul>\n'

    # Create a list item for each branch
    for branch in branches:
        html_output += '<li>{}</li>\n'.format(branch)

    html_output += '</ul>\n</td>\n</tr>\n'

# Finish the HTML output
html_output += '</table>\n</body>\n</html>'

# Write the HTML to a file
with open('json_table.html', 'w', encoding='utf-8') as f:
    f.write(html_output)
