<?php
// app/Providers/MongoUserProvider.php
namespace App\Providers;

use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

class GravitelUserProvider implements UserProvider
{
    /**
     * The Gravitel User Model
     */
    private $model;

    /**
     * Create a new mongo user provider.
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     * @return void
     */
    public function __construct(\Modules\Auth\Entities\User $userModel)
    {
        $this->model = $userModel;
    }

    /**
     * Retrieve a user by the given credentials.
     *
     * @param  array  $credentials
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByCredentials(array $credentials)
    {
        if (empty($credentials)) {
            return;
        }

        $user = $this->model->fetchUserByCredentials(['login' => $credentials['login'],'password' => $credentials['password']]);

        return $user;
    }

    /**
     * Validate a user against the given credentials.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  array  $credentials  Request credentials
     * @return bool
     */
    public function validateCredentials(Authenticatable $user, Array $credentials)
    {
        return ($credentials['login'] == $user->getAuthIdentifier() &&
            $credentials['password'] == $user->getAuthPassword());
    }

    public function retrieveById($identifier) { return $this->model;}

    public function retrieveByToken($identifier, $token) {echo 2;die();}

    public function updateRememberToken(Authenticatable $user, $token) {$user->setRememberToken($token);}
}