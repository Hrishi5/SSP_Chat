var app = angular.module("chatApp",['ngRoute','ui.bootstrap']) ;
app.controller("chatController",function(
$scope,$http,$location,$timeout)
{   $scope.userId = '926882'
    $scope.socket = io() ;
    $scope.socket.on("connect",function(){
        console.log("Connected") ;
    }) ;
    $scope.socket.on("disconnect",function(){
        console.log("disconnected") ;
    })
    $scope.socket.on('newMessage',function(data){
        /*for (var i=0 ; i<$scope.conversations.length ; i++){
            if($scope.conversations[i].name === data.to) {
                
                $scope.conversations[i].messages.push(data)
            }
        }*/
        if(data.from === $scope.userId) {
            data.from = '926886' ;
            data.to = '926882' ;
        }
        console.log(data) ;
        $scope.conversations[0].messages.push(data) ;
        console.log($scope.conversations) ;
        $scope.$apply() ;
    })
    
    
    $scope.sso = false ;
    $scope.conversations = [
        {name:"926886",selected:true,convId:'926882-926886',messages:[{from:926886,text:"Hi"}]},
        
    ]
    
    $scope.cscId = 0 ;
    $scope.onClickOfSend = function(msg) {
        if(msg.trim() === "") {
            return ;
        }
        var chat = {
            from:$scope.userId,
            to:$scope.conversations[$scope.cscId].name,
            text:msg,
            convId:$scope.conversations[$scope.cscId].convId 
        } ;
        $scope.conversations[$scope.cscId].messages.push(chat) ;
        $scope.msg = "" ;
        
        var socket = io.connect() ;
        socket.emit('newMessage',chat) ;
        
    }
    
    $scope.onClickOfConversations = function(id) {
        $scope.conversations[$scope.cscId].selected = false ;
        $scope.conversations[id].selected = true ;
        $scope.cscId = id ;
    }
    
    $scope.getConversation = function(from,to) {
        $timeout(function(){
            var data = {
                from:from,
                to:to
            } ;
            $http.post('/getConversations',data).then(
                function(response){
                    if(response.data.status==="1") {
                        $scope.conversations.append(response.data.conversations)
                    }else{
                        alert(response.data.response)
                    }
                },
                function(){
                alert("Failed")
            }) ;
        },1200) ;
    }
    
    $scope.onUserSearch = function(searchedUser){
        if(searchedUser.trim().length > 3) {
            var data = {
                key:searchedUser
            }
           return  $http.post('/searchUser',data).then(function(response){
              if(response.data.status === '1') {
                return response.data.response ;          
              }else{
                  $scope.noResults = true ;
              }  
            },function(response){
                alert('Could not connect') ;
            }) ;
        }
        
    }
    
    $scope.startNewConversation = function(item,model,label,event){
    for(conv in $scope.conversations){
        if(conv.id === $scope.userId + '-' + item.id) {
            return ;
        }else{
            var d = {} ;
            
            $http.post('/createConversation',item).then(function(response){
             if(response.data.status === '1') {
                var ct = $scope.userId + '-' + item.id ;
                var data = response.data.response
                var mList = [] ;
                if(data !== undefined && data.length > 0) {
                    mList = JSON.parse(data) ;
                }
            var conversation = {
                id:ct,
                selected:false,
                messages:mList,
                name:item.value,
                socket:io(ct)
            }
            $scope.conversations.push(conversations) ;     
             }else{
                 alert('Could not connect to the other user')
             }   
            },function(response){
                
            }) ;
            
        }
    }    
    
    }
    
    
    
})