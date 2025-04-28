"""
Django settings for PokeTrade project.
"""

import os
from dotenv import load_dotenv
from pathlib import Path

# ─── BASE DIR ───────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment vars
load_dotenv(dotenv_path=BASE_DIR / '.env')

# ─── SECURITY ───────────────────────────────────────────────────────────────────
SECRET_KEY = os.getenv('SECRET_KEY', 'replace-me')
DEBUG = os.getenv('DEBUG', 'True') == 'True'

# Whitelist local hosts
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
]

# ─── APPS & MIDDLEWARE ───────────────────────────────────────────────────────────
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',

    'users',
    'api',
    'usercollections',
    'marketplace',
    'notifications',
    'trades',
    'profiles',
    'challenges',
    'messaging',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True

# ─── URLS & TEMPLATES ────────────────────────────────────────────────────────────
ROOT_URLCONF = 'PokeTrade.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'PokeTrade.wsgi.application'

# ─── DATABASE ───────────────────────────────────────────────────────────────────
DATABASES = {
    'default': {
        'ENGINE':   'django.db.backends.mysql',
        'NAME':     os.getenv('DATABASE_NAME'),
        'USER':     os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST':     os.getenv('DATABASE_HOST'),
        'PORT':     os.getenv('DATABASE_PORT'),
    }
}

# ─── AUTH & PASSWORD VALIDATION ─────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# ─── INTERNATIONALIZATION ───────────────────────────────────────────────────────
LANGUAGE_CODE = 'en-us'
TIME_ZONE     = 'UTC'
USE_I18N      = True
USE_TZ        = True

# ─── STATIC FILES ────────────────────────────────────────────────────────────────
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Only include React’s build/static if it exists
react_static = BASE_DIR / 'frontend' / 'build' / 'static'
if react_static.exists():
    STATICFILES_DIRS = [react_static]
else:
    STATICFILES_DIRS = []

# ─── REST FRAMEWORK ──────────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# ─── EMAIL (for password reset) ──────────────────────────────────────────────────
EMAIL_BACKEND      = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'noreply@poketrade.com'
