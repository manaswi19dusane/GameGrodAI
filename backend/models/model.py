# train_model.py

import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer

# Load data
df = pd.read_csv("train.csv")
X = df.drop(columns=["PlayerID", "CheatingFlag"])
y = df["CheatingFlag"]

# Preprocessing
cat_cols = X.select_dtypes(include=["object"]).columns
num_cols = X.select_dtypes(include=["int64", "float64"]).columns

num_imputer = SimpleImputer(strategy="mean")
X[num_cols] = num_imputer.fit_transform(X[num_cols])

encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col].astype(str))
    encoders[col] = le

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=150, max_depth=25, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

# Save model and preprocessing steps
joblib.dump(model, "game_guard_model.pkl")
joblib.dump(encoders, "categorical_encoders.pkl")
joblib.dump(num_imputer, "numeric_imputer.pkl")

print("✅ Model trained and saved successfully.")
