import pandas as pd
from datetime import datetime
from datetime import date
#import pymongo 
#import pymongoarrow 
from pymongo import MongoClient

client = MongoClient('mongodb+srv://cfg1951sp25:DSGFyLjehdqB5hle@1951-cluster.nuzzx.mongodb.net/?retryWrites=true&w=majority&appName=1951-cluster')
#https://www.geeksforgeeks.org/pymongoarrow-export-and-import-mongodb-data-to-pandas-dataframe-and-numpy/

# warning alerts
warnings = [] # list of ingredients we need to warn about, maybe timestamps for reminders
warningTimeStamps = {} # possibly store previous order times as dict, Ingred: Time

# whenever its a new day carry this out probably useMemo with date or sth to avoid rerunning
# store previous day vs current time? d
def dailyWarningCheck():
    warnings = [] # reset from old ingredient warnings
    # gather data each time
    db = client['1951Data']
    inventory_col = list(db.inventory.find())
    print('got here')
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
        print('got here')
        currItemString = f"{item['ingredient']} {item['category']}"
        field_names = list(item.keys())
        target_fields = field_names[4:]
        usageHistory = [item[tf] for tf in target_fields]
        avgUsage = sum(usageHistory)/len(usageHistory)
        mostRecentOrderDate = field_names[-1]
        #actualDate = datetime.strptime(mostRecentOrderDate, "%m%d%Y")
        #currTime = datetime.today()
        currTimeVsOrderDate = datetime.today() - datetime.strptime(mostRecentOrderDate, "%m%d%Y")
            # for reference: print(datetime.strptime("02282025", "%m%d%Y")) # gives 2025-02-28
        #if (datetime.date.today() > orderDate + 5 or datetime.date.today() > orderDate + daysOrderLasts):
        if (item[mostRecentOrderDate] < 0.3*avgUsage or currTimeVsOrderDate.days >= 5):
            warnings.append([currItemString, currTimeVsOrderDate]) # grab ingredient name
            warningTimeStamps[item[currItemString]] = datetime.date.today()
        prepareWarnings()
        # now to display all the warnings now in warnings bc of prepWarnings...
    print(warnings)

dailyWarningCheck()

def prepareWarnings():
    # take in warnings and upgrade each entry to final string
    for x in warnings:
        currWarning = warnings.remove(x)
        # use f string to format the warning string   
        warnings.append(f"Reminder to order {currWarning[0]} since it's been {currWarning[1].days} days!")

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