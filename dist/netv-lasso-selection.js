(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./netv-lasso-selection.js":
/*!*********************************!*\
  !*** ./netv-lasso-selection.js ***!
  \*********************************/
/*! namespace exports */
/*! export Lasso [provided] [maybe used in main (runtime-defined)] [usage prevents renaming] */
/*! other exports [not provided] [maybe used in main (runtime-defined)] */
/*! runtime requirements: __webpack_require__, __webpack_require__.n, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Lasso": () => /* binding */ Lasso
/* harmony export */ });
/* harmony import */ var robust_point_in_polygon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! robust-point-in-polygon */ "./node_modules/robust-point-in-polygon/robust-pnp.js");
/* harmony import */ var robust_point_in_polygon__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(robust_point_in_polygon__WEBPACK_IMPORTED_MODULE_0__);
;

class Lasso {
    constructor(netv, configs) {
        this.$_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        this.$_core = netv
        netv.$_container.prepend(this.$_svg)
        this.$_svg.setAttribute('width', netv.$_configs.width)
        this.$_svg.setAttribute('height', netv.$_configs.height)
        netv.$_container.style.position = 'relative'
        netv.$_container.style.overflow = 'hidden'
        netv.$_container.style.width = netv.$_configs.width
        netv.$_container.style.height = netv.$_configs.height
        this.$_svg.style.position = 'absolute'
        this.$_svg.style.overflow = 'visible'
        this.$_svg.style.pointerEvents = 'none' // initially disabled

        this._width = netv.$_configs.width
        this._height = netv.$_configs.height
        this._closeDistance = 100

        this._pathPoints = []
        this._selectedItems = []

        this._selectedCallback = null

        this.$_svg.addEventListener('mousedown', this._onMouseDown.bind(this))
        this.$_svg.addEventListener('mousemove', this._onMouseMove.bind(this))
        this.$_svg.addEventListener('mouseup', this._onMouseUp.bind(this))

        // check config to decide enable it or not
        if (configs && configs.enable === true) {
            this.enable()
        }
    }

    enable() {
        this.$_svg.style.pointerEvents = 'visible'
    }

    disable() {
        this.$_svg.style.pointerEvents = 'none'
    }

    closeDistance(distance) {
        this._closeDistance = distance
    }

    onSelected(callback) {
        this._selectedCallback = callback
    }

    _onMouseDown(evt) {
        this._selecting = true
        this._path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this._path.setAttribute('fill', 'rgba(200, 200, 200, 0.2)'); // TODO: fill
        this._path.setAttribute('stroke', 'black');
        this._path.setAttribute('stroke-width', 2);
        this._path.setAttribute('stroke-linejoin', 'round');
        this._path.setAttribute('stroke-linecap', 'round');
        this.$_svg.appendChild(this._path);

        const x = evt.offsetX
        const y = evt.offsetY
        this._pathPoints = [[x, y]]
        this._pathD = `M${x},${y}L${x},${y}`
        this._path.setAttribute('d', this._pathD);
    }

    _onMouseMove(evt) {
        if (!this._selecting) return
        // TODO: need smooth
        const x = evt.offsetX
        const y = evt.offsetY
        this._pathPoints.push([x, y])
        this._pathD += ` ${x},${y}`
        this._path.setAttribute('d', this._pathD);
    }

    _onMouseUp(evt) {
        this._path.remove()
        this._getSelectedItems()
        this._selectedCallback && this._selectedCallback(this._selectedItems)
    }

    _getSelectedItems() {
        const start = this._pathPoints[0]
        const end = this._pathPoints[this._pathPoints.length - 1]
        const distanceSqare = (start[0] - end[0]) ** 2 + (start[1] - end[1]) ** 2
        if (distanceSqare > this._closeDistance * this._closeDistance) {
            this._selectedItems = []
            return
        }

        const items = this.$_core.nodes()
        const dataTransform = this.$_core.transform()
        // TODO: consider on border condition
        this._selectedItems = items.filter(item => {
            const x = item.x() * dataTransform.k + dataTransform.x
            const y = item.y() * dataTransform.k + dataTransform.y
            return (robust_point_in_polygon__WEBPACK_IMPORTED_MODULE_0___default()(this._pathPoints, [x, y]) < 0)
        })
    }
}

/***/ }),

/***/ "./node_modules/robust-orientation/orientation.js":
/*!********************************************************!*\
  !*** ./node_modules/robust-orientation/orientation.js ***!
  \********************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 184:2-16 */
/*! CommonJS bailout: module.exports is used directly at 186:4-18 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var twoProduct = __webpack_require__(/*! two-product */ "./node_modules/two-product/two-product.js")
var robustSum = __webpack_require__(/*! robust-sum */ "./node_modules/robust-sum/robust-sum.js")
var robustScale = __webpack_require__(/*! robust-scale */ "./node_modules/robust-scale/robust-scale.js")
var robustSubtract = __webpack_require__(/*! robust-subtract */ "./node_modules/robust-subtract/robust-diff.js")

var NUM_EXPAND = 5

var EPSILON     = 1.1102230246251565e-16
var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON
var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON

function cofactor(m, c) {
  var result = new Array(m.length-1)
  for(var i=1; i<m.length; ++i) {
    var r = result[i-1] = new Array(m.length-1)
    for(var j=0,k=0; j<m.length; ++j) {
      if(j === c) {
        continue
      }
      r[k++] = m[i][j]
    }
  }
  return result
}

function matrix(n) {
  var result = new Array(n)
  for(var i=0; i<n; ++i) {
    result[i] = new Array(n)
    for(var j=0; j<n; ++j) {
      result[i][j] = ["m", j, "[", (n-i-1), "]"].join("")
    }
  }
  return result
}

function sign(n) {
  if(n & 1) {
    return "-"
  }
  return ""
}

function generateSum(expr) {
  if(expr.length === 1) {
    return expr[0]
  } else if(expr.length === 2) {
    return ["sum(", expr[0], ",", expr[1], ")"].join("")
  } else {
    var m = expr.length>>1
    return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
  }
}

function determinant(m) {
  if(m.length === 2) {
    return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
  } else {
    var expr = []
    for(var i=0; i<m.length; ++i) {
      expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""))
    }
    return expr
  }
}

function orientation(n) {
  var pos = []
  var neg = []
  var m = matrix(n)
  var args = []
  for(var i=0; i<n; ++i) {
    if((i&1)===0) {
      pos.push.apply(pos, determinant(cofactor(m, i)))
    } else {
      neg.push.apply(neg, determinant(cofactor(m, i)))
    }
    args.push("m" + i)
  }
  var posExpr = generateSum(pos)
  var negExpr = generateSum(neg)
  var funcName = "orientation" + n + "Exact"
  var code = ["function ", funcName, "(", args.join(), "){var p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("")
  var proc = new Function("sum", "prod", "scale", "sub", code)
  return proc(robustSum, twoProduct, robustScale, robustSubtract)
}

var orientation3Exact = orientation(3)
var orientation4Exact = orientation(4)

var CACHED = [
  function orientation0() { return 0 },
  function orientation1() { return 0 },
  function orientation2(a, b) { 
    return b[0] - a[0]
  },
  function orientation3(a, b, c) {
    var l = (a[1] - c[1]) * (b[0] - c[0])
    var r = (a[0] - c[0]) * (b[1] - c[1])
    var det = l - r
    var s
    if(l > 0) {
      if(r <= 0) {
        return det
      } else {
        s = l + r
      }
    } else if(l < 0) {
      if(r >= 0) {
        return det
      } else {
        s = -(l + r)
      }
    } else {
      return det
    }
    var tol = ERRBOUND3 * s
    if(det >= tol || det <= -tol) {
      return det
    }
    return orientation3Exact(a, b, c)
  },
  function orientation4(a,b,c,d) {
    var adx = a[0] - d[0]
    var bdx = b[0] - d[0]
    var cdx = c[0] - d[0]
    var ady = a[1] - d[1]
    var bdy = b[1] - d[1]
    var cdy = c[1] - d[1]
    var adz = a[2] - d[2]
    var bdz = b[2] - d[2]
    var cdz = c[2] - d[2]
    var bdxcdy = bdx * cdy
    var cdxbdy = cdx * bdy
    var cdxady = cdx * ady
    var adxcdy = adx * cdy
    var adxbdy = adx * bdy
    var bdxady = bdx * ady
    var det = adz * (bdxcdy - cdxbdy) 
            + bdz * (cdxady - adxcdy)
            + cdz * (adxbdy - bdxady)
    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz)
    var tol = ERRBOUND4 * permanent
    if ((det > tol) || (-det > tol)) {
      return det
    }
    return orientation4Exact(a,b,c,d)
  }
]

function slowOrient(args) {
  var proc = CACHED[args.length]
  if(!proc) {
    proc = CACHED[args.length] = orientation(args.length)
  }
  return proc.apply(undefined, args)
}

function generateOrientationProc() {
  while(CACHED.length <= NUM_EXPAND) {
    CACHED.push(orientation(CACHED.length))
  }
  var args = []
  var procArgs = ["slow"]
  for(var i=0; i<=NUM_EXPAND; ++i) {
    args.push("a" + i)
    procArgs.push("o" + i)
  }
  var code = [
    "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
  ]
  for(var i=2; i<=NUM_EXPAND; ++i) {
    code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");")
  }
  code.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation")
  procArgs.push(code.join(""))

  var proc = Function.apply(undefined, procArgs)
  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED))
  for(var i=0; i<=NUM_EXPAND; ++i) {
    module.exports[i] = CACHED[i]
  }
}

generateOrientationProc()

/***/ }),

/***/ "./node_modules/robust-point-in-polygon/robust-pnp.js":
/*!************************************************************!*\
  !*** ./node_modules/robust-point-in-polygon/robust-pnp.js ***!
  \************************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 1:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = robustPointInPolygon

var orient = __webpack_require__(/*! robust-orientation */ "./node_modules/robust-orientation/orientation.js")

function robustPointInPolygon(vs, point) {
  var x = point[0]
  var y = point[1]
  var n = vs.length
  var inside = 1
  var lim = n
  for(var i = 0, j = n-1; i<lim; j=i++) {
    var a = vs[i]
    var b = vs[j]
    var yi = a[1]
    var yj = b[1]
    if(yj < yi) {
      if(yj < y && y < yi) {
        var s = orient(a, b, point)
        if(s === 0) {
          return 0
        } else {
          inside ^= (0 < s)|0
        }
      } else if(y === yi) {
        var c = vs[(i+1)%n]
        var yk = c[1]
        if(yi < yk) {
          var s = orient(a, b, point)
          if(s === 0) {
            return 0
          } else {
            inside ^= (0 < s)|0
          }
        }
      }
    } else if(yi < yj) {
      if(yi < y && y < yj) {
        var s = orient(a, b, point)
        if(s === 0) {
          return 0
        } else {
          inside ^= (s < 0)|0
        }
      } else if(y === yi) {
        var c = vs[(i+1)%n]
        var yk = c[1]
        if(yk < yi) {
          var s = orient(a, b, point)
          if(s === 0) {
            return 0
          } else {
            inside ^= (s < 0)|0
          }
        }
      }
    } else if(y === yi) {
      var x0 = Math.min(a[0], b[0])
      var x1 = Math.max(a[0], b[0])
      if(i === 0) {
        while(j>0) {
          var k = (j+n-1)%n
          var p = vs[k]
          if(p[1] !== y) {
            break
          }
          var px = p[0]
          x0 = Math.min(x0, px)
          x1 = Math.max(x1, px)
          j = k
        }
        if(j === 0) {
          if(x0 <= x && x <= x1) {
            return 0
          }
          return 1 
        }
        lim = j+1
      }
      var y0 = vs[(j+n-1)%n][1]
      while(i+1<lim) {
        var p = vs[i+1]
        if(p[1] !== y) {
          break
        }
        var px = p[0]
        x0 = Math.min(x0, px)
        x1 = Math.max(x1, px)
        i += 1
      }
      if(x0 <= x && x <= x1) {
        return 0
      }
      var y1 = vs[(i+1)%n][1]
      if(x < x0 && (y0 < y !== y1 < y)) {
        inside ^= 1
      }
    }
  }
  return 2 * inside - 1
}

/***/ }),

/***/ "./node_modules/robust-scale/robust-scale.js":
/*!***************************************************!*\
  !*** ./node_modules/robust-scale/robust-scale.js ***!
  \***************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module, __webpack_require__ */
/*! CommonJS bailout: module.exports is used directly at 6:0-14 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var twoProduct = __webpack_require__(/*! two-product */ "./node_modules/two-product/two-product.js")
var twoSum = __webpack_require__(/*! two-sum */ "./node_modules/two-sum/two-sum.js")

module.exports = scaleLinearExpansion

function scaleLinearExpansion(e, scale) {
  var n = e.length
  if(n === 1) {
    var ts = twoProduct(e[0], scale)
    if(ts[0]) {
      return ts
    }
    return [ ts[1] ]
  }
  var g = new Array(2 * n)
  var q = [0.1, 0.1]
  var t = [0.1, 0.1]
  var count = 0
  twoProduct(e[0], scale, q)
  if(q[0]) {
    g[count++] = q[0]
  }
  for(var i=1; i<n; ++i) {
    twoProduct(e[i], scale, t)
    var pq = q[1]
    twoSum(pq, t[0], q)
    if(q[0]) {
      g[count++] = q[0]
    }
    var a = t[1]
    var b = q[1]
    var x = a + b
    var bv = x - a
    var y = b - bv
    q[1] = x
    if(y) {
      g[count++] = y
    }
  }
  if(q[1]) {
    g[count++] = q[1]
  }
  if(count === 0) {
    g[count++] = 0.0
  }
  g.length = count
  return g
}

/***/ }),

/***/ "./node_modules/robust-subtract/robust-diff.js":
/*!*****************************************************!*\
  !*** ./node_modules/robust-subtract/robust-diff.js ***!
  \*****************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 3:0-14 */
/***/ ((module) => {

"use strict";


module.exports = robustSubtract

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function robustSubtract(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], -f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = -f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = -f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = -f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}

/***/ }),

/***/ "./node_modules/robust-sum/robust-sum.js":
/*!***********************************************!*\
  !*** ./node_modules/robust-sum/robust-sum.js ***!
  \***********************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 3:0-14 */
/***/ ((module) => {

"use strict";


module.exports = linearExpansionSum

//Easy case: Add two scalars
function scalarScalar(a, b) {
  var x = a + b
  var bv = x - a
  var av = x - bv
  var br = b - bv
  var ar = a - av
  var y = ar + br
  if(y) {
    return [y, x]
  }
  return [x]
}

function linearExpansionSum(e, f) {
  var ne = e.length|0
  var nf = f.length|0
  if(ne === 1 && nf === 1) {
    return scalarScalar(e[0], f[0])
  }
  var n = ne + nf
  var g = new Array(n)
  var count = 0
  var eptr = 0
  var fptr = 0
  var abs = Math.abs
  var ei = e[eptr]
  var ea = abs(ei)
  var fi = f[fptr]
  var fa = abs(fi)
  var a, b
  if(ea < fa) {
    b = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    b = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  if((eptr < ne && ea < fa) || (fptr >= nf)) {
    a = ei
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
      ea = abs(ei)
    }
  } else {
    a = fi
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
      fa = abs(fi)
    }
  }
  var x = a + b
  var bv = x - a
  var y = b - bv
  var q0 = y
  var q1 = x
  var _x, _bv, _av, _br, _ar
  while(eptr < ne && fptr < nf) {
    if(ea < fa) {
      a = ei
      eptr += 1
      if(eptr < ne) {
        ei = e[eptr]
        ea = abs(ei)
      }
    } else {
      a = fi
      fptr += 1
      if(fptr < nf) {
        fi = f[fptr]
        fa = abs(fi)
      }
    }
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
  }
  while(eptr < ne) {
    a = ei
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    }
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    eptr += 1
    if(eptr < ne) {
      ei = e[eptr]
    }
  }
  while(fptr < nf) {
    a = fi
    b = q0
    x = a + b
    bv = x - a
    y = b - bv
    if(y) {
      g[count++] = y
    } 
    _x = q1 + x
    _bv = _x - q1
    _av = _x - _bv
    _br = x - _bv
    _ar = q1 - _av
    q0 = _ar + _br
    q1 = _x
    fptr += 1
    if(fptr < nf) {
      fi = f[fptr]
    }
  }
  if(q0) {
    g[count++] = q0
  }
  if(q1) {
    g[count++] = q1
  }
  if(!count) {
    g[count++] = 0.0  
  }
  g.length = count
  return g
}

/***/ }),

/***/ "./node_modules/two-product/two-product.js":
/*!*************************************************!*\
  !*** ./node_modules/two-product/two-product.js ***!
  \*************************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 3:0-14 */
/***/ ((module) => {

"use strict";


module.exports = twoProduct

var SPLITTER = +(Math.pow(2, 27) + 1.0)

function twoProduct(a, b, result) {
  var x = a * b

  var c = SPLITTER * a
  var abig = c - a
  var ahi = c - abig
  var alo = a - ahi

  var d = SPLITTER * b
  var bbig = d - b
  var bhi = d - bbig
  var blo = b - bhi

  var err1 = x - (ahi * bhi)
  var err2 = err1 - (alo * bhi)
  var err3 = err2 - (ahi * blo)

  var y = alo * blo - err3

  if(result) {
    result[0] = y
    result[1] = x
    return result
  }

  return [ y, x ]
}

/***/ }),

/***/ "./node_modules/two-sum/two-sum.js":
/*!*****************************************!*\
  !*** ./node_modules/two-sum/two-sum.js ***!
  \*****************************************/
/*! unknown exports (runtime-defined) */
/*! runtime requirements: module */
/*! CommonJS bailout: module.exports is used directly at 3:0-14 */
/***/ ((module) => {

"use strict";


module.exports = fastTwoSum

function fastTwoSum(a, b, result) {
	var x = a + b
	var bv = x - a
	var av = x - bv
	var br = b - bv
	var ar = a - av
	if(result) {
		result[0] = ar + br
		result[1] = x
		return result
	}
	return [ar+br, x]
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./netv-lasso-selection.js");
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXR2LWxhc3NvLXNlbGVjdGlvbi93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vbmV0di1sYXNzby1zZWxlY3Rpb24vLi9uZXR2LWxhc3NvLXNlbGVjdGlvbi5qcyIsIndlYnBhY2s6Ly9uZXR2LWxhc3NvLXNlbGVjdGlvbi8uL25vZGVfbW9kdWxlcy9yb2J1c3Qtb3JpZW50YXRpb24vb3JpZW50YXRpb24uanMiLCJ3ZWJwYWNrOi8vbmV0di1sYXNzby1zZWxlY3Rpb24vLi9ub2RlX21vZHVsZXMvcm9idXN0LXBvaW50LWluLXBvbHlnb24vcm9idXN0LXBucC5qcyIsIndlYnBhY2s6Ly9uZXR2LWxhc3NvLXNlbGVjdGlvbi8uL25vZGVfbW9kdWxlcy9yb2J1c3Qtc2NhbGUvcm9idXN0LXNjYWxlLmpzIiwid2VicGFjazovL25ldHYtbGFzc28tc2VsZWN0aW9uLy4vbm9kZV9tb2R1bGVzL3JvYnVzdC1zdWJ0cmFjdC9yb2J1c3QtZGlmZi5qcyIsIndlYnBhY2s6Ly9uZXR2LWxhc3NvLXNlbGVjdGlvbi8uL25vZGVfbW9kdWxlcy9yb2J1c3Qtc3VtL3JvYnVzdC1zdW0uanMiLCJ3ZWJwYWNrOi8vbmV0di1sYXNzby1zZWxlY3Rpb24vLi9ub2RlX21vZHVsZXMvdHdvLXByb2R1Y3QvdHdvLXByb2R1Y3QuanMiLCJ3ZWJwYWNrOi8vbmV0di1sYXNzby1zZWxlY3Rpb24vLi9ub2RlX21vZHVsZXMvdHdvLXN1bS90d28tc3VtLmpzIiwid2VicGFjazovL25ldHYtbGFzc28tc2VsZWN0aW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL25ldHYtbGFzc28tc2VsZWN0aW9uL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL25ldHYtbGFzc28tc2VsZWN0aW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9uZXR2LWxhc3NvLXNlbGVjdGlvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL25ldHYtbGFzc28tc2VsZWN0aW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbmV0di1sYXNzby1zZWxlY3Rpb24vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBLENBQTBEOztBQUVuRDtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvRUFBb0U7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRTtBQUMzQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtBQUNsQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsOERBQW1CO0FBQ3ZDLFNBQVM7QUFDVDtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7OztBQ3ZHWTs7QUFFWixpQkFBaUIsbUJBQU8sQ0FBQyw4REFBYTtBQUN0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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7O0FDM0pZOztBQUVaOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7O0FDM0pZOztBQUVaOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDOzs7Ozs7Ozs7Ozs7OztBQ2hDWTs7QUFFWjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7VUNoQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoibmV0di1sYXNzby1zZWxlY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2Uge1xuXHRcdHZhciBhID0gZmFjdG9yeSgpO1xuXHRcdGZvcih2YXIgaSBpbiBhKSAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnID8gZXhwb3J0cyA6IHJvb3QpW2ldID0gYVtpXTtcblx0fVxufSkoc2VsZiwgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiaW1wb3J0IGNoZWNrUG9pbnRJblBvbHlnb24gZnJvbSBcInJvYnVzdC1wb2ludC1pbi1wb2x5Z29uXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTGFzc28ge1xyXG4gICAgY29uc3RydWN0b3IobmV0diwgY29uZmlncykge1xyXG4gICAgICAgIHRoaXMuJF9zdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpXHJcbiAgICAgICAgdGhpcy4kX2NvcmUgPSBuZXR2XHJcbiAgICAgICAgbmV0di4kX2NvbnRhaW5lci5wcmVwZW5kKHRoaXMuJF9zdmcpXHJcbiAgICAgICAgdGhpcy4kX3N2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgbmV0di4kX2NvbmZpZ3Mud2lkdGgpXHJcbiAgICAgICAgdGhpcy4kX3N2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIG5ldHYuJF9jb25maWdzLmhlaWdodClcclxuICAgICAgICBuZXR2LiRfY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJ1xyXG4gICAgICAgIG5ldHYuJF9jb250YWluZXIuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJ1xyXG4gICAgICAgIG5ldHYuJF9jb250YWluZXIuc3R5bGUud2lkdGggPSBuZXR2LiRfY29uZmlncy53aWR0aFxyXG4gICAgICAgIG5ldHYuJF9jb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gbmV0di4kX2NvbmZpZ3MuaGVpZ2h0XHJcbiAgICAgICAgdGhpcy4kX3N2Zy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSdcclxuICAgICAgICB0aGlzLiRfc3ZnLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnXHJcbiAgICAgICAgdGhpcy4kX3N2Zy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnIC8vIGluaXRpYWxseSBkaXNhYmxlZFxyXG5cclxuICAgICAgICB0aGlzLl93aWR0aCA9IG5ldHYuJF9jb25maWdzLndpZHRoXHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gbmV0di4kX2NvbmZpZ3MuaGVpZ2h0XHJcbiAgICAgICAgdGhpcy5fY2xvc2VEaXN0YW5jZSA9IDEwMFxyXG5cclxuICAgICAgICB0aGlzLl9wYXRoUG9pbnRzID0gW11cclxuICAgICAgICB0aGlzLl9zZWxlY3RlZEl0ZW1zID0gW11cclxuXHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYWxsYmFjayA9IG51bGxcclxuXHJcbiAgICAgICAgdGhpcy4kX3N2Zy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9vbk1vdXNlRG93bi5iaW5kKHRoaXMpKVxyXG4gICAgICAgIHRoaXMuJF9zdmcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5fb25Nb3VzZU1vdmUuYmluZCh0aGlzKSlcclxuICAgICAgICB0aGlzLiRfc3ZnLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9vbk1vdXNlVXAuYmluZCh0aGlzKSlcclxuXHJcbiAgICAgICAgLy8gY2hlY2sgY29uZmlnIHRvIGRlY2lkZSBlbmFibGUgaXQgb3Igbm90XHJcbiAgICAgICAgaWYgKGNvbmZpZ3MgJiYgY29uZmlncy5lbmFibGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5lbmFibGUoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbmFibGUoKSB7XHJcbiAgICAgICAgdGhpcy4kX3N2Zy5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ3Zpc2libGUnXHJcbiAgICB9XHJcblxyXG4gICAgZGlzYWJsZSgpIHtcclxuICAgICAgICB0aGlzLiRfc3ZnLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSdcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZURpc3RhbmNlKGRpc3RhbmNlKSB7XHJcbiAgICAgICAgdGhpcy5fY2xvc2VEaXN0YW5jZSA9IGRpc3RhbmNlXHJcbiAgICB9XHJcblxyXG4gICAgb25TZWxlY3RlZChjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkQ2FsbGJhY2sgPSBjYWxsYmFja1xyXG4gICAgfVxyXG5cclxuICAgIF9vbk1vdXNlRG93bihldnQpIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RpbmcgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5fcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAncGF0aCcpO1xyXG4gICAgICAgIHRoaXMuX3BhdGguc2V0QXR0cmlidXRlKCdmaWxsJywgJ3JnYmEoMjAwLCAyMDAsIDIwMCwgMC4yKScpOyAvLyBUT0RPOiBmaWxsXHJcbiAgICAgICAgdGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZScsICdibGFjaycpO1xyXG4gICAgICAgIHRoaXMuX3BhdGguc2V0QXR0cmlidXRlKCdzdHJva2Utd2lkdGgnLCAyKTtcclxuICAgICAgICB0aGlzLl9wYXRoLnNldEF0dHJpYnV0ZSgnc3Ryb2tlLWxpbmVqb2luJywgJ3JvdW5kJyk7XHJcbiAgICAgICAgdGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ3N0cm9rZS1saW5lY2FwJywgJ3JvdW5kJyk7XHJcbiAgICAgICAgdGhpcy4kX3N2Zy5hcHBlbmRDaGlsZCh0aGlzLl9wYXRoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeCA9IGV2dC5vZmZzZXRYXHJcbiAgICAgICAgY29uc3QgeSA9IGV2dC5vZmZzZXRZXHJcbiAgICAgICAgdGhpcy5fcGF0aFBvaW50cyA9IFtbeCwgeV1dXHJcbiAgICAgICAgdGhpcy5fcGF0aEQgPSBgTSR7eH0sJHt5fUwke3h9LCR7eX1gXHJcbiAgICAgICAgdGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCB0aGlzLl9wYXRoRCk7XHJcbiAgICB9XHJcblxyXG4gICAgX29uTW91c2VNb3ZlKGV2dCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc2VsZWN0aW5nKSByZXR1cm5cclxuICAgICAgICAvLyBUT0RPOiBuZWVkIHNtb290aFxyXG4gICAgICAgIGNvbnN0IHggPSBldnQub2Zmc2V0WFxyXG4gICAgICAgIGNvbnN0IHkgPSBldnQub2Zmc2V0WVxyXG4gICAgICAgIHRoaXMuX3BhdGhQb2ludHMucHVzaChbeCwgeV0pXHJcbiAgICAgICAgdGhpcy5fcGF0aEQgKz0gYCAke3h9LCR7eX1gXHJcbiAgICAgICAgdGhpcy5fcGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCB0aGlzLl9wYXRoRCk7XHJcbiAgICB9XHJcblxyXG4gICAgX29uTW91c2VVcChldnQpIHtcclxuICAgICAgICB0aGlzLl9wYXRoLnJlbW92ZSgpXHJcbiAgICAgICAgdGhpcy5fZ2V0U2VsZWN0ZWRJdGVtcygpXHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRDYWxsYmFjayAmJiB0aGlzLl9zZWxlY3RlZENhbGxiYWNrKHRoaXMuX3NlbGVjdGVkSXRlbXMpXHJcbiAgICB9XHJcblxyXG4gICAgX2dldFNlbGVjdGVkSXRlbXMoKSB7XHJcbiAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLl9wYXRoUG9pbnRzWzBdXHJcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5fcGF0aFBvaW50c1t0aGlzLl9wYXRoUG9pbnRzLmxlbmd0aCAtIDFdXHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2VTcWFyZSA9IChzdGFydFswXSAtIGVuZFswXSkgKiogMiArIChzdGFydFsxXSAtIGVuZFsxXSkgKiogMlxyXG4gICAgICAgIGlmIChkaXN0YW5jZVNxYXJlID4gdGhpcy5fY2xvc2VEaXN0YW5jZSAqIHRoaXMuX2Nsb3NlRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRJdGVtcyA9IFtdXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLiRfY29yZS5ub2RlcygpXHJcbiAgICAgICAgY29uc3QgZGF0YVRyYW5zZm9ybSA9IHRoaXMuJF9jb3JlLnRyYW5zZm9ybSgpXHJcbiAgICAgICAgLy8gVE9ETzogY29uc2lkZXIgb24gYm9yZGVyIGNvbmRpdGlvblxyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkSXRlbXMgPSBpdGVtcy5maWx0ZXIoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSBpdGVtLngoKSAqIGRhdGFUcmFuc2Zvcm0uayArIGRhdGFUcmFuc2Zvcm0ueFxyXG4gICAgICAgICAgICBjb25zdCB5ID0gaXRlbS55KCkgKiBkYXRhVHJhbnNmb3JtLmsgKyBkYXRhVHJhbnNmb3JtLnlcclxuICAgICAgICAgICAgcmV0dXJuIChjaGVja1BvaW50SW5Qb2x5Z29uKHRoaXMuX3BhdGhQb2ludHMsIFt4LCB5XSkgPCAwKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgdHdvUHJvZHVjdCA9IHJlcXVpcmUoXCJ0d28tcHJvZHVjdFwiKVxudmFyIHJvYnVzdFN1bSA9IHJlcXVpcmUoXCJyb2J1c3Qtc3VtXCIpXG52YXIgcm9idXN0U2NhbGUgPSByZXF1aXJlKFwicm9idXN0LXNjYWxlXCIpXG52YXIgcm9idXN0U3VidHJhY3QgPSByZXF1aXJlKFwicm9idXN0LXN1YnRyYWN0XCIpXG5cbnZhciBOVU1fRVhQQU5EID0gNVxuXG52YXIgRVBTSUxPTiAgICAgPSAxLjExMDIyMzAyNDYyNTE1NjVlLTE2XG52YXIgRVJSQk9VTkQzICAgPSAoMy4wICsgMTYuMCAqIEVQU0lMT04pICogRVBTSUxPTlxudmFyIEVSUkJPVU5ENCAgID0gKDcuMCArIDU2LjAgKiBFUFNJTE9OKSAqIEVQU0lMT05cblxuZnVuY3Rpb24gY29mYWN0b3IobSwgYykge1xuICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KG0ubGVuZ3RoLTEpXG4gIGZvcih2YXIgaT0xOyBpPG0ubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgciA9IHJlc3VsdFtpLTFdID0gbmV3IEFycmF5KG0ubGVuZ3RoLTEpXG4gICAgZm9yKHZhciBqPTAsaz0wOyBqPG0ubGVuZ3RoOyArK2opIHtcbiAgICAgIGlmKGogPT09IGMpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIHJbaysrXSA9IG1baV1bal1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiBtYXRyaXgobikge1xuICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KG4pXG4gIGZvcih2YXIgaT0wOyBpPG47ICsraSkge1xuICAgIHJlc3VsdFtpXSA9IG5ldyBBcnJheShuKVxuICAgIGZvcih2YXIgaj0wOyBqPG47ICsraikge1xuICAgICAgcmVzdWx0W2ldW2pdID0gW1wibVwiLCBqLCBcIltcIiwgKG4taS0xKSwgXCJdXCJdLmpvaW4oXCJcIilcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiBzaWduKG4pIHtcbiAgaWYobiAmIDEpIHtcbiAgICByZXR1cm4gXCItXCJcbiAgfVxuICByZXR1cm4gXCJcIlxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVN1bShleHByKSB7XG4gIGlmKGV4cHIubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGV4cHJbMF1cbiAgfSBlbHNlIGlmKGV4cHIubGVuZ3RoID09PSAyKSB7XG4gICAgcmV0dXJuIFtcInN1bShcIiwgZXhwclswXSwgXCIsXCIsIGV4cHJbMV0sIFwiKVwiXS5qb2luKFwiXCIpXG4gIH0gZWxzZSB7XG4gICAgdmFyIG0gPSBleHByLmxlbmd0aD4+MVxuICAgIHJldHVybiBbXCJzdW0oXCIsIGdlbmVyYXRlU3VtKGV4cHIuc2xpY2UoMCwgbSkpLCBcIixcIiwgZ2VuZXJhdGVTdW0oZXhwci5zbGljZShtKSksIFwiKVwiXS5qb2luKFwiXCIpXG4gIH1cbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5hbnQobSkge1xuICBpZihtLmxlbmd0aCA9PT0gMikge1xuICAgIHJldHVybiBbW1wic3VtKHByb2QoXCIsIG1bMF1bMF0sIFwiLFwiLCBtWzFdWzFdLCBcIikscHJvZCgtXCIsIG1bMF1bMV0sIFwiLFwiLCBtWzFdWzBdLCBcIikpXCJdLmpvaW4oXCJcIildXG4gIH0gZWxzZSB7XG4gICAgdmFyIGV4cHIgPSBbXVxuICAgIGZvcih2YXIgaT0wOyBpPG0ubGVuZ3RoOyArK2kpIHtcbiAgICAgIGV4cHIucHVzaChbXCJzY2FsZShcIiwgZ2VuZXJhdGVTdW0oZGV0ZXJtaW5hbnQoY29mYWN0b3IobSwgaSkpKSwgXCIsXCIsIHNpZ24oaSksIG1bMF1baV0sIFwiKVwiXS5qb2luKFwiXCIpKVxuICAgIH1cbiAgICByZXR1cm4gZXhwclxuICB9XG59XG5cbmZ1bmN0aW9uIG9yaWVudGF0aW9uKG4pIHtcbiAgdmFyIHBvcyA9IFtdXG4gIHZhciBuZWcgPSBbXVxuICB2YXIgbSA9IG1hdHJpeChuKVxuICB2YXIgYXJncyA9IFtdXG4gIGZvcih2YXIgaT0wOyBpPG47ICsraSkge1xuICAgIGlmKChpJjEpPT09MCkge1xuICAgICAgcG9zLnB1c2guYXBwbHkocG9zLCBkZXRlcm1pbmFudChjb2ZhY3RvcihtLCBpKSkpXG4gICAgfSBlbHNlIHtcbiAgICAgIG5lZy5wdXNoLmFwcGx5KG5lZywgZGV0ZXJtaW5hbnQoY29mYWN0b3IobSwgaSkpKVxuICAgIH1cbiAgICBhcmdzLnB1c2goXCJtXCIgKyBpKVxuICB9XG4gIHZhciBwb3NFeHByID0gZ2VuZXJhdGVTdW0ocG9zKVxuICB2YXIgbmVnRXhwciA9IGdlbmVyYXRlU3VtKG5lZylcbiAgdmFyIGZ1bmNOYW1lID0gXCJvcmllbnRhdGlvblwiICsgbiArIFwiRXhhY3RcIlxuICB2YXIgY29kZSA9IFtcImZ1bmN0aW9uIFwiLCBmdW5jTmFtZSwgXCIoXCIsIGFyZ3Muam9pbigpLCBcIil7dmFyIHA9XCIsIHBvc0V4cHIsIFwiLG49XCIsIG5lZ0V4cHIsIFwiLGQ9c3ViKHAsbik7XFxcbnJldHVybiBkW2QubGVuZ3RoLTFdO307cmV0dXJuIFwiLCBmdW5jTmFtZV0uam9pbihcIlwiKVxuICB2YXIgcHJvYyA9IG5ldyBGdW5jdGlvbihcInN1bVwiLCBcInByb2RcIiwgXCJzY2FsZVwiLCBcInN1YlwiLCBjb2RlKVxuICByZXR1cm4gcHJvYyhyb2J1c3RTdW0sIHR3b1Byb2R1Y3QsIHJvYnVzdFNjYWxlLCByb2J1c3RTdWJ0cmFjdClcbn1cblxudmFyIG9yaWVudGF0aW9uM0V4YWN0ID0gb3JpZW50YXRpb24oMylcbnZhciBvcmllbnRhdGlvbjRFeGFjdCA9IG9yaWVudGF0aW9uKDQpXG5cbnZhciBDQUNIRUQgPSBbXG4gIGZ1bmN0aW9uIG9yaWVudGF0aW9uMCgpIHsgcmV0dXJuIDAgfSxcbiAgZnVuY3Rpb24gb3JpZW50YXRpb24xKCkgeyByZXR1cm4gMCB9LFxuICBmdW5jdGlvbiBvcmllbnRhdGlvbjIoYSwgYikgeyBcbiAgICByZXR1cm4gYlswXSAtIGFbMF1cbiAgfSxcbiAgZnVuY3Rpb24gb3JpZW50YXRpb24zKGEsIGIsIGMpIHtcbiAgICB2YXIgbCA9IChhWzFdIC0gY1sxXSkgKiAoYlswXSAtIGNbMF0pXG4gICAgdmFyIHIgPSAoYVswXSAtIGNbMF0pICogKGJbMV0gLSBjWzFdKVxuICAgIHZhciBkZXQgPSBsIC0gclxuICAgIHZhciBzXG4gICAgaWYobCA+IDApIHtcbiAgICAgIGlmKHIgPD0gMCkge1xuICAgICAgICByZXR1cm4gZGV0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzID0gbCArIHJcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYobCA8IDApIHtcbiAgICAgIGlmKHIgPj0gMCkge1xuICAgICAgICByZXR1cm4gZGV0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzID0gLShsICsgcilcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRldFxuICAgIH1cbiAgICB2YXIgdG9sID0gRVJSQk9VTkQzICogc1xuICAgIGlmKGRldCA+PSB0b2wgfHwgZGV0IDw9IC10b2wpIHtcbiAgICAgIHJldHVybiBkZXRcbiAgICB9XG4gICAgcmV0dXJuIG9yaWVudGF0aW9uM0V4YWN0KGEsIGIsIGMpXG4gIH0sXG4gIGZ1bmN0aW9uIG9yaWVudGF0aW9uNChhLGIsYyxkKSB7XG4gICAgdmFyIGFkeCA9IGFbMF0gLSBkWzBdXG4gICAgdmFyIGJkeCA9IGJbMF0gLSBkWzBdXG4gICAgdmFyIGNkeCA9IGNbMF0gLSBkWzBdXG4gICAgdmFyIGFkeSA9IGFbMV0gLSBkWzFdXG4gICAgdmFyIGJkeSA9IGJbMV0gLSBkWzFdXG4gICAgdmFyIGNkeSA9IGNbMV0gLSBkWzFdXG4gICAgdmFyIGFkeiA9IGFbMl0gLSBkWzJdXG4gICAgdmFyIGJkeiA9IGJbMl0gLSBkWzJdXG4gICAgdmFyIGNkeiA9IGNbMl0gLSBkWzJdXG4gICAgdmFyIGJkeGNkeSA9IGJkeCAqIGNkeVxuICAgIHZhciBjZHhiZHkgPSBjZHggKiBiZHlcbiAgICB2YXIgY2R4YWR5ID0gY2R4ICogYWR5XG4gICAgdmFyIGFkeGNkeSA9IGFkeCAqIGNkeVxuICAgIHZhciBhZHhiZHkgPSBhZHggKiBiZHlcbiAgICB2YXIgYmR4YWR5ID0gYmR4ICogYWR5XG4gICAgdmFyIGRldCA9IGFkeiAqIChiZHhjZHkgLSBjZHhiZHkpIFxuICAgICAgICAgICAgKyBiZHogKiAoY2R4YWR5IC0gYWR4Y2R5KVxuICAgICAgICAgICAgKyBjZHogKiAoYWR4YmR5IC0gYmR4YWR5KVxuICAgIHZhciBwZXJtYW5lbnQgPSAoTWF0aC5hYnMoYmR4Y2R5KSArIE1hdGguYWJzKGNkeGJkeSkpICogTWF0aC5hYnMoYWR6KVxuICAgICAgICAgICAgICAgICAgKyAoTWF0aC5hYnMoY2R4YWR5KSArIE1hdGguYWJzKGFkeGNkeSkpICogTWF0aC5hYnMoYmR6KVxuICAgICAgICAgICAgICAgICAgKyAoTWF0aC5hYnMoYWR4YmR5KSArIE1hdGguYWJzKGJkeGFkeSkpICogTWF0aC5hYnMoY2R6KVxuICAgIHZhciB0b2wgPSBFUlJCT1VORDQgKiBwZXJtYW5lbnRcbiAgICBpZiAoKGRldCA+IHRvbCkgfHwgKC1kZXQgPiB0b2wpKSB7XG4gICAgICByZXR1cm4gZGV0XG4gICAgfVxuICAgIHJldHVybiBvcmllbnRhdGlvbjRFeGFjdChhLGIsYyxkKVxuICB9XG5dXG5cbmZ1bmN0aW9uIHNsb3dPcmllbnQoYXJncykge1xuICB2YXIgcHJvYyA9IENBQ0hFRFthcmdzLmxlbmd0aF1cbiAgaWYoIXByb2MpIHtcbiAgICBwcm9jID0gQ0FDSEVEW2FyZ3MubGVuZ3RoXSA9IG9yaWVudGF0aW9uKGFyZ3MubGVuZ3RoKVxuICB9XG4gIHJldHVybiBwcm9jLmFwcGx5KHVuZGVmaW5lZCwgYXJncylcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVPcmllbnRhdGlvblByb2MoKSB7XG4gIHdoaWxlKENBQ0hFRC5sZW5ndGggPD0gTlVNX0VYUEFORCkge1xuICAgIENBQ0hFRC5wdXNoKG9yaWVudGF0aW9uKENBQ0hFRC5sZW5ndGgpKVxuICB9XG4gIHZhciBhcmdzID0gW11cbiAgdmFyIHByb2NBcmdzID0gW1wic2xvd1wiXVxuICBmb3IodmFyIGk9MDsgaTw9TlVNX0VYUEFORDsgKytpKSB7XG4gICAgYXJncy5wdXNoKFwiYVwiICsgaSlcbiAgICBwcm9jQXJncy5wdXNoKFwib1wiICsgaSlcbiAgfVxuICB2YXIgY29kZSA9IFtcbiAgICBcImZ1bmN0aW9uIGdldE9yaWVudGF0aW9uKFwiLCBhcmdzLmpvaW4oKSwgXCIpe3N3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtjYXNlIDA6Y2FzZSAxOnJldHVybiAwO1wiXG4gIF1cbiAgZm9yKHZhciBpPTI7IGk8PU5VTV9FWFBBTkQ7ICsraSkge1xuICAgIGNvZGUucHVzaChcImNhc2UgXCIsIGksIFwiOnJldHVybiBvXCIsIGksIFwiKFwiLCBhcmdzLnNsaWNlKDAsIGkpLmpvaW4oKSwgXCIpO1wiKVxuICB9XG4gIGNvZGUucHVzaChcIn12YXIgcz1uZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7Zm9yKHZhciBpPTA7aTxhcmd1bWVudHMubGVuZ3RoOysraSl7c1tpXT1hcmd1bWVudHNbaV19O3JldHVybiBzbG93KHMpO31yZXR1cm4gZ2V0T3JpZW50YXRpb25cIilcbiAgcHJvY0FyZ3MucHVzaChjb2RlLmpvaW4oXCJcIikpXG5cbiAgdmFyIHByb2MgPSBGdW5jdGlvbi5hcHBseSh1bmRlZmluZWQsIHByb2NBcmdzKVxuICBtb2R1bGUuZXhwb3J0cyA9IHByb2MuYXBwbHkodW5kZWZpbmVkLCBbc2xvd09yaWVudF0uY29uY2F0KENBQ0hFRCkpXG4gIGZvcih2YXIgaT0wOyBpPD1OVU1fRVhQQU5EOyArK2kpIHtcbiAgICBtb2R1bGUuZXhwb3J0c1tpXSA9IENBQ0hFRFtpXVxuICB9XG59XG5cbmdlbmVyYXRlT3JpZW50YXRpb25Qcm9jKCkiLCJtb2R1bGUuZXhwb3J0cyA9IHJvYnVzdFBvaW50SW5Qb2x5Z29uXG5cbnZhciBvcmllbnQgPSByZXF1aXJlKCdyb2J1c3Qtb3JpZW50YXRpb24nKVxuXG5mdW5jdGlvbiByb2J1c3RQb2ludEluUG9seWdvbih2cywgcG9pbnQpIHtcbiAgdmFyIHggPSBwb2ludFswXVxuICB2YXIgeSA9IHBvaW50WzFdXG4gIHZhciBuID0gdnMubGVuZ3RoXG4gIHZhciBpbnNpZGUgPSAxXG4gIHZhciBsaW0gPSBuXG4gIGZvcih2YXIgaSA9IDAsIGogPSBuLTE7IGk8bGltOyBqPWkrKykge1xuICAgIHZhciBhID0gdnNbaV1cbiAgICB2YXIgYiA9IHZzW2pdXG4gICAgdmFyIHlpID0gYVsxXVxuICAgIHZhciB5aiA9IGJbMV1cbiAgICBpZih5aiA8IHlpKSB7XG4gICAgICBpZih5aiA8IHkgJiYgeSA8IHlpKSB7XG4gICAgICAgIHZhciBzID0gb3JpZW50KGEsIGIsIHBvaW50KVxuICAgICAgICBpZihzID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbnNpZGUgXj0gKDAgPCBzKXwwXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZih5ID09PSB5aSkge1xuICAgICAgICB2YXIgYyA9IHZzWyhpKzEpJW5dXG4gICAgICAgIHZhciB5ayA9IGNbMV1cbiAgICAgICAgaWYoeWkgPCB5aykge1xuICAgICAgICAgIHZhciBzID0gb3JpZW50KGEsIGIsIHBvaW50KVxuICAgICAgICAgIGlmKHMgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAwXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluc2lkZSBePSAoMCA8IHMpfDBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYoeWkgPCB5aikge1xuICAgICAgaWYoeWkgPCB5ICYmIHkgPCB5aikge1xuICAgICAgICB2YXIgcyA9IG9yaWVudChhLCBiLCBwb2ludClcbiAgICAgICAgaWYocyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5zaWRlIF49IChzIDwgMCl8MFxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYoeSA9PT0geWkpIHtcbiAgICAgICAgdmFyIGMgPSB2c1soaSsxKSVuXVxuICAgICAgICB2YXIgeWsgPSBjWzFdXG4gICAgICAgIGlmKHlrIDwgeWkpIHtcbiAgICAgICAgICB2YXIgcyA9IG9yaWVudChhLCBiLCBwb2ludClcbiAgICAgICAgICBpZihzID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnNpZGUgXj0gKHMgPCAwKXwwXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmKHkgPT09IHlpKSB7XG4gICAgICB2YXIgeDAgPSBNYXRoLm1pbihhWzBdLCBiWzBdKVxuICAgICAgdmFyIHgxID0gTWF0aC5tYXgoYVswXSwgYlswXSlcbiAgICAgIGlmKGkgPT09IDApIHtcbiAgICAgICAgd2hpbGUoaj4wKSB7XG4gICAgICAgICAgdmFyIGsgPSAoaituLTEpJW5cbiAgICAgICAgICB2YXIgcCA9IHZzW2tdXG4gICAgICAgICAgaWYocFsxXSAhPT0geSkge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHB4ID0gcFswXVxuICAgICAgICAgIHgwID0gTWF0aC5taW4oeDAsIHB4KVxuICAgICAgICAgIHgxID0gTWF0aC5tYXgoeDEsIHB4KVxuICAgICAgICAgIGogPSBrXG4gICAgICAgIH1cbiAgICAgICAgaWYoaiA9PT0gMCkge1xuICAgICAgICAgIGlmKHgwIDw9IHggJiYgeCA8PSB4MSkge1xuICAgICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIDEgXG4gICAgICAgIH1cbiAgICAgICAgbGltID0gaisxXG4gICAgICB9XG4gICAgICB2YXIgeTAgPSB2c1soaituLTEpJW5dWzFdXG4gICAgICB3aGlsZShpKzE8bGltKSB7XG4gICAgICAgIHZhciBwID0gdnNbaSsxXVxuICAgICAgICBpZihwWzFdICE9PSB5KSB7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcHggPSBwWzBdXG4gICAgICAgIHgwID0gTWF0aC5taW4oeDAsIHB4KVxuICAgICAgICB4MSA9IE1hdGgubWF4KHgxLCBweClcbiAgICAgICAgaSArPSAxXG4gICAgICB9XG4gICAgICBpZih4MCA8PSB4ICYmIHggPD0geDEpIHtcbiAgICAgICAgcmV0dXJuIDBcbiAgICAgIH1cbiAgICAgIHZhciB5MSA9IHZzWyhpKzEpJW5dWzFdXG4gICAgICBpZih4IDwgeDAgJiYgKHkwIDwgeSAhPT0geTEgPCB5KSkge1xuICAgICAgICBpbnNpZGUgXj0gMVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gMiAqIGluc2lkZSAtIDFcbn0iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgdHdvUHJvZHVjdCA9IHJlcXVpcmUoXCJ0d28tcHJvZHVjdFwiKVxudmFyIHR3b1N1bSA9IHJlcXVpcmUoXCJ0d28tc3VtXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gc2NhbGVMaW5lYXJFeHBhbnNpb25cblxuZnVuY3Rpb24gc2NhbGVMaW5lYXJFeHBhbnNpb24oZSwgc2NhbGUpIHtcbiAgdmFyIG4gPSBlLmxlbmd0aFxuICBpZihuID09PSAxKSB7XG4gICAgdmFyIHRzID0gdHdvUHJvZHVjdChlWzBdLCBzY2FsZSlcbiAgICBpZih0c1swXSkge1xuICAgICAgcmV0dXJuIHRzXG4gICAgfVxuICAgIHJldHVybiBbIHRzWzFdIF1cbiAgfVxuICB2YXIgZyA9IG5ldyBBcnJheSgyICogbilcbiAgdmFyIHEgPSBbMC4xLCAwLjFdXG4gIHZhciB0ID0gWzAuMSwgMC4xXVxuICB2YXIgY291bnQgPSAwXG4gIHR3b1Byb2R1Y3QoZVswXSwgc2NhbGUsIHEpXG4gIGlmKHFbMF0pIHtcbiAgICBnW2NvdW50KytdID0gcVswXVxuICB9XG4gIGZvcih2YXIgaT0xOyBpPG47ICsraSkge1xuICAgIHR3b1Byb2R1Y3QoZVtpXSwgc2NhbGUsIHQpXG4gICAgdmFyIHBxID0gcVsxXVxuICAgIHR3b1N1bShwcSwgdFswXSwgcSlcbiAgICBpZihxWzBdKSB7XG4gICAgICBnW2NvdW50KytdID0gcVswXVxuICAgIH1cbiAgICB2YXIgYSA9IHRbMV1cbiAgICB2YXIgYiA9IHFbMV1cbiAgICB2YXIgeCA9IGEgKyBiXG4gICAgdmFyIGJ2ID0geCAtIGFcbiAgICB2YXIgeSA9IGIgLSBidlxuICAgIHFbMV0gPSB4XG4gICAgaWYoeSkge1xuICAgICAgZ1tjb3VudCsrXSA9IHlcbiAgICB9XG4gIH1cbiAgaWYocVsxXSkge1xuICAgIGdbY291bnQrK10gPSBxWzFdXG4gIH1cbiAgaWYoY291bnQgPT09IDApIHtcbiAgICBnW2NvdW50KytdID0gMC4wXG4gIH1cbiAgZy5sZW5ndGggPSBjb3VudFxuICByZXR1cm4gZ1xufSIsIlwidXNlIHN0cmljdFwiXG5cbm1vZHVsZS5leHBvcnRzID0gcm9idXN0U3VidHJhY3RcblxuLy9FYXN5IGNhc2U6IEFkZCB0d28gc2NhbGFyc1xuZnVuY3Rpb24gc2NhbGFyU2NhbGFyKGEsIGIpIHtcbiAgdmFyIHggPSBhICsgYlxuICB2YXIgYnYgPSB4IC0gYVxuICB2YXIgYXYgPSB4IC0gYnZcbiAgdmFyIGJyID0gYiAtIGJ2XG4gIHZhciBhciA9IGEgLSBhdlxuICB2YXIgeSA9IGFyICsgYnJcbiAgaWYoeSkge1xuICAgIHJldHVybiBbeSwgeF1cbiAgfVxuICByZXR1cm4gW3hdXG59XG5cbmZ1bmN0aW9uIHJvYnVzdFN1YnRyYWN0KGUsIGYpIHtcbiAgdmFyIG5lID0gZS5sZW5ndGh8MFxuICB2YXIgbmYgPSBmLmxlbmd0aHwwXG4gIGlmKG5lID09PSAxICYmIG5mID09PSAxKSB7XG4gICAgcmV0dXJuIHNjYWxhclNjYWxhcihlWzBdLCAtZlswXSlcbiAgfVxuICB2YXIgbiA9IG5lICsgbmZcbiAgdmFyIGcgPSBuZXcgQXJyYXkobilcbiAgdmFyIGNvdW50ID0gMFxuICB2YXIgZXB0ciA9IDBcbiAgdmFyIGZwdHIgPSAwXG4gIHZhciBhYnMgPSBNYXRoLmFic1xuICB2YXIgZWkgPSBlW2VwdHJdXG4gIHZhciBlYSA9IGFicyhlaSlcbiAgdmFyIGZpID0gLWZbZnB0cl1cbiAgdmFyIGZhID0gYWJzKGZpKVxuICB2YXIgYSwgYlxuICBpZihlYSA8IGZhKSB7XG4gICAgYiA9IGVpXG4gICAgZXB0ciArPSAxXG4gICAgaWYoZXB0ciA8IG5lKSB7XG4gICAgICBlaSA9IGVbZXB0cl1cbiAgICAgIGVhID0gYWJzKGVpKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBiID0gZmlcbiAgICBmcHRyICs9IDFcbiAgICBpZihmcHRyIDwgbmYpIHtcbiAgICAgIGZpID0gLWZbZnB0cl1cbiAgICAgIGZhID0gYWJzKGZpKVxuICAgIH1cbiAgfVxuICBpZigoZXB0ciA8IG5lICYmIGVhIDwgZmEpIHx8IChmcHRyID49IG5mKSkge1xuICAgIGEgPSBlaVxuICAgIGVwdHIgKz0gMVxuICAgIGlmKGVwdHIgPCBuZSkge1xuICAgICAgZWkgPSBlW2VwdHJdXG4gICAgICBlYSA9IGFicyhlaSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYSA9IGZpXG4gICAgZnB0ciArPSAxXG4gICAgaWYoZnB0ciA8IG5mKSB7XG4gICAgICBmaSA9IC1mW2ZwdHJdXG4gICAgICBmYSA9IGFicyhmaSlcbiAgICB9XG4gIH1cbiAgdmFyIHggPSBhICsgYlxuICB2YXIgYnYgPSB4IC0gYVxuICB2YXIgeSA9IGIgLSBidlxuICB2YXIgcTAgPSB5XG4gIHZhciBxMSA9IHhcbiAgdmFyIF94LCBfYnYsIF9hdiwgX2JyLCBfYXJcbiAgd2hpbGUoZXB0ciA8IG5lICYmIGZwdHIgPCBuZikge1xuICAgIGlmKGVhIDwgZmEpIHtcbiAgICAgIGEgPSBlaVxuICAgICAgZXB0ciArPSAxXG4gICAgICBpZihlcHRyIDwgbmUpIHtcbiAgICAgICAgZWkgPSBlW2VwdHJdXG4gICAgICAgIGVhID0gYWJzKGVpKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhID0gZmlcbiAgICAgIGZwdHIgKz0gMVxuICAgICAgaWYoZnB0ciA8IG5mKSB7XG4gICAgICAgIGZpID0gLWZbZnB0cl1cbiAgICAgICAgZmEgPSBhYnMoZmkpXG4gICAgICB9XG4gICAgfVxuICAgIGIgPSBxMFxuICAgIHggPSBhICsgYlxuICAgIGJ2ID0geCAtIGFcbiAgICB5ID0gYiAtIGJ2XG4gICAgaWYoeSkge1xuICAgICAgZ1tjb3VudCsrXSA9IHlcbiAgICB9XG4gICAgX3ggPSBxMSArIHhcbiAgICBfYnYgPSBfeCAtIHExXG4gICAgX2F2ID0gX3ggLSBfYnZcbiAgICBfYnIgPSB4IC0gX2J2XG4gICAgX2FyID0gcTEgLSBfYXZcbiAgICBxMCA9IF9hciArIF9iclxuICAgIHExID0gX3hcbiAgfVxuICB3aGlsZShlcHRyIDwgbmUpIHtcbiAgICBhID0gZWlcbiAgICBiID0gcTBcbiAgICB4ID0gYSArIGJcbiAgICBidiA9IHggLSBhXG4gICAgeSA9IGIgLSBidlxuICAgIGlmKHkpIHtcbiAgICAgIGdbY291bnQrK10gPSB5XG4gICAgfVxuICAgIF94ID0gcTEgKyB4XG4gICAgX2J2ID0gX3ggLSBxMVxuICAgIF9hdiA9IF94IC0gX2J2XG4gICAgX2JyID0geCAtIF9idlxuICAgIF9hciA9IHExIC0gX2F2XG4gICAgcTAgPSBfYXIgKyBfYnJcbiAgICBxMSA9IF94XG4gICAgZXB0ciArPSAxXG4gICAgaWYoZXB0ciA8IG5lKSB7XG4gICAgICBlaSA9IGVbZXB0cl1cbiAgICB9XG4gIH1cbiAgd2hpbGUoZnB0ciA8IG5mKSB7XG4gICAgYSA9IGZpXG4gICAgYiA9IHEwXG4gICAgeCA9IGEgKyBiXG4gICAgYnYgPSB4IC0gYVxuICAgIHkgPSBiIC0gYnZcbiAgICBpZih5KSB7XG4gICAgICBnW2NvdW50KytdID0geVxuICAgIH0gXG4gICAgX3ggPSBxMSArIHhcbiAgICBfYnYgPSBfeCAtIHExXG4gICAgX2F2ID0gX3ggLSBfYnZcbiAgICBfYnIgPSB4IC0gX2J2XG4gICAgX2FyID0gcTEgLSBfYXZcbiAgICBxMCA9IF9hciArIF9iclxuICAgIHExID0gX3hcbiAgICBmcHRyICs9IDFcbiAgICBpZihmcHRyIDwgbmYpIHtcbiAgICAgIGZpID0gLWZbZnB0cl1cbiAgICB9XG4gIH1cbiAgaWYocTApIHtcbiAgICBnW2NvdW50KytdID0gcTBcbiAgfVxuICBpZihxMSkge1xuICAgIGdbY291bnQrK10gPSBxMVxuICB9XG4gIGlmKCFjb3VudCkge1xuICAgIGdbY291bnQrK10gPSAwLjAgIFxuICB9XG4gIGcubGVuZ3RoID0gY291bnRcbiAgcmV0dXJuIGdcbn0iLCJcInVzZSBzdHJpY3RcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmVhckV4cGFuc2lvblN1bVxuXG4vL0Vhc3kgY2FzZTogQWRkIHR3byBzY2FsYXJzXG5mdW5jdGlvbiBzY2FsYXJTY2FsYXIoYSwgYikge1xuICB2YXIgeCA9IGEgKyBiXG4gIHZhciBidiA9IHggLSBhXG4gIHZhciBhdiA9IHggLSBidlxuICB2YXIgYnIgPSBiIC0gYnZcbiAgdmFyIGFyID0gYSAtIGF2XG4gIHZhciB5ID0gYXIgKyBiclxuICBpZih5KSB7XG4gICAgcmV0dXJuIFt5LCB4XVxuICB9XG4gIHJldHVybiBbeF1cbn1cblxuZnVuY3Rpb24gbGluZWFyRXhwYW5zaW9uU3VtKGUsIGYpIHtcbiAgdmFyIG5lID0gZS5sZW5ndGh8MFxuICB2YXIgbmYgPSBmLmxlbmd0aHwwXG4gIGlmKG5lID09PSAxICYmIG5mID09PSAxKSB7XG4gICAgcmV0dXJuIHNjYWxhclNjYWxhcihlWzBdLCBmWzBdKVxuICB9XG4gIHZhciBuID0gbmUgKyBuZlxuICB2YXIgZyA9IG5ldyBBcnJheShuKVxuICB2YXIgY291bnQgPSAwXG4gIHZhciBlcHRyID0gMFxuICB2YXIgZnB0ciA9IDBcbiAgdmFyIGFicyA9IE1hdGguYWJzXG4gIHZhciBlaSA9IGVbZXB0cl1cbiAgdmFyIGVhID0gYWJzKGVpKVxuICB2YXIgZmkgPSBmW2ZwdHJdXG4gIHZhciBmYSA9IGFicyhmaSlcbiAgdmFyIGEsIGJcbiAgaWYoZWEgPCBmYSkge1xuICAgIGIgPSBlaVxuICAgIGVwdHIgKz0gMVxuICAgIGlmKGVwdHIgPCBuZSkge1xuICAgICAgZWkgPSBlW2VwdHJdXG4gICAgICBlYSA9IGFicyhlaSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYiA9IGZpXG4gICAgZnB0ciArPSAxXG4gICAgaWYoZnB0ciA8IG5mKSB7XG4gICAgICBmaSA9IGZbZnB0cl1cbiAgICAgIGZhID0gYWJzKGZpKVxuICAgIH1cbiAgfVxuICBpZigoZXB0ciA8IG5lICYmIGVhIDwgZmEpIHx8IChmcHRyID49IG5mKSkge1xuICAgIGEgPSBlaVxuICAgIGVwdHIgKz0gMVxuICAgIGlmKGVwdHIgPCBuZSkge1xuICAgICAgZWkgPSBlW2VwdHJdXG4gICAgICBlYSA9IGFicyhlaSlcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYSA9IGZpXG4gICAgZnB0ciArPSAxXG4gICAgaWYoZnB0ciA8IG5mKSB7XG4gICAgICBmaSA9IGZbZnB0cl1cbiAgICAgIGZhID0gYWJzKGZpKVxuICAgIH1cbiAgfVxuICB2YXIgeCA9IGEgKyBiXG4gIHZhciBidiA9IHggLSBhXG4gIHZhciB5ID0gYiAtIGJ2XG4gIHZhciBxMCA9IHlcbiAgdmFyIHExID0geFxuICB2YXIgX3gsIF9idiwgX2F2LCBfYnIsIF9hclxuICB3aGlsZShlcHRyIDwgbmUgJiYgZnB0ciA8IG5mKSB7XG4gICAgaWYoZWEgPCBmYSkge1xuICAgICAgYSA9IGVpXG4gICAgICBlcHRyICs9IDFcbiAgICAgIGlmKGVwdHIgPCBuZSkge1xuICAgICAgICBlaSA9IGVbZXB0cl1cbiAgICAgICAgZWEgPSBhYnMoZWkpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGEgPSBmaVxuICAgICAgZnB0ciArPSAxXG4gICAgICBpZihmcHRyIDwgbmYpIHtcbiAgICAgICAgZmkgPSBmW2ZwdHJdXG4gICAgICAgIGZhID0gYWJzKGZpKVxuICAgICAgfVxuICAgIH1cbiAgICBiID0gcTBcbiAgICB4ID0gYSArIGJcbiAgICBidiA9IHggLSBhXG4gICAgeSA9IGIgLSBidlxuICAgIGlmKHkpIHtcbiAgICAgIGdbY291bnQrK10gPSB5XG4gICAgfVxuICAgIF94ID0gcTEgKyB4XG4gICAgX2J2ID0gX3ggLSBxMVxuICAgIF9hdiA9IF94IC0gX2J2XG4gICAgX2JyID0geCAtIF9idlxuICAgIF9hciA9IHExIC0gX2F2XG4gICAgcTAgPSBfYXIgKyBfYnJcbiAgICBxMSA9IF94XG4gIH1cbiAgd2hpbGUoZXB0ciA8IG5lKSB7XG4gICAgYSA9IGVpXG4gICAgYiA9IHEwXG4gICAgeCA9IGEgKyBiXG4gICAgYnYgPSB4IC0gYVxuICAgIHkgPSBiIC0gYnZcbiAgICBpZih5KSB7XG4gICAgICBnW2NvdW50KytdID0geVxuICAgIH1cbiAgICBfeCA9IHExICsgeFxuICAgIF9idiA9IF94IC0gcTFcbiAgICBfYXYgPSBfeCAtIF9idlxuICAgIF9iciA9IHggLSBfYnZcbiAgICBfYXIgPSBxMSAtIF9hdlxuICAgIHEwID0gX2FyICsgX2JyXG4gICAgcTEgPSBfeFxuICAgIGVwdHIgKz0gMVxuICAgIGlmKGVwdHIgPCBuZSkge1xuICAgICAgZWkgPSBlW2VwdHJdXG4gICAgfVxuICB9XG4gIHdoaWxlKGZwdHIgPCBuZikge1xuICAgIGEgPSBmaVxuICAgIGIgPSBxMFxuICAgIHggPSBhICsgYlxuICAgIGJ2ID0geCAtIGFcbiAgICB5ID0gYiAtIGJ2XG4gICAgaWYoeSkge1xuICAgICAgZ1tjb3VudCsrXSA9IHlcbiAgICB9IFxuICAgIF94ID0gcTEgKyB4XG4gICAgX2J2ID0gX3ggLSBxMVxuICAgIF9hdiA9IF94IC0gX2J2XG4gICAgX2JyID0geCAtIF9idlxuICAgIF9hciA9IHExIC0gX2F2XG4gICAgcTAgPSBfYXIgKyBfYnJcbiAgICBxMSA9IF94XG4gICAgZnB0ciArPSAxXG4gICAgaWYoZnB0ciA8IG5mKSB7XG4gICAgICBmaSA9IGZbZnB0cl1cbiAgICB9XG4gIH1cbiAgaWYocTApIHtcbiAgICBnW2NvdW50KytdID0gcTBcbiAgfVxuICBpZihxMSkge1xuICAgIGdbY291bnQrK10gPSBxMVxuICB9XG4gIGlmKCFjb3VudCkge1xuICAgIGdbY291bnQrK10gPSAwLjAgIFxuICB9XG4gIGcubGVuZ3RoID0gY291bnRcbiAgcmV0dXJuIGdcbn0iLCJcInVzZSBzdHJpY3RcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IHR3b1Byb2R1Y3RcblxudmFyIFNQTElUVEVSID0gKyhNYXRoLnBvdygyLCAyNykgKyAxLjApXG5cbmZ1bmN0aW9uIHR3b1Byb2R1Y3QoYSwgYiwgcmVzdWx0KSB7XG4gIHZhciB4ID0gYSAqIGJcblxuICB2YXIgYyA9IFNQTElUVEVSICogYVxuICB2YXIgYWJpZyA9IGMgLSBhXG4gIHZhciBhaGkgPSBjIC0gYWJpZ1xuICB2YXIgYWxvID0gYSAtIGFoaVxuXG4gIHZhciBkID0gU1BMSVRURVIgKiBiXG4gIHZhciBiYmlnID0gZCAtIGJcbiAgdmFyIGJoaSA9IGQgLSBiYmlnXG4gIHZhciBibG8gPSBiIC0gYmhpXG5cbiAgdmFyIGVycjEgPSB4IC0gKGFoaSAqIGJoaSlcbiAgdmFyIGVycjIgPSBlcnIxIC0gKGFsbyAqIGJoaSlcbiAgdmFyIGVycjMgPSBlcnIyIC0gKGFoaSAqIGJsbylcblxuICB2YXIgeSA9IGFsbyAqIGJsbyAtIGVycjNcblxuICBpZihyZXN1bHQpIHtcbiAgICByZXN1bHRbMF0gPSB5XG4gICAgcmVzdWx0WzFdID0geFxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIHJldHVybiBbIHksIHggXVxufSIsIlwidXNlIHN0cmljdFwiXG5cbm1vZHVsZS5leHBvcnRzID0gZmFzdFR3b1N1bVxuXG5mdW5jdGlvbiBmYXN0VHdvU3VtKGEsIGIsIHJlc3VsdCkge1xuXHR2YXIgeCA9IGEgKyBiXG5cdHZhciBidiA9IHggLSBhXG5cdHZhciBhdiA9IHggLSBidlxuXHR2YXIgYnIgPSBiIC0gYnZcblx0dmFyIGFyID0gYSAtIGF2XG5cdGlmKHJlc3VsdCkge1xuXHRcdHJlc3VsdFswXSA9IGFyICsgYnJcblx0XHRyZXN1bHRbMV0gPSB4XG5cdFx0cmV0dXJuIHJlc3VsdFxuXHR9XG5cdHJldHVybiBbYXIrYnIsIHhdXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiBtb2R1bGVbJ2RlZmF1bHQnXSA6XG5cdFx0KCkgPT4gbW9kdWxlO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBtb2R1bGUgZXhwb3J0cyBtdXN0IGJlIHJldHVybmVkIGZyb20gcnVudGltZSBzbyBlbnRyeSBpbmxpbmluZyBpcyBkaXNhYmxlZFxuLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5yZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vbmV0di1sYXNzby1zZWxlY3Rpb24uanNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9