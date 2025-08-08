from flask import jsonify
from ..models.place.place import Place
from app.extensions import db
from datetime import datetime

# CREATE

def create_place_controller(data):
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    place = Place(name=name, created_at=datetime.utcnow(), update_at=datetime.utcnow())
    db.session.add(place)
    db.session.commit()
    return jsonify({'id': place.id, 'name': place.name}), 201

# READ ALL

def get_places_controller():
    places = Place.query.all()
    result = [{'id': p.id, 'name': p.name} for p in places]
    return jsonify(result), 200

# READ ONE

def get_place_controller(place_id):
    place = Place.query.get(place_id)
    if not place:
        return jsonify({'error': 'Place not found'}), 404
    return jsonify({'id': place.id, 'name': place.name}), 200

# UPDATE

def update_place_controller(place_id, data):
    place = Place.query.get(place_id)
    if not place:
        return jsonify({'error': 'Place not found'}), 404
    name = data.get('name')
    if name:
        place.name = name
    place.update_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'id': place.id, 'name': place.name}), 200

# DELETE

def delete_place_controller(place_id):
    place = Place.query.get(place_id)
    if not place:
        return jsonify({'error': 'Place not found'}), 404
    db.session.delete(place)
    db.session.commit()
    return jsonify({'message': 'Place deleted'}), 200
