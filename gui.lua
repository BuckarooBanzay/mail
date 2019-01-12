
mail.inboxformspec = [[
		size[8,9;]
		button_exit[7.5,0;0.5,0.5;quit;X]
		button[6.25,1;1.5,0.5;new;New Message]
		button[6.25,2;1.5,0.5;read;Read]
		button[6.25,3;1.5,0.5;reply;Reply]
		button[6.25,4;1.5,0.5;forward;Forward]
		button[6.25,5;1.5,0.5;delete;Delete]
		button[6.25,6;1.5,0.5;markread;Mark Read]
		button[6.25,7;1.5,0.5;markunread;Mark Unread]
		button[6.25,8;1.5,0.5;about;About]
		textlist[0,0.5;6,8.5;message;
	]]

function mail.showabout(name)
	local formspec = [[
			size[4,5;]
			button[3.5,0;0.5,0.5;back;X]
			label[0,0;Mail]
			label[0,0.5;By cheapie]
			label[0,1;http://github.com/cheapie/mail]
			label[0,1.5;See LICENSE file for license information]
			label[0,2.5;NOTE: Communication using this system]
			label[0,3;is NOT guaranteed to be private!]
			label[0,3.5;Admins are able to view the messages]
			label[0,4;of any player.]
		]]

	minetest.show_formspec(name, "mail:about", formspec)
end

function mail.showinbox(name)
	local formspec = mail.inboxformspec
	mail.messages[name] = mail.messages[name] or {}

	if mail.messages[name][1] then
		for idx, message in ipairs(mail.messages[name]) do
			if idx ~= 1 then
				formspec = formspec .. ","
			end
			if message.unread then
				formspec = formspec .. "#FF8888"
			end
			formspec = formspec .. "From: " .. minetest.formspec_escape(message.sender) .. " Subject: "
			if message.subject ~= "" then
				if string.len(message.subject) > 30 then
					formspec = formspec ..
							minetest.formspec_escape(string.sub(message.subject, 1, 27)) ..
							"..."
				else
					formspec = formspec .. minetest.formspec_escape(message.subject)
				end
			else
				formspec = formspec .. "(No subject)"
			end
		end
		formspec = formspec .. "]label[0,0;Welcome! You've got mail!]"
	else
		formspec = formspec .. "No mail :(]label[0,0;Welcome!]"
	end
	minetest.show_formspec(name, "mail:inbox", formspec)
end

function mail.showmessage(name, msgnumber)
	local message = mail.messages[name][msgnumber]
	local formspec = [[
			size[8,6]
			button[7.5,0;0.5,0.5;back;X]
			label[0,0;From: %s]
			label[0,0.5;Subject: %s]
			textarea[0.25,1;8,4;body;;%s]
			button[1,5;2,1;reply;Reply]
			button[3,5;2,1;forward;Forward]
			button[5,5;2,1;delete;Delete]
		]]

	local sender = minetest.formspec_escape(message.sender)
	local subject = minetest.formspec_escape(message.subject)
	local body = minetest.formspec_escape(message.body)
	formspec = string.format(formspec, sender, subject, body)
	minetest.show_formspec(name,"mail:message",formspec)
end

function mail.showcompose(name, defaulttgt, defaultsubj, defaultbody)
	local formspec = [[
			size[8,8]
			field[0.25,0.5;4,1;to;To:;%s]
			field[0.25,1.5;4,1;subject;Subject:;%s]
			textarea[0.25,2.5;8,4;body;;%s]
			button[1,7;2,1;cancel;Cancel]
			button[7.5,0;0.5,0.5;cancel;X]
			button[5,7;2,1;send;Send]
		]]

	formspec = string.format(formspec,
		minetest.formspec_escape(defaulttgt),
		minetest.formspec_escape(defaultsubj),
		minetest.formspec_escape(defaultbody))

	minetest.show_formspec(name, "mail:compose", formspec)
end

function mail.handle_receivefields(player, formname, fields)
	if formname == "" and fields and fields.quit and minetest.get_modpath("unified_inventory") then
		unified_inventory.set_inventory_formspec(player, "craft")
	end

	if formname == "mail:about" then
		minetest.after(0.5, function()
			mail.showinbox(player:get_player_name())
		end)
	elseif formname == "mail:inbox" then
		local name = player:get_player_name()
		if fields.message then
			local event = minetest.explode_textlist_event(fields.message)
			mail.highlightedmessages[name] = event.index
			if event.type == "DCL" and mail.messages[name][mail.highlightedmessages[name]] then
				mail.messages[name][mail.highlightedmessages[name]].unread = false
				mail.showmessage(name, mail.highlightedmessages[name])
			end
		end
		if fields.read then
			if mail.messages[name][mail.highlightedmessages[name]] then
				mail.messages[name][mail.highlightedmessages[name]].unread = false
				mail.showmessage(name, mail.highlightedmessages[name])
			end
		elseif fields.delete then
			if mail.messages[name][mail.highlightedmessages[name]] then
				table.remove(mail.messages[name], mail.highlightedmessages[name])
			end

			mail.showinbox(name)
			mail.save()
		elseif fields.reply and mail.messages[name][mail.highlightedmessages[name]] then
			local message = mail.messages[name][mail.highlightedmessages[name]]
			local replyfooter = "Type your reply here.\n\n--Original message follows--\n" ..message.body
			mail.showcompose(name, message.sender, "Re: "..message.subject,replyfooter)
		elseif fields.forward and mail.messages[name][mail.highlightedmessages[name]] then
			local message = mail.messages[name][mail.highlightedmessages[name]]
			local fwfooter = "Type your message here.\n\n--Original message follows--\n" ..message.body
			mail.showcompose(name, "", "Fw: "..message.subject, fwfooter)
		elseif fields.markread then
			if mail.messages[name][mail.highlightedmessages[name]] then
				mail.messages[name][mail.highlightedmessages[name]].unread = false
			end
			mail.showinbox(name)
			mail.save()
		elseif fields.markunread then
			if mail.messages[name][mail.highlightedmessages[name]] then
				mail.messages[name][mail.highlightedmessages[name]].unread = true
			end
			mail.showinbox(name)
			mail.save()
		elseif fields.new then
			mail.showcompose(name,"","","Type your message here.")
		elseif fields.quit then
			if minetest.get_modpath("unified_inventory") then
				unified_inventory.set_inventory_formspec(player, "craft")
			end
		elseif fields.about then
			mail.showabout(name)
		end
		return true
	elseif formname == "mail:message" then
		local name = player:get_player_name()
		if fields.back then
			mail.showinbox(name)
		elseif fields.reply then
			local message = mail.messages[name][mail.highlightedmessages[name]]
			local replyfooter = "Type your reply here.\n\n--Original message follows--\n" ..message.body
			mail.showcompose(name, message.sender, "Re: "..message.subject, replyfooter)
		elseif fields.forward then
			local message = mail.messages[name][mail.highlightedmessages[name]]
			local fwfooter = "Type your message here.\n\n--Original message follows--\n" ..message.body
			mail.showcompose(name, "", "Fw: "..message.subject, fwfooter)
		elseif fields.delete then
			if mail.messages[name][mail.highlightedmessages[name]] then
				table.remove(mail.messages[name],mail.highlightedmessages[name])
			end
			mail.showinbox(name)
			mail.save()
		end
		return true
	elseif formname == "mail:compose" then
		if fields.send then
			mail.send(player:get_player_name(), fields.to, fields.subject, fields.body)
		end
		minetest.after(0.5, function()
			mail.showinbox(player:get_player_name())
		end)
		return true
	elseif formname == "mail:unreadnag" then
		if fields.yes then
			mail.showinbox(player:get_player_name())
		else
			minetest.chat_send_player(player:get_player_name(), mail.read_later_message)
		end
		return true
	elseif fields.mail then
		mail.showinbox(player:get_player_name())
	else
		return false
	end
end

minetest.register_on_player_receive_fields(mail.handle_receivefields)


if minetest.get_modpath("unified_inventory") then
	mail.receive_mail_message = mail.receive_mail_message ..
		" or use the mail button in the inventory"
	mail.read_later_message = mail.read_later_message ..
		" or by using the mail button in the inventory"

	unified_inventory.register_button("mail", {
			type = "image",
			image = "mail_button.png",
			tooltip = "Mail"
		})
end
