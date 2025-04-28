#!/usr/bin/env python3
import requests
from requests.auth import HTTPBasicAuth
import json
import sys

USERNAME = "cfg1951sp25@gmail.com"
PASSWORD = "codeforgood1951sp25!"
ORDER_ID = "467422087"


GRAPHQL_URL = "https://app.cutanddry.com/GraphQLController"

def fetch_order_items(order_id: str, username: str, password: str):
    payload = {
        "operationName": "GetOrderWithItems",
        "variables": { "orderId": order_id },
        "query": """
          query GetOrderWithItems($orderId: ID!) {
            order(id: $orderId) {
              id
              orderedproducts {
                quantity { float }
                price   { money }
                product { name }
              }
            }
          }
        """
    }

    session = requests.Session()
    session.auth = HTTPBasicAuth(username, password)

    resp = session.post(GRAPHQL_URL, json=payload, headers={"Content-Type": "application/json"})
    resp.raise_for_status()

    data = resp.json()
    if "errors" in data:
        raise RuntimeError("GraphQL returned errors: " + json.dumps(data["errors"], indent=2))

    items = []
    for od in data["data"]["order"]["orderedproducts"]:
        items.append({
            "name":       od["product"]["name"],
            "quantity":   od["quantity"]["float"],
            "unit_price": od["price"]["money"],
        })
    return items

def main():
    try:
        items = fetch_order_items(ORDER_ID, USERNAME, PASSWORD)
    except Exception as e:
        print(f"Error fetching order items: {e}", file=sys.stderr)
        sys.exit(1)

    print(json.dumps(items, indent=2))

if __name__ == "__main__":
    main()
