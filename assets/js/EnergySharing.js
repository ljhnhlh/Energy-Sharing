var addr = '';
var userInfo = {"user":addr,"channel":"","amount":"",'isConsumer':""};
var User = new Array();
var ChannelAvailable = new Array();
var channelNum = 1;
var UserIndex = 0;
var init = "";



function Build()
{
	var span = document.createElement('div');
	var temp = document.getElementById('Box');
	span.id = "channel" + channelNum;
	span.style="display: inline-block";
	span.innerHTML = "<div> <img id=\"imge"+channelNum+"\" src = \"assets/img/images.jpg\" onclick=\"SetChannel(" +channelNum + ")\" ></div><div id=\"Used"+channelNum+"\"  style=\"display: inline;\">Used :<input id = \"input"+channelNum+"\" class=\"divInput\" value = \"0\"> </div><div id=\"Donated"+channelNum+"\" style=\"display: inline;\" > Donated :<input id = \"output"+channelNum+"\" class=\"divInput\" value = \"0\"></div>";
	temp.appendChild(span);
	ChannelAvailable[channelNum] = true;
	input = document.getElementById('Used'+channelNum);
	output =  document.getElementById('Donated'+channelNum);
	input.style.color = "green";
	output.style.color = "green";
	channelNum++;
}

function BuildChannel()
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			
			t=xmlhttp.responseText;
			if(t == '1')
			{	
				Build();
			}
			
			
		}
	}
	xmlhttp.open("GET","B",true);
	xmlhttp.send();
}
/*
function BuildChannel()
{
	var reqChar = "C";
	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			
			t=xmlhttp.responseText;
			if(t == '1')
			{
				
				Build();
				ChannelAvailable[channelNum] = true;
			}
		}
	}
	
	xmlhttp.open("GET",reqChar,true);
	xmlhttp.send();
}
*/
function Pay_money()
{

	var value = document.getElementById('Pay_money').innerText;
	var reqChar;
	var input = document.getElementById('input'+ userInfo['channel']).value;
	var output = document.getElementById('output'+userInfo['channel']).value;
	if(output - input >= 0)
	{
		alert("You don't need to pay");
		var temp =  document.getElementById('PayNotice');
		temp.innerText = "Once someone Pay,you can get " + (output - input);
		temp = document.getElementById('amount');
		temp.innerText = "Amount :" +  (output - input);
	}
	else{

	reqChar = 'P,'+input+","+output;

	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			
			t=xmlhttp.responseText;
			console.log(t);
			
				alert("success Pay");
				var temp =  document.getElementById('input'+ userInfo['channel']);
				temp.value = 0;
				temp = document.getElementById('output'+ userInfo['channel']);
				temp.value = 0;
				document.getElementById('PayNotice').innerText = "You have paid " + (input - value) + "Money";


		}
	}
	
	xmlhttp.open("GET",reqChar,true); 
	xmlhttp.send();
	}

}
function SetChannel(Index)
{
	if(ChannelAvailable[Index])
	{
	var str = "T,"+Index;
	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			
			t=xmlhttp.responseText;
			if(t == '1')
			{
				alert("success");
				var input = document.getElementById('input'+Index);
				var output =  document.getElementById('output'+Index);
				input.value = 0;
				output.value = 0;
				input = document.getElementById('Used'+Index);
				output =  document.getElementById('Donated'+Index);
				input.style.color = "red";
				output.style.color = "red";
				ChannelAvailable[Index] = false;
				userInfo['channel'] = Index;
				document.getElementById('channel').innerText = "Index: " + Index;
			}
			else if(t == '3')
			{
				document.getElementById('PayNotice').innerText = "You are in use";
				alert("You are in use")
			}

		}
	}
	
	xmlhttp.open("GET",str,true);
	xmlhttp.send();
	}
	else
	alert("the Channel is in used");
}
function Leave()
{
	var temp = document.getElementById('input'+ userInfo['channel']);
	var input = temp.value;
	temp = document.getElementById('output'+userInfo['channel']);
	var output = temp.value;
	if(input - output > 0)
	{
		alert("Please first pay");
		var temp = document.getElementById('PayNotice');
		temp.innerText = "You should Pay" + (input - output);
		temp.hidden = false;
	}
	else
	{
		var str = "L," + input + "," + output;
		if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			
			t=xmlhttp.responseText;
			var i = userInfo['channel'];
			alert("leave Successfully");
			document.getElementById('Login').hidden = false;
			ChannelAvailable[i] = true;
			document.getElementById("Used"+i).style.color = "green";
			document.getElementById("Donated"+i).style.color = "green";
			LogINUI();
		}
	}
	
	xmlhttp.open("GET",str,true);
	xmlhttp.send();
	}

}

function LogINUI()
{
	var login = document.getElementById('Login');
	login.hidden = false;
	document.getElementById('left').hidden = true;
	document.getElementById('UserInfo').hidden = true;
	document.getElementById('Box').hidden = true;
	document.getElementById('set0').hidden = true;
	document.getElementById('head').hidden = true;
}
function Init(){


	var value = init;
	while(value[0] > channelNum)
	{
		Build();
		console.log(channelNum);
		
	}
	for(var i = 0;i < value[0];i++)
	{
		if(value[i+1] == '0')
		{
			document.getElementById("Used"+i).style.color = "red";
			document.getElementById("Donated"+i).style.color = "red";
			ChannelAvailable[i] = false;
		}
		else
		{
			document.getElementById("Used"+i).style.color = "green";
			document.getElementById("Donated"+i).style.color = "green";
			ChannelAvailable[i] = true;
		}
		console.log("init");
	}
	/*
	var xmlhttp;
	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var str = xmlhttp.responseText;
			var value = str.split(',');
			while(value[0] != channelNum)
			{
				Build();
			}
			for(var i = 0;i < value[0];i++)
			{
				if(value[i+1] == '0')
				{
					document.getElementById("Used"+i).style.color = "red";
					document.getElementById("Donated"+i).style.color = "red";
				}
				else
				{
					document.getElementById("Used"+i).style.color = "green";
					document.getElementById("Donated"+i).style.color = "green";
				}
			}
		}
	}
	xmlhttp.open("GET","I",true);
	xmlhttp.send();
	*/
}
function MainUI() {
	var login = document.getElementById('Login');
	login.hidden = true;
	document.getElementById('left').hidden = false;
	document.getElementById('UserInfo').hidden = false;
	document.getElementById('Box').hidden = false;
	document.getElementById('set0').hidden = false;
	document.getElementById('head').hidden = false;
	Init();
  }

function signIN()
{
	
	addr = document.getElementById('username_login').value;
	var NeedAdd = true;
	
	for(var u in User)
	{
		var strtemp = String(u['user']);
		if(strtemp.match(addr))
		{
			NeedAdd = false;
			userInfo = u;
			MainUI();
			break;
		}
	}
	
	if(NeedAdd)
	{
	var value;
	var xmlhttp;
	if (window.XMLHttpRequest)
	{
		//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			
			t=xmlhttp.responseText;//first use addUser,then getIndex,channel
			value = t.toString();
			var temp = t.split('/')
			value = temp[1].split(',');
			init = temp[0].split(',');
			if(value[0] === '1')
			{
				
				document.getElementById('user').innerText =    "User: " + addr;
				document.getElementById('channel').innerText = "Index: " + value[2] ;
				document.getElementById('amount').innerText =  "Amount: "+value[1];
				document.getElementById('consumer').innerText = "Consumer: " + value[3];
				var Info = {"user":addr,"channel":"","amount":"",'isConsumer':""};
					Info['user'] = addr;
					Info['channel'] = value[2];
					Info['amount'] = value[1];
					Info['isConsumer'] = value[3];
					userInfo = Info;
				User.push(Info);
				MainUI();
			}
			
		}
	}
	xmlhttp.open("GET","A" + addr,true);
	xmlhttp.send();
	}
}