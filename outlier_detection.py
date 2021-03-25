# evaluate model performance with outliers removed using elliptical envelope
from pandas import read_csv
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.covariance import EllipticEnvelope
from sklearn.metrics import mean_absolute_error
from sklearn.neighbors import LocalOutlierFactor
import os

from sklearn import metrics, decomposition

import matplotlib.pyplot as plt

import numpy as np
import pandas as pd
import seaborn as sn
import tensorflow as tf

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.layers.experimental import preprocessing
from tensorflow.keras.models import Sequential
from tensorflow.keras.applications import EfficientNetB0


import mlflow
import pickle
import cv2

# load the dataset
# Create a connection between the input and the target layer
model_path = "final_model_test.h5"
test_data_dir  = "Test_dataset_48_classes/"

def outlier_detection(test_data_dir, model_path):

    model_full = tf.keras.models.load_model(model_path)
    model = model_full.get_layer('efficientnetb0')

    
    for folder in os.listdir(test_data_dir):
        files_all = os.listdir(folder + folder)
        img_paths = []
        X = []
        for file in files_all:
            img_path = test_data_dir + folder + "/" + file
            img_paths.append(img_path)
            img = tf.keras.preprocessing.image.load_img(img_path, target_size=(224, 224))
            img = tf.keras.preprocessing.image.img_to_array(img)

            img = np.expand_dims(img, axis=0)
            pred = model.predict(img)[0]
            X.append(pred)
        
        clf = LocalOutlierFactor(n_neighbors=20)
        y_pred = clf.fit_predict(X)
        outlier_index = where(y_pred == -1)
        print("For class id ", folder, " ", img_paths[outlier_index] "seems to be outliers")


