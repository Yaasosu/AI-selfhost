import os

import jwt

from user.modules import create_access_token, hash_password


def test_hash_password():
    raw_password = "my_secret_password_123"
    hashed = hash_password(raw_password)

    assert hashed != raw_password
    assert "$argon2id$" in hashed


def test_create_access_token():
    payload = {"user_sub": "123", "name": "testuser"}
    token = create_access_token(data=payload)

    assert isinstance(token, str)
    assert len(token) > 0

    secret = os.getenv("SECRET_KEY", "test-secret-key-123456789")
    algo = os.getenv("ALGORITHM", "HS256")
    decoded = jwt.decode(token, secret, algorithms=[algo])

    assert decoded["user_sub"] == "123"
    assert decoded["name"] == "testuser"
    assert "exp" in decoded
