mail = {
	maildir = minetest.get_worldpath().."/mails"
}


local MP = minetest.get_modpath(minetest.get_current_modname())
dofile(MP .. "/chatcommands.lua")
dofile(MP .. "/migrate.lua")
dofile(MP .. "/hud.lua")
dofile(MP .. "/storage.lua")
dofile(MP .. "/api.lua")
dofile(MP .. "/gui.lua")

-- optional webmail stuff below

--[[ minetest.conf
secure.http_mods = mail
webmail.url = http://127.0.0.1:8080
webmail.key = myserverkey
--]]

local http = minetest.request_http_api()

if http then
	local webmail_url = minetest.settings:get("webmail.url")
	local webmail_key = minetest.settings:get("webmail.key")

	if not webmail_url then error("webmail.url is not defined") end
	if not webmail_key then error("webmail.key is not defined") end

	print("[mail] loading webmail-component with endpoint: " .. webmail_url)
	dofile(MP .. "/webmail.lua")
	mail.webmail_init(http, webmail_url, webmail_key)
end

-- migrate storage
mail.migrate()
