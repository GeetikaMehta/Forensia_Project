from flask import Flask
from flask_cors import CORS
from .auth import auth_bp
from .feedback import feedback_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(feedback_bp)
    
    return app 