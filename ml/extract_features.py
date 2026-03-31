import joblib
import json

model = joblib.load("menstrual_model.joblib")

output = {
    "n_features": int(model.n_features_in_) if hasattr(model, "n_features_in_") else None,
    "feature_importances": model.feature_importances_.tolist() if hasattr(model, "feature_importances_") else None,
    "feature_names": model.feature_names_in_.tolist() if hasattr(model, "feature_names_in_") else None
}

with open("feature_analysis.json", "w") as f:
    json.dump(output, f, indent=2)
