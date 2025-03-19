import pandas as pd
import datetime
import pymongo 
import pymongoarrow 
from pymongo import MongoClient

client = MongoClient('Enter your Atlas cluster connection string here')
#https://www.geeksforgeeks.org/pymongoarrow-export-and-import-mongodb-data-to-pandas-dataframe-and-numpy/
# db = client.test_database
# col = db.test_collection
# df = col.find_pandas_all()

# warning alerts
warnings = [] # list of ingredients we need to warn about, maybe timestamps for reminders
warningTimeStamps = {} # possibly store previous order times as dict, Ingred: Time

def dailyWarningCheck():
    warnings = [] # reset from old ingredient warnings
    # gather data each time
    db = client.test_database
    col = db.test_collection
    df = col.find_pandas_all()
    # maybe store timestamps for 
    warningTimeStamps = {}
    # handling school or break times? boolean input for avg?
    schoolOrBreak = col[5] # maybe but idk
    prevWeeklyOrder = col[-1].order
    avgDailyUsage = df.iloc[1].mean()/7 # need to track days since the order... just day 5 ig
    orderDate = col[-1]
    daysOrderLasts = weeklyOrder/avgDailyUsage
    # check 1) 5 days since last order 2) 
    if (datetime.date.today() > orderDate+5 or datetime.date.today() > orderDate+daysOrderLasts):
        warnings.append(col[1]) # grab ingredient name
        warningTimeStamps[col[1]] = datetime.date.today()

def displayWarning(warningString):
    # take in warnings and upgrade each entry to string
    for x in warnings:
        currIngredient = warnings.remove(x)
        # use f string to format the warning string   
        warnings.append(f"Reminder to order {currIngredient} since it's been {ingredientData[currIngredient]} weeks!")
    # sends to frontend

# below is likely unnecessary unless it keeps spamming warning after closing --> get msg to remove from array
# def resolveWarning(warningString):
#     # probably do in react also?
#     warning = warningString.split()[3]
#     clicked = false
#     if (clicked):
#         yes = confirmation()
#         if (yes):
#             warnings.remove(warning)



# # reminder alerts
#     # store the reminders, reminders should track time + ingredient + amount to get
#     # 1 reminder per ingredient so make ingredient key?
# reminders = {}  
# # this is where time tracking needed if at all

# ''' Below fxn should execute reminder alerts when needed'''
# def fireReminderAlerts():
#     for x in reminders:
#         if (hit time like 8:00 Monday 1 week after set):
#             doThing()

#     # timer --> every time fire off reminders

# '''Below fxn is for when button clicked to edit reminders'''
# def editReminders(reminderName):
#     currReminder = reminders[reminderName]

# def addReminder(reminderName):
#     stuff()

# def removeReminder(reminderName):
#     confirmation()
#     stuff()