<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    function getProjectMember($project_id){
        $members = Member::whereHas('team', function($query) use ($project_id) {
        $query->where('project_id', $project_id);
        })->with("user")->get();

        return response()->json([
            'status' => 'success',
            'data' => $members
        ]);
    }
}
