/datum/keybinding/admin
	category = CATEGORY_ADMIN
	weight = WEIGHT_ADMIN

/datum/keybinding/admin/can_use(client/user)
	return user.holder ? TRUE : FALSE

/datum/keybinding/admin/admin_say
	key = "F5"
	name = "admin_say"
	full_name = "Admin say"
	description = "Talk with other admins."
	keybind_signal = COMSIG_KB_ADMIN_ASAY_DOWN

/datum/keybinding/admin/admin_say/down(client/user)
	. = ..()
	if(.)
		return
	user.get_admin_say()
	return TRUE


/datum/keybinding/admin/player_panel
	key = "F6"
	name = "player_panel"
	full_name = "Player Panel"
	description = "View the player panel list."
	keybind_signal = COMSIG_KB_ADMIN_PLAYERPANEL_DOWN

/datum/keybinding/admin/player_panel/down(client/user)
	. = ..()
	if(.)
		return
	user.holder.player_panel_new()
	return TRUE


/datum/keybinding/admin/build_mode
	key = "F7"
	name = "toggle_build_mode"
	full_name = "Toggle Build Mode"
	description = "Toggle admin build mode on or off."
	keybind_signal = COMSIG_KB_ADMIN_TOGGLEBUILDMODE_DOWN

/datum/keybinding/admin/build_mode/down(client/user)
	. = ..()
	if(.)
		return
	user.togglebuildmodeself()
	return TRUE


/datum/keybinding/admin/invismin
	key = "F8"
	name = "invismin"
	full_name = "Toggle Invismin"
	description = "Toggle your admin invisibility."
	keybind_signal = COMSIG_KB_ADMIN_INVISIMINTOGGLE_DOWN

/datum/keybinding/admin/invismin/down(client/user)
	. = ..()
	if(.)
		return
	user.invisimin()
	return TRUE


/datum/keybinding/admin/dead_say
	key = "F10"
	name = "dead_say"
	full_name = "Dead Say"
	description = "Speak in deadchat as an admin."
	keybind_signal = COMSIG_KB_ADMIN_DSAY_DOWN

/datum/keybinding/admin/dead_say/down(client/user)
	. = ..()
	if(.)
		return
	user.get_dead_say()
	return TRUE
