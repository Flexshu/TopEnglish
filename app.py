import flask as f
import os

app = f.Flask(__name__)

@app.route("/")
def home():
    return f.render_template("home.html")

@app.route("/services")
def programs():
    return f.render_template("services.html")

@app.route("/teachers")
def teachers():
    return f.render_template("teachers.html")

@app.route("/location")
def location():
    return f.render_template("location.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=os.environ.get("PORT", 5001), debug=True)