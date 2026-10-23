# Use an official lightweight Python image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code (excluding .env via .dockerignore)
COPY . .
# Expose port 8000 for the FastAPI server
EXPOSE 8000

# Command to run the Uvicorn server, binding to 0.0.0.0 for cloud access
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]