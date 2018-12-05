
local url, key, http

local webmail = {}

-- polls the webmail server and processes the logins made there
webmail.auth_collector = function()
	http.fetch({
		url=url .. "/api/minetest/auth_collector",
		extra_headers = { "webmailkey: " .. key },
		timeout=10
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
	end)
end


mail.webmail_init = function(_http, webmail_url, webmail_key)
	url = webmail_url
	key = webmail_key
	http = _http

	-- start auth collector loop
	webmail.auth_collector()
end