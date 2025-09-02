"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from datetime import datetime as _dt
from .models import Event
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not email or not password or not name:
        raise APIException("Faltan campos obligatorios", status_code=400)
    
    if User.query.filter_by(email=email).first():
        raise APIException("Email ya registrado", status_code=409)
    pw_hash = generate_password_hash(password)
    user = User(email=email, password_hash=pw_hash, name=name, is_active=True)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "msg": "Usuario creado correctamente"
    }), 201


@api.route('/auth/login', methods=['POST'])
def login():

    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        raise APIException("Usuario no encontrado, registrate o inicia sesion con credenciales validas.", status_code=401)
    
    user_serialize = user.serialize()
    access_token = create_access_token(identity=str(user_serialize["id"]))

    return jsonify({
        "access_token": access_token,
        "user": user_serialize
    }), 200

@api.route('/users/me/<user_id>', methods=['GET'])
@jwt_required()
def get_profile(user_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        raise APIException("Usuario no encontrado", status_code=404)
    return jsonify(user.serialize()), 200

@api.route('/users/me/<user_id>', methods=['PUT'])
@jwt_required()
def update_profile(user_id):
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    print(data)
    user = User.query.get(user_id)
    if not user:
        raise APIException("Usuario no encontrado", status_code=404)

    if "name" in data:
        user.name = data["name"]
    if "level" in data:
        user.level = data["level"]
    if "avatar_url" in data:
        print(data["avatar_url"])
        user.avatar_url = data["avatar_url"]

    db.session.commit()
    return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200

@api.route('/users/me', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        raise APIException("Usuario no encontrado", status_code=404)
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg":  "Cuenta eliminada"}), 200

# CRUD de Eventos y endpoint de “unirse” a un evento

@api.route('/events', methods=['GET'])
def list_events():
    events = Event.query.all()
    return jsonify([e.serialize() for e in events]), 200

@api.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        raise APIException("Evento no encontrado", status_code=404)
    return jsonify(event.serialize()), 200

@api.route('/events', methods=['POST'])
@jwt_required()
def create_event():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    required = ["title", "sport", "datetime", "capacity", "price", "address"]
    if not all(field in data for field in required):
        raise APIException("Faltan campos obligatorios", status_code=400)

    try:
        dt = _dt.fromisoformat(data["datetime"].replace("Z", "+00:00"))
    except Exception as e:
        print("Error parsing datetime:", e)
        raise APIException(
            "Formato de fecha/hora invalido (usa ISO 8601)", status_code=400)
    image_url = data.get("image_url")
    
    
    event = Event(
         title=data["title"],
        sport=data["sport"],
        description=data.get("description"),  
        datetime=dt,
        address=data["address"],
        capacity=int(data["capacity"]),
        price=int(data["price"]),
        is_free=(int(data["price"]) == 0),
        user_id=user_id,
        image_url=image_url  
    )

    db.session.add(event)
    db.session.commit()
    return jsonify(event.serialize()), 201

@api.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):

    event = Event.query.get(event_id)
    if not event:
        raise APIException("Evento no encontrado", status_code=404)
    
    current_user_id = get_jwt_identity()
    if event.user_id != current_user_id:
        raise APIException("No autorizado", status_code=403)
    
    data = request.get_json() or {}

    for field in ["sport", "datetime", "capacity", "price", "title", "description", "address"]:
        if field in data:
            setattr(event, field, type(getattr(event, field))(data[field]))

    event.is_free = (event.price == 0)

    db.session.commit()
    return jsonify(event.serialize()), 200
    
@api.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        event = Event.query.get(event_id)
        
        if not event:
            return jsonify({"msg": "Evento no encontrado"}), 404
        
        if str(event.user_id) != str(current_user_id):
            return jsonify({"msg": "No autorizado"}), 403
        
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({"msg": "Evento eliminado"}), 200
