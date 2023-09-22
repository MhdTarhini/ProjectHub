import sys
import ezdxf
import base64
import os

def extractData(data):
    # filename="decoded_data.dxf"
    file_path="data"
    filename = os.path.join(file_path, "decoded_data.dxf")

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

    docdxf = ezdxf.readfile(filename)

    msp = docdxf.modelspace()

    result_file = os.path.join(file_path, "results.txt")

    with open(result_file, "w") as f:
        for entity in msp:
            etype = entity.dxftype()
            f.write(f"Entity Type: {etype}\n")
        
            if etype == "LINE":
                f.write(f"Start: {entity.dxf.start}, End: {entity.dxf.end}, layer:{entity.dxf.layer}\n")
            elif etype == "CIRCLE":
                f.write(f"Center: {entity.dxf.center}, Radius: {entity.dxf.radius}\n")
            elif etype == "ARC":
                f.write(f"Center: {entity.dxf.center}, Radius: {entity.dxf.radius}, Start Angle: {entity.dxf.start_angle}, End Angle: {entity.dxf.end_angle}\n")
            elif etype == "MTEXT":
                f.write(f"Insertion Point: {entity.dxf.insert}, Text: {entity.dxf.text}\n")
            elif etype == "LWPOLYLINE":
                for Vertex in entity:
                    x, y = Vertex[0], Vertex[1]
                    f.write ((f"x:{x} y:{y} layer:{entity.dxf.layer}\n"))
          
                    f.write(f"Is Closed: {'Yes' if entity.is_closed else 'No'}\n")
    print("is done")

if __name__ == "__main__":
    for line in sys.stdin:
        data = line.strip()
        extractData(data)