# Monitoring Setup

This project now includes Prometheus and Grafana for monitoring the wheel-of-life service CPU utilization.

## Services

### Prometheus
- **URL**: http://localhost:9090
- **Configuration**: `./prometheus/prometheus.yml`
- **Data Storage**: `prometheus-data` volume

### Grafana
- **URL**: http://localhost:3000
- **Default Credentials**: Use environment variables `GRAFANA_USER` and `GRAFANA_PASSWORD`
- **Dashboards**: Automatically provisioned from `./grafana/provisioning/dashboards/`

## Metrics

### Wheel of Life Service
The wheel-of-life service exposes the following metrics via Spring Boot Actuator:
- CPU usage: `process_cpu_usage`
- Memory usage: `jvm_memory_used_bytes`
- HTTP requests: `http_server_requests_seconds_count`

### Dashboard
A simple CPU utilization dashboard is automatically created:
- **Dashboard Name**: "Wheel of Life CPU Metrics"
- **Panels**:
  - CPU Usage Time Series Graph
  - Current CPU Usage Stat Panel

## Getting Started

1. Start the services:
   ```bash
   docker-compose up -d
   ```

2. Access Grafana at http://localhost:3000

3. The dashboard will be automatically available with CPU metrics for the wheel-of-life service

## Configuration

### Prometheus Configuration
The Prometheus configuration is in `./prometheus/prometheus.yml` and scrapes:
- Prometheus itself (localhost:9090)
- Wheel of Life service (wheel-of-life:8080/actuator/prometheus)
- Authentication service (authentication:8081/actuator/prometheus)
- GenAI service (genai:5001/metrics)

### Grafana Configuration
- Datasources are automatically provisioned from `./grafana/provisioning/datasources/`
- Dashboards are automatically provisioned from `./grafana/provisioning/dashboards/`

## Metrics Endpoints

- **Wheel of Life**: http://localhost:8080/actuator/prometheus
- **Authentication**: http://localhost:8081/actuator/prometheus
- **Prometheus**: http://localhost:9090/metrics 