mail.highlightedmessages = {}

mail.messages = {}


mail.registered_on_receives = {}
function mail.register_on_receive(func)
	mail.registered_on_receive[#mail.registered_on_receives + 1] = func
end

mail.receive_mail_message = "You have a new message from %s! Subject: %s\nTo view it, type /mail"

function mail.send(src,dst,subject,body)
	minetest.log("action", "[mail] '" .. src .. "' sends mail to '" .. dst ..
		"' with subject '" .. subject .. "' and body: '" .. body .. "'")

	if not mail.messages[dst] then mail.messages[dst] = {} end
	table.insert(mail.messages[dst],1,{
		unread=true,
		sender=src,
		subject=subject,
		body=body,
		time=os.time()
	})

	for _, player in ipairs(minetest.get_connected_players()) do
		local name = player:get_player_name()
		if name == dst then
			if subject == "" then subject = "(No subject)" end
			if string.len(subject) > 30 then
				subject = string.sub(subject,1,27) .. "..."
			end
			minetest.chat_send_player(dst,
					string.format(mail.receive_mail_message, src, subject))
		end
	end
	mail.save()

	for i=1, #mail.registered_on_receives do
		if mail.registered_on_receives[i](src, dst, subject, body) then
			break
		end
	end
end
