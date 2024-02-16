import json

input_json_path = 'svenska-ord-len5.json'

with open(input_json_path, 'r', encoding='utf-8') as input_file:
    data = json.load(input_file)

