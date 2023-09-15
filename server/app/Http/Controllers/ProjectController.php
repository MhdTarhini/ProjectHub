<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
        public function newProject(Request $request)
    {
        $file = new Project();
        $file->name=$request->name;
        $file->location=$request->location;
        $file->description=$request->description;
        $file->created_by=Auth::user()->id;
        $file->finished_at=now();
        return response()->json([
            'status' => 'success',
        ]);
    }
}
