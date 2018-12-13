<?php
// app/Services/Contracts/ATSServiceInterface.php
namespace App\Services\Contracts;

Interface ATSServiceInterface
{

    /**
     * Get list accounts
     *
     * @return array
     */
    public function listAccounts();
    /**
     * Get history call
     *
     * @param array  $criteria   Key-value criteria
     * @return array
     */
    public function getHistory(Array $criteria);
    /**
     * Make call
     *
     * @param array  $criteria   Key-value criteria
     * @return string
     */
    public function makeCall(Array $criteria);

    /**
     * Search account(s)
     *
     * @param array  $criteria   Key-value criteria
     * @return object
     */
    public function find(Array $criteria);
}