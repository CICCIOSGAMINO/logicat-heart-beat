logicat-heart-beat
==================
[TOC]

Simple node.js, snap heart beat for Firebase cloud. 

## snap serial 
The device serial id is connected to snap serial, every snapd installation has an unique serial. 

## env 
Sensible data are gather from the environment variable, here the env needed: 
```bash
# device serial (default snap model | grep serial)
DEVICE_SERIAL=
# firebase conf data 
FIREBASE_CONF= 
# firebase auth email 
FIREBASE_EMAIL= 
# firebase auth password 
FIREBASE_PSW=
# update time in seconds 
HEART_BEAT=21600
```

## default 
The default values are :

+ min updating interval 600 sec (10min)
+ default updating interval 21600 sec (6h)

So if you set a value below the min updating interval 600 sec is the value active. If you do not set a value for the environment variable the default value is used. 