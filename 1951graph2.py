from pymongo import MongoClient
import matplotlib.pyplot as plt
from matplotlib.widgets import CheckButtons
import matplotlib.animation as animation
import numpy as np
import matplotlib
from datetime import datetime

matplotlib.use('TkAgg')

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["order_db"]

db.milk_quantities.delete_many({})
dates = ["01172025", "01242025", "01312025", "02072025", "02142025", "02212025", "02282025", "03072025", "03142025"]
db.milk_quantities.insert_many([
    {
        "ingredient": "Whole Milk",
        "dates": dates,
        "Order Amount": [20, 30, 41, 39, 39, 41, 41, 41, 41]
    },
    {
        "ingredient": "Non-fat Milk",
        "dates": dates,
        "Order Amount": [2, 8, 5, 5, 5, 5, 5, 5, 5]
    },
    {
        "ingredient": "Half/half Milk",
        "dates": dates,
        "Order Amount": [1, 1, 2, 3, 3, 2, 2, 2, 2]
    }
])

db.nonDairy_quantities.delete_many({})
db.nonDairy_quantities.insert_many([
    {
        "ingredient": "Oatly",
        "dates": dates,
        "Order Amount": [30, 12, 12, 13, 13, 12, 12, 12, 12]
    },
    {
        "ingredient": "Califia Almond",
        "dates": dates,
        "Order Amount": [3, 5, 1, 1, 1, 1, 1, 1, 1]
    }
])

db.hotCups_quantities.delete_many({})
db.hotCups_quantities.insert_many([
    {"ingredient": "World Centric 4oz", "dates": dates, "Order Amount": [0, 0, 1, 1, 1, 1, 1, 1, 1]},
    {"ingredient": "World Centric 8oz CUP", "dates": dates, "Order Amount": [1, 0, 2, 2, 2, 2, 2, 2, 2]},
    {"ingredient": "World Centric 8oz LID", "dates": dates, "Order Amount": [2, 0, 3, 3, 3, 3, 3, 3, 3]},
    {"ingredient": "World Centric 12oz CUP", "dates": dates, "Order Amount": [0, 1, 1, 1, 1, 1, 1, 1, 1]},
    {"ingredient": "World Centric 16oz CUP", "dates": dates, "Order Amount": [0, 1, 1, 1, 1, 1, 1, 1, 1]},
    {"ingredient": "World Centric 12/16oz LID", "dates": dates, "Order Amount": [0, 1, 1, 1, 1, 1, 1, 1, 1]}
])

db.coldCups_quantities.delete_many({})
db.coldCups_quantities.insert_many([
    {"ingredient": "Clear Compostable 9oz w/ Flat LID", "dates": dates, "Order Amount": [0, 0, 0, 0, 0, 0, 0, 0, 0]},
    {"ingredient": "Clear Compostable 16oz CUP", "dates": dates, "Order Amount": [0, 1, 1, 1, 1, 1, 1, 1, 1]},
    {"ingredient": "Clear Compostable 16oz LID", "dates": dates, "Order Amount": [0, 1, 1, 1, 1, 1, 1, 1, 1]}
])

db.paperGoods_quantities.delete_many({})
db.paperGoods_quantities.insert_many([
    {"ingredient": "World Centric Napkins 9x9", "dates": dates, "Order Amount": [0, 0, 1, 1, 1, 1, 1, 1, 1]},
    {"ingredient": "Kraft Hot Cup Sleeves", "dates": dates, "Order Amount": [1, 1, 1, 1, 1, 1, 1, 1, 1]}
])

db.syrups_quantities.delete_many({})
db.syrups_quantities.insert_many([
    {"ingredient": "Torani Vanilla", "dates": dates, "Order Amount": [0, 1, 1, 1, 1, 1, 1, 1, 1]},
    {"ingredient": "Torani Lavender - Amazon", "dates": dates, "Order Amount": [1, 1, 1, 1, 1, 1, 1, 1, 1]},
    {"ingredient": "Honey 5lb bottle", "dates": dates, "Order Amount": [0, 1, 1, 1, 1, 1, 1, 1, 1]}
])

db.ingredients_quantities.delete_many({})
db.ingredients_quantities.insert_many([
    {"ingredient": "Raw Sugar Packets", "dates": dates, "Order Amount": [0, 2, 0, 1, 1, 1, 1, 1, 1]},
    {"ingredient": "Lemon Juice gallons", "dates": dates, "Order Amount": [1, 1, 1, 1, 1, 1, 1, 1, 1]}
])

db.cleaningSupplies_quantities.delete_many({})
db.cleaningSupplies_quantities.insert_many([
    {"ingredient": "Dish Soap - Amazon", "dates": dates, "Order Amount": [0, 1, 0, 0, 0, 0, 0, 0, 0]},
    {"ingredient": "Gloves (food handling)", "dates": dates, "Order Amount": [1, 1, 1, 1, 1, 1, 1, 1, 1]}
])

db.bottledDrinks_quantities.delete_many({})
db.bottledDrinks_quantities.insert_many([
    {"ingredient": "Topo Chico Mineral Water", "dates": dates, "Order Amount": [1, 0, 2, 1, 1, 1, 1, 1, 1]},
    {"ingredient": "Crystal Geyser Bottled Water", "dates": dates, "Order Amount": [0, 0, 0, 0, 0, 0, 0, 0, 0]}
])

db.other_quantities.delete_many({})
db.other_quantities.insert_many([
    {"ingredient": "Oatmeal - MYLK Labs", "dates": dates, "Order Amount": [0, 3, 3, 4, 4, 3, 3, 3, 3]},
    {"ingredient": "Tea - Blue Willow", "dates": dates, "Order Amount": [0, 2, 2, 2, 2, 2, 2, 2, 2]}
])

# Store animation objects globally
animation_store = []
check_buttons_store = {}
dragging = False
offset_x = 0
offset_y = 0

# All collections to fetch
categories = [
    "milk_quantities",
    "nonDairy_quantities",
    "hotCups_quantities",
    "coldCups_quantities",
    "paperGoods_quantities",
    "syrups_quantities",
    "ingredients_quantities",
    "cleaningSupplies_quantities",
    "bottledDrinks_quantities",
    "other_quantities"
]

# Fetch data from MongoDB
def fetch_quantities(collection):
    ingredient_data = {}
    for doc in collection.find():
        raw_dates = doc.get("dates", [])
        # Only parse if needed
        if len(raw_dates) > 0 and "-" not in raw_dates[0]:
            readable_dates = [datetime.strptime(d, "%m%d%Y").strftime("%Y-%m-%d") for d in raw_dates]
        else:
            readable_dates = raw_dates
        ingredient_data[doc["ingredient"]] = {
            "dates": readable_dates,
            "amounts": doc["Order Amount"]
        }
    return ingredient_data

# Global storage for all quantities
all_quantities = {}

# Update all categories
def update_quantities():
    global all_quantities
    all_quantities = {}
    for category in categories:
        all_quantities[category] = fetch_quantities(db[category])

# Plot function
def plot_ingredient_orders(orders, title, update_source_func):
    if not orders:
        print(f"[ERROR] No data found for {title}")
        return

    any_ingredient = next((k for k in orders if orders[k]["dates"] and orders[k]["amounts"]), None)
    if not any_ingredient:
        print(f"[ERROR] No valid date/amount in {title}")
        return

    fig, ax = plt.subplots()
    readable_dates = orders[any_ingredient]["dates"]
    x_range = list(range(len(readable_dates)))

    ax.set_xlim(0, len(x_range) - 1)
    ax.set_xticks(x_range)
    ax.set_xticklabels(readable_dates, rotation=45, ha='right')
    ax.set_xlabel("Date")
    ax.set_ylabel("Order Amount")
    ax.set_title(title)

    lines = {}
    for ingredient, data in orders.items():
        order_list = data["amounts"]
        lines[ingredient], = ax.plot(x_range, order_list, label=ingredient, linestyle="-", marker="")

    annotation = ax.annotate("", xy=(0, 0), xytext=(10, 10), textcoords="offset points",
                             bbox=dict(boxstyle="round", fc="w"), arrowprops=dict(arrowstyle="->"))
    annotation.set_visible(False)

    legend = ax.legend()
    for legend_line in legend.get_lines():
        legend_line.set_picker(True)

    rax = plt.axes([0.7, 0.45, 0.15, 0.3], facecolor='lightgray')
    check = CheckButtons(rax, list(orders.keys()), [True] * len(orders))
    check_buttons_store[title] = check

    def toggle_checkbox(label):
        visible = not lines[label].get_visible()
        lines[label].set_visible(visible)
        plt.draw()
    check.on_clicked(toggle_checkbox)

    def on_press(event):
        global dragging, offset_x, offset_y
        if event.inaxes == rax:
            dragging = True
            offset_x = event.x - rax.bbox.x0
            offset_y = event.y - rax.bbox.y0

    def on_release(event):
        global dragging
        dragging = False

    def on_motion(event):
        if dragging:
            new_x = event.x - offset_x
            new_y = event.y - offset_y
            rax.set_position([new_x / fig.bbox.width, new_y / fig.bbox.height, 0.15, 0.3])
            fig.canvas.draw()

    fig.canvas.mpl_connect("button_press_event", on_press)
    fig.canvas.mpl_connect("button_release_event", on_release)
    fig.canvas.mpl_connect("motion_notify_event", on_motion)

    def on_legend_click(event):
        for text, line in zip(legend.get_texts(), lines.values()):
            if text.contains(event)[0]:
                label = text.get_text()
                visible = not lines[label].get_visible()
                lines[label].set_visible(visible)
                text.set_alpha(1.0 if visible else 0.4)
                plt.draw()

    fig.canvas.mpl_connect("pick_event", on_legend_click)

    def hover(event):
        if event.inaxes != ax or event.xdata is None:
            annotation.set_visible(False)
            fig.canvas.draw_idle()
            return

        closest_line = None
        closest_x = None
        closest_y = None
        min_dist = float("inf")

        for ingredient, line in lines.items():
            if not line.get_visible():
                continue
            x_data, y_data = line.get_xdata(), line.get_ydata()
            y_interp = np.interp(event.xdata, x_data, y_data)
            dist = abs(y_interp - event.ydata)
            if dist < min_dist:
                min_dist = dist
                closest_line = line
                closest_x = event.xdata
                closest_y = y_interp

        if closest_line and min_dist < 1.0:
            annotation.xy = (closest_x, closest_y)
            annotation.set_text(f"({readable_dates[int(closest_x)]}, {closest_y:.2f})")
            annotation.set_visible(True)
        else:
            annotation.set_visible(False)

        fig.canvas.draw_idle()

    fig.canvas.mpl_connect("motion_notify_event", hover)

    def animate(frame):
        update_source_func()
        updated_data = orders  # keep existing ingredient order
        for ingredient, line in lines.items():
            if ingredient in updated_data:
                line.set_ydata(updated_data[ingredient]["amounts"])
        plt.draw()

    ani = animation.FuncAnimation(fig, animate, interval=5000, save_count=100)
    animation_store.append(ani)
    return fig

# Run and display all category plots
update_quantities()
for category_name, data in all_quantities.items():
    label = category_name.replace("_quantities", "").replace("nonDairy", "Non-Dairy").replace("hotCups", "Hot Cups").replace("coldCups", "Cold Cups").replace("paperGoods", "Paper Goods").replace("cleaningSupplies", "Cleaning Supplies").replace("bottledDrinks", "Bottled Drinks").replace("other", "Other").title()
    plot_ingredient_orders(data, f"{label} Order Amount Over Time", update_quantities)

plt.show()
