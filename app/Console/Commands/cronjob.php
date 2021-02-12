<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class cronjob extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:cronjob';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run a Python script every 60 mins';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $output = shell_exec('source python/env/bin/activate && python python\sentiment-analysis.py');
        
        Log::info($output);
    }
}
