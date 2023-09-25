<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Commit;
use App\Models\File;
use App\Models\Team;
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

        $isExiste = File::where("name", $request->name)
                ->where("branche_id", $request->branche_id)
                ->exists();

        if($isExiste){
            return response()->json([
                'status' => 'failed',
                "message" => "name not valid"
            ]);
        }

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

        $isMain = Branch::where("project_id",$request->project_id)->where('id', $request->branche_id)
                        ->where('name', "main")->first();

        if($isMain){
            $projectTeamIds = Team::where('project_id', $request->project_id)->pluck('id');

            $branchIds = Branch::whereIn('team_id', $projectTeamIds)
                    ->where('project_id', $request->project_id)
                    ->pluck('id');

            // $get_files = File::with(['user', 'project','branche'])
            //         ->whereIn('branche_id', $branchIds)
            //         ->where('project_id', $request->project_id)
            //         ->get();
            $get_files=Branch::whereIn("id",$branchIds)->with("files")->get();
        }else{
            $get_files = File::with(["user","project"])->where('branche_id', $request->branche_id)
                ->where('project_id', $request->project_id)
                ->get();
        }


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

function getFilePath(Request $request){
    $user=Auth::user()->id;
    $branch=Branch::where("project_id",$request->project_id)->where("team_id",$request->team_id)->first();


    $file = File::where("name",$request->file_name)->where("branche_id",$branch->id)->first();
    if($file){
        return response()->json([
            'status' => 'success',
            'dxf_path' => $file->path_dxf,
            'version' => $file->version,
            'id' => $file->id,
            ]);

    }else{
        return response()->json([
            'status' => 'failed',
            'message' => "file not foud",
        ]);
    }
}

function downloadFile($file_name){
    $path = public_path('storage/'.$file_name);
    return response()->download($path);
}

function pullFromMain(Request $request)
{
    $branch = Branch::where("team_id", $request->team_id)->first();
    $files = File::where("branche_id", $branch->id)->get();
    $branch_files = File::where("branche_id", $request->branch_id)->pluck('name')->toArray();

    $matching_files = [];
    $new_Files = [];
    $add_counter = 0;
    $conflict_counter = 0;

    foreach ($files as $file) {
        if (in_array($file->name, $branch_files)) {
            $matching_files[] = $file;
            $conflict_counter += 1;
        } else {
            $new_Files[] = $file;
            $add_counter += 1;
        }
    }

    foreach ($new_Files as $file) {
        $add_files = new File;
        $add_files->name = $file->name;
        $add_files->path_dxf = $file->path_dxf;
        $add_files->path_svg = $file->path_svg;
        $add_files->version = 0;
        $add_files->project_id = $file->project_id;
        $add_files->branche_id = $request->branch_id;
        $add_files->user_id = Auth::id();  
        $add_files->save();
    }

    return response()->json([
        'status' => 'success',
        'added' => $add_counter . " Were Added",
        'conflict' => "There are conflicts in " . $conflict_counter . " files",
        'data' => $matching_files,
    ]);
}

function accepteFile(Request $request){
    $user=Auth::user();
    $file=File::where("branch_id",$request->branch_id)->where("name",$request->file_name)->first();

    $file->path_dxf=$request->path_dxf;
    $file->path_svg=$request->path_svg;
    $file->version=$request->path_svg;
    $file->user_id=$user->id;
    $file->save();

     return response()->json([
        'status' => 'success',
     ]);
}

function deleteFile($file_id){
      $file = File::where("id", $file_id)->first();

    if ($file) {
        $file->delete();
    } else {
        return response()->json([
            'status' => 'error',
            'message' => 'File not found',
        ]);
    }

    return response()->json([
        'status' => 'success',
    ]);
}
}
