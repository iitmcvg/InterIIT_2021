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
pr_dir_load = r'./data/'
pr_dir_save = r'./data-preview/'


class augmentation:
    def __init__(self,class_id,dict_transform,transform_vals,num_target_imgs):

        self.class_id = class_id
        self.shift = dict_transform['shift']
        self.scale = dict_transform['scale']
        self.rotate = dict_transform['rotate']
        self.brightness = dict_transform['brightness']
        self.contrast = dict_transform['contrast']
        self.motion_blur = dict_transform['motion_blur']
        self.rain = dict_transform['rain']
        self.fog = dict_transform['fog']
        self.coarse_dropout=dict_transform["generate_occlusion"]
        self.shadow=dict_transform["shadows"]
        self.target = num_target_imgs
        self.transform_vals = transform_vals

    def load_data(self):
        print('reading class id : {}'.format(self.class_id))

        self.pr_dir_load = pr_dir_load
        self.pr_dir_save = pr_dir_save

        self.dir = str(self.class_id)
        self.path_load = os.path.join(self.pr_dir_load, self.dir)
        self.imgs = [mpimg.imread(file) for file in
                glob.glob(self.path_load + "/*.png")]
        self.len = len(self.imgs)

        print('number of images : {}'.format(self.len))


    def setup_pipeline(self):

        tranform_list = []
        if self.shadow: tranform_list.append(A.RandomShadow(shadow_roi=(0, 0.5, 1, 1),num_shadows_upper=1,p=0.2))
        if self.scale : tranform_list.append(A.RandomScale(scale_limit=self.transform_vals['scale_factor'] ))
        if self.rotate : tranform_list.append(A.Rotate(limit=self.transform_vals[ "rot_angle"],p=0.8))
        if self.shift : tranform_list.append( A.ShiftScaleRotate(shift_limit=self.transform_vals['shift_factor'] , scale_limit=0.0, rotate_limit= 0, interpolation= 1, border_mode=4, p=0.8))
        if self.brightness : tranform_list.append(A.RandomBrightness(limit=self.transform_vals[ "brightness_factor"],p=0.8))
        if self.contrast: tranform_list.append(A.RandomContrast(limit=self.transform_vals["contrast_factor"], p=0.8))
        if self.motion_blur : tranform_list.append(A.MotionBlur(p=0.5, blur_limit=7))
        if self.fog : tranform_list.append(A.RandomFog(fog_coef_lower=0.0, fog_coef_upper=self.transform_vals['fog_factor'], alpha_coef=0.05, p=0.7))
        if self.rain :tranform_list.append(A.RandomRain(brightness_coefficient=0.95, drop_width= 1, blur_value= self.transform_vals["rain_factor"], p=0.7))
        if self.coarse_dropout :tranform_list.append(A.CoarseDropout(max_holes=5, max_height=8, max_width=8,p=0.5))
        self.transform = A.Compose(tranform_list)

    def augment(self,save):
        transformed_imgs = []
        data = []
        count = 0

        if save :
            self.path_save = os.path.join(self.pr_dir_save, self.dir)
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

        if save :
            with open('archive\Train_augmented.csv', 'a', newline='') as file:       ### saving image name and path to a CSV file
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
         imgs = aug.augment(save=True)
         visualize(imgs=imgs,class_id=i)


def augment_class(class_id):
    transform_list = {"shift": 1, 'scale': 1, 'rotate': 1, 'brightness': 1, 'contrast': 1,
                      'motion_blur': 1, 'rain': 1, 'fog': 1, 'generate_occlusion':1, 'shadows':1}

    transform_vals = {"shift_factor": 0.2, "scale_factor": 0.2, "rot_angle": 30, "brightness_factor": 0.3,
                      "contrast_factor": 0.2, "motion_blur_factor": 4, "fog_factor": 0.4, "rain_factor": 3, 'generate_occlusion':1}

    aug = augmentation(class_id=class_id, dict_transform=transform_list, transform_vals=transform_vals, num_target_imgs=4)
    aug.load_data()
    aug.setup_pipeline()
    imgs = aug.augment(save=True)