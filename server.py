import os
import warnings
import argparse
import yaml
import csv
import random
import string
import shutil
import json
import base64

from flask           import Flask, request
from flask_cors      import CORS
from flask_socketio  import SocketIO, emit, disconnect

from augment import augmentation
import model_eval as modelEval

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

dir_load = { "op":r'./data/', "preview":r'./data-pre/' }
dir_save = { "op":r'./data-augmented/', "preview":r'./data-post/' }

augpreview = augmentation(class_id=0, dict_transform=[], transform_vals=[], num_target_imgs=15, flag="preview")

@app.route('/', defaults={'path': ''})
@app.route('/<path>')
def handler(path):
    return app.send_static_file('index.html')

@socketio.on('predict')
def handle_input(images):
    data = images.replace("data:image/jpeg;base64,", "")
    data = data.replace("data:image/png;base64,", "")
    imgdata = base64.b64decode(data)
    with open("./data-eval/imageToSave.png", "wb") as fh:
        fh.write(imgdata)
    fh.close()
    modelEval.predict_to_csv('./data-eval/imageToSave.png')
    pieValues = []
    headerList = ['Value', 'SignName']
    with open('combined_predict.csv', 'w', newline='') as outcsv:
        writer = csv.DictWriter(outcsv, fieldnames = ["Value", "SignName"])
        writer.writeheader()

        with open('predict_backend.csv', 'r', newline='') as incsv:
            reader = csv.reader(incsv)
            writer.writerows({'Value': row[0], 'SignName': row[1]} for row in reader)
        incsv.close()
    outcsv.close()
    with open('combined_predict.csv') as file:
        reader = csv.DictReader(file, delimiter=',')
        for index, row in enumerate(reader):
            pieValues.append({'name':row['SignName'],'value':row['Value'],'title':'Graph 1'})
    file.close()
    return emit('predict',pieValues)

@socketio.on('results')
def handle_input(results):
    r = open("./run_latest/conf_mat.png", 'rb')
    pca = open("./run_latest/pca_analysis.png", 'rb')
    matrixValues=[]
    with open('./run_latest/classification_report.csv') as file:
        reader = csv.DictReader(file, delimiter=',')
        for index, row in enumerate(reader):
            matrixValues.append({'precision':row['precision'],'recall':row['recall'],'f1_score':row['f1-score'],'support':row['support']})
    file.close()
    pca_analysis=pca.read()
    data = r.read()
    emit('results',{"img": data,"matrix": matrixValues,"pca": pca_analysis})
    r.close()
    pca.close()

@socketio.on('dirlist')
def handle_input():
    classnames = []
    sublist = os.listdir(dir_load["op"])
    with open('signnames.csv') as file:
        reader = csv.DictReader(file, delimiter=',')
        for index, row in enumerate(reader):
            classnames.append({'dir':index,'name':row['SignName'], 'num':len(os.listdir(dir_load["op"]+sublist[index]))})
    return emit('dirlist', classnames)        

@socketio.on('augsetdir')
def handle_input(dirlist):
    c = 15

    for files in os.listdir(dir_load["preview"]):
        path = os.path.join(dir_load["preview"], files)
        os.remove(path)

    while c > 0:
        l = 0
        for i in dirlist:
            direc = os.path.join(dir_load["op"], str(i))
            direcl = os.listdir(direc)
            direcl.sort()

            shutil.copy(direc + "/" + direcl[l], dir_load["preview"])
            c -= 1
            l += 1
            if c <= 0:
                break

@socketio.on('augpreview')
def handle_input(transform):
    if transform :
        augpreview.load_data()
        augpreview.setup_pipeline(transform)
        augpreview.augment(save=True)
        
        res = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 5))
        direc = os.listdir(dir_save["preview"])
        direc.sort()
        
        for i in direc:
            r = open(dir_save["preview"] + i, 'rb')
            data = r.read()
            emit('augpreview',{"c" : res, "img": data})
            r.close()
            os.remove(dir_save["preview"] + i)
    else:
        res = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 5))
        direc = os.listdir(dir_load["preview"])
        direc.sort()

        for i in direc:
            r = open(dir_load["preview"] + i, 'rb')
            data = r.read()
            emit('augpreview',{"c" : res, "img": data})
            r.close()
    return 1

@socketio.on('augment')
def handle_input(data):
    dump = open("aug.json", "a")
    json.dump(data, dump)
    dump.close()

if __name__ == '__main__':
    app.config['SECRET_KEY'] = config['socket_secret']
    CORS(app)
    socketio.run(app)