import albumentations as A
import cv2
import glob
import numpy as np
import random
import os
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import csv
from itertools import cycle,islice

IMG_SHAPE = 48
NUM_CLASSES = 43

dir_load = {'op' : r'./data/', 'preview' : r'./data-pre/'}
dir_save = {'op' : r'./data-augmented/', 'preview' : r'./data-post/'}

class augmentation:
    def __init__(self,class_id,dict_transform,transform_vals,num_target_imgs, flag):
        self.class_id = class_id
        self.target = num_target_imgs
        self.transform_vals = transform_vals
        self.flag = flag

    def load_data(self):
        print('reading class id : {}'.format(self.class_id))

        self.dir_load = dir_load[self.flag]
        self.dir_save = dir_save[self.flag]

        self.dir = str(self.class_id)
        if self.flag == "op":
            self.path_load = os.path.join(self.dir_load, self.dir)
        else:
            self.path_load = self.dir_load
        self.imgs = [mpimg.imread(file) for file in
                glob.glob(self.path_load + "/*.png")]
        self.len = len(self.imgs)

        print('number of images : {}'.format(self.len))

    def setup_pipeline(self, dict_transform):

        tranform_list = []
        if 'shadow' in dict_transform: tranform_list.append(A.RandomShadow(shadow_roi=(0, 0.5, 1, 1),num_shadows_upper=1,p=0.2))
        if 'scale' in dict_transform: tranform_list.append(A.RandomScale(scale_limit=float(dict_transform['scale'])))
        if 'rotate' in dict_transform: tranform_list.append(A.Rotate(limit=float(dict_transform['rotate']),p=0.8))
        if 'shift' in dict_transform: tranform_list.append( A.ShiftScaleRotate(shift_limit=float(dict_transform['shift']), scale_limit=0.0, rotate_limit= 0, interpolation= 1, border_mode=4, p=0.8))
        if 'brightness' in dict_transform: tranform_list.append(A.RandomBrightness(limit=float(dict_transform['brightness']),p=0.8))
        if 'contrast' in dict_transform: tranform_list.append(A.RandomContrast(limit=float(dict_transform['contrast']), p=0.8))
        if 'motion_blur' in dict_transform: tranform_list.append(A.MotionBlur(p=0.5, blur_limit=7))
        if 'fog' in dict_transform: tranform_list.append(A.RandomFog(fog_coef_lower=0.0, fog_coef_upper=float(dict_transform['fog']), alpha_coef=0.05, p=0.7))
        if 'rain' in dict_transform:tranform_list.append(A.RandomRain(brightness_coefficient=0.95, drop_width= 1, blur_value=1, p=0.7))
        if 'occlusion' in dict_transform:tranform_list.append(A.CoarseDropout(max_holes=5, max_height=8, max_width=8,p=0.5))
        self.transform = A.Compose(tranform_list)

    def augment(self,save):
        transformed_imgs = []
        data = []
        count = 0

        if save :
            if self.flag == "preview":
                self.path_save = self.dir_save
            else:
                self.path_save = os.path.join(self.dir_save, self.dir)

            if not self.dir in os.listdir(self.dir_save) and self.flag == "op":
                os.mkdir(self.path_save)

        for img in list(islice(cycle(self.imgs),0,self.target)):
            img = cv2.resize(img, (224, 224))
            transformed_img = self.transform(image = img)['image']
            transformed_imgs.append(transformed_img)
            if save :                                                                  ### saving image to directory
                plt.imsave(self.path_save + '/' + str(count) + '.png', transformed_img)
                data.append([count, '\Train_augmented' + '\\' + self.dir + '/' + str(count) + '.png'])
                count += 1

        print('class saved ' + str(self.class_id))

        if self.flag == "op":
            with open(dir_save[self.flag]+'archive\Train_augmented.csv', 'a', newline='') as file:       ### saving image name and path to a CSV file
                writer = csv.writer(file)
                writer.writerows(data)

        return transformed_imgs

def generate_augented_dataset():
     for i in range(NUM_CLASSES):

         if i == 35 or i == 38 or i == 39:  #### not rotating classes 35,38,39
             transform_list = {"shift": 1, 'scale': 1, 'rotate': 0, 'brightness': 1, 'contrast': 1,
                               'motion_blur': 1, 'rain': 1, 'fog': 1, 'generate_occlusion':1}
         else:
             transform_list = {"shift": 1, 'scale': 1, 'rotate': 1, 'brightness': 1, 'contrast': 1,
                               'motion_blur': 1, 'rain': 1, 'fog': 1,  'generate_occlusion':1}

         transform_vals = {"shift_factor": 0.2, "scale_factor": 0.2, "rot_angle": 60, "brightness_factor": 0.1,
                           "contrast_factor": 0.2, "motion_blur_factor": 4, "fog_factor": 0.4, "rain_factor": 3,  'generate_occlusion':1}

         aug = augmentation(class_id=i, dict_transform=transform_list, transform_vals=transform_vals,
                            num_target_imgs=4000)
         aug.load_data()
         aug.setup_pipeline()
         aug.augment(save=True)