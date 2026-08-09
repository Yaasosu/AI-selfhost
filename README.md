<img width="1816" height="976" alt="image" src="https://github.com/user-attachments/assets/e5704a69-ced4-4b18-88d5-6d3903473c8d" />
<img width="1815" height="995" alt="image" src="https://github.com/user-attachments/assets/a3c42704-490c-4ce0-8446-b7a2b76938de" />

# AI Chat Startup Guide (FastAPI + React/Vite + Caddy)

This project is a lightweight chat client designed to run local AI models via **Ollama**. The entire stack is containerized using Docker and runs on top of lightweight **Alpine** Linux images.

---

## 🚀 Quick Start

### Prerequisites
1. **Docker** and **Docker Compose** installed on your host machine.
2. **Ollama** installed locally on your PC

---

### Step 1. Configure Local Ollama on Host (for Linux/Fedora)
By default, Ollama on Linux only listens on `127.0.0.1` (localhost). To allow the backend Docker container to communicate with it, configure Ollama to accept connections from the Docker network:

1. Create a service override configuration file:
   ```bash
   sudo mkdir -p /etc/systemd/system/ollama.service.d && echo -e "[Service]\nEnvironment=\"OLLAMA_HOST=0.0.0.0\"" | sudo tee /etc/systemd/system/ollama.service.d/override.conf
   ```
2. Apply the configuration changes and restart the Ollama service:
   ```bash
   sudo systemctl daemon-reload && sudo systemctl restart ollama
   ```
3. Verify that Ollama is listening on all network interfaces:
   ```bash
   ss -tlnp | grep 11434
   ```
   You should see `*:11434` or `0.0.0.0:11434` instead of `127.0.0.1:11434`.

4. **Allow port 11434 in your Firewall (if UFW / firewalld is active):**
   If UFW is active, incoming connections from Docker containers to port 11434 will be blocked by default. Allow the port:
   ```bash
   sudo ufw allow 11434/tcp
   ```

---
### Step 2. Set-up your data base
1. change file name from .env-test to .env

2.in file put your data
```bash
test_DB_HOST=
test_DB_PORT=
test_DB_USER=
test_DB_PASS=
test_DB_NAME=

SECRET_KEY =
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 3200
```
---
### Step 3. Start the Stack via Docker Compose

Run the build and start all services in the background:
```bash
docker compose up -d
```

*Upon initial startup, Docker will automatically:*
- Pull the required Alpine-based images.
- Build the React frontend in a temporary container and copy the static assets to Caddy.
- Verify PostgreSQL and Redis readiness via built-in healthchecks.
- Run database migrations using Alembic.
- Spin up Prometheus, Grafana, and Loki with pre-configured settings.

---

## 🔗 Available Services

Once successfully started, the services will be accessible at the following URLs:

| Service | Browser URL | Description |
| :--- | :--- | :--- |
| **AI Chat (Frontend)** | 🌐 [http://localhost](http://localhost) | Caddy serves the React application on the standard port 80. |
| **API Documentation** | 📖 [http://localhost/docs](http://localhost/docs) | Interactive Swagger UI for testing API endpoints. |
| **Grafana** | 📊 [http://localhost:3000](http://localhost:3000) | Metrics dashboard. Automatically logs in as Admin. |
| **Prometheus** | ⏱️ [http://localhost:9090](http://localhost:9090) | Time-series database containing metrics. |
| **adminer** | 💻 [http://localhost:8080/](http://localhost:8080/) | admin panel in browser. |
---

## 📊 Pre-configured Grafana Monitoring

Monitoring dashboards are set up and imported automatically:
1. Open **Grafana** ([http://localhost:3000](http://localhost:3000)).
2. Navigate to **Dashboards** in the left sidebar.
3. Open the **Application** folder and select **AIWEBHOST Chat Dashboard**.
4. You will see real-time charts displaying:
   - User activity and message count.
   - Response latency from Ollama models.
   - Redis cache hits/misses and PostgreSQL database metrics.

---
## 📊 Admin-Panel settings

convenient admin panel in your browser
1. Open **Adminer** ([http://localhost:8080](http://localhost:8080)).
2. Login using:
   - System: PostgreSQL
   - Server: db
   - User: postgres
   - Password: 1
   - Database: aiwebhost
---

## 🛠️ Useful Management Commands

- **Check container status:**
  ```bash
  docker compose ps
  ```
- **Stream backend logs in real-time:**
  ```bash
  docker compose logs -f backend
  ```
- **Restart a specific service (e.g., Caddy):**
  ```bash
  docker compose restart caddy
  ```
- **Rebuild the project after code changes:**
  ```bash
  docker compose up --build -d
  ```
- **Stop and remove all containers:**
  ```bash
  docker compose down
  ```

---

## ⚙️ Ports Configuration Notes (For Developers)
To prevent conflicts with services that might already be running on your local machine:
* **Redis** inside Docker does not expose port `6379` to the host. The backend container communicates with it directly inside the internal Docker network.
* **PostgreSQL** is forwarded to port **`5433`** on the host machine (instead of the standard `5432`). If you need to connect to the database directly from PyCharm, pgAdmin, or another client, use port `5433` (username: `postgres`, password: `1`, database: `aiwebhost`).

---

## 👥 Contributions

* **Backend (FastAPI):** Built by me (exception: `send_message` endpoint there AI helped with images).
* **Frontend (Vite + React):** Fully vibecoded
* **DevOps (Docker, Caddy, Grafana, Prometheus):** AI helped with configuration.

**AI Tools & Skills Used:**
* Gemini
* [vercel-labs / find-skills](https://www.skills.sh/vercel-labs/skills/find-skills)
* [mattpocock / grill-me](https://www.skills.sh/mattpocock/skills/grill-me)
