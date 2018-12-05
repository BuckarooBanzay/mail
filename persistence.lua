
function mail.load()
	local file = io.open(minetest.get_worldpath().."/mail.db","r")
	if file then
		local data = file:read("*a")
		mail.messages = minetest.deserialize(data)
		file:close()
	end
end

function save_json()
        local file = io.open(minetest.get_worldpath().."/mail.json","w")
        if file and file:write(minetest.write_json(mail.messages)) and file:close() then
                return true
        else
                minetest.log("error","[mail] Json-Save failed - messages may be lost!")
                return false
        end
end


function mail.save()
	save_json()
	local file = io.open(minetest.get_worldpath().."/mail.db","w")
	if mail.webmail_save_hook then
		-- call webmail hook if available
		mail.webmail_save_hook(mail.messages)
	end
	if file and file:write(minetest.serialize(mail.messages)) and file:close() then
		return true
	else
		minetest.log("error","[mail] Save failed - messages may be lost!")
		return false
	end
end