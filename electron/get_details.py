import ezdxf
import math
import sys
import base64
import requests
import os


def getDataDetails(data):
    file_path="data"
    def download_file(file_url, local_filename):
        try:
            response = requests.get(file_url, stream=True)

            if response.status_code == 200:
                with open(local_filename, 'wb') as local_file:
                    for chunk in response.iter_content(chunk_size=1024):
                        if chunk:
                            local_file.write(chunk)
                print(f"File downloaded as {local_filename}")
            else:
                print(f"Error with status code: {response.status_code}")
        except Exception as e:
            print(f"An error occurred: {e}")

    file_url = data  
    # local_filename = "downloaded_file.dxf"
    local_filename = os.path.join(file_path, "downloaded_file.dxf")

    download_file(file_url, local_filename)

    doc = ezdxf.readfile(local_filename)

    msp = doc.modelspace()

    def distance(point1, point2):
        return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)
    
    def area(vertices):
       n = len(vertices)
       positive_sum = sum(vertices[i][0] * vertices[(i + 1) % n][1] for i in range(n))
       negative_sum = sum(vertices[i][1] * vertices[(i + 1) % n][0] for i in range(n))
       return 0.5 * abs(positive_sum - negative_sum)
    
    def dimensions(vertices):
        xs = [vertex[0] for vertex in vertices]
        ys = [vertex[1] for vertex in vertices]

        length = max(xs) - min(xs)
        width = max(ys) - min(ys)

        return round(length, 2), round(width, 2)
    
    def process(entity):
        etype = entity.dxftype()
        if etype == "MTEXT":
            data = {"Text" :entity.dxf.text}
        elif etype == "LWPOLYLINE":
            vertices=[]
            for Vertex in entity:
                x, y = Vertex[0], Vertex[1]
                vertices.append((float( round(x, 2)), float( round(y, 2))))
            data = { "L,W": dimensions(vertices) , "Area": round(area(vertices), 4)}
        elif etype == "LINE":
            data = {"lenght" :round(distance(entity.dxf.start, entity.dxf.end), 2)}
        elif etype == "CIRCLE":
            data = {"Center": {entity.dxf.center}, "Radius": {entity.dxf.radius}}
        elif etype == "ARC":
            data = {"Center": {entity.dxf.center}, "Radius": {entity.dxf.radius}}
        return data
    
    def saveData(entity, data):
        layer = entity.dxf.layer
        if layer in dxf_details:
            found = False
            for item in dxf_details[layer]:
                if item["prop"] == data:
                    item["quantity"] += 1
                    found = True
                    break
            if not found:
                dxf_details[layer].append({"prop": data, "quantity": 1})
        else:
            dxf_details[layer] = [{"prop": data, "quantity": 1}]
        return dxf_details

    

    group_table = doc.groups

    dxf_details={}
    tamperay_list=[]
    processed_entities = set()
    for group in group_table.groups():
        if(group):
            counter=0
            is_group=False
            for entity in group:
                processed_entities.add(entity.dxf.handle)
                counter=counter+1
                if(len(group)>1):
                    is_group=True
                    tamperay_list.append(process(entity))
                    if (counter==len(group)):
                        saveData(entity,tamperay_list)
                if(is_group==False):
                    saveData(entity,process(entity))
  
    for entity in msp:
        if entity.dxf.handle not in processed_entities:
            process(entity)
            saveData(entity,process(entity))


    try:
        with requests.post('http://127.0.0.1:8000/api/open_ai', data=dxf_details, stream=True) as response:
            if response.status_code == 200:
                print(response.text)
            else:
                print(f"Error with status code: {response.status_code}")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    for line in sys.stdin:
        data = line.strip()
        getDataDetails(data)