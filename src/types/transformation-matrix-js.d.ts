declare module "transformation-matrix-js" {
  const Matrix = class Matrix {
    constructor(context: CanvasRenderingContext2D, element: HTMLElement);

    concat(matrix: Matrix): Matrix;

    flipX(): Matrix;

    flipY(): Matrix;

    reflectVector(x: number, y: number): Matrix;

    reset(): Matrix;

    rotate(angle: number): Matrix;

    rotateFromVector(x: number, y: number): Matrix;

    rotateDeg(angle: number): Matrix;

    scaleU(scale: number): Matrix;

    scale: (x: number, y: number) => Matrix;

    scaleX(scale: number): Matrix;

    scaleY(scale: number): Matrix;

    scaleFromVector(x: number, y: number): Matrix;

    shear(sx: number, sy: number): Matrix;

    shearX(sx: number): Matrix;

    shearY(sy: number): Matrix;

    skew(ax: number, ay: number): Matrix;

    skewDeg(ax: number, ay: number): Matrix;

    skewX(ax: number): Matrix;

    skewY(ay): Matrix;

    setTransform(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ): Matrix;

    translate(tx: number, ty: number): Matrix;

    translateX(tx: number): Matrix;

    translateY(ty: number): Matrix;

    transform(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ): Matrix;

    multiply(matrix: Matrix): Matrix;

    divide(matrix: Matrix): Matrix;

    divideScalar(scalar: number): Matrix;

    inverse(cloneContext?: boolean, cloneDom?: boolean): Matrix;

    interpolate(
      matrix: Matrix,
      t: number,
      context: CanvasRenderingContext2D
    ): Matrix;

    clone(noContext?: boolean): Matrix;

    applyToPoint(x: number, y: number): Matrix;

    applyToArray(points: { x: number; y: number }[] | number[]): number[];

    toArray(): number[];

    static from(
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number
    ): Matrix;
    static from(m: Matrix): Matrix;
    static from(m: Matrix, ctx: CanvasRenderingContext2D): Matrix;
  };

  export type IMatrix = Matrix & {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
  };
  export { Matrix };
}
