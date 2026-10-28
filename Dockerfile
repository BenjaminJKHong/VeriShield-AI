# Use an official, lightweight Python runtime
FROM python:3.12-slim

# Prevent Python from writing .pyc files and force stdout/stderr logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies (required for some web scraping/network packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file first to leverage Docker cache layers
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port that FastAPI will run on
EXPOSE 8000

# Command to run the application using Uvicorn
# Binding to 0.0.0.0 is MANDATORY for cloud serverless containers
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]