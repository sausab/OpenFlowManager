<?php

function getURL()
{
	
	$fh = fopen("controller_ip", 'r');
	$url = fgets($fh);
	fclose($fh);
	$url = substr($url,0,count($url)-2);
    	return $url;
}

function getRestResponse($request)
{

	$session = curl_init($request);

	curl_setopt($session, CURLOPT_HEADER, true);
	curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

	$response = curl_exec($session);

	curl_close($session);

	return $response;

}


function deleteFlow($flow)
{

	$url = getURL();
	$request =  $url.'/wm/staticflowentrypusher/json';
                                                                    
	$data_string = json_encode($flow);                                                                                   
 
	$ch = curl_init($request);                                                                      
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: ' . strlen($data_string)));                                                                                                                   
 
	$result = curl_exec($ch);

}



function addFlow($flow)
{

	$url = getURL();
	$request =  $url.'/wm/staticflowentrypusher/json';
                                                                    
	$data_string = json_encode($flow);                                                                                   
 
	$ch = curl_init($request);                                                                      
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);                                                                  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);                                                                      
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: ' . strlen($data_string)));                                                                                                                   
 
	$result = curl_exec($ch);

}

function getSwitchList()
{

	$url = getURL();

	ini_set('display_errors',1); 
	error_reporting(E_ALL);

	$request =  $url.'/wm/core/controller/switches/json';

	$response = getRestResponse($request);

	$json = strstr($response, '[');

	$json_a = json_decode($json);

	$switchDesc;

	for($i=0;$i<count($json_a);$i++)
	{

		$request =  $url.'/wm/core/switch/'.$json_a[$i]->dpid.'/desc/json';

		$response = getRestResponse($request);

		$json = strstr($response, '{');

		$switchDesc[$i]["dpid"] = $json_a[$i]->dpid;
		$switchDesc[$i]["desc"] = $json;

	}

	echo json_encode($switchDesc);

}



function getSwitchPortStatistics($switchId)
{

	$url = getURL();

	$request =  $url.'/wm/core/switch/'.$switchId.'/port/json';

	$response = getRestResponse($request);

	$ports = strstr($response, '{');

	echo $ports;

}

function getSwitchFeatures($switchId)
{

	$url = getURL();

	$request =  $url.'/wm/core/switch/'.$switchId.'/features/json';

	$response = getRestResponse($request);

	$features = strstr($response, '{');

	echo $features;

}

function getListOfControllers()
{
	$controllerList;
	$i = 0;

	$url = getURL();
	$current_ip = substr($url,strpos($url,"http://")+7,-5);

	$controllerList[$i]["ip"] = $current_ip;
	$controllerList[$i]["name"] = "default";
	$controllerList[$i]["no"] = $i;

	$myFile = "controllers";
	$fh = fopen($myFile, 'r');

	while(!feof($fh))
	{
		if($i == 0)
		{
		      	$line = fgets($fh);
		      	$i++;
		      	continue;
		}

		$line = fgets($fh);
		$name = substr($line,0,strrpos($line,"|"));
		$ip = substr($line,strrpos($line,"|")+1,count($line)-2);
		$controllerList[$i]["ip"] = $ip;
		$controllerList[$i]["name"] = $name;
		$controllerList[$i]["no"] = $i;
		$i++;
	}

	fclose($fh);

	echo json_encode($controllerList);

}


function getSwitchDescription($switchId)
{

	$url = getURL();

	$request =  $url.'/wm/core/switch/'.$switchId.'/desc/json';

	$response = getRestResponse($request);

	$desc = strstr($response, '{');

	echo $desc;

 }

function getSwitchFlowStatistics($switchId)
{

	$url = getURL();

	$request =  $url.'/wm/core/switch/'.$switchId.'/flow/json';

	$response = getRestResponse($request);

	$flow = strstr($response, '{');

	echo $flow;

}

function getSwitchStaticFlows($switchId)
{

	$url = getURL();

	$request =  $url.'/wm/staticflowentrypusher/'.$switchId.'/json';

	$response = getRestResponse($request);

	$flow = strstr($response, '[');

	echo $flow;

}

function getSwitchQueueStatistics($switchId)
{

	$url = getURL();

	$request =  $url.'/wm/core/switch/'.$switchId.'/queue/json';

	$response = getRestResponse($request);

	$queue = strstr($response, '{');

	echo $queue;

}


function getSwitchHostStatistics($switchId)
{

	$url = getURL();

	$request =  $url.'/wm/core/switch/'.$switchId.'/host/json';

	$response = getRestResponse($request);

	$host = strstr($response, '{');

	echo $host;

}


function getSwitchTableStatistics($switchId)
{

	$url = getURL();

	$request =  $url.'/wm/core/switch/'.$switchId.'/table/json';

	$response = getRestResponse($request);

	$tables = strstr($response, '{');

	echo $tables;

}

function getSwitchAggregateStatistics($switchId)
{

	$url = getURL();

	$request =  $url.'/wm/core/switch/'.$switchId.'/aggregate/json';

	$response = getRestResponse($request);

	$aggregates = strstr($response, '{');

	echo $aggregates;

}


function selectController($ip)
{

	$myFile = "controller_ip";
	$fh = fopen($myFile, 'w') or die("can't open file");
	$url = "http://".$ip.":8080\n";
	fwrite($fh, $url);
	fclose($fh);

}

?>
