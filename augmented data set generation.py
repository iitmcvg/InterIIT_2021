import albumentations as A
import cv2
import glob
import  numpy as np
import  random
import os
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import csv

data = []
data2 = []
NUM_CLASSES = 43
IMG_SIZE = 48
pr_dir_load = r'C:\Users\Shreyas\PycharmProjects\inter-IIT\archive\Train'
pr_dir_save = r'C:\Users\Shreyas\PycharmProjects\inter-IIT\archive\Train_augmented'



for i in range(NUM_CLASSES):
   dir = str(i)
   path_load = os.path.join(pr_dir_load,dir)
   imgs = [mpimg.imread(file) for file in
              glob.glob(path_load + "/*.png")]
   l = len(imgs)
   transformed_imgs = []
   count = 0
   path_save = os.path.join(pr_dir_save, dir)
   os.mkdir(path_save)
   for img in imgs:
       img = cv2.resize(img, (48,48))
       transformed_imgs.append(img)
       plt.imsave(path_save + '/'+ str(count)+'.png',img)
       data2.append([i, '\Train_augmented' + '\\' + dir + '/' + str(count) + '.png'])
       count += 1
       for _ in range(int(5000/l)):
           transform = A.Compose([
               A.ShiftScaleRotate(shift_limit=0.15, scale_limit=0.1, rotate_limit=45, interpolation=1, border_mode=4,
                                  always_apply=False, p=0.8),
               A.RandomFog(fog_coef_lower=0.5, fog_coef_upper=0.6, alpha_coef=0.05, p=0.7),
               A.RandomBrightnessContrast(brightness_limit=(-0.05, 0.2), contrast_limit=(-0.2, 0.2),
                                          brightness_by_max=True,
                                          p=0.8),
               A.MotionBlur(p=0.5, blur_limit=5),
               A.OneOf(
                   [A.RandomRain(brightness_coefficient=0.9, drop_width=1, blur_value=3, p=0.5),
                    A.RandomSnow(brightness_coeff=0.9, snow_point_lower=0.3, snow_point_upper=0.5, p=0.5)]),

           ])
           transformed_img = transform(image=img)['image']
           transformed_imgs.append(transformed_img)
           plt.imsave(path_save + '/' + str(count) + '.png', transformed_img)
           data2.append([i, '\Train_augmented' + '\\' + dir +'/' +  str(count) + '.png'])
           count += 1

   data.append([i,len(imgs),len(transformed_imgs)])

   fig = plt.figure(figsize=(22, 22))
   print(transformed_imgs[0]['image'])
   for j in range(20):
               ax = fig.add_subplot(4, 5, j + 1, xticks=[], yticks=[])
               idx = random.randint(0, l)
               ax.imshow(transformed_imgs[idx])
               ax.set_title(f"Label: {i}")

   plt.savefig('class:'+str(i)+'.png')
   plt.close()

   print('class saved ' + str(i))
   with open('img_path.csv', 'w', newline='') as file:
       writer = csv.writer(file)
       writer.writerows(data2)










