// connect to Project node
var socket = io.connect('http://localhost/project');//172.17.11.52 or localhost

// join project on connect
socket.on('connect', function(){
	console.log('connected as', socket.id);
	socket.emit('join', {project: 'project'+Math.floor(Math.random()*2)});
});

//join acknowlegement
socket.on('join-ack', function(message){
	console.log('welcome to', message.data.project);
});

// send current update on new joiner
socket.on('join', function (message, editack) {
	console.log(message.client, 'joined', message.data.project);

	if (typeof($('body').data('editing')) != 'undefined') {
		editack({client: socket.id, id:$('body').data('editing').id});			
	}
});

// start edition mode on edition request ack
socket.on('edit-ack', function (message) {
	console.log('starting edition', message.client, 'on', message.data.id);
	$('#'+message.data.id)	.attr('contenteditable', 'true')
							.focus();

});

// mark edition
socket.on('edit', function (message) {
	console.log('edit by', message.client, 'on', message.data.id);
	$('#'+message.data.id)	.attr('contenteditable', 'false')
							.css('color','red');

});

// mark update
socket.on('save', function (message) {
	console.log('save by', message.client, 'on', message.data.id, 'with', message.data.html);
	if (message.data.hasChanged) {
		$('#'+message.data.id)	.html(message.data.html)
								.css('color','green');
	} else {
		$('#'+message.data.id).css('color','black');
	}
});

// a peer left
socket.on('left', function (message) {
	console.log(message.client, 'left');
});

$(document).ready(function() {

	// request edition mode to server on click (so edition mode not available when disconnected)
	$('.editable').click(function(event){
		if (! $(this).is(':focus')){
			socket.emit('edit-req', {id: this.id});
		}
	});

	// start edition mode on focus
	$('.editable').focus(function(event){
		$(this).css('color','black').data('original',this.innerHTML)
		$('body').data('editing', {id: this.id});
		socket.emit('edit', {id: this.id});
	});

//	// send new content on each keystroke
//	$('.editable').on("input", function(event){
//	socket.emit('edit', {id: this.id, html: this.innerHTML});
//	});

	// save on "Return" key (except on multiline elements)
	$('.editable:not(.multiline)').keydown(function(event){
		if (event.which == 13) {
			$(this).blur();
		}
	});

	// cancel on "Escape" key
	$('.editable').keydown(function(event){
		if (event.which == 27) {
			$(this).html($(this).data('original'));
			$(this).blur();
		}
	});

	// save on blur (unfocus)
	$('.editable').blur(function(event){
		socket.emit('save', {	id: this.id, 
			html: this.innerHTML, 
			hasChanged: (this.innerHTML != $(this).data('original'))
		});
		$('body').removeData('editing');
		$(this).css('color','black').attr('contenteditable', 'false').removeData('original');
	});
	
});
