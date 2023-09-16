import matplotlib.pyplot as plt
import ezdxf 
from ezdxf.addons.drawing import RenderContext, Frontend 
from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
import sys
import io
import base64

def convert_svg(data):
    filename="get_data.dxf"

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

    doc = ezdxf.readfile(filename)
    fig = plt.figure()
    out = MatplotlibBackend(fig.add_axes([0, 0, 1, 1]))
    Frontend(RenderContext(doc), out).draw_layout(doc.modelspace(), finalize=True)


    svg_output = io.BytesIO()
    fig.savefig(svg_output, format='svg')
    
    svg_data = svg_output.getvalue().decode('utf-8')


    print(svg_data)

if __name__ == "__main__":
    for line in sys.stdin:
        data = line.strip()
        convert_svg(data)
