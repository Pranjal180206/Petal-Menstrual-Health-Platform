import joblib
model = joblib.load("menstrual_model.joblib")
print("Model type:", type(model))
print("Model params:", model.get_params() if hasattr(model, 'get_params') else "N/A")

# Check expected input features
if hasattr(model, 'feature_names_in_'):
    print("Expected features:", list(model.feature_names_in_))
elif hasattr(model, 'n_features_in_'):
    print("Number of input features:", model.n_features_in_)

# Check output
if hasattr(model, 'classes_'):
    print("Output classes:", model.classes_)
