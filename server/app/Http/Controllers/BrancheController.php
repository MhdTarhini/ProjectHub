<?php

namespace App\Http\Controllers;

use App\Models\Branche;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BrancheController extends Controller
{
    function getBranches($project_id){
        $user_id=Auth::user()->id;
        $branches = Branche::where('project_id', $project_id)
                  ->whereHas('members', function ($query) use ($user_id) {
                      $query->where('user_id', $user_id);
                  })->with('members.user')
                  ->get();
        return response()->json([
            'status' => 'success',
            'data'=>$branches

        ]);

    }
}
