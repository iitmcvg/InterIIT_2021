import cv2
import glob
import pandas as pd
import  numpy as np
from  tensorflow.keras.models import Sequential
from  tensorflow.keras.layers import Conv2D,Dropout,Dense,Flatten,MaxPooling2D
from tensorflow.keras.optimizers import SGD
from tensorflow.keras.callbacks import ModelCheckpoint,LearningRateScheduler
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report,confusion_matrix
NUM_CLASSES = 43
IMG_SIZE = 48

def read_train_data():
    dir = r'C:\Users\Shreyas\PycharmProjects\inter-IIT\archive'
    df1 = pd.read_csv(dir + '\\' + 'train.csv')
    paths = df1['Path']
    class_id_train = df1['ClassId']


    images_train = []
    for path in paths:
        img = preprocess_img(cv2.imread(dir + '\\' + path))
        images_train.append(img)





    return  np.array(images_train),np.eye(NUM_CLASSES)[class_id_train]


def read_test_data():
    dir = r'C:\Users\Shreyas\PycharmProjects\inter-IIT\archive'
    df2 = pd.read_csv(dir + '\\' + 'test.csv')
    paths = df2['Path']
    class_id_test = df2['ClassId']

    images_test = []
    for path in paths:
        images_test.append(cv2.resize(cv2.imread(dir + '\\' + path), (IMG_SIZE, IMG_SIZE)))

    return  np.array(images_test), np.eye(NUM_CLASSES)[class_id_test]

def preprocess_img(img):
    # Histogram normalization in v channel

    # central square crop
    min_side = min(img.shape[:-1])
    centre = img.shape[0] // 2, img.shape[1] // 2
    img = img[centre[0] - min_side // 2:centre[0] + min_side // 2,
              centre[1] - min_side // 2:centre[1] + min_side // 2,
              :]
    img = img/255.0

    # rescale to standard size
    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
    return img



#def visualize_data():



def cnn_model(train=True):
    model = Sequential()

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
    if train == False:
        model.load_weights('model.h5')
    model.summary()
    return model




def train(X,Y):
    # train the model using SGD + momentum

    X_train, X_val, Y_train, Y_val = train_test_split(X, Y, test_size=0.2)
    model = cnn_model()
    lr = 0.001
    sgd = SGD(lr=lr, decay=1e-6, momentum=0.9, nesterov=True)
    model.compile(loss='categorical_crossentropy',
                  optimizer=sgd,
                  metrics=['accuracy'])

    def lr_schedule(epoch):
        return lr * (0.1 ** int(epoch / 10))

    batch_size = 32
    epochs = 20

    history = model.fit(X_train, Y_train,
                        batch_size=batch_size,
                        epochs=epochs,
                        validation_data=(X_val, Y_val),
                        callbacks=[LearningRateScheduler(lr_schedule),
                                   ModelCheckpoint('model.h5', save_best_only=True)], verbose=1)

    plt.plot(history.history['acc'])
    plt.plot(history.history['val_acc'])
    plt.title('model accuracy')
    plt.ylabel('accuracy')
    plt.xlabel('epoch')
    plt.legend(['train', 'test'], loc='upper left')
    plt.show()
    # summarize history for loss
    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title('model loss')
    plt.ylabel('loss')
    plt.xlabel('epoch')
    plt.legend(['train', 'test'], loc='upper left')
    plt.show()




def evaluate(Xt,Yt):
    model = cnn_model(train=False)
    lr = 0.001
    sgd = SGD(lr=lr, decay=1e-6, momentum=0.9, nesterov=True)
    model.compile(loss='categorical_crossentropy',
                  optimizer=sgd,
                  metrics=['accuracy'])

    def lr_schedule(epoch):
        return lr * (0.1 ** int(epoch / 10))
    score = model.evaluate(Xt,Yt,verbose=0)
    print('test_loss :' ,score[0])
    print('test accuracy:' ,score[1])
    y_pred = model.predict_classes(Xt)
    y_true  = [np.argmax(Yt[i]) for i in range(Yt.shape[0])]

    print(classification_report(y_pred=y_pred,y_true=y_true))
    conf_mat = confusion_matrix(y_true=y_true,y_pred=y_pred)
    plt.imshow(conf_mat,cmap='Reds')
    plt.show()




X,Y = read_train_data()
train(X,Y)
Xt,Yt = read_test_data()
evaluate(Xt,Yt)