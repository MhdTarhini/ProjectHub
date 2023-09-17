import ezdxf
import sys
import base64
import json
import requests
import matplotlib.pyplot as plt
import ezdxf 
from ezdxf.addons.drawing import RenderContext, Frontend 
from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
import io

def compareData(new_version_path,old_version_path):
    def download_file(file_url, local_filename):
        try:
            response = requests.get(file_url, stream=True)

            if response.status_code == 200:
                with open(local_filename, 'wb') as local_file:
                    for chunk in response.iter_content(chunk_size=1024):
                        if chunk:
                            local_file.write(chunk)
                # print(f"File downloaded as {local_filename}")
            else:
                print(f"Error with status code: {response.status_code}")
        except Exception as e:
            print(f"An error occurred: {e}")

    old_file_url = old_version_path  
    old_local_filename = "downloaded_old_file.dxf"
    download_file(old_file_url, old_local_filename)

    new_file_url = new_version_path  
    new_local_filename = "downloaded_new_file.dxf"
    download_file(new_file_url, new_local_filename)

    # with open(new_version_data, 'r') as temp_file:
    #     new_version_data = temp_file.read()
        
    # filename="new_version_data.dxf"
    # _, new_version_data = new_version_data.split(',', 1)
    
    # dxf_content = base64.b64decode(new_version_data).decode('utf-8')
    
    # with open(filename, "w") as file:
    #     file.write(dxf_content)
    
    # with open(filename, "r") as file:
    #     lines = file.readlines()

    # cleaned_lines = []
    # i = 0
    # while i < len(lines):
    #     if not lines[i].strip() and (i == len(lines) - 1 or lines[i+1].strip()):
    #         pass
    #     elif not lines[i].strip() and not lines[i+1].strip():
    #         cleaned_lines.append(lines[i])
    #         i += 1
    #     else:
    #         cleaned_lines.append(lines[i])
    #     i += 1

    # with open(filename, "w") as file:
    #     file.writelines(cleaned_lines)

    new_version = "downloaded_new_file.dxf"
    old_version ="downloaded_old_file.dxf"
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
            "new_version": list(new_data),
            "new_objects": list(new_objects),
            "removed_objects": list(removed_objects)
        }
    
        return json.dumps(combined_results)
    
    def create_dxf_from_json_data(data, output_path_json):
        doc = ezdxf.new()
    
        doc.layers.add("NEW_VERSION", color=ezdxf.colors.GRAY)
        doc.layers.add("NEW", color=ezdxf.colors.GREEN)
        doc.layers.add("REMOVED", color=ezdxf.colors.RED)
        
        msp = doc.modelspace()

        def process_entities(entities, category):
            for entity in entities:
                entity_type = entity[0]
                
                if entity_type == "LINE":
                    start_point = tuple(entity[1][:2])
                    end_point = tuple(entity[2][:2])
                    msp.add_line(start_point, end_point, dxfattribs={"layer": category})
    
                elif entity_type == "LWPOLYLINE":
                    vertices = [tuple(point[:2]) for point in entity[1]]
                    msp.add_lwpolyline(vertices, dxfattribs={"layer": category})

                elif entity_type == "CIRCLE":
                    center = tuple(entity[1][:2])
                    radius = entity[2]
                    msp.add_circle(center, radius, dxfattribs={"layer": category})

                elif entity_type == "ARC":
                    center = tuple(entity[1][:2])
                    radius = entity[2]
                    start_angle = entity[3]
                    end_angle = entity[4]
                    msp.add_arc(center, radius, start_angle=start_angle, end_angle=end_angle, dxfattribs={"layer": category})
                elif entity_type == "TEXT":
                    insertion_point = tuple(entity[1][:2])
                    text_content = entity[2]
                    msp.add_text(text_content, dxfattribs={"insert": insertion_point, "layer": category})
    
        process_entities(data['new_version'], "NEW_VERSION")
        process_entities(data['new_objects'], "NEW")
        process_entities(data['removed_objects'], "REMOVED")

        doc.saveas(output_path_json)


    results = compare_dxf_files(old_version, new_version)

    results_dict = json.loads(results)

    output_path_json = "output_dxf.dxf"

    create_dxf_from_json_data(results_dict, output_path_json)

    doc = ezdxf.readfile(output_path_json)
    fig = plt.figure()
    out = MatplotlibBackend(fig.add_axes([0, 0, 1, 1]))
    Frontend(RenderContext(doc), out).draw_layout(doc.modelspace(), finalize=True)


    svg_output = io.BytesIO()
    fig.savefig(svg_output, format='svg')
    
    svg_data = svg_output.getvalue().decode('utf-8')


    print(svg_data)


    # print(results)

if __name__ == "__main__":
    # for line in sys.stdin:
    #     data = line.strip()
    if len(sys.argv) < 3:
        print("Usage: compare_data.py new_version_data old_version_path")
        sys.exit(1)

    new_version_path = sys.argv[1]
    old_version_path = sys.argv[2]
    compareData(new_version_path,old_version_path)
