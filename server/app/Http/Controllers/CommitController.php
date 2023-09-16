<?php

namespace App\Http\Controllers;

use App\Models\Commit;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CommitController extends Controller
{


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
            // 'data'=>$request->svg_data
        ]);
    }
}
