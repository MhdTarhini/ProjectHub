<?php

namespace App\Http\Controllers;

use App\Models\Comment;
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
            $content->svg_path="http://34.244.172.132/uploads/issues_image/".$imageName;
            $content->issues_id=$issue->id;
            $content->user_id=$user->id;
            $content->save();

        }

        $member=new IssueMembers;
        $member->user_id=$user->id;
        $member->issues_id=$issue->id;
        $member->save();

        return response()->json([
            'status' => 'success',
            'issue'=>$issue,
            'content'=>$content ? $content: ''

        ]);

    }
    function getIssuesPosts($project_id){

        $user=Auth::user();

        $member_in=IssueMembers::Where("user_id",$user->id)->pluck("issues_id");


        $AllIssuesPosts=Issue::whereIn("id",$member_in)->where("project_id",$project_id)->with("user")->with("contents.users")->with("members.users")->with("comments.users")->orderBy('created_at', 'desc')->get();


        return response()->json([
            'status' => 'success',
            'data'=>$AllIssuesPosts,
        ]);

    }
     function addComment(Request $request){
    $user=Auth::user();
    $add_comment=new Comment();
    $add_comment->content = $request->content;
    $add_comment->issue_id = $request->issue_id;
    $add_comment->user_id = $user->id;

    $add_comment->save();

    $added_comment=Comment::where("id",$add_comment->id)->with('users')->first();

       return response()->json([
            'status' => 'success',
            'data'=>$added_comment,
        ]);

   }
   function addMedia(Request $request){
    $request->validate([
        'title' => 'required|string|max:255',
        'content_image' => 'required|image',
        ]);
    $user=Auth::user();
     if ($request->hasFile('content_image')) {
            $image = $request->file('content_image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/issues_image'), $imageName);
        }
    $new_media=new IssueContent;
    $new_media->user_id=$user->id;
    $new_media->svg_path="http://34.244.172.132/uploads/issues_image/".$imageName;
    $new_media->issues_id=$request->issue_id;
    $new_media->description=$request->title;
    $new_media->save();

    
    $media=IssueContent::where("id",$new_media->id)->with('users')->first();

    return response()->json([
            'status' => 'success',
            'data'=>$media,
        ]);
   }
   function addMembers(Request $request){
    $request->validate([
        'members' => 'required',
    ]);

    $newMembers = [];
    foreach($request->members as $member){
        $add_member = new IssueMembers;
        $add_member->issues_id = $request->issue_id;
        $add_member->user_id = $member;
        $add_member->save();

        $newMember = IssueMembers::where('id', $add_member->id)->with('users')->first();
        $newMembers[] = $newMember;
    }

    return response()->json([
        'status' => 'success',
        'data' => $newMembers
    ]);

   }
}
