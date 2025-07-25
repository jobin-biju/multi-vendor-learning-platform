from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from sklearn.linear_model import LinearRegression
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/multivendor"
mongo = PyMongo(app)

@app.route('/predict-revenue', methods=['GET'])
def predict_revenue():
    payments = list(mongo.db.payments.find({"status": 1})) 

    if not payments:
        return jsonify({"error": "No payment data found"})

    # Convert to DataFrame
    df = pd.DataFrame(payments)
    df['date'] = pd.to_datetime(df['date'])
    df['timestamp'] = df['date'].astype('int64') / 1e9

    df['day_of_week'] = df['date'].dt.dayofweek
    df['day'] = df['date'].dt.day
    df['month'] = df['date'].dt.month

    df['user_id'] = df['user_id'].astype(str)
    df['course_id'] = df['course_id'].astype(str)
    df['instructorid'] = df['instructorid'].astype(str)

    df = pd.get_dummies(df, columns=['user_id', 'course_id', 'instructorid'])

    # Model training
    X = df.drop(columns=['_id', 'orderId', 'paymentId', 'amount', 'venid', 'date', '__v', 'status'], errors='ignore')
    y = df['amount']

    model = LinearRegression()
    model.fit(X, y)

    # Prediction for next 7 days
    base_row = X.tail(7).mean().to_frame().T
    next_7_days = []

    for i in range(1, 8):
        future_date = datetime.now() + timedelta(days=i)
        future_timestamp = future_date.timestamp()

        future_row = base_row.copy()
        future_row['timestamp'] = future_timestamp
        future_row['day_of_week'] = future_date.weekday()
        future_row['day'] = future_date.day
        future_row['month'] = future_date.month

        for col in X.columns:
            if col not in future_row:
                future_row[col] = 0

        future_row = future_row[X.columns]
        predicted_amount = model.predict(future_row)[0]

        next_7_days.append({
            "date": future_date.strftime("%Y-%m-%d"),
            "amount": round(predicted_amount, 2)
        })

    #  Actual revenue for past 7 days (grouped and summed correctly)
    df['only_date'] = df['date'].dt.date
    grouped = df.groupby('only_date')['amount'].sum().reset_index()
    past_df = grouped.sort_values('only_date', ascending=False).head(7).sort_values('only_date')

    past_7_days = [
        {
            "date": row['only_date'].strftime("%Y-%m-%d"),
            "amount": round(row['amount'], 2)
        }
        for _, row in past_df.iterrows()
    ]

    return jsonify({
        "past_7_days": past_7_days,
        "next_7_days": next_7_days
    })

if __name__ == '__main__':
    app.run(debug=True)
