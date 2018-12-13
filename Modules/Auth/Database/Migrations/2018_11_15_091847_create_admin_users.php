<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdminUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('login');
            $table->string('password');
            $table->string('role');
            $table->string('info')->nullable();
            $table->string('remember_token');
            $table->dateTime('created_at')->nullable()->default(NULL);
            $table->dateTime('updated_at')->nullable()->default(NULL);
        });
        \DB::table('admin_users')->insert(array("name"=>'admin',"login"=>'admin',"password"=>\Hash::make('admin1024'),"role"=>'admin','info'=>'','remember_token'=>''));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admin_users');
    }
}
