<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use App\Models\TaskLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskLinkContorller extends Controller
{
    public function store(Request $request){
        $user=Auth::user();
        $user_calendar=Calendar::where("user_id",$user->id)->pluck("id")->first();
        
        $link = new TaskLink();
        $link->type = $request->type;
        $link->source = $request->source;
        $link->target = $request->target;
        $link->calendar_id=$user_calendar;

 
        $link->save();
 
        return response()->json([
            "action"=> "inserted",
            "tid" => $link->id
        ]);
    }
 
    public function update($id, Request $request){
        $user=Auth::user();
        $user_calendar=Calendar::where("user_id",$user->id)->pluck("id")->first();
        
        $link = TaskLink::find($id);
        $link->type = $request->type;
        $link->source = $request->source;
        $link->target = $request->target;
        $link->calendar_id=$user_calendar;

        $link->save();
 
        return response()->json([
            "action"=> "updated"
        ]);
    }
 
    public function destroy($id){
        $link = TaskLink::find($id);
        $link->delete();
 
        return response()->json([
            "action"=> "deleted"
        ]);
    }
}
