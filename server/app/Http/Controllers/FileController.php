<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
        public function uploadFile(Request $request)
    {
        $request->validate([
        'name' => 'required|string|max:255',
        'path_dxf' => 'required|file|mimes:txt,dxf',
        'path_svg' => 'required|string',
        'version' => 'required|string|max:255',
        'project_id' => 'required|integer',
        'user_id' => 'required|integer', 
        'branche_id' => 'required|integer', 
        ]);

        $file = $request->file('path_dxf');
        $content = file_get_contents($file->getRealPath());

        $file_name=$request->name;
        $dxf=$file_name.".dxf";
        $svg=$file_name.".svg";

        $path_dxf = Storage::disk('public')->put($dxf, $content);
        $path_svg = Storage::disk('public')->put($svg, $request->path_svg);

        $file = new File();
        $file->name=$request->name;
        $file->path_dxf = "http://127.0.0.1:8000/storage/".$dxf;
        $file->path_svg = "http://127.0.0.1:8000/storage/".$svg;
        $file->version = $request->version;
        $file->project_id = $request->project_id;
        $file->user_id = Auth::id();
        $file->branche_id =$request->branche_id;

        $file->save();
        return response()->json([
            'status' => 'success',
        ]);
    }

    function getFiles(Request $request) {

        $request->validate([
        'branche_id' => 'required|string|max:255',
        'project_id' => 'required|string|max:255',
        ]);

        $get_files = File::with(["user","project"])->where('branche_id', $request->branche_id)
            ->where('project_id', $request->project_id)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' =>$get_files,
        ]);
    }
    function getdxfFileData($id) {
        $file = File::find($id);

        if (!$file) {
            return response()->json([
              'status' => 'error',
              'message' => 'File not found',
            ], 404);
        }

        if (Storage::disk('public')->exists($file->name.".dxf")) {
            $contents = Storage::disk('public')->get($file->name.".dxf");
          
            return response()->json([
              'status' => 'success',
              'data' => $contents,
            ]);
        } else {
            return response()->json([
              'status' => 'error',
            ], 404);
        }
}
}
