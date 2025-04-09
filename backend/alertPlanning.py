from flask import Flask, jsonify, request
import pandas as pd
from datetime import datetime
from datetime import date
from pymongo import MongoClient
import ssl
import certifi
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
CONNECTION_STRING = os.getenv("CONNECTION_STRING")

client = MongoClient(CONNECTION_STRING, 
                     ssl=True,tlsCAFile=certifi.where(), tls = True, tlsAllowInvalidCertificates=True)
#https://www.geeksforgeeks.org/pymongoarrow-export-and-import-mongodb-data-to-pandas-dataframe-and-numpy/
warnings = [] # list of ingredients we need to warn about, maybe timestamps for reminders
warningTimeStamps = {} # possibly store previous order times as dict, Ingred: Time

# db = client['1951Data']
# print(db.list_collection_names())

# whenever its a new day carry this out probably useMemo with date or sth to avoid rerunning
# store previous day vs current time? d
def dailyWarningCheck():
    warnings = [] # reset from old ingredient warnings
    # gather data each time
    db = client['1951Data']
    inventory_col = list(db.inventory.find())
    #print('got here')
    # # maybe store timestamps for 
    # warningTimeStamps = {}
    # # handling school or break times? boolean input for avg?
    # schoolOrBreak = inventory_col[5] # maybe but idk
        # prevWeeklyOrder = inventory_col[-1].order
        # avgDailyUsage = df.iloc[1].mean()/7 # need to track days since the order... just day 5 ig
        # orderDate = inventory_col[-1]
        # daysOrderLasts = prevWeeklyOrder#/avgDailyUsage
        # check 1) 5 days since last order 2) 
    for item in inventory_col:
        #print('got here')
        currItemString = f"{item['ingredient']} {item['category']}"
        field_names = list(item.keys())
        target_fields = field_names[4:]
        # order history?
        orderHistory = [item[tf] for tf in target_fields]
        avgOrder = sum(orderHistory)/len(orderHistory)
        mostRecentOrderDate = field_names[-1]
        #actualDate = datetime.strptime(mostRecentOrderDate, "%m%d%Y")
        #currTime = datetime.today()
        daysOrderLasts = 0
        if avgOrder > 0:
            daysOrderLasts = item[field_names[-1]]/avgOrder * 7 # compare current order to average since average should last 7 days
        currTimeVsOrderDate = (datetime.today() - datetime.strptime(mostRecentOrderDate, "%m%d%Y")).days
            # for reference: print(datetime.strptime("02282025", "%m%d%Y")) # gives 2025-02-28
        #if (datetime.date.today() > orderDate + 5 or datetime.date.today() > orderDate + daysOrderLasts):
        if (currTimeVsOrderDate > daysOrderLasts or currTimeVsOrderDate >= 5):
            warnings.append(f"Reminder to order {currItemString} since it's been {currTimeVsOrderDate} days!")
    print(warnings)

dailyWarningCheck()

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