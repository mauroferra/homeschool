## Deployment Overview  
You’re deploying a full‑stack web application (frontend SPA + backend API + database) on a private server accessible from the internet. The deployment must be secure, stable, and easy to maintain.

The plan below covers:

- Infrastructure  
- Server configuration  
- CI/CD  
- Security hardening  
- Monitoring  
- Backup & recovery  
- Release workflow  

---

## 1. Infrastructure Setup

### Server provisioning  
- Choose a VPS or dedicated server (Linux, Ubuntu LTS recommended).  
- Allocate resources: 2–4 CPU cores, 4–8 GB RAM, SSD storage.  
- Create non‑root deployment user.  
- Configure SSH access with key‑based authentication.

### Domain & DNS  
- Register custom domain.  
- Create DNS A record pointing to server IP.  
- Add subdomains for frontend and backend if desired.

### Guided Links  
- Server provisioning steps  
- DNS configuration guide

---

## 2. Operating System Configuration

### System packages  
- Install Git, Node.js or Python, Nginx, firewall tools.  
- Keep OS updated with unattended upgrades.

### Firewall  
- Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS).  
- Deny all other inbound traffic.

### Timezone & locale  
- Set server timezone to match your workflow (e.g., Europe/Prague or Europe/Rome).

### Guided Links  
- Firewall configuration

---

## 3. Application Runtime Setup

### Backend  
- Install runtime (Node.js LTS or Python 3.11).  
- Install process manager (PM2, systemd service, or Gunicorn/Uvicorn for Python).  
- Create environment variables file (.env).  
- Install dependencies.  
- Run database migrations.

### Frontend  
- Build production bundle.  
- Serve static files via Nginx.

### Guided Links  
- Backend runtime setup  
- Frontend production build steps

---

## 4. Reverse Proxy & HTTPS

### Nginx configuration  
- Configure reverse proxy for backend API.  
- Serve frontend SPA from `/var/www/app`.  
- Enable gzip compression.  
- Add caching headers for static assets.

### HTTPS  
- Use Certbot + Let’s Encrypt for TLS certificates.  
- Auto‑renew certificates with cron.

### Guided Links  
- Nginx reverse proxy setup  
- HTTPS configuration

---

## 5. CI/CD Pipeline

### Version control  
- Use GitHub/GitLab.  
- Protect main branch.

### CI pipeline  
- Linting and formatting checks.  
- Run backend tests.  
- Run frontend tests.  
- Build frontend bundle.  
- Build backend artifact.

### CD pipeline  
- SSH deploy or Docker deploy.  
- Restart backend service.  
- Reload Nginx.  
- Run database migrations automatically or manually.

### Guided Links  
- CI/CD pipeline design

---

## 6. Security Hardening

### Server  
- Disable root login.  
- Enforce SSH key authentication.  
- Fail2ban for brute‑force protection.  
- Regular OS patching.

### Application  
- Secure cookies.  
- CSRF protection.  
- Input validation.  
- Rate limiting on auth endpoints.  
- Strong password hashing (bcrypt).  
- JWT expiration and refresh logic.

### Database  
- Use least‑privilege DB user.  
- Enforce SSL connections if remote.  
- Regular backups.

### Guided Links  
- Backend security checklist

---

## 7. Monitoring & Logging

### Application monitoring  
- Use PM2 logs or systemd journal.  
- Add health check endpoint.  
- Track API latency and error rates.

### Server monitoring  
- Install monitoring agent (Netdata, Prometheus node exporter).  
- Track CPU, RAM, disk, network.

### Alerts  
- Email or Slack alerts for downtime or high load.

### Guided Links  
- Monitoring setup

---

## 8. Backup & Recovery

### Database backups  
- Daily automated dumps.  
- Store backups off‑server (S3 or remote storage).  
- Keep 30‑day retention.

### File storage backups  
- Backup attachments directory weekly.  
- Sync to remote storage.

### Disaster recovery  
- Document full restore procedure.  
- Test restore quarterly.

### Guided Links  
- Backup strategy

---

## 9. Release Workflow

### Development → Staging → Production  
- Development: local environment.  
- Staging: test server with real data.  
- Production: private server with HTTPS.

### Release steps  
- Merge to main.  
- CI builds artifacts.  
- CD deploys to server.  
- Run migrations.  
- Smoke test endpoints.  
- Announce release.

### Rollback plan  
- Keep previous build artifacts.  
- Restore previous DB snapshot if needed.

### Guided Links  
- Release workflow design

---

## 10. Definition of Done (DevOps)

- Server hardened and secured.  
- HTTPS fully operational.  
- Backend running via PM2/systemd.  
- Frontend served via Nginx.  
- CI/CD pipeline active.  
- Monitoring and alerts configured.  
- Backup system tested.  
- Documentation complete.
