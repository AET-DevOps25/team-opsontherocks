import os
os.environ["OPENAI_API_KEY"] = "fake-key"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
import pytest
from app import app

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get("/test")
    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"
