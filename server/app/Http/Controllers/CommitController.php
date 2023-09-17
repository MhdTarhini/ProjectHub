<?php

namespace App\Http\Controllers;

use App\Models\Commit;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CommitController extends Controller
{
    function addCommit(Request $request){
        $request->validate([
            'message' => 'required|string|max:255',
            'old_path_dxf' => 'required|string|max:255',
            'new_path_dxf' => 'required|file|mimes:txt,dxf',
            'compare_path_svg' => 'required|string',
            'version' => 'required|string|max:255',
            'status' => 'required|integer',
            'user_id' => 'required|integer', 
            'file_id' => 'required|integer', 
        ]);

        $file = $request->file('new_path_dxf');
        if ($file) {
            $content = file_get_contents($file->getRealPath());
        } else {
            return response()->json([
            'status' => 'failed',
            'message' => 'new_path_dxf not a file',
            ]);
        }

        $file_id = File::where('id', $request->file_id)->first(); 
        if ($file_id) {
            $file_name = $file_id->name;
            $dxf = $file_name . "-" . $request->version . ".dxf";
            $svg = $file_name . "-" . $request->version . ".svg";

        } else {
            return response()->json([
            'status' => 'failed',
            'message' => 'file not found',
            ]);
        }

        $path_dxf = Storage::disk('public')->put($dxf, $content);
        $path_svg = Storage::disk('public')->put($svg, $request->compare_path_svg);


        $commit=new Commit;
        $commit->message=$request->message;
        $commit->new_path_dxf = "http://127.0.0.1:8000/storage/".$dxf;
        $commit->compare_path_svg = "http://127.0.0.1:8000/storage/".$svg;
        $commit->old_path_dxf = $request->old_path_dxf;
        $commit->version = $request->version;
        $commit->status = $request->status;
        $commit->user_id = Auth::id();
        $commit->file_id =$request->file_id;

        $commit->save();
        return response()->json([
            'status' => 'success',
        ]);
    }

    function checkConflict(Request $request){
        $request->validate([
        'svg_data' => 'required|string',
        ]);
        $file_name = "check-Conflict";
        $svg = $file_name.".svg";
        $path = Storage::disk('public')->put($svg, $request->svg_data);
        $path_svg = "http://127.0.0.1:8000/storage/".$svg;
        return response()->json([
            'status' => 'success',
            'data'=>$path_svg
        ]);
    }

    function getFileCommit($file_id){
        $file = File::with('commits')->find($file_id);
        $commits = $file->commits;
        return response()->json([
            'status' => 'success',
            'data'=>$commits
        ]);
    }
}
