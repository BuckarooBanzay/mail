mail = {}


local MP = minetest.get_modpath(minetest.get_current_modname())
dofile(MP .. "/chatcommands.lua")
dofile(MP .. "/persistence.lua")
dofile(MP .. "/inbox.lua")
dofile(MP .. "/ui.lua")

-- optional webmail stuff below

--[[ minetest.conf
secure.http_mods = mail
webmail.url = http://127.0.0.1:8081
--]]

local http = minetest.request_http_api()

if http then
	local webmail_url = minetest.settings:get("webmail.url") or "http://127.0.0.1:8081"

	print("[mail] loading webmail-component with endpoint: " .. webmail_url)
	dofile(MP .. "/webmail.lua")
	mail.webmail_init(http, webmail_url)
end




mail.load()
