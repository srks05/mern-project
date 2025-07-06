from flask import Flask, render_template, request, jsonify
import pandas as pd
import joblib
import json
import os
from datetime import datetime
from flask_cors import cross_origin

app = Flask(__name__)

def load_latest_model(model_dir='saved_model'):
    """
    Load the most recently saved model
    """
    if not os.path.exists(model_dir):
        raise FileNotFoundError(f"No saved models found in {model_dir}")
    

    model_files = [f for f in os.listdir(model_dir) if f.endswith('.joblib')]
    if not model_files:
        raise FileNotFoundError("No saved models found")
    
 
    latest_model = sorted(model_files)[-1]
    model_path = os.path.join(model_dir, latest_model)
    
    model = joblib.load(model_path)
    
    metadata_path = model_path.replace('.joblib', '_metadata.json')
    metadata = {}
    if os.path.exists(metadata_path):
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
    
    return model, metadata


try:
    model, metadata = load_latest_model()
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None
    metadata = {}

@app.route('/')
def home():
    return render_template('index.html', metadata=metadata)

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    try:
        data=request.get_json()
        # Get data from form
        data1 = {
            'property_type': data['property_type'],
            'location': data['location'],
            'city': data['city'],
            'province_name': data['province'],
            'latitude': float(data['latitude']),
            'longitude': float(data['longitude']),
            'baths': int(data['baths']),
            'bedrooms': int(data['bedrooms']),
            'Area Size': float(data['area_size'])
        }

       
        input_df = pd.DataFrame([data1])
        
        
        prediction = model.predict(input_df)[0]
        print(prediction)

        return jsonify({
            'success': True,
            'prediction': f"{prediction:,.2f} PKR"
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(debug=True) 