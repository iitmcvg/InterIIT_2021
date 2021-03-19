import cv2
import glob
import pandas as pd
import  numpy as np
from  tensorflow.keras.models import Sequential,Model
from  tensorflow.keras.layers import Input,Conv2D,Dropout,Dense,Flatten,MaxPooling2D,GlobalAveragePooling2D
from tensorflow.keras.preprocessing import  image
from tensorflow.keras.optimizers import SGD
from tensorflow.keras.callbacks import ModelCheckpoint,LearningRateScheduler
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report,confusion_matrix
from tensorflow.keras.applications.vgg19 import preprocess_input,VGG19
from tensorflow.keras.backend import clear_session
clear_session()


NUM_CLASSES = 43
IMG_SIZE = 48

def read_train_data():
    print('wegfgd')
    dir = r'C:\Users\Shreyas\PycharmProjects\inter-IIT\archive'
    df1 = pd.read_csv(dir + '\\' + 'Train_augmented.csv')
    paths = df1['Path']
    class_id_train = df1['ClassId']
    print('------reading images--------')

    images_train = []
    for path in paths:
        img = cv2.imread(dir + '\\' + path)
        images_train.append(img)

    return  np.array(images_train),np.eye(NUM_CLASSES)[class_id_train]


def read_test_data():
    dir = r'C:\Users\Shreyas\PycharmProjects\inter-IIT\archive'
    df2 = pd.read_csv(dir + '\\' + 'test.csv')
    paths = df2['Path']
    class_id_test = df2['ClassId']

    print('------reading images--------')
    images_test = []
    for path in paths:
        images_test.append(cv2.resize(cv2.imread(dir + '\\' + path), (IMG_SIZE, IMG_SIZE))  )

    return  np.array(images_test), np.eye(NUM_CLASSES)[class_id_test]

def visualize(X,Y):
    print('----visualize dataset-------')

    idxs = np.random.randint(low=0,high=X.shape[0],size=20)
    image = X[idxs]
    label = Y[idxs]


    fig = plt.figure(figsize=(22, 22))
    for i in range(20):
        ax = fig.add_subplot(4, 5, i+1, xticks=[], yticks=[])
        ax.imshow(image[i])
        ax.set_title(f"Label: {label[i]}")
    plt.show()




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
    if train == False  :
        model.load_weights('model_aug.h5')
    model.summary()
    return model


def cnn_model_VGG19(train=True):
    base_model = VGG19(weights='imagenet', include_top=False)

    # add a global spatial average pooling layer
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    # let's add a fully-connected layer
    x = Dense(1024, activation='relu')(x)
    # and a logistic layer -- let's say we have 200 classes
    x = Dense(512, activation='relu')(x)
    predictions = Dense(NUM_CLASSES, activation='softmax')(x)

    # this is the model we will train
    model = Model(inputs=base_model.input, outputs=predictions)

    # first: train only the top layers (which were randomly initialized)
    # i.e. freeze all convolutional InceptionV3 layers
    for layer in base_model.layers:
        layer.trainable = False

    # compile the model (should be done *after* setting layers to non-trainable)
   # model.compile(optimizer='rmsprop', loss='categorical_crossentropy')

    if train == False  :
        model.load_weights('model_VGG19.h5')
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
    epochs = 40

    history = model.fit(X_train, Y_train,
                        batch_size=batch_size,
                        epochs=epochs,
                        validation_data=(X_val, Y_val),
                        callbacks=[LearningRateScheduler(lr_schedule),
                                   ModelCheckpoint('model_aug.h5', save_best_only=True)], verbose=1)

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

    list_failures = []
    for i in range(len(y_pred)):
        if y_true[i]!=y_pred[i]:
            list_failures.append(Yt[i])
            plt.imsave('failure'+str(i)+'.png',Xt[i])
            #plt.imshow(Xt[i])
            #plt.show()
    print(len(list_failures))






#X,Y = read_train_data()
#visualize(X,Y)
#train(X,Y)
Xt,Yt = read_test_data()
evaluate(Xt,Yt)