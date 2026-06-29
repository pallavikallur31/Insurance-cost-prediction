import os
import sys
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "Data", "medical_insurance.csv")
PKL_PATH = os.path.join(BASE_DIR, "model.pkl")

print("=" * 55)
print("  Insurify ML -- Model Training Script")
print("=" * 55)

df = pd.read_csv(CSV_PATH)
print(f"\n[OK] Dataset loaded: {len(df)} rows x {len(df.columns)} columns")
print(f"     Columns: {list(df.columns)}")


df['sex'] = df['sex'].map({'male': 0, 'female': 1})

df['smoker'] = df['smoker'].map({'no': 0, 'yes': 1})

df = pd.get_dummies(df, columns=['region'], drop_first=True)

df = df.dropna()

print(f"[OK] Preprocessing done. Final columns: {list(df.columns)}")


target_col = 'charges' if 'charges' in df.columns else df.columns[-1]
print(f"[OK] Target column: '{target_col}'")

X = df.drop(target_col, axis=1)
y = df[target_col]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"[OK] Train size: {len(X_train)}  |  Test size: {len(X_test)}")

print("\n[...] Training RandomForestRegressor (100 trees)...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
print("[OK] Model trained!")


y_pred = model.predict(X_test)
mae  = mean_absolute_error(y_test, y_pred)
rmse = mean_squared_error(y_test, y_pred) ** 0.5
r2   = r2_score(y_test, y_pred)

print("\n-- Model Performance ------------------------------------")
print(f"  MAE  (Mean Absolute Error) : ${mae:,.2f}")
print(f"  RMSE (Root Mean Sq Error)  : ${rmse:,.2f}")
print(f"  R2   Score                 : {r2:.4f}  ({r2*100:.2f}% accuracy)")


comparison = pd.DataFrame({
    'Actual':    y_test.values[:8],
    'Predicted': y_pred[:8]
})
comparison['Difference'] = (comparison['Predicted'] - comparison['Actual']).round(2)
print("\n-- Sample Predictions -----------------------------------")
print(comparison.to_string(index=False))


with open(PKL_PATH, "wb") as f:
    pickle.dump(model, f)

print(f"\n[SAVED] model.pkl --> {PKL_PATH}")
print("=" * 55)
print("  Done! Restart app.py to use the new model.")
print("=" * 55)
