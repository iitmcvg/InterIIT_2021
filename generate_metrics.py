from sklearn import metrics
import numpy as np
import pandas as pd
import seaborn as sn

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