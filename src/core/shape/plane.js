import { Vec3 } from '../math/vec3.js';

/**
 * @import { Ray } from './ray.js'
 */

/**
 * An infinite plane. Internally it's represented in a parametric equation form:
 * ax + by + cz + distance = 0.
 *
 * @category Math
 */
class Plane {
    /**
     * The normal of the plane.
     *
     * @type {Vec3}
     */
    normal = new Vec3();

    /**
     * The distance from the plane to the origin, along its normal.
     *
     * @type {number}
     */
    distance;

    /**
     * Create a new Plane instance.
     *
     * @param {Vec3} [normal] - Normal of the plane. The constructor copies this parameter. Defaults
     * to {@link Vec3.UP}.
     * @param {number} [distance] - The distance from the plane to the origin, along its normal.
     * Defaults to 0.
     */
    constructor(normal = Vec3.UP, distance = 0) {
        this.normal.copy(normal);
        this.distance = distance;
    }

    /**
     * Returns a clone of the specified plane.
     *
     * @returns {this} A duplicate plane.
     */
    clone() {
        /** @type {this} */
        const cstr = this.constructor;
        return new cstr().copy(this);
    }

    /**
     * Copies the contents of a source plane to a destination plane.
     *
     * @param {Plane} src - A source plane to copy to the destination plane.
     * @returns {Plane} Self for chaining.
     */
    copy(src) {
        this.normal.copy(src.normal);
        this.distance = src.distance;
        return this;
    }

    /**
     * Test if the plane intersects between two points.
     *
     * @param {Vec3} start - Start position of line.
     * @param {Vec3} end - End position of line.
     * @param {Vec3} [point] - If there is an intersection, the intersection point will be copied
     * into here.
     * @returns {boolean} True if there is an intersection.
     */
    intersectsLine(start, end, point) {
        const d = this.distance;
        const d0 = this.normal.dot(start) + d;
        const d1 = this.normal.dot(end) + d;

        const t = d0 / (d0 - d1);
        const intersects = t >= 0 && t <= 1;
        if (intersects && point)
            point.lerp(start, end, t);

        return intersects;
    }

    /**
     * Test if a ray intersects with the infinite plane.
     *
     * @param {Ray} ray - Ray to test against (direction must be normalized).
     * @param {Vec3} [point] - If there is an intersection, the intersection point will be copied
     * into here.
     * @returns {boolean} True if there is an intersection.
     */
    intersectsRay(ray, point) {
        const denominator = this.normal.dot(ray.direction);
        if (denominator === 0)
            return false;

        const t = -(this.normal.dot(ray.origin) + this.distance) / denominator;
        if (t >= 0 && point) {
            point.copy(ray.direction).mulScalar(t).add(ray.origin);
        }

        return t >= 0;
    }

    /**
     * Normalize the plane.
     *
     * @returns {Plane} Self for chaining.
     */
    normalize() {
        const invLength = 1 / this.normal.length();
        this.normal.mulScalar(invLength);
        this.distance *= invLength;
        return this;
    }

    /**
     * Sets the plane based on a normal and a distance from the origin.
     *
     * @param {number} nx - The x-component of the normal.
     * @param {number} ny - The y-component of the normal.
     * @param {number} nz - The z-component of the normal.
     * @param {number} d - The distance from the origin.
     * @returns {Plane} Self for chaining.
     */
    set(nx, ny, nz, d) {
        this.normal.set(nx, ny, nz);
        this.distance = d;
        return this;
    }

    /**
     * Sets the plane based on a specified normal and a point on the plane.
     *
     * @param {Vec3} point - The point on the plane.
     * @param {Vec3} normal - The normal of the plane.
     * @returns {Plane} Self for chaining.
     */
    setFromPointNormal(point, normal) {
        this.normal.copy(normal);
        this.distance = -this.normal.dot(point);
        return this;
    }
}

export { Plane };
