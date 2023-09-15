import matplotlib.pyplot as plt
import ezdxf 
from ezdxf.addons.drawing import RenderContext, Frontend 
from ezdxf.addons.drawing.matplotlib import MatplotlibBackend
import os

doc = ezdxf.readfile("typical-model.dxf")
fig = plt.figure()
out = MatplotlibBackend(fig.add_axes([0, 0, 1, 1]))
Frontend(RenderContext(doc), out).draw_layout(doc.modelspace(), finalize=True)
fig.savefig(os.path.join("hello.svg")) 
