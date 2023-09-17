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

    // public function addBranch(Request $request)
    // {
    //     $data = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'project_id' => 'required|integer|exists:projects,id', // assuming you have a projects table
    //     ]);

    //     $branch = Branch::create($data);

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Branch created successfully!',
    //         'data' => $branch
    //     ]);
    // }

      public function store(Request $request)
    {
        // Validate the request data
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'project_id' => 'required|integer|exists:projects,id',
            'members' => 'required',
        ]);

        // Create a new branch
        $branch = Branch::create([
            'name' => $data['name'],
            'project_id' => $data['project_id'],
        ]);

        $user_ids = explode(',', $request->members);

        // Attach members to the branch
        $branch->usermembers()->attach($user_ids);

        // Return success response
        return response()->json([
            'status' => 'success',
            'message' => 'Branch created and members assigned successfully!',
            'data' => $branch->load('members') // This will eager-load the members relationship to return with the branch
        ]);
    }
}


