minetest.register_on_joinplayer(function(player)
	minetest.after(2, function(name)
		local messages = mail.getMessages(name)
		local unreadflag = false

		for _, message in ipairs(messages) do
			if message.unread then
				unreadflag = true
			end
		end

		if unreadflag then
			minetest.show_formspec(name, "mail:unreadnag",
				"size[3,2]" ..
				"label[0,0;You have unread messages in your inbox.]" ..
				"label[0,0.5;Go there now?]" ..
				"button[0.5,0.75;2,1;yes;Yes]" ..
				"button_exit[0.5,1.5;2,1;no;No]"
			)
		end
	end, player:get_player_name())
end)
