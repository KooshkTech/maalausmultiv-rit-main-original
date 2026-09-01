export class MaskLayer {
  readonly width: number;
  readonly height: number;
  readonly alpha: Uint8ClampedArray;

  constructor(width: number, height: number, alpha?: Uint8ClampedArray) {
    if (width <= 0 || height <= 0) throw new Error('MaskLayer dimensions must be positive.');
    this.width = width;
    this.height = height;
    const expected = width * height;
    if (alpha && alpha.length !== expected) throw new Error(`Mask alpha length ${alpha.length} does not match ${expected}.`);
    this.alpha = alpha ? new Uint8ClampedArray(alpha) : new Uint8ClampedArray(expected);
  }

  clone(): MaskLayer { return new MaskLayer(this.width, this.height, this.alpha); }
  clear(): void { this.alpha.fill(0); }
  isEmpty(): boolean { for(let i=0;i<this.alpha.length;i+=1) if(this.alpha[i]>0) return false; return true; }
  coverage(): number { let n=0; for(let i=0;i<this.alpha.length;i+=1) if(this.alpha[i]>0)n+=1; return n/this.alpha.length; }

  get(x: number, y: number): number {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return 0;
    return this.alpha[y * this.width + x];
  }

  set(x: number, y: number, value: number): void {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.alpha[y * this.width + x] = Math.max(0, Math.min(255, Math.round(value)));
  }

  union(other: MaskLayer): MaskLayer {
    this.assertCompatible(other);
    const out = new Uint8ClampedArray(this.alpha.length);
    for (let i = 0; i < out.length; i += 1) out[i] = Math.max(this.alpha[i], other.alpha[i]);
    return new MaskLayer(this.width, this.height, out);
  }

  intersect(other: MaskLayer): MaskLayer {
    this.assertCompatible(other);
    const out = new Uint8ClampedArray(this.alpha.length);
    for (let i = 0; i < out.length; i += 1) out[i] = Math.min(this.alpha[i], other.alpha[i]);
    return new MaskLayer(this.width, this.height, out);
  }

  subtract(other: MaskLayer): MaskLayer {
    this.assertCompatible(other);
    const out = new Uint8ClampedArray(this.alpha.length);
    for (let i = 0; i < out.length; i += 1) out[i] = Math.max(0, this.alpha[i] - other.alpha[i]);
    return new MaskLayer(this.width, this.height, out);
  }

  invert(): MaskLayer {
    const out = new Uint8ClampedArray(this.alpha.length);
    for(let i=0;i<out.length;i+=1) out[i]=255-this.alpha[i];
    return new MaskLayer(this.width,this.height,out);
  }

  toImageData(): ImageData {
    const rgba = new Uint8ClampedArray(this.alpha.length * 4);
    for (let i = 0; i < this.alpha.length; i += 1) {
      const a = this.alpha[i]; const p = i * 4;
      rgba[p] = 255; rgba[p + 1] = 255; rgba[p + 2] = 255; rgba[p + 3] = a;
    }
    return new ImageData(rgba, this.width, this.height);
  }

  toRle(): number[] {
    const out: number[] = [];
    if (!this.alpha.length) return out;
    let current = this.alpha[0], count = 1;
    for (let i = 1; i < this.alpha.length; i += 1) {
      if (this.alpha[i] === current) count += 1;
      else { out.push(current, count); current = this.alpha[i]; count = 1; }
    }
    out.push(current, count);
    return out;
  }

  static fromRle(width: number, height: number, rle: number[]): MaskLayer {
    const alpha = new Uint8ClampedArray(width * height);
    let cursor = 0;
    for (let i = 0; i < rle.length; i += 2) {
      const value = rle[i] ?? 0; const count = rle[i + 1] ?? 0;
      alpha.fill(value, cursor, Math.min(alpha.length, cursor + count)); cursor += count;
      if (cursor >= alpha.length) break;
    }
    return new MaskLayer(width, height, alpha);
  }

  private assertCompatible(other: MaskLayer): void {
    if (other.width !== this.width || other.height !== this.height) throw new Error('MaskLayer dimensions must match.');
  }
}
