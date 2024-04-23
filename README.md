### Sing with Vocarina

<img src="frontend/src/assets/logo.png"  width="100" height="100">
<img src="frontend/src/assets/figure.jpg" width="50%" >

#### Start frontend:

Install dependencies:

```
cd frontend
npm install --legacy-peer-deps
```

Create `.env` file in `\` dir:

```
# Google reCAPTHCHA key
VITE_REACT_APP_RECAPTCHA_CLIENT_KEY=YOUR_KEY
```

Run server:

```
npm run dev
```

#### Start backend:

Create virtual environment and install dependencies:

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file in `\django` dir:

```
# Django
DJANGO_SECRETE_KEY=''

# Microsoft TTS key
MS_SPEECH_KEY=''
MS_SPEECH_REGION=''

# Reecho.ai TTS key
REECHO_KEY=''

# MySQL
DB_USER=''
DB_PASSWORD=''

# JWT
JWT_SECRET_KEY=''

# Alibaba cloud OSS config
ALI_CLOUD_OSS_ACCESS_KEY_ID=''
ALI_CLOUD_OSS_ACCESS_KEY_SECRET=''
ALI_CLOUD_OSS_ROLE_ARN=''
ALI_CLOUD_OSS_ROLE_SESSION_NAME=''

# Google reCAPTHCHA key
RECAPTCHA_KEY=''
```

```
cd django
```

Database migration:

```
python manage.py makemigrations
python manage.py migrate
```

Run server:

```
python manage.py runserver
```
