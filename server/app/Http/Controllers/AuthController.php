<?php 

namespace App\Http\Controllers;
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
        
        return response()->json([
                'status' => 'success',
                'data' => $user
            ]);

    }

    public function register(Request $request){
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            // 'profile_img'=>'|image|mimes:jpeg,png,jpg,gif,svg|max:2048|null'
        ]);

        $user = new User; 
        $user->first_name = $request->first_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->profile_img = $request->profile_img;
        $user->role_id = 1;
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