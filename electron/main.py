import sys
import ezdxf
import base64

def extractData(data):
    _, data = data.split(',', 1)
    
    dxf_content = base64.b64decode(data).decode('utf-8')
    
    # Remove extra empty lines
    lines = dxf_content.splitlines()
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

    cleaned_dxf_content = '\n'.join(cleaned_lines)

    docdxf = ezdxf.read(cleaned_dxf_content)
    
    result_doc = ezdxf.new()
    result_msp = result_doc.modelspace()

    # Extract and process entities, then add them to the result document
    msp = docdxf.modelspace()
    for entity in msp:
        etype = entity.dxftype()
        if etype == "LINE":
            result_msp.add_line(entity.dxf.start, entity.dxf.end, dxfattribs={'layer': entity.dxf.layer})
        elif etype == "CIRCLE":
            result_msp.add_circle(entity.dxf.center, entity.dxf.radius)
        elif etype == "ARC":
            result_msp.add_arc(entity.dxf.center, entity.dxf.radius, entity.dxf.start_angle, entity.dxf.end_angle)
        elif etype == "MTEXT":
            result_msp.add_mtext(entity.dxf.text, dxfattribs={'insert': entity.dxf.insert})
        elif etype == "LWPOLYLINE":
            points = [(vertex[0], vertex[1]) for vertex in entity]
            result_msp.add_lwpolyline(points, is_closed=entity.is_closed, dxfattribs={'layer': entity.dxf.layer})

    result_doc.saveas("result.dxf")

    print("is done")


# Read data sent from Electron
if __name__ == "__main__":
    for line in sys.stdin:
        data = line.strip()
        extractData(data)