# Livestream Overlay Application

## Overview
The **Livestream Overlay Application** is a full-stack web application that allows users to add and manage overlays (text and logos) over a live video stream. You can customize the position, size, and type of the overlay, making it ideal for live events, surveillance, or any real-time video streams. The application supports RTSP video streams, and overlays are rendered in real-time using OpenCV.

---

## Features

- **RTSP Video Streaming**: Stream video feeds from RTSP sources (e.g., IP cameras).
- **Overlay Management**: Add, edit, and delete text or logo overlays on the video stream.
- **Custom Overlay Settings**: Choose from different positions, sizes, and types for your overlays.
- **Full CRUD API**: Manage overlays via RESTful API endpoints.
- **Responsive Design**: Access the application via web browser with a user-friendly UI.

---

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla JS or React)
- **Backend**: Node.js, Express, Flask (Python)
- **Database**: MongoDB for storing overlay data
- **Video Processing**: OpenCV for real-time video stream handling
- **Streaming Protocol**: RTSP for fetching video feeds

---

## Installation & Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/Madhupal841998/livestream-overlay-app.git
    cd livestream-overlay-app
    ```

2. **Install dependencies**:
   - For the Node.js/Express backend:
     ```bash
     npm install
     ```
   - For the Flask/Python video processing backend:
     ```bash
     pip install -r requirements.txt
     ```

3. **Start the Node.js backend**:
    ```bash
    npm dev
    ```

4. **Start the Flask backend** (for video streaming):
    ```bash
    python app.py
    ```

5. **Access the application**:
   Open your browser and navigate to: http://localhost:5173

   
---

## API Endpoints

1. **Create Overlay**: `POST /api/overlay`
2. **Get All Overlays**: `GET /api/overlays`
3. **Update Overlay**: `PUT /api/overlay/:overlay_id`
4. **Delete Overlay**: `DELETE /api/overlay/:overlay_id`
5. **Stream Video**: `GET /stream?url=RTSP_URL`

Check the [API Documentation](/API Documentation.docx) for more details.

---

## How to Use

### 1. Input RTSP Stream URL
- Enter your RTSP stream URL in the provided input box and click **"Load Stream"** to view the live video feed.

### 2. Add an Overlay
- Choose whether to add **Text** or **Logo**.
- Enter the content (for text) or upload a logo (for images).
- Select the position and size, then click **"Add"**.

### 3. Manage Overlays
- View, edit, or delete existing overlays from the overlay management panel.

---

## Contributing

Feel free to submit pull requests or open issues if you encounter any bugs or want to contribute improvements.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


