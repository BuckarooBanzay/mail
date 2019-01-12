
minetest.register_on_joinplayer(function(player)
	minetest.after(0,function(player)
		local name = player:get_player_name()
		local unreadflag = false
		if mail.messages[name] then
			for _,message in ipairs(mail.messages[name]) do
				if message.unread then unreadflag = true end
			end
		end
		if unreadflag then
			minetest.show_formspec(name,"mail:unreadnag",
				"size[3,2]" ..
				"label[0,0;You have unread messages in your inbox.]" ..
				"label[0,0.5;Go there now?]" ..
				"button[0.5,0.75;2,1;yes;Yes]" ..
				"button_exit[0.5,1.5;2,1;no;No]"
			)
		end
	end,player)
end)
