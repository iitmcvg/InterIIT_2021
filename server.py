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

from model_viz import visualize_main
from augment import augmentation
import model_eval as modelEval

from model_eval import *
import augmentations
from start_train import train_classifier

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

    with open('combined_classification.csv', 'w', newline='') as outcsv:
        writer = csv.DictWriter(outcsv, fieldnames = ["SignName","precision","recall","f1-score","support"])
        writer.writeheader()

        with open('./run_latest/classification_report.csv', 'r', newline='') as incsv:
            reader = csv.reader(incsv)
            writer.writerows({'SignName': row[0],'precision': row[1],"recall": row[2],"f1-score": row[3],"support": row[4]} for row in reader)
        incsv.close()
    outcsv.close()
    with open('combined_classification.csv') as file:
        reader = csv.DictReader(file, delimiter=',')
        for index, row in enumerate(reader):
            matrixValues.append({'SignName':row['SignName'],'precision':row['precision'],'recall':row['recall'],'f1_score':row['f1-score'],'support':row['support']})

    file.close()

    file.close()
    pca_analysis=pca.read()
    data = r.read()
    train = open("./run_latest/finetune_train_acc.png",'rb')
    finetune_acc = train.read()
    train.close()
    train = open('./run_latest/finetune_train_loss.png','rb')
    finetune_loss = train.read()
    train.close()
    train = open('./run_latest/full_train_loss.png','rb')
    full_loss = train.read()
    train.close()
    train = open('./run_latest/full_train_loss.png','rb')
    full_acc = train.read()
    train.close()
    emit('results',{"img": data,"matrix": matrixValues,"pca": pca_analysis,'finetune_acc': finetune_acc,'finetune_loss': finetune_loss,'full_loss': full_loss,'full_acc': full_acc})
    r.close()
    pca.close()

@socketio.on('visualize')
def handle_input(results):
    r = open("run_latest/occ_maps/occ_map_2.png", 'rb')
    pca = open("run_latest/occ_maps/occ_map_5.png", 'rb')

    file.close()

    file.close()
    pca_analysis=pca.read()
    data = r.read()
    train = open("run_latest/interm_outputs/2/block2a_activation.jpg",'rb')
    finetune_acc = train.read()
    train.close()
    train = open('run_latest/interm_outputs/2/block3a_activation.jpg','rb')
    finetune_loss = train.read()
    train.close()
    train = open('run_latest/interm_outputs/5/block2a_activation.jpg','rb')
    full_loss = train.read()
    train.close()
    train = open('run_latest/interm_outputs/5/block3a_activation.jpg','rb')
    full_acc = train.read()
    train.close()
    emit('results',{"img": data,"pca": pca_analysis,'finetune_acc': finetune_acc,'finetune_loss': finetune_loss,'full_loss': full_loss,'full_acc': full_acc})
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
    dump = open(data['file'], "a")
    json.dump(data['data'], dump)
    dump.close()

@socketio.on('train')
def handle_input(optionsDict):
    path_to_aug_json = "aug.json"
    path_to_defaug_json = "defaug.json"

    with open(path_to_aug_json) as f:
        aug = json.load(f)

    with open(path_to_defaug_json) as f:
        defaug = json.load(f)

    train_data_root = "train/"
    new_train_data_root = "train_augmented/"
    test_data_root = "test/"
    run_id = 'a56e04bce6fc41949f03f187221be156'

    os.makedirs(new_train_data_root,exist_ok=True)

    weight_mapping = {
        'Pretrained weights': 'pretrained',
        'Best Weights': 'best_weights',
        'From scratch': 'scratch'
        }

    model_mapping = {
        'EfficientNet': 'efficientnet',
        '2 Layer ConvNet': '2layer_conv',
        'ResNet50': 'resnet'
        }

    # Choosing augmentation
    if optionsDict['aug'] == 'Configured params':
        augmentations.generate_augented_dataset(aug, train_data_root, new_train_data_root)
    elif optionsDict['aug'] == 'Default params':
        augmentations.generate_augented_dataset(defaug, train_data_root, new_train_data_root)
    elif optionsDict['aug'] == 'No augmentation':
        new_train_data_root = train_data_root

    model_path,run_id = train_classifier(new_train_data_root, test_data_root, train_type=weight_mapping[optionsDict['weights']], cnn_model=model_mapping[optionsDict['model']])

    # ## Model evaluation
    model_path = "final_model_test.h5"
    model_eval_fns(test_data_root, model_path, run_id)

    # ##Model visulalization
    viz_classes = ['2','5']
    visualize_main(test_data_root, model_path, run_id, viz_classes)
    return emit('train', True)

if __name__ == '__main__':
    app.config['SECRET_KEY'] = 'BlaBlaBla'
    CORS(app)
    socketio.run(app)
