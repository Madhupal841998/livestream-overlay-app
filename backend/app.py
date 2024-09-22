from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import cv2

app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['video_streaming_app']
overlays_collection = db['overlays']

# Basic Route for the backend
@app.route('/')
def index():
    return "Welcome to the Livestream Overlay API"

# CRUD Operations for Overlay Settings

@app.route('/api/overlay', methods=['POST'])
def create_overlay():
    data = request.json
    print(data)
    overlay = {
        "content": data.get('content'),
        "position": data.get('position'),
        "size": data.get('size'),
        "type": data.get('type')  # e.g., 'text' or 'logo'
    }
    overlays_collection.insert_one(overlay)
    return jsonify({"message": "Overlay created successfully!"}), 201

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    overlays = list(overlays_collection.find({}))
    for overlay in overlays:
        overlay['_id'] = str(overlay['_id'])  # Convert ObjectId to string
    return jsonify(overlays), 200

@app.route('/api/overlay/<overlay_id>', methods=['PUT'])
def update_overlay(overlay_id):
    try:
        data = request.json

        # Exclude the `_id` field from being updated (if it exists in the payload)
        if '_id' in data:
            del data['_id']

        # Convert overlay_id to ObjectId and find one document, then update it
        updated_overlay = overlays_collection.find_one_and_update(
            {"_id": ObjectId(overlay_id)},  # Find by _id
            {"$set": data},                 # Update fields with new data
            return_document=True            # Return the updated document after the update
        )

        if updated_overlay:
            # Convert ObjectId to string for JSON serialization
            updated_overlay['_id'] = str(updated_overlay['_id'])
            return jsonify({"message": "Overlay updated successfully!", "overlay": updated_overlay}), 200
        else:
            return jsonify({"message": "Overlay not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlay/<overlay_id>', methods=['DELETE'])
def delete_overlay(overlay_id):
    overlays_collection.delete_one({"_id": ObjectId(overlay_id)})
    return jsonify({"message": "Overlay deleted successfully!"}), 200

# RTSP Video Streaming
@app.route('/stream')
def stream_video():
    rtsp_url = request.args.get('url')
    cap = cv2.VideoCapture(rtsp_url)

    def generate_frames():
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            # Process the frame for overlays here if necessary

            # Convert frame to something Flask can return, like a response stream
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=True)
