// TODO
game.playerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                iamge: "mario",
                spritewidth: "128",
                spiteheight: "128",
                width: 128,
                height: 128,
                getShape: function() {
                    return (new me.Rect(0, 0, 128, 128)).toPolygon();
                }
            }]);

        this.body.setVelocity(5, 0);
    },
    update: function(delta) {
        if (me.input.isKeyPressed("right")) {
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        } else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("left")) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        } else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("up")) {
            this.body.vel.y += this.body.accel.y * me.timer.tick;
        } else {
            this.body.vel.y = 0;
        }
        this.body.update(delta);
        return true;
    }

});