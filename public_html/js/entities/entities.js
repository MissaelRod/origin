// TODO 
game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "64",
                spiteheight: "64",
                width: 64,
                height: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 30,64 )).toPolygon();
                }
            }]);

        this.renderable.addAnimation("idle", [73]);
        //the last number says we switch betwwen pictures every 80 milliseconds
        this.renderable.addAnimation("smallWalk", [265, 266, 268, 269, 270, 271, 272], 80);

        this.renderable.setCurrentAnimation("idle");
        //sets the speed we go on the x axis (the first number) and y axis(second number)
        this.big = false;
        this.body.setVelocity(5, 20);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    },
    update: function(delta) {
       //checks if the right key is pressed and if it is, exxecute the following statement
        if (me.input.isKeyPressed("right")) {
            //sets the position of mario on the x axis by adding the x value from the setVelocity times the timer.tick
            //me.timer.tick uses the time since last animation to make the distance traveled smooth
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        }
        else if (me.input.isKeyPressed("left")) {
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        } else {
            this.body.vel.x = 0;
        }
//when I press a certain key the given code blow will work 
        if (me.input.isKeyPressed("space")) {
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }

        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        } else {
            this.renderable.setCurrentAnimation("idle");
        }

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {

        var ydif = this.pos.y - response.b.pos.y;
        console.log(ydif);
        
        
        if (response.b.type === 'badguy') {
            if (ydif <= -51){
             response.b.alive = false;
            } else {

                me.state.change(me.state.MENU);
            }
        }else if(response.b.type === 'mushroom'){
            this.big = true;
            console.log("Big!");
        }
    }

});

//allows me to go to the door(level trigger)
game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        //if something collides with this object then we call the onCollision function and pass it
        //a hidden parameter of this object
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
        
    },
    onCollision: function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
    
});
//adds the animation for the BadGuy to move back and forth

game.BadGuy = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spiteheight: "28",
                width: 60,
                height: 28,
                getShape: function() {
                    return (new me.Rect(0, 0, 60, 28)).toPolygon();
                }
            }]);
        this.spritewidth = 60;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width - this.spritewidth;
        this.updateBounds();
        
        this.alwayupdate = true;
        
        this.walkLeft = false;
        this.alive = true;
        this.type = "badguy";
        
          this.renderable.addAnimation("run", [0, 1, 2], 80);
        //the set speed for the velocity of the bad guy
        this.body.setVelocity(1, 6);
        
    },
    update: function(delta){
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x *me.timer.tick : this.body.accel.x *me.timer.tick;

        } else {
            me.game.world.removeChild(this);
        }
        
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response){
    }

});
//adds the mushroom to the map or level
game.Mushroom = me.Entity.extend({
      init: function(x, y, settings){
                this._super(me.Entity, 'init', [x, y, {
                image: "mushroom",
                spritewidth: "64",
                spiteheight: "28",
                width: 64,
                height: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
//        this.collision.check(this);
        this.type="mushroom";
        }
    });