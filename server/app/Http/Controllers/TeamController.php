<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchMember;
use App\Models\Member;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TeamController extends Controller
{
    function getAllUsersNoActive(){

    $teamsInNotActiveProjects = Team::whereHas('projects', function ($query) {
        $query->where('status',1);
    })->pluck('id');

    $usersInTeams = Member::whereIn('team_id', $teamsInNotActiveProjects)
                                        ->pluck('user_id');
                                        
    $userIsManagerActiveProject=Project::where("status",1)->pluck("created_by");

    $mergedUserIds = $usersInTeams->merge($userIsManagerActiveProject)->unique();

    $filteredUsers = User::whereNotIn('id', $mergedUserIds)->get();


    return response()->json([
        'status' => 'success',
        'data' => $filteredUsers
    ]);

        
    }
    function addTeam(Request $request){
        $user=Auth::user();
        $add_team=new Team;
        $add_team->name=$request->team_name;
        $add_team->project_id=$request->project_id;
        $add_team->save();
        
        $add_branch=new Branch;
        $add_branch->name=$request->team_name;
        $add_branch->project_id=$request->project_id;
        $add_branch->team_id=$add_team->id;
        $add_branch->save();

        $main_branch=Branch::where("project_id",$request->project_id)->where('name',"main")->first();


        foreach($request->team_members as $member){
            $add_members=new Member;
            $add_members->team_id=$add_team->id;
            $add_members->user_id=$member;
            $add_members->save();


            $add_branch_member=new BranchMember;
            $add_branch_member->user_id=$member;
            $add_branch_member->branche_id=$add_branch->id;
            $add_branch_member->save();
            
            $add_branch_member=new BranchMember;
            $add_branch_member->user_id=$member;
            $add_branch_member->branche_id=$main_branch->id;
            $add_branch_member->save();
        }

        $add_branch_member=new BranchMember;
        $add_branch_member->user_id=$user->id;
        $add_branch_member->branche_id=$add_branch->id;
        $add_branch_member->save();

        $newTeam=$add_team->with("members.user")->first();

        return response()->json([
            'status' => 'success',
            'data'=>$newTeam,
        ]);

    }
    function addMembers(Request $request){

          foreach($request->members as $member){
            $add_members=new Member;
            $add_members->team_id=$request->team;
            $add_members->user_id=$member;
            $add_members->save();
          };

          $members=Team::where("id",$request->team)->with('members.user')->get();

            return response()->json([
            'status' => 'success',
            'data'=>$members
        ]);

    }
}
