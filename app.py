import flask as f
import os

app = f.Flask(__name__)

@app.route("/")
def home():
    return f.render_template("home.html")

@app.route("/programs")
def programs():
    return f.render_template("programs.html")

@app.route("/prices")
def prices():
    return f.render_template("prices.html")

@app.route("/teachers")
def teachers():
    return f.render_template("teachers.html")

@app.route("/location")
def location():
    return f.render_template("location.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("PORT", 5000), debug=True)