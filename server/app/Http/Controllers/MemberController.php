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

    function removeMember(Request $request){
        $remove_member=Member::Where("user_id",$request->member_id)->Where("team_id",$request->member_team_id)->first();

        if (!$remove_member) {
        return response()->json([
            'status' => 'error',
            'message' => $request->member_team_id
        ]);
        }

        $remove_member->delete();

        return response()->json([
            'status' => $request->member_id . $request->member_team_id ,
        ]);

    }
}
