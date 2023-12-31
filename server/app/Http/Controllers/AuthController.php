<?php 

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Member;
use App\Models\Project;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller{

    public function unauthorized(Request $request){
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized',
        ], 200);
    }

    public function profile(Request $request){
        return response()->json([
            'status' => 'success',
            'data' => Auth::user(),
        ], 200);
    }

    public function login(Request $request){
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'string|nullable',
        ]);

        $CheckAuthMethod=User::Where("email",$request->email)->pluck("authMethod")->first();

        if($request->authMethod=="email" && $request->password==null){
            return response()->json([
                'status' => 'faild',
            ]);
        }
        if($CheckAuthMethod=="google"){
        $credentials = $request->only('email','password');

        }else{
            $credentials = $request->only('email', 'password');
            
        }
        

        $token = Auth::attempt($credentials);
 
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();
        $user->token = $token;

        $teams_id = Member::where("user_id", $user->id)->pluck('team_id')->toArray();

        $projects_id = Team::whereIn('id', $teams_id)->pluck('project_id')->toArray();
        
        $created_projects = Project::where("created_by", $user->id)->get();
        
        $active_project=$created_projects->whereIn("status",1)->pluck('id')->first();
        
        if(!$active_project){
            $active_project=Project::WhereIn("id",$projects_id)->where("status",1)->pluck('id')->first();
        }

        $main_branch=Branch::Where("project_id",$active_project)->where("name","main")->pluck("id")->first();
                
        $manager_projects=$created_projects->pluck('id')->toArray();

        $activeTeam=Team::where('project_id',$active_project)->pluck('id');

        $isUserInTeam = Member::whereIn('team_id', $activeTeam)
                      ->where('user_id', $user->id)->pluck('team_id')->first();

        if (!$isUserInTeam) {
            $activeTeam=0;
         } 

        $user_data= [
            'user' => $user,
            'teams_id' => $teams_id,
            'projects_Member_id' => $projects_id,
            'projects_Manager_id' => $manager_projects,
            'active'=>$active_project?$active_project: 0,
            'team_active'=>$isUserInTeam,
            'main_branch'=>$main_branch?$main_branch:0
        ];
            
        return response()->json([
                'status' => 'success',
                'data' => $user_data
            ]);

    }

    public function register(Request $request){
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'string|nullable',
            'profile_img'=>'string|nullable',
        ]);

        // $imageName = "default.png";
        // if ($request->hasFile('profile-img')) {
        //     $image = $request->file('profile-image');
        //     $imageName = time() . '_' . $image->getClientOriginalName();
        //     $image->move(public_path('uploads/users_image'), $imageName);
        // }

        if($request->authMehod==="email" && $request->password===null){
            return response()->json([
            'status' => 'faild',
        ]);
        }

        $user = new User; 
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->authMethod = $request->authMethod;
        $user->password = Hash::make($request->password);
        $user->profile_img = $request->profile_img?$request->profile_img: "http://34.244.172.132/uploads/userImages/default.png";
        $user->save();

        $token = Auth::login($user);
        $user->token = $token;

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    public function logout(){
        Auth::logout();
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh() {
        $user = Auth::user();
        $user->token = Auth::refresh();

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

     function resetPassword(Request $request){
        $user=User::where("email" , $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json([
            'status' => 'success',
        ]);

    }

}