import os
import torch
import jwt
import datetime
import secrets
import string
import warnings
import argparse
import logging
import yaml
import csv

from flask           import Flask, request
from flask_cors      import CORS
from flask_socketio  import SocketIO, emit, disconnect

parser = argparse.ArgumentParser()
parser.add_argument("--prod",action='store_true',help="Production configs are applied")
args = vars(parser.parse_args())

if args['prod']:
    config_file = 'prod.yaml'
    warnings.filterwarnings('ignore')
    print('Running in Production')
else:
    config_file = 'dev.yaml'
    print('Running in Dev')

with open(config_file) as f:
    config = yaml.load(f)

app = Flask(__name__, static_folder="./build", static_url_path="/")
socketio = SocketIO(app, cors_allowed_origins='*', logger=True)

jwt_secret = config['jwt_secret']
N          = config['index_seed']
alg        = 'HS256'

imgdir = './dataset/images/'
dsdir = './data/'

# model_name = 'model/' + config['model']
# model = ready(model_name)
# model.eval()

# print('Model loaded')

@app.route('/token', methods=['POST'])
def token():
    name     = request.form['username']
    password = request.form['password']

    if credential:
        # if str(credential[1]) == password:
        if password == "IITM":
            try:
                payload = {
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=0),
                    'iat': datetime.datetime.utcnow(),
                    'sub': name         
                }
                enc = jwt.encode(
                    payload,
                    jwt_secret,
                    algorithm=alg
                )
                return enc
            except:
                return '500 : JWT couldnt be generated'
        else:
            return '405 : Password Mismatch'
    else:
        return '404 : User not found'


@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def handler(path):
    return app.send_static_file('index.html')

@socketio.on('predict')
def handle_input(images):
    return emit('predict','Hi')

@socketio.on('dirlist')
def handle_input():
    classnames = []
    sublist = os.listdir(dsdir)
    with open('signnames.csv') as file:
        reader = csv.DictReader(file, delimiter=',')
        for index, row in enumerate(reader):
            classnames.append({'name':row['SignName'], 'num':len(os.listdir(dsdir+sublist[index]))})
    return emit('dirlist', classnames)        

@socketio.on('auglist')
def handle_input():

    for i in os.listdir(imgdir):
        r = open(imgdir+i, 'rb')
        data = r.read()
        emit('auglist', data)
        r.close()

    return 1

if __name__ == '__main__':
    app.config['SECRET_KEY'] = config['socket_secret']
    CORS(app)
    socketio.run(app)
