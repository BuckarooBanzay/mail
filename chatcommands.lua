minetest.register_chatcommand("mail",{
	description = "Open the mail interface",
	func = function(name)
		mail.showinbox(name)
	end
})
