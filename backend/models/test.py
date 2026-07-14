# test.py

import pandas as pd
import joblib
import numpy as np

# Load test file
df = pd.read_csv("test (1).csv")  # <-- change path if needed
original_ids = df["PlayerID"].values.tolist()

# Load saved model + preprocessing steps
model = joblib.load("game_guard_model.pkl")
encoders = joblib.load("categorical_encoders.pkl")
num_imputer = joblib.load("numeric_imputer.pkl")

# Extract columns for flag detection
secure_boot = df.get("SecureBootEnabled", pd.Series([None] * len(df)))
vm_flag = df.get("VirtualMachineFlag", pd.Series([None] * len(df)))

# Drop ID column
X = df.drop(columns=["PlayerID"], errors="ignore")

# Fill numeric nulls
num_cols = X.select_dtypes(include=["int64", "float64"]).columns
X[num_cols] = num_imputer.transform(X[num_cols])

# Encode categoricals
cat_cols = X.select_dtypes(include=["object"]).columns
# Encode categoricals safely
for col in cat_cols:
    if col in encoders:
        le = encoders[col]
        known_classes = set(le.classes_)
        X[col] = X[col].astype(str).apply(lambda x: x if x in known_classes else "__unknown__")

        if "__unknown__" not in le.classes_:
            le.classes_ = np.append(le.classes_, "__unknown__")

        X[col] = le.transform(X[col])
    else:
        X[col] = 0  # default encoding if column not in encoders

# Make predictions
preds = model.predict(X)
probs = model.predict_proba(X)

# Build result table
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

# Convert to DataFrame
results_df = pd.DataFrame(results)

# Save to CSV or print
results_df.to_csv("prediction_results.csv", index=False)
print("✅ Prediction complete. Saved to prediction_results.csv")
print(results_df.head(10))  # Show first 10 results
