# InterIIT_2021
Repository for the Bosch's Traffic Sign Recognition challenge 

The entire pipleine has been integrated in our UI, however if there is a need all the deep learning modules can be called individually as follows:

Usage:
- Augmentations  
We can get the augmentations config file (aug.json) from the UI, or you can manually provide it
```
from augmentations import *
import json
import os
path_to_aug_json = "aug.json"

with open(path_to_aug_json) as f:
  data = json.load(f)

train_data_root = "Train_dummy/"
new_train_data_root = "Train_dummy_augmented/"
os.makedirs(new_train_data_root,exist_ok=True)

generate_augented_dataset(data, train_data_root, new_train_data_root)
```

- Training our model  
For training the model and logging the results for our UI and the MLFlow server

```
new_train_data_root = "Train_dummy_augmented/"
test_data_root = "Test_dataset_48_classes"

run_id = 'a56e04bce6fc41949f03f187221be156'
model_path,run_id = train_classifier(new_train_data_root, test_data_root, run_id)
```

- Model evaluation  
Computing evaluation metrics and logging them
```
from model_eval import *

test_data_root = "Test_dummy/"
model_path = "latest_model"
model_eval_fns(test_data_root, model_path, classes, run_id)
```

- Model visulalization  
Model visulalization techniques such as occlusion sensitivity maps, activation maps,etc
```
from model_viz import *
test_data_root = "Train_dummy/"
model_path = "final_model_test.h5"

run_id = 'a56e04bce6fc41949f03f187221be156'
viz_classes = ['2','5'] 

visualize_main(test_data_root, model_path, run_id, viz_classes)
```

Our classes (including 5 addditional classes) are

    0 : "Speed limit 20km/h",
    1 : "Speed limit 30km/h",
    2 : "Speed limit 50km/h",
    3 : "Speed limit 60km/h",
    4 : "Speed limit 70km/h",
    5 : "Speed limit 80km/h",
    6 : "End of speed limit 80km/h",
    7 : "Speed limit 100km/h",
    8 : "Speed limit 120km/h",
    9 : "No passing",
    10 : "No passing veh over 3.5 tons",
    11 : "Right-of-way at intersection",
    12 : "Priority road",
    13 : "Yield",
    14 : "Stop",
    15 : "No vehicles",
    16 : "Veh over 3.5 tons prohibited",
    17 : "No entry",
    18 : "General caution",
    19 : "Dangerous curve left",
    20 : "Dangerous curve right",
    21 : "Double curve",
    22 : "Bumpy road",
    23 : "Slippery road",
    24 : "Road narrows on the right",
    25 : "Road work",
    26 : "Traffic signals",
    27 : "Pedestrians",
    28 : "Children crossing",
    29 : "Bicycles crossing",
    30 : "Beware of ice/snow",
    31 : "Wild animals crossing",
    32 : "End speed passing limits",
    33 : "Turn right ahead",
    34 : "Turn left ahead",
    35 : "Ahead only",
    36 : "Go straight or right",
    37 : "Go straight or left",
    38 : "Keep right",
    39 : "Keep left",
    40 : "Roundabout mandatory",
    41 : "End of no passing",
    42 : "End no passing veh over 3.5 tons",
    43 : "Parking",
    44 : "No parking",
    45 : "speed bump hump",
    46 : "No Right",
    47 : "Priority to",

Apart from our own custom UI, we are also leveraging MLflow which is an open source platform to manage the ML lifecycle, including experimentation, reproducibility, deployment, and a central model registry.

To access the MLFlow UI, you can run in the root folder
```
  mlflow ui 
```

To start an mlflow-server manually with a GCP backend and SQLite database
```
mlflow server \
--backend-store-uri sqlite:///mlflow.db \
--default-artifact-root gs://mlflow_artifacts_storage/artifacts/ \
--host 0.0.0.0
```
Use `mlflow.set_tracking_uri("https://35.198.166.98:5000") ` in code to log to a remote mlflow server