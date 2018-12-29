pragma solidity ^0.4.25;

contract EnergySharing
{
    struct channel
    {
        bool    Available;
    }
   struct user 
    {
        address addr;       //用户地址
        bool    IsConsumer; //判断用户消耗/贡献
        bool    hadPaid; //用户已支付/取得的费用
        uint    amount;//the amount contribution or  comsuption
        uint    channelIndex;//用户使用的管道号
        bool    isInUsed;
        bool    isVaild;
    }
    uint currentNum = 1;
    uint unit_price = 10;
    uint index;
    channel[] chann;
    mapping(address => user) public userlist;
    user[] Donator;
    
    
    event Index(uint _index);
    event IO(uint _amount);
    event hadPaid(uint _IsConsumer);
    event channelIndex(uint _channelIndex);
    event buildChan(uint _finish);
    event canLeave(uint _left);
    event addSuccess();
    event InfoEvent(uint _amount,uint _channelIndex,uint _IsConsumer);
    
    constructor() payable
    {
        chann.push(channel(true));
    }
    
    function getDonator() returns(uint amount)
    {
        address addr = msg.sender;
        return Donator[1].amount;
    }
    //first get number,then get Available
    function getCurrentNum() returns(uint)
    {
        return currentNum;
    }
    function getAvailable(uint t) returns(uint)
    {
        
        if(chann[t].Available)
        return  1;
        else 
        return 0;
    }
    
    //
    function Adduser()
    {
        uint t = 0;
        address addr = msg.sender;
        if(!userlist[addr].isVaild)
        {
            user us;
            us.isVaild = true;
            us.IsConsumer = false;
            us.hadPaid = true;
            us.amount = 0;
            us.channelIndex = 100;
            us.isInUsed = false;
            us.addr = addr;
            userlist[addr] = us;
        }
        t = 1;
        addSuccess();
    }
    function getIndex()view returns (uint)
    {
        return index;
    }
    function getChannel() returns (uint)
    {
        return userlist[msg.sender].channelIndex;
    }
    function setIO(uint input,uint output)//离开的时候，先调用setIO，再调用left
    {
        address addr = msg.sender;
        if(output > input)
        {
            userlist[addr].IsConsumer = true;
            userlist[addr].amount = output - input;
            userlist[addr].IsConsumer = false;
        }
        else
        {
            userlist[addr].IsConsumer = false;
            userlist[addr].amount = input - output;
            userlist[addr].IsConsumer = true;
        }
        IO(userlist[addr].amount);
    }
    function buildChannel(){//用于扩建管道
        uint _finish = 0;
        chann.push(channel(true));
        _finish = 1;
       // number = number + 1;
        buildChan(_finish);
        currentNum++;
    }
    
    function setChannel(uint num)
    {
        address addr = msg.sender;
        if(userlist[addr].isInUsed)
        {
            index = 3;
        }
        else
        {
            chann[num].Available = false;
            userlist[addr].channelIndex = num;
            userlist[addr].isInUsed = true; 
            index = 1;
        }
        Index(index);
        channelIndex(num);
    }
    function left()//离开的时候，先调用setIO，再调用left
    {
        uint t = 0;
        address addr = msg.sender;
        userlist[addr].isInUsed = false;
        userlist[addr].hadPaid = false;
        t = userlist[addr].channelIndex;
        chann[t].Available = true;
        if(!userlist[addr].IsConsumer)
        {
            Donator.push(user(addr,userlist[addr].IsConsumer,userlist[addr].hadPaid,userlist[addr].amount,userlist[addr].channelIndex,userlist[addr].isInUsed,userlist[addr].isVaild));
        }
        t = 1;
        canLeave(t);
    }
    function getAmount()returns(uint)
    {
        address addr = msg.sender;
        return userlist[addr].amount;
    }
    function getUserInfo()
    {
        address addr =  msg.sender; 
        uint t = 0;
        if(userlist[addr].IsConsumer)
        t = 1;//is consumer
        InfoEvent(userlist[addr].amount,userlist[addr].channelIndex,t);
    }
    function pay() payable
    {
        uint Paid = 1;
        address addr = msg.sender;
        uint value = msg.value;
        require(value == userlist[addr].amount);
        userlist[addr].hadPaid = true;
        userlist[addr].amount -= value;
        userlist[addr].IsConsumer = false;
        
        //once the contract has money,it pay the Donator
        uint p;
        for(uint i = 0;i < Donator.length;i++)
        {
            p = Donator[i].amount;
            if(p <= 0 || this.balance <= 0)
                break;
          if(this.balance < p )
            p = this.balance;
            Donator[i].addr.transfer(p);
            Donator[i].amount -= p;
        }
        if(userlist[addr].hadPaid)
        Paid = 0;
        hadPaid(Paid);
        IO(userlist[addr].amount);
    }
    
}