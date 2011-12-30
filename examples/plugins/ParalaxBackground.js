module.exports = new Class({
	Extends: Radamn.RendereableResource,

	config: [],
    options: {
    },

    initialize: function(reference_node) {
        this.referenceNode = reference_node;
    },
	push: function(url, move_factor) {
		this.config.push({
			image: Radamn.Assets.getImage(url),
			factor: move_factor,
		});
	},
    draw: function(ctx, delta) {
		var pos = this.referenceNode.getDerivedPosition();
		console.log(pos);
		
		pos.x = - pos.x;
		pos.y = - pos.y;
		
		
		var i =0,
			max = this.config.length;
		for(;i<max;++i) {
			var w = this.config[i].image.width;
			w = 640;
			
			var offset = (pos.x * this.config[i].factor) % w,
				j = Math.floor(pos.x / w),
				jmax = j + 3;
			console.log(offset, j , jmax);
			
			for(;j<jmax;++j) {
				console.log("x: > ", (offset) + (j * w));
				
				// ctx.drawImage(this.images[i], (start) + (j * w), 0);
				// this.config[i].image.factor * j * w
				ctx.drawImage(this.config[i].image, (j * w) - offset, 0);
			}
		}
    }
});