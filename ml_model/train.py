import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def train_models():
    # Load dataset
    print("Loading dataset...")
    df = pd.read_csv('ml_model/banana_leaf_dataset.csv')
    
    # Feature columns and target
    features = ['LeafLength(cm)', 'LeafWidth(cm)', 'ColorIntensity', 'SpotsPresent', 
                'MoistureLevel(%)', 'Texture', 'Humidity(%)', 'Temperature(°C)', 'SoilType']
    target = 'DiseaseLabel'
    
    # Encode categorical variables
    print("Encoding categorical variables...")
    le_color = LabelEncoder()
    df['ColorIntensity'] = le_color.fit_transform(df['ColorIntensity'])
    
    le_texture = LabelEncoder()
    df['Texture'] = le_texture.fit_transform(df['Texture'])
    
    le_soil = LabelEncoder()
    df['SoilType'] = le_soil.fit_transform(df['SoilType'])
    
    le_label = LabelEncoder()
    df['DiseaseLabel'] = le_label.fit_transform(df['DiseaseLabel'])
    
    X = df[features]
    y = df[target]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Define models
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000),
        'Decision Tree': DecisionTreeClassifier(),
        'Random Forest': RandomForestClassifier(),
        'KNN': KNeighborsClassifier()
    }
    
    best_accuracy = 0
    best_model_name = ""
    best_model = None
    
    print("\nTraining models...")
    for name, model in models.items():
        model.fit(X_train, y_train)
        accuracy = model.score(X_test, y_test)
        print(f"{name} Accuracy: {accuracy:.4f}")
        
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_model_name = name
            best_model = model
            
    print(f"\nHighest-performing model: {best_model_name} with {best_accuracy:.4f} accuracy")
    
    # Export the best model
    print("Exporting best_model.pkl...")
    joblib.dump(best_model, 'best_model.pkl')
    
    # Save encoders for later use in prediction
    joblib.dump({
        'ColorIntensity': le_color,
        'Texture': le_texture,
        'SoilType': le_soil,
        'DiseaseLabel': le_label
    }, 'encoders.pkl')
    
    print("Model and encoders saved successfully.")

if __name__ == "__main__":
    train_models()
