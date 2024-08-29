import requests
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# GovInfo API Key (replace with your actual API key)
GOVINFO_API_KEY = 'zxPFk4hKjcXrG3q1RNSof4uKWBejl2K1YEvB9DLp'

# Function to fetch available tax policies (for dropdown)
@app.route('/api/policies', methods=['GET'])
def get_policies():
    # Example of fetching proposed policies from the GovInfo API
    response = requests.get(f"https://api.govinfo.gov/collections/BILLS?api_key={GOVINFO_API_KEY}&pageSize=10&offset=0")
    data = response.json()

    # Assuming the API returns a list of results
    if 'results' in data:
        policies = [{"id": bill['bill_id'], "title": bill['title']} for bill in data['results']]
    else:
        policies = []

    return jsonify(policies)

if __name__ == '__main__':
    app.run(debug=True)