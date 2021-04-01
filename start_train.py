import os
import time
import mlflow 
import matplotlib.pyplot as plt
import numpy as np
import os
import PIL
import tensorflow as tf
from PIL import Image
from tqdm.notebook import tqdm
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.layers.experimental import preprocessing
from tensorflow.keras.models import Sequential
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D,Dropout,Dense,Flatten,MaxPooling2D
from tensorflow.keras.optimizers import SGD
from tensorflow.keras.callbacks import ModelCheckpoint,LearningRateScheduler

import mlflow.tensorflow

mlflow.set_tracking_uri("sqlite:///mydb.sqlite")

mlflow.tensorflow.autolog()

def save_train_curves(history, path):
    plt.figure()
    plt.plot(history.history['accuracy'])
    plt.plot(history.history['val_accuracy'])
    plt.title('model accuracy')
    plt.ylabel('accuracy')
    plt.xlabel('epoch')
    plt.legend(['train', 'val'], loc='upper left')
    plt.savefig(path+"acc.png")

    plt.figure()
    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title('model loss')
    plt.ylabel('loss')
    plt.xlabel('epoch')
    plt.legend(['train', 'val'], loc='upper left')
    plt.savefig(path+"loss.png")

def cnn_model():
    model = Sequential()

    IMG_SIZE = 224
    NUM_CLASSES = 48
    
    model.add(Conv2D(32, (3, 3), padding='same',
                     input_shape=( IMG_SIZE, IMG_SIZE ,3),
                     activation='relu'))
    model.add(Conv2D(32, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.2))

    model.add(Conv2D(64, (3, 3), padding='same',
                     activation='relu'))
    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.2))

    model.add(Conv2D(128, (3, 3), padding='same',
                     activation='relu'))
    model.add(Conv2D(128, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.2))

    model.add(Flatten())
    model.add(Dense(512, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(NUM_CLASSES, activation='softmax'))

    model.summary()
    return model

def train_classifier(train_data_root, test_data_root, train_type='pretrained', cnn_model = 'efficientnet', given_model_path = None):
    '''
        Train the classifier model 
        and log results to MLFlow server
        and to our UI backend

        train_type 
         -> pretrained   - imagenet weights
         -> best_weights - from the best model we provide
         -> scratch      - completely from scratch
        
        cnn_model
         -> efficientnet 
         -> 2layer_conv
         -> resnet
    '''
    print("Start training")
    folder_path = "run_latest/"
    os.makedirs(folder_path, exist_ok=True)
    with mlflow.start_run(run_name='Classifier train') as run:
        # mlflow.set_tag("Canteen", config['canteen_name'])
        run_id = run.info.run_id

        IMG_SIZE=224
        NUM_CLASSES=48
        

        train_dataset = tf.keras.preprocessing.image_dataset_from_directory(
            train_data_root,
            validation_split=0.2,
            subset="training",
            seed=123,
            image_size=(IMG_SIZE, IMG_SIZE),
            batch_size=32)    

        validation_dataset = tf.keras.preprocessing.image_dataset_from_directory(
            train_data_root,
            validation_split=0.2,
            subset="validation",
            seed=123,
            image_size=(IMG_SIZE, IMG_SIZE),
            batch_size=32)

        test_dataset = tf.keras.preprocessing.image_dataset_from_directory(
            test_data_root,
            image_size=(IMG_SIZE, IMG_SIZE),
            batch_size=32)    

        AUTOTUNE = tf.data.experimental.AUTOTUNE
        train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
        test_dataset = test_dataset.prefetch(buffer_size=AUTOTUNE)
        validation_dataset = validation_dataset.prefetch(buffer_size=AUTOTUNE)
        
        preprocess_input = tf.keras.applications.efficientnet.preprocess_input
        rescale = tf.keras.layers.experimental.preprocessing.Rescaling(1./127.5, offset= -1)
        # Create the base model from the pre-trained model MobileNet V2
        IMG_SHAPE = (224, 224) + (3,)

        if cnn_model == 'resnet':
            base_model = tf.keras.applications.ResNet152V2(input_shape=IMG_SHAPE,
                                                        include_top=False,
                                                        weights='imagenet')

        base_model = EfficientNetB0(include_top=False, weights='imagenet')
        if train_type == 'best_weights':
            model_full = tf.keras.models.load_model(given_model_path)
            base_model = model_full.get_layer('efficientnetb0')
        if train_type == 'scratch':
            base_model = EfficientNetB0(include_top=False)
        

        image_batch, label_batch = next(iter(train_dataset))
        feature_batch = base_model(image_batch)
        print(feature_batch.shape)

        base_model.trainable = False
        global_average_layer = tf.keras.layers.GlobalAveragePooling2D()
        feature_batch_average = global_average_layer(feature_batch)
        print(feature_batch_average.shape)

        prediction_layer = tf.keras.layers.Dense(NUM_CLASSES,activation='softmax')
        prediction_batch = prediction_layer(feature_batch_average)
        print(prediction_batch.shape)

        inputs = tf.keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3))
        #y = rescale(inputs)
        x = preprocess_input(inputs)
        x = base_model(x, training=False)
        x = global_average_layer(x)
        x = tf.keras.layers.Dropout(0.2)(x)
        outputs = prediction_layer(x)
        model = tf.keras.Model(inputs, outputs)
        
        base_learning_rate = 0.001
        model.compile(optimizer=tf.keras.optimizers.Adam(lr=base_learning_rate),
                        loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
                        metrics=['accuracy'])

        checkpoint2=tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',patience=1, verbose=1,
            restore_best_weights=True
        )

        history = model.fit(train_dataset,
                            epochs=2,
                            callbacks=[checkpoint2],
                            validation_data=validation_dataset)
        
        save_train_curves(history, folder_path+"full_train_")

        ## Fine-tuning
        base_model.trainable = True
        # Fine-tune from this layer onwards
        fine_tune_at = 150
        # Freeze all the layers before the `fine_tune_at` layer
        for layer in base_model.layers[:fine_tune_at]:
            layer.trainable =  False

        if train_type == 'scratch':
            for layer in base_model.layers:
                layer.trainable =  True

        if cnn_model == '2layer_conv':
            model = cnn_model()

        model.compile(loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=False),
              optimizer = tf.keras.optimizers.Adam(lr=base_learning_rate/10),
              metrics=['accuracy'])
        print(model.summary())

        model_path = "weights_final.hdf5"
        checkpoint1=tf.keras.callbacks.ModelCheckpoint(
            model_path,
            monitor="val_loss",
            verbose=0,
            save_best_only=True,
            save_weights_only=True
            
        )

        checkpoint2=tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',patience=1, verbose=1,
            restore_best_weights=True
        )

        history_fine = model.fit(train_dataset,
                                epochs=10,
                                callbacks=[checkpoint1,checkpoint2],
                                validation_data=validation_dataset)
        save_train_curves(history_fine, folder_path+"finetune_train_")

        loss, acc = model.evaluate(test_dataset)
        print(loss,acc, " on test dataset")

        ## Save the model
        model.load_weights(model_path)

        model_path_full = 'final_model_test.h5'
        model.save(model_path_full)

        ## MLFlow logging
        # params = {
        #     "Number of train images ":model.num_examples,
        #     "Model type":model.model,
        #     "Model train time": str(datetime.timedelta(seconds = round(model.training_time))) ,
        #     "Model input":model.input_image_shape,
        #     "Model output dim" : 1000
        # }

        # metrics = {
        #     "Accuracy": train_metrics["accuracy"],
        #     "Precision": train_metrics["precision"],
        #     "Recall": train_metrics["recall"],
        #     "f1_score": train_metrics["f1_score"],
        #     "auc" : train_metrics["auc"],         

        # }

        # artifacts = [model_path, ftr_xtr_path, train_cnf_matrix_path]
                

        # mlflow.log_params(params)
        # mlflow.log_metrics(metrics)
        # for key in artifacts:
        #     mlflow.log_artifact(key)

    return model_path_full,run_id

if __name__ == "__main__":
    train_data_root = "datasets/Train_augmented"
    test_data_root = "datasets/Test_dataset_48_classes"
    model_path, run_id = train_classifier(train_data_root, test_data_root)