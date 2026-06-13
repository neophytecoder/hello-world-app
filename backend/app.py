import json
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DATA_PATH = os.path.join(os.path.dirname(__file__), "figures.json")


def load_figures():
    with open(DATA_PATH) as f:
        return json.load(f)


def save_figures(figures):
    with open(DATA_PATH, "w") as f:
        json.dump(figures, f, indent=2, ensure_ascii=False)


@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello, World!"})


@app.route("/api/figures")
def list_figures():
    q = request.args.get("q", "").strip().lower()
    figures = load_figures()
    if q:
        figures = [f for f in figures if q in f["name"].lower()]
    return jsonify([
        {"name": f["name"], "slug": f["slug"], "description": f["description"]}
        for f in figures
    ])


@app.route("/api/figures/<slug>")
def get_figure(slug):
    figures = load_figures()
    by_slug = {f["slug"]: f for f in figures}
    figure = by_slug.get(slug)
    if not figure:
        return jsonify({"error": "Not found"}), 404
    resolved = [
        {"name": by_slug[s]["name"], "slug": s}
        for s in figure.get("components", [])
        if s in by_slug
    ]
    return jsonify({
        "name": figure["name"],
        "slug": figure["slug"],
        "description": figure["description"],
        "youtube_id": figure["youtube_id"],
        "components": resolved,
    })


@app.route("/api/figures", methods=["POST"])
def create_figure():
    data = request.get_json()
    figures = load_figures()
    if any(f["slug"] == data["slug"] for f in figures):
        return jsonify({"error": "Slug already exists"}), 409
    figures.append({
        "name": data["name"],
        "slug": data["slug"],
        "description": data["description"],
        "youtube_id": data["youtube_id"],
        "components": data.get("components", []),
    })
    save_figures(figures)
    return jsonify({"slug": data["slug"]}), 201


@app.route("/api/figures/<slug>", methods=["PUT"])
def update_figure(slug):
    data = request.get_json()
    figures = load_figures()
    for i, f in enumerate(figures):
        if f["slug"] == slug:
            figures[i] = {
                "name": data["name"],
                "slug": data.get("slug", slug),
                "description": data["description"],
                "youtube_id": data["youtube_id"],
                "components": data.get("components", []),
            }
            save_figures(figures)
            return jsonify({"slug": figures[i]["slug"]})
    return jsonify({"error": "Not found"}), 404


@app.route("/api/figures/<slug>", methods=["DELETE"])
def delete_figure(slug):
    figures = load_figures()
    new_figures = [f for f in figures if f["slug"] != slug]
    if len(new_figures) == len(figures):
        return jsonify({"error": "Not found"}), 404
    save_figures(new_figures)
    return "", 204


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
