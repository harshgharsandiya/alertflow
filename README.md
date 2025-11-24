# AlertFlow

AlertFlow is a multi-tenant distributed notification system that delivers Email, SMS, Inapp and Push notifications reliably using an event-driven architecture.

### ✨ Features

-   Multi-Tenant support
-   Multi-channel support (Email, SMS, Push, InApp)
-   Queue-based processing
-   Retry logic + Dead letter queue
-   User preferences
-   Priotization Message (Eg., OTP > Promotion)
-   No Channel Priotization
-   Support InApp Notification
-   Message Scheduling (future message)
-   Realtime & Batch Notification (bulk)
-   Custom template for Notification

---

## ✅ TODO List

### **1. Project Setup**

-   [x] Initialize root folder `alertflow`
-   [x] Setup backend (Node.js + Express/)
-   [ ] Setup frontend (Next.js/React) for dashboard
-   [x] Initialize Git repo + environment (.env, Docker, docker-compose)
-   [ ] Add Redis (Docker) for queues/caching
-   [x] Add PostgreSQL (Docker) for database

### **2. Core Architecture**

-   [ ] Implement multi-tenant system (tenant table + middleware)
-   [ ] Create core modules: Users, Tenants, Channels, Templates
-   [ ] Implement RBAC (Owner → Admin → Member)

### **3. Notification Event System**

-   [ ] Build notification producer API `/notifications/publish`
-   [ ] Validate event schema
-   [ ] Push event into Redis queue
-   [ ] Add channel support: Email, SMS, Push, InApp

### **4. Queue Workers**

-   [ ] Setup BullMQ/Redis Streams workers
-   [ ] Implement EmailWorker, SMSWorker, PushWorker, InAppWorker
-   [ ] Add retry logic (exponential backoff)
-   [ ] Add Dead Letter Queue (DLQ)

### **5. Delivery Channels**

-   [ ] Integrate Email provider (SES/SendGrid/SMTP)
-   [ ] Integrate SMS provider (Twilio/MSG91)
-   [ ] Integrate Push provider (Firebase)
-   [ ] Implement InApp delivery (DB + WebSocket)

### **6. Template System**

-   [ ] Template CRUD API
-   [ ] Dynamic variables (`{{name}}`, `{{otp}}`)
-   [ ] Template versioning
-   [ ] Template per channel

### **7. Scheduling**

-   [ ] Support future scheduled notifications
-   [ ] Cron-based batch sending
-   [ ] Delayed queue jobs support

### **8. User Preferences**

-   [ ] Channel preference management (Email/SMS/Push/InApp)
-   [ ] Category preference management (OTP, Alerts, Marketing)
-   [ ] Enforce preferences before sending

### **9. Prioritization**

-   [ ] Implement queue priority levels (High/Medium/Low)
-   [ ] Priority routing (OTP → highest)

### **10. Dashboard API**

-   [ ] Notification history API
-   [ ] Delivery analytics API
-   [ ] Tenant usage stats API
-   [ ] Template management API

### **11. Testing**

-   [ ] Unit tests
-   [ ] Integration tests
-   [ ] Worker tests
-   [ ] Load testing (k6)

### **12. Deployment**

-   [ ] Dockerize backend + workers
-   [ ] Add Nginx reverse proxy
-   [ ] Setup CI/CD (GitHub Actions)
-   [ ] Configure production Redis + PostgreSQL
-   [ ] Add provider environment configs

### **13. Documentation**

-   [ ] API documentation (Swagger/Postman)
-   [ ] Architecture diagram
-   [ ] Queue workflow diagram
-   [ ] Environment setup guide
-   [ ] Tenant onboarding flow

## ⚙️ Architecture

---

## 🧰 Tech Stack

-   Node.js, Express
-   Redis Queue (BullMQ)
-   MongoDB
-   Nodemailer / Twilio / Firebase FCM

---

## 🚀 Setup Instructions

```

git clone [https://github.com/YOUR-USERNAME/alertflow]
cd alertflow
npm install
npm run dev

```

Environment variables:

```

MONGO_URI=
REDIS_URL=
EMAIL_USER=
EMAIL_PASS=
TWILIO_SID=
TWILIO_TOKEN=
FCM_SERVER_KEY=

```
