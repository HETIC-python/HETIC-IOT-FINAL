from flask import Blueprint, request, jsonify
from ...models.place.place import Place
from ...controller.places import (
    create_place_controller,
    get_places_controller,
    get_place_controller,
    update_place_controller,
    delete_place_controller
)

place_bp = Blueprint("places", __name__)

@place_bp.route("/places", methods=["POST"])
def create_place():
    data = request.get_json()
    return create_place_controller(data)

@place_bp.route("/places", methods=["GET"])
def get_places():
    return get_places_controller()

@place_bp.route("/places/<int:place_id>", methods=["GET"])
def get_place(place_id):
    return get_place_controller(place_id)

@place_bp.route("/places/<int:place_id>", methods=["PUT"])
def update_place(place_id):
    data = request.get_json()
    return update_place_controller(place_id, data)

@place_bp.route("/places/<int:place_id>", methods=["DELETE"])
def delete_place(place_id):
    return delete_place_controller(place_id)


    