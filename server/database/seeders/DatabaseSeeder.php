<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        
        DB::table('roles')->insert([
            'role' => "project manager",
        ]);
        DB::table('roles')->insert([
            'role' => "engineer",
        ]);

        DB::table("users")->insert(([
            'first_name'=>"joe",
            'last_name'=>"biden",
            'email'=>"joe@gmail.com",
            'password'=>Hash::make('1234567'),
            'role_id'=>1,
            "authMethod"=>"email",
        ]));
        DB::table("users")->insert(([
            'first_name'=>"mohamad",
            'last_name'=>"tarhini",
            'email'=>"mohamad@gmail.com",
            'password'=>Hash::make('1234567'),
            'role_id'=>1,
            "authMethod"=>"email",
            'profile_img'=>"http://127.0.0.1:8000/uploads/users_image/default.png"

        ]));

         DB::table('projects')->insert([
            'name' => "project-1",
            "description"=>"Two building blocks",
            "location"=>"Beirut",
            "status"=>"1",
            "created_by"=>"1",
            'created_at'=>"2023-09-04 17:25:55"
        ]);
        // DB::table('projects')->insert([
        //     'name' => "project-2",
        //     "description"=>"Hospital",
        //     "location"=>"Beirut",
        //     "status"=>"2",
        //     "created_by"=>"2",
        //     'created_at'=>"2023-09-04 17:25:55"

        // ]);

        DB::table("users")->insert(([
            'first_name'=>"lara",
            'last_name'=>"lara",
            'email'=>"lara@gmail.com",
            'password'=>Hash::make('1234567'),
            'role_id'=>1,
            "authMethod"=>"email",
            'profile_img'=>"http://127.0.0.1:8000/uploads/users_image/default.png"


        ]));
        DB::table("users")->insert(([
            'first_name'=>"hassan",
            'last_name'=>"hassan",
            'email'=>"hassan@gmail.com",
            'password'=>Hash::make('1234567'),
            'role_id'=>1,
            "authMethod"=>"email",
            'profile_img'=>"http://127.0.0.1:8000/uploads/users_image/default.png"


        ]));
        DB::table("users")->insert(([
            'first_name'=>"loren",
            'last_name'=>"loren",
            'email'=>"loren@gmail.com",
            'password'=>Hash::make('1234567'),
            'role_id'=>1,
            "authMethod"=>"email",
            'profile_img'=>"http://127.0.0.1:8000/uploads/users_image/default.png"


        ]));

        DB::table("calendars")->insert(([
            'project_id'=>1,
            'user_id'=>2
        ]));

         DB::table('tasks')->insert([
            ['id'=>1, 'text'=>'Project #1', 'start_date'=>'2017-04-01 00:00:00', 
                'duration'=>5, 'progress'=>0.8, 'parent'=>0, 'calendar_id'=>1],
            ['id'=>2, 'text'=>'Task #1', 'start_date'=>'2017-04-06 00:00:00', 
                'duration'=>4, 'progress'=>0.5, 'parent'=>1,'calendar_id'=>1],
            ['id'=>3, 'text'=>'Task #2', 'start_date'=>'2017-04-05 00:00:00', 
                'duration'=>6, 'progress'=>0.7, 'parent'=>1, 'calendar_id'=>1],
            ['id'=>4, 'text'=>'Task #3', 'start_date'=>'2017-04-07 00:00:00', 
                'duration'=>2, 'progress'=>0, 'parent'=>1, 'calendar_id'=>1],
            ['id'=>5, 'text'=>'Task #1.1', 'start_date'=>'2017-04-05 00:00:00', 
                'duration'=>5, 'progress'=>0.34, 'parent'=>2, 'calendar_id'=>1],
            ['id'=>6, 'text'=>'Task #1.2', 'start_date'=>'2017-04-11 00:00:00', 
                'duration'=>4, 'progress'=>0.5, 'parent'=>2, 'calendar_id'=>1],
            ['id'=>7, 'text'=>'Task #2.1', 'start_date'=>'2017-04-07 00:00:00', 
                'duration'=>5, 'progress'=>0.2, 'parent'=>3, 'calendar_id'=>1],
            ['id'=>8, 'text'=>'Task #2.2', 'start_date'=>'2017-04-06 00:00:00', 
                'duration'=>4, 'progress'=>0.9, 'parent'=>3, 'calendar_id'=>1]
        ]);



       

        
        // DB::table("teams")->insert(([
        //     'name'=>"team-1",
        //     'project_id'=>"1",
        // ]));
        // DB::table("teams")->insert(([
        //     'name'=>"team-2",
        //     'project_id'=>"1",
        // ]));
        // DB::table("teams")->insert(([
        //     'name'=>"team-3",
        //     'project_id'=>"1",
        // ]));
        // DB::table("teams")->insert(([
        //     'name'=>"team-11",
        //     'project_id'=>"2",
        // ]));
        // DB::table("teams")->insert(([
        //     'name'=>"team-12",
        //     'project_id'=>"2",
        // ]));

        // DB::table("members")->insert(([
        //     'team_id'=>"1",
        //     'user_id'=>"2",
        // ]));
        // DB::table("members")->insert(([
        //     'team_id'=>"1",
        //     'user_id'=>"3",
        // ]));
        // DB::table("members")->insert(([
        //     'team_id'=>"2",
        //     'user_id'=>"4",
        // ]));
        // DB::table("members")->insert(([
        //     'team_id'=>"4",
        //     'user_id'=>"1",
        // ]));
        // DB::table("members")->insert(([
        //     'team_id'=>"4",
        //     'user_id'=>"5",
        // ]));

        // DB::table('branches')->insert([
        //     'name' => "main",
        //     "project_id"=>"1",
        //     "team_id"=>null,
        // ]);
        // DB::table('branches')->insert([
        //     'name' => "main",
        //     "project_id"=>"2",
        //     "team_id"=>null,
        // ]);
        // DB::table('branches')->insert([
        //     'name' => "team-1 branch",
        //     "project_id"=>"1",
        //     "team_id"=>'1',
        // ]);
        // DB::table('branches')->insert([
        //     'name' => "second branch",
        //     "project_id"=>"1",
        //     "team_id"=>null,
        // ]);
        // DB::table('branches')->insert([
        //     'name' => "main",
        //     "description"=>"Two building blocks",
        //     "location"=>"Beirut",
        //     "status"=>"InProcress"
        // ]);
    }
}
