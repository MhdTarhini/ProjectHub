<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileController extends Controller
{
        public function uploadFile(Request $request)
    {
        $request->validate([
        'name' => 'required|string|max:255',
        'path_dxf' => 'required|file|mimes:txt,dxf',
        'path_svg' => 'required|file|mimes:svg',
        'version' => 'required|string|max:255',
        'project_id' => 'required|integer',
        'user_id' => 'required|integer', 
        ]);

        $pathDxf = $request->file('path_dxf')->store('files/dxf', 'public');
        $pathSvg = $request->file('path_svg')->store('files/svg', 'public');

        $file = new File();
        $file->name=$request->name;
        $file->name = $request->name;
        $file->path_dxf = $pathDxf;
        $file->path_svg = $pathSvg;
        $file->version = $request->version;
        $file->project_id = $request->project_id;
        $file->user_id = Auth::id();
        return response()->json([
            'status' => 'success',
        ]);
    }
}
