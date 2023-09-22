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

class ProjectController extends Controller
{
        public function newProject(Request $request,$id="add")
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'status' => 'required|string|max:255',
        ]);
        $manager=Auth::user();
        if($id == "add"){
            $project = new Project;
        }else{
            $project = Project::find($id);
        }

        $project->name=$request->name;
        $project->description=$request->description;
        $project->location=$request->location;
        $project->status=$request->status;
        $project->created_by=Auth::user()->id;
        $project->finished_at=null;
        $project->save();

        $main_branch_project= new Branch;
        $main_branch_project->name= "main";
        $main_branch_project->project_id= $project->id;
        $main_branch_project->team_id= null;
        $main_branch_project->save();

        $add_manager=new BranchMember;
        $add_manager->user_id=$manager->id;
        $add_manager->branche_id=$main_branch_project->id;
        $add_manager->save();

        

        return response()->json([
            'status' => 'success',
            'data'=>$project
        ]);
    }

    function getProjects(Request $request) {

        $memberProjectsArray = $request->input('member_projects');
        $managerProjectsArray = $request->input('manager_projects');

        $member_projects = Project::whereIn("id", $memberProjectsArray)->with('teams.members.user')->get();

        $manager_projects = Project::whereIn("id", $managerProjectsArray)->with('teams.members.user')->get();
        
        return response()->json([
            'status' => 'success',
            'manager'=>$manager_projects,
            'member'=>$member_projects,
        ]);
        
    }
    function updateStatus(Request $request){
    $project = Project::find($request->project_id);

    if (!$project) {
        return response()->json([
            'status' => 'error',
            'message' => 'Project not found',
        ], 404);  
    }

    $project->status = $request->status;
    $project->save();

    return response()->json([
        'status' => 'success',
        'data'=>$project,
    ]);
    }
}
