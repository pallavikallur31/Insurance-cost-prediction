from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import os

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the HTML frontend

# Load trained model (path relative to this file)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = pickle.load(open(os.path.join(BASE_DIR, "model.pkl"), "rb"))

# ── ROUTES FOR HTML PAGES ──────────────────────────────────────

@app.route('/index')
@app.route('/index.html')
def home():
    return render_template("index.html")

@app.route('/about')
@app.route('/about.html')
def about():
    return render_template("about.html")

@app.route('/insurance')
@app.route('/insurance.html')
def insurance():
    return render_template("insurance.html")

@app.route('/predict_page')
@app.route('/predict.html')
def predict_page():
    return render_template("predict.html")

@app.route('/blogs')
@app.route('/blogs.html')
def blogs():
    return render_template("blogs.html")

@app.route('/contact')
@app.route('/contact.html')
def contact():
    return render_template("contact.html")

@app.route('/')
@app.route('/login')
@app.route('/login.html')
def login():
    return render_template("login.html")

# ── API ENDPOINT ────────────────────────────────────────────────

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        age      = float(data['age'])
        sex      = float(data['sex'])       # 0 = male, 1 = female
        bmi      = float(data['bmi'])
        children = float(data['children'])
        smoker   = float(data['smoker'])    # 0 = no, 1 = yes
        marital  = float(data.get('marital', 0)) # 0 = single, 1 = married
        region   = data['region']           # southwest | southeast | northwest | northeast

        # One-hot encode region (northeast is the drop_first baseline)
        region_northwest = 1 if region == "northwest"  else 0
        region_southeast = 1 if region == "southeast"  else 0
        region_southwest = 1 if region == "southwest"  else 0

        features = [
            age, sex, bmi, children, smoker,
            region_northwest, region_southeast, region_southwest
        ]

        prediction = model.predict([features])[0]

        # Build extra info for the frontend
        monthly   = round(prediction / 12, 2)
        risk      = "High" if smoker else ("Medium" if bmi > 30 else "Low")
        coverage  = "Basic" if prediction < 10000 else ("Standard" if prediction < 25000 else "Premium")

        return jsonify({
            "success": True,
            "annual":    round(prediction, 2),
            "monthly":   monthly,
            "risk":      risk,
            "coverage":  coverage
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5000)