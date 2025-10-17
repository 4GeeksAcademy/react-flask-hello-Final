"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from dotenv import load_dotenv
import os
from flask import Flask, jsonify, send_from_directory
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, get_jwt_identity

load_dotenv()


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'dist')
app = Flask(__name__, static_folder='dist', static_url_path='/')
app.url_map.strict_slashes = False

print("🗂 STATIC FOLDER:", os.path.join(os.path.dirname(__file__), 'dist'))

# database condiguration
db_url = os.getenv("DATABASE_URL")

if db_url:
    # 1) Arregla URLs antiguas de Heroku: postgres:// → postgresql://
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    # 2) Fuerza el driver psycopg3 para SQLAlchemy: postgresql:// → postgresql+psycopg://
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
else:
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.getenv("TOKEN_KEY")

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def index():
    return app.send_static_file('index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>')
def spa_fallback(path):
    # Si existe el fichero pedido en dist, entrégalo
    full_path = os.path.join(app.static_folder, path)
    if os.path.exists(full_path):
        return send_from_directory(app.static_folder, path)
    # Si no, devuelve index.html
    return app.send_static_file('index.html')

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
