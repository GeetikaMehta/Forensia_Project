# Use Python 3.9 base image for mediapipe compatibility
FROM python:3.9

# Disable .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system libraries required by mediapipe, OpenCV, DeepFace, etc.
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    build-essential \
    cmake \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy backend code into the container
COPY backend/ /app

# Upgrade pip and install build tools
RUN pip install --upgrade pip setuptools wheel

# Install Python dependencies (including mediapipe 0.10.21)
RUN pip install --no-cache-dir -r requirements.txt

# Expose Flask port
EXPOSE 5000

# Start your Flask app
CMD ["python", "app.py"]