<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('commits', function (Blueprint $table) {
            $table->id();
            $table->string('message');
            $table->string('old_path_dxf')->nullable();
            $table->string('new_path_dxf');
            $table->string('new_path_svg');
            $table->string('compare_path_svg')->nullable();
            $table->string('commit_unique_id');
            $table->string('status');
            $table->unsignedBigInteger('file_id')->nullable();
            $table->foreign('file_id')->references('id')->on('files');
            $table->unsignedBigInteger('branch_main_id')->nullable();
            $table->foreign('branch_main_id')->references('id')->on('branches');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commits');
    }
};
