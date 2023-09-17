<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CommitController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\MemberController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "guest"], function(){
    Route::get("unauthorized", [AuthController::class, "unauthorized"])->name("unauthorized");
    Route::post("login", [AuthController::class, "login"]);
    Route::post("register", [AuthController::class, "register"]);
});


Route::group(["middleware" => "auth:api"], function(){
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
        });

        Route::group(["prefix" => "common"], function(){
            Route::get("get_project_Member/{project_id?}", [MemberController::class, "getProjectMember"]);
          
        });
});