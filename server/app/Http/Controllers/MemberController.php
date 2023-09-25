<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchMember;
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
        // $project_branch=Branch::where("project_id",$request->project_id)->pluck("id")->get();
        // $remove_branch_member = BranchMember::WhereIn("branch_id",$project_branch)->get();

        if (!$remove_member) {
        return response()->json([
            'status' => 'error',
            'message' => $request->member_team_id
        ]);
        }
        $member=$remove_member->with("user")->first();
        
        $remove_member->delete();


        return response()->json([
            'status' => "success" ,
            'data' => $member->id ,
        ]);

    }
}
