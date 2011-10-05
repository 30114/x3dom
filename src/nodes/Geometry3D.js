/*
 * X3DOM JavaScript Library
 * http://x3dom.org
 *
 * (C)2009 Fraunhofer Insitute for Computer
 *         Graphics Reseach, Darmstadt
 * Dual licensed under the MIT and GPL.
 *
 * Based on code originally provided by
 * Philip Taylor: http://philip.html5.org
 */

/* ### Plane ### */
x3dom.registerNodeType(
    "Plane",
    "Geometry3D",
    defineClass(x3dom.nodeTypes.X3DGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.Plane.superClass.call(this, ctx);

            this.addField_SFVec2f(ctx, 'size', 2, 2);
            this.addField_SFVec2f(ctx, 'subdivision', 1, 1);

            var sx = this._vf.size.x, sy = this._vf.size.y;
            var subx = this._vf.subdivision.x, suby = this._vf.subdivision.y;
			
			var geoCacheID = 'Plane_'+sx+'-'+sy+'-'+subx+'-'+suby;

			if( x3dom.geoCache[geoCacheID] != undefined )
			{
				x3dom.debug.logInfo("Using Plane from Cache");
				this._mesh = x3dom.geoCache[geoCacheID];
			}
			else
			{
                var x = 0, y = 0;
                var xstep = sx / subx;
                var ystep = sy / suby;

                sx /= 2; sy /= 2;

                for (y = 0; y <= suby; y++) {
                    for (x = 0; x <= subx; x++) {
                        this._mesh._positions[0].push(x * xstep - sx);
						this._mesh._positions[0].push(y * ystep - sy);
						this._mesh._positions[0].push(0);
						this._mesh._normals[0].push(0);
						this._mesh._normals[0].push(0);
						this._mesh._normals[0].push(1);
						this._mesh._texCoords[0].push(x / subx);
						this._mesh._texCoords[0].push(y / suby);
                    }
                }

                for (y = 1; y <= suby; y++) {
                    for (x = 0; x < subx; x++) {
                        this._mesh._indices[0].push((y - 1) * (subx + 1) + x);
                        this._mesh._indices[0].push((y - 1) * (subx + 1) + x + 1);
                        this._mesh._indices[0].push(y * (subx + 1) + x);

                        this._mesh._indices[0].push(y * (subx + 1) + x);
                        this._mesh._indices[0].push((y - 1) * (subx + 1) + x + 1);
                        this._mesh._indices[0].push(y * (subx + 1) + x + 1);
                    }
                }
                
				this._mesh._invalidate = true;
				this._mesh._numFaces = this._mesh._indices[0].length / 3;
				this._mesh._numCoords = this._mesh._positions[0].length / 3;

				x3dom.geoCache[geoCacheID] = this._mesh;
			}
         },
         {
            nodeChanged: function() {},
            fieldChanged: function(fieldName) {
				
				if(fieldName === "size") {
					this._mesh._positions[0] = [];
						
					var sx = this._vf.size.x, sy = this._vf.size.y;
					var subx = this._vf.subdivision.x, suby = this._vf.subdivision.y;
					var x = 0, y = 0;
					var xstep = sx / subx;
					var ystep = sy / suby;
	
					sx /= 2; sy /= 2;
	
					for (y = 0; y <= suby; y++) {
						for (x = 0; x <= subx; x++) {
							this._mesh._positions[0].push(x * xstep - sx);
							this._mesh._positions[0].push(y * ystep - sy);
							this._mesh._positions[0].push(0);							
						}
					}
		
					this._mesh._invalidate = true;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
						   
					Array.forEach(this._parentNodes, function (node) {
						node._dirty.positions = true;
					});
				} else if (fieldName === "subdivision") {
					this._mesh._positions[0] = [];
					this._mesh._indices[0] =[];
					this._mesh._normals[0] = [];
					this._mesh._texCoords[0] =[];
						
					var sx = this._vf.size.x, sy = this._vf.size.y;
					var subx = this._vf.subdivision.x, suby = this._vf.subdivision.y;
					
					var x = 0, y = 0;
					var xstep = sx / subx;
					var ystep = sy / suby;
	
					sx /= 2; sy /= 2;
	
					for (y = 0; y <= suby; y++) {
						for (x = 0; x <= subx; x++) {
							this._mesh._positions[0].push(x * xstep - sx);
							this._mesh._positions[0].push(y * ystep - sy);
							this._mesh._positions[0].push(0);
							this._mesh._normals[0].push(0);
							this._mesh._normals[0].push(0);
							this._mesh._normals[0].push(1);
							this._mesh._texCoords[0].push(x / subx);
							this._mesh._texCoords[0].push(y / suby);
						}
					}
	
					for (y = 1; y <= suby; y++) {
						for (x = 0; x < subx; x++) {
							this._mesh._indices[0].push((y - 1) * (subx + 1) + x);
							this._mesh._indices[0].push((y - 1) * (subx + 1) + x + 1);
							this._mesh._indices[0].push(y * (subx + 1) + x);
	
							this._mesh._indices[0].push(y * (subx + 1) + x);
							this._mesh._indices[0].push((y - 1) * (subx + 1) + x + 1);
							this._mesh._indices[0].push(y * (subx + 1) + x + 1);
						}
					}
					
					this._mesh._invalidate = true;
					this._mesh._numFaces = this._mesh._indices[0].length / 3;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
						   
					Array.forEach(this._parentNodes, function (node) {
						node.setAllDirty();
					});
				}
        	}
		}
    )
);

/* ### Box ### */
x3dom.registerNodeType(
    "Box",
    "Geometry3D",
    defineClass(x3dom.nodeTypes.X3DGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.Box.superClass.call(this, ctx);

            this.addField_SFVec3f(ctx, 'size', 2, 2, 2);

            var sx = this._vf.size.x,
                sy = this._vf.size.y,
                sz = this._vf.size.z;

			var geoCacheID = 'Box_'+sx+'-'+sy+'-'+sz;

			if( x3dom.geoCache[geoCacheID] != undefined )
			{
				x3dom.debug.logInfo("Using Box from Cache");
				this._mesh = x3dom.geoCache[geoCacheID];
			}
			else
			{
				sx /= 2; sy /= 2; sz /= 2;

				this._mesh._positions[0] = [
					-sx,-sy,-sz,  -sx, sy,-sz,   sx, sy,-sz,   sx,-sy,-sz, //hinten 0,0,-1
					-sx,-sy, sz,  -sx, sy, sz,   sx, sy, sz,   sx,-sy, sz, //vorne 0,0,1
					-sx,-sy,-sz,  -sx,-sy, sz,  -sx, sy, sz,  -sx, sy,-sz, //links -1,0,0
					 sx,-sy,-sz,   sx,-sy, sz,   sx, sy, sz,   sx, sy,-sz, //rechts 1,0,0
					-sx, sy,-sz,  -sx, sy, sz,   sx, sy, sz,   sx, sy,-sz, //oben 0,1,0
					-sx,-sy,-sz,  -sx,-sy, sz,   sx,-sy, sz,   sx,-sy,-sz  //unten 0,-1,0
				];
				this._mesh._normals[0] = [
					0,0,-1,  0,0,-1,   0,0,-1,   0,0,-1,
					0,0,1,  0,0,1,   0,0,1,   0,0,1,
					-1,0,0,  -1,0,0,  -1,0,0,  -1,0,0,
					1,0,0,   1,0,0,   1,0,0,   1,0,0,
					0,1,0,  0,1,0,   0,1,0,   0,1,0,
					0,-1,0,  0,-1,0,   0,-1,0,   0,-1,0
				];
				this._mesh._texCoords[0] = [
					1,0, 1,1, 0,1, 0,0,
					0,0, 0,1, 1,1, 1,0,
					0,0, 1,0, 1,1, 0,1,
					1,0, 0,0, 0,1, 1,1,
					0,1, 0,0, 1,0, 1,1,
					0,0, 0,1, 1,1, 1,0
				];
				this._mesh._indices[0] = [
					0,1,2, 2,3,0,
					4,7,5, 5,7,6,
					8,9,10, 10,11,8,
					12,14,13, 14,12,15,
					16,17,18, 18,19,16,
					20,22,21, 22,20,23
				];
				this._mesh._invalidate = true;
				this._mesh._numFaces = 12;
				this._mesh._numCoords = 24;

				x3dom.geoCache[geoCacheID] = this._mesh;
			}
        },
        {
            fieldChanged: function(fieldName) {
                if (fieldName === "size") {
                    var sx = this._vf.size.x / 2,
                        sy = this._vf.size.y / 2,
                        sz = this._vf.size.z / 2;

                    this._mesh._positions[0] = [
                        -sx,-sy,-sz,  -sx, sy,-sz,   sx, sy,-sz,   sx,-sy,-sz, //back   0,0,-1
                        -sx,-sy, sz,  -sx, sy, sz,   sx, sy, sz,   sx,-sy, sz, //front  0,0,1
                        -sx,-sy,-sz,  -sx,-sy, sz,  -sx, sy, sz,  -sx, sy,-sz, //left   -1,0,0
                         sx,-sy,-sz,   sx,-sy, sz,   sx, sy, sz,   sx, sy,-sz, //right  1,0,0
                        -sx, sy,-sz,  -sx, sy, sz,   sx, sy, sz,   sx, sy,-sz, //top    0,1,0
                        -sx,-sy,-sz,  -sx,-sy, sz,   sx,-sy, sz,   sx,-sy,-sz  //bottom 0,-1,0
                    ];

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                    });
                }
            }
        }
    )
);

/* ### Sphere ### */
x3dom.registerNodeType(
    "Sphere",
    "Geometry3D",
    defineClass(x3dom.nodeTypes.X3DGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.Sphere.superClass.call(this, ctx);
			this.addField_SFFloat(ctx, 'radius', 1);
			this.addField_SFVec2f(ctx, 'subdivision', 24, 24);
			 
            var qfactor = 1.0;
			var r = this._vf.radius;
			var subx = this._vf.subdivision.x, suby = this._vf.subdivision.y;
			
			var geoCacheID = 'Sphere_'+r;

			if (x3dom.geoCache[geoCacheID] != undefined) {
				x3dom.debug.logInfo("Using Sphere from Cache");
				this._mesh = x3dom.geoCache[geoCacheID];
			} else {
				if(ctx) {
					qfactor = ctx.doc.properties.getProperty("PrimitiveQuality", "Medium");
				}
                if (!x3dom.isNumber(qfactor)) {
                    switch (qfactor.toLowerCase()) {
                        case "low":
                            qfactor = 0.3;
                            break;
                        case "medium":
                            qfactor = 0.5;
                            break;
                        case "high":
                            qfactor = 1.0;
                            break;
                    }
                } else {
                    qfactor = parseFloat(qfactor);
                }
				
				this._quality = qfactor;

				var latNumber, longNumber;
				var latitudeBands = Math.floor(subx * qfactor);
				var longitudeBands = Math.floor(suby * qfactor);

                //x3dom.debug.logInfo("Latitude bands:  "+ latitudeBands);
                //x3dom.debug.logInfo("Longitude bands: "+ longitudeBands);

				var theta, sinTheta, cosTheta;
				var phi, sinPhi, cosPhi;
				var x, y, z, u, v;

				for (latNumber = 0; latNumber <= latitudeBands; latNumber++) {
					theta = (latNumber * Math.PI) / latitudeBands;
					sinTheta = Math.sin(theta);
					cosTheta = Math.cos(theta);

					for (longNumber = 0; longNumber <= longitudeBands; longNumber++) {
						phi = (longNumber * 2.0 * Math.PI) / longitudeBands;
						sinPhi = Math.sin(phi);
						cosPhi = Math.cos(phi);

						x = -cosPhi * sinTheta;
						y = -cosTheta;
						z = -sinPhi * sinTheta;

						u = 0.25 - ((1.0 * longNumber) / longitudeBands);
						v = latNumber / latitudeBands;

						this._mesh._positions[0].push(r * x);
						this._mesh._positions[0].push(r * y);
						this._mesh._positions[0].push(r * z);
						this._mesh._normals[0].push(x);
						this._mesh._normals[0].push(y);
						this._mesh._normals[0].push(z);
						this._mesh._texCoords[0].push(u);
						this._mesh._texCoords[0].push(v);
					}
				}

				var first, second;

				for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
					for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
						first = (latNumber * (longitudeBands + 1)) + longNumber;
						second = first + longitudeBands + 1;

						this._mesh._indices[0].push(first);
						this._mesh._indices[0].push(second);
						this._mesh._indices[0].push(first + 1);

						this._mesh._indices[0].push(second);
						this._mesh._indices[0].push(second + 1);
						this._mesh._indices[0].push(first + 1);
					}
				}
				
				this._mesh._invalidate = true;
				this._mesh._numFaces = this._mesh._indices[0].length / 3;
				this._mesh._numCoords = this._mesh._positions[0].length / 3;

				x3dom.geoCache[geoCacheID] = this._mesh;
			}
        },
        {
            fieldChanged: function(fieldName) {
                 if (fieldName === "radius") {  
                    this._mesh._positions[0] = [];
					this._mesh._normals[0] = [];
					var r = this._vf.radius;
					var subx = this._vf.subdivision.x, suby = this._vf.subdivision.y;
					var qfactor = this._quality;
									
					var latNumber, longNumber;
					var latitudeBands = Math.floor(subx * qfactor);
					var longitudeBands = Math.floor(suby * qfactor);
					
					var theta, sinTheta, cosTheta;
					var phi, sinPhi, cosPhi;
					var x, y, z;
	
					for (latNumber = 0; latNumber <= latitudeBands; latNumber++) {
						theta = (latNumber * Math.PI) / latitudeBands;
						sinTheta = Math.sin(theta);
						cosTheta = Math.cos(theta);
	
						for (longNumber = 0; longNumber <= longitudeBands; longNumber++) {
							phi = (longNumber * 2.0 * Math.PI) / longitudeBands;
							sinPhi = Math.sin(phi);
							cosPhi = Math.cos(phi);
	
							x = -cosPhi * sinTheta;
							y = -cosTheta;
							z = -sinPhi * sinTheta;
	
							this._mesh._positions[0].push(r * x);
							this._mesh._positions[0].push(r * y);
							this._mesh._positions[0].push(r * z);
						}
					}
					
					this._mesh._invalidate = true;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
				
                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                    });
                } else if (fieldName === "subdivision") {
					this._mesh._positions[0] = [];
					this._mesh._indices[0] =[];
					this._mesh._normals[0] = [];
					this._mesh._texCoords[0] =[];
					
					var r = this._vf.radius;
					var subx = this._vf.subdivision.x, suby = this._vf.subdivision.y;
					var qfactor = this._quality;
					
					var latNumber, longNumber;
					var latitudeBands = Math.floor(subx * qfactor);
					var longitudeBands = Math.floor(suby * qfactor);
	
					var theta, sinTheta, cosTheta;
					var phi, sinPhi, cosPhi;
					var x, y, z, u, v;
	
					for (latNumber = 0; latNumber <= latitudeBands; latNumber++) {
						theta = (latNumber * Math.PI) / latitudeBands;
						sinTheta = Math.sin(theta);
						cosTheta = Math.cos(theta);
	
						for (longNumber = 0; longNumber <= longitudeBands; longNumber++) {
							phi = (longNumber * 2.0 * Math.PI) / longitudeBands;
							sinPhi = Math.sin(phi);
							cosPhi = Math.cos(phi);
	
							x = -cosPhi * sinTheta;
							y = -cosTheta;
							z = -sinPhi * sinTheta;
	
							u = 0.25 - ((1.0 * longNumber) / longitudeBands);
							v = latNumber / latitudeBands;
	
							this._mesh._positions[0].push(r * x);
							this._mesh._positions[0].push(r * y);
							this._mesh._positions[0].push(r * z);
							this._mesh._normals[0].push(x);
							this._mesh._normals[0].push(y);
							this._mesh._normals[0].push(z);
							this._mesh._texCoords[0].push(u);
							this._mesh._texCoords[0].push(v);
						}
					}
	
					var first, second;
	
					for (latNumber = 0; latNumber < latitudeBands; latNumber++) {
						for (longNumber = 0; longNumber < longitudeBands; longNumber++) {
							first = (latNumber * (longitudeBands + 1)) + longNumber;
							second = first + longitudeBands + 1;
	
							this._mesh._indices[0].push(first);
							this._mesh._indices[0].push(second);
							this._mesh._indices[0].push(first + 1);
	
							this._mesh._indices[0].push(second);
							this._mesh._indices[0].push(second + 1);
							this._mesh._indices[0].push(first + 1);
						}
					}
					
					this._mesh._invalidate = true;
					this._mesh._numFaces = this._mesh._indices[0].length / 3;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
					
					 Array.forEach(this._parentNodes, function (node) {
                        node.setAllDirty();
                    });
				}
            }
        }
    )
);

/* ### Torus ### */
x3dom.registerNodeType(
    "Torus",
    "Geometry3D",
    defineClass(x3dom.nodeTypes.X3DGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.Torus.superClass.call(this, ctx);
			this.addField_SFFloat(ctx, 'innerRadius', 0.5);
			this.addField_SFFloat(ctx, 'outerRadius', 1.0);
			this.addField_SFVec2f(ctx, 'subdivision', 24, 24);
			
			var innerRadius = this._vf.innerRadius;
			var outerRadius = this._vf.outerRadius;
			var rings = this._vf.subdivision.x, sides = this._vf.subdivision.y;
					
			var geoCacheID = 'Torus_'+innerRadius+'_'+outerRadius;

			if( x3dom.geoCache[geoCacheID] != undefined )
			{
				x3dom.debug.logInfo("Using Torus from Cache");
				this._mesh = x3dom.geoCache[geoCacheID];
			}
			else
			{

				var ringDelta = 2.0 * Math.PI / rings;
				var sideDelta = 2.0 * Math.PI / sides;
				var p = [], n = [], t = [], i = [];
				var a, b, theta, phi;

				for (a=0, theta=0; a <= rings; a++, theta+=ringDelta)
					{
						var cosTheta = Math.cos(theta);
						var sinTheta = Math.sin(theta);
	
						for (b=0, phi=0; b<=sides; b++, phi+=sideDelta)
						{
							var cosPhi = Math.cos(phi);
							var sinPhi = Math.sin(phi);
							var dist = outerRadius + innerRadius * cosPhi;
	
							this._mesh._normals[0].push(cosTheta * cosPhi, -sinTheta * cosPhi, sinPhi);
							this._mesh._positions[0].push(cosTheta * dist, -sinTheta * dist, innerRadius * sinPhi);
							this._mesh._texCoords[0].push(-a / rings, b / sides);
						}
					}
	
					for (a=0; a<sides; a++)
					{
						for (b=0; b<rings; b++)
						{
							this._mesh._indices[0].push(b * (sides+1) + a);
							this._mesh._indices[0].push(b * (sides+1) + a + 1);
							this._mesh._indices[0].push((b + 1) * (sides+1) + a);
	
							this._mesh._indices[0].push(b * (sides+1) + a + 1);
							this._mesh._indices[0].push((b + 1) * (sides+1) + a + 1);
							this._mesh._indices[0].push((b + 1) * (sides+1) + a);
						}
					}
				
				this._mesh._invalidate = true;
				this._mesh._numFaces = this._mesh._indices[0].length / 3;
				this._mesh._numCoords = this._mesh._positions[0].length / 3;

				x3dom.geoCache[geoCacheID] = this._mesh;
			}
        },
        {
            fieldChanged: function(fieldName) {
                if (fieldName === "innerRadius" || fieldName === "outerRadius") { 
				
                    this._mesh._positions[0] = [];
					
					var innerRadius = this._vf.innerRadius;
					var outerRadius = this._vf.outerRadius;
					var rings = this._vf.subdivision.x, sides = this._vf.subdivision.y;
				
					var ringDelta = 2.0 * Math.PI / rings;
					var sideDelta = 2.0 * Math.PI / sides;
					var a, b, theta, phi;
	
					for (a=0, theta=0; a <= rings; a++, theta+=ringDelta)
					{
						var cosTheta = Math.cos(theta);
						var sinTheta = Math.sin(theta);
	
						for (b=0, phi=0; b<=sides; b++, phi+=sideDelta)
						{
							var cosPhi = Math.cos(phi);
							var sinPhi = Math.sin(phi);
							var dist = outerRadius + innerRadius * cosPhi;
							this._mesh._positions[0].push(cosTheta * dist, -sinTheta * dist, innerRadius * sinPhi);
							
						}
					}
					
					this._mesh._invalidate = true;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
				
                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                    });
                } else if (fieldName === "subdivision") {
					
					this._mesh._positions[0] = [];
					this._mesh._indices[0] =[];
					this._mesh._normals[0] = [];
					this._mesh._texCoords[0] =[];
					
					var innerRadius = this._vf.innerRadius;
					var outerRadius = this._vf.outerRadius;
					var rings = this._vf.subdivision.x, sides = this._vf.subdivision.y;
					
					var ringDelta = 2.0 * Math.PI / rings;
					var sideDelta = 2.0 * Math.PI / sides;
					var a, b, theta, phi;
	
					for (a=0, theta=0; a <= rings; a++, theta+=ringDelta)
					{
						var cosTheta = Math.cos(theta);
						var sinTheta = Math.sin(theta);
	
						for (b=0, phi=0; b<=sides; b++, phi+=sideDelta)
						{
							var cosPhi = Math.cos(phi);
							var sinPhi = Math.sin(phi);
							var dist = outerRadius + innerRadius * cosPhi;
	
							this._mesh._normals[0].push(cosTheta * cosPhi, -sinTheta * cosPhi, sinPhi);
							this._mesh._positions[0].push(cosTheta * dist, -sinTheta * dist, innerRadius * sinPhi);
							this._mesh._texCoords[0].push(-a / rings, b / sides);
						}
					}
	
					for (a=0; a<sides; a++)
					{
						for (b=0; b<rings; b++)
						{
							this._mesh._indices[0].push(b * (sides+1) + a);
							this._mesh._indices[0].push(b * (sides+1) + a + 1);
							this._mesh._indices[0].push((b + 1) * (sides+1) + a);
	
							this._mesh._indices[0].push(b * (sides+1) + a + 1);
							this._mesh._indices[0].push((b + 1) * (sides+1) + a + 1);
							this._mesh._indices[0].push((b + 1) * (sides+1) + a);
						}
					}
				
					this._mesh._invalidate = true;
					this._mesh._numFaces = this._mesh._indices[0].length / 3;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
					
					 Array.forEach(this._parentNodes, function (node) {
                        node.setAllDirty();
                    });
				}
            }
        }
    )
);


/* ### Cone ### */
x3dom.registerNodeType(
    "Cone",
    "Geometry3D",
    defineClass(x3dom.nodeTypes.X3DGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.Cone.superClass.call(this, ctx);

            this.addField_SFFloat(ctx, 'bottomRadius', 1.0);
            this.addField_SFFloat(ctx, 'height', 2.0);
            this.addField_SFBool(ctx, 'bottom', true);
			this.addField_SFFloat(ctx, 'subdivision', 32);
            this.addField_SFBool(ctx, 'side', true);
			
			var sides = this._vf.subdivision;

			var geoCacheID = 'Cone_'+this._vf.bottomRadius+'_'+this._vf.height+'_'+this._vf.bottom+'_'+this._vf.side;

			if( x3dom.geoCache[geoCacheID] != undefined )
			{
				x3dom.debug.logInfo("Using Cone from Cache");
				this._mesh = x3dom.geoCache[geoCacheID];
			}
			else
			{
				var bottomRadius = this._vf.bottomRadius, height = this._vf.height;

				var beta, x, z;
				var delta = 2.0 * Math.PI / sides;
				var incl = bottomRadius / height;
				var nlen = 1.0 / Math.sqrt(1.0 + incl * incl);
		
				var j = 0;
        		var k = 0;

				if (this._vf.side)
				{
				  for (j=0, k=0; j<=sides; j++)
				  {
					beta = j * delta;
					x = Math.sin(beta);
					z = -Math.cos(beta);

					this._mesh._positions[0].push(0, height/2, 0);
					this._mesh._normals[0].push(x/nlen, incl/nlen, z/nlen);
					this._mesh._texCoords[0].push(1.0 - j / sides, 1);

					this._mesh._positions[0].push(x * bottomRadius, -height/2, z * bottomRadius);
					this._mesh._normals[0].push(x/nlen, incl/nlen, z/nlen);
					this._mesh._texCoords[0].push(1.0 - j / sides, 0);

					if (j > 0)
					{
						this._mesh._indices[0].push(k + 0);
						this._mesh._indices[0].push(k + 2);
						this._mesh._indices[0].push(k + 1);

						this._mesh._indices[0].push(k + 1);
						this._mesh._indices[0].push(k + 2);
						this._mesh._indices[0].push(k + 3);

						k += 2;
					}
				  }
				}

				if (this._vf.bottom && bottomRadius > 0)
				{
					var base = this._mesh._positions[0].length / 3;

					for (j=sides-1; j>=0; j--)
					{
						beta = j * delta;
						x = bottomRadius * Math.sin(beta);
						z = -bottomRadius * Math.cos(beta);

						this._mesh._positions[0].push(x, -height/2, z);
						this._mesh._normals[0].push(0, -1, 0);
						this._mesh._texCoords[0].push(x / bottomRadius / 2 + 0.5, z / bottomRadius / 2 + 0.5);
					}

					var h = base + 1;

					for (j=2; j<sides; j++)
					{
						this._mesh._indices[0].push(h);
						this._mesh._indices[0].push(base);

						h = base + j;
						this._mesh._indices[0].push(h);
					}
				}

				this._mesh._invalidate = true;
				this._mesh._numFaces = this._mesh._indices[0].length / 3;
				this._mesh._numCoords = this._mesh._positions[0].length / 3;

				x3dom.geoCache[geoCacheID] = this._mesh;
			}
        },
        {
            fieldChanged: function(fieldName) {
                if (fieldName === "bottomRadius" || fieldName === "height") { 
				
                    this._mesh._positions[0] = [];
					
					var bottomRadius = this._vf.bottomRadius, height = this._vf.height;
					var sides = this._vf.subdivision;
					
					var beta, x, z;
					var delta = 2.0 * Math.PI / sides;
					var incl = bottomRadius / height;
					var nlen = 1.0 / Math.sqrt(1.0 + incl * incl);			
	
					if (this._vf.side)
					{
					  for (var j=0; j<=sides; j++)
					  {
						beta = j * delta;
						x = Math.sin(beta);
						z = -Math.cos(beta);
	
						this._mesh._positions[0].push(0, height/2, 0);
						this._mesh._positions[0].push(x * bottomRadius, -height/2, z * bottomRadius);
					  }
						
					}
	
					if (this._vf.bottom && bottomRadius > 0)
					{
						var base = this._mesh._positions[0].length / 3;
	
						for (var j=sides-1; j>=0; j--)
						{
							beta = j * delta;
							x = bottomRadius * Math.sin(beta);
							z = -bottomRadius * Math.cos(beta);
	
							this._mesh._positions[0].push(x, -height/2, z);
						}			
					}
					
					
					this._mesh._invalidate = true;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
				
                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                    });
                } else if (fieldName === "subdivision" || fieldName === "bottom") {
					
					this._mesh._positions[0] = [];
					this._mesh._indices[0] =[];
					this._mesh._normals[0] = [];
					this._mesh._texCoords[0] =[];
					
					var bottomRadius = this._vf.bottomRadius, height = this._vf.height;
					var sides = this._vf.subdivision;
					
					var beta, x, z;
					var delta = 2.0 * Math.PI / sides;
					var incl = bottomRadius / height;
					var nlen = 1.0 / Math.sqrt(1.0 + incl * incl);	
					
					var j = 0;
					var k = 0;
	
					if (this._vf.side)
					{
					  for (j=0, k=0; j<=sides; j++)
					  {
						beta = j * delta;
						x = Math.sin(beta);
						z = -Math.cos(beta);
	
						this._mesh._positions[0].push(0, height/2, 0);
						this._mesh._normals[0].push(x/nlen, incl/nlen, z/nlen);
						this._mesh._texCoords[0].push(1.0 - j / sides, 1);
	
						this._mesh._positions[0].push(x * bottomRadius, -height/2, z * bottomRadius);
						this._mesh._normals[0].push(x/nlen, incl/nlen, z/nlen);
						this._mesh._texCoords[0].push(1.0 - j / sides, 0);
	
						if (j > 0)
						{
							this._mesh._indices[0].push(k + 0);
							this._mesh._indices[0].push(k + 2);
							this._mesh._indices[0].push(k + 1);
	
							this._mesh._indices[0].push(k + 1);
							this._mesh._indices[0].push(k + 2);
							this._mesh._indices[0].push(k + 3);
	
							k += 2;
						}
					  }
					}
	
					if (this._vf.bottom && bottomRadius > 0)
					{
						var base = this._mesh._positions[0].length / 3;
	
						for (j=sides-1; j>=0; j--)
						{
							beta = j * delta;
							x = bottomRadius * Math.sin(beta);
							z = -bottomRadius * Math.cos(beta);
	
							this._mesh._positions[0].push(x, -height/2, z);
							this._mesh._normals[0].push(0, -1, 0);
							this._mesh._texCoords[0].push(x / bottomRadius / 2 + 0.5, z / bottomRadius / 2 + 0.5);
						}
	
						var h = base + 1;
	
						for (j=2; j<sides; j++)
						{
							this._mesh._indices[0].push(h);
							this._mesh._indices[0].push(base);
	
							h = base + j;
							this._mesh._indices[0].push(h);
						}
					}
					
					this._mesh._invalidate = true;
					this._mesh._numFaces = this._mesh._indices[0].length / 3;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
					
					 Array.forEach(this._parentNodes, function (node) {
                        node.setAllDirty();
                    });
				}
            }
        }
    )
);
/* ### Cylinder ### */
x3dom.registerNodeType(
    "Cylinder",
    "Geometry3D",
    defineClass(x3dom.nodeTypes.X3DGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.Cylinder.superClass.call(this, ctx);

            this.addField_SFFloat(ctx, 'radius', 1.0);
            this.addField_SFFloat(ctx, 'height', 2.0);
            this.addField_SFBool(ctx, 'bottom', true);
            this.addField_SFBool(ctx, 'top', true);
			this.addField_SFFloat(ctx, 'subdivision', 32);
            this.addField_SFBool(ctx, 'side', true);
			
			var sides = this._vf.subdivision;

			var geoCacheID = 'Cylinder_'+this._vf.radius+'_'+this._vf.height+'_'+this._vf.bottom+'_'+this._vf.top+'_'+this._vf.side;

			if( x3dom.geoCache[geoCacheID] != undefined )
			{
				x3dom.debug.logInfo("Using Cylinder from Cache");
				this._mesh = x3dom.geoCache[geoCacheID];
			}
			else
			{

				var radius = this._vf.radius;
				var height = this._vf.height;

				var beta, x, z;
				var delta = 2.0 * Math.PI / sides;

				var j = 0;
       			 var k = 0;
				if (this._vf.side)
				{
				  for (j=0, k=0; j<=sides; j++)
				  {
					beta = j * delta;
					x = Math.sin(beta);
					z = -Math.cos(beta);

					this._mesh._positions[0].push(x * radius, -height/2, z * radius);
					this._mesh._normals[0].push(x, 0, z);
					this._mesh._texCoords[0].push(1.0 - j / sides, 0);

					this._mesh._positions[0].push(x * radius, height/2, z * radius);
					this._mesh._normals[0].push(x, 0, z);
					this._mesh._texCoords[0].push(1.0 - j / sides, 1);

					if (j > 0)
					{
						this._mesh._indices[0].push(k + 0);
						this._mesh._indices[0].push(k + 1);
						this._mesh._indices[0].push(k + 2);

						this._mesh._indices[0].push(k + 2);
						this._mesh._indices[0].push(k + 1);
						this._mesh._indices[0].push(k + 3);

						k += 2;
					}
				  }
				}

				if (radius > 0)
				{
					var h, base = this._mesh._positions[0].length / 3;

					if (this._vf.top)
					{
					  for (j=sides-1; j>=0; j--)
					  {
						beta = j * delta;
						x = radius * Math.sin(beta);
						z = -radius * Math.cos(beta);

						this._mesh._positions[0].push(x, height/2, z);
						this._mesh._normals[0].push(0, 1, 0);
						this._mesh._texCoords[0].push(x / radius / 2 + 0.5, -z / radius / 2 + 0.5);
					  }

					  h = base + 1;

					  for (j=2; j<sides; j++)
					  {
						this._mesh._indices[0].push(base);
						this._mesh._indices[0].push(h);

						h = base + j;
						this._mesh._indices[0].push(h);
					  }

					  base = this._mesh._positions[0].length / 3;
					}

					if (this._vf.bottom)
					{
					  for (j=sides-1; j>=0; j--)
					  {
						beta = j * delta;
						x = radius * Math.sin(beta);
						z = -radius * Math.cos(beta);

						this._mesh._positions[0].push(x, -height/2, z);
						this._mesh._normals[0].push(0, -1, 0);
						this._mesh._texCoords[0].push(x / radius / 2 + 0.5, z / radius / 2 + 0.5);
					  }

					  h = base + 1;

					  for (j=2; j<sides; j++)
					  {
						this._mesh._indices[0].push(h);
						this._mesh._indices[0].push(base);

						h = base + j;
						this._mesh._indices[0].push(h);
					  }
					}
				}

				this._mesh._invalidate = true;
				this._mesh._numFaces = this._mesh._indices[0].length / 3;
				this._mesh._numCoords = this._mesh._positions[0].length / 3;

				x3dom.geoCache[geoCacheID] = this._mesh;
			}
         },
        {
            fieldChanged: function(fieldName) {
                if (fieldName === "radius" || fieldName === "height") { 
				
                    this._mesh._positions[0] = [];
					
					var radius = this._vf.radius, height = this._vf.height;
					var sides = this._vf.subdivision;	
					
					var beta, x, z;
					var delta = 2.0 * Math.PI / sides;
	
					var j = 0;
					if (this._vf.side)
					{
					  for (j=0; j<=sides; j++)
					  {
						beta = j * delta;
						x = Math.sin(beta);
						z = -Math.cos(beta);
	
						this._mesh._positions[0].push(x * radius, -height/2, z * radius);
						this._mesh._positions[0].push(x * radius, height/2, z * radius);	
					  }
					}
	
					if (radius > 0)
					{
						var h, base = this._mesh._positions[0].length / 3;
	
						if (this._vf.top)
						{
						  for (j=sides-1; j>=0; j--)
						  {
							beta = j * delta;
							x = radius * Math.sin(beta);
							z = -radius * Math.cos(beta);
	
							this._mesh._positions[0].push(x, height/2, z);							
						  }
						}
					}
	
						if (this._vf.bottom)
						{
						  for (j=sides-1; j>=0; j--)
						  {
							beta = j * delta;
							x = radius * Math.sin(beta);
							z = -radius * Math.cos(beta);
	
							this._mesh._positions[0].push(x, -height/2, z);
						  }
					}
				
					this._mesh._invalidate = true;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
				
                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                    });
                } else if (fieldName === "subdivision" || fieldName === "bottom" || fieldName === "top") {
					
					this._mesh._positions[0] = [];
					this._mesh._indices[0] =[];
					this._mesh._normals[0] = [];
					this._mesh._texCoords[0] =[];
					
					var radius = this._vf.radius, height = this._vf.height;
					var sides = this._vf.subdivision;
					
					var beta, x, z;
					var delta = 2.0 * Math.PI / sides;

					var j = 0;
					 var k = 0;
					if (this._vf.side)
					{
					  for (j=0, k=0; j<=sides; j++)
					  {
						beta = j * delta;
						x = Math.sin(beta);
						z = -Math.cos(beta);
	
						this._mesh._positions[0].push(x * radius, -height/2, z * radius);
						this._mesh._normals[0].push(x, 0, z);
						this._mesh._texCoords[0].push(1.0 - j / sides, 0);
	
						this._mesh._positions[0].push(x * radius, height/2, z * radius);
						this._mesh._normals[0].push(x, 0, z);
						this._mesh._texCoords[0].push(1.0 - j / sides, 1);
	
						if (j > 0)
						{
							this._mesh._indices[0].push(k + 0);
							this._mesh._indices[0].push(k + 1);
							this._mesh._indices[0].push(k + 2);
	
							this._mesh._indices[0].push(k + 2);
							this._mesh._indices[0].push(k + 1);
							this._mesh._indices[0].push(k + 3);
	
							k += 2;
						}
					  }
					}
	
					if (radius > 0)
					{
						var h, base = this._mesh._positions[0].length / 3;
	
						if (this._vf.top)
						{
						  for (j=sides-1; j>=0; j--)
						  {
							beta = j * delta;
							x = radius * Math.sin(beta);
							z = -radius * Math.cos(beta);
	
							this._mesh._positions[0].push(x, height/2, z);
							this._mesh._normals[0].push(0, 1, 0);
							this._mesh._texCoords[0].push(x / radius / 2 + 0.5, -z / radius / 2 + 0.5);
						  }
	
						  h = base + 1;
	
						  for (j=2; j<sides; j++)
						  {
							this._mesh._indices[0].push(base);
							this._mesh._indices[0].push(h);
	
							h = base + j;
							this._mesh._indices[0].push(h);
						  }
	
						  base = this._mesh._positions[0].length / 3;
						}
	
						if (this._vf.bottom)
						{
						  for (j=sides-1; j>=0; j--)
						  {
							beta = j * delta;
							x = radius * Math.sin(beta);
							z = -radius * Math.cos(beta);
	
							this._mesh._positions[0].push(x, -height/2, z);
							this._mesh._normals[0].push(0, -1, 0);
							this._mesh._texCoords[0].push(x / radius / 2 + 0.5, z / radius / 2 + 0.5);
						  }
	
						  h = base + 1;
	
						  for (j=2; j<sides; j++)
						  {
							this._mesh._indices[0].push(h);
							this._mesh._indices[0].push(base);
	
							h = base + j;
							this._mesh._indices[0].push(h);
						  }
						}
					}
						
					this._mesh._invalidate = true;
					this._mesh._numFaces = this._mesh._indices[0].length / 3;
					this._mesh._numCoords = this._mesh._positions[0].length / 3;
					
					 Array.forEach(this._parentNodes, function (node) {
                        node.setAllDirty();
                    });
				}
            }
        }
    )
);
/* ### GeometryImage ### */
x3dom.registerNodeType(
    "ImageGeometry",
    "Geometry3D",
    defineClass(x3dom.nodeTypes.X3DGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.ImageGeometry.superClass.call(this, ctx);
			
			this.addField_SFVec3f(ctx, 'position', 0, 0, 0);
			this.addField_SFVec3f(ctx, 'size', 0, 0, 0);
			this.addField_SFFloat(ctx, 'vertexCount', 0);
			this.addField_SFString(ctx, 'primType', 'TRIANGLES');
			this.addField_SFFloat(ctx, 'numColorComponents', 3);
			
			this.addField_SFNode('index', x3dom.nodeTypes.X3DTextureNode);
			this.addField_MFNode('coord', x3dom.nodeTypes.X3DTextureNode);
			this.addField_MFNode('normal', x3dom.nodeTypes.X3DTextureNode);
			this.addField_SFNode('texCoord', x3dom.nodeTypes.X3DTextureNode);
			this.addField_SFNode('color', x3dom.nodeTypes.X3DTextureNode);
			
			this._mesh._numColComponents = this._vf.numColorComponents;
			
			//TODO check if GPU-Version is supported (Flash, etc.)
			//Dummy mesh generation only need for GPU-Version
			
			var geoCacheID = 'ImageGeometry';

			if( x3dom.geoCache[geoCacheID] != undefined )
			{
				x3dom.debug.logInfo("Using ImageGeometry-Mesh from Cache");
				this._mesh = x3dom.geoCache[geoCacheID];
			}
			else
			{
				for(var y=0; y<256; y++)
				{
					for(var x=0; x<256; x++)
					{
						var idx = y * 256 + x;
						
						if(idx == 65535) break;
						
						this._mesh._positions[0].push(x/256, y/256, 0);
						this._mesh._indices[0].push(y*256+x);
					}
				}
				
				this._mesh._invalidate = true;
				this._mesh._numFaces = this._mesh._indices[0].length / 3;
				this._mesh._numCoords = this._mesh._positions[0].length / 3;

				x3dom.geoCache[geoCacheID] = this._mesh;
			}
		},
		{
			nodeChanged: function()
            {
				Array.forEach(this._parentNodes, function (node) {
                    node._dirty.positions = true;
					node._dirty.normals = true;
					node._dirty.texcoords = true;
				});
			},
			
			getMin: function()
			{
				return this._vf.position.subtract( this._vf.size.multiply(0.5) );
			},
			
			getMax: function()
			{
				return this._vf.position.add( this._vf.size.multiply(0.5) );
			},
			
			getVolume: function(min, max, invalidate)
			{
				min.setValues(this.getMin());
				max.setValues(this.getMax());
				
				return true;
			},
			
			getCenter: function()
			{
				return this._vf.position;
			},
			
			numCoordinateTextures: function()
			{
				return this._cf.coord.nodes.length;
			},
			
			getIndexTexture: function()
            {
                if(this._cf.index.node) {
                    return this._cf.index.node;
                } else {
                    return null;
                }
            },
			
			getIndexTextureURL: function()
            {
                if(this._cf.index.node) {
                    return this._cf.index.node._vf.url;
                } else {
                    return null;
                }
            },
			
			getCoordinateTexture: function(pos)
            {
                if(this._cf.coord.nodes[pos]) {
                    return this._cf.coord.nodes[pos];
                } else {
                    return null;
                }
            },
			
			getCoordinateTextureURL: function(pos)
            {
                if(this._cf.coord.nodes[pos]) {
                    return this._cf.coord.nodes[pos]._vf.url;
                } else {
                    return null;
                }
            },

            getNormalTexture: function(pos)
            {
                if(this._cf.normal.nodes[pos]) {
                    return this._cf.normal.nodes[pos];
                } else {
                    return null;
                }
            },
			
			getNormalTextureURL: function(pos)
            {
                if(this._cf.normal.nodes[pos]) {
                    return this._cf.normal.nodes[pos]._vf.url;
                } else {
                    return null;
                }
            },

            getTexCoordTexture: function()
            {
                if(this._cf.texCoord.node) {
                    return this._cf.texCoord.node;
                } else {
                    return null;
                }
            },
			
			getTexCoordTextureURL: function()
            {
                if(this._cf.texCoord.node) {
                    return this._cf.texCoord.node._vf.url;
                } else {
                    return null;
                }
            },
			
			getColorTexture: function()
            {
                if(this._cf.color.node) {
                    return this._cf.color.node;
                } else {
                    return null;
                }
            },
			
			getColorTextureURL: function()
            {
                if(this._cf.color.node) {
                    return this._cf.color.node._vf.url;
                } else {
                    return null;
                }
            }
		}
	)
);

/* ### IndexedFaceSet ### */
x3dom.registerNodeType(
    "IndexedFaceSet",
    "Geometry3D",
    defineClass(x3dom.nodeTypes.X3DComposedGeometryNode,
        function (ctx) {
            x3dom.nodeTypes.IndexedFaceSet.superClass.call(this, ctx);

            this.addField_SFFloat(ctx, 'creaseAngle', 0);   // TODO

            this.addField_MFInt32(ctx, 'coordIndex', []);
            this.addField_MFInt32(ctx, 'normalIndex', []);
            this.addField_MFInt32(ctx, 'colorIndex', []);
            this.addField_MFInt32(ctx, 'texCoordIndex', []);
        },
        {
            nodeChanged: function()
            {
                var time0 = new Date().getTime();

                this.handleAttribs();

                var indexes = this._vf.coordIndex;
                var normalInd = this._vf.normalIndex;
                var texCoordInd = this._vf.texCoordIndex;
                var colorInd = this._vf.colorIndex;

                var hasNormal = false, hasNormalInd = false;
                var hasTexCoord = false, hasTexCoordInd = false;
                var hasColor = false, hasColorInd = false;

                var colPerVert = this._vf.colorPerVertex;
                var normPerVert = this._vf.normalPerVertex;

                if (normalInd.length > 0)
                {
                    hasNormalInd = true;
                }
                if (texCoordInd.length > 0)
                {
                    hasTexCoordInd = true;
                }
                if (colorInd.length > 0)
                {
                    hasColorInd = true;
                }

                var positions, normals, texCoords, colors;

                var coordNode = this._cf.coord.node;
                x3dom.debug.assert(coordNode);
                positions = coordNode.getPoints();

                var normalNode = this._cf.normal.node;
                if (normalNode)
                {
                    hasNormal = true;
                    normals = normalNode._vf.vector;
                }
                else {
                    hasNormal = false;
                }

                var texMode = "", numTexComponents = 2;
                var texCoordNode = this._cf.texCoord.node;
                if (texCoordNode)
                {
                    if (texCoordNode._vf.point) {
                        hasTexCoord = true;
                        texCoords = texCoordNode._vf.point;

                        if (x3dom.isa(texCoordNode, x3dom.nodeTypes.TextureCoordinate3D)) {
                            numTexComponents = 3;
                        }
                    }
                    else if (texCoordNode._vf.mode) {
                        texMode = texCoordNode._vf.mode;
                    }
                }
                else {
                    hasTexCoord = false;
                }
                this._mesh._numTexComponents = numTexComponents;

                var numColComponents = 3;
                var colorNode = this._cf.color.node;
                if (colorNode)
                {
                    hasColor = true;
                    colors = colorNode._vf.color;

                    if (x3dom.isa(colorNode, x3dom.nodeTypes.ColorRGBA)) {
                        numColComponents = 4;
                    }
                }
                else {
                    hasColor = false;
                }
                this._mesh._numColComponents = numColComponents;

                this._mesh._indices[0] = [];
                this._mesh._positions[0] = [];
                this._mesh._normals[0] = [];
                this._mesh._texCoords[0] = [];
                this._mesh._colors[0] = [];
                
                var i, t, cnt, faceCnt;
                var p0, p1, p2, n0, n1, n2, t0, t1, t2, c0, c1, c2;

                if ( (this._vf.creaseAngle <= x3dom.fields.Eps) ||  // FIXME; what to do for ipols?
                     (positions.length / 3 > 65535) ||
                     (hasNormal && hasNormalInd) ||
                     (hasTexCoord && hasTexCoordInd) ||
                     (hasColor && hasColorInd) )
                {
                    // Found MultiIndex Mesh
                    t = 0;
                    cnt = 0;
                    faceCnt = 0;
                    this._mesh._multiIndIndices = [];
                    this._mesh._posSize = positions.length;

                    for (i=0; i < indexes.length; ++i)
                    {
                        // Convert non-triangular polygons to a triangle fan
                        // (TODO: this assumes polygons are convex)
                        if (indexes[i] == -1) {
                            t = 0;
                            faceCnt++;
                            continue;
                        }

                        if (hasNormalInd) {
                            x3dom.debug.assert(normalInd[i] != -1);
                        }
                        if (hasTexCoordInd) {
                            x3dom.debug.assert(texCoordInd[i] != -1);
                        }
                        if (hasColorInd) {
                            x3dom.debug.assert(colorInd[i] != -1);
                        }

                        //TODO: OPTIMIZE but think about cache coherence regarding arrays!!!
                        switch (t)
                        {
                            case 0:
                                p0 = +indexes[i];
                                if (hasNormalInd && normPerVert) { n0 = +normalInd[i]; }
                                else if (hasNormalInd && !normPerVert) { n0 = +normalInd[faceCnt]; }
                                else { n0 = p0; }
                                if (hasTexCoordInd) { t0 = +texCoordInd[i]; }
                                else { t0 = p0; }
                                if (hasColorInd && colPerVert) { c0 = +colorInd[i]; }
                                else if (hasColorInd && !colPerVert) { c0 = +colorInd[faceCnt]; }
                                else { c0 = p0; }
                                t = 1;
                            break;
                            case 1:
                                p1 = +indexes[i];
                                if (hasNormalInd && normPerVert) { n1 = +normalInd[i]; }
                                else if (hasNormalInd && !normPerVert) { n1 = +normalInd[faceCnt]; }
                                else { n1 = p1; }
                                if (hasTexCoordInd) { t1 = +texCoordInd[i]; }
                                else { t1 = p1; }
                                if (hasColorInd && colPerVert) { c1 = +colorInd[i]; }
                                else if (hasColorInd && !colPerVert) { c1 = +colorInd[faceCnt]; }
                                else { c1 = p1; }
                                t = 2;
                            break;
                            case 2:
                                p2 = +indexes[i];
                                if (hasNormalInd && normPerVert) { n2 = +normalInd[i]; }
                                else if (hasNormalInd && !normPerVert) { n2 = +normalInd[faceCnt]; }
                                else { n2 = p2; }
                                if (hasTexCoordInd) { t2 = +texCoordInd[i]; }
                                else { t2 = p2; }
                                if (hasColorInd && colPerVert) { c2 = +colorInd[i]; }
                                else if (hasColorInd && !colPerVert) { c2 = +colorInd[faceCnt]; }
                                else { c2 = p2; }
                                t = 3;

                                this._mesh._indices[0].push(cnt++, cnt++, cnt++);

                                this._mesh._positions[0].push(positions[p0].x);
                                this._mesh._positions[0].push(positions[p0].y);
                                this._mesh._positions[0].push(positions[p0].z);
                                this._mesh._positions[0].push(positions[p1].x);
                                this._mesh._positions[0].push(positions[p1].y);
                                this._mesh._positions[0].push(positions[p1].z);
                                this._mesh._positions[0].push(positions[p2].x);
                                this._mesh._positions[0].push(positions[p2].y);
                                this._mesh._positions[0].push(positions[p2].z);

                                if (hasNormal) {
                                    this._mesh._normals[0].push(normals[n0].x);
                                    this._mesh._normals[0].push(normals[n0].y);
                                    this._mesh._normals[0].push(normals[n0].z);
                                    this._mesh._normals[0].push(normals[n1].x);
                                    this._mesh._normals[0].push(normals[n1].y);
                                    this._mesh._normals[0].push(normals[n1].z);
                                    this._mesh._normals[0].push(normals[n2].x);
                                    this._mesh._normals[0].push(normals[n2].y);
                                    this._mesh._normals[0].push(normals[n2].z);
                                }
                                else {
                                    this._mesh._multiIndIndices.push(p0, p1, p2);
                                    //this._mesh._multiIndIndices.push(cnt-3, cnt-2, cnt-1);
                                }

                                if (hasColor) {
                                    this._mesh._colors[0].push(colors[c0].r);
                                    this._mesh._colors[0].push(colors[c0].g);
                                    this._mesh._colors[0].push(colors[c0].b);
                                    if (numColComponents === 4) {
                                        this._mesh._colors[0].push(colors[c0].a);
                                    }
                                    this._mesh._colors[0].push(colors[c1].r);
                                    this._mesh._colors[0].push(colors[c1].g);
                                    this._mesh._colors[0].push(colors[c1].b);
                                    if (numColComponents === 4) {
                                        this._mesh._colors[0].push(colors[c1].a);
                                    }
                                    this._mesh._colors[0].push(colors[c2].r);
                                    this._mesh._colors[0].push(colors[c2].g);
                                    this._mesh._colors[0].push(colors[c2].b);
                                    if (numColComponents === 4) {
                                        this._mesh._colors[0].push(colors[c2].a);
                                    }
                                }

                                if (hasTexCoord) {
                                    this._mesh._texCoords[0].push(texCoords[t0].x);
                                    this._mesh._texCoords[0].push(texCoords[t0].y);
                                    if (numTexComponents === 3) {
                                        this._mesh._texCoords[0].push(texCoords[t0].z);
                                    }
                                    this._mesh._texCoords[0].push(texCoords[t1].x);
                                    this._mesh._texCoords[0].push(texCoords[t1].y);
                                    if (numTexComponents === 3) {
                                        this._mesh._texCoords[0].push(texCoords[t1].z);
                                    }
                                    this._mesh._texCoords[0].push(texCoords[t2].x);
                                    this._mesh._texCoords[0].push(texCoords[t2].y);
                                    if (numTexComponents === 3) {
                                        this._mesh._texCoords[0].push(texCoords[t2].z);
                                    }
                                }

                                //faceCnt++;
                            break;
                            case 3:
                                p1 = p2;
                                t1 = t2;
                                if (normPerVert) {
                                    n1 = n2;
                                }
                                if (colPerVert) {
                                    c1 = c2;
                                }
                                p2 = +indexes[i];

                                if (hasNormalInd && normPerVert) {
                                    n2 = +normalInd[i];
                                } else if (hasNormalInd && !normPerVert) {
                                    /*n2 = +normalInd[faceCnt];*/
                                } else {
                                    n2 = p2;
                                }

                                if (hasTexCoordInd) {
                                    t2 = +texCoordInd[i];
                                } else {
                                    t2 = p2;
                                }

                                if (hasColorInd && colPerVert) {
                                    c2 = +colorInd[i];
                                } else if (hasColorInd && !colPerVert) {
                                    /*c2 = +colorInd[faceCnt];*/
                                } else {
                                    c2 = p2;
                                }

                                this._mesh._indices[0].push(cnt++, cnt++, cnt++);

                                this._mesh._positions[0].push(positions[p0].x);
                                this._mesh._positions[0].push(positions[p0].y);
                                this._mesh._positions[0].push(positions[p0].z);
                                this._mesh._positions[0].push(positions[p1].x);
                                this._mesh._positions[0].push(positions[p1].y);
                                this._mesh._positions[0].push(positions[p1].z);
                                this._mesh._positions[0].push(positions[p2].x);
                                this._mesh._positions[0].push(positions[p2].y);
                                this._mesh._positions[0].push(positions[p2].z);

                                if (hasNormal) {
                                    this._mesh._normals[0].push(normals[n0].x);
                                    this._mesh._normals[0].push(normals[n0].y);
                                    this._mesh._normals[0].push(normals[n0].z);
                                    this._mesh._normals[0].push(normals[n1].x);
                                    this._mesh._normals[0].push(normals[n1].y);
                                    this._mesh._normals[0].push(normals[n1].z);
                                    this._mesh._normals[0].push(normals[n2].x);
                                    this._mesh._normals[0].push(normals[n2].y);
                                    this._mesh._normals[0].push(normals[n2].z);
                                }
                                else {
                                    this._mesh._multiIndIndices.push(p0, p1, p2);
                                    //this._mesh._multiIndIndices.push(cnt-3, cnt-2, cnt-1);
                                }

                                if (hasColor) {
                                    this._mesh._colors[0].push(colors[c0].r);
                                    this._mesh._colors[0].push(colors[c0].g);
                                    this._mesh._colors[0].push(colors[c0].b);
                                    if (numColComponents === 4) {
                                        this._mesh._colors[0].push(colors[c0].a);
                                    }
                                    this._mesh._colors[0].push(colors[c1].r);
                                    this._mesh._colors[0].push(colors[c1].g);
                                    this._mesh._colors[0].push(colors[c1].b);
                                    if (numColComponents === 4) {
                                        this._mesh._colors[0].push(colors[c1].a);
                                    }
                                    this._mesh._colors[0].push(colors[c2].r);
                                    this._mesh._colors[0].push(colors[c2].g);
                                    this._mesh._colors[0].push(colors[c2].b);
                                    if (numColComponents === 4) {
                                        this._mesh._colors[0].push(colors[c2].a);
                                    }
                                }

                                if (hasTexCoord) {
                                    this._mesh._texCoords[0].push(texCoords[t0].x);
                                    this._mesh._texCoords[0].push(texCoords[t0].y);
                                    if (numTexComponents === 3) {
                                        this._mesh._texCoords[0].push(texCoords[t0].z);
                                    }
                                    this._mesh._texCoords[0].push(texCoords[t1].x);
                                    this._mesh._texCoords[0].push(texCoords[t1].y);
                                    if (numTexComponents === 3) {
                                        this._mesh._texCoords[0].push(texCoords[t1].z);
                                    }
                                    this._mesh._texCoords[0].push(texCoords[t2].x);
                                    this._mesh._texCoords[0].push(texCoords[t2].y);
                                    if (numTexComponents === 3) {
                                        this._mesh._texCoords[0].push(texCoords[t2].z);
                                    }
                                }

                                //faceCnt++;
                            break;
                            default:
                        }
                    }

                    if (!hasNormal) {
                        this._mesh.calcNormals(this._vf.creaseAngle);
                    }
                    if (!hasTexCoord) {
                        this._mesh.calcTexCoords(texMode);
                    }

                    this._mesh.splitMesh();

                    //x3dom.debug.logInfo(this._mesh._indices.length);
                } // if isMulti
                else
                {
                    t = 0;
                    
                    for (i = 0; i < indexes.length; ++i)
                    {
                        // Convert non-triangular polygons to a triangle fan
                        // (TODO: this assumes polygons are convex)
                        if (indexes[i] == -1) {
                            t = 0;
                            continue;
                        }

                        switch (t) {
                        case 0: n0 = +indexes[i]; t = 1; break;
                        case 1: n1 = +indexes[i]; t = 2; break;
                        case 2: n2 = +indexes[i]; t = 3; this._mesh._indices[0].push(n0, n1, n2); break;
                        case 3: n1 = n2; n2 = +indexes[i]; this._mesh._indices[0].push(n0, n1, n2); break;
                        }
                    }

                    this._mesh._positions[0] = positions.toGL();

                    if (hasNormal) {
                        this._mesh._normals[0] = normals.toGL();
                    }
                    else {
                        this._mesh.calcNormals(this._vf.creaseAngle);
                    }
                    if (hasTexCoord) {
                        this._mesh._texCoords[0] = texCoords.toGL();
                        this._mesh._numTexComponents = numTexComponents;
                    }
                    else {
                        this._mesh.calcTexCoords(texMode);
                    }
                    if (hasColor) {
                        this._mesh._colors[0] = colors.toGL();
                        this._mesh._numColComponents = numColComponents;
                    }
                }

                this._mesh._invalidate = true;
                this._mesh._numFaces = 0;
                this._mesh._numCoords = 0;
                for (i=0; i<this._mesh._indices.length; i++) {
                    this._mesh._numFaces += this._mesh._indices[i].length / 3;
                    this._mesh._numCoords += this._mesh._positions[i].length / 3;
                }

                var time1 = new Date().getTime() - time0;
                //x3dom.debug.logInfo("Mesh load time: " + time1 + " ms");
            },

            fieldChanged: function(fieldName)
            {
                var pnts = this._cf.coord.node._vf.point;
                var i, n = pnts.length;

                if ((this._vf.creaseAngle <= x3dom.fields.Eps) || (n / 3 > 65535) ||
                    (this._vf.normalIndex.length > 0 && this._cf.normal.node) ||
                    (this._vf.texCoordIndex.length > 0 && this._cf.texCoord.node) ||
                    (this._vf.colorIndex.length > 0 && this._cf.color.node))
                {
                    // TODO; FIXME
                    x3dom.debug.logWarning("Ipol with creaseAngle == 0, too many coords, or multi-index!");

                    /** HACK */
                    this.nodeChanged();

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                    });
                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.colors = true;
                    });

                    return;
                }

                if (fieldName == "coord")
                {
                    // TODO; multi-index with different this._mesh._indices
                    pnts = this._cf.coord.node._vf.point;
                    n = pnts.length;

                    this._mesh._positions[0] = [];

                    // TODO; optimize (is there a memcopy?)
                    for (i=0; i<n; i++)
                    {
                        this._mesh._positions[0].push(pnts[i].x);
                        this._mesh._positions[0].push(pnts[i].y);
                        this._mesh._positions[0].push(pnts[i].z);
                    }

                    this._mesh._invalidate = true;

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.positions = true;
                    });
                }
                else if (fieldName == "color")
                {
                    pnts = this._cf.color.node._vf.color;
                    n = pnts.length;

                    this._mesh._colors[0] = [];

                    for (i=0; i<n; i++)
                    {
                        this._mesh._colors[0].push(pnts[i].r);
                        this._mesh._colors[0].push(pnts[i].g);
                        this._mesh._colors[0].push(pnts[i].b);
                    }

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.colors = true;
                    });
                }
				else if (fieldName == "normal")
                {
                    pnts = this._cf.color.node._vf.normal;
                    n = pnts.length;

                    this._mesh._normal[0] = [];

                    for (i=0; i<n; i++)
                    {
                        this._mesh._normal[0].push(pnts[i].x);
                        this._mesh._normal[0].push(pnts[i].y);
                        this._mesh._normal[0].push(pnts[i].z);
                    }
					
					this._mesh._invalidate = true;

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.normal = true;
                    });
                }
				else if (fieldName == "texCoord")
                {
                    pnts = this._cf.color.node._vf.texCoord;
                    n = pnts.length;

                    this._mesh._texCoords[0] = [];

                    for (i=0; i<n; i++)
                    {
                        this._mesh._texCoords[0].push(pnts[i].x);
                        this._mesh._texCoords[0].push(pnts[i].y);
                    }
					
					this._mesh._invalidate = true;

                    Array.forEach(this._parentNodes, function (node) {
                        node._dirty.texCoords = true;
                    });
                }
            }
        }
    )
);
