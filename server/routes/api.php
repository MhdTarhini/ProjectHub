<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ChatRoomController;
use App\Http\Controllers\CommitController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\IssueContentController;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TeamController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "guest"], function(){
    Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("unauthorized");
    Route::post("login", [AuthController::class, "login"]);
    Route::post("register", [AuthController::class, "register"]);
});


Route::group(["middleware" => ["auth:api", 'cors']], function(){
        Route::post("logout", [AuthController::class, "logout"]);
        Route::post("refresh", [AuthController::class, "refresh"]);
        Route::get("profile", [AuthController::class, "profile"]);

        Route::group(["prefix" => "file-section"], function(){
            Route::post("upload_file", [FileController::class, "uploadFile"]);
            Route::post("get_files", [FileController::class, "getFiles"]);
            Route::get("get_dxf_Data/{id?}", [FileController::class, "getdxfFileData"]);
            Route::post("get_dxf_path", [FileController::class, "getFilePath"]);
            Route::post("add_commit", [CommitController::class, "addCommit"]);
            Route::post("check_conflict", [CommitController::class, "checkConflict"]);
            Route::get("get_commits/{file_id?}", [CommitController::class, "getFileCommit"]);
            Route::get("get_branches/{project_id?}", [BranchController::class, "getBranches"]);
            Route::post("new_branch", [BranchController::class, "addBranch"]);
            Route::post("push_local_commit", [CommitController::class, "pushlocalCommit"]);
            Route::post("main_commit", [CommitController::class, "addMainCommit"]);
            Route::get('download_file/{file_name?}', [FileController::class, "downloadFile"]);
            Route::post('pull_main', [FileController::class, "pullFromMain"]);
            Route::post('accepte_file', [FileController::class, "accepteFile"]);
        });
        Route::group(["prefix" => "project-section"], function(){
            Route::post("new_project/{id?}",[ProjectController::class,"newProject"]);
            Route::post("get_projects",[ProjectController::class,"getProjects"]);
            Route::post("update_status",[ProjectController::class,"updateStatus"]);
            Route::post("remove_member",[MemberController::class,"removeMember"]);
            Route::post("add_team",[TeamController::class,"addTeam"]);
        });
        Route::group(["prefix" => "issue-section"], function(){
            Route::post("add_edit_issue",[IssueController::class,"newIssue"]);
            Route::get("get_issues_posts/{project_id?}",[IssueController::class,"getIssuesPosts"]);
            Route::post("add_comment",[IssueController::class,"addComment"]);
            Route::post("add_media",[IssueController::class,"addMedia"]);
            Route::post("add_members",[IssueController::class,"addMembers"]);
            
        });
        Route::group(["prefix" => "chat-section"], function(){
            Route::post("add_room",[ChatRoomController::class,"newRoom"]);
            Route::get("get_rooms",[ChatRoomController::class,"getRooms"]);
            
        });

        Route::group(["prefix" => "common"], function(){
            Route::get("get_project_Member/{project_id?}", [MemberController::class, "getProjectMember"]);
            Route::get("get_all_users_not_active", [TeamController::class, "getAllUsersNoActive"]);
          
        });
});