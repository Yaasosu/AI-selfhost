import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient


def test_read_root_sync(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "everything is good!"}


@pytest.mark.anyio
async def test_read_root_async(async_client: AsyncClient):
    response = await async_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "everything is good!"}


def test_upload_file(client: TestClient):
    file_content = b"test image content"
    files = {"file": ("test.png", file_content, "image/png")}
    response = client.post("/messages/sendmessage/file", files=files)
    assert response.status_code == 200
    json_data = response.json()
    assert "url" in json_data
    assert json_data["url"].startswith("/uploads/")
    assert json_data["filename"] == "test.png"
