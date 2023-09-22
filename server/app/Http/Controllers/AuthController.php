<?php 

namespace App\Http\Controllers;

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
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        $token = Auth::attempt($credentials);
 
        if (!$token) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();
        $user->token = $token;

        $teams_id = Member::where("user_id", $user->id)->pluck('id')->toArray();

        $projects_id = Team::whereIn('id', $teams_id)->pluck('project_id')->toArray();
        
        $created_projects = Project::where("created_by", $user->id)->get();
        
        $active_project=$created_projects->whereIn("status",1)->pluck('id')->first();
        
        if(!$active_project){
            $active_project=Project::WhereIn("id",$projects_id)->where("status",1)->pluck('id')->first();
        }
        
        $manager_projects=$created_projects->pluck('id')->toArray();

        $activeTeam=Team::where('project_id',$active_project)->pluck('id')->first();

        $isUserInTeam = Member::where('team_id', $activeTeam)
                      ->where('user_id', $user->id)
                      ->exists();

        if (!$isUserInTeam) {
            $activeTeam=0;
         } 

        $user_data= [
            'user' => $user,
            'teams_id' => $teams_id,
            'projects_Member_id' => $projects_id,
            'projects_Manager_id' => $manager_projects,
            'active'=>$active_project?$active_project: 0,
            'team_active'=>$activeTeam,
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
            'password' => 'required|string|min:6',
            // 'profile_img'=>'image|mimes:jpeg,png,jpg,gif,svg|max:2048|null'
        ]);

        $imageName = "default.png";
        if ($request->hasFile('profile-img')) {
            $image = $request->file('profile-image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/users_image'), $imageName);
        }



        $user = new User; 
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->role_id = "1";
        $user->password = Hash::make($request->password);
        $user->profile_img = "http://127.0.0.1:8000/uploads/userImages/".$imageName;
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

}