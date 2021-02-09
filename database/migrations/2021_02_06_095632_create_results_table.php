<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateResultsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->char('stock', 10);
            $table->integer('mentions');
            $table->char('source', 100);
            $table->double('bearish', 4, 3)->default(0);
            $table->double('neutral', 4, 3)->default(0);
            $table->double('bullish', 4, 3)->default(0);
            $table->double('total', 4, 3)->default(0);
            $table->timestamp('created_at', 0)->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('results');
    }
}
