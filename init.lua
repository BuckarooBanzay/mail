mail = {}


local MP = minetest.get_modpath(minetest.get_current_modname())
dofile(MP .. "/chatcommands.lua")
dofile(MP .. "/persistence.lua")
dofile(MP .. "/inbox.lua")
dofile(MP .. "/ui.lua")


mail.load()
