
const botWord="sathi:";

class ChatEngine{
    constructor(chatBoxId, userEmail, id, blocked, username){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.id = id;
        this.name = username;
        this.blocked= blocked;
        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }
    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial',
                id: self.id,
                name: self.name,
                blocked: self.blocked
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            // console.log(msg+" *********");
            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial',
                    id: self.id,
                    blocked: self.blocked
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);
            let blocked=data.blocked.split(',');
            for(let b of blocked ){
                if(b == self.id)
                    return;
            }
            let newMessage = $('<li>');
            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));
           
            
            let btn =$('<button>', {
                'id': "contact"
            });
            btn.click(function(){
                $.ajax({
                    type: 'post',
                    url: '/mail',
                    data:{
                        to: data.user_email,
                        from: self.userEmail,
                        myName: self.name,
                        name: data.name,
                        msg: data.message
                    },success: function(data){
                        new Noty({
                            theme: 'relax',
                            text: "mail published!",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                            
                        }).show();
    
                    }, error: function(error){
                        console.log("error in sending mail");
                    }
                });
            });
            
            newMessage.append(btn);


            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
            // calling bot api
            let msg=data.message;
            let command = msg.slice(0,6);
            if(command == "sathi:")
                botcall(msg.substring(6));
        })

        function botcall(msg){
            $.ajax({
                type: "GET",
                url: 'https://hackvioletapi.herokuapp.com/get_information',
                data: jQuery.param({ "topic": msg}),
                success: function(data){
                    console.log(data);
                    $('#chat-messages-list').append(data.text);
                    // textmsg(data.text);
                }
            });
        }

        function textmsg(botmsg){
            $.ajax({
                type: "POST",
                url: 'http://localhost:8000/send-sms',
                data: {to: process.env.mobile_no,
                    body: botmsg
                },
                success: function(data){
                    console.log("text message sent");
                }
            });
        }
    }
}