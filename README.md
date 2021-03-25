# InterIIT_2021
Repository for the Bosch's Traffic Sign Recognition challenge 

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

train_data_root = "datasets/Train_dummy/"
new_train_data_root = "datasets/Train_dummy_augmented/"
os.makedirs(new_train_data_root,exist_ok=True)

generate_augented_dataset(data, train_data_root, new_train_data_root)
```

- Training our model

```
new_train_data_root = "datasets/Train_dummy_augmented/"
test_data_root = "datasets/Test_dataset_48_classes"

run_id = 'a56e04bce6fc41949f03f187221be156'
model_path,run_id = train_classifier(new_train_data_root, test_data_root, run_id)
```

- Model evaluation
```
from model_eval import *

## Model evaluation
test_dataset_dir = "datasets/Test_dummy/"
model_path = "latest_model"
model_eval_fns(test_dataset_dir, model_path, classes, run_id)
```



Our classes are

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
