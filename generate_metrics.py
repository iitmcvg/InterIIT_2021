from sklearn import metrics
import numpy as np
import pandas as pd
import seaborn as sn
import os
import cv2

# n = no. of classes
def get_confusion_matrix(true_labels, pred_labels,n):
    
    cm = metrics.confusion_matrix(true_labels, pred_labels)
    df_cm = pd.DataFrame(cm, range(n), range(n))
    heatmap = sn.heatmap(df_cm)
    figure = heatmap.get_figure()
    figure.savefig('conf_mat.png', dpi=400)

def get_classification_report(true_labels, pred_labels):
    class_report = metrics.classification_report(yTest.argmax(axis=1),pred1,output_dict=True)
    df = pd.DataFrame(class_report).transpose()
    df.to_csv('classification_report.csv')

def img_predict(model, path):
    images=[]
    for root, dirs, files in os.walk(path):
        for name in files:
            path_full = os.path.join(path,name)
            img = cv2.imread(path_full)
            images.append(img)
    X = np.array(images)
    X = X.astype("float32")/255.0
    y_pred = model.predict(X)
    
    return y_pred