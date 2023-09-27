<?php

namespace App\Http\Controllers;

use App\Models\Commit;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Nette\Utils\Random;
use Illuminate\Support\Str;

class CommitController extends Controller
{
    function addCommit(Request $request){
        $request->validate([
            'message' => 'required|string|max:255',
            'old_path_dxf' => 'required|string|max:255',
            'new_path_dxf' => 'required|file|mimes:txt,dxf',
            'new_path_svg' => 'required|string',
            'compare_path_svg' => 'required|string',
            'status' => 'required|integer',
            'user_id' => 'required|integer', 
            'file_id' => 'required|integer',
            $commit_unique_id = Str::random()
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
            $dxf = $commit_unique_id.".dxf";
            $svg_compared = $commit_unique_id . "- compered" . ".svg";
            $svg = $commit_unique_id. ".svg";
            

        } else {
            return response()->json([
            'status' => 'failed',
            'message' => 'file not found',
            ]);
        }

        $path_dxf = Storage::disk('public')->put($dxf, $content);
        $path_svg = Storage::disk('public')->put($svg_compared, $request->compare_path_svg);
        $new_path_svg = Storage::disk('public')->put($svg, $request->new_path_svg);


        $commit=new Commit;
        $commit->message=$request->message;
        $commit->new_path_dxf = "http://127.0.0.1:8000/storage/".$dxf;
        $commit->compare_path_svg = "http://127.0.0.1:8000/storage/".$svg_compared;
        $commit->new_path_svg = "http://127.0.0.1:8000/storage/".$svg;
        $commit->old_path_dxf = $request->old_path_dxf;
        $commit->status = $request->status;
        $commit->user_id = Auth::id();
        $commit->file_id =$request->file_id;
        $commit->commit_unique_id =$commit_unique_id;
        $commit->save();
        return response()->json([
            'status' => 'success',
            "data"=>$commit
        ]);
    }

    function checkConflict(Request $request){
        $request->validate([
        'svg_data' => 'required|string',
        ]);
        $file_name = "check-Conflict". time();
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

    function pushlocalCommit(Request $request){
    $commit_content=Commit::where("id",$request->commit_id)->first();
    if($commit_content){
        $file=File::where("id",$commit_content->file_id)->first();
        if($file){
            $file->path_dxf=$commit_content->new_path_dxf;
            $file->path_svg=$commit_content->new_path_svg;
            $file->user_id=$commit_content->user_id;
            $file->version=$file->version+1;
            $file->save();

            return response()->json([
                    'status' => 'success',
                    'message' => $file,
                ]);
        }else{
            return response()->json([
                    'status' => 'failed',
                    'message' => "file not foud",
                ]);
        }

    }return response()->json([
                    'status' => 'failed',
                    'message' => "commit not foud",
                ]);
}

 function addMainCommit(Request $request){
        $request->validate([
            'message' => 'required|string|max:255',
            'old_path_dxf' => 'string|max:255|nullable',
            'new_path_dxf' => 'required|string|max:255',
            'new_path_svg' => 'required|string|max:255',
            'compare_path_svg' => 'string|nullable',
            'status' => 'required|integer|max:10',
            'file_id' => 'string|nullable|max:255', 
        ]);


        $commit_unique_id = Str::random();
        
        if($request->file_id == "null"){
            $fileId=null;
        }else{
            $fileId=$request->file_id;
        }

        if($request->compare_path_svg == "null"){
            $compare_path_svg=null;
        }else{
            $svg_compared = $commit_unique_id . "- compered" . ".svg";
            $path_dxf = Storage::disk('public')->put($svg_compared, $request->compare_path_svg);
            $compare_path_svg="http://127.0.0.1:8000/storage/".$svg_compared;
        }

        $new_path_svg = $commit_unique_id. ".svg";
        $path_svg = Storage::disk('public')->put($new_path_svg, $request->new_path_svg);

        $dxf = $commit_unique_id.".dxf";
        $path_dxf = Storage::disk('public')->put($dxf, $request->new_path_dxf);



        $commit=new Commit;
        $commit->message=$request->message;
        $commit->new_path_dxf ="http://127.0.0.1:8000/storage/".$dxf ;
        $commit->compare_path_svg = $compare_path_svg;
        $commit->new_path_svg = "http://127.0.0.1:8000/storage/".$new_path_svg;
        $commit->old_path_dxf = $request->old_path_dxf;
        $commit->status = $request->status;
        $commit->user_id = Auth::id();
        $commit->file_id =$fileId;
        $commit->commit_unique_id =$commit_unique_id;

        
        $commit->save();
        return response()->json([
            'status' => 'success',
        ]);
    }
}
