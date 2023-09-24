<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoom extends Model
{
    use HasFactory;
    public function RoomMember(){

        return $this->hasMany(RoomMember::class, 'room_id');

    }
   
}
