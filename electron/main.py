import sys
import ezdxf

def extractData(data):
    doc = ezdxf.readfile("typical-model.dxf")

    msp = doc.modelspace()

    with open("results.txt", "w") as f:
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

# Read data sent from Electron
if __name__ == "__main__":
    for line in sys.stdin:
        data = line.strip()
        extractData(data)