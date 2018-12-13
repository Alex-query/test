<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Services\Repositories\GravitelService;
use Illuminate\Support\Facades\Auth;
use Modules\Auth\Entities\User;
use App\Providers\GravitelUserProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        $this->app->bind('App\Repositories\GravitelService', function ($app) {
            return new GravitelService(config('gravitel.url'), config('gravitel.token'));
        });
        $this->app->bind('Modules\Auth\Entities\User', function ($app) {
            return new User($app->make('App\Repositories\GravitelService'));
        });
        Auth::provider('users_gravitel', function ($app, array $config) {
            return new GravitelUserProvider($app->make('Modules\Auth\Entities\User'));
        });
        //
    }

    public function register()
    {
        $this->app->bind(
            'App\Services\Contracts\ATSServiceInterface',
            'App\Repositories\GravitelService'
        );
    }
}
