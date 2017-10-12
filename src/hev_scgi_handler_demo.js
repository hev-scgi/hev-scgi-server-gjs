/* hev_scgi_handler_demo.js
 * Heiher <r@hev.cc>
 */

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const HevSCGI = imports.gi.HevSCGI;
const Lang = imports.lang;

var Handler = new Lang.Class ({
	Name: 'Handler',
	Extends: GObject.Object,
	Implements: [ HevSCGI.Handler ],

	_init: function() {
		this.parent ();
	},

	vfunc_get_alias: function () {
		return 'HevSCGIHandlerDemo';
	},

	vfunc_get_name: function () {
		return 'HevSCGIHandlerDemo';
	},

	vfunc_get_version: function () {
		return '0.0.1';
	},

	vfunc_get_pattern: function () {
		return '/scgi/gjs.*';
	},

	vfunc_handle: function (task) {
		let handler = task.get_handler ();
		let connection = task.get_socket_connection ();
		let request = task.get_request ();
		let response = task.get_response ();
		let output_stream = response.get_output_stream ();
		let req_htb = request.get_header_hash_table ();
		let res_htb = { 'Status': '200 OK', 'Content-Type': 'text/html' };

		response.set_header_hash_table (res_htb);
		response.write_header_async (null, function (obj, res) {
			let buf = '';

			response.write_header_finish (res);

			buf += '<strong>Handler:</strong> ' + handler.get_name () +
					' ' + handler.get_version ();
			buf += '<br /><strong>RequestURI:</strong> ' + req_htb['REQUEST_URI'];
			buf += '<br /><strong>RemoteAddr:</strong> ' + req_htb['REMOTE_ADDR'];
			buf += '<br /><strong>RemotePort:</strong> ' + req_htb['REMOTE_PORT'];

			output_stream.write_async (buf, 0, null, function (obj, res) {
				output_stream.write_finish (res);
				connection.close_async (0, null, null);
				task.finish ();
			});
		});
	}
});
