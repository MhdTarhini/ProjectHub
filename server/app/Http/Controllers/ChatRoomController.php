<?php

namespace App\Http\Controllers;

use App\Models\ChatRoom;
use App\Models\Member;
use App\Models\RoomMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatRoomController extends Controller
{
    function newRoom(Request $request){
        $user=Auth::user();
        $room = new ChatRoom();
        $room->name=$request->name;
        $room->project_id=$request->project_id;
        $room->created_by=$user->id;
        $room->Room_db_id=$request->Room_db_id;
        $room->room_image=$request->room_image;
        $room->save();

        foreach($request->room_member as $member){
            $member_room=new RoomMember;
            $member_room->user_id=$member;
            $member_room->room_id=$room->id;
            $member_room->save();
        }

        $member_room=new RoomMember;
            $member_room->user_id=$user->id;
            $member_room->room_id=$room->id;
            $member_room->save();

        $added_room= $room->with("RoomMember.user")->get();

         return response()->json([
            'status' => 'success',
            'data'=>$added_room,
        ]);
    }

    function getRooms(){
        $user=Auth::user();
        $user_member=RoomMember::Where("user_id",$user->id)->pluck('room_id');
        $rooms=ChatRoom::WhereIn("id",$user_member)->with("RoomMember")->get();

          return response()->json([
            'status' => 'success',
            'data'=>$rooms,
        ]);
    }
}
