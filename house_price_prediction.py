import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
import joblib
import json
import os
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

def save_model(model, model_dir='saved_models'):
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    model_name = f'house_price_model_{timestamp}'
    

    model_path = os.path.join(model_dir, f'{model_name}.joblib')
    joblib.dump(model, model_path)
 
    metadata = {
        'timestamp': timestamp,
        'model_type': 'RandomForestRegressor',
        'features': ['property_type', 'location', 'city', 'province_name', 
                    'latitude', 'longitude', 'baths', 'bedrooms', 'Area Size'],
        'model_params': model.named_steps['regressor'].get_params()
    }
    
    metadata_path = os.path.join(model_dir, f'{model_name}_metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=4)
    
    print(f"Model saved as: {model_path}")
    print(f"Metadata saved as: {metadata_path}")
    return model_path

def load_latest_model(model_dir='saved_models'):
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
    print(f"Loaded model from: {model_path}")
 
    metadata_path = model_path.replace('.joblib', '_metadata.json')
    if os.path.exists(metadata_path):
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        print("\nModel Metadata:")
        print(f"Training Date: {metadata['timestamp']}")
        print(f"Model Type: {metadata['model_type']}")
        print(f"Features: {metadata['features']}")
    
    return model

def load_and_preprocess_data(file_path):
    df = pd.read_csv(file_path)
    
    features = ['property_type', 'location', 'city', 'province_name', 
                'latitude', 'longitude', 'baths', 'bedrooms', 'Area Size']
    target = 'price'
    
 
    df = df.dropna(subset=features + [target])
    
    
    df['Area Size'] = pd.to_numeric(df['Area Size'], errors='coerce')
    
    return df[features], df[target]

def create_preprocessing_pipeline():

    categorical_features = ['property_type', 'location', 'city', 'province_name']
    numerical_features = ['latitude', 'longitude', 'baths', 'bedrooms', 'Area Size']
    
   
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])
    
    return preprocessor

def train_model(X, y, n_estimators=200, max_depth=None, min_samples_split=2):
   
    preprocessor = create_preprocessing_pipeline()
    
  
    model = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=min_samples_split,
            n_jobs=-1,  
            random_state=42,
            verbose=1  
        ))
    ])
    
 
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
  
    print(f"Training model with {n_estimators} trees...")
    model.fit(X_train, y_train)
    
 
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    print(f"Training R² score: {train_score:.3f}")
    print(f"Testing R² score: {test_score:.3f}")
    
   
    model_path = save_model(model)
    
    return model

def get_user_input():
    print("\nEnter property details:")
    property_type = input("Property Type (House/FarmHouse/Upper Portion/Lower Portion/Flat/Room): ")
    location = input("Location: ")
    city = input("City (Lahore/Karachi/Faisalabad/Rawalpindi/Islamabad): ")
    province = input("Province: ")
    latitude = float(input("Latitude: "))
    longitude = float(input("Longitude: "))
    baths = int(input("Number of Bathrooms: "))
    bedrooms = int(input("Number of Bedrooms: "))
    area_size = float(input("Area Size (in Marla): "))
    
    return pd.DataFrame({
        'property_type': [property_type],
        'location': [location],
        'city': [city],
        'province_name': [province],
        'latitude': [latitude],
        'longitude': [longitude],
        'baths': [baths],
        'bedrooms': [bedrooms],
        'Area Size': [area_size]
    })

def main():
   
    try:
        print("Attempting to load existing model...")
        model = load_latest_model()
        print("Using existing model for predictions.")
    except FileNotFoundError:
        print("No existing model found. Training new model...")
     
        print("Loading and preprocessing data...")
        X, y = load_and_preprocess_data("zameen-updated.csv")
       
        print("\nModel Training Parameters:")
        n_estimators = int(input("Number of trees (recommended: 100-500): ") or "200")
        max_depth = input("Maximum tree depth (press Enter for default): ") or None
        if max_depth:
            max_depth = int(max_depth)
        
    
        model = train_model(X, y, n_estimators=n_estimators, max_depth=max_depth)
    
    
    while True:
        try:
           
            user_input = get_user_input()
            
           
            prediction = model.predict(user_input)[0]
            print(f"\nPredicted Price: {prediction:,.2f} PKR")
            
            
            another = input("\nMake another prediction? (yes/no): ").lower()
            if another != 'yes':
                break
                
        except Exception as e:
            print(f"Error: {str(e)}")
            print("Please try again with valid inputs.")

if __name__ == "__main__":
    main() 