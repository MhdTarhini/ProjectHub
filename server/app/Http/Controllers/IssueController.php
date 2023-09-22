<?php

namespace App\Http\Controllers;

use App\Models\Issue;
use App\Models\IssueContent;
use App\Models\IssueMembers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IssueController extends Controller
{
     function newIssue(Request $request , $id="add"){
        $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string|max:255',
        ]);
        $user=Auth::user();
        
        if($id="add"){
            $issue=new Issue;
        }else{
            $issue=Issue::Where("id",$id);
        }

        $issue->title=$request->title;
        $issue->description=$request->description;
        $issue->status=$request->status;
        $issue->project_id=$request->project_id;
        $issue->user_id=$user->id;
        $issue->save();

         $imageName = null;
         $content=null;
        if ($request->hasFile('issue-image')) {
            $image = $request->file('issue-image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/issues_image'), $imageName);

            if($id="add"){
                $content=new IssueContent();
            }else{
                $content=IssueContent::Where("issues_id",$id);
            }

            $content->description=$request->issue_image_descrition;
            $content->svg_path="http://127.0.0.1:8000/uploads/issues_image/".$imageName;
            $content->issues_id=$issue->id;
            $content->user_id=$user->id;
            $content->save();

        }

        return response()->json([
            'status' => 'success',
            'issue'=>$issue,
            'content'=>$content ? $content: ''

        ]);

    }
    function getIssuesPosts($project_id){

        $user=Auth::user();

        $member_in=IssueMembers::Where("user_id",$user->id)->pluck("issues_id");


        $AllIssuesPosts=Issue::whereIn("id",$member_in)->where("project_id",$project_id)->with("contents.users")->with("members.users")->with("comments.users")->get();


        return response()->json([
            'status' => 'success',
            'data'=>$AllIssuesPosts,
        ]);

    }
}
