<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BranchController extends Controller
{
    function getBranches($project_id){
        $user_id=Auth::user()->id;
        $branches = Branch::where('project_id', $project_id)
                  ->whereHas('members', function ($query) use ($user_id) {
                      $query->where('user_id', $user_id);
                  })->with('members.user')
                  ->get();
        return response()->json([
            'status' => 'success',
            'data'=>$branches

        ]);

    }

      public function addBranch(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'project_id' => 'required',
            'members' => 'required',
        ]);

        $branch = Branch::create([
            'name' => $data['name'],
            'project_id' => $data['project_id'],
        ]);

        $user_ids = explode(',', $request->members);

        $branch->usermembers()->attach($user_ids);

        $branch->load('members') ;
        
        return response()->json([
            'status' => 'success',
            'message' => 'Branch created and members assigned successfully!',
            'data' => $branch
        ]);
    }

    function deletedBranch($branch_id){
      $branch = Branch::find($branch_id); 

    if (!$branch) {
        return response()->json([
            'status' => 'error',
            'message' => 'Branch not found',
        ], 404); 
    }

    try {
        $branch->delete();
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to delete branch',
        ], 500); 
    }

    return response()->json([
        'status' => 'success',
    ]);
    }
}


