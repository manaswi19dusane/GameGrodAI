from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)  # ✅ wide open for local dev

# Load trained model and preprocessing objects
model = joblib.load("models/game_guard_model.pkl")
encoders = joblib.load("models/categorical_encoders.pkl")
num_imputer = joblib.load("models/numeric_imputer.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    try:
        df = pd.read_csv(file)

        if "PlayerID" not in df.columns:
            return jsonify({"error": "Missing 'PlayerID' column in CSV"}), 400

        original_ids = df["PlayerID"].astype(str).values.tolist()
        secure_boot = df.get("SecureBootEnabled", pd.Series([None] * len(df)))
        vm_flag = df.get("VirtualMachineFlag", pd.Series([None] * len(df)))

        # Prepare features
        X = df.drop(columns=["PlayerID"], errors="ignore")

        # Preprocess numeric columns
        num_cols = X.select_dtypes(include=["int64", "float64"]).columns
        X[num_cols] = num_imputer.transform(X[num_cols])

        # Preprocess categorical columns safely
        cat_cols = X.select_dtypes(include=["object"]).columns
        for col in cat_cols:
            if col in encoders:
                le = encoders[col]
                known_classes = set(le.classes_)
                X[col] = X[col].astype(str).apply(lambda x: x if x in known_classes else "__unknown__")
                if "__unknown__" not in le.classes_:
                    le.classes_ = np.append(le.classes_, "__unknown__")
                X[col] = le.transform(X[col])
            else:
                X[col] = 0

        # Predict
        preds = model.predict(X)
        probs = model.predict_proba(X)

        # Build results
        results = []
        for i in range(len(preds)):
            flags = []
            if vm_flag.iloc[i] == 1:
                flags.append("VM Detected")
            if secure_boot.iloc[i] == 0:
                flags.append("Secure Boot Off")

            results.append({
                "PlayerID": original_ids[i],
                "Prediction": "Cheater" if preds[i] == 1 else "Fair",
                "Confidence": f"{round(100 * np.max(probs[i]), 1)}%",
                "Flags": ", ".join(flags) if flags else "None"
            })
        print("Prediction results (sample):", results[:2])
        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
