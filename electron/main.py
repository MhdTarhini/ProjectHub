import sys

def process_data(product_data):
    print("Received data from Electron:", product_data)

# Read data sent from Electron
if __name__ == "__main__":
    for line in sys.stdin:
        data = line.strip()
        process_data(data)