<?php

namespace App\Http\Controllers;

use App\Models\Calendar;
use App\Models\Task;
use App\Models\TaskLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskContorller extends Controller
{
    function uploadTasks(Request $request){
        $user=Auth::user();

        $user_calendar=Calendar::where("user_id",$user->id)->where("project_id",$request->project_id)->first();

        foreach($request->created_tasks as $task){
            if($task['action']==="create"){
                $selected_task=new Task;
            }else{
                $selected_task=Task::find($task['id']);
                if(!$selected_task) {
                $selected_task=new Task;
                }
            }
            if($task['action']==="delete"){
                $selected_task->delete();
            }else{
                
                $selected_task->calendar_id=$user_calendar->id;
                $selected_task->text=$task['text'];
                $selected_task->duration=$task['duration'];
                $selected_task->start_date=$task['start_date'];
                $selected_task->progress=$task["progress"] ? $task["progress"] : 0;
                $selected_task->parent = $task["parent"];
                $selected_task->save();
            }
        }
        foreach($request->created_links as $link){
            if($link['action']==="create"){
                $selected_link=new TaskLink;
            }else{
                $selected_link=TaskLink::where("source",$link['source'])->where("target",$link['target'])->where("type",$link['type'])->first();
            }
            if($link['action']==="delete"){
                $selected_link->delete();
            }else{
                $selected_link->calendar_id=$user_calendar->id;
                $selected_link->source=$link['source'];
                $selected_link->target=$link['target'];
                $selected_link->type=$link['type'];
                $selected_link->save();
            }
        }
          return response()->json([
            'status' => 'success',
        ]);

    }

    public function getTasks($id,$project_id){
        
        $user_calendar=Calendar::where("user_id",$id)->where("project_id",$project_id)->pluck("id");
        $user_task=Task::where("calendar_id",$user_calendar)->get();
        $user_link=TaskLink::where("calendar_id",$user_calendar)->get();

        if ($user_task->isEmpty() && $user_link->isEmpty()) {
        return response()->json([
            "data" => [],
            "links" => []
        ]);
    }
 
        return response()->json([
            "data" => $user_task,
            "links" => $user_link
        ]);
    }

    function checkCalendar($project_id){
        $user=Auth::user();
        $taskExists=Calendar::where("user_id",$user->id)->where("project_id",$project_id)->exists();
        if($taskExists){
            return response()->json([
                "status" => "success",
            ]);
        }else{
            return response()->json([
                "status" => "failed",
            ]);
        }
        }

        function createCalendar($project_id){
            $user=Auth::user();
            $Calendar = new Calendar;
            $Calendar->user_id=$user->id;
            $Calendar->project_id=$project_id;
            $Calendar->save();

            return response()->json([
            'status' => 'success',
        ]);


        }

        function tasksTitle($project_id){
            $user=Auth::user();
            $taskExists=Calendar::where("user_id",$user->id)->where("project_id",$project_id)->first();
            if($taskExists){
                $user_task=Task::where("calendar_id",$taskExists->id)->get();

            return response()->json([
                "status" => "success",
                "data" => $user_task,
            ]);
        }else{
            return response()->json([
                "status" => "failed",
            ]);
        }

        }
  
}
