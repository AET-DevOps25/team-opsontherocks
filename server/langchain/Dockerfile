# langchain-service/Dockerfile
FROM python:3.10-slim

# Create app directory
WORKDIR /app

# Install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY app.py .

# Expose port and run with Gunicorn for production
EXPOSE 5001
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app", "--workers", "4"]
