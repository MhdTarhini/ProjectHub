import ezdxf
import sys
import base64
# import requests


def compareData(data):
    filename="new_version_data.dxf"
    _, data = data.split(',', 1)
    
    dxf_content = base64.b64decode(data).decode('utf-8')
    
    with open(filename, "w") as file:
        file.write(dxf_content)
    
    with open(filename, "r") as file:
        lines = file.readlines()

    cleaned_lines = []
    i = 0
    while i < len(lines):
        if not lines[i].strip() and (i == len(lines) - 1 or lines[i+1].strip()):
            pass
        elif not lines[i].strip() and not lines[i+1].strip():
            cleaned_lines.append(lines[i])
            i += 1
        else:
            cleaned_lines.append(lines[i])
        i += 1

    with open(filename, "w") as file:
        file.writelines(cleaned_lines)

    new_version = filename
    old_version="typical-model.dxf"
    # response = requests.get('API')
    # if response.status_code == 200:
    #     old_version= response.json()
    # else:
    #     print(f"Failed to fetch data. Status code: {response.status_code}")

    def extract_data_from_dxf(filepath):
        doc = ezdxf.readfile(filepath)
        msp = doc.modelspace()
        data = []
    
        for entity in msp:
            etype = entity.dxftype()
            layer = entity.dxf.layer
    
            if etype == "LINE":
                start = tuple([round(coord, 9) for coord in entity.dxf.start])
                end = tuple([round(coord, 9) for coord in entity.dxf.end])
                data.append(("LINE", start, end, layer))
            elif etype == "CIRCLE":
                center = tuple([round(coord, 9) for coord in entity.dxf.center])
                data.append(("CIRCLE", center, round(entity.dxf.radius, 9), layer))
            elif etype == "ARC":
                center = tuple([round(coord, 9) for coord in entity.dxf.center])
                data.append(("ARC", center, round(entity.dxf.radius, 9), round(entity.dxf.start_angle, 9), round(entity.dxf.end_angle, 9), layer))
            elif etype == "TEXT":
                insertion_point = tuple([round(coord, 9) for coord in entity.dxf.insert])
                data.append(("TEXT", insertion_point, entity.dxf.text, layer))
            elif etype == "LWPOLYLINE":
                vertices = [(round(v[0], 9), round(v[1], 9)) for v in entity]
                data.append(("LWPOLYLINE", tuple(vertices), layer))
                
        return set(data)

    def compare_dxf_files(old_file, new_file):
        old_data = extract_data_from_dxf(old_file)
        new_data = extract_data_from_dxf(new_file)
    
        new_objects = new_data - old_data
        removed_objects = old_data - new_data
    
        combined_results = {
            "new_version":new_data,
            "new_objects": new_objects,
            "removed_objects": removed_objects
        }
    
        return combined_results


    results = compare_dxf_files(old_version, new_version)

    print(results)

if __name__ == "__main__":
    for line in sys.stdin:
        data = line.strip()
        compareData(data)
