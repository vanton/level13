define(['ash', 'worldcreator/WorldCreatorConstants'], function (Ash, WorldCreatorConstants) {

    var WorldFeatureVO = Ash.Class.extend({
        
        posX: 0,
        posY: 0,
        sizeX: 0,
        sizeY: 0,
        levelMin: 0,
        levelMax: 0,
        type: null,
        
        constructor: function (posX, posY, sizeX, sizeY, levelMin, levelMax, type) {
            this.posX = posX;
            this.posY = posY;
            this.sizeX = sizeX;
            this.sizeY = sizeY;
            this.levelMin = levelMin;
            this.levelMax = levelMax;
            this.type = type;
        },
        
        containsPosition: function (position) {
            return this.spansLevel(position.level) && position.sectorX >= this.getMinX() && position.sectorX <= this.getMaxX() && position.sectorY >= this.getMinY() && position.sectorY <= this.getMaxY();
        },
        
        spansLevel: function (l) {
            return l >= this.levelMin && l <= this.levelMax;
        },
        
        getMinX: function () {
            if (this.sizeX <= 1) return this.posX;
            return this.posX - Math.floor((this.sizeX)/2);
        },
        
        getMaxX: function () {
            if (this.sizeX <= 1) return this.posX;
            return this.posX + Math.floor((this.sizeX)/2);
        },
        
        getMinY: function () {
            if (this.sizeY <= 1) return this.posY;
            return this.posY - Math.floor((this.sizeY)/2);
        },
        
        getMaxY: function () {
            if (this.sizeY <= 1) return this.posY;
            return this.posY + Math.floor((this.sizeY)/2);
        },
        
        isBuilt: function () {
            switch (this.type) {
                case WorldCreatorConstants.FEATURE_HOLE_COLLAPSE:
                    return false;
                default:
                    return true;
            }
        }
        
    });

    return WorldFeatureVO;
});
