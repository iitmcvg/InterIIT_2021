import albumentations as A
import cv2
import glob
import  numpy as np
import  random
import os
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import csv
from itertools import cycle,islice

IMG_SHAPE = 48
NUM_CLASSES = 43


class augmentation:
    def __init__(self,class_id,dict_transform,num_target_imgs):

        self.class_id = class_id
        self.shift = dict_transform['shift']
        self.scale = dict_transform['scale']
        self.rotate = dict_transform['rotate']
        self.brightness = dict_transform['brightness']
        self.contrast = dict_transform['contrast']
        self.motion_blur = dict_transform['motion_blur']
        self.rain = dict_transform['rain']
        self.fog = dict_transform['fog']
        self.target = num_target_imgs

    def load_data(self):
        print('reading class id : .{}'.format(self.class_id))

        pr_dir_load = r'C:\Users\Shreyas\PycharmProjects\inter-IIT\archive\Train'
        pr_dir_save = r'C:\Users\Shreyas\PycharmProjects\inter-IIT\Trial'
        self.dir = str(self.class_id)
        path_load = os.path.join(pr_dir_load, self.dir)
        self.imgs = [mpimg.imread(file) for file in
                glob.glob(path_load + "/*.png")]
        self.len = len(self.imgs)
        self.path_save = os.path.join(pr_dir_save, self.dir)
        os.mkdir(self.path_save)


    def setup_pipeline(self):

        tranform_list = []

        if self.scale : tranform_list.append(A.RandomScale(scale_limit=(-0.2,0.2)))
        if self.rotate : tranform_list.append(A.Rotate(limit=60,p=0.8))
        if self.shift : tranform_list.append( A.ShiftScaleRotate(shift_limit=0.2, scale_limit=0.0, rotate_limit= 0, interpolation= 1, border_mode=4, p=0.8))
        if self.brightness : tranform_list.append(A.RandomBrightness(limit=(-0.1, 0.2),p=0.8))
        if self.contrast: tranform_list.append(A.RandomContrast(limit=(-0.1, 0.2), p=0.8))
        if self.motion_blur : tranform_list.append(A.MotionBlur(p=0.5, blur_limit=7))
        if self.fog : tranform_list.append(A.RandomFog(fog_coef_lower=0.5, fog_coef_upper=0.6, alpha_coef=0.05, p=0.7))
        if self.rain :tranform_list.append( A.RandomRain(brightness_coefficient=0.9, drop_width=1, blur_value=3, p=0.5))

        self.transform = A.Compose(tranform_list)

    def augment(self):
        transformed_imgs = []
        data = []
        count = 0

        for img in list(islice(cycle(self.imgs),0,self.target)):
            img = cv2.resize(img, (48, 48))
            transformed_img = self.transform(image = img)['image']
            transformed_imgs.append(transformed_img)
            plt.imsave(self.path_save + '/' + str(count) + '.png', transformed_img)
            data.append([count, '\Train_augmented' + '\\' + self.dir + '/' + str(count) + '.png'])
            count += 1

        return transformed_imgs


for i in range(NUM_CLASSES):
    aug = augmentation(class_id=i, dict_transform={"shift": 1, 'scale': 1, 'rotate': 1, 'brightness': 1, 'contrast': 1,
                                                   'motion_blur': 1, 'rain': 1, 'fog': 1}, num_target_imgs=4000)
    aug.load_data()
    aug.setup_pipeline()
    imgs = aug.augment()












