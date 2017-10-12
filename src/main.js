/* main.js
 * Heiher <r@hev.cc>
 */

const GLib = imports.gi.GLib;
const HevSCGI = imports.gi.HevSCGI;
const Handler = imports.hev_scgi_handler_demo.Handler;

function main ()
{
	let loop = new GLib.MainLoop (null, false);
	let server = new HevSCGI.Server ();

	let handler = new Handler ()
	server.add_handler (handler)

	server.load_extern_handlers ()
	server.load_default_handler ()

	server.start ()
	loop.run ()
	server.stop ()
}

main ()

