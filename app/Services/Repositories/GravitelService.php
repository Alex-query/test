<?php
// app/Repositories/GravitelService.php
namespace App\Services\Repositories;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use App\Services\Contracts\ATSServiceInterface;
use App\Transformers\HistoryTransformer;
use Exception;

class GravitelService implements ATSServiceInterface
{
    /**
     * @var Client
     */
    private $client;

    private $historyTransformer;

    private $token ;
    private $url ;

    private $database;

    public function __construct($url, $token)
    {
        $this->client = new Client();
        $this->historyTransformer = new HistoryTransformer();
        $this->token = $token;
        $this->url = $url;

    }

    /**
     * @see \App\Services\Contracts\ATSServiceInterface::find()
     */
    public function find(Array $criteria)
    {
        $providerResponse = $this->listAccounts();
        $res=array_search($criteria['login'], array_column($providerResponse, 'name'));
        if($res!==false)
        {
            return $providerResponse[$res];
        }else{
            return null;
        }
    }

    /**
     * @see \App\Services\Contracts\ATSServiceInterface::listAccounts()
     */
    public function listAccounts()
    {
        try {
            $providerResponse = json_decode($this->client->post(
                $this->url,
                [
                    'form_params' => [
                        'cmd' => 'accounts',
                        'token' => $this->token
                    ]
                ]
            )->getBody()->getContents());
            return $providerResponse;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    /**
     * @see \App\Services\Contracts\ATSServiceInterface::makeCall()
     */
    public function makeCall(Array $criteria)
    {
        try {
            $providerResponse = json_decode($this->client->post(
                $this->url,
                [
                    'form_params' => [
                        'cmd' => 'makeCall',
                        'phone' => $criteria['destNumber'],
                        'user' => $criteria['srcNumber'],
                        'token' => $this->token
                    ]
                ]
            )->getBody()->getContents());
            if(isset($providerResponse->uuid))
            {
                return $providerResponse->uuid;
            }else{
                return null;
            }
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    /**
     * @see \App\Services\Contracts\ATSServiceInterface::getHistory()
     */
    public function getHistory(Array $criteria)
    {
        try {
            $providerResponseStr = $this->client->post(
                $this->url,
                [
                    'form_params' => [
                        'cmd' => 'history',
                        'period' => $criteria['period'],
                        'token' => $this->token
                    ]
                ]
            )->getBody()->getContents();
            $providerResponse=json_decode($providerResponseStr);
            if(isset($providerResponse->error))
            {
                return null;
            }else{
                $out=[];
                $rows=explode(PHP_EOL,$providerResponseStr);
                foreach ($rows as $row)
                {
                    $row=explode(",",$row);
                    if(count($row)>2) {
                        $out[]=$this->historyTransformer->transform($row);
                    }
                }
                return $this->filter($out,$criteria);
            }
        } catch (Exception $e) {
            throw new \Exception($e->getMessage());
        }
    }
    private function filter($out,$criteria)
    {
        if(isset($criteria["account"]))
        {
            return array_filter($out, function($item)use($criteria) {
                return (strpos($item["account"]."@", $criteria["account"]) !== false);
            });
        }
        return $out;
    }
}