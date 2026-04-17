import os
import joblib
import numpy as np
import pandas as pd
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.conf import settings

# Helper to load models
_model = None
_encoders = None

def get_ml_components():
    global _model, _encoders
    if _model is None or _encoders is None:
        model_path = os.path.join(settings.BASE_DIR, 'best_model.pkl')
        encoders_path = os.path.join(settings.BASE_DIR, 'encoders.pkl')
        
        if os.path.exists(model_path) and os.path.exists(encoders_path):
            _model = joblib.load(model_path)
            _encoders = joblib.load(encoders_path)
        else:
            # Fallback or error handled in the view
            return None, None
    return _model, _encoders

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('dashboard')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def dashboard(request):
    return render(request, 'dashboard.html')

@login_required
def predict(request):
    if request.method == 'POST':
        try:
            # Extract features from POST
            leaf_length = float(request.POST.get('leaf_length'))
            leaf_width = float(request.POST.get('leaf_width'))
            color_intensity = request.POST.get('color_intensity')
            spots_present = int(request.POST.get('spots_present'))
            moisture_level = float(request.POST.get('moisture_level'))
            texture = request.POST.get('texture')
            humidity = float(request.POST.get('humidity'))
            temperature = float(request.POST.get('temperature'))
            soil_type = request.POST.get('soil_type')
            
            model, encoders = get_ml_components()
            
            if model is None:
                return JsonResponse({'error': 'Model not trained yet. Please run train.py first.'}, status=500)
            
            # Encode categorical inputs
            color_enc = encoders['ColorIntensity'].transform([color_intensity])[0]
            texture_enc = encoders['Texture'].transform([texture])[0]
            soil_enc = encoders['SoilType'].transform([soil_type])[0]
            
            # Form final input array
            # Features order: LeafLength(cm), LeafWidth(cm), ColorIntensity, SpotsPresent, 
            # MoistureLevel(%), Texture, Humidity(%), Temperature(°C), SoilType
            input_data = np.array([[
                leaf_length, leaf_width, color_enc, spots_present,
                moisture_level, texture_enc, humidity, temperature, soil_enc
            ]])
            
            # Predict
            prediction_idx = model.predict(input_data)[0]
            prediction_label = encoders['DiseaseLabel'].inverse_transform([prediction_idx])[0]
            
            return JsonResponse({'prediction': prediction_label})
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
            
    return JsonResponse({'error': 'Invalid request method'}, status=405)
