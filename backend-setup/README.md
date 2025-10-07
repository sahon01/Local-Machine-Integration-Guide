# ZombieCoder Backend API Gateway

এই ব্যাকএন্ড API গেটওয়ে ফ্রন্টএন্ড এডমিন প্যানেল এবং বিভিন্ন AI সার্ভারের মধ্যে সংযোগ স্থাপন করে।

## 📋 প্রয়োজনীয়তা

- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

## 🚀 ইনস্টলেশন

### 1. ডাটাবেস সেটআপ

\`\`\`bash
# MySQL তে লগইন করুন
mysql -u root -p

# ডাটাবেস তৈরি করুন
CREATE DATABASE zombiecoder_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zombiecoder_admin;

# স্কিমা চালান
source database/schema.sql;

# প্রাথমিক ডেটা লোড করুন
source database/initial_data.sql;
\`\`\`

### 2. ব্যাকএন্ড সেটআপ

\`\`\`bash
# backend-gateway ফোল্ডারে যান
cd backend-gateway

# ভার্চুয়াল এনভায়রনমেন্ট তৈরি করুন
python -m venv venv

# এটিভেট করুন
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# ডিপেন্ডেন্সি ইনস্টল করুন
pip install -r requirements.txt
\`\`\`

### 3. কনফিগারেশন

`.env` ফাইল তৈরি করুন এবং আপনার সেটিংস দিন:

\`\`\`env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=zombiecoder_admin

GATEWAY_PORT=5000
GATEWAY_HOST=0.0.0.0
\`\`\`

### 4. সার্ভার চালু করুন

\`\`\`bash
python main.py
\`\`\`

সার্ভার চলবে: `http://localhost:5000`

## 📝 API এন্ডপয়েন্ট

### Agents

- `GET /api/admin/agents` - সব এজেন্ট তালিকা
- `GET /api/admin/agents/{id}` - এজেন্ট বিস্তারিত
- `POST /api/admin/agents` - নতুন এজেন্ট যুক্ত
- `PUT /api/admin/agents/{id}` - এজেন্ট আপডেট
- `DELETE /api/admin/agents/{id}` - এজেন্ট মুছুন
- `POST /api/admin/agents/{id}/test` - এজেন্ট পরীক্ষা

### Servers

- `GET /api/admin/servers` - সব সার্ভার তালিকা
- `GET /api/admin/servers/{id}` - সার্ভার বিস্তারিত
- `POST /api/admin/servers` - নতুন সার্ভার যুক্ত
- `PUT /api/admin/servers/{id}` - সার্ভার আপডেট
- `DELETE /api/admin/servers/{id}` - সার্ভার মুছুন

## 🧪 টেস্টিং

API ডকুমেন্টেশন দেখতে যান: `http://localhost:5000/docs`

## 📊 ডাটাবেস স্ট্রাকচার

- `servers` - সার্ভার তথ্য
- `agents` - এজেন্ট তথ্য
- `ai_models` - AI মডেল তথ্য
- `settings` - সিস্টেম সেটিংস
- `menu_items` - ডায়নামিক মেনু

## 🔄 ওয়ার্কফ্লো

1. ফ্রন্টএন্ড থেকে রিকোয়েস্ট আসে
2. API Gateway রিকোয়েস্ট প্রসেস করে
3. ডাটাবেস থেকে ডেটা নেয়
4. প্রয়োজনে সংশ্লিষ্ট সার্ভারে রিকোয়েস্ট পাঠায়
5. রেসপন্স ফ্রন্টএন্ডে পাঠায়

## 🐛 ট্রাবলশুটিং

### পোর্ট ইতিমধ্যে ব্যবহৃত

\`\`\`bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
\`\`\`

### ডাটাবেস সংযোগ ত্রুটি

\`\`\`bash
# MySQL চলছে কিনা চেক করুন
# Windows:
services.msc (MySQL খুঁজুন)

# Linux:
sudo systemctl status mysql
\`\`\`

### CORS ত্রুটি

`.env` ফাইলে `ALLOWED_ORIGINS` চেক করুন এবং ফ্রন্টএন্ড URL যুক্ত করুন।
\`\`\`

Now let me create the database schema and initial data files:
