import os
os.environ["FLASK_ENV"] = "testing"


from app import app

def test_health_check():
    with app.test_client() as client:
        response = client.get("/test")
        assert response.status_code == 200
        assert response.json["status"] == "ok"