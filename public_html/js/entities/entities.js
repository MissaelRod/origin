// TODO
game.playerEntity = me.Entity.extend ({
    init: function (x, y,settings){
     settings.iamge = "Mario";
     settings.spritewidth = "128";   
     settings.spiteheight =  "128";  
     settings.width = 128;  
     settings.height = 128;  
     this._super(me.Entity, 'init', [x, y, settings]);  
        
    },
    
    update: function (){
        
    }
     
});