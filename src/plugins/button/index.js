(function()
{
    const Listener = require( 'Listener' );

    class Button
    {
        constructor(name, deps)
        {
		var os = require('os');
		var addresses = [];
		var interfaces = os.networkInterfaces();
		console.log(`B0be button: eth0[0]: ${interfaces['eth0'][0]['address']}`);
		console.log(`B0be button: eth0[1]: ${interfaces['eth0'][1]['address']}`);
	
			    deps.logger.debug('Button plugin loaded!');

            this.globalBus  = deps.globalEventLoop;   // This is the server-side messaging bus. The MCU sends messages to server plugins over this
            this.cockpitBus = deps.cockpit;           // This is the server<->client messaging bus. This is how the server talks to the browser

            var self = this;

            // Pre-define all of the event listeners here. We defer enabling them until later.
            // Look at src/libs/Listener.js to see how these work.
            this.listeners =
            {
                // Listener for MCU status messages
                mcuStatus: new Listener( self.globalBus, 'mcu.status', false, function( data )
                {
                    // Check for the example field name in the MCU's status update
                    if( 'bctr' in data )
                    {
                        // Get the message that the MCU sent to us
                        var message = data.bctr;
                        // Re-emit the message on the cockpit messaging bus (talks to the browser)
                        self.cockpitBus.emit( 'plugin.button.value', message );
                    }
                })
            }
        }

        // This is automatically called when cockpit loads all of the plugins, and when a plugin is enabled
        start()
        {
          // Enable the listeners!
          this.listeners.mcuStatus.enable();
          console.log("button started!!");
        }

        // This is called when the plugin is disabled
        stop()
        {
          // Disable listeners
          this.listeners.mcuStatus.disable();
        }
    }

    module.exports = function(name, deps)
    {
        return new Button(name, deps);
    };
}());