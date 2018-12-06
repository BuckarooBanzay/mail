
local webmail = {}

local MP = minetest.get_modpath(minetest.get_current_modname())
local Channel = dofile(MP .. "/util/channel.lua")
local channel


local auth_handler = function(auth)
	local handler = minetest.get_auth_handler()

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

local send_handler = function(sendmail)
	-- send mail from webclient
	minetest.log("action", "[webmail] sending mail from webclient: " .. sendmail.src .. " -> " .. sendmail.dst)
	mail.send(sendmail.src, sendmail.dst, sendmail.subject, sendmail.body)
end

-- called on mail saving to disk (every change)
mail.webmail_save_hook = function()
	channel.send({
		type = "messages",
		data = mail.messages
	})
end


mail.webmail_init = function(http, url, key)
	channel = Channel(http, url .. "/api/minetest/channel", {
		extra_headers = { "webmailkey: " .. key }
	})

	channel.receive(function(data)
		if data.type == "auth" then
			auth_handler(data.data)
		elseif data.type == "send" then
			send_handler(data.data)
		end
	end)
end

