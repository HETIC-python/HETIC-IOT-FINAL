from flask import Blueprint, request, jsonify
from ...models.place.place import Place

place_bp = Blueprint("places", __name__)

@place_bp.route("places", methods = ["POST"])
def create_place():
    pass

@place_bp.route("places", methods = ["GET"])
def get_places():
    places = Place.query.all()
    pass

@place_bp.route("places/<int:place_id>", methods = ["GET"])
def get_place():
    pass

@place_bp.route("places/<int:place_id>", methods = ["PUT"])
def update_place():
    pass

@place_bp.route("places/<int:place_id", methods = ["DEL"])
def delete_place():
    pass