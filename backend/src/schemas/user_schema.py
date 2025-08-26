from marshmallow import Schema, fields


class UserSignupSchema(Schema):
    firstName = fields.Str(required=True)
    lastName = fields.Str(required=True)
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    password = fields.Str(required=True)
