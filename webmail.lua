
local webmail = {}

local MP = minetest.get_modpath(minetest.get_current_modname())
local Channel = dofile(MP .. "/util/channel.lua")
local channel

-- auth request from webmail
local auth_handler = function(auth)
	local handler = minetest.get_auth_handler()
	minetest.log("action", "[webmail] auth: " .. auth.name)

	local success = false
	local entry = handler.get_auth(auth.name)
	if entry and minetest.check_password_entry(auth.name, entry.password, auth.password) then
		success = true
	end

	channel.send({
		type = "auth",
		data = {
			name = auth.name,
			success = success
		}
	})
end

-- send request from webmail
local send_handler = function(sendmail)
	-- send mail from webclient
	minetest.log("action", "[webmail] sending mail from webclient: " .. sendmail.src .. " -> " .. sendmail.dst)
	mail.send(sendmail.src, sendmail.dst, sendmail.subject, sendmail.body)
end

-- get player messages request from webmail
local get_player_messages_handler = function(playername)
	channel.send({
		type = "player-messages",
		playername = playername,
		data = mail.messages[playername]
	})
end

-- remove mail
local delete_mail_handler = function(playername, index)
	if mail.messages[playername] and mail.messages[playername][index] then
		table.remove(mail.messages[playername], index)
	end
end

-- mark mail as read
local mark_mail_read_handler = function(playername, index)
	if mail.messages[playername] and mail.messages[playername][index] then
		mail.messages[playername][index].unread = false
	end
end

-- mark mail as unread
local mark_mail_unread_handler = function(playername, index)
	if mail.messages[playername] and mail.messages[playername][index] then
		mail.messages[playername][index].unread = true
	end
end

mail.webmail_send_hook = function(src,dst,subject,body)
	channel.send({
		type = "new-message",
		data = {
			src=src,
			dst=dst,
			subject=subject,
			body=body
		}
	})
end
mail.register_on_receive(mail.webmail_send_hook)

mail.webmail_init = function(http, url, key)
	channel = Channel(http, url .. "/api/minetest/channel", {
		extra_headers = { "webmailkey: " .. key }
	})

	channel.receive(function(data)
		if data.type == "auth" then
			auth_handler(data.data)

		elseif data.type == "send" then
			send_handler(data.data) -- { src, dst, subject, body }

		elseif data.type == "delete-mail" then
			delete_mail_handler(data.playername, data.index) -- index 1-based

		elseif data.type == "mark-mail-read" then
			mark_mail_read_handler(data.playername, data.index) -- index 1-based

		elseif data.type == "mark-mail-unread" then
			mark_mail_unread_handler(data.playername, data.index) -- index 1-based

		elseif data.type == "player-messages" then
			get_player_messages_handler(data.data)

		end
	end)
end
