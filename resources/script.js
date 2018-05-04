var m_api_http = "";
var m_api_ip = "";
var m_api_port= "";

var t_api_http = "";
var t_api_ip = "";
var t_api_port= "";

var g_publicKey = "";
var g_setup = "";
var g_loader = 0;

var m_forging = false;
var t_forging = false;

var m_notforging = 0;
var t_notforging = 0;

var g_totalservers = 0;
var g_checkheight = 0;
var g_topheight = 0;
var no_server_online = false;

var no_m_api_online = true;
var no_t_api_online = true;

$(document).ready(function() {      
    $("#container").hide();
    $("#loading").show();
    initialize();
});    

function initialize() {
    $.getJSON("config.json", function(json){
        g_setup = json;

        forger_http = g_setup.servers.server1.http;
        forger_ip = g_setup.servers.server1.ip;
        forger_port = g_setup.servers.server1.port;


            for (var ss in g_setup.servers) {
                if(no_m_api_online) {  
                    if(g_setup.servers[ss].testnet == false) {
                        m_api_http = g_setup.servers[ss].http;
                        m_api_ip = g_setup.servers[ss].ip;
                        m_api_port= g_setup.servers[ss].port;
                        no_m_api_online = false;
                    }
        }
        }   

            for (var ss in g_setup.servers) {
                if(no_t_api_online) {                
                    if(g_setup.servers[ss].testnet) {
                        t_api_http = g_setup.servers[ss].http;
                        t_api_ip = g_setup.servers[ss].ip;
                        t_api_port= g_setup.servers[ss].port;
                        no_t_api_online = false;
                    }
        }
        } 

        g_publicKey = g_setup.t_publicKey;

        $("#loadingData").text("Loading config..");
        var i=1;
        for (var ss in g_setup.servers) {
            if(g_setup.servers[ss].testnet == false) {
                var table_row="<tr>"+
                                "<td id='server"+i+"'>"+ g_setup.servers[ss].name +"</td>"+
                                "<td id='server"+i+"_height'>undefined</td>"+
                                "<td id='server"+i+"_consensus'>undefined</td>"+
                                "<td id='server"+i+"_forging'>undefined</td>"+
                               "</tr>";
                $("#nodeTable").append(table_row);
            }else {
                var table_row="<tr>"+
                                "<td id='server"+i+"'>"+ g_setup.servers[ss].name +"</td>"+
                                "<td id='server"+i+"_height'>undefined</td>"+
                                "<td id='server"+i+"_consensus'>undefined</td>"+
                                "<td id='server"+i+"_forging'>undefined</td>"+
                               "</tr>";
                $("#nodeTableT").append(table_row);

            }
            i++;
        }
        $("#loadingData").text("Table loaded..");
        start();
    });
}

function start(){
    $("#loadingData").text("Loading publicKey..");
    $.ajax({ 
        type: 'GET', 
        url: m_api_http +'://'+ m_api_ip +':'+ m_api_port +'/api/loader/status/sync', 
        dataType: 'json',
        success: function (data) {
            if(!data.success){
                alert("Error, can't retrieve data");   
            } else {
               $("#loadingData").text("Loading servers data..");
               setInterval(monitor_process, 27000);
               setInterval(function() { get_delegate_data(t_api_http,t_api_ip,t_api_port,"t"); }, 27000);
               setInterval(function() { get_delegate_data(m_api_http,m_api_ip,m_api_port,"m"); }, 27000);

            }
        },
        error: function (request, status, error) {
             if(typeof request.responseText == "undefined") {
                    $("#loadingData").text("This ip don't have access to " + m_api_http +"://"+  m_api_ip +":"+  m_api_port + " server. Trying alternative source.");
                    no_m_api_online = true;
                    setInterval(monitor_process, 27000);
                    setInterval(get_delegate_data, 27000);               
            }else {           
                var r = jQuery.parseJSON(request.responseText);
                if(r.error == "API access denied"){
                    $("#loadingData").text("This ip don't have access to APIs of " +  m_api_http +"://"+  m_api_ip +":"+  m_api_port + " server. Trying alternative source.");
                    no_m_api_online = true;
                    setInterval(monitor_process, 27000);
                    setInterval(get_delegate_data, 27000);
                }else{$("#loadingData").text(request.responseText);
                $("#loadingData").text("This ip don't have access to " +  m_api_http +"://"+  m_api_ip +":"+  m_api_port + " server. Trying alternative source.");
                    no_m_api_online = true;
                    setInterval(monitor_process, 27000);
                    setInterval(get_delegate_data, 27000);
            }
            }
        }
    });
}

function display_data(){
    $("#container").delay(700).fadeIn(500);
    $("#loading").delay(200).fadeOut(500);
    g_loader = 1;
    notifyMe("Monitor ready!");
}

function monitor_process(){
        var i=1;
        for (var ss in g_setup.servers) {
          $("#server"+i).text(g_setup.servers[ss].name);
          get_server_data(i,g_setup.servers[ss].http,g_setup.servers[ss].ip,g_setup.servers[ss].port,g_setup.servers[ss].testnet);
          get_forging_status(i,g_setup.servers[ss].http,g_setup.servers[ss].ip,g_setup.servers[ss].port,g_setup.servers[ss].testnet);
          i++;
        }
        get_nextturn(m_api_http,m_api_ip,m_api_port,"m")
        get_nextturn(t_api_http,t_api_ip,t_api_port,"t")
        are_you_forging();
        g_forging=false;

        m_forging=false;
        t_forging=false;
}


function get_nextturn(http,ip,port,net){

    if(net == "m") {
        g_publicKey = g_setup.m_publicKey;
    }else{ g_publicKey = g_setup.t_publicKey; }

    $("#loadingData").text("Loading NextTurn..");
    return $.ajax({ 
        type: 'GET', 
        url: http +'://'+ ip +':'+ port +'/api/delegates/getNextForgers', 
        data: { limit: "101" },
        async: false,
        dataType: 'json',
        success: function (data) {
            if(data.success){
                for (var dd in data.delegates) {
                    if(data.delegates[dd] == g_publicKey ){
                        timeg = dd * 27;
                        time = (timeg/60);
                        minutes = Math.floor(timeg / 60);
                        seconds = Math.round((time - minutes) * 60);
                        var v_nextturn="";
                        if(minutes == 0){ 
                            v_nextturn = timeg +"sec"; 
                            if(timeg < 30 ){
                                $("." + net + "_nextturn_bar").removeClass("usual").addClass("forgingTime");
                        }
                    }
                        else{ 
                            v_nextturn = minutes + "min "+ seconds + "sec";
                            $("." + net + "_nextturn_bar").removeClass("forgingTime").addClass("usual");
                        }
                        $("#" + net + "_nextturn").text(v_nextturn);    


                                                                      
                    }
                }
            }
        },
        error: function (request, status, error) {
             if(typeof request.responseText == "undefined") {
                $("#dataMessages").text("This ip don't have access to " + http +"://"+ ip +":"+ port + " server");
                $("#dataMessages").delay(700).fadeIn(500);
                setTimeout($("#dataMessages").delay(500).fadeOut(500),4000);
             
            }else {           
                var r = jQuery.parseJSON(request.responseText);
                if(r.error == "API access denied"){
                    $("#dataMessages").text("This ip don't have access to APIs of " + http +"://"+ ip +":"+ port + " server");
                    $("#dataMessages").delay(700).fadeIn(500);
                    setTimeout($("#dataMessages").delay(500).fadeOut(500),4000);
                }else{$("#loadingData").text(request.responseText);}
                no_server_online = true;
            }
        }
    }).responseText;
}

function get_delegate_data(http,ip,port,net){
    $("#loadingData").text("Loading delegate data..");

    if(net == "m") {
        g_publicKey = g_setup.m_publicKey;
    }else{ g_publicKey = g_setup.t_publicKey; }

    return $.ajax({ 
        type: 'GET', 
        url: http +'://'+ ip +':'+ port +'/api/delegates/get', 
        data: { publicKey: g_publicKey },
        dataType: 'json',
        success: function (data) { 
                $("#" + net + "_rank").text(data.delegate.rate);
                $("#" + net + "_username").text(data.delegate.username);
                $("#" + net + "_approval").text(data.delegate.approval);
                $("#" + net + "_productivity").text(data.delegate.productivity);
                $("#" + net + "_producedBlocks").text(data.delegate.producedblocks);
                $("#" + net + "_missedBlocks").text(data.delegate.missedblocks);
                if(g_loader == 0) display_data();
        },
        error: function (request, status, error) {
             if(typeof request.responseText == "undefined") {
                    $("#" + net + "_rank").text("404");
                    $("#" + net + "_username").text("404");
                    $("#" + net + "_approval").text("404");
                    $("#" + net + "_productivity").text("404");
                    $("#" + net + "_producedBlocks").text("404");
                    $("#" + net + "_missedBlocks").text("404");
                    if(g_loader == 0) display_data();
            }else {              
                var r = jQuery.parseJSON(request.responseText);
                if(r.error == "API access denied"){
                    $("#" + net + "_rank").text("API access denied");
                    $("#" + net + "_username").text("API access denied");
                    $("#" + net + "_approval").text("API access denied");
                    $("#" + net + "_productivity").text("API access denied");
                    $("#" + net + "_producedBlocks").text("API access denied");
                    $("#" + net + "_missedBlocks").text("API access denied");
                    if(g_loader == 0) display_data();
                }else{
                    $("#" + net + "_rank").text("undefined");
                    $("#" + net + "_username").text("undefined");
                    $("#" + net + "_approval").text("undefined");
                    $("#" + net + "_productivity").text("undefined");
                    $("#" + net + "_producedBlocks").text("undefined");
                    $("#" + net + "_missedBlocks").text("undefined");
                    if(g_loader == 0) display_data();
                }
            }
        }      
    }).responseText;
}

function get_server_data(server,http,ip,port,testnet){
    $("#loadingData").text("Loading Server"+ server +" data..");
    return $.ajax({ 
        type: 'GET', 
        url: http + '://'+ ip +':'+ port +'/api/loader/status/sync', 
        async: false,
        dataType: 'json',
        success: function (data) { 
            if(data.syncing){
                $("#server"+server+"_height").html(data.height + " <span><img src='resources/syncing.gif'></span>");
            }else{$("#server"+server+"_height").html(data.height);}
            $("#server"+server+"_consensus").text(data.consensus+"% ");

            if(testnet){
                if(no_t_api_online) {
                t_api_http=http;
                t_api_ip=ip;
                t_api_port=port;
                no_t_api_online = false;
                }
            } else {
                if(no_m_api_online) {
                m_api_http=http;
                m_api_ip=ip;
                m_api_port=port;
                no_m_api_online = false;
             }
            }

            if(!data.success) {
               if(data.error == "API access denied"){
                $("#server"+server+"_height").html("API access denied");
                $("#server"+server+"_consensus").text("API access denied");
            } else {
                $("#server"+server+"_height").html("undefined");
                $("#server"+server+"_consensus").text("undefined");      
            }
        }
        },
        error: function (request, status, error) {
            if(typeof request.responseText == "undefined") {
                $("#server"+server+"_height").html("404");
                $("#server"+server+"_consensus").text("404");               
            }else {
                var r = jQuery.parseJSON(request.responseText);
                if(r.error == "API access denied"){
                    $("#server"+server+"_height").html("API access denied");
                    $("#server"+server+"_consensus").text("API access denied");
                } else {
                    $("#server"+server+"_height").html("undefined");
                    $("#server"+server+"_consensus").text("undefined");      
                }
        }


            }

    }).responseText;
}

function get_forging_status(server,http,ip,port,testnet){
    $("#loadingData").text("Loading forging status on Server"+ server +" data..");
    if(testnet) {
        g_publicKey = g_setup.t_publicKey;
    }else {g_publicKey = g_setup.m_publicKey;}
    return $.ajax({ 
        type: 'GET', 
        url: http +'://'+ ip +':'+ port +'/api/delegates/forging/status', 
        data: { publicKey: g_publicKey },
        async: false,
        dataType: 'json',
        success: function (data) { 
                if(data.enabled){
                    $("#server"+server+"_forging").html("<img src='resources/icon_4.png'>");
                    if(testnet){
                       t_forging=true; 
                    } else { m_forging=true; }
                    
                } else{  $("#server"+server+"_forging").html(""); }

                if(!data.success){
                    if(data.error == "Access denied") {
                        $("#server"+server+"_forging").html("API access denied");
                    } else{  $("#server"+server+"_forging").html("undefined"); }
                    
                }             
        },
        error: function (request, status, error) {
            if(typeof request.responseText == "undefined") {
                $("#server"+server+"_forging").html("404");              
            }else {            
                var r = jQuery.parseJSON(request.responseText);
                if(r.error == "API access denied"){
                $("#server"+server+"_forging").html("API access denied");
                } else{  $("#server"+server+"_forging").html("undefined"); }
            }
        }
    }).responseText;
}

function are_you_forging(){
    if(!m_forging){
        m_notforging++;
        if(m_notforging > 1){
            notifyMe("Mainet are not forging!!");
            $("#m_dataMessages").text("Mainet are not forging!"); 
            $(".m_nextturn_bar").removeClass("usual").addClass("red");         
            navigator.vibrate([500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500]);
        }
    }else {
        m_notforging=0;
        $("#m_dataMessages").text("");
    }
    

    if(!t_forging){
        t_notforging++;
        if(t_notforging > 1){
            notifyMe("Testnet are not forging!!");
            $("#t_dataMessages").text("Testnet are not forging!!");
            $(".m_nextturn_bar").removeClass("usual").addClass("red");        
            navigator.vibrate([500, 250, 500, 250, 500, 250, 500, 250, 500, 250, 500]);
        }
    }else {
        t_notforging=0;
        $("#t_dataMessages").text("");
    }
        
}
    
// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission();
});

function notifyMe(s_message) {
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.'); 
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
      var notification = new Notification(s_message, {
          icon: 'resources/icon_3.png',
          body: 'Click here to go to the monitor',
        });

    setTimeout(notification.close.bind(notification), 15000);
    notification.onclick = function () {
        window.focus();
        this.clone();
    }; 
  }
}
