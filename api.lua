-- see: mail.md

mail.registered_on_receives = {}
function mail.register_on_receive(func)
	mail.registered_on_receives[#mail.registered_on_receives + 1] = func
end

mail.receive_mail_message = "You have a new message from %s! Subject: %s\nTo view it, type /mail"
mail.read_later_message = "You can read your messages later by using the /mail command"

function mail.send(m) -- see: "Mail format"
	minetest.log("action", "[mail] '" .. m.src .. "' sends mail to '" .. m.dst ..
		"' with subject '" .. m.subject .. "' and body: '" .. m.body .. "'")

	local messages = mail.getMessages(m.dst)

	table.insert(messages, 1, {
		unread  = true,
		sender  = m.src,
		subject = m.subject,
		body    = m.body,
		time    = os.time(),
	})
	mail.setMessages(m.dst, messages)

	for _, player in ipairs(minetest.get_connected_players()) do
		local name = player:get_player_name()
		if name == m.dst then
			if m.subject == "" then m.subject = "(No subject)" end
			if string.len(m.subject) > 30 then
				m.subject = string.sub(m.subject,1,27) .. "..."
			end
			minetest.chat_send_player(m.dst,
					string.format(m.receive_mail_message, m.src, m.subject))
		end
	end

	for i=1, #mail.registered_on_receives do
		if mail.registered_on_receives[i](m) then
			break
		end
	end
end
