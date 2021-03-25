## Model visulalization

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.layers.experimental import preprocessing
from tensorflow.keras.models import Sequential
from tensorflow.keras.applications import EfficientNetB0
import random
import pickle
import os
import cv2
from PIL import Image
import mlflow

def occlusion(model, image, label, occ_size=50, occ_stride=50, occ_pixel=0.5):
    
    with open('mapping.pickle', 'rb') as handle:
        mapping = pickle.load(handle)
    inv_mapping = {v: k for k, v in mapping.items()}

    width, height = 224, 224

    output_height = int(np.ceil((height-occ_size)/occ_stride))
    output_width = int(np.ceil((width-occ_size)/occ_stride))
    
    heatmap = np.zeros((output_height, output_width))
    
    for h in range(0, height):
        for w in range(0, width):
            
            h_start = h*occ_stride
            w_start = w*occ_stride
            h_end = min(height, h_start + occ_size)
            w_end = min(width, w_start + occ_size)
            
            if (w_end) >= width or (h_end) >= height:
                continue
            input_image = np.copy(image)
            input_image[ w_start:w_end, h_start:h_end,:] = occ_pixel
            output = model.predict(input_image.reshape(1,224,224,3))
            prob = output[0][inv_mapping[label]]
            heatmap[h, w] = prob 

    return heatmap, max(output[0])

def occlusion_maps(model, test_dir, occ_map_classes, run_id, img_paths=None):

    IMG_SIZE = 224
    NUM_CLASSES=48

    with open('mapping.pickle', 'rb') as handle:
        mapping = pickle.load(handle)
    inv_mapping = {v: k for k, v in mapping.items()}
    os.makedirs("run_latest/occ_maps/",exist_ok=True)

    for i,label in enumerate(occ_map_classes):
        if img_paths == None:
            # img_path = os.listdir(test_dir+label)[0]
            img_path = random.sample(os.listdir(test_dir+label),1)[0]
            img_path = test_dir+label+"/"+img_path
        else:
            img_path = img_paths[i]

        image = cv2.imread(img_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = cv2.resize(image,(IMG_SIZE,IMG_SIZE))

        image = np.expand_dims(image, axis=0)
        pred = model.predict(image)[0]
        pred_label = np.argmax(pred)

        print(label, mapping[pred_label])
        
        plt.figure()
        heatmap, prob_no_occ = occlusion(model, image , label , 14, 10)
        imgplot = sns.heatmap(heatmap, xticklabels=False, yticklabels=False, vmax=prob_no_occ)

        figure = imgplot.get_figure()    
        path = 'run_latest/occ_maps/occ_map_{}.png'.format(label)
        figure.savefig(path, dpi=400)
        with mlflow.start_run(run_id=run_id):
            mlflow.log_artifact(path)

def activation_maps(model_path, test_dir, layers_name, viz_classes, run_id, img_paths=None):

    IMG_SIZE = 224
    NUM_CLASSES = 48

    model_full = tf.keras.models.load_model(model_path)
    model = model_full.get_layer('efficientnetb0')

    for k,label in enumerate(viz_classes):
        if img_paths == None:
            # img_path = os.listdir(test_dir+label)[0]
            img_path = random.sample(os.listdir(test_dir+label),1)[0]
            img_path = test_dir+label+"/"+img_path
        else:
            img_path = img_paths[k]

        # Image to pass as input
        img = tf.keras.preprocessing.image.load_img(img_path, target_size=(224, 224))
        img = tf.keras.preprocessing.image.img_to_array(img)

        # Get the outputs of layers we want to inspect
        outputs = [
            layer.output for layer in model.layers
            if layer.name in layers_name
        ]

        # Create a connection between the input and those target outputs
        activations_model = tf.keras.models.Model(model.inputs, outputs=outputs)
        activations_model.compile(optimizer='adam', loss='categorical_crossentropy')


        # Get their outputs
        activations_1 = activations_model.predict(np.array([img]))
        sizes = [5,8,10]
        plt.axis('off')
        plt.xticks([])
        plt.yticks([])

        for activations,layer_name,size in zip(activations_1,layers_name,sizes):
            print()
            fig = plt.figure()
            fig, ax = plt.subplots(nrows=size, ncols=size)
            for i in range(size):
                for j in range(size):
                    ax[i,j].imshow(activations[0,:,:,size*i+j])
                    ax[i,j].set_yticklabels([])
                    ax[i,j].set_xticklabels([])
            # plt.title("{} layer visualization".format(layer_name))
            idf = label
            os.makedirs("run_latest/interm_outputs/{}/".format(idf),exist_ok=True)
            path = 'run_latest/interm_outputs/{}/{}.jpg'.format(idf,layer_name)
            fig.savefig(path)
            with mlflow.start_run(run_id=run_id):
                mlflow.log_artifact(path)

def activation_maximization_map(model_path):
    # Layer name to inspect
    layer_name = 'block3a_activation'

    epochs = 100
    step_size = 1.
    filter_index = 0

    # Create a connection between the input and the target layer
    model_full = tf.keras.models.load_model(model_path)
    submodel = model_full.get_layer('efficientnetb0')

    # Initiate random noise
    input_img_data = np.random.random((1, 224, 224, 3))
    input_img_data = (input_img_data - 0.5) * 20 + 128.

    # Cast random noise from np.float64 to tf.float32 Variable
    input_img_data = tf.Variable(tf.cast(input_img_data, tf.float32))

    # Iterate gradient ascents
    for _ in range(epochs):
        with tf.GradientTape() as tape:
            outputs = submodel(input_img_data)
            loss_value = tf.reduce_mean(outputs[:, :, :, filter_index])
        grads = tape.gradient(loss_value, input_img_data)
        normalized_grads = grads / (tf.sqrt(tf.reduce_mean(tf.square(grads))) + 1e-5)
        input_img_data.assign_add(normalized_grads * step_size)
    cv2.imwrite("run_latest/activation_max_map",input_img_data)

def visualize_main(test_dir, model_path, run_id, viz_classes):
    test_dir = "/home/lordgrim/Final_interiit/datasets/Train_dummy/"
    model_path = "/home/lordgrim/Final_interiit/final_model_test.h5"
    model = tf.keras.models.load_model(model_path)

    occlusion_maps(model, test_dir, viz_classes,run_id)

    layers_name = ['block1a_activation','block2a_activation','block3a_activation']

    activation_maps(model_path, test_dir,layers_name, viz_classes,run_id)
