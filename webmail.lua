
local url, key, http

local webmail = {}

-- polls the webmail server and processes the logins made there
webmail.auth_collector = function()
	http.fetch({
		url=url .. "/api/minetest/auth_collector",
		extra_headers = { "webmailkey: " .. key },
		timeout=15
	}, function(res)

		if res.code == 403 then
			-- unauthorized, abort
			minetest.log("error", "[webmail] invalid key specified!")
			return
		end

		if res.succeeded and res.code == 200 then
			local data = minetest.parse_json(res.data)
			if data then
				local auth_response = {}
				local handler = minetest.get_auth_handler()

				for _,auth in pairs(data) do
					local success = false
					local entry = handler.get_auth(auth.name)
					if entry and minetest.check_password_entry(auth.name, entry.password, auth.password) then
						success = true
					end

					table.insert(auth_response, {
						name = auth.name,
						success = success
					})
				end

				if #auth_response >  0 then

					-- send back auth response data
					http.fetch({
						url=url .. "/api/minetest/auth_collector",
						extra_headers = { "Content-Type: application/json", "webmailkey: " .. key },
						post_data = minetest.write_json(auth_response)
					}, function(res)
						-- stub
					end)
				end
			end
			-- execute again
			minetest.after(1, webmail.auth_collector)
		else
			-- execute again (error case)
			minetest.after(10, webmail.auth_collector)
		end

	end)
end

-- called on mail saving to disk (every change)
mail.webmail_save_hook = function()
	http.fetch({
		url=url .. "/api/minetest/messages",
		extra_headers = { "Content-Type: application/json", "webmailkey: " .. key },
		post_data = minetest.write_json(mail.messages)
	}, function(res)
		if not res.succeeded then
			minetest.log("error", "[webmail] message sync to web failed")
		end
	end)
end

-- polls the message endpoint for commands from the webclient
webmail.message_command_loop = function()
	http.fetch({
		url=url .. "/api/minetest/messages",
		extra_headers = { "webmailkey: " .. key },
		timeout=15
	}, function(res)

		if res.code == 403 then
			-- unauthorized, abort
			minetest.log("error", "[webmail] invalid key specified!")
			return
		end

		if res.succeeded and res.code == 200 then
			local data = minetest.parse_json(res.data)
			if data then
				for _,cmd in pairs(data) do
					if cmd.type == "send" and cmd.mail and cmd.mail.src and cmd.mail.dst then
						-- send mail from webclient
						local sendmail = cmd.mail
						minetest.log("action", "[webmail] sending mail from webclient: " .. sendmail.src .. " -> " .. sendmail.dst)
						mail.send(sendmail.src, sendmail.dst, sendmail.subject, sendmail.body)
					end
				end
			end

			-- execute again
			minetest.after(1, webmail.message_command_loop)
		else
			-- execute again (error case)
			minetest.after(10, webmail.message_command_loop)
		end

	end)
end

mail.webmail_init = function(_http, webmail_url, webmail_key)
	url = webmail_url
	key = webmail_key
	http = _http

	minetest.after(4, function()
		-- start auth collector loop
		webmail.auth_collector()

		-- start message command loop
		webmail.message_command_loop()

		-- sync messages after server start
		if #mail.messages > 0 then
			-- only if mails available
			mail.webmail_save_hook()
		end
	end)
end

