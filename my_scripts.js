// Global variables
var switchId="";
var modifyFlag = 0;
var flowName = "";

var actions = new Array();
var actionCount=0;
var actionIndex=0;

function setSwitchId(id)
{
	
	switchId = id;
	console.log(switchId);

}

function setModify(fName)
{
	flowName = fName;
	modifyFlag = 1;
}

function selectController()
{
	var checkedValue = $("#myForm input[type='radio']:checked").val();
	if(checkedValue)
	{
		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/selectController/"+checkedValue,
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{				
				console.log("Selected Controller: "+checkedValue);
			}
                });
	}

}


function deleteFlow(fName)
{

	var data = "{\"switch\": \""+$('#fd_switches_container').val()+"\", \"name\":\""+fName+"\"}";

	console.log($('#fd_switches_container').val());
	console.log(fName);
	flowData = jQuery.parseJSON(data);

	$.ajax({

              url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/deleteFlow/flow",
              async: false,
              data: {'flow': flowData},
              type: 'POST',
		error: function(jqXHR, textStatus, errorThrown)
		{
        		console.log('ajaxError '+textStatus+' '+errorThrown);
		},	
		success: function(data,textStatus,jqXHR)
		{				
			console.log("Success");
			$('#fd_switches_cont').change();
		}
	});

}


function addFlow()
{

if($('#name').val() != "" && $('#switches_container option:selected').val() != "select" && actionIndex != 0)
{

	var switchNo = $('#switches_container option:selected').val();
	var ingress_port = $('#switch_ports_container option:selected').val();
	var flowName = $('#name').val();
	var flowPriority = $('#priority').val();
	var active = $("#activeForm input[type='radio']:checked").val();
	var src_mac = $('#sourceMAC1').val() + ":" + $('#sourceMAC2').val() + ":" + $('#sourceMAC3').val() + ":" + $('#sourceMAC4').val() + ":" + $('#sourceMAC5').val() + ":" + $('#sourceMAC6').val();
	var dst_mac = $('#destinationMAC1').val() + ":" + $('#destinationMAC2').val() + ":" + $('#destinationMAC3').val() + ":" + $('#destinationMAC4').val() + ":" + $('#destinationMAC5').val() + ":" + $('#destinationMAC6').val();
	var vlan_id = $('#vlanID').val();
	var vlan_pcp = $('#userPriority').val();
	var eth_type = $("#ethTypeForm input[type='radio']:checked").val();
	var arp_op_code = $('#arp_op_code').val();
	var src_mac_arp = $('#sourceMACARP1').val() + ":" + $('#sourceMACARP2').val() + ":" + $('#sourceMACARP3').val() + ":" + $('#sourceMACARP4').val() + ":" + $('#sourceMACARP5').val() + ":" + $('#sourceMACARP6').val();
	var dst_mac_arp = $('#destinationMACARP1').val() + ":" + $('#destinationMACARP2').val() + ":" + $('#destinationMACARP3').val() + ":" + $('#destinationMACARP4').val() + ":" + $('#destinationMACARP5').val() + ":" + $('#destinationMACARP6').val();
	var src_ip = $('#sourceIP1').val() + "." + $('#sourceIP2').val() + "." + $('#sourceIP3').val() + "." + $('#sourceIP4').val();
	var dst_ip = $('#destinationIP1').val() + "." + $('#destinationIP2').val() + "." + $('#destinationIP3').val() + "." + $('#destinationIP4').val();
	var dscp = $('#DSCP').val();
	var tos = $('#tos').val();
	var ip_protocol = $('#ip_protocol').val();
	var icmp_type = $('#icmp_type').val();
	var icmp_code = $('#icmp_code').val();
	var source_port = $('#source_port').val();
	var destination_port = $('#destination_port').val();

	var data = "{\"switch\": \""+switchNo+"\", \"name\":\""+flowName+"\", \"cookie\":\"0\", \"priority\":\""+flowPriority+"\", \"ingress-port\":\""+ingress_port+"\",\"active\":\""+active+"\", \"actions\":\"output="+actions[0]["out_port"]+"\"}";

	flowData = jQuery.parseJSON(data);
	console.log("start"+flowData["name"]);

	$.ajax({

              url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/addFlow/flow",
              async: false,
              data: {'flow': flowData},
              type: 'POST',
		error: function(jqXHR, textStatus, errorThrown)
		{
        		console.log('ajaxError '+textStatus+' '+errorThrown);
		},	
		success: function(data,textStatus,jqXHR)
		{				
			console.log("Success");
		}
	});

	window.open('#index','_self',false);

}


}


function deleteAction(actionNumber)
{

	if(actionCount == 9) actionCount -= 2;
	else actionCount--;

	actions[actionNumber] = null;

	var actionHtml="";
	$('#action_count_container').html("");

	for(var i=0;i<=actionIndex;i++)
	{
		if(actions[i] != null)
		{
				actionHtml += "<br><table border=\"0\" width=\"100%\"><tr><td align=\"left\" width=\"95%\"><h4>{ACTION_TYPE: "+actions[i]["action_type"]+", OUT_PORT: "+actions[i]["out_port"]+"} added</h4></td><td align=\"right\" width=\"5%\"><a href=\"#\" data-role=\"button\" data-icon=\"delete\" data-theme=\"b\" onclick=\"deleteAction("+i+")\">Delete</a></td></tr></table>";
		}
	}
	
	$('#action_count_container').append(actionHtml);
	$('#action_count_container').trigger('create');

}


function addAction()
{

if( $('#action_type option:selected').val() != "choose-one" && $('#action_out_port option:selected').val() != "choose-one" )
{

if(($('#action_type option:selected').val() == "OUTPUT" && $('#OUTPUT option:selected').val() != "select" && $('#switches_container option:selected').val() != "select"))
{
	if(actionCount == 8)
	{
		$('#action_count_container').append("<br><br>Maximum 8 Actions are allowed");
		actionCount++;
	}
	if(actionCount <= 7)
	{
	
		actions[actionIndex] = new Array();

		actions[actionIndex]["out_port"] = $('#action_out_port option:selected').val();
		actions[actionIndex]["value"] = $('#OUTPUT option:selected').val();
		actions[actionIndex]["action_type"] = $('#action_type option:selected').val();
		actions[actionIndex]["enqueue"] = $('#ENQUEUE').val();
		actions[actionIndex]["vlan_id"] = $('#VLAN_ID').val();
		actions[actionIndex]["vlan_pcp"] = $('#VLAN_PCP').val();
		actions[actionIndex]["dl_src"] = $('#SET_DL_SRC1').val() + ":" + $('#SET_DL_SRC2').val() + ":" + $('#SET_DL_SRC3').val() + ":" + $('#SET_DL_SRC4').val() + ":" + $('#SET_DL_SRC5').val() + ":" + $('#SET_DL_SRC6').val();
		actions[actionIndex]["dl_dst"] = $('#SET_DL_DST1').val()+":"+$('#SET_DL_DST2').val()+":"+$('#SET_DL_DST3').val()+":"+$('#SET_DL_DST4').val()+":"+$('#SET_DL_DST5').val()+":"+$('#SET_DL_DST6').val();
		actions[actionIndex]["nw_src"] = $('#SET_NW_SRC1').val()+"."+$('#SET_NW_SRC2').val()+"."+$('#SET_NW_SRC3').val()+"."+$('#SET_NW_SRC4').val();
		actions[actionIndex]["nw_dst"] = $('#SET_NW_DST1').val()+"."+$('#SET_NW_DST2').val()+"."+$('#SET_NW_DST3').val()+"."+$('#SET_NW_DST4').val();
		actions[actionIndex]["nw_dscp"] = $('#SET_NW_DSCP').val();
		actions[actionIndex]["nw_tos"] = $('#SET_NW_TOS').val();
		actions[actionIndex]["tp_src"] = $('#SET_TP_SRC').val();
		actions[actionIndex]["tp_dst"] = $('#SET_TP_DST').val();
	
		var actionHtml="";
		$('#action_count_container').html("");

		for(var i=0;i<=actionIndex;i++)
		{
			if(actions[i] != null)
			{
				actionHtml += "<br><table border=\"0\" width=\"100%\"><tr><td align=\"left\" width=\"95%\"><h4>{ACTION_TYPE: "+actions[i]["action_type"]+", OUT_PORT: "+actions[i]["out_port"]+"} added</h4></td><td align=\"right\" width=\"5%\"><a href=\"#\" data-role=\"button\" data-icon=\"delete\" data-theme=\"b\" onclick=\"deleteAction("+i+")\">Delete</a></td></tr></table>";
			}
		}
		
		$('#action_count_container').append(actionHtml);
		$('#action_count_container').trigger('create');
		actionCount++;
		actionIndex++;

	}

}

}


}




$(document).ready(function()
{

	$('#topology_explorer').bind('pagebeforeshow',function() 
	{

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switches",
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{				
				console.log(data);
				object = jQuery.parseJSON(data);
				console.log(object);

				var dpids = new Array();
				
				for(var i=0;i<object.length;i++)
				{
					dpids[i] = new Array();
					var dpid = object[i]["dpid"];
					dpids[i]["dpid"] = object[i]["dpid"];
					var desc = jQuery.parseJSON(object[i]["desc"]);
					console.log(desc);
					dpids[i]["desc"] = desc[dpid][0]["manufacturerDescription"];
				}

				$('#te_list_container').html("");
				$('#topology_explorer_template').tmpl(dpids).appendTo('#te_list_container');
				$('#te_list_container').listview('refresh');
				$('#te_list_container li:first').addClass('ui-corner-top');
				$('#te_list_container li:last').addClass('ui-corner-bottom');
				$('#te_list_container a').addClass('ui-corner-top');
				$('#te_list_container a').addClass('ui-corner-bottom');
		
			}
                });



	});



	$('#port_statistics').bind('pagebeforeshow',function() 
	{

		var ports;
		var features;
		var stats = new Array();
		console.log(switchId);

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchPorts/"+switchId,
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{				
				object = jQuery.parseJSON(data);
				ports = object[switchId];
				console.log(ports);


				$.ajax({
			
					url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchFeatures/"+switchId,
					async: false,
     		  			context: document.body,
		  			success: function(data,textStatus,jqXHR)
					{			
						object = jQuery.parseJSON(data);
						features = object[switchId]["ports"];
						console.log(features);

						for(var i=0;i<ports.length;i++)
						{
							stats[i] = new Array();
							stats[i]["portNumber"] = ports[i]["portNumber"];
							stats[i]["receivePackets"] = ports[i]["receivePackets"];
							stats[i]["transmitPackets"] = ports[i]["transmitPackets"];
							stats[i]["receiveBytes"] = ports[i]["receiveBytes"];
							stats[i]["transmitBytes"] = ports[i]["transmitBytes"];
							stats[i]["portName"] = features[i]["name"];
							stats[i]["hdAddress"] = features[i]["hardwareAddress"];
							stats[i]["status"] = features[i]["state"];
						}

						$('#ps_collapsible_container').html("");
						$('#port_statistics_template').tmpl(stats).appendTo('#ps_collapsible_container');
						$('#ps_collapsible_container ul').listview();
						$('div[data-role="collapsible"]').collapsible();
					}
              		});

			}
                });

	});



	$('#host_statistics').bind('pagebeforeshow',function() 
	{

		var stats = new Array();
		var hosts;
		console.log(switchId);

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchHosts/"+switchId,
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{				
				object = jQuery.parseJSON(data);
				hosts = object[switchId];
				console.log(hosts);

				for(var i=0;i<hosts.length;i++)
				{
					stats[i] = new Array();
					stats[i]["hostNumber"] = (i+1);
					stats[i]["mac"] = hosts[i]["mac"];
					stats[i]["port"] = hosts[i]["port"];
					stats[i]["vlan"] = hosts[i]["vlan"];
				}

				$('#hs_collapsible_container').html("");
				$('#host_statistics_template').tmpl(stats).appendTo('#hs_collapsible_container');
				$('#hs_collapsible_container ul').listview();
				$('div[data-role="collapsible"]').collapsible();
				
			}
                });

	});



	$('#controller_selection').bind('pagebeforecreate',function() 
	{

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/getControllers",
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{			
				jsonObject = jQuery.parseJSON(data);
				var current = jsonObject[0]["ip"];
				console.log(current);
				$('#controller_selection_template').tmpl(jsonObject).appendTo('#cs_controlgroup_container');
				$('#cs_controlgroup_container :radio').each(function(idx,el){if($(el).attr('value') == current) $(el).attr('checked','true');});
				$('#cs_controlgroup_container label').first().remove();
				$('#cs_controlgroup_container :radio').first().remove();
//				if($('#cs_controlgroup_container :radio').first().attr('checked','true');
			}
                });



	});

	$('#table_statistics').bind('pagebeforeshow',function() 
	{

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchTables/"+switchId,
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{			
				jsonObject = jQuery.parseJSON(data);
				console.log(jsonObject);

				$('#ts_collapsible_container').html("");
				$('#table_statistics_template').tmpl(jsonObject[switchId]).appendTo('#ts_collapsible_container');
				$('#ts_collapsible_container ul').listview();
				$('div[data-role="collapsible"]').collapsible();
			}
                });



	});


	$('#flow_statistics').bind('pagebeforeshow',function()
	{

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchFlows/"+switchId,
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{			
				console.log("flow stats");
				console.log(switchId);
				jsonObject = jQuery.parseJSON(data);
				var flowStats = new Array();
				for(var i=0;i<jsonObject[switchId].length;i++)
				{
					console.log("inside for");
					flowStats[i] = new Array();
					flowStats[i]["packetCount"] = jsonObject[switchId][i]["packetCount"];
					flowStats[i]["byteCount"] = jsonObject[switchId][i]["byteCount"];
					flowStats[i]["hardTimeout"] = jsonObject[switchId][i]["hardTimeout"];
					flowStats[i]["idleTimeout"] = jsonObject[switchId][i]["idleTimeout"];
					flowStats[i]["durationSeconds"] = jsonObject[switchId][i]["durationSeconds"];
					flowStats[i]["tableId"] = jsonObject[switchId][i]["tableId"];
					flowStats[i]["priority"] = jsonObject[switchId][i]["priority"];
					flowStats[i]["dataLayerDestination"] = jsonObject[switchId][i]["match"]["dataLayerDestination"];
					flowStats[i]["dataLayerSource"] = jsonObject[switchId][i]["match"]["dataLayerSource"];
					flowStats[i]["dataLayerType"] = jsonObject[switchId][i]["match"]["dataLayerType"];
					flowStats[i]["dataLayerVirtualLan"] = jsonObject[switchId][i]["match"]["dataLayerVirtualLan"];
					flowStats[i]["dataLayerVirtualLanPriorityCodePoint"] = jsonObject[switchId][i]["match"]["dataLayerVirtualLanPriorityCodePoint"];
					flowStats[i]["inputPort"] = jsonObject[switchId][i]["match"]["inputPort"];
					flowStats[i]["networkDestination"] = jsonObject[switchId][i]["match"]["networkDestination"];
					flowStats[i]["networkDestinationMaskLen"] = jsonObject[switchId][i]["match"]["networkDestinationMaskLen"];
					flowStats[i]["networkProtocol"] = jsonObject[switchId][i]["match"]["networkProtocol"];
					flowStats[i]["networkSource"] = jsonObject[switchId][i]["match"]["networkSource"];
					flowStats[i]["networkTypeOfService"] = jsonObject[switchId][i]["match"]["networkTypeOfService"];
					flowStats[i]["transportDestination"] = jsonObject[switchId][i]["match"]["transportDestination"];
					flowStats[i]["transportSource"] = jsonObject[switchId][i]["match"]["transportSource"];
					flowStats[i]["wildcards"] = jsonObject[switchId][i]["match"]["wildcards"];
					flowStats[i]["flowId"] = i+1;
					flowStats[i]["actions"] = new Array();
					for(var j=0;j<jsonObject[switchId][i]["actions"].length;j++)
					{
						console.log("Inside 2nd for");
						flowStats[i]["actions"][j] = new Array();
						flowStats[i]["actions"][j]["no"] = (j+1);
						flowStats[i]["actions"][j]["port"] = jsonObject[switchId][i]["actions"][j]["port"];
						flowStats[i]["actions"][j]["type"] = jsonObject[switchId][i]["actions"][j]["type"];
					}

				}

				console.log(flowStats);
				$('#fs_collapsible_container').html('');
				$('#fs_gp_template').tmpl(flowStats).appendTo('#fs_collapsible_container');
				for(var i=0;i<flowStats.length;i++)
				{
					var container_name = '#fs_list_template_'+(i+1);
					$('#fs_actions_template').tmpl(flowStats[i]["actions"]).appendTo(container_name);
				}
				$('#fs_collapsible_container ul').listview();
				$('div[data-role="collapsible"]').collapsible();
	
				$('#fs_collapsible_container ul li').each(function(idx,el){if($(el).html().indexOf(">00:00:00:00:00:00</span>") != -1 || $(el).html().indexOf(">0.0.0.0</span>") != -1 || $(el).html().indexOf(">0</span>") != -1 || $(el).html().indexOf("></span>") != -1) $(el).remove();});

			}
                });



	});


	$('#statistics').bind('pagebeforeshow',function() 
	{

		var info = new Array();
		var desc;
		var ports;
		var flows;
		var features;
		var queues;
		var hosts;

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchDescription/"+switchId,
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{			
				desc = jQuery.parseJSON(data);
				console.log(desc);

				$.ajax({
			
					url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchFeatures/"+switchId,
					async: false,
     				  	context: document.body,
				  	success: function(data,textStatus,jqXHR)
					{			
						features = jQuery.parseJSON(data);
						console.log(features);

						$.ajax({
			
							url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchFlows/"+switchId,
							async: false,
     						  	context: document.body,
						  	success: function(data,textStatus,jqXHR)
							{			
								flows = jQuery.parseJSON(data);
								console.log(flows);

								$.ajax({
			
									url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchQueues/"+switchId,
									async: false,
     						  			context: document.body,
						  			success: function(data,textStatus,jqXHR)
									{			
										queues = jQuery.parseJSON(data);
										console.log(queues);

										$.ajax({
			
											url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchHosts/"+switchId,
											async: false,
     								  			context: document.body,
								  			success: function(data,textStatus,jqXHR)
											{			
												hosts = jQuery.parseJSON(data);
												console.log(hosts);
		
												info[0] = new Array();
												info[0]["dpid"] = switchId;
												info[0]["manufacturerDescription"] = desc[switchId][0]["manufacturerDescription"];
												info[0]["hardwareDescription"] = desc[switchId][0]["hardwareDescription"];
												info[0]["softwareDescription"] = desc[switchId][0]["softwareDescription"];
												info[0]["serialNumber"] = desc[switchId][0]["serialNumber"];
												info[0]["buffers"] = features[switchId]["buffers"];
												info[0]["ports"] = features[switchId]["ports"].length;
												info[0]["flows"] = flows[switchId].length;
												info[0]["queues"] = queues[switchId].length;
												info[0]["hosts"] = hosts[switchId].length;
												console.log(info);
		
												$('#stats_table_container').html("");
												$('#statistics_template').tmpl(info).appendTo('#stats_table_container');
		
											}
				              		  		});

									}
		              		  		});


							}
		              		  });

					}
              		  });

			}
                });



	});


	$('#switch_aggregate_statistics').bind('pagebeforeshow',function() 
	{

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchAggregates/"+switchId,
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{				
				object = jQuery.parseJSON(data);

				$('#sas_list_container').html("");
				$('#switch_aggregate_statistics_template').tmpl(object[switchId]).appendTo('#sas_list_container');
				$('#sas_list_container').listview('refresh');
		
			}
                });



	});


	$('#flow_deletion').bind('pagebeforeshow',function() 
	{

		console.log("Inside Flow Deletion");
		$('#fd_switches_container').html("");
		$('#fd_list_container').html("");

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switches",
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{				
				object = jQuery.parseJSON(data);
				console.log(object);
				var str = "<table width=\"60%\" border=\"0\" align=\"center\"><tr><td width=\"30%\" align=\"right\">Select Switch</td><td align=\"left\"><select name=\"fd_switches_cont\" id=\"fd_switches_container\"><option value=\"select\">Select</option>";
				for(var i=0;i<object.length;i++)
				{
					str+= "<option value=\""+object[i]["dpid"]+"\">"+object[i]["dpid"]+"</option>";
				}
				str += "</select></td></tr></table>";
				$('#fd_switches_cont').html(str);
				$('#fd_switches_container').selectmenu();
				$('#fd_switches_container').selectmenu('refresh', true);
			}
                });

	});


	$('#fd_switches_cont').bind( "change", function(event, ui) {

		var id = $('#fd_switches_container option:selected').val();

		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchStaticFlows/"+id,
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{				
				object = jQuery.parseJSON(data);
				console.log(object);

				$('#fd_list_container').html("");
				$('#flow_deletion_template').tmpl(object).appendTo('#fd_list_container');
				$('#flow_deletion').page('destroy').page();
				$('#fd_list_container').listview('refresh',true);
		
			}
                });
	
	});


	$('#flow_modifier').bind('pagebeforeshow',function() 
	{
		actionCount=0;
		actionIndex=0;

		$('#action_count_container').html("");
		$('#flow_modifier').page('destroy').page();

		$('#name').val("");
		$('#priority').val("");
		$('#sourceMAC1').val("");
		$('#sourceMAC2').val("");
		$('#sourceMAC3').val("");
		$('#sourceMAC4').val("");
		$('#sourceMAC5').val("");
		$('#sourceMAC6').val("");
		$('#destinationMAC1').val("");
		$('#destinationMAC2').val("");
		$('#destinationMAC3').val("");
		$('#destinationMAC4').val("");
		$('#destinationMAC5').val("");
		$('#destinationMAC6').val("");
		$('#vlanID').val("");
		$('#userPriority').val("");
		$('#arp_op_code').val("");
		$('#sourceMACARP1').val("");
		$('#sourceMACARP2').val("");
		$('#sourceMACARP3').val("");
		$('#sourceMACARP4').val("");
		$('#sourceMACARP5').val("");
		$('#sourceMACARP6').val("");
		$('#destinationMACARP1').val("");
		$('#destinationMACARP2').val("");
		$('#destinationMACARP3').val("");
		$('#destinationMACARP4').val("");
		$('#destinationMACARP5').val("");
		$('#destinationMACARP6').val("");
		$('#sourceIP1').val("");
		$('#sourceIP2').val("");
		$('#sourceIP3').val("");
		$('#sourceIP4').val("");
		$('#destinationIP1').val("");
		$('#destinationIP2').val("");
		$('#destinationIP3').val("");
		$('#destinationIP4').val("");
		$('#DSCP').val("");
		$('#tos').val("");
		$('#ip_protocol').val("");
		$('#icmp_type').val("");
		$('#icmp_code').val("");
		$('#source_port').val("");
		$('#destination_port').val("");

		if(modifyFlag == 1)
		{
			$('#name').val(flowName);
			modifyFlag = 0;
		}


		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switches",
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{				
				object = jQuery.parseJSON(data);
				console.log(object);
				var str = "<div data-role=\"fieldcontain\"><label for=\"switches_cont\">Select Switch <sup>*</sup></label><select name=\"switches_cont\" id=\"switches_container\"><option value=\"select\">Select</option>";
				for(var i=0;i<object.length;i++)
				{
					str+= "<option value=\""+object[i]["dpid"]+"\">"+object[i]["dpid"]+"</option>";
				}
				str += "</select></div>";
				$('#ss_cont').html(str);
				$('#switches_container').selectmenu();
				$('#switches_container').selectmenu('refresh', true);
			}
                });



	});

	$('#ss_cont').bind( "change", function(event, ui) {

		$('#sp_cont').html("");
		var sid = $('#switches_container option:selected').val();
		console.log(sid);
		
		$.ajax({
			
			url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchPorts/"+sid,
			async: false,
     		  	context: document.body,
		  	success: function(data,textStatus,jqXHR)
			{				
				object = jQuery.parseJSON(data);
				console.log(object);
				var str = "<div data-role=\"fieldcontain\"><label for=\"switch_ports_cont\">Select Port</label><select name=\"switch_ports_cont\" id=\"switch_ports_container\"><option value=\"select\">Select</option>";
				for(var i=0;i<object[sid].length;i++)
				{
					str+= "<option value=\""+object[sid][i]["portNumber"]+"\">Port "+object[sid][i]["portNumber"]+"</option>";
				}
				str += "</select></div>";
				$('#sp_cont').html(str);
				$('#switch_ports_container').selectmenu();
				$('#switch_ports_container').selectmenu('refresh', true);
				
			}
                });
		$('#action_type').change();

	
	});

	$('#action_type').bind( "change", function(event, ui) {

		console.log($('#action_type option:selected').val());
		var sid = $('#switches_container option:selected').val();
		console.log(sid);

		$('#input_action_type_container').html("");
		if($('#action_type option:selected').val() == "OUTPUT")
		{

			$.ajax({
			
				url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchPorts/"+sid,
				async: false,
     		  		context: document.body,
		  		success: function(data,textStatus,jqXHR)
				{				
					object = jQuery.parseJSON(data);
					console.log(object);
					var str = "<div data-role=\"fieldcontain\"><label for=\"OUTPUT\">Select Port <sup>*</sup></label><select name=\"OUTPUT\" id=\"OUTPUT\"><option value=\"select\">Select</option>";
					for(var i=0;i<object[sid].length;i++)
					{
						str+= "<option value=\""+object[sid][i]["portNumber"]+"\">Port "+object[sid][i]["portNumber"]+"</option>";
					}
					str += "</select></div>";
				
					$('#input_action_type_container').html(str);
					$('#OUTPUT').selectmenu();
					$('#OUTPUT').selectmenu('refresh', true);
					
				}
              	  });	

		}
		if($('#action_type option:selected').val() == "ENQUEUE")
		{

			$.ajax({
			
				url: "http://m.cip.gatech.edu/developer/castle/api/FlowManager/switchPorts/"+sid,
				async: false,
     		  		context: document.body,
		  		success: function(data,textStatus,jqXHR)
				{				
					object = jQuery.parseJSON(data);
					console.log(object);
					var str = "<div data-role=\"fieldcontain\"><label for=\"OUTPUT\">Select Port <sup>*</sup></label><select name=\"OUTPUT\" id=\"OUTPUT\"><option value=\"select\">Select</option>";
					for(var i=0;i<object[sid].length;i++)
					{
						str+= "<option value=\""+object[sid][i]["portNumber"]+"\">Port "+object[sid][i]["portNumber"]+"</option>";
					}
					str += "</select></div>";
				
					$('#input_action_type_container').html(str);
					$('#OUTPUT').selectmenu();
					$('#OUTPUT').selectmenu('refresh', true);
					
				}
              	  });	

			var str2 = "<div data-role=\"fieldcontain\"><label for=\"ENQUEUE\">Select Queue <sup>*</sup></label><select name=\"ENQUEUE\" id=\"ENQUEUE\"><option value=\"select\">Select</option><option value=\"queue1\">Queue 1</option><option value=\"queue2\">Queue 2</option><option value=\"queue3\">Queue 3</option><option value=\"queue4\">Queue 4</option></select></div>";

			$('#input_action_type_container').append(str2);
			$('#ENQUEUE').selectmenu();
			$('#ENQUEUE').selectmenu('refresh', true);
		}
		if($('#action_type option:selected').val() == "SET_VLAN_VID")
		{
			var str = "<div data-role=\"fieldcontain\"><label for=\"VLAN_ID\">VLAN ID <sup>*</sup></label><input type=\"range\" name=\"VLAN_ID\" id=\"VLAN_ID\" value=\"1024\" min=\"0\" max=\"4094\" /></div>";
			$('#input_action_type_container').html(str);
			$('#flow_modifier').page('destroy').page();
		}
		if($('#action_type option:selected').val() == "SET_VLAN_PCP")
		{
			var str = "<div data-role=\"fieldcontain\"><label for=\"VLAN_PCP\">VLAN PCP <sup>*</sup></label><input type=\"range\" name=\"VLAN_PCP\" id=\"VLAN_PCP\" value=\"3\" min=\"0\" max=\"7\" /></div>";
			$('#input_action_type_container').html(str);
			$('#flow_modifier').page('destroy').page();
		}
		if($('#action_type option:selected').val() == "SET_DL_SRC")
		{
			var str = "<div data-role=\"fieldcontain\"><label for=\"SET_DL_SRC\">DL SRC <sup>*</sup></label><table><tr><td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_SRC\" id=\"SET_DL_SRC1\" /></td><td>:</td><td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_SRC\" id=\"SET_DL_SRC2\" /></td><td>:</td><td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_SRC\" id=\"SET_DL_SRC3\" /></td><td>:</td><td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_SRC\" id=\"SET_DL_SRC4\" /></td><td>:</td>	<td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_SRC\" id=\"SET_DL_SRC5\" /></td><td>:</td>	<td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_SRC\" id=\"SET_DL_SRC6\" /></td></tr></table></div>";
			$('#input_action_type_container').html(str);
			$('#flow_modifier').page('destroy').page();
		}
		if($('#action_type option:selected').val() == "SET_DL_DST")
		{
			var str = "<div data-role=\"fieldcontain\"><label for=\"SET_DL_DST\">DL DST <sup>*</sup></label><table><tr><td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_DST\" id=\"SET_DL_DST1\" /></td><td>:</td><td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_DST\" id=\"SET_DL_DST2\" /></td><td>:</td><td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_DST\" id=\"SET_DL_DST3\" /></td><td>:</td><td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_DST\" id=\"SET_DL_DST4\" /></td><td>:</td>	<td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_DST\" id=\"SET_DL_DST5\" /></td><td>:</td>	<td><input type=\"text\" MAXLENGTH=\"2\" data-mini=\"true\" name=\"SET_DL_DST\" id=\"SET_DL_DST6\" /></td></tr></table></div>";
			$('#input_action_type_container').html(str);
			$('#flow_modifier').page('destroy').page();
		}
		if($('#action_type option:selected').val() == "SET_NW_SRC")
		{
			var str = "<div data-role=\"fieldcontain\"><label for=\"SET_NW_SRC\">NW SRC <sup>*</sup></label><table><tr><td><input type=\"text\" MAXLENGTH=\"3\" data-mini=\"true\" name=\"SET_NW_SRC\" id=\"SET_NW_SRC1\" /></td><td>.</td><td><input type=\"text\" MAXLENGTH=\"3\" data-mini=\"true\" name=\"SET_NW_SRC\" id=\"SET_NW_SRC2\" /></td><td>.</td><td><input type=\"text\" MAXLENGTH=\"3\" data-mini=\"true\" name=\"SET_NW_SRC\" id=\"SET_NW_SRC3\" /></td><td>.</td><td><input type=\"text\" MAXLENGTH=\"3\" data-mini=\"true\" name=\"SET_NW_SRC\" id=\"SET_NW_SRC4\" /></table></div>";
			$('#input_action_type_container').html(str);
			$('#flow_modifier').page('destroy').page();
		}
		if($('#action_type option:selected').val() == "SET_NW_DST")
		{
			var str = "<div data-role=\"fieldcontain\"><label for=\"SET_NW_DST\">NW DST <sup>*</sup></label><table><tr><td><input type=\"text\" MAXLENGTH=\"3\" data-mini=\"true\" name=\"SET_NW_DST\" id=\"SET_NW_DST1\" /></td><td>.</td><td><input type=\"text\" MAXLENGTH=\"3\" data-mini=\"true\" name=\"SET_NW_DST\" id=\"SET_NW_DST2\" /></td><td>.</td><td><input type=\"text\" MAXLENGTH=\"3\" data-mini=\"true\" name=\"SET_NW_DST\" id=\"SET_NW_DST3\" /></td><td>.</td><td><input type=\"text\" MAXLENGTH=\"3\" data-mini=\"true\" name=\"SET_NW_DST\" id=\"SET_NW_DST4\" /></table></div>";
			$('#input_action_type_container').html(str);
			$('#flow_modifier').page('destroy').page();
		}
		if($('#action_type option:selected').val() == "SET_NW_TOS")
		{
			var str = "<div data-role=\"fieldcontain\"><label for=\"SET_NW_DSCP\">SET NW DSCP <sup>*</sup></label><input type=\"range\" name=\"SET_NW_DSCP\" id=\"SET_NW_DSCP\" value=\"30\" min=\"0\" max=\"63\" /></div><div data-role=\"fieldcontain\"><label for=\"SET_NW_TOS\">SET NW TOS <sup>*</sup></label><input type=\"text\" MAXLENGTH=\"4\" data-mini=\"true\" name=\"SET_NW_TOS\" id=\"SET_NW_TOS\" /></div>";
			$('#input_action_type_container').html(str);
			$('#flow_modifier').page('destroy').page();
		}
		if($('#action_type option:selected').val() == "SET_TP_SRC")
		{
			var str = "<div data-role=\"fieldcontain\"><label for=\"SET_TP_SRC\">TP SRC <sup>*</sup></label><input type=\"range\" name=\"SET_TP_SRC\" id=\"SET_TP_SRC\" value=\"30146\" min=\"0\" max=\"65535\" /></div>";
			$('#input_action_type_container').html(str);
			$('#flow_modifier').page('destroy').page();
		}
		if($('#action_type option:selected').val() == "SET_TP_DST")
		{
			var str = "<div data-role=\"fieldcontain\"><label for=\"SET_TP_DST\">TP DST <sup>*</sup></label><input type=\"range\" name=\"SET_TP_DST\" id=\"SET_TP_DST\" value=\"30146\" min=\"0\" max=\"65535\" /></div>";
			$('#input_action_type_container').html(str);
			$('#flow_modifier').page('destroy').page();
		}

	});



});