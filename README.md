#### Start frontend:

```
cd frontend
npm install --legacy-peer-deps
npm run dev
```

#### Start backend:

```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file in `\django` dir:

```
DJANGO_SECRETE_KEY=''
MS_SPEECH_KEY=''
MS_SPEECH_REGION=''
DB_USER=''
DB_PASSWORD=''
JWT_SECRET_KEY=''
ALI_CLOUD_OSS_ACCESS_KEY_ID=''
ALI_CLOUD_OSS_ACCESS_KEY_SECRET=''
ALI_CLOUD_OSS_ROLE_ARN=''
ALI_CLOUD_OSS_ROLE_SESSION_NAME=''
```

```
cd django
python manage.py runserver
```
