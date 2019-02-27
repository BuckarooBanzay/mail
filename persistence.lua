
function mail.load()
	local file = io.open(minetest.get_worldpath().."/mail.db", "r")
	if file then
		local data = file:read("*a")
		mail.messages = minetest.deserialize(data)
		file:close()
	end
end


function mail.save()
	local file = io.open(minetest.get_worldpath().."/mail.db","w")
	if file and file:write(minetest.serialize(mail.messages)) and file:close() then
		return true
	else
		minetest.log("error","[mail] Save failed - messages may be lost!")
		return false
	end
end

-- save periodically
local timer = 0
minetest.register_globalstep(function(dtime)
	timer = timer + dtime
	if timer < 30 then
		return
	end

	timer = 0
	mail.save()
end)
