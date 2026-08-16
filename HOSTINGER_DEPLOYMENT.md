# HOSTINGER DEPLOYMENT GUIDE - AI MARATHI GURU (aimarathi.swaraudyog.com)

This step-by-step guide explains how to deploy **AI Marathi Guru** to Hostinger (VPS or Hostinger Business / Cloud Node.js Hosting).

---

## METHOD 1: Hostinger VPS Deployment (Recommended for Full Performance)

### Step 1: Connect to your Hostinger VPS via SSH
```bash
ssh root@your_vps_ip_address
```

### Step 2: Install Node.js (v20+ LTS) and Git
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx pm2 -g
```

### Step 3: Clone or Upload Project Files
```bash
cd /var/www
git clone https://github.com/your-repo/ai-marathi-guru.git
cd ai-marathi-guru
```

### Step 4: Configure Environment Variables
Create a `.env` file in the project root:
```bash
nano .env
```
Add the following configuration:
```env
PORT=3000
NODE_ENV=production
APP_URL=https://aimarathi.swaraudyog.com
RAZORPAY_KEY_ID=your_live_or_test_key_id
RAZORPAY_KEY_SECRET=your_live_or_test_key_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=AMG@2026#Admin
WHATSAPP_COMMUNITY_LINK=https://chat.whatsapp.com/H9sm1PHu9uU6ITuzQVgjtO
GEMINI_API_KEY=your_gemini_api_key
```

### Step 5: Install Dependencies & Build
```bash
npm install
npm run build
```

### Step 6: Start Server with PM2 (Process Manager)
```bash
pm2 start dist/server.cjs --name "ai-marathi-guru"
pm2 save
pm2 startup
```

### Step 7: Configure Nginx Reverse Proxy
Edit Nginx configuration for `aimarathi.swaraudyog.com`:
```bash
sudo nano /etc/nginx/sites-available/aimarathi.swaraudyog.com
```
Paste Nginx config:
```nginx
server {
    listen 80;
    server_name aimarathi.swaraudyog.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/aimarathi.swaraudyog.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Install SSL Certificate with Certbot (HTTPS)
```bash
sudo apt install snapd
sudo snap install --classic certbot
sudo certbot --nginx -d aimarathi.swaraudyog.com
```

---

## METHOD 2: Hostinger hPanel Node.js Application Setup

If you use Hostinger's Cloud / Business Hosting with Node.js Application Selector:

1. Log in to **Hostinger hPanel**.
2. Go to **Advanced** → **Setup Node.js App**.
3. Click **Create Application**:
   - **Node.js Version**: Select `20.x` or `22.x`
   - **Application Mode**: `Production`
   - **Application Root**: `ai-marathi-guru`
   - **Application URL**: `aimarathi.swaraudyog.com`
   - **Application Startup File**: `dist/server.cjs`
4. Upload all project files to `public_html/ai-marathi-guru` via FTP/File Manager.
5. In hPanel terminal or SSH:
   ```bash
   npm install
   npm run build
   ```
6. Click **Restart Application** in hPanel Node.js Selector.

---

## 🔒 Verification Post-Deployment

1. Visit `https://aimarathi.swaraudyog.com`
2. Test student registration flow & Razorpay payment.
3. Access Admin Panel at `https://aimarathi.swaraudyog.com` (click Admin Login or navigate to `/admin/login`).
4. Log in with initial credentials (`admin` / `AMG@2026#Admin`) and set a new password.
5. Update WhatsApp Community link in Admin Panel under **WHATSAPP** tab if required.
