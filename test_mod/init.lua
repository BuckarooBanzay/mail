
minetest.log("warning", "[TEST] integration-test enabled!")

minetest.register_on_mods_loaded(function()
	minetest.log("warning", "[TEST] starting tests")
	mail.send("src", "dst", "subject", "body");
	minetest.after(1, function()

		minetest.log("warning", "[TEST] integration tests done!")
		minetest.request_shutdown("success")

		local data = minetest.write_json({ success = true }, true);
		local file = io.open(minetest.get_worldpath().."/integration_test.json", "w" );
		if file then
			file:write(data)
			file:close()
		end
	end)
end)
